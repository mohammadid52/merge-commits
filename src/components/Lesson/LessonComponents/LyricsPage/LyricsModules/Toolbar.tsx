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
        <h3 className='absolute text-xl text-gray-200 font-open font-light pb-1' style={{left: '0'}}>
          Highlighters <ToolTip position='bottom' header='Highlighters' content='You really gotta click & drag those highlighters across the words!'/>
        </h3>
        <p className='text-gray-600 text-sm text-center'>
          (click a color and drag over words!) 
        </p>
      </div>
      <div className='w-auto cursor-pointer flex flex-row justify-center items-center pt-2'>
        {buttons.map((button: { color: string; icon: string }, key: number) => (
          <div
            key={key}
            id={button.color}
            className={`bg-${button.color} h-12 w-12 text-3xl rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center animate-fadeIn`}
            onClick={handleClick}>
            {button.icon}
          </div>
        ))}
        <div
          id=''
          className={`bg-gray-200 h-12 w-12 text-3xl rounded-lg mb-2 mx-4 shadow-elem-dark flex flex-row justify-center items-center`}
          onClick={handleClick}>
          <IconContext.Provider value={{ color: 'darkgray', size: '2rem' }}>
            <FaEraser />
          </IconContext.Provider>
        </div>
      </div>

    </div>
  );
};

export default ToolBar;
