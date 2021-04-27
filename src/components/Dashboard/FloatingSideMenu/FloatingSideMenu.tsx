import React, {useEffect, useRef, useState} from 'react';
import {useWindowSize} from '../../../customHooks/windowSize';
import ExpandedMenu from './ExpandedMenu';
import {FloatingBar} from './FloatingBar';

const FloatingSideMenu = () => {
  const [open, setOpen] = useState(true);

  const toggleMenu = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className="relative w-0 h-full flex flex-row flex-1 ">
      <div
        className={`
        fixed flex-1 flex flex-col
        transform transition ease-in-out duration-400 sm:duration-400
        ${open ? '-translate-x-64 scale-x-1 w-64' : '-translate-x-12 w-0'} 
        top-1/2 -translate-y-1/2
        min-h-64
        bg-gray-800 
        shadow`}>
        <div className={`relative min-h-64`}>
          <FloatingBar toggleMenu={toggleMenu} isOpen={open} />
          <ExpandedMenu isOpen={open} toggleMenu={toggleMenu} />
        </div>
      </div>
    </div>
  );
};

export default FloatingSideMenu;