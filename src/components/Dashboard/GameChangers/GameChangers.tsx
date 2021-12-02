/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect} from 'react';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Flickity from 'react-flickity-component';
import '@components/Dashboard/GameChangers/styles/Flickity.scss';
import '@components/Dashboard/GameChangers/styles/GameChanger.scss';
import InfoTab from '@components/Dashboard/GameChangers/components/InfoTab';
import SelectedCard from '@components/Dashboard/GameChangers/components/SelectedCard';
import BottomSection from '@components/Dashboard/GameChangers/components/BottomSection';
import Card from '@components/Dashboard/GameChangers/components/Card';
import {
  cardsList,
  FSEBreathingHowTo,
  sqaureBreathingInfoText,
  sqaureBreathingHowTo,
  FSEInfoText,
  openFullscreen,
  closeFullscreen,
} from '@components/Dashboard/GameChangers/__contstants';
import {useGameChangers} from '@components/Dashboard/GameChangers/context/GameChangersContext';

const GameChangers = () => {
  const {
    selectedCard,
    setSelectedCard,
    initialIndex,
    setInitialIndex,
  } = useGameChangers();

  const howToList =
    cardsList[selectedCard]?.type === 'square' ? sqaureBreathingHowTo : FSEBreathingHowTo;

  const infoText =
    cardsList[selectedCard]?.type === 'square' ? sqaureBreathingInfoText : FSEInfoText;

  const onClick = (id: number) => {
    turnOnImmersiveMode();

    setInitialIndex(id);
    setSelectedCard(selectedCard === null ? id : null);
  };

  const animation = 'translateY';
  const duration = '1000';

  const turnOnImmersiveMode = () => {
    $('#top-menu').hide();
    // openFullscreen();
  };
  const turnOffImmersiveMode = () => {
    // closeFullscreen();
    $('#top-menu').show();
  };

  useEffect(() => {
    turnOnImmersiveMode();
    return () => {
      turnOffImmersiveMode();
    };
  }, []);

  return (
    <div className="bg-black h-screen w-screen overflow-y-hidden">
      {/* Info tab */}
      <InfoTab howToList={howToList} infoText={infoText} />
      {/* Info tab ends >----< */}

      <div className="h-full w-full flex flex-col items-center justify-center">
        <AnimatedContainer
          duration={duration}
          animationType={'opacity'}
          show={selectedCard === null}
          className={`${
            selectedCard === null ? 'h-full w-auto flex items-center ' : ''
          } `}>
          {selectedCard === null && (
            <h1 className="text-white mb-12  w-auto text-xl tracking-wide font-normal">
              <span className="font-semibold w-auto">Select</span> breathing exercise
            </h1>
          )}
        </AnimatedContainer>

        <AnimatedContainer
          duration={'700'}
          animationType={'scale'}
          show={selectedCard === null}>
          {selectedCard === null && (
            <Flickity
              className={'carousel'}
              elementType={'div'}
              options={{
                initialIndex: initialIndex,
                pageDots: false,
                selectedAttraction: 0.03,
                friction: 0.15,
              }}
              disableImagesLoaded={false}>
              {cardsList.map((card) => (
                <Card
                  key={card.id}
                  selected={selectedCard === card.id}
                  onClick={onClick}
                  card={card}
                />
              ))}
            </Flickity>
          )}
        </AnimatedContainer>
        <AnimatedContainer
          duration={duration}
          animationType={animation}
          className="h-full flex items-center justify-center"
          show={selectedCard !== null}>
          {selectedCard !== null && (
            <SelectedCard
              onClick={onClick}
              card={cardsList.find((c) => c.id === selectedCard)}
            />
          )}
        </AnimatedContainer>

        <BottomSection />
      </div>
    </div>
  );
};

export default GameChangers;
