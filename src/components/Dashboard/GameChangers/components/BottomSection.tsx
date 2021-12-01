import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React from 'react';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import {IoIosHelpCircleOutline} from 'react-icons/io';
import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';

const BottomSection = ({
  selected,
  setShowHowTo,
  showHowTo,
  setShowInfo,

  isPlayingMusic,
  setIsPlayingMusic,
  showInfo,
}: {
  selected: number | null;
  setShowHowTo: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayingMusic: React.Dispatch<React.SetStateAction<boolean>>;
  isPlayingMusic: boolean;
  showHowTo: boolean;
  showInfo: boolean;
}) => {
  const animation = 'translateY';
  const duration = '1000';
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 transform transition-all ';
  return (
    <AnimatedContainer
      duration={duration}
      animationType={animation}
      className="flex items-center justify-center"
      show={selected !== null}>
      {selected !== null && (
        <div className="absolute flex items-center justify-center gap-x-4 bottom-5  w-auto">
          <div
            onClick={() => setShowHowTo((prev) => !prev)}
            className={classNames(
              commonBtnClass,
              showHowTo ? 'text-teal-500' : 'text-white',
              'meditation-card__btn text-2xl hidden xl:block  text-opacity-80'
            )}>
            <IoIosHelpCircleOutline />
          </div>
          <div
            onClick={() => setShowInfo((prev) => !prev)}
            className={classNames(
              commonBtnClass,
              showInfo ? 'text-teal-500' : 'text-white',
              'meditation-card__btn text-2xl hidden xl:block text-white text-opacity-80'
            )}>
            <AiOutlineInfoCircle />
          </div>
          <div
            onClick={() => setIsPlayingMusic((prev) => !prev)}
            className={classNames(
              isPlayingMusic ? 'text-teal-500' : 'text-white',
              commonBtnClass,
              'meditation-card__btn text-2xl text-opacity-80'
            )}>
            {isPlayingMusic ? <MdOutlineMusicOff /> : <MdOutlineMusicNote />}
          </div>
        </div>
      )}
    </AnimatedContainer>
  );
};

export default BottomSection;
