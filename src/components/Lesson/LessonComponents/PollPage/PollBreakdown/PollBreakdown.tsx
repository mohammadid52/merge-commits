import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import SelfDisplay from './SelfDisplay';
import CoopDisplaycopy from './CoopDisplaycopy';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { PollInput } from '../PollModules/PollActivity';

export interface PollBreakdownProps {
  isTeacher?: boolean;
  dataProps?: {
    pollInputs: PollInput[];
    poll?: PollInput[];
    additional: any;
  };
  displayMode?: string;
}

const PollBreakdown = (props: PollBreakdownProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  // const displayProps = state.componentState.warmUp.poll;
  const [displayMode, setDisplayMode] = useState(state.data.lessonPlan[state.currentPage].displayMode);

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup/breakdown' });
  }, []);

  useEffect(() => {
    if (state.pages[state.currentPage].displayMode !== displayMode) {
      setDisplayMode(state.pages[state.currentPage].displayMode);
    }
  }, [state.pages]);

  if (displayMode === 'SELF') {
    return <SelfDisplay displayMode={'SELF'}/>;
  }
  if (displayMode === 'COOP') {
    return <CoopDisplaycopy />;
  }
};

export default PollBreakdown;
