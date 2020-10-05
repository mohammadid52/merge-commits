import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const Keyword = () => {
  const { state, theme } = useContext(LessonContext);
  const keywords = state.data.lesson.keywords.items


  return (
    <div className={`flex flex-col md:w-full md:h-full ${theme.block.text} text-lx rounded-r-lg`}>
      <div className={`md:w-full md:h-full p-4 flex flex-col ${theme.block.text} text-lx rounded-r-lg`}>
        <h1 className={`text-2xl font-medium ${theme.underline}`}>Keywords we will cover in this lesson:</h1>
        <div className='overflow-y-auto overflow-x-hidden'> 
          { typeof keywords !== 'undefined' ?
            keywords.map((item: {word: {word: string, definition: string}, wordID: number}, i: number) => {
             return( <div key={i}>
                <p className='text-base mb-3 text-blue-100 text-opacity-75'>
                  <span className='text-lg font-semibold'>{item.word.word}:</span> <span className='font-light'>{item.word.definition}</span>
                </p>
              </div>
             )
            }) 
          : ''}
        </div>
      </div>
    </div>
  );
};

export default Keyword;
