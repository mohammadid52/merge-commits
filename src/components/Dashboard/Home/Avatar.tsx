import React from 'react';
import { stringToHslColor } from '../../../utilities/strings';

const Avatar = (props: { userObj: any; idx?: number; size: 8 | 16 | 32 }) => {
  const { userObj, idx, size } = props;
  return (
    <div
      className={`w-${size} h-${size} min-w-${size} min-h-${size} flex justify-center content-center items-center rounded-full border border-dark-gray border-opacity-10 overflow-hidden`}
      style={{
        background: `${userObj.firstName ? stringToHslColor(userObj.firstName + ' ' + userObj.lastName) : '#272730'}`,
        textShadow: '0.1rem 0.1rem 2px #423939b3',
      }}>
      <img src={`${userObj.image}`} alt={`student_${idx}_avatar`} className={`object-cover h-16 w-full`} />
    </div>
  );
};

export default Avatar;
