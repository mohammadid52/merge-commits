import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import StoryActivity from './StoryModules/StoryActivity';
// import StoryBreakdown from './StoryBreakdown/StoryBreakdown';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';


const StoryPage = () => {
    const { dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            {/* <Route path={`${match.url}/breakdown`}>
                <StoryBreakdown />
            </Route> */}
            <Route exact path={`${match.url}`}>
                <StoryActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default StoryPage;