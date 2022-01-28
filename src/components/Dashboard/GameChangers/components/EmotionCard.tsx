import Loader from '@components/Atoms/Loader';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {CreateSentimentsInput} from 'API';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';
import Button from './Button';

const EmotionCard = () => {
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

  const {mutate, isLoading} = useGraphqlMutation<{input: CreateSentimentsInput}>(
    'createSentiments'
  );

  const onSave = () => {
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
    } finally {
      setChangesSaved(true);
    }
  };

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
          <>
            <div className="p-4 px-6">
              <h1 className="text-4xl my-4  text-white font-bold text-left">
                Thanks for your input
              </h1>
            </div>
            <Button width="w-full" onClick={goBack} text={'Go Back'} />
          </>
        )}
      </AnimatedContainer>
    </>
  );
};

export default EmotionCard;
