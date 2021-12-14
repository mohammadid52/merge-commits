import gsap from 'gsap/all';
import {times} from 'lodash';
import React, {useEffect} from 'react';

const RenderCircle = () => {
  const hw = Math.floor(Math.random() * 20 + 10);

  const randomTranslate = [
    `translateX(${hw * 1.5}px)`,
    `translateY(${hw * 1.5}px)`,
    `translateX(-${hw * 1.5}px)`,
    `translateX(-${hw * 1.5}px)`,
  ];
  return (
    <div
      className="rounded-full bg-opacity-50 bg-teal-400"
      style={{
        height: hw,
        transform: randomTranslate[Math.floor(Math.random() * randomTranslate.length)],
        width: hw,
      }}
      id="circle1"></div>
  );
};

const AnimatedMind = () => {
  useEffect(() => {
    gsap.to('#inner-mind-container', {
      duration: 3,
      //   delay: 1,
      repeat: -1,
      //   repeatDelay: 0,
      rotate: 360,
    });
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-white relative w-auto">
        <div id="inner-mind-container">
          {times(3, (i) => (
            <RenderCircle key={i} />
          ))}
        </div>
        <div id="inner-mind-container">
          {times(3, (i) => (
            <RenderCircle key={i} />
          ))}
        </div>

        <div id="inner-mind-container">
          {times(3, (i) => (
            <RenderCircle key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedMind;
