import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const ReflectionQuestions = (props: props) => {
    const {  fullscreen } = props;
    const [ question, setQuestion ] = useState(0);
    const { state } = useContext(LessonControlContext);
    const questArr = state.data.lesson.activity.breakdown.reflectionQuestions;

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
        <div className="reflection w-full h-1.5/10 flex flex-row text-gray-200 mx-8">
            <div className="w-1/10 h-full flex justify-center items-center bg-gradient-to-tl from-dark-blue to-med-dark-blue mr-2 md:mr-4 rounded-lg cursor-pointer" onClick={prevQuestion}>
                <div className="w-6 h-6 border-dark border-t-8 border-l-8 transform -rotate-45 ml-2 cursor-pointer"></div>
            </div>
            <div className="w-8/10 bg-gradient-to-tl from-dark-blue to-med-dark-blue flex-grow rounded-lg px-2 md:px-4 py-1 md:py-2 flex flex-col">
                <h3 className={`${fullscreen ? 'text-base ' : 'text-xs'} font-open font-light`}>
                Discussion Questions
                </h3>
                <div className={`${fullscreen ? 'text-lg' : 'text-sm'} question w-full flex-grow font-light text-gray-200 flex justify-center md:px-4`}>
                    <p className="text-center">{ questArr[question] }</p>
                </div>
            </div>
            <div className="w-1/10 h-full flex justify-center items-center bg-gradient-to-tl from-dark-blue to-med-dark-blue ml-2 md:ml-4 rounded-lg cursor-pointer" onClick={nextQuestion}>
                <div className="w-6 h-6 border-dark border-t-8 border-r-8 transform rotate-45 mr-2 cursor-pointer"></div>
            </div>
        </div> 
    )
}

export default ReflectionQuestions;