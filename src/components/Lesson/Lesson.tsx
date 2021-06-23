import React from 'react';
import {LessonContextProvider} from '../../contexts/LessonContext';
import LessonApp from './LessonApp';
import FloatingSideMenu from '../Dashboard/FloatingSideMenu/FloatingSideMenu';

const Lesson = () => {
  return (
    <LessonContextProvider>
      <LessonApp />
    </LessonContextProvider>
  );
};

export default Lesson;
