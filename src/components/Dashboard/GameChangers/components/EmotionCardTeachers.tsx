import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';
import Button from './Button';

const EmotionCard = ({inLesson}: {inLesson: boolean}) => {
  // For Mobile
  const [primaryEmotion, setPrimaryEmotion] = useState('');
  const [secondaryEmotion, setSecondaryEmotion] = useState('');
  const {goBackCallback, setSelectedCard} = useGameChangers();
  const [changesSaved, setChangesSaved] = useState(false);
  const [showFinalStep, setShowFinalStep] = useState(false);

  const checkChanges = (changes: boolean) => {
    // if (!changes) {
    //   window.addEventListener('beforeunload', beforeunload);
    // } else {
    //   window.removeEventListener('beforeunload', beforeunload);
    // }
  };

  goBackCallback.current = () => {
    if (primaryEmotion) {
      setSecondaryEmotion('');
    } else {
      setSecondaryEmotion('');
      setPrimaryEmotion('');
      setSelectedCard(null);
      checkChanges(changesSaved);
    }
  };

  const beforeunload = (event: BeforeUnloadEvent) =>
    (event.returnValue = 'Please save the changes');

  useEffect(() => {
    checkChanges(changesSaved);
  }, [changesSaved]);

  const goBack = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <AnimatedContainer show={!showFinalStep}>
        {!showFinalStep && (
          <>
            <BubbleVersion
              setPrimaryEmotion={setPrimaryEmotion}
              primaryEmotion={primaryEmotion}
              secondaryEmotion={secondaryEmotion}
              setSecondaryEmotion={setSecondaryEmotion}
            />
          </>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={showFinalStep}>
        {showFinalStep && (
          <>
            <div className="p-4 px-6">
              <h1 className="text-4xl my-4  text-white font-bold text-left">
                Thanks for your input
              </h1>
            </div>
            {!inLesson && <Button width="w-full" onClick={goBack} text={'Go Back'} />}
          </>
        )}
      </AnimatedContainer>
    </>
  );
};

export default EmotionCard;
