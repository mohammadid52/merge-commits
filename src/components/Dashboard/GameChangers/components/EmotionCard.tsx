import Loader from '@components/Atoms/Loader';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {CreateSentimentsInput} from 'API';
import EventEmitter from 'events';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';
import Button from './Button';

const EmotionCard = () => {
  // For Mobile
  const [primaryEmotion, setPrimaryEmotion] = useState('');
  const [secondaryEmotion, setSecondaryEmotion] = useState('');
  const {goBackCallback} = useGameChangers();
  const [changesSaved, setChangesSaved] = useState(false);
  const [showFinalStep, setShowFinalStep] = useState(false);

  goBackCallback.current = () => {
    setPrimaryEmotion('');
    setSecondaryEmotion('');
    if (!changesSaved) {
      window.addEventListener('beforeunload', beforeunload);
    } else {
      window.removeEventListener('beforeunload', beforeunload);
    }
  };

  const beforeunload = (event: BeforeUnloadEvent) =>
    (event.returnValue = 'Please save the changes');

  // useEffect(() => {
  //   if (!changesSaved) {
  //     window.addEventListener('beforeunload', beforeunload);
  //   } else {
  //     window.removeEventListener('beforeunload', beforeunload);
  //   }
  // }, [changesSaved]);

  const {mutate, isLoading} = useGraphqlMutation<{input: CreateSentimentsInput}>(
    'createSentiments'
  );

  const onSave = () => {
    setChangesSaved(true);

    try {
      const payload: CreateSentimentsInput = {
        id: nanoid(24),
        sentimentId: `${primaryEmotion}-${secondaryEmotion}`,
        sentimentName: secondaryEmotion,
        sentimentType: primaryEmotion,
      };
      mutate({input: payload});
      setShowFinalStep(true);
    } catch (error) {
      console.error(error);
    }
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
            <AnimatedContainer show={Boolean(primaryEmotion && secondaryEmotion)}>
              {Boolean(primaryEmotion && secondaryEmotion) && (
                <Button
                  width="w-full"
                  onClick={onSave}
                  text={isLoading ? <Loader /> : `Save '${secondaryEmotion} emotion'`}
                />
              )}
            </AnimatedContainer>
          </>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={showFinalStep}>
        {showFinalStep && (
          <div className="p-4">
            <h1 className="text-4xl my-4  text-white font-bold text-left">
              Thanks for your input
            </h1>
          </div>
        )}
      </AnimatedContainer>
    </>
  );
};

export default EmotionCard;
