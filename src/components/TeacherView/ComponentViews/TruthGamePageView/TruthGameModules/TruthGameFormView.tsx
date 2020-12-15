import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

export interface TruthInput {
  id: string;
  label: string;
  isLie: boolean;
  text: string;
}

interface props {
  fullscreen: boolean;
  dataProps?: {
    truthGameArray: Array<TruthInput>;
    [key: string]: any;
  };
}

const TruthGameForm = (props: props) => {
  const { fullscreen, dataProps } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const gameInputs = state.data.lesson.warmUp.inputs.truthGameInputs;
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [input, setInput] = useState({
    truthGameArray: [],
  });

  useEffect(() => {
    setInput({
      truthGameArray: dataProps && dataProps.truthGameArray ? dataProps.truthGameArray : [],
    });
  }, [dataProps]);

  return (
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>Two Truths and a Lie</h3>

      <div className="relative h-full flex flex-col items-center mb-5 mt-2">
        <div className="text-gray-200">{state ? state.data.lesson.warmUp.inputs.textExample : null}</div>
        {gameInputs.map((item: { id: string; label: string; text: string; isLie: boolean }, key: number) => {
          return (
            <div id={item.id} key={key} className="flex flex-col px-4 items-center justify-between">
              <div id={item.id} className="flex items-center justify-start py-4">
                <label
                  id={item.id}
                  className="h-8 w-full cursor-pointer font-light text-gray-400 text-sm flex flex-row-reverse justify-between items-center px-2">
                  <button key={key} id={item.id} name="lie" className={`${item.isLie ? 'text-2xl' : ''} w-auto mx-4`}>
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TruthGameForm;
