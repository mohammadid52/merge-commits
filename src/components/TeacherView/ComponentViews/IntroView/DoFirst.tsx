import React, { useState, useEffect, useContext } from 'react';
// import { useCookies } from 'react-cookie';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../state/LessonControlState';
import TextQuestions from './Questions/TextQuestions';
import SelectOneQuestions from './Questions/SelectOneQuestions';

interface props {
    data?: { [key: string]: any}
    fullscreen: boolean
}

const DoFirst = (props: props) => {
    const { fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext); 
    const  { questions, required, type }  = state.data.lesson.doFirst; 
    const questionArray = questions.items;
    const [ input, setInput ] = useState('');

    const inputSwitch = (
        question: {
          id: string;
          label: string;
          options: Array<{ label: string; icon: string; color: string; text: string }>;
          question: string;
          type: string;
        },
        key: number
      ) => {
        switch (question.type) {
          case 'input':
            return (
              <div key={key} className={'w-full h-full flex flex-col flex-grow-1'}>
            <label className={`${theme.elem.text}`} htmlFor={question.id}>
              {question.question}
            </label>
            <input
              id={question.id}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
              type='text'
              name={question.id}
              // defaultValue={input[question.id]}
              // onChange={handleInputChange}
            />
          </div>
            );
          case 'text':
            return (
              <TextQuestions
                keyProp={key}
                question={question}
                fullscreen={fullscreen}
                // value={input[question.id]}
                // handleInputChange={handleInputChange}
              />
            );
          case 'selectOne':
            return (
              <SelectOneQuestions
                keyProp={key}
                question={question}
                fullscreen={fullscreen}
                // handleInputChange={handleInputChange}
              />
            );
          case 'selectMany':
            return (
              <div className={`w-8/10 flex flex-col mx-2`}>
                <p className='mb-3'>{question.question}</p>
                <div id={question.label} className={'w-9/10 flex flex-col'}>
                  {question.options.map(
                    (
                      option: { label: string; icon: string; color: string; text: string },
                      key: any
                    ) => (
                      <div key={key} className={`w-3/4 flex items-center mb-2`} data-key={question.id}>
                        {input[1].indexOf(`${option.label}`) >= 0 ? (
                          <div
                            id={`${option.label}`}
                            className='cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center'
                            style={{ backgroundColor: `${option.color}` }}
                            data-key={question.id}
                          >
                            { option.icon ? option.icon : '' }
                          </div>
                        ) : (
                          <div
                            id={`${option.label}`}
                            className='bg-gray-400 shadow-2 cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center'
                            data-key={question.id}
                          >
                            { option.icon ? option.icon : '' }
                          </div>
                        )}
                        <div id={`${option.label}`} className='mx-4'>
                          {option.text}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          default:
            return '';
        }
      };

    return (
      <div className={`w-full h-full rounded-xl`}>
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        Do First 
      </h3>
      <div className='w-full flex flex-col'>
        {questionArray.map((item: { question: any }, key: number) => (
          <div key={key} className='flex flex-col'>
            {/* <p className='font-light text-base text-blue-100 text-opacity-70 my-4 mb-4'>{item.question.question}</p> */}
            {inputSwitch(item.question, key)}
          </div>
        ))}
      </div>
    </div>
    )
}

export default DoFirst;