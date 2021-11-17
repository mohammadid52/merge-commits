import useOnScreen from '@customHooks/useOnScreen';
import React from 'react';
import 'components/Dashboard/GameChangers/GameChanger.scss';
import {HiOutlineArrowRight} from 'react-icons/hi';

const Card = ({card}: {card: {id: number; title: string; color: string}}) => {
  const cardRef = React.useRef();
  const onScreen = useOnScreen(cardRef);
  return (
    <div
      ref={cardRef}
      id={`card_${card.id}`}
      className={`${onScreen ? 'game-changer__card' : ''} cursor-pointer p-16 h-96 bg-${
        card.color
      }-500 overflow-hidden form-button`}>
      <div className="flex items-center justify-between">
        <h3 className="text-4xl text-white group font-semibold">{card?.title}</h3>
        <div className="w-auto">
          <HiOutlineArrowRight
            className={`arrow-icon w-auto text-3xl font-medium text-${card.color}-800`}
          />
        </div>
      </div>
      <img src={'/yoga.svg'} className="h-60 float-right scaleImage w-auto" />
    </div>
  );
};

const GameChangers = () => {
  const cards = [
    {id: 1, title: 'Breathing', color: 'purple'},
    {id: 2, title: 'Awareness', color: 'yellow'},
    {id: 3, title: 'Breathing', color: 'pink'},
    {id: 4, title: 'Awareness', color: 'teal'},
    {id: 5, title: 'Breathing', color: 'blue'},
    {id: 6, title: 'Awareness', color: 'red'},
  ];

  return (
    <div className="bg-white">
      <div className="h-56 flex items-center justify-center">
        <h1 className="text-center text-5xl font-semibold">Activities</h1>
      </div>
      <div className="cards_container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card card={card} />
        ))}
      </div>
    </div>
  );
};

export default GameChangers;
