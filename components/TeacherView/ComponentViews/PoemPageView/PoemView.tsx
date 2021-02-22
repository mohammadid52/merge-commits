import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PoemActivityView from './PoemModules/PoemActivityView';
import PoemBreakdownView from './PoemBreakdown/PoemBreakdownView';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../state/LessonControlState';

// import ErrorPage from '../../Error/ErrorPage';

interface props {
  fullscreen: boolean;
}

const Poem = (props: props) => {
  const { fullscreen } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();

  useEffect(() => {
    // dispatch({type: 'ACTIVATE_LESSON', payload: 'activity'})
    // if ( state.componentState.poem && state.componentState.poem.editMode === 'true' ) {
    //     dispatch({ type: 'CAN_CONTINUE' })
    // } else {
    //     dispatch({ type: 'NO_CONTINUE' })
    // }
  }, []);

  return (
    <Switch>
      <Route path={`${match.url}/breakdown`}>
        <PoemBreakdownView fullscreen={fullscreen} />
      </Route>
      <Route exact path={`${match.url}`}>
        <PoemActivityView fullscreen={fullscreen} />
      </Route>
      {/* <Route>
                <ErrorPage />
            </Route> */}
    </Switch>
  );
};

export default Poem;