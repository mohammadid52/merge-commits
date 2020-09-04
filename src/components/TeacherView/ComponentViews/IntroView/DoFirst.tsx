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

    const inputSwitch = (type: string) => {
        switch(type) {
            case "input" : 
                return (
                    <input className="p-2 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" 
                    />
                )
            case "text" :
                return (
                    <textarea className="h-full p-6 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" 
                    />
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
                <div className="w-full h-8.5/10 flex flex-col text-gray-200">
                {questionArray.map((item: {question: any}, key: number) => (
                    <div key={key}>
                        <p className={`${fullscreen ? 'text-xl my-8' : 'text-base my-2'}`}>{item.question.question}</p>
                        {inputSwitch(item.question.type)}
                    </div>
                ) )}
                
            </div>
        </div>
    )
}

export default DoFirst;