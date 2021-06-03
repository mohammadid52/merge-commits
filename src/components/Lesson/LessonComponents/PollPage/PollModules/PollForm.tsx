import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import { useCookies } from 'react-cookie';

import { PollInput } from './PollActivity';
import { PollBreakdownProps } from '../PollBreakdown/PollBreakdown';

export type PollInputState = Array<PollInput>;

interface PollFormProps {
  isTeacher?: boolean;
  dataProps?: {
    pollInputs: PollInput[];
    poll: PollInput[];
    additional: any;
  };
}

const PollForm = (props: PollBreakdownProps) => {
  /**
   * Teacher switch
   */
  const { isTeacher, dataProps } = props;
  const switchContext = isTeacher ? useContext(LessonControlContext) : useContext(LessonContext);
  const { state, theme, dispatch } = switchContext;

  /**
   * Component state and cookies
   */
  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const pollInputs = state.data.lesson.warmUp.inputs.pollInputs; // This is correct
  const [input, setInput] = useState({ pollInputs: [] });

  /**
   * Lifecycle
   */
  useEffect(() => {
    /**
     *
     * CHECK IF NOT TEACHER and
     * ONLY DO THIS FOR STUDENT
     *
     */
    if (!isTeacher) {
      // if (cookies[`lesson-${state.syllabusLessonID}`]) {
      //   setInput(() => {
      //     return cookies[`lesson-${state.syllabusLessonID}`].poll;
      //   });
      // } else {
      //   console.log('setInput -- ', state.componentState?.poll)
      //   setInput(state.componentState?.poll);
      // }
      let inputsArray = pollInputs.map((item: { id: string; question: string; option: any }) => {
        return {
          id: item.id,
          question: item.question,
          option: [{ id: item.option.id, isChoice: item.option.isChoice }],
        };
      });

      let initialObject = {
        pollInputs: inputsArray,
      };

      setInput(initialObject);
    }

    if (isTeacher) {
      if (dataProps) {
        setInput({ pollInputs: dataProps.poll });
      } else {
        setInput({ pollInputs: pollInputs });
      }
    }
  }, []);

  useEffect(() => {
    /**
     *
     * CHECK IF NOT TEACHER and
     * ONLY DO THIS FOR STUDENT
     *
     */
    if (!isTeacher) {
      if (state.componentState?.poll && input && input.pollInputs.length > 0) {
        dispatch({
          type: 'UPDATE_COMPONENT_STATE',
          payload: {
            componentName: 'poll',
            inputName: 'pollInputs',
            content: input.pollInputs,
          },
        });

        setCookie(`lesson-${state.syllabusLessonID}`, {
          ...cookies[`lesson-${state.syllabusLessonID}`],
          poll: { ...cookies[`lesson-${state.syllabusLessonID}`].poll },
        });
      }
    }
  }, [input]);

  /**
   * USE EFFECT -> setting form inputs in case of teacher view
   * receiving DATAPROPS
   */

  useEffect(() => {
    if (isTeacher && dataProps) {
      // console.log('Poll form -> ', 'setting poll form for teacher view...')
      if (dataProps.poll) {
        // console.log('Poll form -> ', dataProps)
        setInput({ pollInputs: dataProps.poll });
      }
    }
  }, [dataProps]);

  /**
   * Function handles selecting the poll options
   * @param pollItemID
   * @param pollOptionID
   */
  const handleRadioSelect = (pollItemID: string, pollOptionID: string) => {
    setInput(() => {
      const updatedInputs = input
        ? input.pollInputs.map((item: { id: string; question: string; answer: any }, key: any) => {
            if (item.id === pollItemID) {
              return {
                ...item,
                option: [{ id: pollOptionID }],
              };
            } else {
              return { ...item };
            }
          })
        : null;

      return { pollInputs: updatedInputs };
    });
  };

  /**
   * Function handles checking if the radio buttons for
   * the poll are currently selected
   * @param pollItemID
   * @param pollOptionID
   */
  const isSelected = (pollItemID: string, pollOptionID: string, pollKey: number) => {
    const inputsAvailable = input.pollInputs.filter((item: any) => item.hasOwnProperty('id'));

    if (input && inputsAvailable.length > 0) {
      const inputObject = JSON.parse(JSON.stringify(input.pollInputs[pollKey])); // Simple deep cloning, could not get the right nested values otherwise
      const id = inputObject['option'].length > 0 ? inputObject['option'][0].id : null;

      if (id === pollOptionID) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="w-full h-full rounded-xl">
        <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>Poll</h3>
          <div className="relative h-full flex flex-col items-center mb-5 mt-2">
            {input.pollInputs.length > 0
              ? pollInputs.map((item: { id: string; question: string; option: any }, pollKey: number) => {
                  return (
                    <div key={pollKey} className="flex flex-col items-center justify-between">
                      <div
                        id={item ? item.id : null}
                        className="flex flex-col items-center justify-start py-4 font-light text-gray-400">
                        <label id={item ? item.id : null} className={theme.elem.text}>
                          {item ? item.question : null}
                        </label>
                        <div className="flex flex-col">
                          {item
                            ? item.option.map(
                                (option: { id: string; option: string; isChoice: boolean }, optionKey: number) => {
                                  return (
                                    <label key={optionKey} id={option.id} className={theme.elem.text}>
                                      <button
                                        key={optionKey}
                                        id={option.id}
                                        name="choice"
                                        onClick={() => !isTeacher && handleRadioSelect(item.id, option.id)}
                                        className={`${theme.elem.text} w-auto px-4`}>
                                        {input && isSelected(item.id, option.id, pollKey) ? '❌' : '⚪️'}
                                      </button>
                                      {option.option}
                                    </label>
                                  );
                                }
                              )
                            : <h1>No poll inputs found.</h1>}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
      </div>
    </>
  );
};

export default PollForm;
