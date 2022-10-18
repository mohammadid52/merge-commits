import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';
import React from 'react';

const Counter = () => {
  const {isActive, countSelected, counter} = useGameChangers();

  return (
    <>
      {/* Show 'Starting...' text if animation is not started */}
      <AnimatedContainer
        className="w-auto md:mt-4"
        show={!isActive && countSelected !== null}>
        {!isActive && countSelected !== null && (
          <div className={'text-gray-300 font-light mb-4 text-sm'}>Get ready</div>
        )}
      </AnimatedContainer>
      {/* Show Counters  */}
      <AnimatedContainer className="w-auto md:mt-4" show={isActive}>
        {isActive && (
          <div className={'text-gray-300 mb-4 font-light text-sm'}>
            {counter} out of {countSelected}
          </div>
        )}
      </AnimatedContainer>
    </>
  );
};

export default Counter;
