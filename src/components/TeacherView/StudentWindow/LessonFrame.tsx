import React, {useContext, useEffect, useState, useRef} from 'react';
import {gsap} from 'gsap/all';
import usePrevious from '@customHooks/previousProps';
import useDeviceDetect from '@customHooks/deviceDetect';
import StudentWindowTitleBar from './StudentWindowTitleBar';

interface ILessonFrame {
  children?: React.ReactNode;
  fullscreen?: boolean;
  handleFullscreen?: any;
  theme?: any;
  anyoneIsViewed?: boolean;
  anyoneIsShared?: boolean;
  isPresenting?: boolean;
}

const LessonFrame = ({
  children,
  fullscreen,
  handleFullscreen,
  theme,
  anyoneIsViewed,
  anyoneIsShared,
  isPresenting,
}: ILessonFrame) => {
  // ~~~~~~~~~~~ LIVE VIEW STATE ~~~~~~~~~~~ //
  const [live, setLive] = useState<boolean>(false);
  useEffect(() => {
    if (anyoneIsShared || anyoneIsViewed || isPresenting) {
      if (!live) {
        setLive(true);
      }
    } else {
      if (live) {
        setLive(false);
      }
    }
  }, [anyoneIsShared, anyoneIsViewed, isPresenting]);

  // ~~~~~~~~~ LIVE VIEW ANIMATION ~~~~~~~~~ //
  const lessonWindowRef = useRef();
  const frameRef = useRef();

  useEffect(() => {
    const borderAnimation = gsap.timeline({repeat: -1, duration: 2});
    borderAnimation.from(lessonWindowRef.current, {
      borderColor: 'rgba(97, 169, 237,0.5)',
      borderWidth: 4,
      ease: 'power2',
    });
    borderAnimation.to(lessonWindowRef.current, {
      borderColor: 'rgba(97, 169, 237,1)',
      borderWidth: 4,
      ease: 'power2',
    });
    borderAnimation.to(lessonWindowRef.current, {
      borderColor: 'rgba(97, 169, 237,0.5)',
      borderWidth: 4,
      ease: 'power2',
    });

    if (!live && borderAnimation) {
      borderAnimation.kill();
    }
    return () => {
      if (borderAnimation) {
        borderAnimation.kill();
      }
    };
  }, [live]);

  // ~~~~~~~~~ FULLSCREEN ANIMATION ~~~~~~~~ //

  const scaleDown = () => {
    let scaleDownAnimation = gsap.fromTo(
      frameRef.current,
      {width: '100%'},
      {width: '70%', scaleOrigin: 'right', duration: 1, ease: 'easeInOut'}
    );
  };
  const scaleUp = () => {
    let scaleUpAnimation = gsap.fromTo(
      frameRef.current,
      {width: '70%'},
      {width: '100%', scaleOrigin: 'right', duration: 1, ease: 'easeInOut'}
    );
  };

  const previousFullscreen = usePrevious(fullscreen);

  useEffect(() => {
    if (fullscreen) {
      scaleUp();
    } else {
      if (previousFullscreen) {
        scaleDown();
      }
    }
  }, [fullscreen]);
  const {mobile} = useDeviceDetect();
  return (
    <>
      <div
        ref={frameRef}
        style={{width: '70%', height: mobile && !fullscreen ? 'calc(75% - 80px)' : ''}}
        className={`absolute mr-0 right-0 h-full flex flex-col items-center`}>
        <StudentWindowTitleBar
          handleFullscreen={handleFullscreen}
          fullscreen={fullscreen}
        />

        <div ref={lessonWindowRef} className="flex-1 overflow-y-scroll">
          {children}
        </div>
      </div>
    </>
  );
};

export default LessonFrame;
