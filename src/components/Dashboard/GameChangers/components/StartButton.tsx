import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React from 'react';

interface StartButtonProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
}

const StartButton = ({
  onStart,
  isActive,

  onPause
}: StartButtonProps) => {
  const commonBtnClass = 'w-auto cursor-pointer  transition-all ';

  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <AnimatedContainer className="w-auto" show={!isActive}>
        {!isActive && (
          <button
            // disabled={isActive}
            onClick={isActive ? onPause : onStart}
            className={classNames(
              commonBtnClass,
              // isActive ? "bg-opacity-70 pointer-events-none" : "",
              ' px-4 py-2  bg-teal-500 hover:bg-teal-600  rounded-lg text-white'
            )}>
            Start
          </button>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default StartButton;
