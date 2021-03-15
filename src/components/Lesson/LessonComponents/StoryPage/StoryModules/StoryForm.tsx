import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const StoryForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const labelForm = state.data.lesson?.warmUp?.label;
  const showTitle = state.data.lesson?.warmUp?.inputs?.title;

  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const [input, setInput] = useState({
    title: state.componentState.story && state.componentState.story.title ? state.componentState.story.title : '',
    story: state.componentState.story && state.componentState.story.story ? state.componentState.story.story : [''],
  });

  useEffect(() => {
    if (cookies[`lesson-${state.syllabusLessonID}`]?.story) {
      setInput(() => {
        return {
          title: cookies[`lesson-${state.syllabusLessonID}`].story.title,
          story: cookies[`lesson-${state.syllabusLessonID}`].story.story,
        };
      });
    }
  }, []);

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

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        story: { ...cookies[`lesson-${state.syllabusLessonID}`].story, title: input.title },
      });
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

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        story: { ...cookies[`lesson-${state.syllabusLessonID}`].story, story: input.story },
      });
    }
  }, [input.story]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    if (e.target.id === 'title') {
      setInput({
        ...input,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === 'story') {
      setInput({
        ...input,
        [e.target.id]: [e.target.value],
      });
    }
  };

  return (
    <div className='w-full h-full rounded-xl'>
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>{labelForm}</h3>
      <div className='relative h-full flex flex-col mb-5 mt-2'>

        {
          showTitle && (
            <label className={`${theme.elem.text} my-2`} htmlFor='title'>
              Title
            </label>
          )
        }

        <input
          id='title'
          className={`w-full py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name='title'
          type='text'
          placeholder={state.data.lesson.warmUp.inputs.titleExample}
          value={input.title}
          onChange={handleInputChange}
        />
        <div className='py-2'></div>
        <textarea
          id='story'
          className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name='story'
          placeholder={state.data.lesson.warmUp.inputs.textExample}
          value={input.story}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default StoryForm;
