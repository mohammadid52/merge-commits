import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import {
   Switch,
   Route,
   Redirect,
   useRouteMatch,
   useHistory,
} from 'react-router-dom';
import LessonLoading from '../Lesson/Loading/LessonLoading';
import ClassRoster from './ClassRoster';
import LessonControlBar from './LessonControlBar/LessonControlBar';
const IntroView = lazy(() => import('./ComponentViews/IntroView/IntroView'));
const StoryView = lazy(() => import('./ComponentViews/StoryPageView/StoryView'));
const LyricsView = lazy(() => import('./ComponentViews/LyricsPageView/LyricsView'));
const OutroView = lazy(() => import('./ComponentViews/OutroView/OutroView'));
const PoemView = lazy(() => import('./ComponentViews/PoemPageView/PoemView'))
import LyricsBreakdownView from './ComponentViews/LyricsPageView/LyricsBreakdown/LyricsBreakdownView';
import PoemBreakdownView from './ComponentViews/PoemPageView/PoemBreakdown/PoemBreakdownView';
import StoryBreakdownView from './ComponentViews/StoryPageView/StoryBreakdown/StoryBreakdownView';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { IconContext } from "react-icons";
import { FaExpand, FaCompress } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import Checkpoint from './ComponentViews/Checkpoint/Checkpoint';
import * as customMutations from '../../customGraphql/customMutations';
import { API, graphqlOperation } from 'aws-amplify';

const LessonControl = () => {
    const { state } = useContext(LessonControlContext);
    const match = useRouteMatch();
    const history = useHistory();
    const [ componentView, setComponentView ] = useState('');
    const [fullscreen, setFullscreen] = useState(false);

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    const handleSubmitChanges = async () => {
        let updatedClassroomData: any = {
            id: '1',
            open: true,
            displayData: null,
            lessonPlan: state.pages
        }
        
        try {
            const updatedClassroom = await API.graphql(graphqlOperation(customMutations.updateClassroom, {input: updatedClassroomData}))
            console.log(updatedClassroom)
        } catch (err) {
            console.error(err);   
        }
    }

    useEffect(() => {
        
        if (state.studentViewing.live) {
            console.log(state.studentViewing.live)
            history.push(`${match.url}/${state.studentViewing.studentInfo.lessonProgress}`)
        }

    }, [state.studentViewing])

    if ( state.status !== 'loaded') {
        return (
            <LessonLoading />
        )
    }

    return (
        <div className={`w-full h-screen bg-gray-400 p-8`}>
            <div className={`w-full h-full flex flex-col`}>
                <div className={`relative w-full px-8 h-0.5/10 bg-gray-200 mb-2 shadow-elem-light rounded-lg px-4 flex flex-row items-center`}>
                    <h1 className={`w-4/10 text-3xl font-extrabold font-open my-2`}>
                        Where I'm From
                    </h1>

                    <div className={`absolute w-auto mr-8 flex flex-col justify-center items-center px-2 cursor-pointer`} style={{right: 0}}>
                        <NavLink to="/dashboard">
                            <IconContext.Provider value={{ size: '1.5rem'}}>
                                <FaHome />
                            </IconContext.Provider>
                        </NavLink>
                        <p className="text-xs text-center">Home</p>
                    </div>
                </div>
                {/*  */}
                <div className={`w-full h-9/10 flex bg-gray-200 shadow-elem-light p-4 rounded-lg`}>
                    <div className={`${fullscreen ? 'hidden' : 'display'} w-4/10 h-full px-4 flex flex-col items-center`}>
                        <div className={`h-full w-full mb-2`}>
                            <div className={`w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between text-xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Class Roster 
                                </h2>
                                <h2 className={`w-auto`}>
                                    P.Tech Class A
                                </h2>
                            </div>
                            <div className={`h-4/10 my-4`}>
                                <ClassRoster />
                            </div>
                            <div className={`w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between text-xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Teacher Notes 
                                </h2>
                            </div>
                            <textarea id="text" className="bg-gray-300 w-full h-4/10 p-8 my-4 text-sm md:text-2xl text-gray-800 rounded-lg shadow-inner-dark" 
                            // value={input}
                            />
                        </div>
                    </div>
                    <div className={`${fullscreen ? 'w-full' : 'w-6/10'} h-full flex flex-col items-center`}>
                        <div className={`${fullscreen ? 'h-full' : 'h-8/10'} relative w-full bg-dark shadow-elem-light rounded-lg mb-4 p-4`}>
                            {/*  */}
                            {/* <LyricsActivityView
                                student={selectedStudent}
                                fullscreen={fullscreen}/> */}
                            {/*  */}
                            <Suspense fallback={<div> Loading... </div>}>
                                <Switch>
                                    <Route 
                                        path={`${match.url}/intro`}
                                        render={() => (
                                            <IntroView fullscreen={fullscreen} />
                                        )}
                                    />
                                    <Route 
                                        path={`${match.url}/warmup`}
                                        render={() => (
                                            <StoryView fullscreen={fullscreen} />
                                        )}
                                    />
                                    <Route 
                                        path={`${match.url}/corelesson`}
                                        render={() => (
                                            <LyricsView fullscreen={fullscreen} />
                                        )}
                                    />
                                    <Route 
                                        path={`${match.url}/activity`}
                                        render={() => (
                                            <PoemView fullscreen={fullscreen} />
                                        )}
                                    />
                                    <Route 
                                        path={`${match.url}/checkpoint`}
                                        render={() => (
                                            <Checkpoint fullscreen={fullscreen}/>
                                        )}
                                    />
                                    <Route 
                                        path={`${match.url}/outro`}
                                        render={() => (
                                            <OutroView fullscreen={fullscreen} />
                                        )}
                                    />
                                    <Route 
                                        exact
                                        path={`${match.url}/`}
                                        render={({location}) => (
                                            <Redirect 
                                                to={{
                                                pathname: `${match.url}/intro`,
                                                state: { from: location }
                                            }}/>
                                        )}
                                    />
                                </Switch>
                            </Suspense>
                            <div className="absolute cursor-pointer w-auto text-xl m-2 z-50" style={{top: 0, right: 0}} onClick={handleFullscreen}>
                                <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem' }}>
                                    {fullscreen ? < FaCompress /> :< FaExpand />}
                                </IconContext.Provider>
                            </div>
                            <div className="absolute cursor-pointer w-auto text-xl m-2 z-50" style={{bottom: 0, left: 0}}>
                                    <button className="bg-purple-400 bg-opacity-70 text-gray-200 h-8 w-44 rounded-xl shadow-elem-dark">
                                        share data
                                    </button>
                            </div>
                            
                            <div className="absolute cursor-pointer w-auto text-xl m-2 z-50" style={{bottom: 0, right: 0}}>
                                <button className="bg-teal-500 bg-opacity-70 text-gray-200 h-8 w-44 rounded-xl shadow-elem-dark" onClick={handleSubmitChanges}>
                                    apply changes
                                </button>
                            </div>
                        </div>

                        <div className={`${fullscreen ? 'hidden' : 'display'} flex justify-center items-center`}>
                            <LessonControlBar setComponentView={setComponentView} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonControl;