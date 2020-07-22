import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

const ReflectionQuestions = () => {
    const [ question, setQuestion ] = useState(0);
    const { state } = useContext(LessonContext);
    console.log(state)
    const questArr = state.data.warmUp.breakdown.reflectionQuestions;

    const nextQuestion = () => {
        if (question < questArr.length - 1) {
            setQuestion(question + 1);
        } else if (question === questArr.length - 1) {
            setQuestion(0);
        }
    }

    const prevQuestion = () => {
        if (question > 0) {
            setQuestion(question - 1);
        } else if (question === 0) {
            setQuestion(questArr.length - 1);
        }
    }

    return (
       
            <div className="reflection w-full h-28 flex flex-row text-gray-200 mb-4 mx-8">
                <div className="w-1/10 h-full flex justify-center items-center bg-dark-blue mr-4 rounded shadow-2" onClick={prevQuestion}>
                    <div className="w-6 h-6 border-dark border-t-8 border-l-8 transform -rotate-45 ml-2"></div>
                </div>
                <div className="w-8/10 bg-dark-blue flex-grow rounded-sm shadow-2 px-2 md:px-4 py-1 md:py-2 flex flex-col">
                    <h3 className="font-open font-bold mb-2">
                        Reflection Questions
                    </h3>
                    <div className="question w-full flex-grow text-sm md:text-xl text-gray-200 flex justify-center md:px-4">
                        <p className="text-center">{ questArr[question] }</p>
                    </div>
                </div>
                <div className="w-1/10 h-full flex justify-center items-center bg-dark-blue ml-4 rounded shadow-2" onClick={nextQuestion}>
                    <div className="w-6 h-6 border-dark border-t-8 border-r-8 transform rotate-45 mr-2"></div>
                </div>
            </div> 
       
    )
}

export default ReflectionQuestions;