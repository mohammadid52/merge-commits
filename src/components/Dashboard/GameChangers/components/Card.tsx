import {
  EMOTIONS,
  FOUR_SEVEN_EIGHT,
  GRATITUDE,
  SINGING_BOWL,
  SQUARE,
  THINK_ABOUT_IT
} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useEffect} from 'react';

import Buttons from '@components/Atoms/Buttons';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import {
  EmotionSvg,
  FSEBreathingSvg,
  GratitudeSvg,
  SingingBowlSvg,
  SquareSvg,
  ThinkAboutItSvg
} from 'components/Dashboard/GameChangers/svg';
import useInLessonCheck from 'customHooks/checkIfInLesson';

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
    default:
      return <SquareSvg />;
  }
};

const Card = ({
  card,
  onClick
}: {
  card?: {id: number; type: string; title: string; desc: string};
  onClick: (id: number, autoClick?: boolean) => void;
  selected: boolean;
}) => {
  const inLesson = useInLessonCheck();
  useEffect(() => {
    if (!inLesson) {
      $('.flickity-button').css('display', 'block');
    }
  }, [inLesson]);

  return (
    <ErrorBoundary componentName="Card">
      <div
        className={`carousel-cell box mx-6 z-100 my-12 lg:my-0 gap-y-4 cursor-pointer  w-84  transition-all  flex flex-col items-center justify-center overflow-hidden form-button xl:max-h-156 xl:min-h-156 max-h-104 min-h-104`}>
        <div
          className={`h-full mb-4 inner-card transition-all rounded-xl p-8 lg:py-16  flex flex-col border-darkest   border-2 items-center justify-center overflow-hidden `}>
          {card && getSVG(card.type)}

          <h1 className="lg:text-4xl text-xl my-4  text-white font-bold">
            {card?.title || ''}
          </h1>
          <p className="lg:text-base text-xs my-2 text-white font-light">
            {card?.desc || ''}
          </p>
        </div>

        <Buttons
          onClick={() => card && onClick(card.id)}
          label={`Select ${card && card.type !== THINK_ABOUT_IT ? 'Exercise' : ''}`}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Card;
