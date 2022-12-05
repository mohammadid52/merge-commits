import {initials, stringToHslColor} from '@utilities/strings';
import React from 'react';

const Placeholder = ({
  name,
  size = 'w-10 h-10 md:w-12 md:h-12',
  textSize = '2xl:text-2xl',
  className,
  firstName = '',
  lastName = ''
}: {
  name?: string;
  textSize?: string;
  className?: string;
  size?: string;
  firstName?: string;
  lastName?: string;
}) => {
  return (
    <div
      className={`${size} flex flex-shrink-0 justify-center items-center rounded-full  border-0 border-gray-400 customShadow cursor-pointer ${className}`}>
      <div
        className={`h-full w-full flex justify-center items-center ${textSize} text-extrabold text-white rounded-full text-shadow`}
        style={{
          /*  stylelint-disable */
          background: `${firstName ? stringToHslColor(firstName + ' ' + lastName) : null}`
        }}>
        {firstName && initials(firstName, lastName)}
      </div>
    </div>
  );
};

export default Placeholder;
