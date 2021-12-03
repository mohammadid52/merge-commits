import Tooltip from '@components/Atoms/Tooltip';
import {useGameChangers} from '@components/Dashboard/GameChangers/context/GameChangersContext';
import {classNames} from '@components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React from 'react';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import {BsChevronLeft} from 'react-icons/bs';
import {IoIosHelpCircleOutline} from 'react-icons/io';
import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';

const BottomSection = () => {
  const {
    selectedCard,
    setSelectedCard,
    showHowTo,
    showInfo,
    setShowHowTo,
    setShowInfo,
    isPlayingMusic,
    setIsPlayingMusic,
    isActive,
    isCompleted,
    setCountSelected,
    setIsActive,
  } = useGameChangers();
  const animation = 'translateY';
  const duration = '1000';
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 hover:text-teal-500 transform transition-all meditation-card__btn lg:text-xl 2xl:text-xl  text-opacity-50';

  return (
    <AnimatedContainer
      duration={duration}
      animationType={animation}
      className="flex items-center justify-center"
      show={selectedCard !== null && !isCompleted}>
      {selectedCard !== null && !isCompleted && (
        <div className="absolute flex items-center justify-center gap-x-4 bottom-5  w-auto">
          <Tooltip text="Go back" placement="top">
            <div
              onClick={() => {
                setCountSelected(null);
                setSelectedCard(null);
                setIsPlayingMusic(false);
                setIsActive(false);
              }}
              className={classNames(
                commonBtnClass,
                showHowTo ? 'text-teal-500' : 'text-white'
              )}>
              <BsChevronLeft />
            </div>
          </Tooltip>
          <Tooltip text="Show how-to" placement="top">
            <div
              onClick={() => setShowHowTo((prev) => !prev)}
              className={classNames(
                commonBtnClass,
                showHowTo ? 'text-teal-500' : 'text-white',
                'hidden xl:block'
              )}>
              <IoIosHelpCircleOutline />
            </div>
          </Tooltip>
          <Tooltip text="Show info" placement="top">
            <div
              onClick={() => setShowInfo((prev) => !prev)}
              className={classNames(
                commonBtnClass,
                showInfo ? 'text-teal-500' : 'text-white',
                'hidden xl:block'
              )}>
              <AiOutlineInfoCircle />
            </div>
          </Tooltip>

          <AnimatedContainer className="w-auto" show={isActive}>
            {isActive && (
              <Tooltip
                text={isPlayingMusic ? 'Turn off music' : 'Turn on music'}
                placement="top">
                <div
                  onClick={() => setIsPlayingMusic((prev) => !prev)}
                  className={classNames(
                    isPlayingMusic ? 'text-teal-500' : 'text-white',
                    commonBtnClass
                  )}>
                  {isPlayingMusic ? <MdOutlineMusicOff /> : <MdOutlineMusicNote />}
                </div>
              </Tooltip>
            )}
          </AnimatedContainer>
        </div>
      )}
    </AnimatedContainer>
  );
};

export default BottomSection;
