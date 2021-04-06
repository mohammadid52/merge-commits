import React from 'react';
import { initials, stringToHslColor } from '../../utilities/strings';

const ImageAlternate = ({ user, textSize, styleClass, rounded = true }: any) => {
  return (
    <div className={`${styleClass} flex justify-center items-center border-0 border-gray-400 `}>
      <div
        className={`h-full w-full flex justify-center items-center ${textSize} text-extrabold text-white ${
          rounded ? 'rounded-full' : ''
        }`}
        style={{
          background: `${stringToHslColor(user.firstName + ' ' + user.lastName)}`,
          textShadow: '0.2rem 0.2rem 3px #423939b3',
        }}>
        {initials(user.preferredName ? user.preferredName : user.firstName, user.lastName)}
      </div>
    </div>
  );
};
export default ImageAlternate;
