import React, { useContext } from 'react'
import { LessonContext } from '../contexts/LessonContext'


const useStudentTimer = () => {
    const { state, dispatch } = useContext(LessonContext)
    let activeTimer: any;
    let idleTimer: any;
    let autoSaveInterval: any;

    const startTimer = (func: () => void) => {
        clearTimeout(activeTimer)
        clearTimeout(idleTimer)
        console.log('active');
        activeTimer = setTimeout(() => {
            clearTimeout(activeTimer)
            console.log('idle')
            func()
            idleTimer = setTimeout(() => {
                clearTimeout(idleTimer)
                func()
                console.log('offline')
            }, 3000)
        }, 3000)
    }

    const startAutoSave = (func: () => void) => {
        clearTimeout(activeTimer)
        clearTimeout(idleTimer)
        autoSaveInterval = setInterval(() => {
            func()
        }, 1000)
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