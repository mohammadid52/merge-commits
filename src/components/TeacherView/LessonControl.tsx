import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';
import {
   Switch,
   Route,
   Redirect,
   useRouteMatch,
   useHistory,
   useLocation
} from 'react-router-dom';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaExpand, FaCompress, FaHome, FaRegThumbsUp } from 'react-icons/fa';
import { BsPersonFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Checkpoint from './ComponentViews/Checkpoint/Checkpoint';
import * as customMutations from '../../customGraphql/customMutations';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import ClassRoster from './ClassRoster';
import LessonControlBar from './LessonControlBar/LessonControlBar';
import ToolTip from '../General/ToolTip/ToolTip';
import FooterLabels from '../General/LabelSwitch';
const IntroView = lazy(() => import('./ComponentViews/IntroView/IntroView'));
const StoryView = lazy(() => import('./ComponentViews/StoryPageView/StoryView'));
const LyricsView = lazy(() => import('./ComponentViews/LyricsPageView/LyricsView'));
const OutroView = lazy(() => import('./ComponentViews/OutroView/OutroView'));
const PoemView = lazy(() => import('./ComponentViews/PoemPageView/PoemView'));


const LessonControl = () => {
    const { state, dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();
    const history = useHistory();
    const location = useLocation();
    const [ componentView, setComponentView ] = useState('');
    const [ fullscreen, setFullscreen ] = useState(false);
    const [ studentDataLoading, setStudentDataLoading ] = useState('');
    const [ shareable, setShareable ] = useState(false);
    const [ isSameStudentShared, setIsSameStudentShared ] = useState(false);

    const handleFullscreen = () => {
        setFullscreen(fullscreen => {
            return !fullscreen
        });
    }

    const firstInitialFunc = (str: string) => {
        if (typeof str !== 'string' || str === '') { return 'Profile' }
        let firstInitial = str.charAt(0)
        firstInitial = firstInitial.toUpperCase() + '.';
        return firstInitial;
    }

    const handleUpdateClassroom = async () => {
        let updatedClassroomData: any = {
            id: '1',
            open: true,
            viewing: state.studentViewing.studentInfo && state.studentViewing.studentInfo.studentAuthID ? state.studentViewing.studentInfo.studentAuthID : null,
            displayData: state.displayData,
            lessonPlan: state.pages
        }
        
        try {
            const updatedClassroom = await API.graphql(graphqlOperation(customMutations.updateClassroom, {input: updatedClassroomData}))
            dispatch({ type: 'SAVED_CHANGES' })
        } catch (err) {
            console.error(err);   
        }
    }

    const handleShareStudentData = async () => {
        // console.log(state.studentViewing);
        if ( state.studentViewing.studentInfo ) {
            let displayData = {
                breakdownComponent: state.studentViewing.studentInfo.lessonProgress,
                studentInfo: {
                    id: state.studentViewing.studentInfo.student.id,
                    firstName: state.studentViewing.studentInfo.student.firstName,
                    preferredName: state.studentViewing.studentInfo.student.preferredName ? state.studentViewing.studentInfo.student.preferredName : null,
                    lastName: state.studentViewing.studentInfo.student.lastName
                },
                warmUpData: state.studentViewing.studentInfo.warmupData ? state.studentViewing.studentInfo.warmupData : null, 
                corelessonData: state.studentViewing.studentInfo.corelessonData ? state.studentViewing.studentInfo.corelessonData : null, 
                activityData: state.studentViewing.studentInfo.activityData ? state.studentViewing.studentInfo.activityData : null, 
            }
            // console.log(displayData)
            dispatch({ type: 'SET_SHARE_MODE', payload: state.studentViewing.studentInfo.lessonProgress })
            dispatch({ type: 'SET_DISPLAY_DATA', payload: displayData })
        }
    }

    const handleQuitShare = () => {
        dispatch({ type: 'QUIT_SHARE_MODE' })
        setIsSameStudentShared(false)
    }

    const handleQuitViewing = () => {
        dispatch({ type: 'QUIT_STUDENT_VIEWING'})
        setIsSameStudentShared(false)
    }

    const handleResetDoneCounter = () => {
        dispatch({ type: 'RESET_DONE' })
    }

    // const handleQuitAll = () => {
    //     dispatch({ type: 'QUIT_STUDENT_VIEWING'})
    // }

    useEffect(() => {

        // console.log('changes', state)
        if (state.pages.length > 0 && state.unsavedChanges) {handleUpdateClassroom()}

    }, [state.unsavedChanges])

    useEffect(() => {
        if ( !state.studentDataUpdated ) {
            setStudentDataLoading('loading')
        }
        
        if ( state.studentDataUpdated ) {
            setStudentDataLoading('')
        }

    }, [state.studentDataUpdated])

    useEffect(() => {

        let result = /.+\/(breakdown)\/*.*/.test(location.pathname)
        // console.log('breakdown?', result, location.pathname)

        if ( result ) {
            setShareable(true)
        } 

        if ( !result ) {
            setShareable(false)
        }

    }, [location.pathname])

    useEffect(() => {
        
        if (state.studentViewing.live) {
            // console.log(state.studentViewing.live)
            history.push(`${match.url}/${state.studentViewing.studentInfo.lessonProgress}`)
        }

    }, [state.studentViewing])

    useEffect(() => {
        // console.log('change', state);

        if ( !state.displayData || !state.displayData.studentInfo || !state.studentViewing.studentInfo || !state.studentViewing.studentInfo.student ) {
            // console.log('same student false outer');
            
            setIsSameStudentShared(false)
        }
        
        if ( state.displayData && state.displayData.studentInfo && state.studentViewing.studentInfo && state.studentViewing.studentInfo.student ) {
            
            if ( state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id ) {
                // console.log('same student true');
                
                setIsSameStudentShared(true)
            }

            if ( state.displayData.studentInfo.id !== state.studentViewing.studentInfo.student.id ) {
                // console.log('same student false inner');
                
                setIsSameStudentShared(false)
            }

            if ( state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id && !state.studentViewing.live ) {
                // console.log('live false');
                
                setIsSameStudentShared(false)
            }

            // if (handleQuitShare) {
            //     console.log('not being displayed')
                
            //     setIsSameStudentShared(false)
            // }
        }
 
    }, [state.displayData, state.studentViewing])

    useEffect(() => {
        console.log(state);
        
    }, [state.studentViewing])

    if ( state.status !== 'loaded') {
        return (
            <ComponentLoading />
        )
    }

    return (
        <div className={`w-full h-screen bg-gray-200`}>
            <div className={`w-full h-full flex flex-col`}>
                <div className={`relative w-full h-1/10 border-b border-gray-400 flex flex-row items-center`} 
                // onClick={handleQuitAll}
                >
                    <h1 className={`w-3/10 text-3xl pl-4 font-extrabold font-open`}>
                        Where I'm From
                    </h1>

                    <div className="w-6/10 flex justify-around items-center">

                        <div className="w-1/3 flex justify-center items-center">
                            <div className="w-full flex flex-col justify-center items-center">
                                <div className="w-6/10 font-semibold text-indigo-500 text-center">
                                    <span className="font-normal text-black">currently </span> viewing:
                                </div>
                                <div className="w-full flex justify-center items-center">
                                    <div className={`w-auto px-2 flex justify-center items-center ${state.studentViewing.studentInfo && state.studentViewing.studentInfo.id ? 'bg-indigo-500 hover:bg-indigo-400 text-gray-200 rounded-xl text-xl font-semibold overflow-x-auto shadow-elem-dark cursor-pointer': 'text-black text-xs'}`} onClick={handleQuitViewing}>
                                        { state.studentViewing.studentInfo && state.studentViewing.studentInfo.id ? state.studentViewing.studentInfo.student.firstName + ' ' + firstInitialFunc(state.studentViewing.studentInfo.student.lastName): '(click on a student)' }
                                    </div>
                                    <div className={`w-auto ml-2 ${state.studentViewing.live ? '' : 'hidden'}`}>
                                        { 
                                            state.studentViewing.live ?
                                            <div className="font-bold cursor-pointer text-xl text-red-700 hover:text-red-400 flex justify-center items-center" onClick={handleQuitViewing}>
                                                X
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="w-2/10 flex justify-center items-center mr-8">
                                
                            <div className="w-full">
                                {   
                                    shareable && state.studentViewing.live &&!isSameStudentShared ? 
                                        <div className={` cursor-pointer w-auto text-xl z-50`} style={{bottom: 0, left: 0}}>
                                            <button className="bg-purple-400 hover:bg-purple-300 text-gray-200 h-8 w-36 rounded-xl shadow-elem-dark" onClick={handleShareStudentData}>
                                                share student
                                            </button>
                                        </div>
                                    : null
                                }
                            </div>
                        </div>

                        <div className={`w-1/3 h-18 ${state.sharing ? 'border-dotted border-4 border-red-700 ' : ''} flex justify-around items-center `}>
                            <div className={`${state.sharing ? '' : 'hidden'} w-full h-full flex flex-col justify-center items-center`}>
                                <div className="w-6/10 h-4/10 text-purple-400 font-semibold text-center"> 
                                    <span className="font-normal text-black">currently </span> sharing:
                                </div>
                                <div className="w-full h-full flex justify-center items-center">
                                    <div className={`w-auto px-2 flex justify-center items-center ${state.sharing ? 'bg-purple-400 hover:bg-purple-300 shadow-elem-dark rounded-xl text-gray-200 text-xl font-semibold cursor-pointer' : 'text-black text-xs' }`} onClick={handleQuitShare}>
                                        { state.sharing ? state.displayData.studentInfo.firstName + ' ' + firstInitialFunc(state.displayData.studentInfo.lastName): '(share student info)'  }
                                    </div>
                                    <div className={`w-auto ml-2 ${state.sharing ? '' : 'hidden'}`}>
                                        {   
                                            state.sharing ?
                                            <div className="font-bold cursor-pointer text-xl text-red-700 hover:text-red-400 flex justify-center items-center" onClick={handleQuitShare}>
                                                X
                                            </div>
                                            :
                                            null
                                        } 
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                
                    <div className={`w-1/10 pr-4 flex flex-col justify-center items-center px-2 cursor-pointer`} style={{right: 0}}>
                        <NavLink to="/dashboard">
                            <IconContext.Provider value={{ size: '1.5rem'}}>
                                <FaHome />
                            </IconContext.Provider>
                        </NavLink>
                        <p className="text-xs text-center">Home</p>
                    </div>
                </div>
                <div className={`w-full h-9/10 flex p-3 pb-5 rounded-lg`}>
                    <div className={`${fullscreen ? 'hidden' : ''} w-4/10 h-full pr-4 flex flex-col items-center`}>
                        <div className={`h-full w-full flex flex-col justify-between items-center`}>
                            <div className={`h-.8/10 w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between items-center text-2xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Class Roster 
                                </h2>

                                <h2 className={`w-3/10 flex justify-between`}>
                                <div className="w-4/10 flex justify-around items-center relative">
                                    <ToolTip position='hidden-bottom' header='' content='students in class' display='none' fontSize= 'text-xs'/>
                                    <div className="w-auto">
                                        <IconContext.Provider value={{ size: '1.4rem', style: {width: 'auto'}}}>
                                            <BsPersonFill />
                                        </IconContext.Provider>
                                    </div>
                                    <div className="w-auto">
                                        { state.roster.length }
                                    </div>
                                </div>

                                <div className="w-4/10 flex justify-around items-center">
                                    {/* <ToolTip position='hidden-bottom' header='' content='students who are ready (click to reset)' width='w-20' cursor display='none' fontSize= 'text-xs'/> */}
                                    <div className="w-auto relative" onClick={handleResetDoneCounter}>
                                    <ToolTip position='hidden-bottom'  
                                        cursor
                                        header=''
                                        width='w-24'
                                        content= {<div className="flex flex-col"><div>students who are ready</div> <p className="font-bold"> (click to reset)</p></div>}
                                        display='none' fontSize= 'text-xs'/>
                                        <IconContext.Provider value={{ size: '1.4rem', style: {width: 'auto'}}}>
                                            <FaRegThumbsUp style={{ pointerEvents: 'none' }}/>
                                        </IconContext.Provider>
                                    </div>
                                    <div className="w-auto">
                                       { state.done.length }
                                    </div>
                                </div>
                                </h2>
                            </div>

                            
                            <div className={`h-9/10`}>
                                <ClassRoster 
                                    handleUpdateClassroom={handleUpdateClassroom}
                                />
                            </div>
                            {/* <div className={`w-full px-4 bg-dark shadow-elem-light rounded-lg flex justify-between text-xl text-gray-200 font-extrabold font-open`}>
                                <h2 className={`w-auto`}>
                                    Teacher Notes 
                                </h2>
                            </div>
                            <textarea id="text" className="bg-gray-300 w-full h-4/10 p-8 my-4 text-sm md:text-2xl text-gray-800 rounded-lg shadow-inner-dark" 
                            // value={input}
                            /> */}
                        </div>
                    </div>
                    {/* <div className={`${fullscreen ? 'w-full' : 'w-6/10'} h-full flex flex-col items-center`}>
                        <div className={`${fullscreen ? 'h-full' : 'h-8.3/10'} relative w-full bg-dark shadow-elem-light rounded-lg mb-4 p-4`}> */}
                    <div className={`relative ${fullscreen ? 'w-full' : 'w-6/10'} h-full flex flex-col items-center`}>
                        {
                            studentDataLoading === 'loading' ? 
                            <div className={`absolute h-8/10 bg-dark bg-opacity-75 flex flex-col justify-center items-center rounded-lg z-50`}>
                                <div className={`text-center text-3xl text-gray-200 `}>
                                    Loading student data...
                                </div>
                            </div>
                            : null
                        }
                        <div className={`${fullscreen ? 'h-full' : 'h-8.3/10'} relative w-full bg-dark shadow-elem-light rounded-lg mb-4 p-4`}>
                            {/*  */}
                            {/* <LyricsActivityView
                                student={selectedStudent}
                                fullscreen={fullscreen}/> */}
                            {/*  */}
                                    
                            <Suspense fallback={
                                <div className="min-h-screen w-full flex flex-col justify-center items-center">
                                    <ComponentLoading />
                                </div>
                            }>  
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

                            <div className="cursor-pointer w-full text-xl m-2 z-50"  onClick={handleFullscreen}>
                                <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: {width: 'auto', right: '0', top: '0', position: 'absolute', marginRight: '.5rem', marginTop: '.5rem', zIndex: 50} }}>
                                    {fullscreen ? < FaCompress /> :< FaExpand />}
                                </IconContext.Provider>
                            </div>
                        </div>

                        <div className={`${fullscreen ? 'hidden' : ''} relative flex justify-center items-center`}>
                            <div className="absolute w-8 h-8" style={{top: '-10px', right: 0}}>
                                <ToolTip
                                    color= 'black'
                                    width= 'w-96'
                                    position='top-left'
                                    header=''
                                    content={
                                        <div className="flex">
                                            <div className="flex flex-col">
                                                <h1 className="font-bold">View:</h1>
                                                <p>view the page</p>
                                            </div>
                                            <div className="flex flex-col px-1">
                                                <h1 className="font-bold">Close/Open:</h1>
                                                <p>the students can progress to this component</p>
                                            </div>
                                            <div className="flex flex-col px-1">
                                                <h1 className="font-bold">Enable/Disable:</h1>
                                                <p>the students will be able to see/unsee this component on their footer</p>
                                            </div>
                                        </div>
                                    }
                                    />
                                </div>
                            <LessonControlBar setComponentView={setComponentView} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonControl;