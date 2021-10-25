import React, {useContext, useEffect, useState, useRef} from 'react';
import {gsap} from 'gsap/all';
import usePrevious from '@customHooks/previousProps';
import LessonDetails from '../TopMenu/LessonDetails';
import LessonInfoTitleBar from '../TopMenu/LessonInfoTitleBar';

interface IRosterFrame {
  children?: React.ReactNode;
  fullscreen?: boolean;
}

const RosterFrame = ({children, fullscreen}: IRosterFrame) => {
  // ~~~~~~~~~ LIVE VIEW ANIMATION ~~~~~~~~~ //
  const frameRef = useRef();

  const slideOut = () => {
    gsap.fromTo(frameRef.current, {x: 0}, {x: '-100%', duration: 1, ease: 'easeInOut'});
  };
  const slideIn = () => {
    gsap.fromTo(frameRef.current, {x: '-100%'}, {x: 0, duration: 1, ease: 'easeInOut'});
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
      className={`absolute bg-white w-full h-full lg:w-2.5/10 max-w-128 flex flex-col items-center`}>
      {/* <LessonInfoTitleBar /> */}
      <LessonDetails />
      <div className={`h-full w-full flex flex-col justify-between items-center`}>
        <div className={`h-full`}>{children}</div>
      </div>
    </div>
  );
};

export default RosterFrame;
