import {useGameChangers} from 'components/Dashboard/GameChangers/context/GameChangersContext';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';
import React from 'react';
import ErrorBoundary from '@components/Error/ErrorBoundary';

const Counter = () => {
  const {isActive, countSelected, counter} = useGameChangers();

  return (
    <ErrorBoundary componentName="Counter">
      {/* Show 'Starting...' text if animation is not started */}
      <AnimatedContainer
        className="w-auto md:mt-4"
        show={!isActive && countSelected !== null}>
        {!isActive && countSelected !== null && (
          <div className={'text-lightest  font-light mb-4 text-sm'}>Get ready</div>
        )}
      </AnimatedContainer>
      {/* Show Counters  */}
      <AnimatedContainer className="w-auto md:mt-4" show={isActive}>
        {isActive && (
          <div className={'text-lightest  mb-4 font-light text-sm'}>
            {counter} out of {countSelected}
          </div>
        )}
      </AnimatedContainer>
    </ErrorBoundary>
  );
};

export default Counter;
