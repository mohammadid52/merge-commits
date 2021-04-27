import React from 'react';

export const FloatingBar = (props: {isOpen?: boolean; toggleMenu: () => void}) => {
  return (
    <div
      id={`floatingBar`}
      onClick={props.toggleMenu}
      className={`
      transform transition ease-in-out duration-400 sm:duration-400 
      ${props.isOpen ? '-translate-x-12' : '-translate-x-0'}
      absolute w-12 h-full min-h-64
      left-0 
      bg-gray-700 border-r-1 border-gray-200 rounded-l-lg
      shadow`}
    />
  );
};