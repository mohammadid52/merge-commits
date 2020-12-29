import React, { useContext, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import PollActivityView from './PollModules/PollActivityView';

const PollView = () => {
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup' });
  }, []);

  /**
   * TODO: do a switch here to toggle between PoemActivityView & PoemBreakdownView
   */
  return <PollActivityView />;
};

export default PollView;
