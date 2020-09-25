import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Keyword = (props: props) => {
    const {  fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
    const keywords = state.data.lesson.keywords.items
    // const artistBio = state.data.artist.bio

    // const firstLetterFunction = (str: string) => {
    //     let arr = str.split('');
    //     arr.map((char, key) => {
    //         if (key === 0) {
    //             return <span>{char}</span>
    //         }
    //     })
    // }


    return (

        <div className={`flex flex-col md:w-full md:h-full ${theme.block.text} text-lx rounded-r-lg`}>
        <div className={`md:w-full md:h-full p-4 flex flex-col ${theme.block.text} text-lx rounded-r-lg`}>
          <h1 className={`${fullscreen ? 'text-2xl' : 'text-base'} font-medium ${theme.underline}`}>Keywords we will cover in this lesson:</h1>
          <div className={`${fullscreen ? 'text-base h-9/10' : 'text-xs h-full'} overflow-y-auto overflow-x-hidden`}> 
            { typeof keywords !== 'undefined' ?
              keywords.map((item: {word: {word: string, definition: string}, wordID: number}, i: number) => {
               return( <div key={i}>
                  {console.log(item.word.word, 'item')}
                  <p className={`${fullscreen ? 'text-base mb-3' : 'text-xs mb-1'} text-blue-100 text-opacity-75`}>
                    <span className={`${fullscreen ? 'text-lg' : 'text-sm'} font-semibold`}>{item.word.word}:</span> <span className='font-light'>{item.word.definition}</span>
                  </p>
                </div>
               )
              }) 
            : ''}
          </div>
        </div>
      </div>


        // <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text rounded-sm shadow-inner`}>
        //     <h1 className={`${fullscreen ? 'text-2xl font-extrabold mb-4 underline' : 'text-base font-extrabold mb-3'}`}>Keywords:</h1>
        //     <div>
        //     <p className={`${fullscreen ? 'text-base' : 'text-xs'} `}><span className={`${fullscreen ? 'text-lg' : 'text-sm'} font-bold`}>Culture:</span> the customs, arts, social institutions, and achievements of a particular nation, people, or other social group.</p>
        //     <p className={`${fullscreen ? 'text-base' : 'text-xs'} `}><span className={`${fullscreen ? 'text-lg' : 'text-sm'} font-bold`}>Dialects:</span> a particular form of a language which is peculiar to a specific region or social group.</p>
        //     <p className={`${fullscreen ? 'text-base' : 'text-xs'} `}><span className={`${fullscreen ? 'text-lg' : 'text-sm'} font-bold`}>Ancestors:</span> a person, typically one more remote than a grandparent, from whom one is descended.</p>
        //     </div>
        // </div>
    )
}

export default Keyword;