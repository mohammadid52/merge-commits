import React, {useContext, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';

import BuilderRowComposer from '../../UniversalLessonBuilder/views/CoreBuilder/BuilderRowComposer';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {AiOutlineEye, AiOutlineEyeInvisible, AiOutlineBgColors} from 'react-icons/ai';
import Tooltip from '../../../Atoms/Tooltip';
import Buttons from '../../../Atoms/Buttons';
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';
import {GlobalContext} from '../../../../contexts/GlobalContext';
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
