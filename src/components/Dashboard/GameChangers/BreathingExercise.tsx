import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import React, {useState} from 'react';
import {BsFillHeartFill, BsFullscreen, BsHeart} from 'react-icons/bs';

const mainImg =
  'https://images.unsplash.com/photo-1559544948-da38a2615cb7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80';

interface StartButtonProps {
  setIsImmersiveMode: React.Dispatch<React.SetStateAction<boolean>>;
  liked: boolean;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
}

interface HelpingTextProps {
  isImmersiveMode: boolean;
}

const StartButton = ({setIsImmersiveMode, liked, setLiked}: StartButtonProps) => {
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 transform transition-all ';
  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <div
        onClick={() => setIsImmersiveMode((prev) => !prev)}
        className={classNames(commonBtnClass, 'text-2xl text-white text-opacity-50')}>
        <BsFullscreen />
      </div>
      <div
        className={classNames(
          commonBtnClass,
          ' px-4 py-2 bg-white bg-opacity-50 rounded-lg text-white'
        )}>
        Start
      </div>
      <div
        onClick={() => setLiked(!liked)}
        className={classNames(commonBtnClass, 'text-2xl text-white text-opacity-50')}>
        {liked ? <BsFillHeartFill /> : <BsHeart />}
      </div>
    </div>
  );
};

const Count = () => {
  return <h1 className="w-auto mb-8 text-5xl font-bold text-white">0</h1>;
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

const BreathingExercise = () => {
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [liked, setLiked] = useState(false);
  return (
    <div className="h-full flex items-center overflow-hidden justify-center">
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
            // backgroundImage: `url(${mainImg})`,
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.6)), url(${mainImg})`,

            backgroundSize: 'cover',
            height: isImmersiveMode ? '100vh' : `90vh`,
          }}
          className={`${
            isImmersiveMode ? '' : 'rounded-2xl'
          } p-10 bg-center duration-500 transition-all bg-no-repeat overflow-hidden relative`}>
          <div id="overlay" className=" bg-black absolute inset-0 bg-opacity-30" />
          {/* Text area */}
          <div className="absolute top-5 z-20">
            <h1 className="z-20 text-white text-6xl font-bold tracking-wider drop-shadow-xl filter">
              Square
              <br /> Breathing
            </h1>
          </div>
          {/* Action area */}
          <div className="absolute bottom-5 inset-x-0 flex items-center flex-col justify-center w-auto z-20">
            <HelpingText isImmersiveMode={isImmersiveMode} />
            <Count />
            <StartButton
              liked={liked}
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
