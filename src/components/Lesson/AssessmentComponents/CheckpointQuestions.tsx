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
  isTeacher?: boolean;
  handleSetTitle?: React.Dispatch<React.SetStateAction<string>>;
  checkpointType?: string;
  checkpointsLoaded?: BodyProps['checkpointsLoaded'];
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
  const { isTeacher, handleSetTitle, checkpointType, checkpointsLoaded } = props;
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
   * USEEFFECT 1 - ON CHECKPOINT MOUNT
   */
  useEffect(() => {
    if (state.data.lesson.checkpoints && state.data.lesson.checkpoints.items) {
      if (!isTeacher) {
        setInput(initialResponseState());
      }
      setCheckpointsArray(state.data.lesson.checkpoints.items);
      setQuestionsArray([...questionsArray, ...allQuestions()]);
      setQuestionGroups([...questionGroups, ...allQuestionGroups()]);
    }
  }, [state.data.lesson.checkpoints]);

  useEffect(() => {
    if (checkpointsArray.length > 0 && questionsArray.length > 0 && questionGroups.length > 0) {
      if (!loaded) {
        setLoaded(true);
      }
    }
  }, [checkpointsArray, questionsArray, questionGroups]);

  /**
   * 2. SWITCH source of question depending on
   * type of checkpoint - this changes.
   */
  const questionSource = (): any[] => {
    switch (checkpointType) {
      case 'assessment':
      case 'checkpoint':
      case 'survey':
        const checkpoints =
          state.data?.lesson && state.data?.lesson?.checkpoints && state.data?.lesson?.checkpoints?.items
            ? state.data.lesson.checkpoints.items.filter(
                (checkpoint: CheckpointInterface) => checkpoint?.type !== 'doFirst'
              )
            : [];
        if (checkpoints?.length > 0) {
          return checkpoints;
        } else {
          return [];
        }
      case 'doFirst':
        const doFirstCheckpoint =
          state.data?.lesson && state.data?.lesson?.checkpoints && state.data?.lesson?.checkpoints?.items
            ? state.data?.lesson?.checkpoints?.items.filter(
                (checkpoint: CheckpointInterface) => checkpoint?.type === 'doFirst'
              )
            : [];
        return doFirstCheckpoint;
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
    return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
      const questionItems: any[] = checkpointObj?.checkpoint?.questions?.items;

      if (questionItems && questionItems.length > 0) {
        const mappedCheckpointID: any[] = questionItems.map((questionObj: any) => {
          return { ...questionObj, checkpointID: checkpointObj.checkpoint.id };
        });
        return [...acc, ...mappedCheckpointID];
      } else {
        return acc;
      }
    }, []);
  };

  const collectQuestionGroups = (checkpointArray: any) => {
    return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
      const questionItems: any[] = checkpointObj?.checkpoint?.questions?.items;

      if (questionItems && questionItems.length > 0) {
        const mappedCheckpointID: any[] = questionItems.map((questionObj: any) => {
          return { ...questionObj, checkpointID: checkpointObj.checkpoint.id };
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

  const allQuestions = () => {
    return flattenCheckpoints(questionSource());
  };

  const allQuestionGroups = () => {
    return collectQuestionGroups(questionSource());
  };

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
   */
  const initialResponseState = () =>
    allQuestions().reduce((acc: any, questionObj: QuestionParentInterface) => {
      const checkpointIdString = questionObj.checkpointID
        ? questionObj.checkpointID?.toString()
        : 'undefined-checkpointID';
      const questionIdString = questionObj.question.id.toString();

      if (acc.hasOwnProperty(checkpointIdString)) {
        return {
          ...acc,
          [checkpointIdString]: [...acc[checkpointIdString], { qid: questionIdString, response: [] }],
        };
      } else {
        return {
          ...acc,
          [checkpointIdString]: [{ qid: questionIdString, response: [] }],
        };
      }
    }, []);

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
            checkpointsLoaded={checkpointsLoaded}
            isTeacher={isTeacher}
            checkpointID={questionGroup[0].checkpointID}
            checkpoint={checkpointsArray.length > 0 ? checkpointsArray[idx0]['checkpoint'] : {}}
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

    console.log('generateQuestions -> ', outputQuestions);
    return outputQuestions;
  };

  const memoizedQuestions = useMemo(() => generateQuestions(questionGroups), [questionGroups]);

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full my-4 flex flex-col flex-wrap justify-around items-center">
          {loaded && memoizedQuestions}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
