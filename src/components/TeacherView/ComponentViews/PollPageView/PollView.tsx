import React, { useEffect, useContext } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import PollActivityView from './PollModules/PollActivityView';

const PollView = () => {
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup' });
  }, []);

  return (
    <PollActivityView/>
  )

}

export default PollView;