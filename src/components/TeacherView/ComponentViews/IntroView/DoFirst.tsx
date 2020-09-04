import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../state/LessonControlState';

interface props {
    data?: { [key: string]: any}
    fullscreen: boolean
}

const DoFirst = (props: props) => {
    const { fullscreen } = props;
    const { state } = useContext(LessonControlContext); 
    const  { questions, required, type }  = state.data.lesson.doFirst; 
    const questionArray = questions.items;
    const [ input, setInput ] = useState('');

    const inputSwitch = (question: {question: string, type: string}) => {
        switch(question.type) {
            case "input" : 
                return (
                    <div className="h-full flex flex-col justify-between">
                        <p className={`${fullscreen ? 'text-xl' : 'text-sm'} h-3/10 mb-2`}>{question.question}</p>
                        <input className={`${fullscreen ? 'h-6/10 ' : 'h-6/10'} p-2 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2`} 
                        />
                    </div>
                )
            case "text" :
                return (
                    <div className="h-full flex flex-col justify-between">
                        <p className={`${fullscreen ? 'text-xl' : 'text-sm'} mb-2`}>{question.question}</p>
                        <textarea className={`${fullscreen ? 'h-7/10 ' : 'h-5.8/10'} p-6 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2`} 
                        />
                    </div>
                )
            default :
            return null
        }
    }

    // useEffect(() => {
    //     if (typeof student === 'number') {
    //         setInput(() => {
    //             return state.roster[student].dofirst
    //         })
    //     }
    // }, [student]) 

    return (
        <div className="bg-dark-blue w-full h-full rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
                <h3 className={`${fullscreen ? 'text-2xl' : 'text-lg'} w-full text-gray-200 font-open font-bold border-b border-white mr-4 mb-4`}>
                    Do First
                </h3>
                <div className="w-full h-8.5/10 flex flex-col text-gray-200 justify-around">
                {questionArray.map((item: {question: {question: string, type: string}}, key: number) => (
                    <div key={key} className="flex flex-col justify-between">
                        {inputSwitch(item.question)}
                    </div>
                ) )}
                
            </div>
        </div>
    )
}

export default DoFirst;