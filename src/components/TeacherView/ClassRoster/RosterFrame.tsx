import React, {useContext, useEffect, useState, useRef} from 'react';
import {gsap} from 'gsap/all';
import usePrevious from '@customHooks/previousProps';

interface IRosterFrame {
  children?: React.ReactNode;
  fullscreen?: boolean;
}

const RosterFrame = ({children, fullscreen}: IRosterFrame) => {
  // ~~~~~~~~~ LIVE VIEW ANIMATION ~~~~~~~~~ //
  const frameRef = useRef();

  const slideOut = () => {
    let slideOutAnimation = gsap.fromTo(
      frameRef.current,
      {x: 0},
      {x: '-100%', duration: 1, ease: 'easeInOut'}
    );
  };
  const slideIn = () => {
    let slideOutAnimation = gsap.fromTo(
      frameRef.current,
      {x: '-100%'},
      {x: 0, duration: 1, ease: 'easeInOut'}
    );
  };

  const previousFullscreen = usePrevious(fullscreen);

  useEffect(() => {
    if (fullscreen) {
      slideOut();
    } else {
      if (previousFullscreen) {
        slideIn();
      }
    }
  }, [fullscreen]);

  return (
    <div
      ref={frameRef}
      className={`absolute w-full lg:w-3/10 min-w-100 h-1/4 lg:h-full flex flex-col items-center `}>
      <div className={`h-full w-full flex flex-col justify-between items-center`}>
        <div className={`h-full`}>{children}</div>
      </div>
    </div>
  );
};

export default RosterFrame;
