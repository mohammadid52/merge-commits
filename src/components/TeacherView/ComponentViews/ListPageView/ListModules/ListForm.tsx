import React, { useState, useEffect, useContext } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
  fullscreen: boolean
  dataProps?: {
    title?: string,
    story?: string,
    [key: string]: any
  }
}

const ListForm = (props: props) => {
  const { theme, state } = useContext(LessonControlContext)
  const { fullscreen, dataProps } = props;
  const [input, setInput] = useState({
    title: '',
    story: ''
  })

  const bullet = "\u2022";

  const handleInput = (e: any) => {
    let previousLength = 0;
    e.preventDefault();
    const newLength = e.target.value.length;
    const characterCode = e.target.value.substr(-1).charCodeAt(0);
    if (newLength > previousLength) {
      if (characterCode === 10) {
        e.target.value = `${e.target.value}${bullet} `;
      }
      else if (newLength === 1) {
        e.target.value = `${bullet} ${e.target.value}`;
      }
    }
    previousLength = newLength;
  }

  useEffect(() => {

    setInput({
      title: dataProps && dataProps.title ? dataProps.title : '',
      story: dataProps && dataProps.story ? dataProps.story : '',
    })

  }, [dataProps])

  return (
    <div className='w-full h-full rounded-xl'>
      <h3
        className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>
        List{' '}
      </h3>
      <div className='relative h-full flex flex-col mb-5 mt-2'>
        <textarea
          id='story'
          className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
          name='list'
          placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
          defaultValue={`${input.story}`}
          // onChange={handleInputChange}
          onInput={handleInput}
        />
      </div>
    </div>

  )
}

export default ListForm;