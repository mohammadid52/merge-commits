import React, { useState, useEffect } from 'react';
import { storyBreakdownProps } from './StoryActivity';

type inputProp = [{ name: string; example: string; prompt: string; }];
interface ModulesProps {
    inputs: inputProp;
    breakdownProps: storyBreakdownProps;
    setBreakdownProps: React.Dispatch<React.SetStateAction<storyBreakdownProps>>;
}

const initialInputs = (input: inputProp) => {
    let tempObj: { [key: string]: string} = {}
    input.forEach(item => {
        tempObj[item.name] = '';
    })
    return tempObj;
}

const keywordParser = (str: string) => {
    let tempWord = '';
    let initialArray = Array.from(str);
    let finalArray = [];
    initialArray.forEach(letter => {
        if (letter !== ',') {
            tempWord = tempWord + letter;
        } else {
            finalArray.push(tempWord);
            tempWord = '';
        }
    })
    
    finalArray.push(tempWord);

    return finalArray;
}

const Modules = (props: ModulesProps) => {
    const { inputs, breakdownProps, setBreakdownProps, } = props;
    const [ formInputs, setFormInputs ] = useState(initialInputs(inputs));

    useEffect(() => {
        // setBreakdownProps({
        //     ...breakdownProps,
        //     additional: breakdownProps.additional.map(prop => {
        //         return {
        //             ...prop,
        //             text: keywordParser(formInputs[prop.name]),
        //         }
        //     })
        // })
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