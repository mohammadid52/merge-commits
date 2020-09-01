import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const setInitialState = (array: Array<any>) => {
    
}

const DoFirst = () => {
    const { state, dispatch } = useContext(LessonContext);
    const  { questions, required, type }  = state.data.lesson.doFirst; 
    const questionArray = questions.items;
    const [input, setInput] = useState<any>({});

    const inputSwitch = (type: string) => {
        switch(type) {
            case "input" : 
                return (
                    <input className="bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" value={input} 
                    onChange={handleInputChange}/>
                )
            case "text" :
                return (
                    <textarea className="h-full p-8 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" value={input} 
                    onChange={handleInputChange}/>
                )
            default :
            return null
        }
    }


    const handleInputChange = (e: { target: { id: string; value: string; }; }) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
    }

    return (
        <div className="bg-dark-blue w-full h-full rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
                <h3 className="w-full text-4xl text-gray-200 font-open font-bold border-b border-white mr-4 mb-4">
                    Do First
                </h3>
            <div className="w-full h-8.5/10 flex flex-col text-gray-200">
                {questionArray.map((item: {question: any}, key: number) => (
                    <div key={key}>
                        <p className="text-xl my-8">{item.question.question}</p>
                        {inputSwitch(item.question.type)}
                    </div>
                ) )}
                
            </div>
        </div>
    )
}

export default DoFirst;