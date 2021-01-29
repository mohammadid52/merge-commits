import React, { useContext } from 'react';
import { getAsset } from '../../../assets';
import { GlobalContext } from '../../../contexts/GlobalContext';
const LessonLoading = () => {
  const { clientKey } = useContext(GlobalContext);
  return (
    <div className='min-h-screen h-screen w-full bg-dark-gray text-gray-200 font-open font-light flex flex-col justify-center items-center'>
        <div className='relative w-full mb-4 pb-4 flex flex-col justify-center items-center rounded-lg animate-fadeIn'>
          <div
            className={`w-64 h-48 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-gray-300 rounded-t-lg`}>
            <img
              src={getAsset(clientKey, 'loading_logo')}
              alt='Logo'
            />
          </div>
          <div
            className={`w-64 h-16 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light shadow-xl bg-black rounded-b-lg`}>
            <p>Give us one second, your lesson is loading... </p>
          </div>
        </div>
    </div>
  );
};

export default LessonLoading;
