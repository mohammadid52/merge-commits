import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import React, {useState, useEffect} from 'react';
import {BsFillHeartFill, BsFullscreen, BsHeart} from 'react-icons/bs';
import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';
import {gsap} from 'gsap';
import 'components/Dashboard/GameChangers/GameChanger.scss';
import {Linear} from 'gsap/all';
import {times} from 'lodash';

const mainImg =
  'https://images.unsplash.com/photo-1559544948-da38a2615cb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80';

interface StartButtonProps {
  setIsImmersiveMode: React.Dispatch<React.SetStateAction<boolean>>;
  liked: boolean;
  isActive: boolean;
  isPlaying: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  onStart: () => void;
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
}: StartButtonProps) => {
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 transform transition-all ';
  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <div
        onClick={() => setIsImmersiveMode((prev) => !prev)}
        className={classNames(commonBtnClass, 'text-2xl text-white text-opacity-50')}>
        <BsFullscreen />
      </div>
      <button
        disabled={isActive}
        onClick={onStart}
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
        {isPlaying ? <MdOutlineMusicOff /> : <MdOutlineMusicNote />}
      </div>
    </div>
  );
};

const Count = ({counter}: CountProps) => {
  return <h1 className="w-auto mb-8 text-5xl font-bold text-white">{counter}</h1>;
};

const HelpingText = ({isImmersiveMode}: HelpingTextProps) => {
  return (
    <div
      className={classNames(
        isImmersiveMode ? 'text-3xl' : 'text-xl',
        'mb-8 text-white italic text-left pl-10  font-semibold'
      )}>
      <h5
        className={classNames(
          isImmersiveMode ? '' : 'max-w-96',
          ' duration-500 transition-all'
        )}>
        "Begin by slowly exhaling all of your air out."
      </h5>
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

  const commonFields = {duration: 4, ease: Linear.easeNone};
  var tl = gsap.timeline();

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
              if (prevCounter < 3) {
                onAnimationStart();
              }
              return prevCounter + 1;
            });
          },
          y: 0,
          ...commonFields,
        }
      );
  };

  useEffect(() => {
    if (counter === 4) {
      setIsActive(false);
    }
  }, [counter]);

  const onStart = () => {
    if (!isActive) {
      setIsActive(true);
      setIsPlayingMusic(true);
      onAnimationStart();
      if (counter === 4) {
        setCounter(0);
      }
    }
  };

  const audioControl = document.getElementById('background-music');

  useEffect(() => {
    if (isPlayingMusic) {
      // @ts-ignore
      audioControl?.play();
    } else {
      // @ts-ignore
      audioControl?.pause();
    }
  }, [isPlayingMusic]);

  return (
    <div className="h-full flex items-center overflow-hidden justify-center">
      <audio id="background-music">
        <source
          src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
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
          isImmersiveMode ? '' : ' flex w-164 items-center justify-center mx-auto',
          'transition-all duration-500 overflow-hidden'
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
            <HelpingText isImmersiveMode={isImmersiveMode} />
            <AnimatedSquare currentHelpingInfo={currentHelpingInfo} isActive={isActive} />

            <Count counter={counter} />
            <StartButton
              isActive={isActive}
              onStart={onStart}
              isPlaying={isPlayingMusic}
              liked={liked}
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
