import React from 'react';
import { IconContext } from 'react-icons';
import { FaGraduationCap } from 'react-icons/fa';

interface InfoSide {
  children?: React.ReactNode;
  subtitle?: string;
}

const InfoSide: React.FC<InfoSide> = (iSidePrps: InfoSide) => {
  return (
    <>
      <div className='w-auto p-4 flex flex-col text-center items-center'>
        <div
          className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}
        >
          <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
            <FaGraduationCap />
          </IconContext.Provider>
        </div>
        <div
          className={`text-lg md:text-3xl font-bold font-open text-gray-900 mt-4`}
        >
          <p className='text-md md:text-lg'>
            {`${iSidePrps.subtitle ? iSidePrps.subtitle : ''}`}
          </p>
        </div>
      </div>
    </>
  );
};

export default InfoSide;
