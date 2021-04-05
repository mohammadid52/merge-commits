import React from 'react';
import { initials, stringToHslColor } from '../../utilities/strings';

const ImageAlternate = ({ user, textSize, styleClass }: any) => {
  return (
    <div
      className={`${styleClass} md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
      <div
        className={`h-full w-full flex justify-center items-center ${textSize} text-extrabold text-white rounded-full`}
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
