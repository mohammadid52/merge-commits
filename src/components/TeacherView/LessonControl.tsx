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
import { FiUsers } from 'react-icons/fi';
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
import PositiveAlert from '../General/Popup';
import { useOutsideAlerter } from '../General/hooks/outsideAlerter';
import Body from './Body';
import TopMenu from './TopMenu';
import ClassRosterTitleBar from './ClassRosterTitleBar';

const IntroView = lazy(() => import('./ComponentViews/IntroView/IntroView'));
const StoryView = lazy(() => import('./ComponentViews/StoryPageView/StoryView'));
const LyricsView = lazy(() => import('./ComponentViews/LyricsPageView/LyricsView'));
const OutroView = lazy(() => import('./ComponentViews/OutroView/OutroView'));
const PoemView = lazy(() => import('./ComponentViews/PoemPageView/PoemView'));


const LessonControl = () => {
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();
    const history = useHistory();
    const location = useLocation();
    const [fullscreen, setFullscreen] = useState(false);
    // const [ studentDataLoading, setStudentDataLoading ] = useState('');
    const [shareable, setShareable] = useState(false);
    const [isSameStudentShared, setIsSameStudentShared] = useState(false);
    const [open, setOpen] = useState(state.open);
    console.log(state, 'state')

    // console.log(open, 'open');

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

    useEffect(() => {
        // console.log(state, 'state')
    }, [])

    const handleUpdateClassroom = async () => {
        let updatedClassroomData: any = {
            id: state.classroomID,
            open: state.open ? state.open : false,
            viewing: state.studentViewing.studentInfo && state.studentViewing.studentInfo.studentAuthID ? state.studentViewing.studentInfo.studentAuthID : null,
            displayData: state.displayData,
            lessonPlan: state.pages
        }

        try {
            const updatedClassroom = await API.graphql(graphqlOperation(customMutations.updateClassroom, { input: updatedClassroomData }))
            dispatch({ type: 'SAVED_CHANGES' })
            // console.log(updatedClassroom);

        } catch (err) {
            console.error(err);
        }
    }

    const handleUpdateClassroomDate = async () => {
        let updatedClassroomDateData: any = {
            id: state.classroomID,
            open: state.open ? state.open : false,
            lessonPlan: state.pages,
            complete: state.complete,
            expectedStartDate: state.expectedStartDate,
            expectedEndDate: state.expectedEndDate
        }

        try {
            const updatedClassroomDate = await API.graphql(graphqlOperation(customMutations.updateClassroomDate, { input: updatedClassroomDateData }))
            dispatch({ type: 'SAVED_CHANGES' })
            // console.log(updatedClassroom);

        } catch (err) {
            console.error(err);
        }
    }

    const handleShareStudentData = async () => {
        // console.log(state.studentViewing);
        if (state.studentViewing.studentInfo) {
            let displayData = {
                breakdownComponent: state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation : state.studentViewing.studentInfo.lessonProgress,
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
            console.log(displayData)
            dispatch({ type: 'SET_SHARE_MODE', payload: state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation : state.studentViewing.studentInfo.lessonProgress })
            dispatch({ type: 'SET_DISPLAY_DATA', payload: displayData })
        }
    }

    const handleOpen = () => {
        dispatch({ type: 'START_CLASSROOM' })
        setOpen(true);
        // console.log(state)
    }

    const handleComplete = () => {
        dispatch({ type: 'COMPLETE_CLASSROOM' })
        setOpen(true);
        // console.log(state)
    }

    const handleQuitShare = () => {
        dispatch({ type: 'QUIT_SHARE_MODE' })
        setIsSameStudentShared(false)
    }

    const handleQuitViewing = () => {
        dispatch({ type: 'QUIT_STUDENT_VIEWING' })
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
        if (state.pages.length > 0 && state.unsavedChanges) { handleUpdateClassroom() }

    }, [state.unsavedChanges])

    useEffect(() => {
        // if ( !state.studentDataUpdated ) {
        //     setStudentDataLoading('loading')
        // }

        // if ( state.studentDataUpdated ) {
        //     setStudentDataLoading('')
        // }

    }, [state.studentDataUpdated])

    useEffect(() => {

        let result = /.+\/(breakdown)\/*.*/.test(location.pathname)
        // console.log('breakdown?', result, location.pathname)

        if (result) {
            setShareable(true)
        }

        if (!result) {
            setShareable(false)
        }

    }, [location.pathname])

    useEffect(() => {

        if (state.studentViewing.live) {
            // console.log(state.studentViewing.live)
            let hasCurrentLocation = typeof state.studentViewing.studentInfo.currentLocation === 'string';

            console.log(typeof state.studentViewing.studentInfo.currentLocation, hasCurrentLocation);


            if (hasCurrentLocation) {
                history.push(`${match.url}/${state.studentViewing.studentInfo.currentLocation}`)
            }

            if (!hasCurrentLocation) {
                history.push(`${match.url}/${state.studentViewing.studentInfo.lessonProgress}`)
            }

        }

    }, [state.studentViewing])

    useEffect(() => {
        // console.log('change', state);

        if (!state.displayData || !state.displayData.studentInfo || !state.studentViewing.studentInfo || !state.studentViewing.studentInfo.student) {
            // console.log('same student false outer');

            setIsSameStudentShared(false)
        }

        if (state.displayData && state.displayData.studentInfo && state.studentViewing.studentInfo && state.studentViewing.studentInfo.student) {

            if (state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id) {
                // console.log('same student true');

                setIsSameStudentShared(true)
            }

            if (state.displayData.studentInfo.id !== state.studentViewing.studentInfo.student.id) {
                // console.log('same student false inner');

                setIsSameStudentShared(false)
            }

            if (state.displayData.studentInfo.id === state.studentViewing.studentInfo.student.id && !state.studentViewing.live) {
                // console.log('live false');

                setIsSameStudentShared(false)
            }

            // if (handleQuitShare) {
            //     console.log('not being displayed')

            //     setIsSameStudentShared(false)
            // }
        }

    }, [state.displayData, state.studentViewing])

    const { visible, setVisible, ref } = useOutsideAlerter(false);

    const [homePopup, setHomePopup] = useState(false);
    const [lessonButton, setLessonButton] = useState(false);

    const handleClick = () => {
        setVisible((prevState: any) => !prevState)
    }

    const handleHomePopup = () => {
        setHomePopup((prevState: any) => !prevState)
    }

    const handleLessonButton = () => {
        setLessonButton((prevState: any) => !prevState)
    }

    const handleSubmit = () => {
        history.push('/dashboard/manage-users');
    }

    const handleHome = () => {
        history.push('/dashboard/lesson-planner');
    }

    if (state.status !== 'loaded') {
        return (
            <ComponentLoading />
        )
    }

    return (
        <div className={`w-full h-screen bg-gray-200`}>
            <div className={`relative w-full h-full flex flex-col`}>
                <div className={`${visible ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleClick}>
                    <PositiveAlert
                        alert={visible}
                        setAlert={setVisible}
                        header='Are you sure you want to leave the Teacher View?'
                        button1='Go to student management'
                        button2='Cancel'
                        svg='question'
                        handleButton1={handleSubmit}
                        handleButton2={() => handleClick}
                        theme='light'
                        fill='screen'
                    />
                </div>
                <div className={`${homePopup ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleHomePopup}>
                    <PositiveAlert
                        alert={homePopup}
                        setAlert={setHomePopup}
                        header='Are you sure you want to leave the Teacher View?'
                        button1='Go to the dashboard'
                        button2='Cancel'
                        svg='question'
                        handleButton1={handleHome}
                        handleButton2={() => handleHomePopup}
                        theme='light'
                        fill='screen'
                    />
                </div>
                <div className={`${lessonButton ? 'absolute z-100 h-full' : 'hidden'}`} onClick={handleLessonButton}>
                    <PositiveAlert
                        alert={lessonButton}
                        setAlert={setLessonButton}
                        header='Are you sure you want to close this lesson?'
                        button1='Complete lesson'
                        button2='Cancel'
                        svg='question'
                        handleButton1={handleHome}
                        handleButton2={() => handleLessonButton}
                        theme='light'
                        fill='screen'
                    />
                </div>






                {/* START TOP MENU */}
                <TopMenu 
                shareable={shareable}
                setShareable={setShareable}
                isSameStudentShared={isSameStudentShared}
                handleOpen={handleOpen}
                handleLessonButton={handleLessonButton}
                handleQuitViewing={handleQuitViewing}
                handleShareStudentData={handleShareStudentData}
                handleQuitShare={handleQuitShare}
                handleClick={handleClick}
                handleHomePopup={handleHomePopup}
                />
                {/* END TOP MENU */}







                <div className={`w-full h-8.5/10 flex p-3 pb-5 rounded-lg`}>
                    <div className={`${fullscreen ? 'hidden' : ''} w-4/10 h-full pr-4 flex flex-col items-center`}>
                        <div className={`h-full w-full flex flex-col justify-between items-center`}>
                            
                            
                            <div className={`h-.8/10 w-full px-4 bg-dark rounded-lg flex justify-between items-center text-2xl text-gray-200 font-bold font-open`}>
                               <ClassRosterTitleBar handleResetDoneCounter={handleResetDoneCounter} />
                            </div>


                            <div className={`h-9/10`}>
                                <ClassRoster
                                    handleUpdateClassroom={handleUpdateClassroom}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`relative ${fullscreen ? 'w-full' : 'w-6/10'} h-full flex flex-col items-center`}>

                        <div className={`${fullscreen ? 'h-full' : 'h-8.3/10'} relative w-full ${theme.bg} rounded-lg mb-4 p-4 overflow-y-scroll overflow-x-hidden`}>

                            <Suspense fallback={
                                <div className="min-h-screen w-full flex flex-col justify-center items-center">
                                    <ComponentLoading />
                                </div>
                            }>
                                <Body />

                            </Suspense>

                        </div>

                        <div className="cursor-pointer w-full text-xl m-2 z-50" onClick={handleFullscreen}>
                            <IconContext.Provider value={{ color: '#E2E8F0', size: '2rem', style: { width: 'auto', right: '1rem', top: '0', position: 'absolute', marginRight: '.5rem', marginTop: '.5rem', zIndex: 50 } }}>
                                {fullscreen ? < FaCompress /> : < FaExpand />}
                            </IconContext.Provider>
                        </div>

                        <div className={`${fullscreen ? 'hidden' : ''} relative flex justify-center items-center`}>
                            <div className="absolute w-8 h-8" style={{ top: '-10px', right: 0 }}>
                                <ToolTip
                                    color='black'
                                    width='w-96'
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
                            <LessonControlBar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LessonControl;