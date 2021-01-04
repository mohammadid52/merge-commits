import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import AdventureActivity from './AdventureModules/AdventureActivity';
import AdventureBreakdown from './AdventureBreakdown/AdventureBreakdown';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';


const AdventurePage = () => {
    const { dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <AdventureBreakdown />
            </Route>
            <Route exact path={`${match.url}`}>
                <AdventureActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default AdventurePage;