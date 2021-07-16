import React, {useContext, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';

import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';

import * as customQueries from '../../../../../../customGraphql/customQueries';

import Accordion from '../../../../../Atoms/Accordion';
import Buttons from '../../../../../Atoms/Buttons';
import Loader from '../../../../../Atoms/Loader';
import Modal from '../../../../../Atoms/Modal';
import PageWrapper from '../../../../../Atoms/PageWrapper';

import DetailTable from './DetailTable';
import AddCourse from './AddCourse';

interface ILessonCourseProps {
  curriculumList: any[];
  fetchCurriculum: () => void;
  institution: any;
  lessonId: string;
  lessonType: string;
  lessonPlans: any[];
  loading: boolean;
  selectedCurriculums: any[];
}

const LessonCourse = ({
  curriculumList,
  fetchCurriculum,
  institution,
  lessonId,
  lessonType,
  lessonPlans,
  loading,
  selectedCurriculums,
}: ILessonCourseProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {UnitLookupDict} = useDictionary(clientKey);
  const [addModalShow, setAddModalShow] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  // const [curriculumList, setCurriculumList] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);

  useEffect(() => {
    fetchCurriculum();
  }, [institution]);

  useEffect(() => {
    setSelectedCurriculumList(selectedCurriculums);
  }, [selectedCurriculums]);

  // const fetchCurriculum = async () => {
  //   try {
  //     setLoading(true);
  //     const list: any = await API.graphql(
  //       graphqlOperation(customQueries.listCurriculumsForLessons, {
  //         filter: {
  //           institutionID: {eq: institution?.id},
  //         },
  //       })
  //     );
  //     const curriculums = list.data?.listCurriculums?.items;
  //     setCurriculumList(curriculums);
  //     let selectedCurriculums: any = [];
  //     curriculums.map((curriculum: any) => {
  //       const assignedSyllabi = curriculum.universalSyllabus?.items.filter(
  //         (syllabus: any) =>
  //           syllabus.lessons?.items.filter((lesson: any) => lesson.lessonID === lessonId)
  //             .length
  //       );
  //       const isCourseAdded = Boolean(assignedSyllabi.length);
  //       if (isCourseAdded) {
  //         selectedCurriculums.push({
  //           ...curriculum,
  //           assignedSyllabi: assignedSyllabi.map((syllabus: any) => syllabus.name),
  //           assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id),
  //         });
  //       }
  //     });
  //     setSelectedCurriculumList(selectedCurriculums);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  const fetchClassRoomDetails = async (curricularId: string) => {
    // const result = await API.graphql(
    //   graphqlOperation(queries.listRoomCurriculums, {
    //     filter: {
    //       curriculumID: {eq: curricularId},
    //     },
    //   })
    // );
    // console.log(result, 'result++++++');
    setRoomLoading(true);
    const classroomsResult: any = await API.graphql(
      graphqlOperation(customQueries.getInstClassRooms, {id: institution?.id})
    );
    const classRooms = classroomsResult?.data.getInstitution?.rooms.items;
    setSelectedCurriculumList((prevSelectedCurriculums) =>
      prevSelectedCurriculums.map((selectedCurriculum) => {
        const associatedClassRoomData = classRooms.filter(
          (classRoom: any) =>
            classRoom.curricula.items.filter(
              (e: any) => e.curriculumID === selectedCurriculum.id
            ).length
        );
        selectedCurriculum.associatedClassRoomData = associatedClassRoomData;
        return selectedCurriculum;
      })
    );
    setRoomLoading(false);
  };

  const onAddModalClose = () => {
    setAddModalShow(false);
    fetchCurriculum();
  };

  const renderTableView = (curriculum: any) => {
    return <DetailTable curriculum={curriculum} loading={roomLoading} />;
  };
  const titleList = selectedCurriculumList.map((curriculum, index) => ({
    id: index,
    title: curriculum.name,
    content: renderTableView(curriculum),
    uniqueId: curriculum.id,
  }));

  return (
    <div className="flex m-auto justify-center">
      <div className="">
        <PageWrapper defaultClass="px-8 border-0 border-gray-200">
          <div className="flex justify-end w-full m-auto ">
            <Buttons
              btnClass="mx-4"
              label={
                'Add Lesson to Syllabus'
                // LessonBuilderDict[userLanguage]['LESSON_CLASSROOM_ACTIVITY_TABLE'][
                //   'ADD_NEW_ACTIVITY'
                // ]
              }
              onClick={() => setAddModalShow(true)}
            />
          </div>
          {loading ? (
            <div className="mt-4">
              <Loader />
            </div>
          ) : titleList.length ? (
            <div className="w-full flex justify-between border-b-0 border-gray-200 mt-8">
              <Accordion
                titleList={titleList}
                actionOnAccordionClick={fetchClassRoomDetails}
              />
            </div>
          ) : (
            <div className="text-center p-16 mt-4">
              <p className="text-gray-600 font-medium">
                {UnitLookupDict[userLanguage]['NOTADDED']}
              </p>
            </div>
          )}
        </PageWrapper>
        {addModalShow && (
          <Modal
            showHeader
            showFooter={false}
            showHeaderBorder
            title={'Add Lesson to Syllabus'}
            closeOnBackdrop
            closeAction={onAddModalClose}>
            <div className="min-w-256">
              <AddCourse
                curriculumList={curriculumList}
                institutionID={institution?.id}
                lessonId={lessonId}
                lessonType={lessonType}
                lessonPlans={lessonPlans}
                selectedCurriculumList={selectedCurriculumList}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LessonCourse;
