/* eslint-disable react-hooks/exhaustive-deps */
import AnimatedSquare from '@components/Dashboard/GameChangers/components/AnimatedSquare';
import FocusIcon from '@components/Dashboard/GameChangers/components/FocusIcon';
import StartButton from '@components/Dashboard/GameChangers/components/StartButton';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import gsap from 'gsap';
import {Linear} from 'gsap/all';
import {map} from 'lodash';
import React, {useEffect, useState} from 'react';

const SelectedCard = ({
  card,
  onClick,
  isPlayingMusic,
  setIsPlayingMusic,
}: {
  isPlayingMusic: boolean;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  card?: {id: number; title: string; desc: string; type: string};
  onClick: (id: number) => void;
}) => {
  const exerciseType = card.type;

  const [counter, setCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const breathingHelpingTexts = ['inhale', 'hold', 'exhale', 'hold'];

  const [config, setConfig] = useState({h: 0, w: 0});

  useEffect(() => {
    const squareEl = $('#square');
    const width = squareEl.width();
    const height = squareEl.height();

    setConfig({h: height, w: width});
  }, []);

  const tl = gsap.timeline({});
  const commonFields = {duration: 4, ease: Linear.easeNone};
  const onSquareAnimationStart = () => {
    tl.to('#knob', {
      x: config.w,

      ...commonFields,
    })
      .to('#knob', {
        y: config.h,

        ...commonFields,
      })
      .to('#knob', {
        x: 0,

        ...commonFields,
      })
      .to('#knob', {
        onComplete: onComplete,
        y: 0,
        ...commonFields,
      });
  };

  const [isCompleted, setIsCompleted] = useState(false);

  const audioControl = document.getElementById('background-music');
  const finishSound = document.getElementById('finish-sound');

  useEffect(() => {
    if (isPlayingMusic) {
      // @ts-ignore
      audioControl?.play();
    } else {
      // @ts-ignore
      audioControl?.pause();
    }
    return () => {
      // @ts-ignore
      audioControl?.pause();
    };
  }, [audioControl, isPlayingMusic]);

  // on/off functions below

  const onStart = () => {
    if (exerciseType === 'square') {
      onSquareAnimationStart();
    }
    setIsActive(true);
    setIsPlayingMusic(true);
  };

  const onPause = () => {
    setIsActive(false);
    setIsPlayingMusic(false);
  };

  const onComplete = () => {
    setCounter(counter + 1);
    setTimeout(() => {
      onPause();
      setIsCompleted(true);
      // @ts-ignore
      finishSound.play();
    }, 1000);
  };

  const [currentIteration, setCurrentIteration] = useState(0);

  useEffect(() => {
    if (isActive && exerciseType === 'square') {
      const interval = setInterval(() => {
        setCurrentIteration(currentIteration + 1);
      }, 4000);

      if (currentIteration === breathingHelpingTexts.length - 1) {
        setCurrentIteration(0);
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [isActive, currentIteration, exerciseType]);

  return (
    <div
      className={`carousel-cell rounded-2xl box  is-selected z-100  w-auto    transition-all  flex flex-col items-center justify-center overflow-hidden form-button`}>
      <audio id="finish-sound">
        <source
          src="http://freesoundeffect.net/sites/default/files/achiement-4-sound-effect-6274415.mp3"
          type="audio/mp3"
        />
      </audio>
      <audio id="background-music">
        <source
          src="https://selready.s3.us-east-2.amazonaws.com/meditation.mp3"
          type="audio/mp3"
        />
      </audio>
      <div
        style={{
          background: 'rgba(21, 19, 21, .8)',
        }}
        className={`h-full  transition-all rounded-2xl p-16 px-14  flex flex-col border-gray-900 md:border-2 items-center justify-center overflow-hidden `}>
        <div>
          <AnimatedContainer
            delay="0.5s"
            duration="1000"
            animationType="translateY"
            show={!isCompleted}>
            {!isCompleted && (
              <>
                <h1 className="text-4xl my-4  text-white font-bold">{card.title}</h1>
                <AnimatedSquare
                  isActive={isActive}
                  exerciseType={exerciseType}
                  onComplete={onComplete}
                />
                {/* <Count counter={counter} /> */}

                <StartButton isActive={isActive} onStart={onStart} onPause={onPause} />
                {exerciseType === 'square' && (
                  <ul className="mt-8 fse-text-helper-list">
                    {map(breathingHelpingTexts, (item, i) => (
                      <li
                        key={i}
                        className={`${
                          i === currentIteration ? 'showing' : 'hide'
                        } text-xl text-center w-auto text-gray-200 font-light`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </AnimatedContainer>
          <AnimatedContainer
            duration="1000"
            delay="0.5s"
            animationType="translateY"
            show={isCompleted}
            className="flex items-start flex-col ">
            {isCompleted && (
              <>
                <FocusIcon isActive={isActive} />
                <h1 className="text-4xl my-4  text-white font-bold text-left">
                  Well done.
                </h1>
                <p className="text-base my-4  text-gray-100 font-light max-w-72 transition-all text-left">
                  Your breathing exercise is done. So far today you have 10 minutes
                  mindfully
                </p>
                <button
                  onClick={() => onClick(null)}
                  className=" bg-teal-600 hover:bg-teal-700 transition-all w-84  p-2 text-white mt-8 rounded-md px-4">
                  Complete
                </button>
              </>
            )}
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default SelectedCard;
