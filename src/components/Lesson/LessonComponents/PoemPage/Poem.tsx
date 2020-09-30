import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import PoemActivity from './PoemModules/PoemActivity';
import PoemBreakdown from './PoemBreakdown/PoemBreakdown'
// import ErrorPage from '../../Error/ErrorPage';

const Poem = () => {
    const { state, dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'activity'})

        if ( state.componentState.poem && state.componentState.poem.editMode === 'true' ) {
            dispatch({ type: 'CAN_CONTINUE' })
        } else {
            dispatch({ type: 'NO_CONTINUE' })
        }
    }, [])


    
    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <PoemBreakdown />
            </Route>
            <Route exact path={`${match.url}`}>
                <PoemActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default Poem;