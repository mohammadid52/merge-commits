import AnimatedMind from '@components/Dashboard/GameChangers/components/AnimatedMind';
import AnimatedFlower from '@components/Dashboard/GameChangers/components/AnimatedFlower';
import {
  SQUARE,
  THINK_ABOUT_IT,
} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import React from 'react';

const Card = ({
  card,
  onClick,
  selected,
}: {
  card?: {id: number; type: string; title: string; desc: string};
  onClick: (id: number) => void;
  selected: boolean;
}) => {
  const circularClass = ' rounded-full border-8 border-teal-600';

  const focusIcon = (
    <div className={`${circularClass}  main_circle h-32 w-32`}>
      <div className={`${circularClass} h-28 w-28`}>
        <div className={`${circularClass} h-24 w-24`}>
          <div className={`${circularClass} h-20 w-20`}>
            <div className={`${circularClass} main_circle  h-16 w-16`}></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`carousel-cell box mx-6 z-100  cursor-pointer  h-156 w-84  transition-all  flex flex-col items-center justify-center overflow-hidden form-button`}>
      <div
        style={{
          background: 'rgba(21, 19, 21, .8)',
        }}
        className={`h-full inner-card transition-all rounded-xl p-16  flex flex-col border-gray-900 border-2 items-center justify-center overflow-hidden `}>
        {card.type === SQUARE ? (
          focusIcon
        ) : card.type === THINK_ABOUT_IT ? (
          <AnimatedMind />
        ) : (
          <AnimatedFlower />
        )}
        <h1 className="text-4xl my-4  text-white font-bold">{card.title}</h1>
        <p className="text-base my-2 text-white font-light">{card.desc}</p>
      </div>

      <button
        onClick={() => onClick(card.id)}
        className=" bg-teal-600 hover:bg-teal-700 transition-all w-84  p-2 text-white mt-8 rounded-md px-4">
        Select {card.type !== THINK_ABOUT_IT ? 'Exercise' : ''}
      </button>
    </div>
  );
};

export default Card;
