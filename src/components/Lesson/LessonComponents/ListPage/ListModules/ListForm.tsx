import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface KeyboardEvent {
  enterKey: boolean;
}

const ListForm = () => {
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

  let previousLength = 0;
  const bullet = "\u2022";

  const handleInput = (e: any) => {
    
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
  }


  // const bullet = "\u2022";
  const enter = 13;
  const bulletWithSpace = `${bullet} `;


// const handleInput = (event: React.KeyboardEvent) => {
//   const target = event.target;
//   const k = event.keyCode as unknown
//   // const { k, target } = e as unknown;
//   console.log(k, 'key')
//   console.log(target, 'target')
//   const { selectionStart, value } = target;
  
//   if (k === enter) {
//     console.log('a');
//     // target.value = [...value]
//     //   .map((c, i) => i === selectionStart - 1
//     //     ? `\n${bulletWithSpace}`
//     //     : c
//     //   )
//     //   .join('');
//     //   console.log(target.value);
      
//     // target.selectionStart = selectionStart+bulletWithSpace.length;
//     // target.selectionEnd = selectionStart+bulletWithSpace.length;
//   }
  
//   // if (value[0] !== bullet) {
//   //   target.value = `${bulletWithSpace}${value}`;
//   // }
// }

  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        List{' '}
      </h3>
      <div className='relative h-full flex flex-col items-center mb-5 mt-2'>
        <textarea
          id='story'
          className=' w-6/10 h-full px-4 py-2 rounded-lg text-xl text-gray-100'
          style={{backgroundColor: '#23314600'}}
          name='list'
          placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
          // defaultValue={bullet}
          defaultValue={`${input.story}`}
          onChange={handleInputChange}
          onInput={handleInput}
        />
      </div>
    </div>
  );
};

export default ListForm;
