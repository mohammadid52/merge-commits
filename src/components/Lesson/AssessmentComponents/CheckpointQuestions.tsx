import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import QuestionGroupInfo from './QuestionGroupInfo';
import { checkIfFirstNewInSequence } from '../../../utilities/strings';
import LessonElementCard from '../../Atoms/LessonElementCard';
import { CheckpointInterface } from './Checkpoint';
import { BodyProps } from '../Body/Body';
import { a } from 'aws-amplify';

interface CheckpointQuestionsProps {
  setupComplete?: boolean;
  isTeacher?: boolean;
  handleSetTitle?: React.Dispatch<React.SetStateAction<string>>;
  checkpointType?: string;
  checkpointsLoaded?: BodyProps['checkpointsLoaded'];
  checkpointsItems?: any[];
}

export interface ResponseState {
  [key: number]: any;
}

interface ResponseObject {
  qid: string;
  response: string[];
}

export interface QuestionInterface {
  checkpointID?: string;
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
  const { isTeacher, handleSetTitle, checkpointType, checkpointsItems } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * State
   */
  const [loaded, setLoaded] = useState<boolean>(false);
  const [input, setInput] = useState<ResponseObject[]>();
  const [newInput, setNewInput] = useState<{ checkpointID: string; qid: string; response: string[] }>({
    checkpointID: '',
    qid: '',
    response: [],
  });
  const [checkpointsArray, setCheckpointsArray] = useState<any[]>([]);
  const [questionsArray, setQuestionsArray] = useState<any[]>([]);
  const [questionGroups, setQuestionGroups] = useState<any[]>([]);

  /**
   * 3. CONCAT all checkpoint questions to a usable
   * object structure
   * @param checkpointArray
   */
  const flattenCheckpoints = (checkpointArray: any) => {
    return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
      const questionItems: any[] = checkpointObj?.questions?.items;
      if (questionItems && questionItems.length > 0) {
        const mappedCheckpointID: any[] = questionItems.map((questionObj: any) => {
          return { ...questionObj, checkpointID: checkpointObj.id };
        });
        return [...acc, ...mappedCheckpointID];
      } else {
        return acc;
      }
    }, []);
  };

  const collectQuestionGroups = (checkpointArray: any) => {
    return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
      const questionItems = checkpointObj.questions?.items;
      if (questionItems && questionItems.length > 0) {
        const mappedCheckpointID: any[] = questionItems.map((questionObj: any) => {
          return { ...questionObj, checkpointID: checkpointObj.id };
        });
        return [...acc, mappedCheckpointID];
      } else {
        return acc;
      }
    }, []);
  };

  /**
   * FLATTENED CHECKPOINT QUESTIONS VARIABLE
   */

  const allQuestions = (src: any[]) => {
    return flattenCheckpoints(src);
  };

  const allQuestionGroups = (src: any[]) => {
    return collectQuestionGroups(src);
  };

  /**
   * USEEFFECT 1 - ON CHECKPOINT MOUNT
   */
  useEffect(() => {
    if (checkpointsItems && checkpointsItems.length > 0) {
      if (!isTeacher) {
        setInput(state.questionData);
      }
      setCheckpointsArray(checkpointsItems);
    }
  }, [checkpointsItems]);

  useEffect(() => {
    console.log('checkpointsArray', checkpointsArray);
    if (checkpointsArray.length > 0) {
      setQuestionsArray(allQuestions(checkpointsItems));
      setQuestionGroups(allQuestionGroups(checkpointsItems));
    }
  }, [checkpointsArray]);

  const startIndex = (inArr: any, inc: number = 0, idxArr: number[]): number[] => {
    const [head, ...tail] = inArr;
    if (typeof head === 'undefined') {
      return idxArr;
    } else {
      return startIndex(tail, inc + head.length, [...idxArr, inc]);
    }
  };

  /**
   * 4. INITIALIZE STATE WITH QUESTION ARRAY
   * Loop over questionSource(checkpointType) to create an array of question ID's
   * and their answers e.g:
   * [..., {qid: "1", response: ['response']}]
   *

  /**
   * HANDLE CHANGE OF QUESTION SELECTION
   */
  const handleInputChange = (id: string, value: string | string[], checkpointID: string) => {
    const valueArray = typeof value === 'string' ? [value] : value;

    setNewInput({ checkpointID: checkpointID, qid: id, response: valueArray });
  };

  useEffect(() => {
    if (newInput.checkpointID !== '') {
      const newQuestionData = {
        ...state.questionData,
        [newInput.checkpointID]: state.questionData[newInput.checkpointID].map((questionObj: any) => {
          if (questionObj.qid === newInput.qid) {
            return { qid: newInput.qid, response: newInput.response };
          } else {
            return questionObj;
          }
        }),
      };

      // UPDATE THIS COMPONENT STATE
      setInput(newQuestionData);

      // UPDATE CONTEXT WITH NEW INFO YAY!
      dispatch({
        type: 'SET_QUESTION_DATA',
        payload: {
          data: { ...state.questionData, [newInput.checkpointID]: newQuestionData[newInput.checkpointID] },
        },
      });
      setNewInput({ checkpointID: '', qid: '', response: [] });
    }
  }, [newInput]);

  const generateQuestions = (questionGroups: any[]) => {
    const stringifiedQuestionsArray = questionsArray.map((questionObj: any) => JSON.stringify(questionObj));
    const outputQuestions = questionGroups.map((questionGroup: any, idx0: number) => {
      const part1 = () => {
        return (
          <QuestionGroupInfo
            key={`qgroup_${idx0}`}
            isTeacher={isTeacher}
            checkpointID={questionGroup[0].checkpointID}
            checkpoint={checkpointsArray.length > 0 ? checkpointsArray[idx0] : {}}
          />
        );
      };
      const part2 = () => {
        return questionGroup.map((question: QuestionInterface, idx: number) => {
          const realIndex = stringifiedQuestionsArray.indexOf(JSON.stringify(question));
          return (
            <React.Fragment key={`questionFragment_${realIndex}`}>
              <div key={`questionParent_${realIndex}`} id={`questionParent_${realIndex}`} className={`mb-8`}>
                <Question
                  checkpointID={question.checkpointID ? question.checkpointID : 'undefined-checkpointID'}
                  visible={true}
                  isTeacher={isTeacher}
                  question={question}
                  questionIndex={realIndex}
                  questionKey={`question_${realIndex}`}
                  value={input}
                  handleInputChange={handleInputChange}
                />
              </div>
            </React.Fragment>
          );
        });
      };
      const part3 = <LessonElementCard key={`questiongroup_${idx0}`}>{part2()}</LessonElementCard>;
      return [part1(), part3];
    });

    // console.log('generateQuestions -> ', outputQuestions);
    return outputQuestions;
  };

  const memoizedQuestions = useMemo(() => generateQuestions(questionGroups), [questionGroups]);

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full my-4 flex flex-col flex-wrap justify-around items-center">
          {checkpointsItems.length > 0 && memoizedQuestions}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
