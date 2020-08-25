import React from 'react';
import { LessonControlContextProvider } from '../../contexts/LessonControlContext';
import LessonControl from './LessonControl';
import { LessonContextProvider } from '../../contexts/LessonContext';




const TeacherView = () => {
    return (
        <LessonContextProvider>
            <LessonControlContextProvider>
                <LessonControl />
            </LessonControlContextProvider>
        </LessonContextProvider>
    )
}

export default TeacherView;
