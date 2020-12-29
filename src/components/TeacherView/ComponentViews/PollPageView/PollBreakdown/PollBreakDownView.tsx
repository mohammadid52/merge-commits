import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

const PollBreakdownView = () => {
  const { state, theme } = useContext(LessonControlContext);
  const [dataProps, setDataProps] = useState();

  // let displayStudentData =

  useEffect(() => {
    // TODO: add livecycle events similar to PoemBreakdownView.tsx
  }, [state.studentViewing]);

  return (
    <div className={theme.section}>
      {/**
       *
       * 1. Reflection questions
       * 2. Banner
       * 3. PollOutput
       *
       */}
    </div>
  );
};

export default PollBreakdownView;
