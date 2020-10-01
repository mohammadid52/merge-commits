import React, { useContext, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaEraser } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface ToolbarProps {
  setColor: React.Dispatch<React.SetStateAction<string>>;
}

const ToolBar = (props: ToolbarProps) => {
  const { setColor } = props;
  const { state, dispatch } = useContext(LessonContext);
  const [search, setSearch] = useState('');
  const buttons = state.data.lesson.coreLesson.tools;

  const handleClick = (e: any) => {
    setColor(e.target.id);
  };

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearch(e.target.value);
  };

  const handleDrop = (e: {
    preventDefault: () => void;
    dataTransfer: { getData: (arg0: string) => string };
  }) => {
    e.preventDefault();

    const wordId = e.dataTransfer.getData('wordId');
    const word = document.getElementById(wordId).innerText;

    if (state.word_bank.indexOf(word) < 0) {
      dispatch({ type: 'ADD_WORD', payload: word });
    }
  };

  const handleDragOver = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <div className='bg-medium-blue h-2.5/10 w-full p-4 rounded-lg flex flex-col items-center justify-around'>
      <div className='relative flex flex-row justify-center items-center border-b border-white border-opacity-10 pb-1 mb-1'>
        <h3 className='text-xl text-gray-200 font-open font-light flex'>
          Highlighters <ToolTip width='w-40' position='bottom' header='Highlighters' content='You really gotta click & drag those highlighters across the words!'/>
        </h3>
        {/* <p className='text-gray-600 text-sm text-center'>
          (click a color and drag over words!) 
        </p> */}
      </div>
      <div className='w-auto cursor-pointer flex flex-row justify-center items-center pt-2'>
        {buttons.map((button: { color: string; icon: string, name: string }, key: number) => (
          
          <div
            key={key}
            id={button.color}
            className={`relative bg-${button.color} h-12 w-12 text-3xl rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center animate-fadeIn`}
            onClick={handleClick }>
              
            <ToolTip position='hidden-bottom' 
            header=''
            id={button.color}
            children={handleClick}
            width='w-24 px-1 flex justify-center items-center'
            content= {<div className="font-bold flex text-center justify-center w-24">{button.name}</div>}
            display='none' fontSize= 'text-xs'/>
            {button.icon}
          </div>
        ))}
        <div
          id=''
          className={`relative bg-gray-200 h-12 w-12 text-3xl rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center`}
          onClick={handleClick}>
          <ToolTip position='hidden-bottom' header='eraser' display='none' fontSize= 'text-xs px-2' children={handleClick}/>
          <IconContext.Provider value={{ color: 'darkgray', size: '2rem' }}>
            <FaEraser />
          </IconContext.Provider>
        </div>
      </div>

    </div>
  );
};

export default ToolBar;
