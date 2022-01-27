import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import React, {useState} from 'react';
import {useGameChangers} from '../context/GameChangersContext';
import BubbleVersion from './BubbleVersion';
import Button from './Button';

const EmotionCard = () => {
  // For Mobile
  const [primaryEmotion, setPrimaryEmotion] = useState('');
  const [secondaryEmotion, setSecondaryEmotion] = useState('');
  const {goBackCallback} = useGameChangers();

  console.log({primaryEmotion, secondaryEmotion});

  goBackCallback.current = () => {
    setPrimaryEmotion('');
    setSecondaryEmotion('');
  };
  return (
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
            onClick={() => {}}
            text={`Save '${secondaryEmotion} emotion'`}
          />
        )}
      </AnimatedContainer>
    </>
  );
};

export default EmotionCard;
