import React from 'react';
import { LessonContextProvider } from '../../contexts/LessonContext';
import LessonControl from './LessonControl';




const TeacherView = () => {
    return (
        <LessonContextProvider>
            <LessonControl />
        </LessonContextProvider>
    )
}

export default TeacherView;
