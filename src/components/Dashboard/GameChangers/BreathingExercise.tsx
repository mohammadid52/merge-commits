import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import 'components/Dashboard/GameChangers/GameChanger.scss';
// import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';
import {gsap} from 'gsap';
import {Linear} from 'gsap/all';
import {map, times} from 'lodash';
import React, {useEffect, useState} from 'react';
import {BsFillHeartFill, BsFullscreen, BsHeart} from 'react-icons/bs';

const mainImg =
  'https://images.unsplash.com/photo-1559544948-da38a2615cb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80';

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
  setIsImmersiveMode: React.Dispatch<React.SetStateAction<boolean>>;
  liked: boolean;
  isImmersiveMode: boolean;
  isActive: boolean;
  isPlaying: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  onStart: () => void;
  onPause: () => void;
}

interface HelpingTextProps {
  isImmersiveMode: boolean;
}

interface CountProps {
  counter: number;
}

const StartButton = ({
  setIsImmersiveMode,
  liked,
  setLiked,
  onStart,
  isActive,
  setIsPlayingMusic,
  isPlaying,
  onPause,
  isImmersiveMode,
}: StartButtonProps) => {
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 transform transition-all ';
  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <div
        onClick={() => {
          if (isImmersiveMode) {
            closeFullscreen();
            $('#top-menu').show();
          } else {
            $('#top-menu').hide();
            openFullscreen();
          }
          setIsImmersiveMode((prev) => !prev);
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
      <div
        onClick={() => setIsPlayingMusic((prev) => !prev)}
        className={classNames(
          'absolute right-0 pr-10 w-auto',
          'text-2xl text-white text-opacity-50'
        )}>
        {/* {isPlaying ? <MdOutlineMusicOff /> : <MdOutlineMusicNote />} */}
      </div>
    </div>
  );
};

const Count = ({counter}: CountProps) => {
  return <h1 className="w-auto mb-8 text-5xl font-bold text-white">{counter}</h1>;
};

const HelpingText = ({isImmersiveMode}: HelpingTextProps) => {
  const textList = [
    'Begin by slowly exhaling all of your air out',
    'Then, gently inhale through your nose to a slow count of 4',
    'Hold at the top of the breath for a count of 4',
    'Then gently exhale through your mouth for a count of 4',
    'At the bottom of the breath, pause and hold for the count of 4',
  ];

  return (
    <div
      className={classNames(
        isImmersiveMode ? 'text-3xl' : 'text-xl',
        'mb-8 text-white italic text-left pl-10  font-semibold'
      )}>
      <ul className="w-auto mx-1 ">
        {map(textList, (text) => (
          <li
            className={classNames(
              isImmersiveMode ? '' : 'max-w-96',
              ' duration-500 transition-all'
            )}>
            "{text}"
          </li>
        ))}
      </ul>
    </div>
  );
};

const AnimatedSquare = ({
  isActive,
  currentHelpingInfo = 'inhale',
}: {
  isActive: boolean;
  currentHelpingInfo: string;
}) => {
  let circleCounts = 4;

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
            className="h-40 w-40 flex items-center justify-center text-center z-10  rounded-full bg-white bg-opacity-80 absolute"
            style={{top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <h1 className="text-2xl text-gray-900 font-bold">{currentHelpingInfo}</h1>
          </div>
          {times(circleCounts, (i) => (
            <div className={`z-0 ${isActive ? `ripple-${i}` : ''} `} key={i}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BreathingExercise = () => {
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [liked, setLiked] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const [currentHelpingInfo, setCurrentHelpingInfo] = useState('inhale');

  const squareEl = $('#square');

  const width = squareEl.width();
  const height = squareEl.height();

  const commonFields = {duration: 0.5, ease: Linear.easeNone};
  var tl = gsap.timeline({});

  const onAnimationStart = () => {
    tl.to(
      '#knob',

      {
        x: width,

        onStart: () => {
          setCurrentHelpingInfo('exhale');
        },
        ...commonFields,
      }
    )

      .to(
        '#knob',

        {
          y: height,
          onStart: () => {
            setCurrentHelpingInfo('hold');
          },

          ...commonFields,
        }
      )

      .to(
        '#knob',

        {
          x: 0,
          onStart: () => {
            setCurrentHelpingInfo('exhale');
          },
          ...commonFields,
        }
      )

      .to(
        '#knob',

        {
          onStart: () => {
            setCurrentHelpingInfo('hold');
          },
          onComplete: () => {
            setCounter((prevCounter) => {
              let counter = prevCounter + 1;

              if (counter % 4 === 0) {
                onPause();
              } else {
                onAnimationStart();
              }
              return counter;
            });
          },
          y: 0,
          ...commonFields,
        }
      );
  };

  const onStart = () => {
    setIsActive(true);
    setIsPlayingMusic(true);

    onAnimationStart();
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

  const onPause = () => {
    setIsPlayingMusic(false);
    setIsActive(false);
  };

  const audioControl = document.getElementById('background-music');

  return (
    <div className="h-full flex items-center overflow-hidden justify-center">
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
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.6)), url(${mainImg})`,

            backgroundSize: 'cover',
            height: isImmersiveMode ? '100vh' : `90vh`,
          }}
          className={`${
            isImmersiveMode ? '' : 'rounded-2xl'
          } p-10 bg-center duration-500 transition-all bg-no-repeat overflow-hidden relative`}>
          <div id="overlay" className=" bg-black absolute inset-0 bg-opacity-30" />
          {/* Text area */}
          <div className="">
            <h1 className="z-20 text-white text-6xl font-bold tracking-wider drop-shadow-xl filter">
              Square
              <br /> Breathing
            </h1>
          </div>

          {/* Action area */}
          <div className="absolute bottom-5 inset-x-0 flex items-center flex-col justify-center w-auto z-20">
            <AnimatedSquare currentHelpingInfo={currentHelpingInfo} isActive={isActive} />

            <Count counter={counter} />
            <StartButton
              isActive={isActive}
              onStart={onStart}
              isPlaying={isPlayingMusic}
              isImmersiveMode={isImmersiveMode}
              liked={liked}
              onPause={onPause}
              setIsPlayingMusic={setIsPlayingMusic}
              setLiked={setLiked}
              setIsImmersiveMode={setIsImmersiveMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
