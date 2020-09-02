import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const setInitialState = (array: Array<any>) => {
    let tempObj: any = {}
    array.forEach((item: {question: {type: string, label: string}}) => {
        tempObj[item.question.label] = item.question.type === 'text' ? '' : item.question.type === 'input' ? '' : item.question.type === 'selectOne' ? null : item.question.type === 'selectMany' ? [] : null 
    }) 
    return tempObj;
}

const SampleSELQuestions = () => {
    const {state} = useContext(LessonContext);
    const checkpoint = state.data.lesson.checkpoints.items[0].checkpoint;
    console.log(checkpoint.questions.items, 'check point');
    const [ selected, setSelected ] = useState<Array<string>>([])
    const [input, setInput] = useState<any>(setInitialState(checkpoint.questions.items));
    console.log(input, 'input')

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

    useEffect(() => {

        console.log(input, 'input')

    }, [input])

    const handleInputChange = () => {

    }

    const inputSwitch = (question: {label: string, options: Array<string>, question: string, type: string }) => {
        switch(question.type) {
            case "input" : 
                return (
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <label className="mb-2" htmlFor="traditions">{question.question}</label>
                        <input id={question.label} className="py-2 px-4 rounded-lg" type="text" name="traditions" value={input[question.label]}
                        onChange={handleInputChange}/>
                    </div>
                )
            case "text" :
                return (
                    <textarea id={question.label} className="h-full p-8 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" value={input[question.label]} 
                        onChange={handleInputChange}/>
                )
            case "selectOne" :
                return (
                    <div className={'w-full flex flex-col items-center mb-4'}>
                        <p className="mb-2">{question.question}</p>
                        <div className={`flex justify-around`}>
                            {question.options.map((option: any, key: number) => (
                                <div key={key} className={`flex justify-center items-center`}>
                                    <input id={question.label} className="w-4 mx-4 cursor-pointer" type="radio" name="cultures" value={input[question.label]}
                                    onChange={handleInputChange}/>
                                <label htmlFor="no">{option}</label>
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
                    <div className={'w-8/10 flex flex-col items-center'}>
                        {question.options.map((option: any, key: any) => (
                            <div key={key} className={`w-3/4 flex items-center mb-4`} 
                            onChange={handleInputChange}>
                                <div id={question.label} className={`${ selected.indexOf('culture') >= 0 ? 'bg-dark-red' : 'bg-gray-400 shadow-2'} cursor-pointer w-8 h-8 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                   
                                </div>
                                <div className="mx-4">
                                    {option}
                                </div>
                            </div>
                        ))}
                        {/* <div className={`w-3/4 flex items-center mb-4`}>
                            <div id="traditions" className={`${ selected.indexOf('traditions') >= 0 ? 'bg-gold' : 'bg-gray-400 shadow-2'} w-12 h-12 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                ⚜️
                            </div>
                            <div className="mx-4">
                                {question.options[1]}
                            </div>
                        </div>
                        <div className={`w-3/4 flex items-center mb-4`}>
                            <div id="family" className={`${ selected.indexOf('family') >= 0 ? 'bg-blueberry' : 'bg-gray-400 shadow-2'} w-12 h-12 p-2 text-3xl rounded  flex justify-center items-center`} onClick={handleSelect}>
                                👨‍👩‍👧‍👦
                            </div>
                            <div className="mx-4">
                               {question.options[2]}
                            </div>
                        </div> */}

                    </div>
                    </>
                )
            default :
            return null
        }
    }

    return (
        <div className={`h-full flex flex-col text-gray-200`}>
            <h4 className={`text-2xl font-open font-bold`}>{checkpoint.instructions}</h4>
            <div className={`h-full flex justify-center items-center divide-x-2 divide-dark divide-opacity-50`}>
                <div className="w-full h-full flex flex-col flex-wrap justify-around items-center p-6">
                    
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