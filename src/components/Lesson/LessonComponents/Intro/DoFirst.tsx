import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import CheckpointQuestions from '../../AssessmentComponents/CheckpointQuestions';


const DoFirst = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [ cookies, setCookie ] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const { questions, required, type } = state.data.lesson.doFirst;
  const doFirstID = state.data.lesson.doFirst.id
  const questionArray = questions.items;
  const [ input, setInput ] = useState<any>();
  const [ status, setStatus ] = useState('');

  /**
   * BELOW CODE WILL NEED TO BE CLEANED UP
   * AS CHECKPOINTQUESTIONS.TSX IS PROPERLY
   * INTEGRATED INTO THIS COMPONENT
   */

  useEffect(() => {
    // let questionDataKeys = [];
    // if ( state.questionData.doFirst ) { questionDataKeys = Object.keys(state.questionData.doFirst) }
    //
    // if (!input && questionDataKeys.length > 0) {
    //   setInput(() => {
    //     return state.questionData.doFirst;
    //   });
    // }
    //
    // if (!input  && questionDataKeys.length <= 0) {
    //
    //   setInput(() => {
    //     return setInitialState(questionArray)
    //   });
    // }

    if ( cookies[`lesson-${state.syllabusLessonID}`]?.doFirst ) {
      setInput(() => {
        return cookies[`lesson-${state.syllabusLessonID}`].doFirst
      })
    }
    setStatus('loaded')

  }, []);


  useEffect(() => {

    // if (input && state.questionData.doFirst !== input) {
    //   dispatch({
    //     type: 'SET_QUESTION_DATA',
    //     payload: {
    //       key: 'doFirst',
    //       data: input
    //     },
    //   });
    // }

    setCookie(`lesson-${state.syllabusLessonID}`, {
      ...cookies[`lesson-${state.syllabusLessonID}`],
      doFirst: input
    })

  }, [input]);




  if ( status !== 'loaded' ) return null

  return (
    <div className={`w-full h-full rounded-xl`}>
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        Do First 
      </h3>
      <CheckpointQuestions checkpointType={`doFirst`}/>
    </div>
  );
};

export default DoFirst;
