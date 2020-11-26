import React, { useEffect, useContext } from 'react';
import {
    Switch,
    Route,
    useRouteMatch,
} from "react-router-dom";
import TruthGameActivityView from './TruthGameModules/TruthGameActivityView';
import TruthGameBreakdownView from './TruthGameBreakdown/TruthGameBreakdownView';
// import ErrorPage from '../../Error/ErrorPage';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
}

const TruthGamePage = (props: props) => {
    const { fullscreen } = props;
    const { dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();

    useEffect(() => {
        dispatch({type: 'ACTIVATE_LESSON', payload: 'warmup'})
    }, [])


    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <TruthGameBreakdownView fullscreen={fullscreen}/>
            </Route>
            <Route exact path={`${match.url}`}>
                <TruthGameActivityView fullscreen={fullscreen}/>
            </Route>
            {/* <Route>
                <ErrorPage />
            </Route> */}
        </Switch>
    )
}

export default TruthGamePage;