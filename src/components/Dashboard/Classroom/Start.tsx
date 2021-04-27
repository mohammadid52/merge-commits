import React, {useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory} from 'react-router-dom';

import {GlobalContext} from '../../../contexts/GlobalContext';
import {dateString} from '../../../utilities/time';
import {Lesson} from './Classroom';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';
import Buttons from '../../Atoms/Buttons';

interface StartProps {
  isTeacher?: boolean;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const {state, theme, dispatch, userLanguage, clientKey} = useContext(GlobalContext);
  const {classRoomDict} = useDictionary(clientKey);
  const {lessonKey, open, accessible, type} = props;
  const history = useHistory();

  const isTeacher = state.user.role === 'FLW' || state.user.role === 'TR';

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

  const handleLink = () => {
    if (!isTeacher && accessible && open) {
      history.push(`${`/lesson/${lessonKey}`}`);
    }

    if (isTeacher) {
      if (type === 'survey' || type === 'assessment') {
        toggleEnableDisable();
      } else {
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
        return classRoomDict[userLanguage]['BOTTOM_BAR']['TEACH'];
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
      return theme.btn.lessonStart;
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
        label={`${firstPart()} ${secondPart()}`}
        disabled={!open && !isTeacher}
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
