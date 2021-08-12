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
            className={`px-2 w-auto text-sm transition-all duration-200  text-gray-400 bg-white ${
              bgWhite ? 'dark:bg-white' : 'dark:bg-dark-gray'
            } `}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

export default DividerBlock;
