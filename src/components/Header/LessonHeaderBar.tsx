import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavLink, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
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
                warmUpData: state.componentState.story ? state.componentState.story : null,
                coreLessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
                activityData: state.componentState.poem ? state.componentState.poem : null
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
                warmUpData: state.componentState.story ? state.componentState.story : null,
                coreLessonData: state.componentState.lyrics ? state.componentState.lyrics : null,
                activityData: state.componentState.poem ? state.componentState.poem : null
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
        <div className={`w-full h-12 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-between`}>
            <div className={`w-2/12 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    SELReady
                </NavLink>
            </div>
            <div className={`w-48 h-full flex flex-row justify-center items-center`}>
                <div className={`${state.unsavedChanges ? 'bg-green-600 text-gray-300 shadow-elem-dark cursor-pointer' : 'bg-gray-500 text-gray-600 cursor-default'} flex justify-center items-center w-16 h-8 rounded font-open font-bold`} onClick={handleSave}>
                    { state.unsavedChanges ? 'Save' : 'Saved!' }
                </div>
            </div>
        </div>
    )
}

export default LessonHeaderBar;