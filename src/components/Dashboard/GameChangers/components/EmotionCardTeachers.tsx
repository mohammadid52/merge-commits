import React, {useEffect, useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';

const EmotionCard = ({inLesson}: {inLesson: boolean}) => {
  // For Mobile

  const {
    goBackCallback,
    setSelectedCard,
    secondaryEmotion,
    setSecondaryEmotion,
    primaryEmotion,
    setPrimaryEmotion,
  } = useGameChangers();
  const [changesSaved, setChangesSaved] = useState(false);

  const checkChanges = (changes: boolean) => {};

  goBackCallback.current = () => {
    setSecondaryEmotion('');
    setPrimaryEmotion('');
    if (primaryEmotion && !secondaryEmotion) {
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

  return <BubbleVersion />;
};

export default EmotionCard;
