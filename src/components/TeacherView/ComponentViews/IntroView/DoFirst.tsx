import React, { useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
    student: number | null
}

const DoFirst = (props: props) => {
    const { student } = props;
    const { state } = useContext(LessonControlContext); 
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
                <h3 className="w-full text-lg text-gray-200 font-open font-bold border-b border-white mr-4 mb-4">
                    Do First
                </h3>
            <div className="w-full h-8/10 flex flex-col justify-evenly text-gray-200">
                <p className="my-8">Write 3-5 facts about what that means to you and and your family.</p>
                <textarea id="text" className="bg-gray-300 w-full h-full p-8 text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" 
                value={input}
                />
            </div>
        </div>
    )
}

export default DoFirst;