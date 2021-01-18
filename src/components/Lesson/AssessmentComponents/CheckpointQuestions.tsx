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
  checkpointType?: string;
}

export interface ResponseState {
  [key: number]: any;
}

interface ResponseObject {
  qid: string;
  response: string[];
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
  const { isTeacher, handleSetTitle, checkpointType } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * State
   */
  const [status, setStatus] = useState('');
  const [input, setInput] = useState<ResponseObject[]>();

  /**
   * Other
   * - queryParams (possibly deprecated)
   * - question source switch : to switch between checkpoint questions and doFirst questions
   */
  const queryParams = queryString.parse(location.search);

  const flattenCheckpoints = (checkpointArray: any) => {
    return checkpointArray.reduce((acc: [], checkpointObj: any) => {
      const questionItems = checkpointObj.checkpoint.questions.items; // Array of question objects
      return [...acc, ...questionItems];
    }, []);
  };

  const questionSource = (() => {
    switch (checkpointType) {
      case 'assessment':
      case 'checkpoint':
        const checkpoints = state.data.lesson.checkpoints.items;
        return flattenCheckpoints(checkpoints);
      case 'doFirst':
        const doFirst = state.data.lesson.doFirst.questions.items;
        return doFirst;
      default:
        return null;
    }
  })();

  /**
   * Loop over questionSource(checkpointType) to create an array of question ID's
   * and their answers e.g:
   *
   * [..., {qid: "1", response: ['response']}]
   */
  const initialResponseState = questionSource.reduce((acc: any[], questionObj: QuestionInterface) => {
    const questionIdString = questionObj.question.id.toString();

    return [...acc, { qid: questionIdString, response: [] }];
  }, []);

  /**
   * ON CHECKPOINT MOUNT
   */
  useEffect(() => {
    if (!isTeacher) setInput(initialResponseState);

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
  useEffect(() => {}, []);

  /**
   * USEEFFECT for dispatching checkpoint question data to context
   */
  useEffect(() => {
    /**
     * TODO:
     *  questionDataKey logic needs refining when
     *  more variables/columns are added to the DB.
     *  In the future there'll only be doFirst/Checkpoint/Assessment
     *  and they will have their respective ID's
     */

    if (!isTeacher) {
      if (checkpointType !== 'doFirst') {
        const firstCheckpoint = state.data.lesson.checkpoints.items[0].checkpoint.id;
        const questionDataKey =
          checkpointType === 'doFirst'
            ? 'doFirst'
            : checkpointType === 'checkpoint' || checkpointType === 'survey'
            ? `${checkpointType}_${firstCheckpoint}`
            : 'unknown_checkpoint';

        if (input) {
          dispatch({
            type: 'SET_QUESTION_DATA',
            payload: {
              key: questionDataKey,
              data: input,
            },
          });
        }
      }

      if (checkpointType === 'doFirst') {
        const questionDataKey = 'doFirst';

        if (input) {
          dispatch({
            type: 'SET_QUESTION_DATA',
            payload: {
              key: questionDataKey,
              data: input,
            },
          });
        }
      }
    }
  }, [input]);

  const handleInputChange = (id: number | string, value: string | string[]) => {
    const valueArray = typeof value === 'string' ? [value] : value;
    const mappedInput = input.map((obj: ResponseObject) => {
      if (obj.qid === id) {
        return {
          qid: id,
          response: valueArray,
        };
      } else {
        return obj;
      }
    });
    setInput(mappedInput);
  };

  if (status !== 'loaded') return null;

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full flex flex-col flex-wrap justify-around items-center">
          {questionSource.map((question: QuestionInterface, key: number) => {
            return (
              <div key={`questionParent_${key}`} id={`questionParent_${key}`}>
                <Question
                  isTeacher={isTeacher}
                  question={question}
                  questionIndex={key}
                  questionKey={`question_${key}`}
                  value={input}
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
