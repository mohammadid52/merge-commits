import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

const StoryForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [input, setInput] = useState({
    title:
      state.componentState.story && state.componentState.story.title
        ? state.componentState.story.title
        : '',
    story:
      state.componentState.story && state.componentState.story.story
        ? state.componentState.story.story
        : '',
  });

  useEffect(() => {
    if ( cookies[`lesson-${state.classroomID}`]?.story ) {
      setInput(() => {
        return {
          title: cookies[`lesson-${state.classroomID}`].story.title,
          story: cookies[`lesson-${state.classroomID}`].story.story,
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

      setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], story: { ...cookies[`lesson-${state.classroomID}`].story, title: input.title }});
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

      setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], story: { ...cookies[`lesson-${state.classroomID}`].story, story: input.story }});
    }
  }, [input.story]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        Story{' '}
      </h3>
      <div className='relative h-full flex flex-col mb-5 mt-2'>
        <label
          className='w-auto text-lg font-light text-base text-blue-100 text-opacity-70 mb-2'
          htmlFor='title'>
          Title 
        </label>
        
        <input
          id='title'
          className='md:w-88 px-4 py-1 mb-4 rounded-lg text-lg text-gray-700 bg-gray-300'
          name='title'
          type='text'
          placeholder={state.data.lesson.warmUp.inputs.titleExample}
          value={input.title}
          onChange={handleInputChange}
        />
        <div className='py-2 border-t border-white border-opacity-10'></div>
        <textarea
          id='story'
          className='w-full h-9/10 px-4 py-2 rounded-lg text-xl text-gray-700 bg-gray-300'
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
