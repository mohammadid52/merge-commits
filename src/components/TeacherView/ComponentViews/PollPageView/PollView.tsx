import React, { useContext, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import PollActivityView from './PollModules/PollActivityView';
import PollBreakdownView from './PollBreakdown/PollBreakDownView';

const PollView = () => {
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();

  useEffect(() => {
    dispatch({ type: 'ACTIVATE_LESSON', payload: 'warmup' });
  }, []);

  /**
   * TODO: do a switch here to toggle between PoemActivityView & PoemBreakdownView
   */
  return (
    <Switch>
      <Route path={`${match.url}/breakdown`}>
        <PollBreakdownView isTeacher={true} displayMode={'SELF'} />
      </Route>
      <Route exact path={`${match.url}`}>
        <PollActivityView />
      </Route>
    </Switch>
  );
};

export default PollView;
