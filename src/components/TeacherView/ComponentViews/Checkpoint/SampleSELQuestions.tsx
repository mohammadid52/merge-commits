import React, { useState, useContext } from 'react';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';
import SelectOneQuestions from './Questions/SelectOneQuestions';
import TextQuestions from './Questions/TextQuestions';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

interface props {
  fullscreen: boolean;
}

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

const SampleSELQuestions = (props: props) => {
  const { state, theme } = useContext(LessonControlContext);
  const checkpoint = state.data.lesson.checkpoints.items[0].checkpoint;
  const { fullscreen } = props;
  const [selected, setSelected] = useState<Array<string>>([]);

  const handleSelect = (e: any) => {
    const { id } = e.target;
    setSelected((prev) => {
      if (selected.indexOf(id) >= 0) {
        let newArray = selected.filter((item) => {
          return item !== id;
        });
        console.log(newArray);
        return newArray;
      }

      return [...prev, id];
    });
  };

  const inputSwitch = (
    question: {
      label: string;
      options: Array<{
        label: string;
        icon: string;
        color: string;
        text: string;
      }>;
      question: string;
      type: string;
    },
    key: number
  ) => {
    switch (question.type) {
      case 'input':
        return (
          <div key={key} className={'flex flex-col mb-4'}>
            <label className={theme.elem.text} htmlFor={question.label}>
              <p>
                <b>{key + 1}. </b>
                {question.question}
              </p>
            </label>
            <input
              id={question.label}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
              type='text'
              name={question.label}
              //   value={input[question.id]}
              //   onChange={handleInputChange}
            />
          </div>
        );
      case 'text':
        return (
          <TextQuestions
            number={key}
            question={question}
            value={''}
          />
          // <h1>TEXT QU</h1>
        );
      case 'selectOne':
        return (
          <SelectOneQuestions
            // keyProp={key}
            number={key}
            question={question}
            // value={input[question.id]}
            // handleInputChange={handleInputChange}
            // checkpointID={checkpoint.checkpoint.id}
          />
        );
      case 'selectMany':
        return (
          <div className={`w-full rounded-xl`}>
            <div className={theme.elem.text}>
              <p>
                <b>{key + 1}. </b>
                {question.question}
              </p>
            </div>
            <div id={question.label} className={'flex'}>
              {question.options.map(
                (
                  option: { label: string; icon: string; color: string; text: string },
                  key: any
                ) => (
                  <div key={key} className={`w-3/4 flex justify-center items-center mb-2`}>
                    {selected.indexOf(`${option.label}`) >= 0 ? (
                      <div
                        id={`${option.label}`}
                        className='cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center'
                        style={{ backgroundColor: `${option.color}` }}>
                       
                        <IconContext.Provider  value={{ color: '#EDF2F7', size: '1.25rem', className: 'w-auto mr-2'}}>
                            
                            <ImCheckboxChecked />
                        
                        </IconContext.Provider>

                        {option.text}
                      </div>
                    ) : (
                      <div
                        id={`${option.label}`}
                        className='bg-gray-400 text-black50 cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center'>
                        <IconContext.Provider value={{ color: '#000', size: '1.25rem', className: 'w-auto mr-2' }}>
                             
                             <ImCheckboxUnchecked />
                           
                         </IconContext.Provider>

                         {/* {option.icon ? option.icon : ''} */}
                         {option.text}
                      </div>
                    )}

                    {/* <div id={`${option.label}`} className='mx-4'>
                      {option.text}
                    </div> */}
                  </div>
                )
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={theme.section}>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        {checkpoint.instructions}
      </div>

      <div className={`${theme.elem.text}`}>
        <div className='w-full h-full flex flex-col flex-wrap justify-around items-center'>
          {checkpoint.questions.items.map((item: { question: any }, key: number) => {
            return <div key={key}>{inputSwitch(item.question, key)}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default SampleSELQuestions;
