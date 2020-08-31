import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import LyricsActivityView from './LyricsModules/LyricsActivityView';
import LyricsBreakdownView from './LyricsBreakdown/LyricsBreakdownView';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
// import ErrorPage from '../../Error/ErrorPage';
interface props {
        student: number | null,
        fullscreen: boolean
    }
const Lyrics = (props: props) => {
    const { student, fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();
    
    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'corelesson'})
    }, [])

    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <LyricsBreakdownView fullscreen={fullscreen} student={student}/>
            </Route>
            <Route exact path={`${match.url}`}>
                <LyricsActivityView fullscreen={fullscreen} student={student}/>
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