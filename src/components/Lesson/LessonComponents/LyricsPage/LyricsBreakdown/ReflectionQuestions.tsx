import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';

const ReflectionQuestions = () => {
    const [ question, setQuestion ] = useState(0);
    const { state, theme } = useContext(LessonContext);
    const questArr = state.data.lesson.coreLesson.breakdown.reflectionQuestions;

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
        <div className="reflection w-full h-1.5/10 flex flex-row text-gray-200">
            <div className={`w-1/10 h-full flex justify-center items-center ${theme.gradient.cardBase} mr-2 md:mr-4 rounded-lg cursor-pointer`} onClick={prevQuestion}>
                <div className="w-6 h-6 border-dark border-t-8 border-l-8 transform -rotate-45 ml-2"></div>
            </div>
            <div className={`w-8/10 ${theme.gradient.cardBase} flex-grow rounded-lg px-4 py-2 flex flex-col`}>
                <div className="font-open font-light">
                    Discussion Questions
                </div>
                <div className="question w-full flex-grow text-xs md:text-xl text-gray-200 font-light flex justify-center px-4">
                    <p className="text-center">{ questArr[question] }</p>
                </div>
            </div>
            <div className={`w-1/10 h-full flex justify-center items-center ${theme.gradient.cardBase} ml-2 md:ml-4 rounded-lg cursor-pointer`} onClick={nextQuestion}>
                <div className="w-6 h-6 border-dark border-t-8 border-r-8 transform rotate-45 mr-2"></div>
            </div>
        </div>
    )
}

export default ReflectionQuestions;