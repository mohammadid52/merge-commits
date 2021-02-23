import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

/**
 * ICON IMPORTS
 */

/**
 * MAIN QUESTION COMPONENT IMPORTS
 */

/**
 * QUESTION SELECTOR COMPONENT IMPORT
 */
import Question from './Question';
import { useRouteMatch } from 'react-router-dom';
import QuestionGroupInfo from './QuestionGroupInfo';

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

export interface QuestionParentInterface {
  checkpointID?: string;
  createdAt?: string;
  id?: string;
  question: QuestionInterface;
}

const CheckpointQuestions = (props: CheckpointQuestionsProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, handleSetTitle, checkpointType } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  const match = useRouteMatch();

  /**
   * State
   */
  const [status, setStatus] = useState('');
  const [input, setInput] = useState<ResponseObject[]>();

  /**
   * USEEFFECT 1 - ON CHECKPOINT MOUNT
   */
  useEffect(() => {
    if (state.data.lesson.checkpoints && state.data.lesson.checkpoints.items) {
      if (!isTeacher) {
        setInput(initialResponseState);
      }
      setStatus('loaded');
    }
  }, [state.data.lesson.checkpoints]);

  /**
   * USEEFFECT 2 - for dispatching checkpoint question data to context
   */
  useEffect(() => {
    if (!isTeacher) {
      if (thereAreCheckpoints) {
        if (input) {
          dispatch({
            type: 'SET_QUESTION_DATA',
            payload: {
              data: input,
            },
          });
        }
      }
    }
  }, [input]);

  /**
   * HANDLE CHANGE OF QUESTION SELECTION
   */
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

  /**
   * 1. CHECK if there are checkpoints
   */
  const thereAreCheckpoints =
    (() => {
      if (checkpointType === 'assessment' || checkpointType === 'checkpoint' || checkpointType === 'survey') {
        if (state.data.lesson && state.data.lesson.checkpoints && state.data.lesson.checkpoints.items) {
          return state.data.lesson.checkpoints.items;
        } else {
          return [];
        }
      }
      if (checkpointType === 'doFirst') {
        if (
          state.data.lesson &&
          state.data.lesson.doFirst &&
          state.data.lesson.doFirst.questions &&
          state.data.lesson.doFirst.questions.items
        ) {
          return state.data.lesson.doFirst.questions.items;
        } else {
          return [];
        }
      }
    })().length > 0;

  /**
   * 2. SWITCH source of question depending on
   * type of checkpoint - this changes.
   */
  const questionSource = () => {
    switch (checkpointType) {
      case 'assessment':
      case 'checkpoint':
      case 'survey':
        const checkpoints =
          state.data.lesson && state.data.lesson.checkpoints && state.data.lesson.checkpoints.items
            ? state.data.lesson.checkpoints.items
            : [];
        if (checkpoints.length > 0) {
          return checkpoints;
        } else {
          return [];
        }
      case 'doFirst':
        const doFirst = state.data.lesson.doFirst.questions.items;
        return doFirst;
      default:
        return null;
    }
  };

  /**
   * 3. CONCAT all checkpoint questions to a usable
   * object structure
   * @param checkpointArray
   */
  const flattenCheckpoints = (checkpointArray: any) => {
    return checkpointArray.reduce((acc: [], checkpointObj: any) => {
      const questionItems = checkpointObj.questions.items; // Array of question objects
      return [...acc, ...questionItems];
    }, []);
  };

  /**
   * FLATTENED CHECKPOINT QUESTIONS VARIABLE
   */

  const allQuestions = flattenCheckpoints(questionSource());

  /**
   * 4. INITIALIZE STATE WITH QUESTION ARRAY
   * Loop over questionSource(checkpointType) to create an array of question ID's
   * and their answers e.g:
   * [..., {qid: "1", response: ['response']}]
   */
  const initialResponseState = allQuestions.reduce((acc: any[], questionObj: QuestionParentInterface) => {
    const questionIdString = questionObj.question.id.toString();
    return [...acc, { qid: questionIdString, response: [] }];
  }, []);


  /**
   * 5. CHECK if is a pivot question i.e. last of checkpoint or not
   */
  const checkIfNewSection = (before: string, current: string, after: string) => {
    const notSameAsBefore = current !== before;
    const sameAsAfter = current === after;

    if(notSameAsBefore && sameAsAfter){
      return true;
    } else {
      if(typeof before === 'undefined'){
        return true;
      } else if(notSameAsBefore && typeof after === 'undefined'){
        return true;
      } else {
        return false;
      }
    }
  }

  if (status !== 'loaded') return null;

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className='w-full h-full flex flex-col flex-wrap justify-around items-center'>
          {questionSource().length > 0 &&
          allQuestions.map((question: QuestionInterface, idx: number) => {
            return (
              <React.Fragment key={`questionFragment_${idx}`}>
                {
                  checkIfNewSection(allQuestions[idx-1]?.checkpointID,allQuestions[idx].checkpointID,allQuestions[idx+1]?.checkpointID)?
                    (<QuestionGroupInfo checkpointID={allQuestions[idx].checkpointID}/>) :
                    null
                }
                <div key={`questionParent_${idx}`} id={`questionParent_${idx}`}>
                  <Question
                    visible={true}
                    isTeacher={isTeacher}
                    question={question}
                    questionIndex={idx}
                    questionKey={`question_${idx}`}
                    value={input}
                    handleInputChange={handleInputChange}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
