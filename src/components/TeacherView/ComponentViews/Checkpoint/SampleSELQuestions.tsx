import React, { useState, useContext } from 'react';
import {LessonControlContext} from '../../../../contexts/LessonControlContext';
interface props {
        fullscreen: boolean
    }

const setInitialState = (array: Array<any>) => {
    let tempObj: any = {}
    array.forEach((item: {question: {type: string, label: string}}) => {
        tempObj[item.question.label] = item.question.type === 'text' ? '' : item.question.type === 'input' ? '' : item.question.type === 'selectOne' ? null : item.question.type === 'selectMany' ? [] : null 
    }) 
    return tempObj;
}
    

const SampleSELQuestions = (props: props) => {
    const { state } = useContext(LessonControlContext); 
    const checkpoint = state.data.lesson.checkpoints.items[0].checkpoint;
    const {fullscreen} = props;
    const [ selected, setSelected ] = useState<Array<string>>([])

    const handleSelect = (e: any) => {
        const { id } = e.target
        setSelected(prev => {
            if ( selected.indexOf(id) >= 0 ) {
                let newArray = selected.filter(item => {
                   return item !== id
                })
                console.log(newArray)
                return newArray;
            } 

            return [
                ...prev,
                id
            ]
        })
    }

    const inputSwitch = (question: {label: string, options: Array<{label: string, icon: string, color: string, text: string }>, question: string, type: string }) => {
        switch(question.type) {
            case "input" : 
                return (
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <label className="mb-2" htmlFor="traditions">{question.question}</label>
                        <input id={question.label} className="py-2 px-4 rounded-lg" type="text" name="traditions" 
                        />
                    </div>
                )
            case "text" :
                return (
                    <textarea id={question.label} className="h-full p-8 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" 
                        />
                )
            case "selectOne" :
                return (
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <p className="mb-2">{question.question}</p>
                        <div className={`flex justify-around`}>
                            {question.options.map((option: {label: string, icon: string, color: string, text: string }, key: number) => (
                                <div key={key} className={`flex justify-center items-center`}>
                                    <input id={question.label} className="w-4 mx-4 cursor-pointer" type="radio" name="cultures" 
                                    />
                                <label htmlFor={`${option.text}`}>{option.text}</label>
                            </div>
                            ))}
                        </div>
                    </div>
                )
            case "selectMany" :
                return (
                    <>
                    <p className="mb-4">
                        {question.question}
                    </p>
                    <div id={question.label} className={'w-8/10 flex flex-col items-center'}>
                        {question.options.map((option: {label: string, icon: string, color: string, text: string }, key: any) => (
                            <div key={key} className={`w-3/4 flex items-center mb-4`} 
                            >
                                {
                                    selected.indexOf(`${option.label}`) >= 0 ? 
                                    <div className="cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center" 
                                    style={{color: `${option.color}`}} 
                                    >
                                        {option.icon ? option.icon : ''}
                                    </div>
                                :
                                    <div className="bg-gray-400 shadow-2 cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center">
                                        {option.icon ? option.icon : ''}
                                    </div> 
                                }
                                <div className="mx-4">
                                    {option.text}
                                </div>
                            </div>
                            
                        ))}

                    </div>
                    </>
                )
            default :
            return null
        }
    }

    return (
        <div className={`h-full flex flex-col text-gray-200 justify-between`}>
            <h4 className={`${fullscreen ? 'text-xl' : 'text-base'} font-open font-bold`}>{checkpoint.instructions}</h4>
            
            <div className={`${fullscreen ? 'text-base' : 'text-xs'} h-9.5/10 flex justify-center items-center divide-x-2 divide-dark divide-opacity-50`}>
                <div className="w-full h-full flex flex-col flex-wrap justify-around items-center">
                    
                    {checkpoint.questions.items.map((item: {question:any}, key: number) => {
                        return (
                            <div key={key} className="w-4.5/10">
                                {inputSwitch(item.question)}
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
    )
}

export default SampleSELQuestions;