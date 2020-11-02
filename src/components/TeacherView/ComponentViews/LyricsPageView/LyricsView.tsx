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
import { studentObject } from '../../../../state/LessonControlState';
// import ErrorPage from '../../Error/ErrorPage';
interface props {
        fullscreen: boolean
    }
const Lyrics = (props: props) => {
    const { fullscreen } = props;
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <LyricsBreakdownView fullscreen={fullscreen} />
            </Route>
            <Route exact path={`${match.url}`}>
                <LyricsActivityView fullscreen={fullscreen} />
            </Route>
        </Switch>
    )
}

export default Lyrics;