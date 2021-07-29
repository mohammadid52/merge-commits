import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';

import {awsFormatDate, dateString} from '../../../utilities/time';

import {GlobalContext} from '../../../contexts/GlobalContext';
import * as customMutations from '../../../customGraphql/customMutations';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import useDictionary from '../../../customHooks/dictionary';

import Buttons from '../../Atoms/Buttons';

import {Lesson} from './Classroom';

interface StartProps {
  isTeacher?: boolean;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
  roomID: string;
  isActive?: boolean;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const {state, theme, dispatch, userLanguage, clientKey} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);
  const {isActive, lessonKey, open, accessible, type, roomID} = props;
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceRecorded, setAttendanceRecorded] = useState<boolean>(false);

  const isTeacher = state.user.role === 'FLW' || state.user.role === 'TR';

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
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
        if (_isMounted) {
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
      if (type === 'survey' || type === 'assessment') {
        toggleEnableDisable();
      } else {
        if (!attendanceRecorded) {
          recordAttendance();
        }
        history.push(`${`/lesson-control/${lessonKey}`}`);
      }
    }
  };

  const firstPart = () => {
    if (isTeacher) {
      if (type === 'survey' || type === 'assessment') {
        if (open) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['DISABLE'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['ENABLE'];
        }
      } else {
        if (isActive) {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['ACTIVE'];
        } else {
          return classRoomDict[userLanguage]['BOTTOM_BAR']['TEACH'];
        }
      }
    } else {
      return classRoomDict[userLanguage]['BOTTOM_BAR']['START'];
    }
  };

  const secondPart = () => {
    if (typeof type !== 'undefined') {
      switch (type) {
        case 'lesson':
          return classRoomDict[userLanguage]['LESSON'].toUpperCase();
        case 'assessment':
          return classRoomDict[userLanguage]['ASSESSMENT'].toUpperCase();
        case 'survey':
          return classRoomDict[userLanguage]['SURVEY'].toUpperCase();
        default:
          return type.toUpperCase();
      }
    } else {
      return '';
    }
  };

  const studentTeacherButtonTheme = () => {
    if (type === 'lesson') {
      if (isActive) {
        return theme.btn.lessonStart;
      } else {
        return theme.btn.iconoclastIndigo;
      }
    } else {
      if (!isTeacher) {
        return theme.btn.surveyStart;
      } else {
        if (open) {
          return theme.btn.surveyStart;
        } else {
          return theme.btn.lessonStart;
        }
      }
    }
  };

  return (
    <div>
      <Buttons
        type="submit"
        onClick={handleLink}
        label={
          loading
            ? classRoomDict[userLanguage]['MESSAGES'].PLEASE_WAIT
            : `${firstPart()} ${secondPart()}`
        }
        disabled={loading || (!open && !isTeacher) || (!isTeacher && !isActive)}
        overrideClass={true}
        btnClass={`
        ${studentTeacherButtonTheme()}
        h-full w-full text-xs focus:outline-none ${
          !open ? 'opacity-80' : 'opacity-100'
        } transition duration-150 ease-in-out`}
      />
    </div>
  );
};

export default Start;
