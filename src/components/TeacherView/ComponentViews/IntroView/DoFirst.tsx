import React, { useContext, useState } from 'react';
// import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

import CheckpointQuestions from '../../../Lesson/AssessmentComponents/CheckpointQuestions';

const DoFirst = (props: {checkpointsItems: any[]}) => {
    const { state, theme } = useContext(LessonControlContext);
    const {checkpointsItems} = props;
    const  { questions, required, type }  = state.data.lesson.doFirst; 
    const [ input, setInput ] = useState('');



    return (
      <div className={`w-full h-full rounded-xl`}>
        <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
          Do First
        </h3>
        <CheckpointQuestions isTeacher={true} checkpointType={`doFirst`} checkpointsItems={checkpointsItems}/>
      </div>
    )
}

export default DoFirst;