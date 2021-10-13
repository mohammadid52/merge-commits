import API, {graphqlOperation} from '@aws-amplify/api';
import useLessonControls from '@customHooks/lessonControls';
import usePrevious from '@customHooks/previousProps';
import {access} from 'fs';
import React, {useContext, useEffect, useState} from 'react';
import {IoMdRefresh} from 'react-icons/io';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useParams} from 'react-router-dom';
import {GlobalContext} from '../../contexts/GlobalContext';
import useDictionary from '../../customHooks/dictionary';
import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';
import {getLocalStorageData, setLocalStorageData} from '../../utilities/localStorage';
import RosterRow from './ClassRoster/RosterRow';

interface IClassRosterProps {
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  handlePageChange?: any;
  handleRoomUpdate?: (payload: any) => void;
}

const ClassRoster = ({handlePageChange, handleRoomUpdate}: IClassRosterProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const controlState = gContext.controlState;
  const controlDispatch = gContext.controlDispatch;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;

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
  const [deletedStudent, setDeletedStudent] = useState<any>({});

  let subscription: any;
  let deleteSubscription: any;

  // ~~~~~~~~~~~~~~ INITIALIZE ~~~~~~~~~~~~~ //

  useEffect(() => {
    if (Object.keys(getRoomData).length > 0 && getRoomData.hasOwnProperty('classID')) {
      getClassStudents(getRoomData?.classID);
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (deleteSubscription) {
        deleteSubscription.unsubscribe();
      }
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: ''},
      });
      setLocalStorageData('room_info', {
        ...getRoomData,
        studentViewing: '',
        displayData: [{studentAuthID: '', lessonPageID: ''}],
      });
    };
  }, []);

  // ##################################################################### //
  // #################### SUBSCRIBE TO LOCATION CHANGE ################### //
  // ##################################################################### //

  // ~~~~~~ SUBSCRIBE :: CREATE/UPDATE ~~~~~ //

  const subscribeToPersonLocations = () => {
    // @ts-ignore
    const personLocationSub = API.graphql(
      graphqlOperation(subscriptions.onCreateUpdatePersonLocationItem, {
        syllabusLessonID: getRoomData.activeSyllabus,
        lessonID: lessonID,
        roomID: getRoomData.id,
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onCreateUpdatePersonLocationItem;

        console.log('new create update location: ', updatedStudent);
        setUpdatedStudent(updatedStudent);
      },
    });
    return personLocationSub;
  };

  // ~~~~~~~~~ SUBSCRIBE :: DELETE ~~~~~~~~~ //

  const subscribeToDeletePersonLocations = () => {
    // @ts-ignore
    const personLocationDeleteSub = API.graphql(
      graphqlOperation(subscriptions.onDeletePersonLocationItem, {
        syllabusLessonID: getRoomData.activeSyllabus,
        lessonID: lessonID,
        roomID: getRoomData.id,
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const deletedStudent = locationData.value.data.onDeletePersonLocationItem;

        console.log('deleted location: ', deletedStudent);
        setDeletedStudent(deletedStudent);
      },
    });
    return personLocationDeleteSub;
  };

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
          filter: {
            syllabusLessonID: {eq: getRoomData.activeSyllabus},
            lessonID: {eq: lessonID},
            roomID: {eq: getRoomData.id},
          },
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
      // console.log('studentsFromThisClass - ', studentsFromThisClass);
      setPersonLocationStudents(studentsFromThisClass);
      controlDispatch({
        type: 'UPDATE_STUDENT_ROSTER',
        payload: {students: studentsFromThisClass},
      });
      subscription = subscribeToPersonLocations();
      deleteSubscription = subscribeToDeletePersonLocations();
    } catch (e) {
      console.error('getSyllabusLessonstudents - ', e);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (classStudents.length > 0) {
      getSyllabusLessonStudents();
    }
  }, [classStudents]);

  // ##################################################################### //
  // ####################### ROSTER UPDATE / DELETE ###################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~ UPDATE ROSTER ~~~~~~~~~~~~ //

  const updateStudentRoster = (newStudent: any) => {
    const studentExists =
      personLocationStudents.filter(
        (student: any) => student.personAuthID === newStudent.personAuthID
      ).length > 0;

    if (studentExists) {
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
      const newRoster = [...personLocationStudents, newStudent];
      setPersonLocationStudents(newRoster);
      controlDispatch({type: 'UPDATE_STUDENT_ROSTER', payload: {students: newRoster}});
      setUpdatedStudent({});
    }
  };

  useEffect(() => {
    if (Object.keys(updatedStudent).length) {
      updateStudentRoster(updatedStudent);
    }
  }, [updatedStudent]);

  // ~~~~~~~~~~~~ DELETE ROSTER ~~~~~~~~~~~~ //

  const deleteStudentRoster = (deleteStudent: any) => {
    const studentExists =
      personLocationStudents.filter(
        (student: any) => student.personAuthID === deleteStudent.personAuthID
      ).length > 0;

    if (studentExists) {
      const deleteRoster = personLocationStudents.reduce(
        (rosterAcc: any[], student: any) => {
          if (student.personAuthID === deleteStudent.personAuthID) {
            return rosterAcc;
          } else {
            return [...rosterAcc, student];
          }
        },
        []
      );
      setPersonLocationStudents(deleteRoster);
      controlDispatch({
        type: 'UPDATE_STUDENT_ROSTER',
        payload: {students: deleteRoster},
      });
      setDeletedStudent({});
    } else {
      //
    }
  };

  useEffect(() => {
    if (Object.keys(deletedStudent).length) {
      deleteStudentRoster(deletedStudent);
    }
  }, [deletedStudent]);

  // ##################################################################### //
  // ########################### FUNCTIONALITY ########################### //
  // ##################################################################### //

  const viewedStudent = lessonState?.studentViewing;
  const sharedStudent = lessonState?.displayData[0]?.studentAuthID;

  const {resetViewAndShare} = useLessonControls();

  // ~~~~~~~~~~~~~~~ VIEWING ~~~~~~~~~~~~~~~ //

  const handleViewStudentData = async (idStr: string) => {
    if (viewedStudent === idStr) {
      await resetViewAndShare();
    } else {
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: idStr},
      });
      setLocalStorageData('room_info', {...getRoomData, studentViewing: idStr});
      await handleRoomUpdate({id: getRoomData.id, studentViewing: idStr});
    }
  };

  // ~~~~~~~~~~~~~~~ SHARING ~~~~~~~~~~~~~~~ //

  const handleShareStudentData = async (idStr: string, pageIdStr: string) => {
    if (sharedStudent === idStr) {
      await resetViewAndShare();
    } else {
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {
          id: getRoomData.id,
          displayData: [{studentAuthID: idStr, lessonPageID: pageIdStr}],
        },
      });
      setLocalStorageData('room_info', {
        ...getRoomData,
        displayData: [{studentAuthID: idStr, lessonPageID: pageIdStr}],
      });
      await handleRoomUpdate({
        id: getRoomData.id,
        displayData: [{studentAuthID: idStr, lessonPageID: pageIdStr}],
      });
    }
  };

  // ~~~~~~~~~~~~~~~ CLEAN UP ~~~~~~~~~~~~~~ //

  const handleManualRefresh = () => {
    if (loading === false) {
      getSyllabusLessonStudents();
    }
  };

  // ##################################################################### //
  // ####################### STUDENT SHARING STATE ####################### //
  // ##################################################################### //

  // //TODO: refactor person find functions (a lot is repeated and can be made into 1 function)

  // const handleStudentDisappear = () => {
  //   const viewedInOnlineList = personLocationStudents.find(
  //     (student: any) => student.personAuthID === viewedStudent
  //   );
  //   const sharedInOnlineList = personLocationStudents.find(
  //     (student: any) => student.personAuthID === sharedStudent
  //   );

  //   if (
  //     viewedStudent !== '' &&
  //     viewedInOnlineList === undefined
  //     /*(sharedStudent !== '' && sharedInOnlineList === undefined)*/
  //   ) {
  //     resetViewAndShare();
  //   }
  // };

  // useEffect(() => {
  //   handleStudentDisappear();
  // }, [personLocationStudents]);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div
      className={`w-full h-full bg-light-gray bg-opacity-20 overflow-y-auto overflow-x-hidden`}>
      {/* TABLE HEAD */}
      <div
        className={`w-full h-8 flex py-2 pl-2 pr-1 text-white bg-darker-gray bg-opacity-40`}>
        <div
          className={`w-3.5/10 relative mx-2 flex items-center hover:underline cursor-pointer text-xs`}>
          <span className="w-auto">
            {lessonPlannerDict[userLanguage]['OTHER_LABELS']['COLUMN']['ONE']}
          </span>
          <span className={`w-8`} onClick={handleManualRefresh}>
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
                key={`rosterrow_${key}`}
                number={key}
                id={student.personAuthID}
                active={true}
                firstName={student.person?.firstName ? student.person?.firstName : ''}
                lastName={student.person?.lastName ? student.person?.lastName : ''}
                preferredName={
                  student.person?.preferredName ? student.person?.preferredName : ''
                }
                role={student.person?.role ? student.person?.role : ''}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleResetViewAndShare={resetViewAndShare}
                handleViewStudentData={handleViewStudentData}
                handleShareStudentData={handleShareStudentData}
                viewedStudent={viewedStudent}
                sharedStudent={sharedStudent}
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
                key={`rosterrow_inactive_${key}`}
                number={key}
                id={student.personAuthID}
                active={false}
                firstName={student.person?.firstName ? student.person?.firstName : ''}
                lastName={student.person?.lastName ? student.person?.lastName : ''}
                preferredName={
                  student.person?.preferredName ? student.person?.preferredName : ''
                }
                role={student.person?.role ? student.person?.role : ''}
                currentLocation={student.currentLocation}
                lessonProgress={student.lessonProgress}
                handleResetViewAndShare={resetViewAndShare}
                handleViewStudentData={handleViewStudentData}
                handleShareStudentData={handleShareStudentData}
                viewedStudent={viewedStudent}
                sharedStudent={sharedStudent}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default ClassRoster;
