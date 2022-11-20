import Tooltip from 'atoms/Tooltip';
import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {useEffect} from 'react';
import {AiOutlineInfoCircle} from 'react-icons/ai';
import {BsChevronLeft} from 'react-icons/bs';
import {IoIosHelpCircleOutline} from 'react-icons/io';
import {MdOutlineMusicNote, MdOutlineMusicOff} from 'react-icons/md';
import {useHistory} from 'react-router';

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
    goBackCallback
  } = useGameChangers();

  const animation = 'translateY';
  const duration = '1000';
  const commonBtnClass =
    'w-auto cursor-pointer hover:scale-110 hover:iconoclast:text-main hover:curate:text-main transform transition-all meditation-card__btn lg:text-xl 2xl:text-xl  text-opacity-50';

  const show = selectedCard !== 2 && selectedCard !== 3 && selectedCard !== 4;
  // because 2 is thinkaboutit card

  const history = useHistory();

  return (
    <div className="">
      <AnimatedContainer
        duration={duration}
        animationType={animation}
        className="flex items-center justify-center"
        show={selectedCard === null}>
        {selectedCard === null && (
          <div className="flex items-center justify-center  md:gap-x-4   w-auto">
            <Tooltip text="Go back" placement="bottom">
              <div
                onClick={() => {
                  setCountSelected(null);
                  setSelectedCard(null);
                  setIsPlayingMusic(false);
                  setIsActive(false);
                  history.push('/dashboard/home');
                }}
                className={classNames(commonBtnClass, 'text-white')}>
                <BsChevronLeft />
              </div>
            </Tooltip>
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer
        duration={duration}
        animationType={animation}
        className="flex items-center justify-center"
        show={selectedCard !== null && !isCompleted}>
        {selectedCard !== null && !isCompleted && (
          <div className=" flex items-center justify-center md:gap-x-4   w-auto">
            <Tooltip text="Go back" placement="bottom">
              <div
                onClick={() => {
                  if (goBackCallback.current) {
                    goBackCallback.current();
                  } else {
                    history.push('/dashboard/game-changers');
                    setCountSelected(null);
                    setSelectedCard(null);
                    setIsPlayingMusic(false);
                    setIsActive(false);
                  }
                }}
                className={classNames(commonBtnClass, 'text-white')}>
                <BsChevronLeft />
              </div>
            </Tooltip>
            {show && (
              <Tooltip text="Show how-to" placement="bottom">
                <div
                  onClick={() => setShowHowTo((prev) => !prev)}
                  className={classNames(
                    commonBtnClass,
                    showHowTo ? 'theme-text' : 'text-white',
                    'hidden xl:block'
                  )}>
                  <IoIosHelpCircleOutline />
                </div>
              </Tooltip>
            )}
            {show && (
              <Tooltip text="Show info" placement="bottom">
                <div
                  onClick={() => setShowInfo((prev) => !prev)}
                  className={classNames(
                    commonBtnClass,
                    showInfo ? 'theme-text' : 'text-white',
                    'hidden xl:block'
                  )}>
                  <AiOutlineInfoCircle />
                </div>
              </Tooltip>
            )}

            <AnimatedContainer className="w-auto" show={isActive && show}>
              {isActive && show && (
                <Tooltip
                  text={isPlayingMusic ? 'Turn off music' : 'Turn on music'}
                  placement="bottom">
                  <div
                    onClick={() => setIsPlayingMusic((prev) => !prev)}
                    className={classNames(
                      isPlayingMusic ? 'theme-text' : 'text-white',
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
    </div>
  );
};

export default BottomSection;
