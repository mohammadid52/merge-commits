import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import LyricsActivity from './LyricsModules/LyricsActivity';
import LyricsBreakdown from './LyricsBreakdown/LyricsBreakdown';
// import ErrorPage from '../../Error/ErrorPage';

const Lyrics = () => {
    const { state, dispatch } = useContext(LessonContext);
    const match = useRouteMatch();
    
    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'corelesson'})
    }, [])

    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <LyricsBreakdown />
            </Route>
            <Route exact path={`${match.url}`}>
                <LyricsActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
        // <div className="h-full w-screen flex flex-col justify-center items-center">
        //     {lessonSteps[lessonStep]}
        // </div>
    )
}

export default Lyrics;