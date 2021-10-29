import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {noop} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import {awsFormatDate, dateString} from '../../../utilities/time';
import Buttons from '../../Atoms/Buttons';
import ModalPopUp from '../../Molecules/ModalPopUp';
import {Lesson} from './Classroom';

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
  preview,
  isUsed,
}: StartProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const dispatch = gContext.dispatch;
  const user = gContext.state.user;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;

  const [isMounted, setIsMounted] = useState(false);

  const {classRoomDict} = useDictionary(clientKey);
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceRecorded, setAttendanceRecorded] = useState<boolean>(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    activeLessonsId: [],
    message: 'Do you want to mark these active lessons as completed?',
  });

  const isTeacher = user.role === 'FLW' || user.role === 'TR';
  const isOnDemand = user.onDemand;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (type === 'lesson') {
      fetchAttendance();
    }
  }, [state.roomData.syllabus]);

  // const mutateToggleEnableDisable = async () => {
  //   const mutatedLessonData = {
  //     id: lessonKey,
  //     status: open ? 'Inactive' : 'Active',
  //   };
  //   await API.graphql(
  //     graphqlOperation(customMutations.updateSyllabusLesson, {
  //       input: mutatedLessonData,
  //     })
  //   );
  // };

  // const toggleEnableDisable = async () => {
  //   const arrayWithToggledLesson = state.roomData.lessons.map(
  //     (lesson: Lesson, i: number) => {
  //       if (lesson.id === lessonKey) {
  //         return {...lesson, status: lesson.status === 'Active' ? 'Inactive' : 'Active'};
  //       } else {
  //         return lesson;
  //       }
  //     }
  //   );
  //   await mutateToggleEnableDisable();
  //   dispatch({
  //     type: 'TOGGLE_LESSON',
  //     payload: {property: 'lessons', data: arrayWithToggledLesson},
  //   });
  // };

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
          lessonID: {eq: lessonKey},
        };
        if (!isTeacher) {
          filter.date = {eq: awsFormatDate(dateString('-', 'WORLD'))};
        }
        const list: any = await API.graphql(
          graphqlOperation(queries.listAttendances, {
            filter,
          })
        );
        if (isMounted) {
          setAttendanceRecorded(Boolean(list?.data.listAttendances?.items.length));
        }
      }
    } catch (error) {
      console.log(error, 'inside catch');
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
        time: new Date().toTimeString().split(' ')[0],
      };
      await API.graphql(
        graphqlOperation(mutations.createAttendance, {
          input: payload,
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
          input: {id: lessonObj.id, isUsed: true},
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
          input: {id: syllabusID, lessonHistory: historyArray},
        })
      );
    } catch (e) {
      console.error('setSyllabusLessenHistory() - ', e);
    }
  };

  const handleLink = async () => {
    if (!isTeacher && accessible && open) {
      try {
        if (!attendanceRecorded) {
          await recordAttendance(lessonProps);
        }
        history.push(`/lesson/${lessonKey}/0`);
      } catch (error) {
        setLoading(false);
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
              lessonProps.id,
            ]);
          }
        } else {
          await setSyllabusLessonHistory(syllabusProps?.id, [lessonProps.id]);
        }
        history.push(`${`/lesson-control/${lessonKey}`}`);
      } else {
        toggleLessonSwitchAlert();
      }
      // }
    }
  };

  const discardChanges = async () => {
    await API.graphql(
      graphqlOperation(mutations.updateRoom, {
        input: {id: roomID, activeLessons: [...activeRoomInfo?.activeLessons, lessonKey]},
      })
    );
    history.push(`${`/lesson-control/${lessonKey}`}`);
  };

  const toggleLessonSwitchAlert = () => {
    const activeLessonsData = state.roomData.lessons
      .filter(
        (lessonData: Lesson) =>
          lessonData.lesson?.type === 'lesson' &&
          activeRoomInfo?.activeLessons?.includes(lessonData.lessonID)
      )
      .map((item: any) => item.lesson);
    const lessonIds = activeLessonsData.map((lesson: any) => lesson.id);
    if (activeLessonsData?.length) {
      setWarnModal((prevValues) => ({
        ...prevValues,
        message: `Do you want to mark ${activeLessonsData
          .map((lesson: any) => lesson.title)
          .join(', ')} as completed?`,
        activeLessonsId: lessonIds,
        show: true,
      }));
    } else {
      handleMarkAsCompleteClick(lessonIds);
    }
  };

  const handleMarkAsCompleteClick = async (lessonIds: any) => {
    const payloadLessonIds = Array.isArray(lessonIds)
      ? lessonIds
      : warnModal.activeLessonsId;
    await API.graphql(
      graphqlOperation(mutations.updateRoom, {
        input: {
          id: roomID,
          completedLessons: [
            ...(state.roomData.completedLessons || []),
            ...payloadLessonIds?.map((lessonID: any) => ({
              lessonID,
              time: new Date().toISOString(),
            })),
          ],
          activeLessons: [lessonKey],
        },
      })
    );
    history.push(`${`/lesson-control/${lessonKey}`}`);
    discardChanges();
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
          return classRoomDict[userLanguage]['BOTTOM_BAR']['COMPLETED'];
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
        return classRoomDict[userLanguage]['BOTTOM_BAR']['START'];
      }
    }
  };

  const secondPart = () => {
    if (typeof type !== 'undefined') {
      switch (type) {
        case 'lesson':
          return isCompleted && !isOnDemand
            ? ''
            : classRoomDict[userLanguage]['LESSON'].toUpperCase();
        case 'assessment':
          return classRoomDict[userLanguage]['ASSESSMENT'].toUpperCase();
        case 'survey':
          return isActive
            ? classRoomDict[userLanguage]['BOTTOM_BAR']['OPENED']
            : isCompleted
            ? classRoomDict[userLanguage]['BOTTOM_BAR']['CLOSED']
            : classRoomDict[userLanguage]['BOTTOM_BAR']['SURVEY'];
        default:
          return type.toUpperCase();
      }
    } else {
      return '';
    }
  };

  const studentTeacherButtonTheme = () => {
    if (isCompleted && !isOnDemand) {
      return 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600';
    } else if (isActive || isOnDemand) {
      return theme.btn.lessonStart;
    } else {
      return theme.btn.iconoclastIndigo;
    }
  };

  const onCloseModal = () => {
    setWarnModal({
      message: '',
      activeLessonsId: [],
      show: false,
    });
  };

  return (
    <div>
      <Buttons
        type="submit"
        onClick={!preview ? handleLink : noop}
        label={
          loading
            ? classRoomDict[userLanguage]['MESSAGES'].PLEASE_WAIT
            : `${firstPart()} ${secondPart()}`
        }
        disabled={
          loading ||
          (isCompleted && !isOnDemand) ||
          (!open && !isTeacher && !isOnDemand) ||
          (!isActive && !isTeacher && !isOnDemand)
        }
        overrideClass={true}
        btnClass={`rounded 
        ${studentTeacherButtonTheme()}
        h-full w-full text-xs focus:outline-none ${
          !open ? 'opacity-80' : 'opacity-100'
        } transition duration-150 ease-in-out py-2 sm:py-auto`}
      />
      {warnModal.show && (
        <ModalPopUp
          closeAction={onCloseModal}
          cancelAction={discardChanges}
          saveAction={handleMarkAsCompleteClick}
          saveLabel="Yes"
          cancelLabel="No"
          message={warnModal.message}
        />
      )}
    </div>
  );
};

export default Start;
