import BreathingExercise from '@components/Dashboard/GameChangers/BreathingExercise';
import React, {useMemo} from 'react';
import {useRouteMatch} from 'react-router';

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
        howToList={activityId === 1 ? sqaureBreathingHowTo : FSEBreathingHowTo}
        infoText={activityId === 1 ? sqaureBreathingInfoText : FSEInfoText}
        exerciseType={activityId === 1 ? 'square' : activityId === 2 ? '478' : 'none'}
        {...props}
      />
    );
  } else return null;
};

export default ExerciseList;
