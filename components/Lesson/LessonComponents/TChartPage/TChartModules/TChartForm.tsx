import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const TChartForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  // const [cookies, setCookie] = useCookies(['tchart']);
  const [input, setInput] = useState({
    list: state.componentState.list && state.componentState.tchart.list ? state.componentState.tchart.list : '',
    list2: state.componentState.list2 && state.componentState.tchart.list2 ? state.componentState.tchart.list2 : '',
  });

  useEffect(() => {
    if (state.componentState.tchart) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'tchart',
          inputName: 'list',
          content: input.list,
        },
      });
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'tchart',
          inputName: 'list2',
          content: input.list2,
        },
      });

      // setCookie('tchart', { ...cookies.tchart, tchart: input.tchart });
    }
  }, [input]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const bullet = '\u2022';

  const handleInput = (e: any) => {
    let previousLength = 0;
    e.preventDefault();
    const newLength = e.target.value.length;
    const characterCode = e.target.value.substr(-1).charCodeAt(0);

    if (newLength > previousLength) {
      if (characterCode === 10) {
        e.target.value = `${e.target.value}${bullet} `;
      } else if (newLength === 1) {
        e.target.value = `${bullet} ${e.target.value}`;
      }
    }

    previousLength = newLength;
  };

  return (
    <div className="bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600">
      <h3 className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>Compare and Contrast </h3>
      <div className="flex h-9/10 w-full justify-between">
        {/* LEFT TEXT AREA */}
        <div className="relative text-gray-800 h-full w-4.8/10 flex flex-col items-center mb-5 mt-2">
          <label className="h-1/10 flex justify-center items-center text-lg text-center font-open font-light text-gray-100">
            Things I would change about myself
          </label>
          <textarea
            id="list"
            className="w-full h-9/10 px-4 py-2 rounded-lg text-xl text-gray-800 "
            name="list"
            placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
            defaultValue={`${input.list}`}
            onChange={handleInputChange}
            onInput={handleInput}
          />
        </div>

        {/* RIGHT TEXT AREA */}
        <div className="relative text-gray-800 h-full w-4.8/10 flex flex-col items-center mb-5 mt-2">
          <label className="h-1/10 flex justify-center items-center text-lg font-open font-light text-center text-gray-100">
            Things I love about myself
          </label>
          <textarea
            id="list2"
            className="w-full h-9/10 px-4 py-2 rounded-lg text-xl text-gray-800 "
            name="list2"
            placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
            defaultValue={`${input.list2}`}
            onChange={handleInputChange}
            onInput={handleInput}
          />
        </div>
      </div>
    </div>
  );
};

export default TChartForm;
