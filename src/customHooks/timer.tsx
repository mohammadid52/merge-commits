import React, { useState, useEffect } from 'react'
import { LessonActions } from '../reducers/LessonReducer'
// import { LessonStateType } from '../state/LessonState';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../customGraphql/customMutations';
// import { FaSatellite } from 'react-icons/fa';

interface inputs {
    subscription?: any,
    dispatch: React.Dispatch<LessonActions>,
    callback?: () => Promise<void>;
    state?: any;
}

interface timerStateType {
    subscription?: any,
    dispatch: React.Dispatch<LessonActions>,
    callback?: () => Promise<void>;
    state?: any;
    activeTimer?: any;
    idleTimer?: any;
    autoSaveInterval?: any;
}

const useStudentTimer = (inputs?: inputs) => {
    const { subscription, dispatch, callback, state } = inputs;
    const [ params, setParams ] = useState<timerStateType>({
        subscription: subscription,
        dispatch: dispatch,
        callback: callback,
        state: state,
        activeTimer: null,
        idleTimer: null,
        autoSaveInterval: null,
    });

    useEffect(() => {
        if (params.state.studentStatus === 'IDLE' || params.state.studentStatus === 'OFFLINE') { updateStudentData() }

        if ( params.subscription && params.state.studentStatus === 'OFFLINE' ) { params.subscription.unsubscribe() }

    }, [params.state.studentStatus])

    useEffect(() => {
        if ( params.state.viewing ) {
            startAutoSave()
        }

        if ( !params.state.viewing ) {
            clearAutoSave()
        }
        
    }, [params.state.viewing])

    useEffect(() => {
        if ( params.state.viewing ) {
            console.log(params.state.saveCount);
            updateStudentData('autosave')
        }
    }, [params.state.saveCount])

    const updateStudentData = async (saveType?: string) => {
        let lessonProgress = params.state.pages[params.state.lessonProgress].stage === '' ? 'intro' : params.state.pages[params.state.lessonProgress].stage;

        // console.log('thisone', params.state )

        let data = {
            id: state.studentDataID,
            lessonProgress: lessonProgress,
            saveType: saveType,
            status: params.state.studentStatus,
            classroomID: 1,
            studentID: params.state.studentUsername,
            studentAuthID: params.state.studentAuthID,
            warmupData: params.state.componentState.story ? params.state.componentState.story : null,
            corelessonData: params.state.componentState.lyrics ? params.state.componentState.lyrics : null,
            activityData: params.state.componentState.poem ? params.state.componentState.poem : null
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

    const changeParams = (key: string, updatedValue: any) => {
        setParams(prev => {
            return {
                ...prev,
                [key]: updatedValue
            }
        })
    }

    const startTimer = () => {
        clearTimeout(params.activeTimer)
        clearTimeout(params.idleTimer)
        params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' })
        // console.log('active');

        params.activeTimer = setTimeout(() => {
            clearTimeout(params.activeTimer)
            params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'IDLE' })
            // await updateStudentData()
            // console.log('idle')
            // if ( params.callback ) { params.callback() }

        }, 3000)

        params.idleTimer = setTimeout(() => {
            clearTimeout(params.idleTimer)
            params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'OFFLINE' })
            // await updateStudentData()
            // doItHereInstead()
            // if ( params.callback ) { params.callback() }
            
            // console.log('offline')

        }, 6000)

    }

    const startAutoSave = () => {
        clearTimeout(params.activeTimer)
        clearTimeout(params.idleTimer)
        params.dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' })
        params.dispatch({ type: 'INCREMENT_SAVE_COUNT' })
        // callback()
        // console.log('save');
        
        params.autoSaveInterval = setInterval(() => {
            // console.log('save');
            params.dispatch({ type: 'INCREMENT_SAVE_COUNT' })
            // callback() 
        }, 3000)
    }

    const clearAutoSave = () => {
        clearInterval(params.autoSaveInterval)
        console.log('cleared');
    }

    const clearAllTimers = () => {
        clearInterval(params.autoSaveInterval)
        clearTimeout(params.activeTimer)
        clearTimeout(params.idleTimer)
    }

    return {
        startTimer,
        startAutoSave,
        clearAutoSave,
        clearAllTimers,
        changeParams
    }
}

export default useStudentTimer;