import React, { useState } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { CgMenuGridO } from 'react-icons/cg';

interface DropdownFancyProps {
  options?: Array<{ value: string; option: string }>;
  builderMenuVisible?: boolean;
}

const DropdownFancy = (props: DropdownFancyProps) => {
  const { options, builderMenuVisible } = props;

  return (
    <div className="relative">
      <div
        className={`
        ${builderMenuVisible ? 'transition ease-out duration-100' : 'transition ease-in duration-75'}
        ${builderMenuVisible ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95'}
        origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none
        z-50`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu">
        <div className="py-1" role="none">
          {options &&
            options.map((option: { value: string; option: string }, idx: number) => (
              <a
                key={`dd_option_${idx}`}
                href="#"
                id={option.value}
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem">
                {option?.option}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownFancy;
