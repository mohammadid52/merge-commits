import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { dateString } from '../../../utilities/time';
import { Lesson } from './Classroom';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../customGraphql/customMutations';

interface StartProps {
  isTeacher?: boolean;
  lessonKey: any;
  open: boolean;
  accessible: boolean;
  type?: string;
}

const Start: React.FC<StartProps> = (props: StartProps) => {
  const { state, dispatch } = useContext(GlobalContext);
  const { isTeacher, lessonKey, open, accessible, type } = props;
  const history = useHistory();

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
    const arrayWithToggledLesson = state.roomData.lessons.map((lesson: Lesson, i: number) => {
      if (lesson.id === lessonKey) {
        return { ...lesson, status: lesson.status === 'Active' ? 'Inactive' : 'Active' };
      } else {
        return lesson;
      }
    });
    await mutateToggleEnableDisable();
    dispatch({ type: 'TOGGLE_LESSON', payload: { property: 'lessons', data: arrayWithToggledLesson } });
  };

  const handleLink = () => {
    if (!isTeacher && accessible && open) {
      history.push(`${`/lesson/${lessonKey}`}`);
    }

    if (isTeacher) {
      if (type.includes('survey') || type.includes('assessment')) {
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
          return 'DISABLE';
        } else {
          return 'ENABLE';
        }
      } else {
        return 'TEACH';
      }
    } else {
      return 'START';
    }
  };

  const secondPart = () => {
    if (typeof type !== 'undefined') {
      return type.toUpperCase();
    } else {
      return '';
    }
  };

  const buttonClassSurvey =
    'text-white bg-green-500 hover:bg-green-400 focus:border-green-700 focus:shadow-outline-lime active:bg-green-500 cursor-pointer';
  const buttonClassLesson =
    'text-white bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 cursor-pointer';
  const buttonClassInactive = 'bg-gray-500 text-gray-700 cursor-default';

  const classSwitch = () => {
    if (isTeacher) {
      if (type === 'survey' || type === 'assessment') {
        if (!open) {
          return buttonClassLesson;
        } else {
          return buttonClassSurvey;
        }
      } else {
        return buttonClassLesson;
      }
    }
    if (!isTeacher) {
      if (type === 'survey' || type === 'assessment') {
        if (!open) {
          return buttonClassInactive;
        } else {
          return buttonClassSurvey;
        }
      } else {
        if (!open) {
          return buttonClassInactive;
        } else {
          return buttonClassLesson;
        }
      }
    }
  };

  return (
    <div>
      <button
        type="submit"
        onClick={handleLink}
        className={`${classSwitch()} h-full w-full text-xs rounded-br focus:outline-none transition duration-150 ease-in-out`}>
        <span className="w-auto h-auto">{`${firstPart()} ${secondPart()}`}</span>
      </button>
    </div>
  );
};

export default Start;
