import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { 
    NavLink,
    // useHistory, 
    // useLocation, 
    // useRouteMatch 
} from 'react-router-dom';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaRegSave, FaHome, FaBook, FaRegThumbsUp } from 'react-icons/fa';
import { AiOutlineSave, AiOutlineHome } from 'react-icons/ai';
import { FiClock } from 'react-icons/fi'
import { LessonContext } from '../../contexts/LessonContext';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../customGraphql/customMutations';
// import useDictionary from '../../customHooks/dictionary';
import useStudentTimer from '../../customHooks/timer';


const LessonHeaderBar = () => {
    const [ cookies, setCookie ] = useCookies(['lesson']);
    // const match = useRouteMatch();
    // const location = useLocation();
    // const history = useHistory();
    const { theme, state, dispatch } = useContext(LessonContext);
    // const [ dictOpen, setDictOpen ] = useState(false);
    // const { lookUp } = useDictionary('EN');
    // const [ searchTerm, setSearchTerm ] = useState('');

    useEffect(() => {
        if ( !state.pages[0].active ) {
            // console.log('here', state);
            dispatch({ type: 'SET_PROGRESS', payload: state.lessonProgress })
        }
    }, [state.pages, state.currentPage])

    useEffect(() => {
        if ( cookies.lesson ) {
            // console.log(state.lessonProgress)
            setCookie('lesson', { ...cookies.lesson, lessonProgress: state.lessonProgress })
        }

        if ( !cookies.lesson ) {
            setCookie('lesson', { lessonProgress: 0 })
        }
    }, [state.lessonProgress])

    // useEffect(() => {
    //     console.log(state.studentStatus);
        
    // }, [state.studentStatus])

    const updateStudentData = async ( saveType?: string) => {
        let lessonProgress = state.pages[state.lessonProgress].stage === '' ? 'intro' : state.pages[state.lessonProgress].stage;

        // console.log('thisone', state )

        let data = {
            id: state.studentDataID,
            lessonProgress: lessonProgress,
            status: state.studentStatus,
            saveType: saveType,
            classroomID: 1,
            studentID: state.studentUsername,
            studentAuthID: state.studentAuthID,
            warmupData: state.componentState.story ? state.componentState.story : null,
            corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
            activityData: state.componentState.poem ? state.componentState.poem : null
        }

        console.log('update', data);
        
        try {
            const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }))
            console.log(dataObject)
            dispatch({ type: 'SAVED_CHANGES' })
            console.log('state', state)
        } catch (error) {
            console.error(error);   
        }
    }

    const handleDone = () => {
        if ( state.unsavedChanges ) {
            updateStudentData('done')
        }
    }

    // const toggleDictionary = () => {
    //     setDictOpen(() => {
    //         return !dictOpen
    //     })
    // }

    // const handleSearchChange = (e: { target: any }) => {
    //     const { value } = e.target
    //     setSearchTerm(value)
    // }

    // const handleEnterSearch = (e: { key: string }) => {
    //     if (e.key === 'Enter') {
    //        lookUp(searchTerm) 
    //     }
    // }

    const { startTimer, changeParams } = useStudentTimer({
        dispatch: dispatch,
        subscription: state.subscription,
        subscribeFunc: state.subscribeFunc,
        callback: updateStudentData,
        state: state,
    });
        
    useEffect(() => {
        changeParams('state', state)
        // console.log('state', state);
        // console.log('subInfo', subscription, subscribeFunc );
        
        
        // startTimer()
    }, [state.studentStatus, state.viewing, state.saveCount, state.subscription])

    return (
        <div className={`z-40 center w-full h-.7/10 ${theme.toolbar.bg} text-gray-200 shadow-2xl flex justify-between`}>
            <div className={`w-56 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    <img className="h-6 px-4" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`relative w-56 h-full flex flex-row justify-end items-center px-8 pt-1`}>
                {/* <div className={`flex flex-col justify-center items-center px-2`}>
                    <div className={`flex flex-col justify-center items-center px-2 cursor-pointer`} onClick={toggleDictionary}>
                        <IconContext.Provider value={{ color: state.unsavedChanges ? '#EDF2F7' : '#4A5568', size: '1.5rem'}}>
                            <FaBook />
                        </IconContext.Provider>
                        <p className="text-xs text-gray-200 text-center">Dict.</p>
                    </div>
                    { dictOpen ? 
                        <div className={`absolute flex flex-col items-center transform translate-y-44 z-50`}>
                            <div className={`arrow-up`}></div>
                            <div className={`w-56 h-72 bg-dark p-2 shadow-elem-dark`}>
                                <div className={`w-full h-full `}>
                                    <label htmlFor="email" className="sr-only">Search</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input id="search" className="form-input block w-full sm:text-sm sm:leading-5 text-gray-800" placeholder="Press Enter to search." onChange={handleSearchChange} onKeyDown={handleEnterSearch} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null
                    } 
                </div> */}
                {/* <div className={`flex flex-col justify-center items-center px-2`} onClick={() => { dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'IDLE' }) }}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">SetIdle</p>
                </div> */}
                <div className={`flex flex-col justify-center items-center px-2`} onClick={() => { dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' }) }}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">SetActive</p>
                </div>
                {/* <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onPointerDown={startAutoSave} onPointerUp={clearAutoSave}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">AutoSave</p>
                </div> */}
                <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onClick={startTimer}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">Timer</p>
                </div>
                {
                    !state.viewing ?
                    <div className={`w-4.5/10 ${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onClick={handleDone}>
                        <IconContext.Provider value={{ color: state.unsavedChanges ? '#EDF2F7' : '#4A5568', size: '1.5rem'}}>
                            <FaRegThumbsUp />
                        </IconContext.Provider>
                        <p className={`text-xs text-gray-200 text-center`} style={{color: state.unsavedChanges ? '#EDF2F7' : '#4A5568'}}>Done</p>
                    </div>
                    :
                    <div className={`w-4.5/10 cursor-default flex flex-col justify-center items-center px-2`}>
                        <div className="relative flex items-center justify-center h-4 w-4 m-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600"></span>
                        </div>
                        <p className={`self-end text-xs text-gray-200 text-center`}>AutoSave</p>
                    </div>
                }
                <div className={`w-4.5/10 flex flex-col justify-center items-center px-2 cursor-pointer`}>
                    <NavLink to="/dashboard">
                        <IconContext.Provider value={{ size: '1.5rem'}}>
                            <AiOutlineHome />
                        </IconContext.Provider>
                    </NavLink>
                    <p className="text-xs text-gray-200 text-center">Home</p>
                </div>
            </div>
        </div>
    )
}

export default LessonHeaderBar;