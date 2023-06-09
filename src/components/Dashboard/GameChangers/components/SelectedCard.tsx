/* eslint-disable react-hooks/exhaustive-deps */
import ErrorBoundary from '@components/Error/ErrorBoundary';
import {CreateGameChangerLogInput} from 'API';
import {lazy, useEffect, useState} from 'react';

const AnimatedFlower = lazy(
  () => import('dashboard/GameChangers/components/AnimatedFlower')
);
const AnimatedMind = lazy(() => import('dashboard/GameChangers/components/AnimatedMind'));
const AnimatedSquare = lazy(
  () => import('dashboard/GameChangers/components/AnimatedSquare')
);
const EmotionCardStudents = lazy(
  () => import('dashboard/GameChangers/components/EmotionCardStudents')
);
const EmotionCardTeachers = lazy(
  () => import('dashboard/GameChangers/components/EmotionCardTeachers')
);
const FocusIcon = lazy(() => import('dashboard/GameChangers/components/FocusIcon'));
const NextButton = lazy(() => import('dashboard/GameChangers/components/NextButton'));
const SingingBowl = lazy(() => import('dashboard/GameChangers/components/SingingBowl'));
const Gratitude = lazy(() => import('dashboard/GameChangers/components/Gratitude'));
const ThinkAboutItCard = lazy(
  () => import('dashboard/GameChangers/components/ThinkAboutIt')
);
const SelectedEmotionsContainer = lazy(
  () => import('dashboard/GameChangers/components/SelectedEmotionsContainer')
);

import {
  EMOTIONS,
  GRATITUDE,
  SINGING_BOWL,
  THINK_ABOUT_IT
} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import AnimatedContainer from 'components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {useGameChangers} from 'dashboard/GameChangers/context/GameChangersContext';
import {cardsList, successSound} from 'dashboard/GameChangers/__contstants';
import gsap from 'gsap';
import {Linear} from 'gsap/all';
import map from 'lodash/map';
import times from 'lodash/times';
import moment from 'moment';
import {nanoid} from 'nanoid';
import Flickity from 'react-flickity-component';
import {createGameChangerLog} from '@graphql/mutations';

// Constants

const SelectedCard = ({
  card,
  onClick,
  inLesson = false
}: {
  card?: {id: number; title: string; desc: string; type: string};
  onClick: (id: number | null, autoClick?: boolean) => void;
  inLesson?: boolean;
}) => {
  const exerciseType = card?.type;
  const {
    isActive,
    setIsActive,
    setCounter,
    counter,
    isCompleted,
    setIsCompleted,
    isPlayingMusic,
    setIsPlayingMusic,
    selectedCard = 0,
    countSelected,
    setCountSelected,
    selectedEmotions
  } = useGameChangers();

  const breathingHelpingTexts = ['inhale', 'hold', 'exhale', 'hold'];

  const tl = gsap.timeline({});
  const commonFields = {duration: 4, ease: Linear.easeNone};

  const onSquareAnimationStart = () => {
    const squareEl = $('#square');
    const width = squareEl.width();
    const height = squareEl.height();

    tl.to('#knob', {
      x: width,

      ...commonFields
    })
      .to('#knob', {
        y: height,

        ...commonFields
      })
      .to('#knob', {
        x: 0,

        ...commonFields
      })
      .to('#knob', {
        y: 0,
        ...commonFields
      });
  };

  const audioControl = document.getElementById('background-music');
  const finishSound = document.getElementById('finish-sound');

  useEffect(() => {
    if (isPlayingMusic) {
      // @ts-ignore
      audioControl?.play();
    } else {
      // @ts-ignore
      audioControl?.pause();
    }
    return () => {
      // @ts-ignore
      audioControl?.pause();
    };
  }, [audioControl, isPlayingMusic]);

  // on/off functions below

  const onStart = () => {
    setIsActive(true);
    if (exerciseType === 'square') {
      onSquareAnimationStart();
    }
  };

  const onPause = () => {
    setIsActive(false);
    setIsPlayingMusic(false);
  };

  const clearEverything = () => {
    setCounter(1);
    setCountSelected(null);
  };

  const onComplete = () => {
    setTimeout(() => {
      onPause();
      setIsCompleted(true);
      clearEverything();
      if (isPlayingMusic) {
        // @ts-ignore
        finishSound.play();
      }
    }, 700);
  };

  const [currentIteration, setCurrentIteration] = useState(0);

  useEffect(() => {
    if (isActive && exerciseType === 'square') {
      const interval = setInterval(() => {
        setCurrentIteration(currentIteration + 1);
      }, 4000);

      if (currentIteration === breathingHelpingTexts.length) {
        clearInterval(interval);
        if (countSelected === counter) {
          onComplete();
        } else {
          onStart();
          setCounter((prev) => prev + 1);
          setCurrentIteration(0);
        }
      }

      return () => {
        clearInterval(interval);
      };
    }
    return () => {};
  }, [isActive, currentIteration, exerciseType]);

  const selected = cardsList[selectedCard];

  const {mutate, isError, isLoading} = useGraphqlMutation(
    'createGameChangerLog',
    createGameChangerLog
  );

  const {email, authId, isStudent} = useAuth();

  const onStartClick = () => {
    const elem = $('.carousel-cell.is-selected h1').text();
    setCountSelected(Number(elem));

    if (card) {
      const payload: CreateGameChangerLogInput = {
        id: nanoid(24),
        gameChangerID: card.id.toString(),
        personAuthID: authId,
        personEmail: email,
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD')
      };
      mutate({input: payload});
      if (!isLoading && !isError) {
        setTimeout(() => {
          onStart();
        }, 2500);
      }
    }
  };

  const showSelectors = !isCompleted && (selectedCard === 0 || selectedCard === 1);

  return (
    <ErrorBoundary componentName="SelectedCard">
      <div
        className={`${inLesson ? 'border-0 border-dark  ' : ''} rounded-2xl box ${
          inLesson ? '' : 'm-8'
        } mt-8 md:mt-0 z-100  relative w-auto  2xl:m-0 transition-all  flex flex-col items-center justify-center overflow-hidden form-button`}>
        <audio id="finish-sound">
          <source src={successSound} type="audio/mp3" />
        </audio>
        <audio id="background-music">
          <source
            src="https://selready.s3.us-east-2.amazonaws.com/meditation.mp3"
            type="audio/mp3"
          />
        </audio>
        <div
          className={`h-full  transition-all rounded-xl  ${
            selected?.type === EMOTIONS ? '' : 'p-4 md:p-16 md:px-14 px-8'
          } game-changer-card flex flex-col bg-darkest   md:border-2 items-center justify-center overflow-hidden `}>
          <div>
            <AnimatedContainer show={selected && selected?.type === THINK_ABOUT_IT}>
              {selected && selected?.type === THINK_ABOUT_IT && <ThinkAboutItCard />}
            </AnimatedContainer>
            <AnimatedContainer show={selected && selected?.type === EMOTIONS}>
              {selected &&
                selected?.type === EMOTIONS &&
                (isStudent ? (
                  <EmotionCardStudents inLesson={inLesson} />
                ) : (
                  <EmotionCardTeachers inLesson={inLesson} />
                ))}
            </AnimatedContainer>

            <AnimatedContainer show={selected && selected?.type === GRATITUDE}>
              {selected?.type === GRATITUDE && <Gratitude />}
            </AnimatedContainer>

            <AnimatedContainer show={selected && selected?.type === SINGING_BOWL}>
              {selected?.type === SINGING_BOWL && <SingingBowl />}
            </AnimatedContainer>

            {/* Count Selection Section */}
            <AnimatedContainer
              delay="0.5s"
              duration="1000"
              animationType="translateY"
              show={showSelectors && countSelected === null}>
              {showSelectors && countSelected === null && (
                <>
                  <h1 className="text-4xl my-4  text-white font-bold">{card?.title}</h1>
                  <div className="flex w-auto items-center justify-center">
                    {selected.type === 'square' ? (
                      <FocusIcon isActive={isActive} />
                    ) : (
                      <AnimatedFlower />
                    )}
                  </div>

                  <h1 className="text-white mb-6 text-left  w-auto text-base tracking-wide font-normal">
                    Select number of cycles
                    <br />
                    <span className="font-light text-xs w-auto">
                      (4 is recommended if you are new to this)
                    </span>
                  </h1>
                  <Flickity
                    className={'carousel overflow-x-hidden mb-4'}
                    elementType={'div'}
                    options={{
                      initialIndex: 3,
                      pageDots: false,
                      selectedAttraction: 0.03,
                      friction: 0.15
                    }}
                    reloadOnUpdate
                    disableImagesLoaded={false}>
                    {times(10, (t) => (
                      <div className="w-auto counter carousel-cell">
                        <h1 className="inner-card hide-bg w-auto mx-4 text-white text-xl font-semibold">
                          {t + 1}
                        </h1>
                      </div>
                    ))}
                  </Flickity>

                  <NextButton onClick={onStartClick} countSelected={countSelected} />
                </>
              )}
            </AnimatedContainer>

            {/* Main Exercise Section */}

            <AnimatedContainer
              delay="0.5s"
              duration="1000"
              animationType="translateY"
              show={showSelectors && countSelected !== null}>
              {showSelectors && countSelected !== null && (
                <>
                  <h1 className="text-4xl my-4  text-white font-bold">{card?.title}</h1>
                  <AnimatedSquare
                    onStart={onStart}
                    isActive={isActive}
                    exerciseType={exerciseType || 'square'}
                    onComplete={onComplete}
                  />

                  {/* <StartButton isActive={isActive} onStart={onStart} onPause={onPause} /> */}

                  {exerciseType === 'square' && isActive && (
                    <ul className="mt-8 fse-text-helper-list  flex items-center justify-center">
                      {map(breathingHelpingTexts, (item, i) => (
                        <li
                          key={item}
                          className={`${
                            i === currentIteration ? 'showing' : 'hide'
                          } text-xl text-center w-auto text-lightest font-light`}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </AnimatedContainer>

            {/* ON Complete Section */}
            <AnimatedContainer
              duration="1000"
              delay="0.5s"
              animationType="translateY"
              show={isCompleted}
              className="flex items-start flex-col ">
              {isCompleted && (
                <>
                  {selected.type === 'square' ? (
                    <FocusIcon isActive={isActive} />
                  ) : card && card.type === THINK_ABOUT_IT ? (
                    <AnimatedMind />
                  ) : (
                    <AnimatedFlower />
                  )}

                  <h1 className="text-4xl my-4  text-white font-bold text-left">
                    Well done.
                  </h1>
                  <p className="text-base my-4  text-lightest  font-light max-w-72 transition-all text-left">
                    You have completed this activity.
                    <br /> Come back anytime when you want to feel more focused and
                    centered during your day.
                  </p>
                  <button
                    onClick={() => {
                      onClick(null);
                      setTimeout(() => {
                        setIsCompleted(false);
                      }, 300);
                    }}
                    className=" bg-teal-600 hover:bg-teal-700 transition-all w-84  p-2 text-white mt-8 rounded-md px-4">
                    Complete
                  </button>
                </>
              )}
            </AnimatedContainer>
          </div>
        </div>
      </div>
      {selectedCard === 3 && selectedEmotions && selectedEmotions?.length > 0 && (
        <SelectedEmotionsContainer />
      )}
    </ErrorBoundary>
  );
};

export default SelectedCard;
