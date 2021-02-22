import React, { useState, useEffect, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../state/LessonControlState';
import TextQuestions from './Questions/TextQuestions';
import SelectOneQuestions from './Questions/SelectOneQuestions';

import CheckpointQuestions from '../../../Lesson/AssessmentComponents/CheckpointQuestions';

const DoFirst = () => {
    const { state, theme } = useContext(LessonControlContext);
    const  { questions, required, type }  = state.data.lesson.doFirst; 
    const [ input, setInput ] = useState('');



    return (
      <div className={`w-full h-full rounded-xl`}>
        <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
          Do First
        </h3>
        <CheckpointQuestions isTeacher={true} checkpointType={`doFirst`}/>
      </div>
    )
}

export default DoFirst;