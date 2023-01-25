import {TranslationInsideComponent} from '@components/Lesson/UniversalLesson/views/CoreUniversalLesson/TranslationModule';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {useState} from 'react';
import {AiOutlineBook} from 'react-icons/ai';

const FloatingActionTranslation = () => {
  const [isActive, setIsActive] = useState(false);

  const [contentHeight, setContentHeight] = useState(0);
  const [finalSearchResult, setFinalSearchResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    // <ClickAwayListener onClickAway={() => setIsActive(false)}>
    <div
      onClick={() => !isActive && setIsActive(!isActive)}
      title={isActive ? '' : 'Search meaning'}
      className="theme-bg floating-item  relative p-2 customShadow rounded-full  border-white border-2 hover:theme-bg:500 transition-all cursor-pointer ">
      <div className="text-lg text-white w-auto">
        <AiOutlineBook />
      </div>
      <AnimatedContainer animationType="sliderInvert" duration="700" show={isActive}>
        {isActive && (
          <div
            style={{
              left: '-25rem',
              minHeight: loading
                ? '170px'
                : isActive && finalSearchResult
                ? `${150 + contentHeight}px`
                : isActive && !finalSearchResult
                ? '150px'
                : 'unset'
            }}
            className="bg-gray-200 transition-all cursor-default  z-100 top-0 absolute border-2 border-white theme-card-shadow min-w-96 rounded-xl">
            <TranslationInsideComponent
              setContentHeight={setContentHeight}
              inClassroom
              finalSearchResult={finalSearchResult}
              setLoading={setLoading}
              loading={loading}
              setFinalSearchResult={setFinalSearchResult}
              setActive={setIsActive}
            />
          </div>
        )}
      </AnimatedContainer>
    </div>
    // </ClickAwayListener>
  );
};

export default FloatingActionTranslation;
