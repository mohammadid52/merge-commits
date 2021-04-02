import React, { useState, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface ToolBarProps {
  editMode: {
    open: boolean;
    input: string;
  };
  setEditMode: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      input: string;
    }>
  >;
}

const ToolBar = (props: ToolBarProps) => {
  const { editMode, setEditMode } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const prompts = state.data.lesson.activity.writingPrompts;
  // console.log(prompts, 'state');
  const [search, setSearch] = useState('');

  const handleDragOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  const handleDragStart = (e: {
    currentTarget: any;
    dataTransfer: { setData: (arg0: string, arg1: any) => void };
  }) => {
    const current = e.currentTarget;
    const text = current.querySelector('span').innerText;
    e.dataTransfer.setData('addWord', text);
  };

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearch(e.target.value);
  };

  if (editMode.open) {
    return (
      <div className='w-full h-full rounded-xl'>
        <h3 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
          Line Prompts{' '}
          <ToolTip
            width='w-40'
            position='bottom'
            header=''
            content='In case you want to look back at the line prompts'
          />
        </h3>

        <div className={theme.elem.text}>
          {prompts.map(
            (line: { example: string; id: number; name: string; prompt: string }, key: number) => {
              return (
                <div className='my-1'>
                  <div key={key}>
                    {line.prompt}
                  </div>
                  <label
                    className={`${
                      line.example ? 'visible' : 'invisible'
                    } font-light self-end flex justify-end text-gray-400 text-sm`}>
                    ( ex. {line.example} )
                  </label>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full md:h-7/10 bg-grayscale-light flex flex-col items-center text-grayscale-lighter px-4 py-4 rounded-xl'>
      <div className='w-full h-full flex flex-col justify-between'>
        {/* <h3 className='w-full text-xl text-grayscale-lighter font-open font-light border-b-0 border-grayscale-lighter pb-1 mb-1'>
          Toolbox
        </h3>
        <h3 className='text-lg font-light font-open'>My word bank:</h3>
        <div
          id='search'
          className='h-1/10 pl-2 rounded-lg text-grayscale text-sm bg-grayscale-lighter'>
          Search...
        </div> */}
        <div className={`${theme.elem.text} w-full h-40 md:h-6/10 text-2xl flex flex-col text-center justify-center font-light text-grayscale-lightest px-4 rounded-lg overflow-y-auto overflow-x-hidden`}>
          Toolbox coming soon...
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
