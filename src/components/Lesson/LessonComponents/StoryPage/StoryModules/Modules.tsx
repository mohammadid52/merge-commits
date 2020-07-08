import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import { string } from 'prop-types';

type inputProp = [{ name: string; example: string; prompt: string; }];
interface ModulesProps {
    inputs: inputProp;
}

const initialInputs = (input: inputProp) => {
    let tempObj: { [key: string]: string} = {}
    input.forEach(item => {
        tempObj[item.name] = '';
    })
    return tempObj;
}

const Modules = (props: ModulesProps) => {
    const { inputs } = props
    const { state, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies(['story'])
    const [ formInputs, setFormInputs ] = useState(initialInputs(inputs))

    useEffect(() => {
        if ( cookies.story ) {
            cookies.story.additional.map((item: {name: string, input: string}) => {
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
        if ( state.componentState.story 
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
        <div className="h-96 w-full bg-dark-blue text-gray-200 px-8 py-4 shadow-2 rounded-sm">
            <h3 className="text-xl font-open font-bold mb-3 border-b border-gray-700 mb-4">Focus Questions</h3>
            <div className="w-full h-full">
                { 
                    inputs.map((input, key) => (
                        <div key={key} className="flex flex-col mb-4">
                            <label className="text-lg mb-2" htmlFor={input.name}>
                                { input.prompt }
                            </label>
                            <input id={input.name} className="w-72 text-lg px-4 py-2 rounded-lg shadow-2 text-gray-700 bg-gray-300" name={input.name} type="text" placeholder={`${input.example}, etc.`} value={formInputs[input.name]} onChange={handleFormInputChange}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Modules;