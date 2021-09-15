import {useEffect, useRef} from 'react';

/**
 *
 * @param callback Function to call
 * @param dependencies Call callback function based on dependecies changes
 *
 * This is modified version of useEffect. Which will call callback function only when dependency changes not on first render
 */
const useUpdateEffect = (callback: any, dependencies: any[]) => {
  const called = useRef(false);
  useEffect(() => {
    if (!called) {
      called.current = true;
      return;
    } else {
      callback();
    }
  }, [...dependencies]);
};

export default useUpdateEffect;
