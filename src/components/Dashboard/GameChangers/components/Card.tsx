import {
  SQUARE,
  THINK_ABOUT_IT,
  FOUR_SEVEN_EIGHT,
  EMOTIONS,
  SINGING_BOWL,
  GRATITUDE,
} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import React, {useEffect} from 'react';
import Button from './Button';

import {
  SingingBowlSvg,
  SquareSvg,
  ThinkAboutItSvg,
  FSEBreathingSvg,
  EmotionSvg,
  GratitudeSvg,
} from '@components/Dashboard/GameChangers/svg';
import useInLessonCheck from '@customHooks/checkIfInLesson';

const getSVG = (type: string) => {
  switch (type) {
    case SQUARE:
      return <SquareSvg />;
    case THINK_ABOUT_IT:
      return <ThinkAboutItSvg />;
    case FOUR_SEVEN_EIGHT:
      return <FSEBreathingSvg />;
    case EMOTIONS:
      return <EmotionSvg />;
    case SINGING_BOWL:
      return <SingingBowlSvg />;
    case GRATITUDE:
      return <GratitudeSvg />;
  }
};

const Card = ({
  card,
  onClick,
  selected,
}: {
  card?: {id: number; type: string; title: string; desc: string};
  onClick: (id: number) => void;
  selected: boolean;
}) => {
  const inLesson = useInLessonCheck();
  useEffect(() => {
    if (!inLesson) {
      $('.flickity-button').css('display', 'block');
    }
    console.log('heyya');
  }, [inLesson]);

  return (
    <div
      className={`carousel-cell box mx-6 z-100 my-12 lg:my-0  cursor-pointer  w-84  transition-all  flex flex-col items-center justify-center overflow-hidden form-button xl:max-h-156 xl:min-h-156 max-h-104 min-h-104`}>
      <div
        style={{
          background: 'rgba(21, 19, 21, .8)',
        }}
        className={`h-full inner-card transition-all rounded-xl p-8 lg:py-16  flex flex-col border-gray-900 border-2 items-center justify-center overflow-hidden `}>
        {getSVG(card.type)}

        <h1 className="lg:text-4xl text-xl my-4  text-white font-bold">{card.title}</h1>
        <p className="lg:text-base text-xs my-2 text-white font-light">{card.desc}</p>
      </div>

      <Button
        onClick={() => onClick(card.id)}
        text={`Select ${card.type !== THINK_ABOUT_IT ? 'Exercise' : ''}`}
      />
    </div>
  );
};

export default Card;
