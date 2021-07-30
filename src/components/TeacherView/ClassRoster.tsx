import React, {useState, useContext, useEffect} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoMdRefresh} from 'react-icons/io';

import useDictionary from '../../customHooks/dictionary';
import {GlobalContext} from '../../contexts/GlobalContext';
import RosterRow from './ClassRoster/RosterRow';

import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';

import API, {graphqlOperation} from '@aws-amplify/api';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';
import {useParams} from 'react-router-dom';

interface classRosterProps {
  handleUpdateSyllabusLesson: () => Promise<void>;
  handleShareStudentData: () => Promise<void>;
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  handlePageChange?: any;
  handleRoomUpdate?: (payload: any) => void;
}

const ClassRoster = (props: classRosterProps) => {
  // Essentials
  const {
    handleShareStudentData,
    isSameStudentShared,
    handleQuitShare,
    handleQuitViewing,
    handlePageChange,
    handleRoomUpdate,
  } = props;
  const {lessonState, lessonDispatch, controlState, controlDispatch} = useContext(
    GlobalContext
  );
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {lessonPlannerDict} = useDictionary(clientKey);
  const urlParams: any = useParams();
  const getRoomData = getLocalStorageData('room_info');

  // ##################################################################### //
  // ########################### LOADING STATE ########################### //
  // ##################################################################### //
  const [loading, setLoading] = useState<boolean>(false);

  // ##################################################################### //
  // ############################ ALL STUDENTS ########################### //
  // ##################################################################### //
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [personLocationStudents, setPersonLocationStudents] = useState<any[]>([]);
  const [updatedStudent, setUpdatedStudent] = useState<any>({});
  const [viewedStudent, setViewedStudent] = useState<string>('');

  let subscription: any;

  // ~~~~~~~~~~~~~~ INITIALIZE ~~~~~~~~~~~~~ //
  useEffect(() => {
    if (Object.keys(getRoomData).length > 0 && getRoomData.hasOwnProperty('classID')) {
      getClassStudents(getRoomData?.classID);
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      setViewedStudent('');
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: ''},
      });
      setLocalStorageData('room_info', {...getRoomData, studentViewing: ''});
    };
  }, []);

  // ##################################################################### //
  // ########################## GETTING STUDENTS ######################### //
  // ##################################################################### //

  // ~~~~~~~~~ FETCH CLASS STUDENTS ~~~~~~~~ //
  const getClassStudents = async (sessionClassID: string) => {
    try {
      const classStudents: any = await API.graphql(
        graphqlOperation(queries.listClassStudents, {
          filter: {classID: {contains: sessionClassID}},
        })
      );
      const classStudentList = classStudents.data.listClassStudents.items;
      const initClassStudentList = classStudentList.map((student: any) => {
        return {
          id: '',
          personAuthID: student.studentAuthID,
          personEmail: student.studentEmail,
          syllabusLessonID: '',
          roomID: '',
          currentLocation: '',
          lessonProgress: '',
          person: student.student,
          syllabusLesson: {},
          room: '',
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
          saveType: '',
        };
      });
      setClassStudents(initClassStudentList);
      controlDispatch({
        type: 'UPDATE_STUDENT_ROSTER',
        payload: {students: initClassStudentList},
      });
    } catch (e) {
      console.error('getClassStudents - ', e);
    }
  };

  // ~~~~ FETCH STUDENTS IN THIS LESSON ~~~~ //

  const {lessonID} = urlParams;

  const getSyllabusLessonStudents = async () => {
    setLoading(true);
    try {
      const syllabusLessonStudents: any = await API.graphql(
        graphqlOperation(queries.listPersonLocations, {
          syllabusLessonID: getRoomData.activeSyllabus,
          lessonID: lessonID,
          roomID: getRoomData.id,
        })
      );
      const syllabusLessonStudentList =
        syllabusLessonStudents.data.listPersonLocations.items;
      const studentsFromThisClass = syllabusLessonStudentList.filter((student: any) => {
        const findStudentInClasslist = classStudents.find(
          (student2: any) => student2.personEmail === student.personEmail
        );
        if (findStudentInClasslist) {
          return findStudentInClasslist;
        }
      });
      setPersonLocationStudents(studentsFromThisClass);
      controlDispatch({
        type: 'UPDATE_STUDENT_ROSTER',
        payload: {students: studentsFromThisClass},
      });
      subscription = subscribeToPersonLocations();
    } catch (e) {
      console.error('getSyllabusLessonstudents - ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonState.universalLessonID && controlState.roster.length === 0) {
      getSyllabusLessonStudents();
    }
  }, [lessonState.universalLessonID]);

  // ##################################################################### //
  // #################### SUBSCRIBE TO LOCATION CHANGE ################### //
  // ##################################################################### //
  const subscribeToPersonLocations = () => {
    // @ts-ignore
    const personLocationSubscription = API.graphql(
      graphqlOperation(subscriptions.onChangePersonLocation, {
        syllabusLessonID: getRoomData.activeSyllabus,
        lessonID: lessonID,
        roomID: getRoomData.id,
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onChangePersonLocation;

        console.log('new location: ', updatedStudent);
        setUpdatedStudent(updatedStudent);
      },
    });
    return personLocationSubscription;
  };

  // ~~~~~~~~~~~~ UPDATE ROSTER ~~~~~~~~~~~~ //
  useEffect(() => {
    const updateStudentRoster = (newStudent: any) => {
      const studentExists =
        personLocationStudents.filter(
          (student: any) => student.personAuthID === newStudent.personAuthID
        ).length > 0;

      if (studentExists) {
        // console.log('student exists YES', ' --> update loc')
        const existRoster = personLocationStudents.map((student: any) => {
          if (student.personAuthID === newStudent.personAuthID) {
            return {...student, currentLocation: newStudent.currentLocation};
          } else {
            return student;
          }
        });
        setPersonLocationStudents(existRoster);
        controlDispatch({
          type: 'UPDATE_STUDENT_ROSTER',
          payload: {students: existRoster},
        });
        setUpdatedStudent({});
      } else {
        // console.log('student exists NO', ' --> update loc')
        const newRoster = [...personLocationStudents, newStudent];
        setPersonLocationStudents(newRoster);
        controlDispatch({type: 'UPDATE_STUDENT_ROSTER', payload: {students: newRoster}});
        setUpdatedStudent({});
      }
    };
    if (Object.keys(updatedStudent).length) {
      updateStudentRoster(updatedStudent);
    }
  }, [updatedStudent]);

  // ##################################################################### //
  // ########################### FUNCTIONALITY ########################### //
  // ##################################################################### //
  const handleSelect = async (e: any) => {
    const {id} = e.target;

    if (lessonState.studentViewing === id) {
      setViewedStudent('');
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: ''},
      });
      setLocalStorageData('room_info', {...getRoomData, studentViewing: ''});
      await handleRoomUpdate({id: getRoomData.id, studentViewing: ''});
    } else {
      setViewedStudent(id);
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: id},
      });
      setLocalStorageData('room_info', {...getRoomData, studentViewing: id});
      await handleRoomUpdate({id: getRoomData.id, studentViewing: id});
    }
  };

  // ~~~~~~~~~~~~~~~ CLEAN UP ~~~~~~~~~~~~~~ //
  useEffect(() => {
    if (lessonState.studentViewing === '' && viewedStudent !== '') {
      setViewedStudent('');
    }
  }, [lessonState.studentViewing]);

  const handleManualRefresh = () => {
    if (loading === false) {
      getSyllabusLessonStudents();
    }
  };

  const inactiveStudents = classStudents.filter((student: any) => {
    const isInStateRoster = controlState.roster.find(
      (studentTarget: any) => studentTarget.personAuthID === student.personAuthID
    );
    if (isInStateRoster === undefined) {
      return student;
    }
  });

  return (
    <div
      className={`w-full h-full bg-light-gray bg-opacity-20 overflow-y-auto overflow-x-hidden`}>
      {/* TABLE HEAD */}
      <div
        className={`w-full h-8 flex py-2 pl-2 pr-1 text-white bg-darker-gray bg-opacity-40`}>
        <div
          className={`w-3.5/10 relative mx-2 flex items-center hover:underline cursor-pointer text-xs`}>
          <span>{lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['ONE']}</span>
          <span
            className={`w-auto absolute right-0 translate-x-4`}
            onClick={handleManualRefresh}>
            <IconContext.Provider value={{color: '#EDF2F7'}}>
              <IoMdRefresh size={28} className={`${loading ? 'animate-spin' : null}`} />
            </IconContext.Provider>
          </span>
        </div>
        <div
          className={`w-3.5/10 mx-2 flex items-center overflow-hidden text-center text-xs `}>
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['TWO']}
        </div>
        <div
          className={`w-2/10 mx-2 flex items-center justify-center rounded-lg text-xs`}>
          {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['THREE']}
        </div>
      </div>

      {/* ROWS */}
      <div className={`w-full flex flex-col items-center`}>
        {controlState.roster.length > 0 ? (
          <div
            className={`w-full pl-4 text-xs font-semibold text-white bg-medium-gray bg-opacity-20`}>
            {
              lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION'][
                'IN_CLASS'
              ]
            }
          </div>
        ) : null}

        {/* STUDENTS - Active */}
        {controlState.roster.length > 0
          ? controlState.roster.map((student: any, key: number) => (
              <RosterRow
                key={key}
                keyProp={key}
                number={key}
                id={student.personAuthID}
                active={true}
                firstName={student.person.firstName}
                lastName={student.person.lastName}
                preferredName={student.person.preferredName}
                role={student.person.role}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleSelect={handleSelect}
                handleShareStudentData={handleShareStudentData}
                handleQuitShare={handleQuitShare}
                handleQuitViewing={handleQuitViewing}
                viewedStudent={viewedStudent}
                setViewedStudent={setViewedStudent}
                isSameStudentShared={isSameStudentShared}
                handlePageChange={handlePageChange}
              />
            ))
          : null}

        {/* STUDENTS - INActive */}
        {inactiveStudents.length > 0 ? (
          <div
            className={`w-full pl-4 text-xs font-semibold text-white bg-medium-gray bg-opacity-20`}>
            {
              lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION'][
                'NOT_IN_CLASS'
              ]
            }
          </div>
        ) : null}
        {inactiveStudents.length > 0
          ? inactiveStudents.map((student: any, key: number) => (
              <RosterRow
                key={key}
                keyProp={key}
                number={key}
                id={student.personAuthID}
                active={false}
                firstName={student.person.firstName}
                lastName={student.person.lastName}
                preferredName={student.person.preferredName}
                role={student.person.role}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleSelect={handleSelect}
                handleShareStudentData={handleShareStudentData}
                handleQuitShare={handleQuitShare}
                handleQuitViewing={handleQuitViewing}
                viewedStudent={viewedStudent}
                setViewedStudent={setViewedStudent}
                isSameStudentShared={isSameStudentShared}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default ClassRoster;
