import BreathingExercise from '@components/Dashboard/GameChangers/BreathingExercise';
import React, {useMemo} from 'react';
import {useRouteMatch} from 'react-router';

const ExerciseList = () => {
  const route: any = useRouteMatch();

  const activityId = useMemo(() => Number(route.params.activityId), [
    route.params.activityId,
  ]);

  const sqaureBreathingProps = {};

  // FSE stands for Four Seven Eight
  const FSEBreathingProps = {
    bgImage:
      'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2093&q=80',
    exerciseName1: '4-7-8',
  };

  if (activityId === 1 || activityId === 2) {
    const props = activityId === 1 ? {...sqaureBreathingProps} : {...FSEBreathingProps};
    return (
      <BreathingExercise
        exerciseType={activityId === 1 ? 'square' : activityId === 2 ? '478' : 'none'}
        {...props}
      />
    );
  } else return null;
};

export default ExerciseList;
