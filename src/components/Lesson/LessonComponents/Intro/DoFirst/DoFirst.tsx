import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import TextQuestions from './Questions/TextQuestions';
import SelectOneQuestions from './Questions/SelectOneQuestions';

const setInitialState = (array: Array<any>) => {
  let tempObj: any = {};
  array.forEach((item: { question: { type: string; label: string } }) => {
    tempObj[item.question.label] =
      item.question.type === 'text'
        ? ''
        : item.question.type === 'input'
        ? ''
        : item.question.type === 'selectOne'
        ? null
        : item.question.type === 'selectMany'
        ? []
        : null;
  });
  return tempObj;
};

const DoFirst = () => {
  const { state, dispatch } = useContext(LessonContext);
  const { questions, required, type } = state.data.lesson.doFirst;
  const questionArray = questions.items;
  const [input, setInput] = useState<any>();
  const [ status, setStatus ] = useState('');


  useEffect(() => {

    let questionDataKeys = Object.keys(state.questionData)

    if (!input && questionDataKeys.length > 0) {
      
      setInput(() => {
        return state.questionData;
      });

    }

    if (!input  && questionDataKeys.length <= 0) {
      
      setInput(() => {
        return setInitialState(questionArray)
      });

    }

    setStatus('loaded')

  }, []);

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
          <div key={key} className={'w-full h-full flex flex-col my-4 mx-2'}>
            <label className='mb-2' htmlFor={question.id}>
              {question.question}
            </label>
            <input
              id={question.id}
              className='w-9/10 py-2 px-4 text-gray-800 rounded-lg bg-gray-300'
              type='text'
              name={question.id}
              value={input[question.id]}
              onChange={handleInputChange}
            />
          </div>
        );
      case 'text':
        return (
          <TextQuestions
            keyProp={key}
            question={question}
            value={input[question.label]}
            handleInputChange={handleInputChange}
          />
        );
      case 'selectOne':
        return (
          <SelectOneQuestions
            keyProp={key}
            question={question}
            handleInputChange={handleInputChange}
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
                  <div key={key} className={`w-3/4 flex items-center mb-2`} onClick={handleSelect} data-key={question.id}>
                    {input[question.id].indexOf(`${option.label}`) >= 0 ? (
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

  useEffect(() => {
    console.log(input);
    
    if (input && state.questionData !== input) {
      dispatch({
        type: 'SET_QUESTION_DATA',
        payload: input,
      });
    }

    // if (input && cookies.questionData !== input) {
    //   setCookie('questionData', input);
    // }
    
  }, [input]);

  const handleSelect = (e: any) => {
    const questionID = e.target.getAttribute('data-key')
    const { id } = e.target;

    let array;
    let found = input[questionID].some((item: string) => {
      return item === id
    })

    if ( found ) {
      array = input[questionID].filter((item: string) => {
        return item !== id
      })
    }

    if ( !found ) {
      array = input[questionID]
      array.push(id)
    }
    
    setInput({
      ...input,
      [questionID]: array,
    });
  };

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  if ( status !== 'loaded' ) return null

  return (
    // <div className='bg-dark-blue w-full h-full rounded-lg  text-gray-200 px-4 md:px-8 py-6'>
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full rounded-lg text-gray-200 py-4 pr-4 pl-4 border-l-4 border-ketchup'>
      <h3 className='w-full text-4xl text-gray-200 font-open font-light border-b border-white border-opacity-10 mr-4'>
        Do First
      </h3>
      <div className='w-full h-8.5/10 flex flex-col text-gray-200'>
        {questionArray.map((item: { question: any }, key: number) => (
          <div key={key} className='h-4.5/10 border-b border-white border-opacity-10 pb-8'>
            {/* <p className='font-light text-base text-blue-100 text-opacity-70 my-4 mb-4'>{item.question.question}</p> */}
            {inputSwitch(item.question, key)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoFirst;
