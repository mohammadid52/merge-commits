import React, { useEffect, useRef, useContext, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaEraser, FaHighlighter } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';
interface ToolbarProps {
  setColor: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  colorPicker: (color: string) => string;
}
const ToolBar = (props: ToolbarProps) => {
  const { setColor, color, colorPicker } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const [search, setSearch] = useState('');

  /**
   * Specific code for making toolbar sticky
   */
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  const buttons = state.data.lesson.coreLesson.tools;

  const handleClick = (e: any) => {
    setColor(e.target.id);
    console.log(e.target.id, 'e');
  };

  // const handleScroll = () => {
  //   if (ref.current) {
  //     setSticky(ref.current.getBoundingClientRect().top <= 0);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', () => handleScroll);
  //   };
  // }, []);

  return (
    <div className='h-auto z-50'>
      {/* <div className={`w-full rounded-xl`}>
        <h3 className={`w-auto text-xl ${theme.banner} ${theme.underline} flex flex-row`}>
          Highlighters
           <ToolTip
            width='w-40'
            position='bottom'
            header='Highlighters'
            content='You really gotta click & drag those highlighters across the words!'
          />
        </h3>
      </div> */}

      <div
        ref={ref}
        className={`flex flex-row w-auto text-xl ${theme.banner} ${theme.underline} flex flex-row`}
        style={{ marginTop: '0', paddingBottom: '0' }}>
        <div className='w-3.3/10  flex flex-col justify-center items-center'>
          <span>Highlighters:</span>
        </div>
        <div className={`w-3.3/10  flex  justify-center items-center z-50`}>
          <div
            className={`${
              isSticky
                ? 'fixed top-0 w-full flex flex-row justify-center items-center bg-dark-gray translate-y-full z-50'
                : ''
            } w-auto cursor-pointer flex flex-row`}>



            {/**
             * 
             * 
             * HIGHLIGHTER BUTTONSZ
             * 
             *  
             **/}
            {buttons.map((button: { color: string; icon: string; name: string }, key: number) => (
              <div
                key={key}
                id={button.color}
                className={`${color === button.color ? 'border-2 border-white' : ''} 
                  bg-${button.color} 
                  relative h-12 w-12 text-3xl rounded-lg mx-4 flex flex-row justify-center items-center
                  `}
                onClick={handleClick}>
                <ToolTip
                  position='bottom'
                  id={button.color}
                  cursor
                  header=''
                  width='w-24 px-1 flex justify-center items-center'
                  content={
                    <div className='flex text-center justify-center w-24'>{button.name}</div>
                  }
                  display='none'
                  fontSize='text-xs'
                />
                {button.icon}
              </div>
            ))}





            <div
              id='erase'
              className={`relative bg-gray-200 h-12 w-12 text-3xl rounded-lg mb-2 mx-4 flex flex-row justify-center items-center`}
              onClick={handleClick}>
              <ToolTip
                position='bottom'
                id={'erase'}
                cursor
                header=''
                width='w-24 px-1 flex justify-center items-center'
                content={<div className='flex text-center justify-center w-24'>{'erase'}</div>}
                display='none'
                fontSize='text-xs'
              />
              <IconContext.Provider value={{ color: 'darkgray', size: '2rem' }}>
                <FaEraser style={{ pointerEvents: 'none' }} />
              </IconContext.Provider>
            </div>
          </div>
        </div>
        <div className='w-3.3/10  w-16 flex items-center'>
          <IconContext.Provider
            value={{
              className: 'ml-auto mr-0',
              color: `${props.colorPicker(color) === '' ? 'white' : props.colorPicker(color)}`,
              size: '2rem',
              style: { width: 'auto' },
            }}>
            <FaHighlighter />
          </IconContext.Provider>
        </div>
      </div>

      <div className='w-full leading-6 border-b border-white border-opacity-10 mb-4'>
        <p className='pl-2 text-sm text-left  text-white '>
          1. To select a <b>sentence/phrase</b>, click the 'first word' and the 'last word'.
        </p>
        <p className='pl-2 text-sm text-left  text-white '>
          2. To select <b>one</b> word, double click the word.
        </p>
      </div>

    </div>
  );
};
export default ToolBar;
