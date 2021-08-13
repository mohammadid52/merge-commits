import React from 'react';
import { LessonControlContextProvider } from '../../contexts/LessonControlContext';
import LessonControl from './LessonControl';

const TeacherView = () => {
    return (
        // <LessonControlContextProvider>
            <LessonControl />
        // </LessonControlContextProvider>
    )
}

export default TeacherView;
