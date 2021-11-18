import BreathingExercise from '@components/Dashboard/GameChangers/BreathingExercise';
import React, {useMemo} from 'react';
import {useRouteMatch} from 'react-router';

const ExerciseList = () => {
  const route: any = useRouteMatch();

  const activityId = useMemo(() => Number(route.params.activityId), [
    route.params.activityId,
  ]);

  if (activityId === 1) {
    return <BreathingExercise />;
  } else return null;
};

export default ExerciseList;
