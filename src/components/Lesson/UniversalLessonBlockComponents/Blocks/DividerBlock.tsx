import React, {useContext} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';

const DividerBlock = ({value, bgWhite}: {value: string; bgWhite?: boolean}) => {
  const {
    state: {lessonPage: {theme = 'dark'} = {}},
  } = useContext(GlobalContext);
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t-0 border-gray-300" />
      </div>
      <div className="relative flex w-auto justify-center">
        {value && (
          <span
            className={`"px-2 w-auto text-sm  text-gray-400 ${
              theme === 'dark' && !bgWhite ? 'bg-dark-gray' : 'bg-white'
            }`}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default DividerBlock;
