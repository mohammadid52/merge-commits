import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import StoryActivityView from './StoryModules/StoryActivityView';
import StoryBreakdownView from './StoryBreakdown/StoryBreakdownView';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        student: number | null,
        fullscreen: boolean
    }

const StoryPage = (props: props) => {
    const { student, fullscreen } = props;
    const { dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <StoryBreakdownView fullscreen={fullscreen} student={student}/>
            </Route>
            <Route exact path={`${match.url}`}>
                <StoryActivityView fullscreen={fullscreen} student={student}/>
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default StoryPage;