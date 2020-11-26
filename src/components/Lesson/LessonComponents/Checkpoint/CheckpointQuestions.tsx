import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import queryString from 'query-string';
// import { useCookies } from 'react-cookie';
import SelectOneQuestions from './Questions/SelectOneQuestions';
import TextQuestions from './Questions/TextQuestions';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

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
  const { state, theme, dispatch } = useContext(LessonContext);
  // const [cookies, setCookie] = useCookies(['questionData']);
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
  const [status, setStatus] = useState('');
  const [input, setInput] = useState<any>();

  useEffect(() => {
    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

    let questionDataKeys = [];

    if (state.questionData[checkpoint.checkpoint.id]) {
      questionDataKeys = Object.keys(state.questionData[checkpoint.checkpoint.id]);
    }

    if (!input && questionDataKeys.length > 0) {
      // console.log('oldu', state.questionData);

      setInput(() => {
        return state.questionData[checkpoint.checkpoint.id];
      });
    }

    if (!input && questionDataKeys.length <= 0) {
      // console.log('bu da oldu');

      setInput(() => {
        return setInitialState(checkpoint.checkpoint.questions.items);
      });
    }

    setStatus('loaded');
    // if ( cookies.questionData ) {
    //     dispatch({
    //         type: 'SET_QUESTION_DATA',
    //         payload: cookies.questionData
    //     })
    // }

    // if (!input && !state.questionData) {
    //   setInput(() => {
    //     return setInitialState(checkpoint.checkpoint.questions.items);
    //   });
    // }
  }, []);

  useEffect(() => {
    if (checkpoint.checkpoint.title) {
      handleSetTitle(checkpoint.checkpoint.title);
    }

    if (input && checkpoint.checkpoint.questions.items) {
      checkpoint.checkpoint.questions.items.forEach(
        (item: { question: { id: string; type: string; label: string } }) => {
          let inputKeys = Object.keys(input);
          let found = inputKeys.some((key: string) => {
            item.question.id === key;
          });

          if (!found) {
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
        }
      );
    }
  }, [checkpoint]);

  useEffect(() => {
    // console.log('input', input);
    console.log('qData', state.questionData);
  }, [state.questionData]);

  const handleSelect = (e: any) => {
    const questionID = e.target.getAttribute('data-key');
    const { id } = e.target;

    let array;
    let found = input[questionID].some((item: string) => {
      return item === id;
    });

    if (found) {
      array = input[questionID].filter((item: string) => {
        return item !== id;
      });
    }

    if (!found) {
      array = input[questionID];
      array.push(id);
    }

    setInput({
      ...input,
      [questionID]: array,
    });

    // console.log(selected, 'selected')
  };

  useEffect(() => {
    // console.log('input', input);

    if (input && state.questionData[checkpoint.checkpoint.id] !== input) {
      let dispatchInput: any = {};
      checkpoint.checkpoint.questions.items.forEach(
        (item: { question: { id: string; type: string; label: string } }) => {
          if (
            input[item.question.id] !== null &&
            input[item.question.id] !== undefined &&
            input[item.question.id] !== ''
          ) {
            dispatchInput[item.question.id] = input[item.question.id];
          }
        }
      );

      dispatch({
        type: 'SET_QUESTION_DATA',
        payload: {
          key: checkpoint.checkpoint.id,
          data: dispatchInput,
        },
      });
    }

    // if (input && cookies.questionData !== input) {
    //   setCookie('questionData', input);
    // }
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
          <div key={key} className={'flex flex-col mb-4'}>
            <label className={theme.elem.text} htmlFor={question.label}>
            <p><b>{key + 1}. </b>{question.question}</p>
            </label>
            <input
              id={question.id}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
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
          number={key}
            keyProp={key}
            question={question}
            value={input[question.id]}
            handleInputChange={handleInputChange}
            checkpointID={checkpoint.checkpoint.id}
          />
        );
      case 'selectOne':
        return (
          <SelectOneQuestions
          number={key}
            keyProp={key}
            question={question}
            value={input[question.id]}
            handleInputChange={handleInputChange}
            checkpointID={checkpoint.checkpoint.id}
          />
        );
      case 'selectMany':
        return (
          <div className={`w-full rounded-xl`}>
            <div className={theme.elem.text}><p><b>{key + 1}. </b>{question.question}</p></div>
            <div id={question.label} className={'flex'}>
              {question.options.map(
                (
                  option: { label: string; icon: string; color: string; text: string },
                  key: any
                ) => (
                    <div
                      key={key}
                      className={`w-3/4 flex justify-center items-center mb-2`}
                      onClick={handleSelect}
                      data-key={question.id}>

                      {input[question.id].indexOf(`${option.label}`) >= 0 ? (
                        <div
                          id={`${option.label}`}
                          className='cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center'
                          style={{ backgroundColor: `${option.color}` }}
                          data-key={question.id}>

                          <IconContext.Provider  value={{ color: '#EDF2F7', size: '1.25rem', className: 'w-auto mr-2'}}>
                            
                              <ImCheckboxChecked />
                          
                          </IconContext.Provider>

                          {/* {option.icon ? option.icon : ''} */}
                          {option.text}

                        </div>
                      ) : (
                          <div
                            id={`${option.label}`}
                            className='bg-gray-400 text-black50 cursor-pointer w-36 h-12 p-2 text-base rounded flex justify-start items-center'
                            data-key={question.id}>

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
        return '';
    }
  };

  if (status !== 'loaded') return null;

  return (
    <div className={theme.section}>
      {checkpoint.checkpoint.subtitle ? (
        <h3 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
          {checkpoint.checkpoint.subtitle}
        </h3>
      ) : (
          ''
        )}

      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        {checkpoint.checkpoint.instructions}
      </div>

      <div className={`${theme.elem.text}`}>
        <div className='w-full h-full flex flex-col flex-wrap justify-around items-center'>
          {checkpoint.checkpoint.questions.items.map((item: { question: any }, key: number) => {
            return <>{inputSwitch(item.question, key)}</>;
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
