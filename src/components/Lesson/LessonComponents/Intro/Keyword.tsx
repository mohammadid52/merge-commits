import React, { useEffect, useState, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const Keyword = () => {
  const { state, theme } = useContext(LessonContext);
  const keywords = state.data.lesson.keywords.items;

  const checkIfBottomRowN = (n: number, colNr: number) => {
    let lastRow = [...keywords];
    let removed = [];

    for (let i = 0; i < keywords.length; i++) {
      if (lastRow.length > colNr) {
        removed = lastRow.splice(0, colNr);
      }
    }

    // console.log('XXX: ', lastRow.filter((obj: any) => obj['wordID'] === n).length === 1)

    return lastRow.filter((obj: any) => obj['wordID'] === n).length === 1;
  }

  const checkSentenceLength = (str: string, max: number) => {
    const wordArray = str.split(' ');
    return wordArray.length > max;
  }

  return (
    <div className={`flex flex-col md:w-full ${theme.block.text} rounded-r-lg`}>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        <h3>Keywords we will cover in this lesson:</h3>
        {/* <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
          <div className='absolute w-auto h-auto mr-2 right-0'>
            <AiOutlineInfoCircle
              style={{
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            />
          </div>
        </IconContext.Provider> */}
      </div>

      <div className='flex flex-row flex-wrap z-50'>
        {typeof keywords !== 'undefined'
          ? keywords.map(
            (item: { word: { word: string; definition: string }; wordID: number }, i: number) => {
              return (
                <div
                  key={i}
                  id={`kw${i}`}
                  className={`relative  mb-4 p-2 w-3.3/10 z-10 hover:z-50 rounded-lg `}
                >

                  <div className={`relative  hover:z-50 bg-light-gray rounded-lg`}>
                    <div className='relative  h-32 h-full w-full rounded-lg bg-light-gray hover:shadow-xl '>

                      <div className={`h-32 hover:h-auto p-2 ${(checkIfBottomRowN(item.wordID, 3)) ? null : 'hover:absolute top-0'} overflow-hidden rounded-lg bg-light-gray border-light-gray`} style={{ minHeight: '8rem' }}>
                        <p className={`${theme.elem.title}`}>{item.word.word}:</p>
                        <p className={`${theme.elem.text}`}>{item.word.definition}</p>
                      </div>

                      {
                        checkSentenceLength(item.word.definition, 25) ?
                          <div className='absolute w-full bottom-0 p-2 flex text-center bg-gradient-to-t from-light-gray rounded-lg' style={{
                            MozUserSelect: 'none',
                            WebkitUserSelect: 'none',
                            msUserSelect: 'none',
                          }}>
                            <p className='font-bold font-xl text-white'>&#x25CF;&#x25CF;&#x25CF;</p>
                          </div>
                          : null
                      }


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
