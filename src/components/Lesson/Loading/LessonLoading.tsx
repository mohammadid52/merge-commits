import React from 'react';

const LessonLoading = () => {
  return (
    <div className='min-h-screen w-full bg-dark text-gray-200 font-open font-light flex flex-col justify-center items-center'>
        <div className='relative w-full mb-4 pb-4 flex flex-col justify-center items-center rounded-lg animate-fadeIn'>
          <div
            className={`w-64 h-48 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-gray-300 rounded-t-lg`}>
            <img
              src='https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color_notext.svg'
              alt='Iconoclast Artists Logo'
            />
          </div>
          <div
            className={`w-64 h-16 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light shadow-xl bg-dark-blue rounded-b-lg`}>
            <p>Give us one second, your lesson is loading... </p>
          </div>
        </div>
    </div>
  );
};

export default LessonLoading;
