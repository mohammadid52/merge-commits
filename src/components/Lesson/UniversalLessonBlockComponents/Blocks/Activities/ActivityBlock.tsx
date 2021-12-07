import Counter from '@components/Dashboard/GameChangers/components/Counter';
import SelectedCard from '@components/Dashboard/GameChangers/components/SelectedCard';
import {useGameChangers} from '@components/Dashboard/GameChangers/context/GameChangersContext';
import {cardsList} from '@components/Dashboard/GameChangers/__contstants';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import React, {useEffect, useState} from 'react';

const ActivityBlock = ({value}: {value: any}) => {
  const {selectedCard, setSelectedCard} = useGameChangers();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialValue: string = value[0]?.value;
    if (initialValue && selectedCard === null) {
      const card = cardsList.find((card) => initialValue.includes(card.type));

      if (card !== null) {
        setSelectedCard(card?.id);
      }

      setLoading(false);
    }
  }, [value, selectedCard]);

  const onClick = (id: number) => {};

  if (loading) {
    return <div>Loading</div>;
  } else if (selectedCard === null) {
    return <div />;
  } else
    return (
      <AnimatedContainer
        duration={'1000'}
        animationType={'translateY'}
        className="h-full flex items-center justify-center flex-col"
        show={selectedCard !== null}>
        {selectedCard !== null && (
          <SelectedCard
            inLesson
            key={'5253'}
            onClick={onClick}
            card={cardsList.find((c) => c.id === selectedCard)}
          />
        )}
        <Counter />
      </AnimatedContainer>
    );
};

export default ActivityBlock;
