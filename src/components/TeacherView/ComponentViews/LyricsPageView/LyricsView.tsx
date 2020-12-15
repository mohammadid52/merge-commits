import React from 'react';
import {Route, Switch, useRouteMatch,} from "react-router-dom";
import LyricsActivityView from './LyricsModules/LyricsActivityView';
import LyricsBreakdownView from './LyricsBreakdown/LyricsBreakdownView';

// import ErrorPage from '../../Error/ErrorPage';
interface props {
    fullscreen: boolean;
    fullscreenInstructions: boolean;
    setInstructions: React.Dispatch<React.SetStateAction<{visible: boolean, available: boolean, content: any}>>
}

const Lyrics = (props: props) => {
    const {fullscreen, fullscreenInstructions, setInstructions} = props;
    const match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.url}/breakdown`}>
                <LyricsBreakdownView fullscreen={fullscreen}/>
            </Route>
            <Route exact path={`${match.url}`}>
                <LyricsActivityView fullscreen={fullscreen} fullscreenInstructions={fullscreenInstructions} setInstructions={setInstructions}/>
            </Route>
        </Switch>
    )
}

export default Lyrics;