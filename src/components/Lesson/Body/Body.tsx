import React, { useContext, useEffect, Suspense, lazy} from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import {
    Switch,
    Route,
    useLocation,
    useRouteMatch, 
} from "react-router-dom";
const Intro = lazy(() => import('../LessonComponents/Intro/Intro'));
const Story = lazy(() => import('../LessonComponents/StoryPage/Story'));
const Lyrics = lazy(() => import('../LessonComponents/LyricsPage/Lyrics'));
const Poem = lazy(() => import('../LessonComponents/PoemPage/Poem'));
const List = lazy(() => import('../LessonComponents/ListPage/List'));
const Poll = lazy(() => import('../LessonComponents/PollPage/Poll'));
const TChart = lazy(() => import('../LessonComponents/TChartPage/TChart'));
const TruthGame = lazy(() => import('../LessonComponents/TruthGamePage/TruthGame'));
const MultiList = lazy(() => import('../LessonComponents/MultiListPage/MultiList'));
const Adventure = lazy(() => import('../LessonComponents/AdventurePage/Adventure'));
const Outro = lazy(() => import('../LessonComponents/Outro/Outro'));
const LessonError = lazy(() => import('../../Error/LessonError'));
const Checkpoint = lazy(() => import('../LessonComponents/Checkpoint/Checkpoint'));
const Assessments = lazy(() => import('../LessonComponents/Checkpoint/Assessments'));

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
            case 'list':
                return <List />;
            case 'truthgame':
                return <TruthGame />;
            case 'tchart':
                return <TChart />;
            case 'multi-list':
                return <MultiList />;
            case 'poll':
                return <Poll />;
            case 'adventure':
                return <Adventure />;
            default:
                return <LessonError />;
        }
    }

    console.log(state, 'state')

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
        // <div className="p-4 md:px-8 md:h-8.3/10"> 
        <div className="z-0 p-4 md:h-8.2/10 bg-dark"> 
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
                <Route path={`${match.url}/checkpoint`}>
                    <Checkpoint />
                </Route>
                <Route path={`${match.url}/assessment`}>
                    <Assessments />
                </Route>
                {/* <Route>
                    <ErrorPage />
                </Route> */}
            </Switch>
        </div>
    )
}

export default Body;