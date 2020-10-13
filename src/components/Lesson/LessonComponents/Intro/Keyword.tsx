import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const Keyword = () => {
  const { state, theme } = useContext(LessonContext);
  const keywords = state.data.lesson.keywords.items;

  return (
    <div className={`flex flex-col md:w-full ${theme.block.text} rounded-r-lg`}>
      <h1 className={`w-full h-1/10 ${theme.banner} ${theme.underline}`}>
        Keywords we will cover in this lesson:
      </h1>

      <div className='flex flex-row'>
        {typeof keywords !== 'undefined'
          ? keywords.map(
              (item: { word: { word: string; definition: string }; wordID: number }, i: number) => {
                return (
                  <div key={i} className={`relative mx-1 w-3.3/10 `}>
                    <div className='rounded-xl h-auto flex flex-col mb-2'>
                      <div className={`w-full`}>
                        <div className='h-6/10 justify-center items-center align-center'>
                          <p className={`${theme.elem.title}`}>{item.word.word}:</p>{' '}
                          <p className={`${theme.elem.text}`}>{item.word.definition}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )
          : ''}
      </div>
    </div>
  );
};

export default Keyword;
