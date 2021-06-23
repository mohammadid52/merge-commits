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

interface CoreUniversalLessonProps {
  universalLessonDetails?: UniversalLesson;
}

const CoreUniversalLesson = ({universalLessonDetails}: CoreUniversalLessonProps) => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);

  const PAGES = lessonState.lessonData.lessonPlan;
  const CURRENT_PAGE = lessonState.currentPage;
  const SELECTED_PAGE_DETAILS = CURRENT_PAGE ? PAGES[CURRENT_PAGE] : undefined;

  return SELECTED_PAGE_DETAILS ? <h1>Hello</h1> : null;
};

export default CoreUniversalLesson;