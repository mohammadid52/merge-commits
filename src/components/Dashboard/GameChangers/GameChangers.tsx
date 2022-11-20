/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect} from 'react';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Flickity from 'react-flickity-component';

import InfoTab from 'components/Dashboard/GameChangers/components/InfoTab';
import SelectedCard from 'components/Dashboard/GameChangers/components/SelectedCard';
import BottomSection from 'components/Dashboard/GameChangers/components/BottomSection';
import Card from 'components/Dashboard/GameChangers/components/Card';
import {
  cardsList,
  FSEBreathingHowTo,
  sqaureBreathingInfoText,
  sqaureBreathingHowTo,
  FSEInfoText
} from 'components/Dashboard/GameChangers/__contstants';
import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import Counter from 'components/Dashboard/GameChangers/components/Counter';
import {useHistory, useRouteMatch} from 'react-router';
import {useQuery} from '@customHooks/urlParam';
import {isEmpty} from 'lodash';

const GameChangers = () => {
  const {
    selectedCard,
    setSelectedCard,
    initialIndex,
    setInitialIndex
  } = useGameChangers();

  const howToList =
    cardsList[selectedCard]?.type === 'square' ? sqaureBreathingHowTo : FSEBreathingHowTo;

  const infoText =
    cardsList[selectedCard]?.type === 'square' ? sqaureBreathingInfoText : FSEInfoText;

  const history = useHistory();
  const match = useRouteMatch();

  const onClick = (id: number, autoClick?: boolean) => {
    !autoClick && history.push(`${match.url}?exercise=${id}`);
    setInitialIndex(id);
    setSelectedCard(selectedCard === null ? id : null);
  };

  const params = useQuery(location.search);
  const exerciseIdFromUrl = params.get('exercise');

  let numbered = Number(exerciseIdFromUrl);

  useEffect(() => {
    if (!isEmpty(exerciseIdFromUrl)) {
      onClick(numbered, true);
    } else {
      setSelectedCard(null);
    }
  }, []);

  const animation = 'translateY';
  const duration = '1000';

  return (
    <div className="bg-black h-screen w-screen overflow-y-auto">
      {/* Info tab */}
      <InfoTab howToList={howToList} infoText={infoText} />
      {/* Info tab ends >----< */}

      <div className=" w-full flex flex-col items-center justify-center h-full">
        {/* <AnimatedContainer
          duration={duration}
          animationType={'opacity'}
          show={selectedCard === null}
          className={`${selectedCard === null ? ' w-auto flex items-center ' : ''} `}>
          {selectedCard === null && (
            <h1 className="text-white mt-12 mb-6  w-auto text-xl tracking-wide font-normal">
              <span className="font-semibold w-auto">Select</span> Game Changer
            </h1>
          )}
        </AnimatedContainer> */}

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
                friction: 0.15
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
          className=""
          show={selectedCard !== null}>
          {selectedCard !== null && (
            <div className="relative w-auto md:h-full flex items-center justify-start   md:justify-center flex-col">
              <SelectedCard
                inLesson={false}
                onClick={onClick}
                card={cardsList.find((c) => c.id === selectedCard)}
              />
              <BottomSection />
            </div>
          )}
          <Counter />
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default GameChangers;
