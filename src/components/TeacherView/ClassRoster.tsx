import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import useLessonControls from 'customHooks/lessonControls';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import RosterSection from './ClassRoster/RosterSection';
import Buttons from '@components/Atoms/Buttons';
import {useNotifications} from '@contexts/NotificationContext';
import {PersonStatus} from 'API';

interface IClassRosterProps {
  handleQuitShare: () => void;
  handleQuitViewing: () => void;
  isSameStudentShared: boolean;
  handlePageChange?: any;
  handleRoomUpdate?: (payload: any) => void;
  rightView?: {view: string; option?: string};
  setRightView?: any;
}

const ClassRoster = ({
  handlePageChange,
  handleRoomUpdate,
  rightView,
  setRightView
}: IClassRosterProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const lessonState = gContext.lessonState;
  const lessonDispatch = gContext.lessonDispatch;
  const controlState = gContext.controlState;
  const roster = controlState.roster;
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

      console.log('unsubscribe from student updates -- ClassRoster');
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: ''}
      });
      setLocalStorageData('room_info', {
        ...getRoomData,
        studentViewing: '',
        displayData: [{isTeacher: false, studentAuthID: '', lessonPageID: ''}]
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
        roomID: getRoomData.id
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const updatedStudent = locationData.value.data.onCreateUpdatePersonLocationItem;

        console.log('new create update location: ', updatedStudent);
        setUpdatedStudent(updatedStudent);
      }
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
        roomID: getRoomData.id
      })
      //@ts-ignore
    ).subscribe({
      next: (locationData: any) => {
        const deletedStudent = locationData.value.data.onDeletePersonLocationItem;

        console.log('deleted location: ', deletedStudent);
        setDeletedStudent(deletedStudent);
      }
    });
    return personLocationDeleteSub;
  };

  // ##################################################################### //
  // ########################## GETTING STUDENTS ######################### //
  // ##################################################################### //

  // ~~~~~~~~~ FETCH CLASS STUDENTS ~~~~~~~~ //

  const getClassStudents = async (
    sessionClassID: string,
    nextToken?: string,
    outArray?: any[]
  ) => {
    try {
      const classStudents: any = await API.graphql(
        graphqlOperation(queries.listClassStudents, {
          nextToken: nextToken,
          limit: 500,
          filter: {classID: {contains: sessionClassID}}
        })
      );
      const classStudentList = outArray
        ? [...classStudents.data.listClassStudents.items, ...outArray]
        : classStudents.data.listClassStudents?.items;

      const theNextToken = classStudents.data.listClassStudents?.nextToken;

      if (theNextToken) {
        getClassStudents(sessionClassID, theNextToken, classStudentList);
      } else {
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
            saveType: ''
          };
        });
        controlDispatch({
          type: 'UPDATE_STUDENT_ROSTER',
          payload: {students: initClassStudentList}
        });
      }
    } catch (e) {
      console.error('getClassStudents - ', e);
    }
  };

  // ~~~ GET ACTIVE ST // PERSONLOCATION ~~~ //

  const {lessonID} = urlParams;

  const getActiveClassStudents = async (nextToken?: string, outArray?: any[]) => {
    if (!loading) {
      setLoading(true);
    }
    try {
      const syllabusLessonStudents: any = await API.graphql(
        graphqlOperation(queries.listPersonLocations, {
          nextToken: nextToken,
          filter: {
            syllabusLessonID: {eq: getRoomData.activeSyllabus},
            lessonID: {eq: lessonID},
            roomID: {eq: getRoomData.id}
          }
        })
      );
      const syllabusLessonStudentList = outArray
        ? [...syllabusLessonStudents.data.listPersonLocations.items, ...outArray]
        : syllabusLessonStudents.data.listPersonLocations.items;
      const theNextToken = syllabusLessonStudents.data.listPersonLocations?.nextToken;

      if (theNextToken) {
        getActiveClassStudents(theNextToken, syllabusLessonStudentList);
      } else {
        const studentsFromThisClass = syllabusLessonStudentList.filter((student: any) => {
          const findStudentInClasslist = roster.find(
            (student2: any) => student2.personEmail === student.personEmail
          );
          if (
            findStudentInClasslist &&
            findStudentInClasslist.person.status !== PersonStatus.INACTIVE
          ) {
            return findStudentInClasslist;
          }
        });
        setPersonLocationStudents(studentsFromThisClass);
        controlDispatch({
          type: 'UPDATE_ACTIVE_ROSTER',
          payload: {students: studentsFromThisClass}
        });
        subscription = subscribeToPersonLocations();
        deleteSubscription = subscribeToDeletePersonLocations();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.error('getActiveClassStudents - ', e);
    }
  };

  useEffect(() => {
    if (roster.length > 0) {
      getActiveClassStudents();
    }
  }, [roster]);

  const notInClassStudents = () => {
    let notInClass = roster.filter((student: any) => {
      const isInStateRoster = controlState.rosterActive.find(
        (studentTarget: any) => studentTarget.personAuthID === student.personAuthID
      );

      return isInStateRoster === undefined;
    });

    return notInClass.sort(function (
      a: {person: {firstName: number}},
      b: {person: {firstName: number}}
    ) {
      if (a.person.firstName < b.person.firstName) {
        return -1;
      }
      if (a.person.firstName > b.person.firstName) {
        return 1;
      }
      return 0;
    });
  };

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
        type: 'UPDATE_ACTIVE_ROSTER',
        payload: {students: existRoster}
      });
      setUpdatedStudent({});
    } else {
      const newRoster = [...personLocationStudents, newStudent];
      setPersonLocationStudents(newRoster);
      controlDispatch({type: 'UPDATE_ACTIVE_ROSTER', payload: {students: newRoster}});
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
        type: 'UPDATE_ACTIVE_ROSTER',
        payload: {students: deleteRoster}
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

  const {resetViewAndShare, resetShare, resetView} = useLessonControls();

  // ~~~~~~~~~~~~~~~ VIEWING ~~~~~~~~~~~~~~~ //

  const {setNotification, clearNotification} = useNotifications();

  const handleViewStudentData = async (idStr: string) => {
    if (viewedStudent === idStr) {
      clearNotification();
      setNotification({
        show: true,
        timeout: 2000,
        title: 'Student screen sharing and viewing cancelled'
      });
      await resetViewAndShare();
    } else {
      lessonDispatch({
        type: 'SET_ROOM_SUBSCRIPTION_DATA',
        payload: {id: getRoomData.id, studentViewing: idStr}
      });

      setLocalStorageData('room_info', {...getRoomData, studentViewing: idStr});
      clearNotification();
      setNotification({show: true, timeout: 2000, title: 'Viewing student screen'});
      await handleRoomUpdate({id: getRoomData.id, studentViewing: idStr});
    }
  };

  // ~~~~~~~~~~~~~~~ SHARING ~~~~~~~~~~~~~~~ //

  const handleShareStudentData = async (idStr: string, pageIdStr: string) => {
    if (lessonState?.lessonData?.type !== 'survey') {
      if (sharedStudent === idStr) {
        clearNotification();
        setNotification({
          show: true,
          timeout: 2000,
          title: 'Student screen sharing cancelled'
        });
        await resetShare();
      } else {
        lessonDispatch({
          type: 'SET_ROOM_SUBSCRIPTION_DATA',
          payload: {
            id: getRoomData.id,
            displayData: [
              {isTeacher: false, studentAuthID: idStr, lessonPageID: pageIdStr}
            ]
          }
        });
        setLocalStorageData('room_info', {
          ...getRoomData,
          displayData: [{isTeacher: false, studentAuthID: idStr, lessonPageID: pageIdStr}]
        });

        clearNotification();
        setNotification({show: true, timeout: 2000, title: 'Sharing student screen'});

        await handleRoomUpdate({
          id: getRoomData.id,
          displayData: [{isTeacher: false, studentAuthID: idStr, lessonPageID: pageIdStr}]
        });
      }
    } else {
      console.log(
        'handleShareStudentData - ',
        'Not sharing because lesson type is survey'
      );
    }
  };

  // ~~~~~~~~~~~~~~~ CLEAN UP ~~~~~~~~~~~~~~ //

  const handleManualRefresh = () => {
    if (loading === false) {
      getActiveClassStudents();
    }
  };

  // ##################################################################### //
  // ############################### OTHER ############################### //
  // ##################################################################### //

  const handleToggleRightView = (rightViewObj: {view: string; option: string}) => {
    let toggleValue =
      rightView.view === rightViewObj.view
        ? {...rightViewObj, view: 'lesson'}
        : {...rightViewObj, view: rightViewObj.view};
    setRightView(toggleValue);
  };

  const [recordPrevPage, setRecordPrevPage] = useState(0);

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <>
      <div className={`w-full h-full   overflow-y-auto overflow-x-hidden pb-48`}>
        {/* */}
        <div className="px-4">
          <div className="text-sm w-full pt-2 font-semibold text-gray-600 border-b-0 border-gray-600 pb-1">
            <p>Student Roster</p>
          </div>
        </div>

        {/* STUDENTS - IN CLASS */}

        <RosterSection
          hot
          handleManualRefresh={handleManualRefresh}
          loading={loading}
          recordPrevPage={recordPrevPage}
          setRecordPrevPage={setRecordPrevPage}
          handleToggleRightView={handleToggleRightView}
          rightView={rightView}
          setRightView={setRightView}
          studentList={controlState.rosterActive}
          handleResetViewAndShare={resetViewAndShare}
          handleViewStudentData={handleViewStudentData}
          handleShareStudentData={handleShareStudentData}
          viewedStudent={viewedStudent}
          sharedStudent={sharedStudent}
          handlePageChange={handlePageChange}
          sectionTitle={
            lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION']['IN_CLASS']
          }
          emptyMessage={'No students are in class'}
        />
        {/* STUDENTS - NOT IN CLASS */}
        <RosterSection
          hot={false}
          handleManualRefresh={handleManualRefresh}
          handleToggleRightView={handleToggleRightView}
          rightView={rightView}
          setRightView={setRightView}
          studentList={notInClassStudents()}
          handleResetViewAndShare={resetViewAndShare}
          handleViewStudentData={handleViewStudentData}
          handleShareStudentData={handleShareStudentData}
          viewedStudent={viewedStudent}
          sharedStudent={sharedStudent}
          handlePageChange={handlePageChange}
          sectionTitle={
            lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION'][
              'NOT_IN_CLASS'
            ]
          }
          emptyMessage={'...'}
        />

        {/* STUDENTS - ON DEMAND*/}
        {/* <RosterSection
          hot={false}
          handleManualRefresh={handleManualRefresh}
          handleToggleRightView={handleToggleRightView}
          rightView={rightView}
          setRightView={setRightView}
          studentList={inactiveStudents?.onDemand}
          handleResetViewAndShare={resetViewAndShare}
          handleViewStudentData={handleViewStudentData}
          handleShareStudentData={handleShareStudentData}
          viewedStudent={viewedStudent}
          sharedStudent={sharedStudent}
          handlePageChange={handlePageChange}
          sectionTitle={
            lessonPlannerDict[userLanguage]['OTHER_LABELS']['STUDENT_SECTION'][
              'ON_DEMAND'
            ]
          }
          emptyMessage={'No self-paced students'}
        /> */}
      </div>
    </>
  );
};

export default ClassRoster;
