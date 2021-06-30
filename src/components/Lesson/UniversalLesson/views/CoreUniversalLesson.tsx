import React, { useContext } from 'react';
import { UniversalLesson } from '../../../../interfaces/UniversalLessonInterfaces';
import { LessonPageWrapper } from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import LessonRowComposer from './CoreUniversalLesson/LessonRowComposer';

interface CoreUniversalLessonProps {
  universalLessonDetails?: UniversalLesson;
}

const CoreUniversalLesson = ({universalLessonDetails}: CoreUniversalLessonProps) => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);

  return (
    <div
      className={`h-full overflow-hidden overflow-y-scroll bg-dark-gray}`}>
      <div className={`w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <LessonRowComposer/>
        </LessonPageWrapper>
      </div>
    </div>
  );
};

export default CoreUniversalLesson;
