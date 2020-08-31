import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
    student: number | null,
    fullscreen: boolean
}

const DoFirst = (props: props) => {
    const { student, fullscreen } = props;
    const { state } = useContext(LessonControlContext); 
    const  doFirstComponent  = state.data.lesson.doFirst.questions.items;
    const [ input, setInput ] = useState('')

    useEffect(() => {
        if (typeof student === 'number') {
            setInput(() => {
                return state.roster[student].dofirst
            })
        }
    }, [student])

    return (
        <div className="bg-dark-blue w-full h-full rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
                <h3 className={`${fullscreen ? 'text-2xl' : 'text-lg'} w-full text-gray-200 font-open font-bold border-b border-white mr-4 mb-4`}>
                    Do First
                </h3>
            <div className="w-full h-8/10 flex flex-col justify-evenly text-gray-200">
                {doFirstComponent.map((item: {question: any}, key: number) => (
                    
                    <>
                    <p className={`${fullscreen ? 'text-xl' : 'text-base'} my-8`}>{item.question.question}</p>
                    <textarea className={`${item.question.type === 'input' ? 'h-2/10 p-2' : 'h-full p-8'} ${fullscreen ? 'text-sm md:text-2xl' : 'text-base'} bg-gray-300 w-full text-gray-800 rounded-lg shadow-2`} 
                    
                />
                    
                    </>
                ) )}
            </div>
        </div>
    )
}

export default DoFirst;