import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaRegSave, FaHome } from 'react-icons/fa';
import { LessonContext } from '../../contexts/LessonContext';
import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../customGraphql/customMutations';


const LessonHeaderBar = () => {
    const [ cookies, setCookie, removeCookie ] = useCookies(['lesson']);
    const match = useRouteMatch();
    const location = useLocation();
    const history = useHistory();
    const { theme, state, dispatch } = useContext(LessonContext);

    useEffect(() => {
        if ( cookies.lesson ) {
            if ( cookies.lesson.lessonProgress > 0 ) {
                dispatch({ type: 'SET_PROGRESS', payload: cookies.lesson.lessonProgress })
                // history.push(`${match.url}/${state.pages[cookies.lesson.lessonProgress].stage}`)
            }
        }

        if ( !cookies.lesson ) {
            setCookie('lesson', { lessonProgress: 0 })
        }
    }, [])

    useEffect(() => {
        if ( cookies.lesson ) {
            console.log(state.lessonProgress)
            setCookie('lesson', { ...cookies.lesson, lessonProgress: state.lessonProgress })
        }
    }, [state.lessonProgress])

    async function createClassroomData() {
        let data = {
            lessonProgress: cookies.lesson.lessonProgress,
            classroomID: 1,
            studentID: cookies.auth.email,
            data: {
                warmup: state.componentState.story ? state.componentState.story : null,
                corelesson: state.componentState.lyrics ? state.componentState.lyrics : null,
                activity: state.componentState.poem ? state.componentState.poem : null
            }
        }

        console.log('write', data)

        try {
            const dataObject: any = await API.graphql(graphqlOperation(customMutations.createClassroomDataTest, { input: data }))
            console.log(dataObject)
            dispatch({ type: 'SAVED_CHANGES' })
        } catch (error) {
            console.error(error);   
        }
    }

    async function updateClassroomData() {
        let data = {
            lessonProgress: cookies.lesson.lessonProgress,
            classroomID: 1,
            studentID: cookies.auth.email,
            data: {
                warmup: state.componentState.story ? state.componentState.story : null,
                corelesson: state.componentState.lyrics ? state.componentState.lyrics : null,
                activity: state.componentState.poem ? state.componentState.poem : null
            }
        }

        console.log('update', data);
        

        try {
            const dataObject: any = await API.graphql(graphqlOperation(customMutations.updateClassroomDataTest, { input: data }))
            console.log(dataObject)
            dispatch({ type: 'SAVED_CHANGES' })
        } catch (error) {
            console.error(error);   
        }
    }

    const handleSave = () => {
        if ( state.unsavedChanges ) {
            if ( !state.firstSave ) {
                createClassroomData()
            }
    
            if ( state.firstSave ) {
                updateClassroomData()
            }
        }
    }
        

    return (
        <div className={`center w-full h-12 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-between`}>
            <div className={`w-56 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    <img className="h-6 px-4" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`w-48 h-full flex flex-row justify-end items-center px-8`}>
                <div className={`${state.unsavedChanges ? 'cursor-pointer' : 'cursor-default'} flex justify-center items-center px-2`} onClick={handleSave}>
                    <IconContext.Provider value={{ color: state.unsavedChanges ? '#EDF2F7' : '#4A5568', size: '1.5rem'}}>
                        <FaRegSave />
                    </IconContext.Provider>
                </div>
                <div className={`px-2`}>
                    <NavLink to="/dashboard">
                        <IconContext.Provider value={{ size: '1.5rem'}}>
                            <FaHome />
                        </IconContext.Provider>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default LessonHeaderBar;