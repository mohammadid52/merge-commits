import React, { useState, useContext, useEffect } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import {PollInput} from '../../../../Lesson/LessonComponents/PollPage/PollModules/PollActivity';

const PollActivityView = () => {
  const { state, theme } = useContext(LessonControlContext);

  return (
    <>
      {/**
       *
       * 0. Banner
       *
       */}
      <div className={theme.section}>
        <div className="flex flex-col justify-between items-center">
        {/**
         *
         * 1. Instructions
         * 2. Modules
         * 3. Poll form
         *
         */}
        </div>
      </div>
  </>);
};

export default PollActivityView;
