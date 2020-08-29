import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import StoryActivity from './StoryModules/StoryActivityView';
import StoryBreakdown from './StoryBreakdown/StoryBreakdownView';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';

interface props {
        student: number | null,
        fullscreen: boolean
    }

const StoryPage = (props: props) => {
    const { student, fullscreen } = props;
    const { dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <StoryBreakdown fullscreen={fullscreen} student={student}/>
            </Route>
            <Route exact path={`${match.url}`}>
                <StoryActivity fullscreen={fullscreen} student={student}/>
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default StoryPage;