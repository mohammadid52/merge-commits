import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

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
  const [input, setInput] = useState<any>(setInitialState(questionArray));

  const inputSwitch = (type: string, label: string) => {
    switch (type) {
      case 'input':
        return (
          <input
            id={label}
            className='p-2 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg'
            value={input[label]}
            onChange={handleInputChange}
          />
        );
      case 'text':
        return (
          <textarea
            id={label}
            className='h-full p-6 bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg'
            value={input[label]}
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  return (
    // <div className='bg-dark-blue w-full h-full rounded-lg  text-gray-200 px-4 md:px-8 py-6'>
    <div className='bg-dark-blue w-full h-full rounded-lg text-gray-200 py-4 pr-4 pl-4 border-l-4 border-mustard-yellow'>
      <h3 className='w-full text-4xl text-gray-200 font-open font-light border-b border-white border-opacity-10 mr-4'>
        Do First
      </h3>
      <div className='w-full h-8.5/10 flex flex-col text-gray-200'>
        {questionArray.map((item: { question: any }, key: number) => (
          <div key={key} className='border-b border-white border-opacity-10 pb-8'>
            <p className='font-light text-base text-blue-100 text-opacity-70 my-4 mb-4'>{item.question.question}</p>
            {inputSwitch(item.question.type, item.question.label)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoFirst;
