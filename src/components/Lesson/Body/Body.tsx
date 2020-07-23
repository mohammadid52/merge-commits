import React, { useContext, useEffect} from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import {
    Switch,
    Route,
    useLocation,
    useRouteMatch,
} from "react-router-dom";
import LessonError from '../../Error/LessonError';
import Intro from '../LessonComponents/Intro/Intro';
import Story from '../LessonComponents/StoryPage/Story';
import Lyrics from '../LessonComponents/LyricsPage/Lyrics';
import Poem from '../LessonComponents/PoemPage/Poem';
import Outro from '../LessonComponents/Outro/Outro';

const Body = () => {
    const { state, dispatch } = useContext(LessonContext);
    const location = useLocation();
    const match = useRouteMatch();

    const pageSwitch = (pageType: string) => {
        switch (pageType) {
            case 'story':
                return <Story />;
            case 'lyrics':
                return <Lyrics />;
            case 'poem':
                return <Poem />;
            // case 'map-game':
            //     return <MapGame />;
            default:
                return <LessonError />;
        }
    }

    const pageFetch = (stage: string) => {
        let pageMatch = state.pages.filter((page: { stage: string; }) => {
            return page.stage === stage
        }).pop();

        if(!pageMatch) {
            return pageSwitch(null);
        }
        
        return pageSwitch(pageMatch.type);
    }

    const urlParser = (str: string) => {
        let temp = '';
        let arr = Array.from(str);
        arr.forEach(char => {
            if (char !== '/') {
                temp = temp + char
            }
            return temp
        })
        return temp
    }

    // useEffect(() => {
    //     const pageStage = urlParser(location.pathname);
    //     let pageNumber = 0;
    //     if (pageStage !== '') {
    //         pageNumber = state.pages.indexOf(state.pages.filter((page: { stage: string; }) => {
    //             return page.stage === pageStage
    //         }).pop())
    //     }
        
    //     dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber})
    // }, [])

    useEffect(() => {
        if (state.currentPage < state.pages.length - 1) {
            if (state.pages[state.currentPage + 1].open) {
                dispatch({type: 'CAN_CONTINUE'})
            } else {
                dispatch({type: 'STOP'})
            }
        } else {
            dispatch({type: 'STOP'})
        }
    }, [state.currentPage, state.pages]);

    return (
        <div className="p-4 md:px-8 md:h-168"> 
            <Switch>
                <Route exact path={`${match.url}/`}>
                    <Intro />
                </Route>
                {/* <Route path='/icebreaker'>
                    {pageFetch('icebreaker')}
                </Route> */}
                <Route path={`${match.url}/warmup`}>
                    {pageFetch('warmup')}
                </Route>
                <Route path={`${match.url}/corelesson`}>
                    {pageFetch('corelesson')}
                </Route>
                <Route path={`${match.url}/activity`}>
                    {pageFetch('activity')}
                </Route>
                {/* <Route path='/wrap-up'>
                    {pageFetch('wrap-up')}
                </Route> */}
                <Route path={`${match.url}/outro`}>
                    <Outro />
                </Route>
                {/* <Route>
                    <ErrorPage />
                </Route> */}
            </Switch>
        </div>
    )
}

export default Body;