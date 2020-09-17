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
    // <div className={`flex flex-col md:w-full md:h-full ${theme.block.bg} justify-center ${theme.block.text} text-base rounded-sm `}>
    <div className={`flex flex-col md:w-full md:h-full ${theme.block.bg} justify-center ${theme.block.text} text-base rounded-r-lg `}>
      <div className={`md:w-full md:h-full p-4 flex flex-col ${theme.block.text} text-lx rounded-r-lg`}>
        {/* <h1 className="text-2xl font-extrabold mb-4 underline">Biography of the artist:</h1> */}
        <h1 className={`text-2xl font-medium ${theme.underline}`}>Biography of the artist:</h1>
        <div className='overflow-contain overflow-y-auto font-light'>
          {typeof artistBio !== 'undefined'
            ? artistBio.map((paragraph: string, i: number) => (
                <p key={`paraBio${i}`} className='mb-2 text-blue-100 text-opacity-75'>
                  {paragraph}
                </p>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
};

export default BioBlock;
