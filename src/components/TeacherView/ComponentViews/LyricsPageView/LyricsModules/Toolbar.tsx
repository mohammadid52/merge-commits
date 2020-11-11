import React, { useRef, useContext, useState } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaEraser } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

import ToolTip from '../../../../General/ToolTip/ToolTip';

interface ToolbarProps {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>,
  fullscreen: boolean
}

const ToolBar = (props: ToolbarProps) => {
  const { color, setColor, fullscreen } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const [search, setSearch] = useState('');

  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  const buttons = state.data.lesson.coreLesson.tools;
  const handleClick = (e: any) => {
    setColor(e.target.id);
  }

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(e.target.value)
  }

  const handleDrop = (e: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => string; }; }) => {
    e.preventDefault();

    const wordId = e.dataTransfer.getData('wordId');
    const word = document.getElementById(wordId).innerText;

    if (state.word_bank.indexOf(word) < 0) {
      dispatch({ type: 'ADD_WORD', payload: word })
    }
  }

  const handleDragOver = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  }


  return (
    <div className='h-24 z-50'>
      <div className={`w-full rounded-xl`}>
        <h3 className={`w-auto text-xl ${theme.banner} ${theme.underline} flex flex-row`}>
          Highlighters{' '}
          <ToolTip
            width='w-40'
            position='bottom'
            header='Highlighters'
            content='You really gotta click & drag those highlighters across the words!'
          />
        </h3>
      </div>

      <div ref={ref}>
        <div className={`h-16 flex  justify-center items-center pt-2 z-50`}>

          <div
            className={`${isSticky
              ? 'fixed top-0 w-full flex flex-row justify-center items-center bg-dark-gray translate-y-full z-50'
              : ''
              } w-auto cursor-pointer flex flex-row`}>

            {buttons.map((button: { color: string; icon: string; name: string }, key: number) => (

              <div
                key={key}
                id={button.color}
                className={
                  `${color === button.color ? 'border-2 border-white' : ''} 
                  bg-${button.color} 
                  relative h-12 w-12 text-3xl rounded-lg mb-2 mx-4 flex flex-row justify-center items-center animate-fadeIn
                  `}
                onClick={handleClick}>
                <ToolTip
                  position='hidden-bottom'
                  id={button.color}
                  cursor
                  header=''
                  width='w-24 px-1 flex justify-center items-center'
                  content={
                    <div className='font-bold flex text-center justify-center w-24'>
                      {button.name}
                    </div>
                  }
                  display='none'
                  fontSize='text-xs'
                />
                {button.icon}
              </div>
            ))}


            <div
              id='erase'
              className={`${fullscreen ? 'h-12 w-12 text-3xl' : 'h-8 w-8 text-md'} bg-gray-200 rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center`}
              onClick={handleClick}>
              <IconContext.Provider value={{ color: 'darkgray', size: fullscreen ? '2rem' : '1rem' }}>
                <FaEraser />
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToolBar;