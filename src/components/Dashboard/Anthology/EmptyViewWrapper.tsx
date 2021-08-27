import React, {useContext, useState} from 'react';
import {useEffect} from 'react';

interface IEmptyViewWrapper {
  children?: React.ReactNode;
  fallbackContents?: any;
  revealContents?: boolean;
  timedRevealInt?: number;
  wrapperClass?: string;
}

const EmptyViewWrapper = ({
  children,
  fallbackContents,
  revealContents,
  timedRevealInt,
  wrapperClass,
}: IEmptyViewWrapper) => {
  const [timeToReveal, setTimeToReveal] = useState<boolean>(false);

  useEffect(() => {
    if (timedRevealInt) {
      setTimeout(() => {
        setTimeToReveal(true);
      }, timedRevealInt * 50);
    }
  }, [timedRevealInt]);

  return (
    <div
      className={`
      transition transform duration-500 ease-in-out
      ${
        !revealContents && timedRevealInt === undefined
          ? `${
              wrapperClass
                ? wrapperClass
                : 'min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4'
            }`
          : ''
      }`}>
      <div
        className={`flex flex-center items-center transition duration-500 ease-in-out overflow-hidden ${
          !revealContents && timedRevealInt === undefined
            ? 'p-12 h-full w-full opacity-100'
            : 'h-0 opacity-0'
        }`}>
        {fallbackContents ? (
          fallbackContents
        ) : (
          <p className="text-center text-lg text-gray-500">
            Please select a notebook above to view your data
          </p>
        )}
      </div>

      <div
        className={`transition duration-500 ease-in-out overflow-hidden ${
          revealContents || timeToReveal ? 'h-auto w-full opacity-100' : 'h-0 opacity-0'
        }`}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(EmptyViewWrapper);
