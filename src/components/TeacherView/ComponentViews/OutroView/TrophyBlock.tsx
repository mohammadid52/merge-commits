import React, {useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaTrophy, FaPenFancy, FaScroll} from 'react-icons/fa';

interface props {
  fullscreen: boolean;
}

const TrophyBlock = (props: props) => {
  const {fullscreen} = props;

  return (
    <div className="h-full w-6.8/10 bg-dark-blue flex flex-col justify-between items-center shadow-2 rounded-lg p-4">
      <div className="h-full flex flex-col justify-between items-center">
        <div
          className={`${
            fullscreen ? ' text-2xl' : 'text-md'
          } h-1.5/10 text-gray-200  font-bold border-b-0 border-white`}>
          You have completed
        </div>

        <div className="flex h-8/10 justify-center">
          <div className="flex flex-col justify-center column-center">
            {fullscreen ? (
              <IconContext.Provider value={{color: '#F1C40F', size: '5rem'}}>
                <FaScroll />
              </IconContext.Provider>
            ) : (
              <IconContext.Provider value={{color: '#F1C40F', size: '3rem'}}>
                <FaScroll />
              </IconContext.Provider>
            )}
            <div
              className={`${
                fullscreen ? 'text-2xl' : 'text-base'
              } flex justify-center text-gray-200  font-bold mt-2`}>
              1 Story
            </div>
          </div>
          <div className="flex flex-col justify-center column-center">
            {fullscreen ? (
              <IconContext.Provider value={{color: '#F1C40F', size: '5rem'}}>
                <FaPenFancy />
              </IconContext.Provider>
            ) : (
              <IconContext.Provider value={{color: '#F1C40F', size: '3rem'}}>
                <FaPenFancy />
              </IconContext.Provider>
            )}
            <div
              className={`${
                fullscreen ? 'text-2xl' : 'text-base'
              } flex justify-center text-gray-200  font-bold mt-2`}>
              1 Poem
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyBlock;
