import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';

export interface PollInput {
  id: string;
  question: string;
  option: {
    id: string;
    option: string;
    isChoice: boolean;
  };
}

export type PollInputState = Array<PollInput>;

/**
 *
 * Still to do:
 *
 * 1. remove references to and initialization of 'pollOptions',
 * current data structure PollInput contains enough information
 * to store all the poll answers.
 *
 * 2. selecting the radio buttons should toggle the UPDATE_COMPONENT_STATE
 *
 * 3. The poll should show which radio buttons are selected and which aren't
 *
 */

const PollForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const pollInputs = state.data.lesson.warmUp.inputs.pollInputs; // This is correct
  const [input, setInput] = useState(
    state.componentState.poll && state.componentState.pollInputs ? state.componentState.poll : [{}]
  );

  useEffect(() => {
    if (cookies[`lesson-${state.classroomID}`]?.poll) {
      setInput(() => {
        return cookies[`lesson-${state.classroomID}`].poll;
      });
    }
  }, []);

  useEffect(() => {
    if (state.componentState.poll) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'poll',
          inputName: 'pollInputs',
          content: input,
        },
      });

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        poll: { ...cookies[`lesson-${state.classroomID}`].poll },
      });
    }
  }, [input]);

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
                option: { id: pollOptionID },
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
    const inputObject = JSON.parse(JSON.stringify(input.pollInputs[pollKey])); // Simple deep cloning, could not get the right nested values otherwise

    if (inputObject.option.hasOwnProperty('id')) {
      const id = inputObject['option'].id;

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
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>Poll</h3>
      <div className="relative h-full flex flex-col items-center mb-5 mt-2">
        {pollInputs
          ? pollInputs.map((item: { id: string; question: string; option: any }, pollKey: number) => {
              return (
                <div key={pollKey} className="flex flex-col items-center justify-between">
                  <div
                    id={item ? item.id : null}
                    className="flex flex-col items-center justify-start py-4 font-light text-gray-400">
                    <label
                      id={item ? item.id : null}
                      className={theme.elem.text}>
                      {item ? item.question : null}
                    </label>
                    <div className="flex flex-col">
                      {item
                        ? item.option.map(
                            (option: { id: string; option: string; isChoice: boolean }, optionKey: number) => {
                              return (
                                <label
                                  key={optionKey}
                                  id={option.id}
                                  className={theme.elem.text}>
                                  <button
                                    key={optionKey}
                                    id={option.id}
                                    name="choice"
                                    onClick={() => handleRadioSelect(item.id, option.id)}
                                    className={`${theme.elem.text} w-auto px-4`}>
                                    {/*{option.isChoice ? '❌' : '⚪️'}*/}
                                    {input.pollInputs && isSelected(item.id, option.id, pollKey) ? '❌' : '⚪️'}
                                  </button>
                                  {option.option}
                                </label>
                              );
                            }
                          )
                        : null}
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default PollForm;
