import Buttons from '@components/Atoms/Buttons';
import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React from 'react';

interface NextButtonProps {
  onClick: () => void;
  countSelected: number;
}

const NextButton = ({onClick, countSelected}: NextButtonProps) => {
  const commonBtnClass = 'w-auto cursor-pointer  transition-all ';

  return (
    <div className={'flex items-center gap-x-6 justify-center'}>
      <AnimatedContainer className="w-auto" show={countSelected === null}>
        {countSelected === null && (
          <Buttons
            // disabled={isActive}
            onClick={onClick}
            // className={classNames(
            //   commonBtnClass,
            //   // isActive ? "bg-opacity-70 pointer-events-none" : "",
            //   ' px-4 py-2  bg-teal-500 hover:bg-teal-600  rounded-lg text-white'
            // )}
            label="Start"
          />
        )}
      </AnimatedContainer>
    </div>
  );
};

export default NextButton;
