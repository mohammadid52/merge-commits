import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {LessonControlContext} from '../../../contexts/LessonControlContext';

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
import {checkIfFirstNewInSequence} from '../../../utilities/strings';
import LessonElementCard from '../../Atoms/LessonElementCard';
import {CheckpointInterface} from './Checkpoint';
import findIndex from 'lodash/findIndex';
import {BsArrowRight, BsArrowLeft} from 'react-icons/bs';
import Tooltip from '../../Atoms/Tooltip';
import last from 'lodash/last';

interface CheckpointQuestionsProps {
  isTeacher?: boolean;
  handleSetTitle?: React.Dispatch<React.SetStateAction<string>>;
  checkpointType?: string;
  checkpointsItems?: any[];
  fromClosing?: boolean;
}

export interface ResponseState {
  [key: number]: any;
}

interface ResponseObject {
  qid: string;
  response: string[];
  other?: string;
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
  const {
    isTeacher,
    handleSetTitle,
    checkpointType,
    checkpointsItems,
    fromClosing,
  } = props;
  const switchContext = isTeacher
    ? useContext(LessonControlContext)
    : useContext(LessonContext);
  const {state, theme, dispatch, pageList, currentPage, setCurrentPage} = switchContext;

  const checkpointId = checkpointsItems.map((item: any, idx: number) => ({
    id: idx,
    name: item.title,
  }));

  /**
   * State
   */
  const [status, setStatus] = useState('');
  const [input, setInput] = useState<ResponseObject[]>();

  const isLesson = state.data.lesson.type === 'lesson';

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
   * 1. CHECK if there are checkpoints
   */
  // const thereAreCheckpoints =
  //   (() => {
  //     if (checkpointType === 'assessment' || checkpointType === 'checkpoint' || checkpointType === 'survey') {
  //       if (state.data.lesson && state.data.lesson.checkpoints && state.data.lesson.checkpoints.items) {
  //         return state.data.lesson.checkpoints.items;
  //       } else {
  //         return [];
  //       }
  //     }
  //     if (checkpointType === 'doFirst') {
  //       if (state.data.lesson.checkpoints.length > 0) {
  //         const doFirstCheckpoint = state.data.lesson.checkpoints.find((checkpoint: CheckpointInterface) => checkpoint.type === 'doFirst');
  //         if (doFirstCheckpoint.length > 0) {
  //           return doFirstCheckpoint;
  //         } else {
  //           return [];
  //         }
  //       } else {
  //         return [];
  //       }
  //
  //     }
  //   })().length > 0;

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
          state.data?.lesson &&
          state.data?.lesson?.checkpoints &&
          state.data?.lesson?.checkpoints?.items
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
          state.data?.lesson &&
          state.data?.lesson?.checkpoints &&
          state.data?.lesson?.checkpoints?.items
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
    if (checkpointArray && checkpointArray.length > 0) {
      return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
        if (checkpointObj.hasOwnProperty('questions')) {
          const questionItems = checkpointObj?.questions?.items; // Array of question objects
          return [...acc, ...questionItems];
        } else {
          return acc;
        }
      }, []);
    } else return [];
  };

  const collectQuestionGroups = (checkpointArray: any) => {
    if (checkpointArray && checkpointArray.length > 0) {
      return checkpointArray.reduce((acc: [], checkpointObj: any): any => {
        if (checkpointObj.hasOwnProperty('questions')) {
          const questionItems = checkpointObj?.questions?.items; // Array of question objects
          return [...acc, questionItems];
        } else {
          return acc;
        }
      }, []);
    } else return [];
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

  const [currentCheckpoint, setCurrentCheckpoint] = useState(checkpointId[0]);

  const currentCheckpointIdx = findIndex(
    questionSource(),
    (item: any) => item.title === currentCheckpoint.name
  );

  const [allQuestionData, setAllQuestionData] = useState([]);
  useEffect(() => {
    const data = allQuestionGroups()[currentCheckpointIdx];
    setAllQuestionData(data);
  }, []);
  const startIndex = (inArr: any, inc: number = 0, idxArr: number[]): number[] => {
    const [head, ...tail] = inArr;
    if (typeof head === 'undefined') {
      return idxArr;
    } else {
      return startIndex(tail, inc + head.length, [...idxArr, inc]);
    }
  };

  const indexInc = startIndex(allQuestionGroups(), 0, []);

  /**
   * 4. INITIALIZE STATE WITH QUESTION ARRAY
   * Loop over questionSource(checkpointType) to create an array of question ID's
   * and their answers e.g:
   * [..., {qid: "1", response: ['response']}]
   */
  const initialResponseState = allQuestions().reduce(
    (acc: any, questionObj: QuestionParentInterface) => {
      const checkpointIdString = questionObj.checkpointID
        ? questionObj.checkpointID?.toString()
        : 'undefined-checkpointID';
      const questionIdString = questionObj.question.id.toString();

      if (acc.hasOwnProperty(checkpointIdString)) {
        return {
          ...acc,
          [checkpointIdString]: [
            ...acc[checkpointIdString],
            {qid: questionIdString, response: []},
          ],
        };
      } else {
        return {
          ...acc,
          [checkpointIdString]: [{qid: questionIdString, response: []}],
        };
      }
    },
    []
  );

  /**
   * HANDLE CHANGE OF QUESTION SELECTION
   */
  const handleInputChange = (
    id: number | string,
    value: string | string[],
    checkpointID: string
  ) => {
    const valueArray = typeof value === 'string' ? [value] : value;
    const updatedInput = Object.keys(input).reduce((acc: any, checkpointIDgroup: any) => {
      if (checkpointIDgroup === checkpointID) {
        // @ts-ignore
        const mappedInput = input[checkpointIDgroup].map((obj: ResponseObject) => {
          if (obj.qid === id) {
            return {
              qid: id,
              response: valueArray,
            };
          } else {
            return obj;
          }
        });
        return {...acc, [checkpointIDgroup]: mappedInput};
      } else {
        return {...acc, [checkpointIDgroup]: input[checkpointIDgroup]};
      }
    }, {});

    // UPDATE THIS COMPONENT STATE
    setInput(updatedInput);

    // UPDATE CONTEXT WITH NEW INFO YAY!
    dispatch({
      type: 'SET_QUESTION_DATA',
      payload: {
        data: {...state.questionData, [checkpointID]: updatedInput[checkpointID]},
      },
    });
  };

  useEffect(() => {
    if (fromClosing && checkpointId.length > 0) {
      setCurrentCheckpoint(last(checkpointId));
    }
  }, [fromClosing]);

  const onBack = () => {
    if (currentCheckpointIdx > 0) {
      setCurrentCheckpoint(checkpointId[currentCheckpointIdx - 1]);
    } else {
      setCurrentPage(pageList[currentPageIdx - 1]);
    }
  };
  const onNext = () => {
    if (currentCheckpointIdx !== checkpointId.length - 1) {
      setCurrentCheckpoint(checkpointId[currentCheckpointIdx + 1]);
    } else {
      setCurrentPage(pageList[currentPageIdx + 1]);
    }
  };

  const currentPageIdx = findIndex(pageList, (item: any) => item.id === currentPage.id);

  const tooltipTextForBackBtn =
    currentCheckpointIdx === 0
      ? `${pageList[currentPageIdx - 1].name} section`
      : 'Previous Checkpoint';

  const tooltipTextForNextBtn =
    currentCheckpointIdx === questionSource().length - 1
      ? `${pageList[currentPageIdx + 1].name} section`
      : 'Next Checkpoint';

  if (status !== 'loaded') return null;

  return (
    <div className={theme.section}>
      <div className={`${theme.elem.text}`}>
        <div className="w-full h-full my-4 flex flex-col flex-wrap justify-around items-center">
          {questionSource()
            ? questionSource().length > 0 && (
                <div className="">
                  <QuestionGroupInfo
                    key={`qgroup_${currentCheckpointIdx}`}
                    isTeacher={isTeacher}
                    checkpointID={allQuestionGroups()[0].checkpointID}
                    checkpoint={
                      questionSource() ? questionSource()[currentCheckpointIdx] : null
                    }
                  />
                  <LessonElementCard key={`questiongroup_${currentCheckpointIdx}`}>
                    {allQuestionData.map((question: QuestionInterface, idx: number) => {
                      const realIndex = indexInc[currentCheckpointIdx] + idx;
                      return (
                        <React.Fragment key={`questionFragment_${realIndex}`}>
                          <div
                            key={`questionParent_${realIndex}`}
                            id={`questionParent_${realIndex}`}
                            className={`mb-8`}>
                            <Question
                              checkpointID={
                                question.checkpointID
                                  ? question.checkpointID
                                  : 'undefined-checkpointID'
                              }
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
                    })}
                  </LessonElementCard>
                </div>
              )
            : null}
          {currentPage.name === 'checkpoints' && (
            <div className="flex mt-4 items-center justify-between text-white">
              <div
                onClick={onBack}
                className="pageChange__btn px-2 py-1 border-0 border-sea-green rounded hover:bg-sea-green transition-all cursor-pointer flex items-center">
                <Tooltip text={tooltipTextForBackBtn} placement="bottom">
                  <div className="flex items-center back-content">
                    <BsArrowLeft color="#fff" />
                    <p className="ml-2">Back</p>
                  </div>
                </Tooltip>
              </div>
              <div
                onClick={onNext}
                className="pageChange__btn px-2 py-1 border-0 border-sea-green rounded hover:bg-transparent bg-sea-green transition-all cursor-pointer flex items-center">
                <Tooltip text={tooltipTextForNextBtn} placement="bottom">
                  <div className="flex items-center next-content">
                    <p className="mr-2">Next</p>
                    <BsArrowRight color="#fff" />
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckpointQuestions;
