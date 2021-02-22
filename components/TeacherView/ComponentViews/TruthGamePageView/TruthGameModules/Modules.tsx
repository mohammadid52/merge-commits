import React, { useState, useEffect, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

type InputProp = [{ name: string; example: string; prompt: string; }];

export interface TruthInput {
  id: string,
  label: string,
  isLie: boolean,
  text: string
}

interface ModulesProps {
  inputs: InputProp;
  fullscreen: boolean
  dataProps?: {
    truthGameArray: Array<TruthInput>,
    additional?: [{
      name: string,
      input: string,
    }]
  }
}

interface FormInputsState {
  [key: string]: string
}

const Modules = (props: ModulesProps) => {
  const { inputs, fullscreen, dataProps } = props
  const { state, dispatch, theme } = useContext(LessonControlContext);
  // const [ cookies, setCookie ] = useCookies(['story'])
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
  }, [])

  useEffect(() => {

    if ( dataProps && dataProps.additional ) {
      dataProps.additional.forEach((item: { name: string; input: string }) => {
        setFormInputs(prev => {
          return {
            ...prev,
            [item.name]: item.input,
          }
        })
      })
    }

  }, [dataProps])

  const handleFormInputChange = (e: { target: { id: string; value: string; }; }) => {
    setFormInputs({
      ...formInputs,
      [e.target.id]: e.target.value
    })
  }

  return (

      <div className={`${fullscreen ? 'md:mb-0 px-4 md:px-8 py-4' : 'p-2'} md:h-5.8/10 w-full bg-gradient-to-tl from-dark-blue to-med-dark-blue text-gray-200 rounded-lg overflow-hidden`}>
        <h3 className={`text-xl font-open font-light ${theme.underline}`}>Focus Questions</h3>
        <div className={`${fullscreen ? 'h-full' : 'h-8.5/10'} w-full h-full `}>
          {
            formInputs ? inputs.map((input, key) => (
                <div key={key} className={`flex flex-col animate-fadeIn pb-4 ${key !== inputs.length-1 && 'border-b border-white border-opacity-10 '}`}>
                  <label className={`${fullscreen ? 'text-sm md:text-md mb-2' : 'text-xs'} font-light text-blue-100 text-opacity-70`} htmlFor={input.name}>
                    { input.prompt }
                  </label>
                  <input id={input.name} className={`${fullscreen ? 'text-sm md:text-lg md:w-72 ' : 'text-xs w-9/10'} px-4 py-1 rounded-lg text-gray-700 bg-gray-300`} name={input.name} type="text" placeholder={`${input.example}, etc.`} value={formInputs[input.name]} onChange={handleFormInputChange}/>
                </div>
            )) : null
          }
        </div>
      </div>

      // <div className={`${fullscreen ? 'md:mb-0 px-4 md:px-8 py-4' : 'p-3'} md:h-5.8/10 w-full bg-dark-blue text-gray-200 shadow-2 rounded-lg`}>
      //     <h3 className="text-xl font-open font-bold mb-3 border-b border-white mb-2">Focus Questions</h3>
      //     <div className={`${fullscreen ? 'h-full' : 'h-8.5/10'} w-full`}>
      //         {
      //             formInputs ? inputs.map((input, key) => (
      //                 <div key={key} className="flex flex-col mb-2">
      //                     <label className={`${fullscreen ? 'text-sm md:text-md mb-2' : 'text-xs'} `} htmlFor={input.name}>
      //                         { input.prompt }
      //                     </label>
      //                     <input id={input.name} className={`${fullscreen ? 'text-sm md:text-md xl:text-lg md:w-72 ' : 'text-xs w-9/10'} px-4 py-1 rounded-lg shadow-2 text-gray-700 bg-gray-300`} name={input.name} type="text" placeholder={`${input.example}, etc.`} value={formInputs[input.name]} onChange={handleFormInputChange}/>
      //                 </div>
      //             )) : null
      //         }
      //     </div>
      // </div>
  )
}

export default Modules;