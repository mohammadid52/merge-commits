import Loader from '@components/Atoms/Loader';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {awsFormatDate, dateString} from '@utilities/time';
import {CreateFeelingTrackerInput, CreateSentimentTrackerInput} from 'API';
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

  const {mutate, isLoading, isError, error} = useGraphqlMutation<{
    input: CreateFeelingTrackerInput;
  }>('createFeelingTracker');

  if (isError) {
    console.error(error);
  }

  const {authId, email} = useAuth();

  const {universalLessonDetails} = useULBContext();

  const lessonId = universalLessonDetails.id || '999';
  const classId = universalLessonDetails.class || '999';

  const onSave = () => {
    try {
      const payload: CreateFeelingTrackerInput = {
        personAuthID: authId,
        personEmail: email,
        sentimentId: nanoid(24),
        id: nanoid(24),
        sentimentName: secondaryEmotion,
        sentimentType: primaryEmotion,
        time: new Date().toTimeString().split(' ')[0],
        date: awsFormatDate(dateString('-', 'WORLD')),
        classRoomID: classId,
        syllabusLessonID: lessonId,
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
