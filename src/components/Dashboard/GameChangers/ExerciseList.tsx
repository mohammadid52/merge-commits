import BreathingExercise from '@components/Dashboard/GameChangers/BreathingExercise';
import React from 'react';
import {useRouteMatch} from 'react-router';

const ExerciseList = () => {
  const route: any = useRouteMatch();

  const activityId = Number(route.params.activityId);

  if (activityId === 1) {
    return <BreathingExercise />;
  } else return null;
};

export default ExerciseList;
