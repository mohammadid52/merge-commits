import React, { useContext } from 'react';
// import { IconContext } from "react-icons";
// import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const BioBlock = () => {
  const { state, theme } = useContext(LessonContext);
  const artistBio = state.data.lesson.artist.bio;

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
      className={`md:w-full md:h-full ${theme.block.bg} flex flex-col justify-center ${theme.block.text} text-base rounded-sm `}>
      <div
        className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text-lx rounded-sm`}>
        {/* <h1 className="text-2xl font-extrabold mb-4 underline">Biography of the artist:</h1> */}
        <h1 className='text-2xl font-medium border-b border-white border-opacity-50  mb-4 pb-4'>
          Biography of the artist:
        </h1>
        <div className='overflow-scroll font-light'>
          {typeof artistBio !== 'undefined'
            ? artistBio.map((paragraph: string, i: number) => (
                <p key={`paraBio${i}`} className='mb-2 text-blue-100 text-opacity-75'>{paragraph}</p>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};

export default BioBlock;
