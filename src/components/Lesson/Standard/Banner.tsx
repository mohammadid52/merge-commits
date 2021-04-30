import React from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaScroll} from 'react-icons/fa';

interface BannerProps {
  title: string;
}

const Banner = (props: BannerProps) => {
  const {title} = props;

  return (
    <div className="banner w-full flex flex-row justify-center items-center">
      <IconContext.Provider value={{color: '#EDF2F7', size: '3rem'}}>
        <div className="red bg-dark-red h-20 w-20 mx- flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
          <FaScroll />
        </div>
      </IconContext.Provider>
      <div className="title bg-dark-blue w-full flex flex-row justify-between items-center text-xl md:text-4xl text-center  font-bold text-gray-200 px-4 py-2 z-10">
        {title}
      </div>
    </div>
  );
};

export default Banner;
