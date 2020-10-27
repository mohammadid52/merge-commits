import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import TruthGameActivity from './TruthGameModules/TruthGameActivity';
import TruthGameBreakdown from './TruthGameBreakdown/ListBreakdown';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonContext } from '../../../../contexts/LessonContext';


const ListPage = () => {
    const { dispatch } = useContext(LessonContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <TruthGameBreakdown />
            </Route>
            <Route exact path={`${match.url}`}>
                <TruthGameActivity />
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default ListPage;