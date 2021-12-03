/* eslint-disable react-hooks/exhaustive-deps */
import Flickity from 'react-flickity-component';
import AnimatedSquare from '@components/Dashboard/GameChangers/components/AnimatedSquare';
import FocusIcon from '@components/Dashboard/GameChangers/components/FocusIcon';
import StartButton from '@components/Dashboard/GameChangers/components/StartButton';
import NextButton from '@components/Dashboard/GameChangers/components/NextButton';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import gsap from 'gsap';
import {Linear} from 'gsap/all';
import {map, times} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useGameChangers} from '@components/Dashboard/GameChangers/context/GameChangersContext';
import {cardsList} from '@components/Dashboard/GameChangers/__contstants';
import AnimatedFlower from '@components/Dashboard/GameChangers/components/AnimatedFlower';

const Counter = ({
  countSelected,
  counter,
}: {
  countSelected: number | null;
  counter: number | null;
}) => {
  return (
    <div className={'text-white font-semibold text-center text-lg'}>
      {counter}{' '}
      <span className="text-gray-300 font-light text-sm">out of {countSelected}</span>
    </div>
  );
};

const SelectedCard = ({
  card,
  onClick,
}: {
  card?: {id: number; title: string; desc: string; type: string};
  onClick: (id: number) => void;
}) => {
  const exerciseType = card.type;
  const {
    isActive,
    setIsActive,
    setCounter,
    counter,
    isCompleted,
    setIsCompleted,
    isPlayingMusic,
    setIsPlayingMusic,
    selectedCard,
    countSelected,
    setCountSelected,
  } = useGameChangers();

  const breathingHelpingTexts = ['inhale', 'hold', 'exhale', 'hold'];

  const tl = gsap.timeline({});
  const commonFields = {duration: 4, ease: Linear.easeNone};
  const onSquareAnimationStart = () => {
    const squareEl = $('#square');
    const width = squareEl.width();
    const height = squareEl.height();

    tl.to('#knob', {
      x: width,

      ...commonFields,
    })
      .to('#knob', {
        y: height,

        ...commonFields,
      })
      .to('#knob', {
        x: 0,

        ...commonFields,
      })
      .to('#knob', {
        y: 0,
        ...commonFields,
      });
  };

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
    setIsActive(true);
    if (exerciseType === 'square') {
      onSquareAnimationStart();
    }
  };

  const onPause = () => {
    setIsActive(false);
    setIsPlayingMusic(false);
  };

  const clearEverything = () => {
    setCounter(1);
    setCountSelected(null);
  };

  const onComplete = () => {
    setTimeout(() => {
      onPause();
      setIsCompleted(true);
      clearEverything();
      if (isPlayingMusic) {
        // @ts-ignore
        finishSound.play();
      }
    }, 700);
  };

  const [currentIteration, setCurrentIteration] = useState(0);

  useEffect(() => {
    if (isActive && exerciseType === 'square') {
      const interval = setInterval(() => {
        setCurrentIteration(currentIteration + 1);
      }, 4000);

      if (currentIteration === breathingHelpingTexts.length) {
        clearInterval(interval);
        if (countSelected === counter) {
          onComplete();
        } else {
          onStart();
          setCounter((prev) => prev + 1);
          setCurrentIteration(0);
        }
      }

      return () => {
        clearInterval(interval);
      };
    }
  }, [isActive, currentIteration, exerciseType]);

  const selected = cardsList[selectedCard];

  const onStartClick = () => {
    const elem = $('.carousel-cell.is-selected h1').text();
    setCountSelected(Number(elem));
  };

  return (
    <div
      className={` rounded-2xl box   z-100  w-auto    transition-all  flex flex-col items-center justify-center overflow-hidden form-button`}>
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
          {/* Count Selection Section */}

          <AnimatedContainer
            delay="0.5s"
            duration="1000"
            animationType="translateY"
            show={!isCompleted && countSelected === null}>
            {!isCompleted && countSelected === null && (
              <>
                <h1 className="text-4xl my-4  text-white font-bold">{card.title}</h1>
                <div className="flex w-auto items-center justify-center">
                  {selected.type === 'square' ? (
                    <FocusIcon isActive={isActive} />
                  ) : (
                    <AnimatedFlower />
                  )}
                </div>

                <h1 className="text-white mb-6 text-left  w-auto text-base tracking-wide font-normal">
                  Select number of cycles
                  <br />
                  <span className="font-light text-xs w-auto">
                    (4 is recommended if you are new to this)
                  </span>
                </h1>
                <Flickity
                  className={'carousel overflow-x-hidden mb-4'}
                  elementType={'div'}
                  options={{
                    initialIndex: 3,
                    pageDots: false,
                    selectedAttraction: 0.03,
                    friction: 0.15,
                  }}
                  reloadOnUpdate
                  disableImagesLoaded={false}>
                  {times(10, (t) => (
                    <div className="w-auto counter carousel-cell">
                      <h1 className="inner-card w-auto mx-4 text-white text-xl font-semibold">
                        {t + 1}
                      </h1>
                    </div>
                  ))}
                </Flickity>

                <NextButton onClick={onStartClick} countSelected={countSelected} />
              </>
            )}
          </AnimatedContainer>

          {/* Main Exercise Section */}

          <AnimatedContainer
            delay="0.5s"
            duration="1000"
            animationType="translateY"
            show={!isCompleted && countSelected !== null}>
            {!isCompleted && countSelected !== null && (
              <>
                <h1 className="text-4xl my-4  text-white font-bold">{card.title}</h1>
                <AnimatedSquare
                  onStart={onStart}
                  isActive={isActive}
                  exerciseType={exerciseType}
                  onComplete={onComplete}
                />

                <StartButton isActive={isActive} onStart={onStart} onPause={onPause} />

                <AnimatedContainer className="w-auto" show={isActive}>
                  {isActive && (
                    <Counter counter={counter} countSelected={countSelected} />
                  )}
                </AnimatedContainer>

                {exerciseType === 'square' && isActive && (
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

          {/* ON Complete Section */}
          <AnimatedContainer
            duration="1000"
            delay="0.5s"
            animationType="translateY"
            show={isCompleted}
            className="flex items-start flex-col ">
            {isCompleted && (
              <>
                {selected.type === 'square' ? (
                  <FocusIcon isActive={isActive} />
                ) : (
                  <AnimatedFlower />
                )}

                <h1 className="text-4xl my-4  text-white font-bold text-left">
                  Well done.
                </h1>
                <p className="text-base my-4  text-gray-100 font-light max-w-72 transition-all text-left">
                  Your breathing exercise is done. So far today you have done{' '}
                  <span className="text-white font-medium">
                    {selected.type === 'sqaure' ? 'Square' : '4-7-8'} exercise{' '}
                    {countSelected} times
                  </span>
                </p>
                <button
                  onClick={() => {
                    onClick(null);
                    setTimeout(() => {
                      setIsCompleted(false);
                    }, 300);
                  }}
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
