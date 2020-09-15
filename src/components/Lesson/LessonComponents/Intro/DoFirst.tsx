import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const setInitialState = (array: Array<any>) => {
    let tempObj: any = {}
    array.forEach((item: {question: {type: string, label: string}}) => {
        
        tempObj[item.question.label] = item.question.type === 'text' ? '' : item.question.type === 'input' ? '' : item.question.type === 'selectOne' ? null : item.question.type === 'selectMany' ? [] : null 
    }) 
    return tempObj; 
}

const DoFirst = () => {
    const { state, dispatch } = useContext(LessonContext);
    const  { questions, required, type }  = state.data.lesson.doFirst;  
    const questionArray = questions.items;
    const [input, setInput] = useState<any>(setInitialState(questionArray));

    const inputSwitch = (type: string, label: string) => {
        switch(type) {
            case "input" : 
                return (
                    <input id={label} className="p-2 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" value={input[label]} 
                    onChange={handleInputChange}/>
                )
            case "text" :
                return (
                    <textarea id={label} className="h-full p-6 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" value={input[label]} 
                    onChange={handleInputChange}/>
                )
            default :
            return null
        }
    }
    // useEffect(() => {
    //     if ( state.componentState.story ) {

    //         dispatch({
    //             type: 'UPDATE_COMPONENT_STATE',
    //             payload: {
    //                 componentName: 'story',
    //                 inputName: 'title',
    //                 content: input.question.label
    //             }
    //         })
    //     }
    // }, [input.title])

    // useEffect(() => {
    //     if ( state.componentState.story ) {

    //         dispatch({
    //             type: 'UPDATE_COMPONENT_STATE',
    //             payload: {
    //                 componentName: 'story',
    //                 inputName: 'story',
    //                 content: input.story
    //             }
    //         })
    //     }
    // }, [input.story])
   

    const handleInputChange = (e: { target: { id: string; value: string; }; }) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
    }

    return (
        <div className="bg-dark-blue w-full h-full rounded-lg shadow-2 text-gray-200 px-4 md:px-8 py-6">
                <h3 className="w-full text-4xl text-gray-200 font-open font-bold border-b border-white mr-4 mb-4">
                    Do First
                </h3>
            <div className="w-full h-8.5/10 flex flex-col text-gray-200">
                {questionArray.map((item: {question: any}, key: number) => (
                    <div key={key}>
                        <p className="text-xl my-8">{item.question.question}</p>
                        {inputSwitch(item.question.type, item.question.label)}
                    </div>
                ) )}
                
            </div>
        </div>
    )
}

export default DoFirst;