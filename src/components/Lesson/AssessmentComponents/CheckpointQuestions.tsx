import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';
import queryString from 'query-string';

/**
 * ICON IMPORTS
 */
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

/**
 * MAIN QUESTION COMPONENT IMPORTS
 */
import SelectOneQuestions from './Questions/SelectOneQuestions';
import TextQuestions from './Questions/TextQuestions';

/**
 * QUESTION SELECTOR COMPONENT IMPORT
 */

import Question from './Question';

interface CheckpointQuestionsProps {
  isTeacher?: boolean;
  handleSetTitle?: React.Dispatch<React.SetStateAction<string>>;
}

interface ResponseState {
  [key: number]: string | number | [];
}

export interface QuestionInterface {
  id: string;
  label: string;
  options: any[];
  question?: any;
  type: string;
  required: boolean;
}

const CheckpointQuestions = (props: CheckpointQuestionsProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, handleSetTitle } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * State
   */
  const [status, setStatus] = useState('');
  const [input, setInput] = useState<ResponseState>();

  /**
   * Other
   */
  const queryParams = queryString.parse(location.search);
  const checkpoints = state.data.lesson.checkpoints.items;

  /**
   * allQuestions - flattened array of all questions contained in
   * multiple checkpoints, if there are multiple
   */
  const allQuestions = checkpoints.reduce((acc: [], checkpointObj: any) => {
    const questionItems = checkpointObj.checkpoint.questions.items; // Array of question objects
    return [...acc, ...questionItems];
  }, []);

  /**
   * Loop over allQuestions to create an object of question ID's
   * and their answers e.g:
   *
   * { 2:'', 3:'', 6:[], 10:''}
   */
  const initialResponseState = allQuestions.reduce((acc: {}, questionObj: QuestionInterface) => {
    const dataType = (questionType: string): string | [] => {
      switch (questionType) {
        case 'text':
        case 'input':
        case 'selectOne':
          return '';
          break;
        case 'selectMany':
          return [];
          break;
        default:
          return '';
      }
    };

    const questionIdString = questionObj.question.id.toString();

    return { ...acc, [questionIdString]: dataType(questionObj.question.type) };
  }, {});

  /**
   * ON CHECKPOINT MOUNT
   */
  useEffect(() => {
    setInput(initialResponseState);

    // console.log('Initial response state --> ', initialResponseState)

    // TODO: below logic should be activated once new function to populate state is complete
    // let questionDataKeys = [];
    //
    // if (state.questionData[checkpoint.checkpoint.id]) {
    //   questionDataKeys = Object.keys(state.questionData[checkpoint.checkpoint.id]);
    // }
    //
    // if (!input && questionDataKeys.length > 0) {
    //   setInput(() => {
    //     return state.questionData[checkpoint.checkpoint.id];
    //   });
    // }

    // if (!input && questionDataKeys.length <= 0) {
    //   setInput(() => {
    //     return setInitialState(checkpoint.checkpoint.questions.items);
    //   });
    // }

    setStatus('loaded');
  }, []);

  /**
   * ON CHECKPOINT/ASSESSMENT CHANGE
   */
  useEffect(() => {
    // if (checkpoint.checkpoint.title) {
    //   handleSetTitle(checkpoint.checkpoint.title);
    // }
    //
    // if (input && checkpoint.checkpoint.questions.items) {
    //   checkpoint.checkpoint.questions.items.forEach(
    //     (item: { question: { id: string; type: string; label: string } }) => {
    //       let inputKeys = Object.keys(input);
    //       let found = inputKeys.some((key: string) => {
    //         item.question.id === key;
    //       });
    //
    //       if (!found) {
    //         setInput((prev: any) => {
    //           return {
    //             ...prev,
    //             [item.question.id]:
    //               item.question.type === 'text'
    //                 ? ''
    //                 : item.question.type === 'input'
    //                 ? ''
    //                 : item.question.type === 'selectOne'
    //                 ? null
    //                 : item.question.type === 'selectMany'
    //                 ? []
    //                 : null,
    //           };
    //         });
    //       }
    //     }
    //   );
    // }
  }, []);

  // const handleSelect = (e: any) => {
  //   const questionID = e.target.getAttribute('data-key');
  //   const { id } = e.target;
  //
  //   let array;
  //   let found = input[questionID].some((item: string) => {
  //     return item === id;
  //   });
  //
  //   if (found) {
  //     array = input[questionID].filter((item: string) => {
  //       return item !== id;
  //     });
  //   }
  //
  //   if (!found) {
  //     array = input[questionID];
  //     array.push(id);
  //   }
  //
  //   setInput({
  //     ...input,
  //     [questionID]: array,
  //   });
  // };

  /**
   * USEEFFECT for dispatching checkpoint question data to context
   */
  useEffect(() => {
    // if (input && state.questionData[checkpoint.checkpoint.id] !== input) {
    // let dispatchInput: any = {};
    // checkpoint.checkpoint.questions.items.forEach(
    //   (item: { question: { id: string; type: string; label: string } }) => {
    //     if (
    //       input[item.question.id] !== null &&
    //       input[item.question.id] !== undefined &&
    //       input[item.question.id] !== ''
    //     ) {
    //       dispatchInput[item.question.id] = input[item.question.id];
    //     }
    //   }
    // );
    // dispatch({
    //   type: 'SET_QUESTION_DATA',
    //   payload: {
    //     key: checkpoint.checkpoint.id,
    //     data: dispatchInput,
    //   },
    // });
    // }
  }, [input]);

  const handleInputChange = (id: number | string, value: string) => {
    console.log('handleInputChange -> ', `id: ${id} :: value: ${value}`);
    setInput({
      ...input,
      [id]: value,
    });
  };

  if (status !== 'loaded') return null;

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full flex flex-col flex-wrap justify-around items-center">
          {allQuestions.map((question: QuestionInterface, key: number) => {
            return (
              <div key={`questionParent_${key}`}>
                <Question
                  question={question}
                  questionIndex={key}
                  questionKey={`question_${key}`}
                  handleInputChange={handleInputChange}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
