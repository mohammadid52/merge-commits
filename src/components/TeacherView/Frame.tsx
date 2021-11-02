import React, {useEffect, useRef} from 'react';
import gsap from 'gsap/all';
import usePrevious from '@customHooks/previousProps';

interface IFrameProps {
  children?: React.ReactNode;
  visible?: boolean;
  additionalClass?: string;
}

const Frame = ({children, visible, additionalClass}: IFrameProps) => {
  const frameRef = useRef();

  const fadeIn = (refTarget: any) => {
    gsap.fromTo(
      refTarget.current,
      {
        width: '100%',
        height: '100%',
        opacity: 0,
        visibility: 'hidden',
        duration: 0.5,
      },
      {
        width: '100%',
        height: '100%',
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        ease: 'easeInOut',
      }
    );
  };

  const fadeOut = (refTarget: any) => {
    let tl = gsap.timeline();
    tl.to(refTarget.current, {
      width: '75%',
      height: '75%',
      opacity: 0,
      duration: 0.5,
      ease: 'easeInOut',
    });
    tl.set(refTarget.current, {visibility: 'hidden', delay: 0.5});
  };

  useEffect(() => {
    if (visible) {
      fadeIn(frameRef);
    } else {
      fadeOut(frameRef);
    }
  }, [visible]);

  return (
    <div
      ref={frameRef}
      style={{visibility: visible ? 'visible' : 'hidden'}}
      className={additionalClass}>
      {children}
    </div>
  );
};

export default Frame;
