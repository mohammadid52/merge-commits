import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';


const TChartForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  // const [cookies, setCookie] = useCookies(['story']);
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

  // useEffect(() => {
  //   if (cookies.story) {
  //     setInput(() => {
  //       return {
  //         title: cookies.story.title,
  //         story: cookies.story.story,
  //       };
  //     });
  //   }
  // }, []);

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
      [e.target.id]: e.target.value,
    });
  };

  
  const bullet = "\u2022";

  const handleInput = (e: any) => {
    let previousLength = 0;
    e.preventDefault();
    const newLength = e.target.value.length;
    const characterCode = e.target.value.substr(-1).charCodeAt(0);
    // console.log(characterCode, '?');
  // console.log(e.currentTarget, 'value')
  // console.log(newLength, 'newlength')
  // console.log(previousLength, 'prev length')
    if (newLength > previousLength) {
      if (characterCode === 10) {
        e.target.value = `${e.target.value}${bullet} `;
      } 
      else if (newLength === 1) {
        e.target.value = `${bullet} ${e.target.value}`;
      }
    }
    // else if (newLength - 1 ) {
    //   if(characterCode !== 8226) {
    //     console.log(e.target.value, 'hello')
    //   }
     
    previousLength = newLength;
    // console.log(previousLength, 'prev')
  }


  // const bullet = "\u2022";
  const enter = 13;
  const bulletWithSpace = `${bullet} `;


const handleInputTest = (e: KeyboardEvent<HTMLTextAreaElement>, event: ChangeEvent<HTMLTextAreaElement>) => {
  e.preventDefault();
  const { keyCode, target } = e;
  const { selectionStart, value } = event.target;
  
  if (keyCode === enter) {
    console.log('a');
    event.target.value = [value]
      .map((c, i) => i === selectionStart - 1
        ? `\n${bulletWithSpace}`
        : c
      )
      .join('');
      console.log(event.target.value);
      
    event.target.selectionStart = selectionStart+bulletWithSpace.length;
    event.target.selectionEnd = selectionStart+bulletWithSpace.length;
  }
  
  if (value[0] !== bullet) {
    event.target.value = `${bulletWithSpace}${value}`;
  }
}


  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        Compare and Contrast{' '}
      </h3>
      <div className="flex h-9/10 w-full justify-between">
        <div className='relative text-gray-800 h-full w-4.8/10 flex flex-col items-center mb-5 mt-2'>
          <label className="h-1/10 flex justify-center items-center text-lg text-center font-open font-light text-gray-100">Things I would change about myself</label>
          <textarea
            id='story'
            className='w-full h-9/10 px-4 py-2 rounded-lg text-xl text-gray-800 '
            name='list'
            placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
            defaultValue={`${input.story}`}
            onChange={handleInputChange}
            onInput={handleInput}
          />
        </div>
        <div className='relative text-gray-800 h-full w-4.8/10 flex flex-col items-center mb-5 mt-2'>
          <label className="h-1/10 flex justify-center items-center text-lg font-open font-light text-center text-gray-100">Things I love about myself</label>
          <textarea
            id='story'
            className='w-full h-9/10 px-4 py-2 rounded-lg text-xl text-gray-800 '
            name='list'
            placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
            defaultValue={`${input.story}`}
            onChange={handleInputChange}
            onInput={handleInput}
          />
      </div>
      </div>
    </div>
  );
};

export default TChartForm;
