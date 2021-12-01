/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {useEffect} from 'react';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

import {useState} from 'react';
import Flickity from 'react-flickity-component';
import '@components/Dashboard/GameChangers/styles/Flickity.scss';
import '@components/Dashboard/GameChangers/styles/GameChanger.scss';
import InfoTab from '@components/Dashboard/GameChangers/components/InfoTab';
import SelectedCard from '@components/Dashboard/GameChangers/components/SelectedCard';
import BottomSection from '@components/Dashboard/GameChangers/components/BottomSection';
import Card from '@components/Dashboard/GameChangers/components/Card';

const elem = document.documentElement;

/* View in fullscreen */
function openFullscreen(): void {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    // @ts-ignore
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    // @ts-ignore
    elem.webkitRequestFullscreen();
    // @ts-ignore
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    // @ts-ignore
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    /* IE11 */
    // @ts-ignore
    document.msExitFullscreen();
  }
}

const cardsList = [
  {
    id: 1,
    type: 'square',
    title: 'Square Breathing',
    desc:
      'Ideal for a calm down breathe session at the beginning or at the end of the day to relax and clear your mind.',
  },
  {
    id: 2,
    type: '478',
    title: '478 Breathing',
    desc:
      'With this exercise, you’ll get your desired focus back so you can be even more productive.',
  },
  {
    id: 3,
    type: 'square',
    title: 'Classic',
    desc:
      'Select this exercise for a classic breathing exercise. Ideal when you need some extra headspace.',
  },
];

const FSEBreathingHowTo = [
  'First, let your lips part. Make a whooshing sound, exhaling completely through your mouth.',
  'Next, close your lips, inhaling silently through your nose as you count to four in your head.',
  'Then, for seven seconds, hold your breath.',
  'Make another whooshing exhale from your mouth for eight seconds.',
];

const FSEInfoText = `The 4-7-8 breathing technique is a breathing pattern developed by Dr. Andrew Weil. It’s based on an ancient yogic technique called pranayama, which helps practitioners gain control over their breathing.
When practiced regularly, it’s possible that this technique could help some people fall asleep in a shorter period of time.`;

const sqaureBreathingHowTo = [
  'Begin by slowly exhaling all of your air out',
  'Then, gently inhale through your nose to a slow count of 4',
  'Hold at the top of the breath for a count of 4',
  'Then gently exhale through your mouth for a count of 4',
  'At the bottom of the breath, pause and hold for the count of 4',
];

const sqaureBreathingInfoText = `Square breathing is a type of breathwork that can shift your energy, connect you
more deeply with your body, calm your nervous system, and reduce the stress in
your body. It is also referred to as box breathing, 4×4 breathing, and 4-part
breath. Here are instructions for square breathing and some ideas for when to
practice the technique. We’ll also share tips for making the breathwork as
effective as possible.`;

const GameChangers = () => {
  const [selected, setSelected] = useState(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const howToList =
    cardsList[selected]?.type === 'square' ? sqaureBreathingHowTo : FSEBreathingHowTo;

  const infoText =
    cardsList[selected]?.type === 'square' ? sqaureBreathingInfoText : FSEInfoText;

  const onClick = (id: number) => {
    setSelected(selected === null ? id : null);
  };

  const animation = 'translateY';
  const duration = '1000';

  const turnOnImmersiveMode = () => {
    $('#top-menu').hide();
    openFullscreen();
  };
  const turnOffImmersiveMode = () => {
    closeFullscreen();
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
      <InfoTab
        howToList={howToList}
        infoText={infoText}
        showInfo={showInfo}
        showHowTo={showHowTo}
      />
      {/* Info tab ends >----< */}

      <div className="h-full w-full flex flex-col items-center justify-center">
        <AnimatedContainer
          duration={duration}
          animationType={'opacity'}
          show={selected === null}
          className={`${selected === null ? 'h-full w-auto flex items-center ' : ''} `}>
          {selected === null && (
            <h1 className="text-white mb-12  w-auto text-xl tracking-wide font-normal">
              <span className="font-semibold w-auto">Select</span> breathing exercise
            </h1>
          )}
        </AnimatedContainer>

        <AnimatedContainer
          duration={'700'}
          animationType={'scale'}
          show={selected === null}>
          {selected === null && (
            <Flickity
              className={'carousel'}
              elementType={'div'}
              options={{
                initialIndex: 1,
                pageDots: false,
                selectedAttraction: 0.03,
                friction: 0.15,
              }}
              disableImagesLoaded={false}>
              {cardsList.map((card) => (
                <Card
                  key={card.id}
                  selected={selected === card.id}
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
          show={selected !== null}>
          {selected !== null && (
            <SelectedCard
              isPlayingMusic={isPlayingMusic}
              setIsPlayingMusic={setIsPlayingMusic}
              onClick={onClick}
              card={cardsList.find((c) => c.id === selected)}
            />
          )}
        </AnimatedContainer>

        <BottomSection
          selected={selected}
          showHowTo={showHowTo}
          setIsPlayingMusic={setIsPlayingMusic}
          showInfo={showInfo}
          isPlayingMusic={isPlayingMusic}
          setShowHowTo={setShowHowTo}
          setShowInfo={setShowInfo}
        />
      </div>
    </div>
  );
};

export default GameChangers;
