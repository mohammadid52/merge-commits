import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import PollActivity from './PollModules/PollActivity';
import PollBreakdown from './PollBreakdown/PollBreakdown';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';


const PollPage = () => {
    const { dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <PollBreakdown />
            </Route>
            <Route exact path={`${match.url}`}>
                <PollActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default PollPage;