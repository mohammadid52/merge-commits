import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import 'components/Dashboard/GameChangers/GameChanger.scss';

import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';
import {gsap} from 'gsap';
import {Linear, Power2} from 'gsap/all';
import {map, times} from 'lodash';
import React, {useEffect, useState} from 'react';
import {BsFillHeartFill, BsFullscreen, BsHeart} from 'react-icons/bs';
import useKeyPress from 'customHooks/useKeyPress';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import {IoIosHelpCircleOutline} from 'react-icons/io';

const defaultImage =
  'https://c4.wallpaperflare.com/wallpaper/510/821/261/nature-leaves-plants-green-hd-wallpaper-preview.jpg';

const elem = document.documentElement;

/* View in fullscreen */
function openFullscreen(): void {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    // @ts-ignore
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    // @ts-ignore
    elem.webkitRequestFullscreen();
    // @ts-ignore
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    // @ts-ignore
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    /* IE11 */
    // @ts-ignore
    document.msExitFullscreen();
  }
}

interface StartButtonProps {
  liked: boolean;
  isImmersiveMode: boolean;
  isActive: boolean;
  isPlaying: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHowTo: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  onStart: () => void;
  turnOffImmersiveMode: () => void;
  turnOnImmersiveMode: () => void;
  onPause: () => void;
}

interface CountProps {
  counter: number;
}

interface ExerciseProps {
  bgImage?: string;
  exerciseName1?: string;
  exerciseType: string;
  exerciseName2?: string;
  infoText?: string;
  howToList?: string[];
}

const StartButton = ({
  liked,
  setLiked,
  onStart,
  isActive,
  setIsPlayingMusic,
  isPlaying,
  onPause,
  isImmersiveMode,
  turnOffImmersiveMode,
  turnOnImmersiveMode,
  setShowInfo,
  setShowHowTo,
}: StartButtonProps) => {
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 transform transition-all ';

  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <div
        onClick={() => {
          if (isImmersiveMode) {
            turnOffImmersiveMode();
          } else {
            turnOnImmersiveMode();
          }
        }}
        className={classNames(commonBtnClass, 'text-2xl text-white text-opacity-50')}>
        <BsFullscreen />
      </div>
      <button
        disabled={isActive}
        onClick={isActive ? onPause : onStart}
        className={classNames(
          commonBtnClass,
          isActive ? 'bg-opacity-70 pointer-events-none' : '',
          ' px-4 py-2  bg-white bg-opacity-50 rounded-lg text-white'
        )}>
        Start
      </button>
      <div
        onClick={() => setLiked(!liked)}
        className={classNames(commonBtnClass, 'text-2xl text-white text-opacity-50')}>
        {liked ? <BsFillHeartFill /> : <BsHeart />}
      </div>
      <div className="absolute flex flex-col gap-y-4 items-center justify-center right-0 pr-10 w-auto">
        <div
          onClick={() => setShowHowTo((prev) => !prev)}
          className={classNames(
            commonBtnClass,
            'meditation-card__btn text-2xl text-white text-opacity-50'
          )}>
          <IoIosHelpCircleOutline />
        </div>
        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className={classNames(
            commonBtnClass,
            'meditation-card__btn text-2xl text-white text-opacity-50'
          )}>
          <AiOutlineInfoCircle />
        </div>
        <div
          onClick={() => setIsPlayingMusic((prev) => !prev)}
          className={classNames(
            commonBtnClass,
            'meditation-card__btn text-2xl text-white text-opacity-50'
          )}>
          {isPlaying ? <MdOutlineMusicOff /> : <MdOutlineMusicNote />}
        </div>
      </div>
    </div>
  );
};

const Count = ({counter}: CountProps) => {
  return <h1 className="w-auto mb-8 text-5xl font-bold text-white">{counter}</h1>;
};

const AnimatedSquare = ({
  isActive,
  currentHelpingInfo = 'inhale',
  exerciseType = 'square',

  onComplete,
}: {
  isActive: boolean;
  currentHelpingInfo: string;
  exerciseType: string;

  onComplete?: () => void;
}) => {
  let circleCounts = 6;

  if (exerciseType === 'square') {
    return (
      <div id="box">
        <div
          className="w-72 h-72 relative flex items-center  justify-center bg-transparent border-6 border-white rounded-lg"
          id="square">
          <div
            style={{top: -16, left: -16}}
            id="knob"
            className="bg-white shadow-2xl h-8 w-8 rounded-full absolute "></div>
          <div className="circle_container overflow-hidden rounded-full w-auto relative">
            <div
              className="h-40 w-40 shadow-xl flex items-center justify-center text-center z-10  rounded-full bg-white bg-opacity-80 absolute"
              style={{top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
              <h1 className="text-2xl text-gray-900 font-bold">{currentHelpingInfo}</h1>
            </div>
            {times(circleCounts, (i) => (
              <div className={`z-0 ${isActive ? `ripple-${i + 1}` : ''} `} key={i}></div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    let t = [
      'Breathe In',
      '1',
      '2',
      '3',
      '4',
      'Hold',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      'Breathe Out',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ];

    const [currentIteration, setCurrentIteration] = useState(0);

    useEffect(() => {
      if (isActive) {
        const interval = setInterval(
          () => {
            setCurrentIteration(currentIteration + 1);
          },
          !isNaN(Number(t[currentIteration])) ? 1200 : 3000
        );

        if (currentIteration === t.length - 1) {
          setCurrentIteration(0);
          clearInterval(interval);
          onComplete();
        }

        return () => clearInterval(interval);
      }
    }, [isActive, currentIteration]);

    return (
      <div id="box">
        <div className="absolute overflow-hidden inset-0 rounded-full w-full h-full">
          <div
            className="h-40 w-40 bg-opacity-80 flex items-center justify-center text-center z-10  rounded-full bg-white shadow-xl absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}>
            <ul className="fse-text-helper-list">
              {map(t, (item, i) => (
                <li
                  className={`${
                    i === currentIteration ? 'showing' : 'hide'
                  } text-2xl text-gray-900 font-bold`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              transitionDuration: '3s',
              transform:
                isActive && !isNaN(Number(t[currentIteration]))
                  ? `scale(300)`
                  : 'scale(0)',
              zIndex: 4,
            }}
            className={`transition-all ease-in-out ripple`}></div>
        </div>
      </div>
    );
  }
};

const BreathingExercise = ({
  bgImage = defaultImage,
  exerciseName1 = 'Square',
  exerciseName2 = 'Breathing',
  howToList = [''],
  exerciseType = 'square',
  infoText = '',
}: ExerciseProps) => {
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const [currentHelpingInfo, setCurrentHelpingInfo] = useState('inhale');

  const squareEl = $('#square');

  const width = squareEl.width();
  const height = squareEl.height();

  const resetCircularPosition = () => gsap.set('#knob', {left: width / 2 - 16, top: -16});

  useEffect(() => {
    if (exerciseType === '478') {
      resetCircularPosition();
    }
  }, [exerciseType]);

  const onSquareAnimationStart = () => {
    const tl = gsap.timeline({});
    const commonFields = {duration: 4, ease: Linear.easeNone};
    tl.to('#knob', {
      x: width,
      onStart: () => {
        setCurrentHelpingInfo('inhale');
      },
      ...commonFields,
    })
      .to('#knob', {
        y: height,
        onStart: () => {
          setCurrentHelpingInfo('hold');
        },
        ...commonFields,
      })
      .to('#knob', {
        x: 0,
        onStart: () => {
          setCurrentHelpingInfo('exhale');
        },
        ...commonFields,
      })
      .to('#knob', {
        onStart: () => {
          setCurrentHelpingInfo('hold');
        },
        onComplete: () => {},
        y: 0,
        ...commonFields,
      });
  };

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
  }, [isPlayingMusic]);

  const audioControl = document.getElementById('background-music');

  const turnOnImmersiveMode = () => {
    $('#top-menu').hide();
    setIsImmersiveMode(true);
    openFullscreen();
  };
  const turnOffImmersiveMode = () => {
    closeFullscreen();
    setIsImmersiveMode(false);

    $('#top-menu').show();
  };

  const escPressed = useKeyPress('Escape');

  useEffect(() => {
    if (escPressed && isImmersiveMode) {
      turnOffImmersiveMode();
    }
  }, [escPressed, isImmersiveMode]);

  // Animations here
  let animate = gsap.timeline();
  useEffect(() => {
    animate.fromTo(
      '#meditation-card__title',
      {x: -100, opacity: 0, duration: 2, delay: 2},
      {x: 0, opacity: 1}
    );

    return () => {
      animate.kill();
    };
  }, []);

  // on/off functions below

  const onStart = () => {
    setIsActive(true);
    setIsPlayingMusic(true);
    if (exerciseType === 'square') {
      onSquareAnimationStart();
    }
  };

  const onPause = () => {
    setIsActive(false);
    setIsPlayingMusic(false);
  };

  const onComplete = () => {
    setCounter(counter + 1);
    onPause();
  };

  return (
    <div className="h-full flex items-center relative overflow-hidden justify-center">
      <audio id="background-music">
        <source
          src="https://selready.s3.us-east-2.amazonaws.com/meditation.mp3"
          type="audio/mp3"
        />
      </audio>
      <div
        style={{
          maxHeight: `100vh`,
          maxWidth: isImmersiveMode ? `none` : `41rem`,
          minWidth: isImmersiveMode ? `none` : `41rem`,
        }}
        className={classNames(
          isImmersiveMode ? '' : ' flex  items-center w-164 justify-center mx-auto',
          'transition-all duration-500 overflow-hidden '
        )}>
        <div
          id="meditation-card"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.6)), url(${
              bgImage || defaultImage
            })`,

            backgroundSize: 'cover',
            height: isImmersiveMode ? '100vh' : `90vh`,
          }}
          className={`${
            isImmersiveMode ? '' : 'rounded-2xl'
          } p-10 bg-center duration-500 transition-all bg-no-repeat overflow-hidden relative`}>
          <div id="overlay" className=" bg-black absolute inset-0 bg-opacity-30" />
          {/* Text area */}
          <div className="">
            <h1
              id="meditation-card__title"
              className="z-20 text-white text-6xl font-bold tracking-wider drop-shadow-xl filter">
              {exerciseName1}
              <br /> {exerciseName2}
            </h1>
          </div>

          {/* Action area */}
          <div className="absolute bottom-5 inset-x-0 flex items-center flex-col justify-center w-auto z-20">
            <AnimatedSquare
              isActive={isActive}
              exerciseType={exerciseType}
              currentHelpingInfo={currentHelpingInfo}
              onComplete={onComplete}
            />

            <Count counter={counter} />
            <StartButton
              setShowHowTo={setShowHowTo}
              setShowInfo={setShowInfo}
              isActive={isActive}
              turnOnImmersiveMode={turnOnImmersiveMode}
              turnOffImmersiveMode={turnOffImmersiveMode}
              onStart={onStart}
              isPlaying={isPlayingMusic}
              isImmersiveMode={isImmersiveMode}
              liked={liked}
              onPause={onPause}
              setIsPlayingMusic={setIsPlayingMusic}
              setLiked={setLiked}
            />
          </div>
        </div>
      </div>

      <div
        className={`absolute transition-all right-0 flex-col top-2 items-end justify-center w-auto hidden xl:flex gap-y-12`}>
        <div
          id="breathing_exercise-how_it_works"
          className={`${
            isImmersiveMode
              ? `${
                  showHowTo ? 'translate-x-0' : 'translate-x-full'
                } max-w-156 bg-black bg-opacity-10  border-0 border-white`
              : ` max-w-96 ${showHowTo ? 'translate-x-0' : 'translate-x-200'} bg-white`
          } rounded-l-xl p-4 px-6 transform   transition-all shadow-lg`}>
          <ul className="w-auto mx-1 transition-all space-y-4 list-disc px-4 py-6 ">
            {map(howToList, (text) => (
              <li
                key={text}
                className={classNames(
                  isImmersiveMode
                    ? 'text-white font-semibold  italic text-xl'
                    : 'text-gray-800 ',
                  ` duration-500  transition-all`
                )}>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div
          id="breathing_exercise-info"
          className={`${
            isImmersiveMode
              ? `${
                  showInfo ? 'translate-x-0' : 'translate-x-full'
                } max-w-156 text-white font-semibold italic text-xl  bg-black bg-opacity-10  border-0 border-white`
              : `${
                  showInfo ? 'translate-x-0' : 'translate-x-200'
                }  text-gray-800 bg-white  max-w-96`
          } rounded-l-xl  p-4 px-6 transition-all transform  shadow-lg`}>
          {infoText}
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
