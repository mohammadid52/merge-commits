import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import queryString from 'query-string';
import { useCookies } from 'react-cookie';
import { array } from 'prop-types';

import SelectOneQuestions from './Questions/SelectOneQuestions';
import TextQuestions from './Questions/TextQuestions';

const setInitialState = (array: Array<any>) => {
  let tempObj: any = {};
  array.forEach((item: { question: { id: string; type: string; label: string } }) => {
    tempObj[item.question.id] =
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

interface CheckpointQuestionsProps {
  handleSetTitle: React.Dispatch<React.SetStateAction<string>>;
}

const CheckpointQuestions = (props: CheckpointQuestionsProps) => {
  const { handleSetTitle } = props;
  const { state, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies(['questionData']);
  const queryParams = queryString.parse(location.search);
  // console.log('params', queryParams);
  const checkpoints = state.data.lesson.checkpoints.items;
  // console.log('checkpt array', checkpoints);
  const checkpoint = checkpoints
    .filter((item: any) => {
      return item.checkpoint.id == queryParams.id;
    })
    .pop();
  // console.log(checkpoint, 'checkpoint');
  // const checkpoint = state.data.lesson.checkpoints.items[0].checkpoint;
  const [ status, setStatus ] = useState('');
  const [selected, setSelected] = useState<Array<string>>([]);
  const [input, setInput] = useState<any>();

  useEffect(() => {
    if (checkpoint.checkpoint.title) {
      handleSetTitle(checkpoint.checkpoint.title);
    }
    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

    if (state.questionData) {
      ''
      setInput(() => {
        return state.questionData;
      });
    }

    if (!input && !state.questionData) {
      setInput(() => {
        return setInitialState(checkpoint.checkpoint.questions.items);
      });
    }

    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

    if (state.questionData) {
      setInput(() => {
        return state.questionData;
      });
    }

    // if (!input && !state.questionData) {
    //   setInput(() => {
    //     return setInitialState(checkpoint.checkpoint.questions.items);
    //   });
    // }

    setStatus('loaded')
  }, []);

  useEffect(() => {
    if (checkpoint.checkpoint.title) {
      handleSetTitle(checkpoint.checkpoint.title);
    }

    if (checkpoint.checkpoint.questions.items) {
      checkpoint.checkpoint.questions.items.forEach(
        (item: { question: { id: string; type: string; label: string } }) => {
          setInput((prev: any) => {
            return {
              ...prev,
              [item.question.id]:
                item.question.type === 'text'
                  ? ''
                  : item.question.type === 'input'
                  ? ''
                  : item.question.type === 'selectOne'
                  ? null
                  : item.question.type === 'selectMany'
                  ? []
                  : null,
            };
          });
        }
      );
    }
  }, [checkpoint]);

  // useEffect(() => {

  //     // if ( state.questionData ) {
  //     //     setInput(() => {
  //     //         return state.questionData
  //     //     })
  //     // }

  //     console.log(state.questionData);

  // }, [state.questionData])

  const handleSelect = (e: any) => {
    const { id } = e.target;
    setSelected((prev) => {
      if (selected.indexOf(id) >= 0) {
        let newArray = selected.filter((item) => {
          return item !== id;
        });
        console.log(newArray, 'new array');
        return newArray;
      }
      return [...prev, id];
    });

    setInput({
      ...input,
      'where-im-from-lesson-reflection': selected,
    });
    // console.log(selected, 'selected')
  };

  useEffect(() => {
    console.log(input, 'input');

    if (input && state.questionData !== input) {
      dispatch({
        type: 'SET_QUESTION_DATA',
        payload: input,
      });
    }

    if (input && cookies.questionData !== input) {
      setCookie('questionData', input);
    }
  }, [input]);

  const handleInputChange = (e: any) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

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
          <div key={key} className={'w-full flex flex-col mb-2'}>
            <label className='mb-2' htmlFor={question.label}>
              {question.question}
            </label>
            <input
              id={question.id}
              className='w-9/10 py-2 px-4 text-gray-800 rounded-lg'
              type='text'
              name={question.label}
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
          <>
            <p className='mb-2'>{question.question}</p>
            <div id={question.label} className={'w-8/10 flex flex-col '}>
              {question.options.map(
                (
                  option: { label: string; icon: string; color: string; text: string },
                  key: any
                ) => (
                  <div key={key} className={`w-3/4 flex items-center mb-2`} onClick={handleSelect}>
                    {selected.indexOf(`${option.label}`) >= 0 ? (
                      <div
                        id={`${option.label}`}
                        className='cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center'
                        style={{ backgroundColor: `${option.color}` }}>
                        {option.icon ? option.icon : ''}
                      </div>
                    ) : (
                      <div
                        id={`${option.label}`}
                        className='bg-gray-400 shadow-2 cursor-pointer w-12 h-12 p-2 text-3xl rounded flex justify-center items-center'>
                        {option.icon ? option.icon : ''}
                      </div>
                    )}
                    <div id={`${option.label}`} className='mx-4'>
                      {option.text}
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        );
      default:
        return '';
    }
  };

  return (
    <div className={`w-full h-full flex flex-col text-gray-200`}>
      <h4
        className={`w-full text-2xl font-open font-bold ${
          checkpoint.checkpoint.subtitle ? 'border-b-2 border-gray-200 mb-2' : ''
        }`}>
        {checkpoint.checkpoint.subtitle ? checkpoint.checkpoint.subtitle : null}
      </h4>
      <h4 className={`w-full text-xl font-open font-bold`}>{checkpoint.checkpoint.instructions}</h4>
      <div
        className={`w-full h-full flex justify-center items-center divide-x-2 divide-dark divide-opacity-50`}>
        <div className='w-full h-full flex flex-col flex-wrap justify-around items-center py-4 px-2'>
          {checkpoint.checkpoint.questions.items.map((item: { question: any }, key: number) => {
            return <>{inputSwitch(item.question, key)}</>;
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
