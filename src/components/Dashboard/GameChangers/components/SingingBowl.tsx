import useAuth from '@customHooks/useAuth';
import useGraphqlMutation from '@customHooks/useGraphqlMutation';
import {awsFormatDate, dateString} from '@utilities/time';
import {CreateGameChangerLogInput} from 'API';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import Button from './Button';

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
    '#8B4513',
  ];

  const [color, setColor] = useState(null);

  useEffect(() => {
    if (animate) {
      let idx = 0;
      setInterval(() => {
        if (colorList.length - 1 >= idx) {
          setColor(colorList[idx]);
          idx = idx + 1;
        } else {
          idx = 0;
        }
      }, 1000);
    }
  }, [animate]);

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 127.614 127.614"
      xmlSpace="preserve">
      <g>
        <path
          style={{fill: '#e7ede0'}}
          d="M126.461,40.356c0.367-0.835,0.753-1.707,1.152-2.604C127.128,38.119,126.741,39.228,126.461,40.356
		z"
        />
        <path
          style={{fill: '#e7ede0'}}
          d="M127.085,43.181c0,0,0.182-1.419,0.529-2.825c-0.315,0.718-0.614,1.405-0.898,2.063
		C126.938,42.855,127.085,43.181,127.085,43.181z"
        />
        <g>
          <path
            style={{fill: '#59312E'}}
            d="M2.079,47.625c0.109,23.344,19.065,42.236,42.434,42.236h38.586
			c23.371,0,42.325-18.893,42.435-42.236H2.079z"
          />
          <path
            style={{fill: color !== null ? color : '#76423F'}}
            className="transition-all"
            d="M125.339,51.416c0.054-0.576,0.103-1.154,0.133-1.737H2.141c0.03,0.583,0.08,1.161,0.133,1.737
			H125.339z"
          />
          <path
            style={{fill: color !== null ? color : '#76423F'}}
            className="transition-all"
            d="M126.395,47.625H1.218C0.545,47.625,0,47.079,0,46.406v-0.389C0,45.346,0.545,44.8,1.218,44.8
			h125.176c0.674,0,1.219,0.545,1.219,1.218v0.389C127.614,47.079,127.068,47.625,126.395,47.625z"
          />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g>ß</g>
      <g></g>
      <g></g>
    </svg>
  );
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

  const mutationLog = useGraphqlMutation<{input: CreateGameChangerLogInput}>(
    'createGameChangerLog',
    {}
  );
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
          startTime: awsFormatDate(dateString('-', 'WORLD')),
        },
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
      <Button onClick={start} text={isPlaying ? 'Stop Meditation' : 'Start Meditation'} />
    </div>
  );
};

export default SingingBowl;
