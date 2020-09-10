import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { 
    NavLink,
    // useHistory, 
    // useLocation, 
    // useRouteMatch 
} from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaRegSave, FaHome, FaBook } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi'
import { LessonContext } from '../../contexts/LessonContext';
import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../customGraphql/customMutations';
// import useDictionary from '../../customHooks/dictionary';
import useStudentTimer from '../../customHooks/timer';


const LessonHeaderBar = () => {
    const [ cookies, setCookie ] = useCookies(['lesson']);
    // const match = useRouteMatch();
    // const location = useLocation();
    // const history = useHistory();
    const { theme, state, dispatch, subscription } = useContext(LessonContext);
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

    useEffect(() => {
        console.log(state.studentStatus);
        
    }, [state.studentStatus])

    const updateStudentData = async () => {
        let lessonProgress = state.pages[state.lessonProgress].stage === '' ? 'intro' : state.pages[state.lessonProgress].stage;

        // console.log('thisone', state )

        let data = {
            id: state.studentDataID,
            lessonProgress: lessonProgress,
            status: state.studentStatus,
            classroomID: 1,
            studentID: cookies.auth.email,
            studentAuthID: cookies.auth.authId,
            warmupData: state.componentState.story ? state.componentState.story : null,
            corelessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
            activityData: state.componentState.poem ? state.componentState.poem : null
        }

        // console.log('update', data);
        
        try {
            const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateStudentData, { input: data }))
            console.log(dataObject)
            dispatch({ type: 'SAVED_CHANGES' })
            console.log('state', state)
        } catch (error) {
            console.error(error);   
        }
    }

    const handleSave = () => {
        if ( state.unsavedChanges ) {
            updateStudentData()
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

    const { startTimer, startAutoSave, clearAutoSave } = useStudentTimer({
        dispatch: dispatch,
        subscription: subscription,
        callback: updateStudentData,
    });
        
    // useEffect(() => {
    //     startTimer()
    // }, [state.currentPage, state.componentState])

    return (
        <div className={`center w-full h-.7/10 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-between`}>
            <div className={`w-56 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    <img className="h-6 px-4" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`relative w-56 h-full flex flex-row justify-end items-center px-8`}>
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
                <div className={`flex flex-col justify-center items-center px-2`} onClick={() => { dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'IDLE' }) }}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">SetIdle</p>
                </div>
                <div className={`flex flex-col justify-center items-center px-2`} onClick={() => { dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' }) }}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">SetActive</p>
                </div>
                <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onPointerDown={startAutoSave} onPointerUp={clearAutoSave}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">AutoSave</p>
                </div>
                <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onClick={startTimer}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                        <FiClock />
                    </IconContext.Provider>
                    <p className="text-xs text-gray-200 text-center">Timer</p>
                </div>
                <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex flex-col justify-center items-center px-2`} onClick={handleSave}>
                    <IconContext.Provider value={{ color: state.unsavedChanges ? '#EDF2F7' : '#4A5568', size: '1.5rem'}}>
                        <FaRegSave />
                    </IconContext.Provider>
                    <p className={`text-xs text-gray-200 text-center`} style={{color: state.unsavedChanges ? '#EDF2F7' : '#4A5568'}}>Save</p>
                </div>
                <div className={`flex flex-col justify-center items-center px-2 cursor-pointer`}>
                    <NavLink to="/dashboard">
                        <IconContext.Provider value={{ size: '1.5rem'}}>
                            <FaHome />
                        </IconContext.Provider>
                    </NavLink>
                    <p className="text-xs text-gray-200 text-center">Home</p>
                </div>
            </div>
        </div>
    )
}

export default LessonHeaderBar;