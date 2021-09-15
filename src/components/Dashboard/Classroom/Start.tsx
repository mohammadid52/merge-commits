import API, {graphqlOperation} from '@aws-amplify/api';
import {noop} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../../../contexts/GlobalContext';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import {awsFormatDate, dateString} from '../../../utilities/time';
import Buttons from '../../Atoms/Buttons';
import ModalPopUp from '../../Molecules/ModalPopUp';
import {Lesson} from './Classroom';

interface StartProps {
  isTeacher?: boolean;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
  roomID: string;
  isActive?: boolean;
  isCompleted?: boolean;
  preview?: boolean;
  activeRoomInfo?: any;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const {state, theme, dispatch, userLanguage, clientKey} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);
  const {
    activeRoomInfo,
    isActive,
    isCompleted,
    lessonKey,
    open,
    accessible,
    type,
    roomID,
    preview,
  } = props;
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceRecorded, setAttendanceRecorded] = useState<boolean>(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    activeLessonsId: [],
    message: 'Do you want to mark these active lessons as completed?',
  });

  const isTeacher = state.user.role === 'FLW' || state.user.role === 'TR';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (type === 'lesson') {
      fetchAttendance();
    }
  }, [state.roomData.syllabus]);

  const mutateToggleEnableDisable = async () => {
    const mutatedLessonData = {
      id: lessonKey,
      status: open ? 'Inactive' : 'Active',
    };
    await API.graphql(
      graphqlOperation(customMutations.updateSyllabusLesson, {
        input: mutatedLessonData,
      })
    );
  };

  const toggleEnableDisable = async () => {
    const arrayWithToggledLesson = state.roomData.lessons.map(
      (lesson: Lesson, i: number) => {
        if (lesson.id === lessonKey) {
          return {...lesson, status: lesson.status === 'Active' ? 'Inactive' : 'Active'};
        } else {
          return lesson;
        }
      }
    );
    await mutateToggleEnableDisable();
    dispatch({
      type: 'TOGGLE_LESSON',
      payload: {property: 'lessons', data: arrayWithToggledLesson},
    });
  };

  const fetchAttendance = async () => {
    try {
      const syllabusData = state.roomData.syllabus.find(
        (syllabus: any) => syllabus.id === state.activeSyllabus // was looking for syllabus.active, but active status is on room
      );

      if (syllabusData) {
        let filter: any = {
          studentID: {eq: state.user?.id},
          curriculumID: {eq: syllabusData.curriculumID},
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

  const recordAttendance = async () => {
    try {
      setLoading(true);
      const syllabusData = state.roomData.syllabus.find(
        (syllabus: any) => syllabus.id === state.activeSyllabus // was looking for syllabus.active, but active status is on room
      );

      const payload = {
        studentID: state.user?.id,
        curriculumID: syllabusData.curriculumID,
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

  const handleLink = async () => {
    if (!isTeacher && accessible && open) {
      try {
        if (!attendanceRecorded) {
          recordAttendance();
        }
        history.push(`/lesson/${lessonKey}?roomId=${roomID}`);
      } catch (error) {
        setLoading(false);
      }
    }

    if (isTeacher) {
      // if (type === 'survey' || type === 'assessment') {
      //   toggleEnableDisable();
      // } else {
      if (isActive) {
        if (!attendanceRecorded) {
          recordAttendance();
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

    setWarnModal((prevValues) => ({
      ...prevValues,
      message: `Do you want to mark ${activeLessonsData
        .map((lesson: any) => lesson.title)
        .join(', ')} as completed?`,
      activeLessonsId: activeLessonsData.map((lesson: any) => lesson.id),
      show: true,
    }));
  };

  const handleMarkAsCompleteClick = async () => {
    await API.graphql(
      graphqlOperation(mutations.updateRoom, {
        input: {
          id: roomID,
          completedLessons: [
            ...(state.roomData.completedLessons || []),
            ...warnModal.activeLessonsId?.map((lessonID) => ({
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
        // if (open) {
        //   return classRoomDict[userLanguage]['BOTTOM_BAR']['DISABLE'];
        // } else {
        // return classRoomDict[userLanguage]['BOTTOM_BAR']['ENABLE'];
        // }
      } else {
        if (isCompleted) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['COMPLETED'];
        } else if (isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['ACTIVE'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['TEACH'];
        }
      }
    } else {
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
    }
  };

  const secondPart = () => {
    if (typeof type !== 'undefined') {
      switch (type) {
        case 'lesson':
          return isCompleted ? '' : classRoomDict[userLanguage]['LESSON'].toUpperCase();
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
    // if (type === 'lesson') {
    if (isCompleted) {
      return 'bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-600 focus:bg-gray-600';
    } else if (isActive) {
      return theme.btn.lessonStart;
    } else {
      return theme.btn.iconoclastIndigo;
    }
    // }
    // else {
    //   if (!isTeacher) {
    //     return theme.btn.surveyStart;
    //   } else {
    //     if (open) {
    //       return theme.btn.surveyStart;
    //     } else {
    //       return theme.btn.lessonStart;
    //     }
    //   }
    // }
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
          loading || (!open && !isTeacher) || (!isTeacher && !isActive) || isCompleted
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
