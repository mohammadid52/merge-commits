import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const ListForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  // const [cookies, setCookie] = useCookies(['story']);
  const [input, setInput] = useState({
    title: state.componentState.story && state.componentState.story.title ? state.componentState.story.title : '',
    story: state.componentState.story && state.componentState.story.story ? state.componentState.story.story : [''],
  });

  useEffect(() => {
    if (state.componentState.story) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'story',
          inputName: 'title',
          content: input.title,
        },
      });

      // setCookie('story', { ...cookies.story, title: input.title });
    }
  }, [input.title]);

  useEffect(() => {
    if (state.componentState.story) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'story',
          inputName: 'story',
          content: input.story,
        },
      });

      // setCookie('story', { ...cookies.story, story: input.story });
    }
  }, [input.story]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: [e.target.value],
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
    // console.log(previousLength, 'prev')
  };

  return (
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>List </h3>
      <div className="relative h-full flex flex-col mb-5 mt-2">
        <textarea
          id="story"
          className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name="list"
          placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
          defaultValue={`${input.story}`}
          onChange={handleInputChange}
          onInput={handleInput}
        />
      </div>
    </div>
  );
};

export default ListForm;
