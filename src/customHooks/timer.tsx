import React from 'react'
import { LessonActions } from '../reducers/LessonReducer'
import { LessonStateType } from '../state/LessonState';

interface inputs {
    subscription?: any,
    dispatch: React.Dispatch<LessonActions>,
    callback: () => Promise<void>;
    // state: any;
}

const useStudentTimer = (inputs?: inputs) => {
    const { subscription, dispatch, callback } = inputs;
    let activeTimer: any;
    let idleTimer: any;
    let autoSaveInterval: any;

    const startTimer = () => {
        clearTimeout(activeTimer)
        clearTimeout(idleTimer)
        dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'ACTIVE' })
        // console.log('active');

        activeTimer = setTimeout(() => {
            clearTimeout(activeTimer)
            // console.log('idle')
            dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'IDLE' })
            callback()

            idleTimer = setTimeout(() => {
                clearTimeout(idleTimer)
                dispatch({ type: 'UPDATE_STUDENT_STATUS', payload: 'OFFLINE' })
                callback()
                if ( subscription ) { subscription.unsubscribe() }
                // console.log('offline')

            }, 10000)

        }, 6000)

    }

    const startAutoSave = () => {
        clearTimeout(activeTimer)
        clearTimeout(idleTimer)
        // callback()
        console.log('save');
        
        autoSaveInterval = setInterval(() => {
            console.log('save');
            
            // callback() 
        }, 1500)
    }

    const clearAutoSave = () => {
        clearInterval(autoSaveInterval)
    }

    return {
        startTimer,
        startAutoSave,
        clearAutoSave
    }

}

export default useStudentTimer;