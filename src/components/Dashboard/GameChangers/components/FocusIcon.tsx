import React from 'react';
const circularClass = ' rounded-full border-8 border-teal-600';

const style = {border: '8px solid #319795'};

const FocusIcon = ({isActive = false}: {isActive: boolean}) => (
  <div className={`w-auto my-12 ${isActive ? 'scale-animation' : ''} `}>
    <div style={style} className={`${circularClass}  main_circle h-32 w-32`}>
      <div style={style} className={`${circularClass} h-28 w-28`}>
        <div style={style} className={`${circularClass} h-24 w-24`}>
          <div style={style} className={`${circularClass} h-20 w-20`}>
            <div
              style={style}
              className={`${circularClass} main_circle  h-16 w-16`}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FocusIcon;
