import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import { studentObject } from '../../../../state/LessonControlState'
import StoryActivityView from './StoryModules/StoryActivityView';
import StoryBreakdownView from './StoryBreakdown/StoryBreakdownView';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
}

const StoryPage = (props: props) => {
    const { fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])

    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <StoryBreakdownView fullscreen={fullscreen} />
            </Route>
            <Route exact path={`${match.url}`}>
                <StoryActivityView fullscreen={fullscreen} />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default StoryPage;