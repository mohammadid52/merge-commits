/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import {map} from 'lodash';
import {useEffect, useState} from 'react';
import FocusIcon from '@components/Dashboard/GameChangers/components/FocusIcon';

const t = [
  'Breathe In',
  '1',
  '2',
  '3',
  '4',
  'Hold',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  'Breathe Out',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
];

const AnimatedSquare = ({
  isActive,

  exerciseType = 'square',

  onComplete,
}: {
  isActive: boolean;

  exerciseType: string;

  onComplete?: () => void;
}) => {
  if (exerciseType === 'square') {
    return (
      <div id="box">
        <div
          className="w-60 h-60 relative flex items-center  justify-center bg-transparent border-6 border-teal-500 rounded-xl"
          id="square">
          <div
            style={{top: -12, left: -12}}
            id="knob"
            className="bg-white shadow-2xl h-6 w-6 rounded-full absolute "></div>
          <FocusIcon isActive={isActive} />
        </div>
      </div>
    );
  } else {
    const [currentIteration, setCurrentIteration] = useState(0);

    useEffect(() => {
      if (isActive && exerciseType === '478') {
        const interval = setInterval(
          () => {
            setCurrentIteration(currentIteration + 1);
          },
          !isNaN(Number(t[currentIteration])) ? 1200 : 1500
        );

        if (currentIteration === t.length - 1) {
          setCurrentIteration(0);
          clearInterval(interval);
          onComplete();
        }

        return () => clearInterval(interval);
      }
    }, [isActive, currentIteration, exerciseType, onComplete]);

    return (
      <div id="box">
        <div className="absolute overflow-hidden inset-0 rounded-full w-full h-full">
          <div
            className="h-40 w-40 flex items-center justify-center text-center z-10  rounded-full bg-teal-500 shadow-xl absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
            }}>
            <ul className="fse-text-helper-list">
              {map(t, (item, i) => (
                <li
                  key={i}
                  className={`${
                    i === currentIteration ? 'showing' : 'hide'
                  } text-2xl text-white font-bold`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              transitionDuration: '3s',
              transform:
                isActive && !isNaN(Number(t[currentIteration]))
                  ? `scale(220)`
                  : 'scale(0)',
              zIndex: 4,
            }}
            className={`transition-all  ease-in-out ripple`}></div>
        </div>
      </div>
    );
  }
};

export default AnimatedSquare;
