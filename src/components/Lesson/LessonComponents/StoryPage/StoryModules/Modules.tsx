import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import { string } from 'prop-types';

type InputProp = [{ name: string; example: string; prompt: string; }];

interface ModulesProps {
    inputs: InputProp;
}

interface FormInputsState {
    [key: string]: string
}

const Modules = (props: ModulesProps) => {
    const { inputs } = props
    const { state, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies(['story'])
    const [ formInputs, setFormInputs ] = useState<FormInputsState>() 

    useEffect(() => {
        inputs.forEach((item: { name: string; example: string; prompt: string; }) => {
            setFormInputs(prev => {
                return {
                    ...prev,
                    [item.name]: '',
                }
            })
        })

        if ( cookies.story && cookies.story.additional && cookies.story.additional.length > 0 ) {
            cookies.story.additional.forEach((item: {name: string, input: string}) => {
                setFormInputs(prev => {
                    return {
                        ...prev,
                        [item.name]: item.input,
                    }
                })
            })
        }

        if ( state.componentState.story &&state.componentState.story.additional && state.componentState.story.additional.length > 0 ) {
            state.componentState.story.additional.map((item: {name: string, input: string}) => {
                setFormInputs(prev => {
                    return {
                        ...prev,
                        [item.name]: item.input,
                    }
                })
            })
        }
    }, [])

    useEffect(() => {
        if ( formInputs && state.componentState.story.additional
            && state.componentState.story.additional.length > 0 ) {
            let tempArray: Array<{name: string, input: string}> = [];
            inputs.forEach(input => {
                let tempObj = {
                    name: input.name,
                    input: formInputs[input.name]
                }
                
                tempArray.push(tempObj)
            })

            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'story',
                    inputName: 'additional',
                    content: tempArray
                }
            })

            setCookie('story', {...cookies.story, additional: tempArray})
        }
    }, [formInputs])

    const handleFormInputChange = (e: { target: { id: string; value: string; }; }) => {
        setFormInputs({
            ...formInputs,
            [e.target.id]: e.target.value
        }) 
    }

    return (
        <div className="md:h-5.8/10 w-full bg-dark-blue text-gray-200 md:mb-0 px-4 md:px-8 py-4 rounded-lg">
            <h3 className="text-xl font-open font-light mb-3 border-b border-white border-opacity-10 mb-4 pb-4">Focus Questions</h3>
            <div className="w-full h-full">
                { 
                    formInputs ? inputs.map((input, key) => (
                        <div key={key} className={`flex flex-col ${key !== inputs.length-1 && 'border-b border-white border-opacity-10 mb-4 pb-4'}`}>
                            <label className="text-sm md:text-md mb-2 font-light text-base text-blue-100 text-opacity-70" htmlFor={input.name}>
                                { input.prompt }
                            </label>
                            <input id={input.name} className="md:w-72 text-sm md:text-md xl:text-lg px-4 py-1 rounded-lg text-gray-700 bg-gray-300" name={input.name} type="text" placeholder={`${input.example}, etc.`} value={formInputs[input.name]} onChange={handleFormInputChange}/>
                        </div>
                    )) : null
                }
            </div>
        </div>
    )
}

export default Modules;