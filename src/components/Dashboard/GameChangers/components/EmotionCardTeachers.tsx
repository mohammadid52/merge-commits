import useInGC from 'customHooks/checkIfGameChanges';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';

const EmotionCard = ({}: {inLesson: boolean}) => {
  // For Mobile

  const {
    goBackCallback,
    setSelectedCard,
    setSecondaryEmotion,
    setPrimaryEmotion,
    setSelectedEmotions,
    showFinalStep,
    setShowFinalStep
  } = useGameChangers();
  const [changesSaved, setChangesSaved] = useState(false);

  const checkChanges = (changes: boolean) => {};

  const inGC = useInGC();
  const history = useHistory();

  goBackCallback.current = () => {
    history.push('/dashboard/game-changers');

    setSelectedCard(null);
    setPrimaryEmotion('');
    checkChanges(changesSaved);
    setSecondaryEmotion('');
    setSelectedEmotions([]);
    if (inGC && showFinalStep) {
      setShowFinalStep(false);
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

  return <BubbleVersion />;
};

export default EmotionCard;
