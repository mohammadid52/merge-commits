import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import useAuth from '@customHooks/useAuth';
import Buttons from 'atoms/Buttons';
import axios from 'axios';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {noop} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {getLocalStorageData} from 'utilities/localStorage';
import {awsFormatDate, dateString} from 'utilities/time';
import {tableCleanupUrl} from 'utilities/urls';

interface StartProps {
  isTeacher?: boolean;
  lessonProps: any;
  syllabusProps?: any;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
  roomID: string;
  isActive?: boolean;
  isCompleted?: boolean;
  preview?: boolean;
  activeRoomInfo?: any;
  isUsed?: boolean;
  lessonProgress?: number;
  pageNumber?: number;
}

const Start: React.FC<StartProps> = ({
  activeRoomInfo,
  isActive,
  isCompleted,
  lessonProps,
  syllabusProps,
  lessonKey,
  open,
  accessible,
  type,
  roomID,
  lessonProgress,
  preview
}: StartProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const state = gContext.state;

  const user = gContext.state.user;

  const userLanguage = gContext.userLanguage;
  const getRoomData = getLocalStorageData('room_info');

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {classRoomDict} = useDictionary();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceRecorded, setAttendanceRecorded] = useState<boolean>(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    activeLessonsId: [],
    lessonID: '',
    message: 'Do you want to mark these active lessons as completed?'
  });

  const isTeacher = user.role === 'FLW' || user.role === 'TR';
  const isOnDemand = user.onDemand;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (type === 'lesson' && isStudent) {
      fetchAttendance();
    }
  }, [state.roomData.syllabus]);

  // ~~~~~~~~~~~~~~ ATTENDANCE ~~~~~~~~~~~~~ //

  const fetchAttendance = async () => {
    try {
      const syllabusData = state.roomData.syllabus.find(
        (syllabus: any) => syllabus.id === state.activeSyllabus // was looking for syllabus.active, but active status is on room
      );

      if (syllabusData) {
        let filter: any = {
          studentID: {eq: state.user?.id},
          curriculumID: {eq: syllabusData.curriculumId},
          syllabusID: {eq: syllabusData.id},
          lessonID: {eq: lessonKey}
        };
        if (!isTeacher) {
          filter.date = {eq: awsFormatDate(dateString('-', 'WORLD'))};
        }
        const list: any = await API.graphql(
          graphqlOperation(queries.listAttendances, {
            filter,
            limit: 500
          })
        );
        if (isMounted) {
          setAttendanceRecorded(Boolean(list?.data.listAttendances?.items.length));
        }
      }
    } catch (error) {
      console.error(error, 'inside catch');
    }
  };

  const recordAttendance = async (lessonObj: any) => {
    try {
      setLoading(true);
      const syllabusData = state.roomData.syllabus.find(
        (syllabus: any) => syllabus.id === state.activeSyllabus // was looking for syllabus.active, but active status is on room
      );

      const payload = {
        studentID: state.user?.id,
        curriculumID: syllabusData.curriculumId,
        syllabusID: syllabusData.id,
        lessonID: lessonKey,
        roomID,
        date: awsFormatDate(dateString('-', 'WORLD')),
        time: new Date().toTimeString().split(' ')[0]
      };
      await API.graphql(
        graphqlOperation(mutations.createAttendance, {
          input: payload
        })
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  //  SPECIFIC FETCHES TO PREVENT IMPROPER DELETION  //

  const setLessonIsUsed = async (lessonObj: any) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateUniversalLesson, {
          input: {id: lessonObj.id, isUsed: true}
        })
      );
    } catch (e) {
      console.error('setLessonIsUsed() - ', e);
    }
  };

  const setSyllabusLessonHistory = async (syllabusID: string, historyArray: any[]) => {
    try {
      await API.graphql(
        graphqlOperation(mutations.updateUniversalSyllabus, {
          input: {id: syllabusID, lessonHistory: historyArray}
        })
      );
    } catch (e) {
      console.error('setSyllabusLessenHistory() - ', e);
    }
  };

  const goBackUrl = `/lesson-control/${lessonKey}`;

  const handleLink = async () => {
    if (!isTeacher && accessible && open) {
      if (!isCompleted) {
        try {
          if (!attendanceRecorded) {
            await recordAttendance(lessonProps);
          }
          // await getLessonCurrentPage(lessonKey, user.email, user.authId);
          const url = `/lesson/${lessonKey}/${lessonProgress}`;
          history.push(url);
        } catch (error) {
          setLoading(false);
        }
      } else {
        history.push(`/dashboard/anthology?roomId=${getRoomData.id}`);
      }
    } else if (isTeacher) {
      if (isActive) {
        if (!attendanceRecorded) {
          recordAttendance(lessonProps);
        }
        // if lesson does not have 'isUsed' as true
        if (!(lessonProps?.isUsed === true)) {
          await setLessonIsUsed(lessonProps);
        }
        // check if lesson has never been tought/activated before
        // if it has never been activated in a syllabus, add it to the syllabus history
        if (Array.isArray(syllabusProps?.lessonHistory)) {
          if (!syllabusProps?.lessonHistory.includes(lessonProps.id)) {
            await setSyllabusLessonHistory(syllabusProps?.id, [
              ...syllabusProps.lessonHistory,
              lessonProps.id
            ]);
          }
        } else {
          await setSyllabusLessonHistory(syllabusProps?.id, [lessonProps.id]);
        }
        history.push(goBackUrl);
      } else {
        discardChanges();
      }
      // }
    }
  };

  const discardChanges = async () => {
    const activeLessons = activeRoomInfo?.activeLessons || [];
    await API.graphql(
      graphqlOperation(mutations.updateRoom, {
        input: {id: roomID, activeLessons: [...activeLessons, lessonKey]}
      })
    );
    history.push(goBackUrl);
  };

  const handleMarkAsCompleteClick = async (lessonIds: any) => {
    setIsLoading(true);
    const payloadLessonIds = Array.isArray(lessonIds)
      ? lessonIds
      : warnModal.activeLessonsId;
    // UPDATE ROOM MUTATION
    try {
      await API.graphql(
        graphqlOperation(mutations.updateRoom, {
          input: {
            id: roomID,
            completedLessons: [
              ...(state?.roomData?.completedLessons || []),
              ...payloadLessonIds?.map((lessonID: any) => ({
                lessonID,
                time: new Date().toISOString()
              }))
            ],
            activeLessons: [lessonKey]
          }
        })
      );
      // POST TO LAMBDA
      await axios.post(tableCleanupUrl, {
        lessonID: warnModal.lessonID[0],
        syllabusID: getRoomData.activeSyllabus,
        roomID: getRoomData.id
      });
      setIsLoading(false);
    } catch (e) {
      console.error('handleMarkAsCompleteClick() - ', e);
      setIsLoading(false);
    } finally {
      discardChanges();
    }
  };

  const firstPart = () => {
    if (isTeacher) {
      if (type === 'survey' || type === 'assessment') {
        if (isCompleted || isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['SURVEY'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['ENABLE'];
        }
      } else {
        if (isCompleted) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['COMPLETED'];
        } else if (isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['ACTIVE'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['TEACH'];
        }
      }
    } else if (!isTeacher && !isOnDemand) {
      if (type === 'survey' || type === 'assessment') {
        if (isCompleted || isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['SURVEY'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['UPCOMING'];
        }
      } else {
        if (isCompleted) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['GO_TO_NOTEBOOK'];
        } else if (isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['START'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['UPCOMING'];
        }
      }
    } else {
      if (type === 'survey' || type === 'assessment') {
        return classRoomDict[userLanguage]['BOTTOM_BAR']['SURVEY'];
      } else {
        if (isCompleted) {
          return 'Lesson';
        }
        return classRoomDict[userLanguage]['BOTTOM_BAR']['START'];
      }
    }
  };

  const secondPart = () => {
    if (typeof type !== 'undefined') {
      switch (type) {
        case 'lesson':
          return isCompleted && isOnDemand
            ? 'Completed'
            : isCompleted && !isOnDemand
            ? ''
            : classRoomDict[userLanguage]['LESSON'].toUpperCase();
        case 'assessment':
          return classRoomDict[userLanguage]['ASSESSMENT'].toUpperCase();
        case 'survey':
          return isActive
            ? classRoomDict[userLanguage]['BOTTOM_BAR']['OPENED']
            : isCompleted
            ? classRoomDict[userLanguage]['BOTTOM_BAR']['CLOSED']
            : isTeacher && !isCompleted && !isActive
            ? classRoomDict[userLanguage]['BOTTOM_BAR']['SURVEY']
            : classRoomDict[userLanguage]['BOTTOM_BAR']['OPENED'];
        default:
          return type.toUpperCase();
      }
    } else {
      return '';
    }
  };

  const onCloseModal = () => {
    setWarnModal({
      message: '',
      activeLessonsId: [],
      lessonID: '',
      show: false
    });
  };

  const buttonText = `${firstPart()} ${secondPart()}`;

  const updateBtnText = () => {
    switch (buttonText) {
      case 'SURVEY OPEN':
        return 'GO TO SURVEY';
      case 'START LESSON':
        return 'GO TO LESSON';
      case 'Lesson Completed':
        return classRoomDict[userLanguage]['BOTTOM_BAR']['GO_TO_NOTEBOOK'];

      default:
        return buttonText;
    }
  };

  const {isStudent} = useAuth();
  const isLesson = type === 'lesson';
  const showNotebookBtn = isStudent && isCompleted && isLesson;

  return (
    <div data-cy="survey-button">
      <Buttons
        title={showNotebookBtn ? `See your notebook` : updateBtnText()}
        type="submit"
        onClick={!preview ? handleLink : noop}
        label={
          loading ? classRoomDict[userLanguage]['MESSAGES'].PLEASE_WAIT : updateBtnText()
        }
        disabled={
          loading ||
          (!open && !isTeacher && !isOnDemand) ||
          (!isActive && !isTeacher && !isOnDemand && !isLesson) ||
          (isCompleted && type === 'survey') ||
          (isCompleted && isTeacher)
        }
        btnClass={` h-full w-full text-xs focus:outline-none ${
          !open || (isCompleted && type === 'survey') ? 'opacity-80' : 'opacity-100'
        }`}
        greenBtn={
          showNotebookBtn ||
          (isCompleted && isTeacher) ||
          (isActive && isTeacher && isLesson)
        }
      />
      {warnModal.show && (
        <ModalPopUp
          closeAction={onCloseModal}
          cancelAction={discardChanges}
          saveAction={handleMarkAsCompleteClick}
          saveLabel={isLoading ? 'Processing...' : 'Yes'}
          cancelLabel="No"
          message={warnModal.message}
        />
      )}
    </div>
  );
};

export default Start;

// For classroom students
// these are two active lessons
// nothing is completed for new student

// From teacher side
// these are two completed lessons
// 1)  I Write
// 2) Short stories
// 3) Where I'm From- High School
