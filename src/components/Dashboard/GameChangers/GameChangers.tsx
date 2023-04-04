/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useEffect} from 'react';
import Flickity from 'react-flickity-component';

import ErrorBoundary from '@components/Error/ErrorBoundary';
import {useQuery} from '@customHooks/urlParam';
import useAuth from '@customHooks/useAuth';
import {updatePageState} from 'graphql-functions/functions';
import {UserPageState} from 'API';
import BottomSection from 'components/Dashboard/GameChangers/components/BottomSection';
import Card from 'components/Dashboard/GameChangers/components/Card';
import Counter from 'components/Dashboard/GameChangers/components/Counter';
import SelectedCard from 'components/Dashboard/GameChangers/components/SelectedCard';
import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import {cardsList} from 'components/Dashboard/GameChangers/__contstants';
import {isEmpty} from 'lodash';
import {useHistory, useRouteMatch} from 'react-router';

const GameChangers = () => {
  const {selectedCard, setSelectedCard, initialIndex, setInitialIndex} =
    useGameChangers();

  const history = useHistory();
  const match = useRouteMatch();

  const onClick = (id: number, autoClick?: boolean) => {
    !autoClick && history.push(`${match.url}?exercise=${id}`);
    setInitialIndex(id);
    setSelectedCard(selectedCard === null ? id : null);
  };

  const {authId, pageState, email, isStudent} = useAuth();

  useEffect(() => {
    if (isStudent) {
      updatePageState(UserPageState.GAME_CHANGERS, {
        authId,
        email,
        pageState
      });
    }
  }, [isStudent]);

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
    <ErrorBoundary componentName="GameChangers">
      <div className="bg-black h-screen w-screen overflow-y-auto">
        {/* Info tab */}
        {/* <InfoTab howToList={howToList} infoText={infoText} /> */}
        {/* Info tab ends >----< */}

        <div className=" w-full flex flex-col items-center justify-center h-full">
          <AnimatedContainer
            duration={'700'}
            animationType={'scale'}
            className="w-full"
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
            className="w-full"
            show={selectedCard !== null}>
            {selectedCard !== null && (
              <div className="relative w-auto md:h-full flex items-center justify-start   md:justify-center flex-col">
                <SelectedCard
                  inLesson={false}
                  // @ts-ignore
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
    </ErrorBoundary>
  );
};

export default GameChangers;
