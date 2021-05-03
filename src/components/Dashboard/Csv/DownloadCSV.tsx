import React, {useEffect, useState, useContext} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import API, {graphqlOperation} from '@aws-amplify/api';
import * as customQueries from '../../../customGraphql/customQueries';
import Selector from '../../Atoms/Form/Selector';
import {createFilterToFetchSpecificItemsOnly} from '../../../utilities/strings';
import {CSVLink} from 'react-csv';

interface DownloadCSV {}

const DownloadCSV = (props: DownloadCSV) => {
  const {state, dispatch} = useContext(GlobalContext);

  const [institutions, setInstitutions] = useState([]);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  // list of classrooms for dropdown
  const [classrooms, setClassrooms] = useState([]);
  // list of classrooms holding classroom data like class and curriculum
  const [selectedInstituteClassrooms, setSelectedInstituteClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const [classStudents, setClassStudents] = useState([]);

  /* Institution methods */

  useEffect(() => {
    listInstitutions();
  }, []);

  useEffect(() => {
    if (selectedInstitute) {
      fetchClassRooms(selectedInstitute.id);
    }
  }, [selectedInstitute]);

  const listInstitutions = async () => {
    let institutions: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionsList)
    );
    institutions = institutions?.data.listInstitutions?.items || [];
    institutions = institutions.map((inst: any) => {
      return {
        id: inst.id,
        name: inst.name,
        value: inst.name,
      };
    });
    setInstitutions(institutions);
  };
  const onInstSelect = async (inst: {id: string; name: string; value: string}) => {
    if (!selectedInstitute || selectedInstitute.id !== inst.id) {
      setSelectedInstitute(inst);
      clearClassrooms();
    }
  };

  /* ClassRooms methods */

  const fetchClassRooms = async (instId: string) => {
    let classrooms: any = await API.graphql(
      graphqlOperation(customQueries.getInstClassRooms, {id: instId})
    );
    classrooms = classrooms?.data.getInstitution?.rooms?.items || [];
    let classroomsList: {id: string; name: string; value: string}[] = [];
    const selectedInstitutionClassRooms: any = classrooms.map((cr: any) => {
      let curriculum =
        cr.curricula?.items && Array.isArray(cr.curricula?.items)
          ? cr.curricula?.items[0].curriculum
          : null;
      classroomsList.push({id: cr.id, name: cr.name, value: cr.name});
      return {id: cr.id, name: cr.name, value: cr.name, class: {...cr.class}, curriculum};
    });
    setSelectedInstituteClassrooms(selectedInstitutionClassRooms);
    setClassrooms(classroomsList);
  };

  const clearClassrooms = async () => {
    setSelectedClassroom(null);
    setSelectedInstituteClassrooms([]);
    setClassrooms([]);
  };

  const onClassroomSelect = async (classroom: {
    id: string;
    name: string;
    value: string;
  }) => {
    if (!selectedClassroom || selectedClassroom.id !== classroom.id) {
      setSelectedClassroom(classroom);
    }
  };

  useEffect(() => {
    if (selectedClassroom) {
      let selectedInstituteClassroom = selectedInstituteClassrooms.filter(
        (cr: any) => cr.id === selectedClassroom.id
      )[0];
      let sClass: {id: string; name: string} = {
        id: selectedInstituteClassroom.class.id,
        name: selectedInstituteClassroom.class.name,
      };
      let sCurriculum: {id: string; name: string} = {
        id: selectedInstituteClassroom.curriculum.id,
        name: selectedInstituteClassroom.curriculum.name,
      };
      setSelectedClass(sClass);
      setSelectedCurriculum(sCurriculum);
    }
  }, [selectedClassroom]);

  /* Class methods */
  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass.id);
    }
  }, [selectedClass]);

  const fetchClassStudents = async (classId: string) => {
    let classData: any = await API.graphql(
      graphqlOperation(customQueries.fetchClassStudents, {
        id: classId,
      })
    );
    let students = classData?.data?.getClass?.students?.items || [];
    let classStudents = students.map((stu: any) => {
      return stu.student;
    });
    setClassStudents(classStudents);
  };

  // race condition.
  // need to fetch demographics questions when both students and list units are fetched.
  // list of units becuase it is fetched by getCurriculum which also brings list of checkpoints.

  return (
    <>
      <div>CSV</div>
      <div>
        <span> Select institute </span>
        <Selector
          selectedItem={selectedInstitute ? selectedInstitute.name : ''}
          placeholder="Select institute"
          list={institutions}
          onChange={(value, name, id) => onInstSelect({id, name, value})}
        />
      </div>
      <div>
        <span> Select class room </span>
        <Selector
          selectedItem={selectedClassroom ? selectedClassroom.name : ''}
          placeholder="select class room"
          list={classrooms}
          onChange={(value, name, id) => onClassroomSelect({id, name, value})}
        />
      </div>
      {selectedClass ? <div>Selected Class: {selectedClass.name}</div> : null}
      {selectedCurriculum ? (
        <div>Selected Curriculum: {selectedCurriculum.name}</div>
      ) : null}
    </>
  );
};

export default DownloadCSV;
