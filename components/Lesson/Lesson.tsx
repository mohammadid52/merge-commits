import React from 'react';
import { LessonContextProvider } from '../../contexts/LessonContext';
import LessonApp from './LessonApp';


const Lesson = () => {
    return (
        <LessonContextProvider>
            <LessonApp />
        </LessonContextProvider>
    )
}

export default Lesson;