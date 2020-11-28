import React, { useContext, useState, useEffect, Suspense, lazy } from 'react';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaHome } from 'react-icons/fa';
import { FiUsers, FiMenu } from 'react-icons/fi';

interface HamburgerMenuProps {
  handleClick: () => void;
  handleHomePopup: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = (props: HamburgerMenuProps) => {
  const { handleClick, handleHomePopup } = props;
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false);

  return (
    <div className='w-auto mr-4 flex flex-col content-between '>
      <div className='relative flex flex-col my-auto justify-around'>
        <div className='hover:text-blueberry' onClick={() => setHamburgerOpen(!hamburgerOpen)}>
          <IconContext.Provider value={{ size: '1.5rem' }}>
            <FiMenu />
          </IconContext.Provider>
        </div>

        <div className='relative w-full'>
          

          <div className={`${hamburgerOpen ? 'visible' : 'hidden'} arrow-up`}></div>

          <div
            className={`${
              hamburgerOpen ? 'visible animate-fadeIn shadow-xl' : 'hidden'
            } absolute w-40 h-auto transform right-0 flex  flex-col bg-gray-200 p-1 rounded-lg border-light-gray overflow-hidden z-100`}>
            <div className='flex flex-col w-full h-full bg-gray-400 rounded-lg z-100'>
              <div
                className='h-12 w-full mb-2 flex justify-center items-center bg-gray-200 text-gray-600 text-xs rounded-lg border border-light-gray active:shadow-none cursor-pointer'
                onClick={handleClick}>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <span className='w-12'>
                    <FiUsers />
                  </span>
                </IconContext.Provider>
                <span className='w-full'>User Management</span>
              </div>
              <div
                className='h-12 w-full flex justify-center items-center bg-gray-200 text-gray-600 text-xs rounded-lg border border-light-gray active:shadow-none cursor-pointer'
                onClick={handleHomePopup}>
                <IconContext.Provider value={{ size: '1.5rem' }}>
                  <span className='w-12'>
                    <FaHome />
                  </span>
                </IconContext.Provider>
                <span className='w-full'>Home</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
