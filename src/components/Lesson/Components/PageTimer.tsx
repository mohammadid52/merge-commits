import {useGlobalContext} from '@contexts/GlobalContext';
import {useEffect, useState} from 'react';

const PageTimer = ({startTime}: {startTime: any}) => {
  // * Logic of the timer
  // first get the current page from states
  // then get the current timer of the page from local storage
  // set that to the current local timer
  // then get the estimated time from lesson page state
  // ---
  // update background from timer
  // if the timer is greater than the 51% of estimated timer.. show green background
  // if the timer is between 11% to 50% of estimated timer.. show yellow background
  // if the timer is lesson than 10% of estimated timer.. show red background
  // use moment for time calculations

  const {lessonState, lessonDispatch} = useGlobalContext();
  const {currentPage} = lessonState;

  const existingTimer = lessonState.pageTimers?.find(
    (t: any) => t?.currentPage === currentPage
  )?.remainingTime;

  const startFromThisTime = existingTimer || startTime;

  const [timeRemaining, setTimeRemaining] = useState(startFromThisTime);

  const updateTimerToLessonState = (updatedTime: number) => {
    lessonDispatch({
      type: 'UPDATE_TIMER_FOR_PAGE',
      payload: {
        currentPage,
        remainingTime: updatedTime
      }
    });
  };

  useEffect(() => {
    setTimeRemaining(startFromThisTime);
    updateTimerToLessonState(startFromThisTime);
    // animateTimer();
  }, [currentPage]);

  // const animateTimer = () => {
  //   gsap.from('.page_timer', {
  //     x: 100,
  //     opacity: 0,
  //     duration: 0.5
  //   });
  // };

  useEffect(() => {
    if (timeRemaining === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prevTimeRemaining: any) => {
        updateTimerToLessonState(prevTimeRemaining - 1);
        return prevTimeRemaining - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const minutesLeft = Math.floor(timeRemaining / 60);
  const secondsLeft = timeRemaining % 60;

  const percentageOfTime = () => Math.floor((timeRemaining / startTime) * 100);

  const getBackgroundColor = () => {
    const percent = percentageOfTime();

    if (percent <= 100 && percent >= 50) {
      return 'bg-green-600';
    } else if (percent >= 11 && percent < 50) {
      return 'bg-yellow-600';
    } else if (percent <= 10) {
      return 'bg-red-600';
    }
    return 'bg-yellow-600';
  };

  return (
    <div className="page_timer fixed top-8 right-8 z-100  w-auto ">
      <div
        className={`${getBackgroundColor()} transition-all px-2 py-1 rounded-full text-xs`}>
        {timeRemaining === 0 ? (
          <span>Timer finished</span>
        ) : (
          <span>
            {minutesLeft}:{secondsLeft < 10 ? '0' : ''}
            {secondsLeft} left
          </span>
        )}
      </div>
    </div>
  );
};

export default PageTimer;
