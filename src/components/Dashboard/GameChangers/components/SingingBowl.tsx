import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import {awsFormatDate, dateString} from 'utilities/time';
import {CreateGameChangerLogInput, GameChangerLog} from 'API';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import Button from './Button';
import Buttons from '@components/Atoms/Buttons';
import {SingingBowlSvg} from '../svg';

const BowlSvg = ({animate}: {animate: boolean}) => {
  const colorList = [
    '#FAFAD2',
    '##EEE8AA',
    '#F0E68C',
    '#DAA520',
    '#FFD700',
    '#FFA500',
    '#FF8C00',
    '#CD853F',
    '#D2691E',
    '#8B4513'
  ];

  const [color, setColor] = useState(null);

  useEffect(() => {
    let interval: any = null;
    if (animate) {
      let idx = 0;
      interval = setInterval(() => {
        if (colorList.length - 1 >= idx) {
          setColor(colorList[idx]);
          idx = idx + 1;
        } else {
          idx = 0;
        }
      }, 1000);
    } else {
      clearInterval(interval);
      setColor(colorList[0]);
    }

    return () => {
      clearInterval(interval);
    };
  }, [animate]);

  return <SingingBowlSvg />;
};

const SingingBowl = () => {
  const audioControl = document.getElementById('singing-meditation');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
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
  }, [isPlaying]);

  const mutationLog = useGraphqlMutation<
    {input: CreateGameChangerLogInput},
    GameChangerLog
  >('createGameChangerLog');
  const {email, authId} = useAuth();

  const start = () => {
    const gameChangerID = nanoid(24);
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      mutationLog.mutate({
        input: {
          id: nanoid(24),
          gameChangerID,
          personAuthID: authId,
          personEmail: email,
          startTime: awsFormatDate(dateString('-', 'WORLD'))
        }
      });
    }
  };

  return (
    <div>
      <audio id="singing-meditation">
        <source
          src="https://iconoclaststorage143306-dev.s3.amazonaws.com/public/528_Hz_Singing_bowl_sound_meditation_with_an_antique_Himalayan_Mani_bowl_33_minutes-AudioTrimmer.com.mp3"
          type="audio/mp3"
        />
      </audio>
      <BowlSvg animate={isPlaying} />

      <Buttons
        btnClass="w-full"
        onClick={start}
        label={isPlaying ? 'Stop Meditation' : 'Start Meditation'}
      />
    </div>
  );
};

export default SingingBowl;
