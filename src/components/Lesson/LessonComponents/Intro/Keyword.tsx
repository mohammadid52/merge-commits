import React, { useContext } from 'react';
// import { IconContext } from "react-icons";
// import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Keyword = () => {
  const { state, theme } = useContext(LessonContext);
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
    <div
      className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text-lx rounded-sm`}>
      {/* <h1 className="text-2xl font-extrabold mb-4 underline">Keywords we will cover in this lesson:</h1> */}
      <h1 className={`text-2xl font-medium ${theme.underline}`}>
        Keywords we will cover in this lesson:
      </h1>
      <div className='overflow-scroll'>
        <p className='text-base mb-4 text-blue-100 text-opacity-75'>
          <span className='text-lg font-semibold'>Culture:</span>{' '}
          <span className='font-light'>
            the customs, arts, social institutions, and achievements of a
            particular nation, people, or other social group.
          </span>
        </p>
        <p className='text-base mb-4 text-blue-100 text-opacity-75'>
          <span className='text-lg font-semibold'>Dialects:</span>
          <span className='font-light'>
            {' '}
            a particular form of a language which is peculiar to a specific
            region or social group.
          </span>
        </p>
        <p className='text-base mb-4 text-blue-100 text-opacity-75'>
          <span className='text-lg font-semibold'>Ancestors:</span>{' '}
          <span className='font-light'>
            a person, typically one more remote than a grandparent, from whom
            one is descended.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Keyword;
