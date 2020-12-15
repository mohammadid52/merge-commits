import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

export interface TruthInput {
  id: string;
  label: string;
  isLie: boolean;
  text: string;
}

export type TruthInputState = Array<TruthInput>;

const TruthGameForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const gameInputs = state.data.lesson.warmUp.inputs.truthGameInputs;
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);

  const [truthGameInput, setTruthGameInput] = useState(
    state.componentState.truthGame && state.componentState.truthGame.truthGameArray
      ? state.componentState.truthGame.truthGameArray
      : []
  );

  useEffect(() => {
    if (cookies[`lesson-${state.classroomID}`]?.truthGame) {
      setTruthGameInput(() => {
        return cookies[`lesson-${state.classroomID}`].truthGame.truthGameArray;
      });
    }
  }, []);

  useEffect(() => {
    if (gameInputs && state.componentState.truthGame) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'truthGame',
          inputName: 'truthGameArray',
          content: truthGameInput,
        },
      });

      setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`] });
    }

    // console.log('TruthGameForm: ', 'new truth game dispatch...');
  }, [truthGameInput]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    let value = e.target.value;
    let targetId = e.target.id;

    setTruthGameInput(() => {
      return truthGameInput.map((item: any) => {
        if (targetId === item.id) {
          return {
            ...item,
            text: value,
          };
        } else {
          return {
            ...item,
          };
        }
      });
    });
  };

  const handleRadioSelect = (passedKey: any) => {
    setTruthGameInput(
      truthGameInput.map((item: { id: string; label: string; text: string }, key: any) => {
        if (key === passedKey) {
          return {
            ...item,
            isLie: true,
          };
        } else {
          return {
            ...item,
            isLie: false,
          };
        }
      })
    );
  };

  return (
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>Two Truths and a Lie</h3>

      <div className="relative h-full flex flex-col items-center mb-5 mt-2">
        <div className="text-gray-200">{state ? state.data.lesson.warmUp.inputs.textExample : null}</div>
        {truthGameInput
          ? truthGameInput.map((item: { id: string; label: string; text: string; isLie: boolean }, key: number) => {
              return (
                <div id={item.id} key={key} className="flex flex-col px-4 items-center justify-between">
                  <div id={item.id} className="flex items-center justify-start py-4">
                    <label
                      id={item.id}
                      className="h-8 w-full cursor-pointer font-light text-gray-400 text-sm flex flex-row-reverse justify-between items-center px-2">
                      <button
                        key={key}
                        id={item.id}
                        name="lie"
                        onClick={() => handleRadioSelect(key)}
                        className={`${item.isLie ? 'text-2xl' : ''} w-auto mx-4`}>
                        {' '}
                        {item.isLie ? '🤥' : '⚪️'}
                      </button>
                      {item.label}
                    </label>
                  </div>
                  <input
                    id={item.id}
                    className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
                    name="list"
                    type="text"
                    // placeholder={`${state.data.lesson.warmUp.inputs.textExample}`}
                    defaultValue={item.text}
                    onChange={handleInputChange}
                  />
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default TruthGameForm;
