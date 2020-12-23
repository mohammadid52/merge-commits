import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
  fullscreen: boolean
}

const Keyword = (props: props) => {
  const { fullscreen } = props;
  const { state, theme } = useContext(LessonControlContext);
  const keywords = state.data.lesson.keywords.items

  return (
    <div className={`flex flex-col md:w-full ${theme.block.text} rounded-r-lg`}>
      <div className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
        <h3>Keywords we will cover in this lesson:</h3>
        <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
          <div className='absolute w-auto h-auto mr-2 right-0'>
            <AiOutlineInfoCircle
              style={{
                MozUserSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
              }}
            />
          </div>
        </IconContext.Provider>
      </div>

      <div className='flex flex-row'>
        {typeof keywords !== 'undefined'
          ? keywords.map(
            (item: { word: { word: string; definition: string }; wordID: number }, i: number) => {
              return (
                <div
                  key={i}
                  id={`kw${i}`}
                  className={`relative h-32 min-h-32 mb-4 p-2 w-3.3/10 z-10 hover:z-50 rounded-lg`}
                >

                  <div className={`relative h-32 min-h-32 hover:z-50 bg-light-gray rounded-lg`}>
                    <div className='relative min-h-32 h-32 h-full w-full rounded-lg hover:shadow-lg'>

                      <div className='h-32 hover:h-auto p-2 hover:absolute overflow-hidden bg-light-gray rounded-lg border-8 border-light-gray'>
                        <p className={`${theme.elem.title}`}>{item.word.word}:</p>
                        <p className={theme.elem.text}>{item.word.definition}</p>
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
}

export default Keyword;