import {
  FOUR_SEVEN_EIGHT,
  SQUARE,
} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {BiCheckboxChecked, BiRadioCircleMarked} from 'react-icons/bi';

const cardsList = [
  {
    id: 0,
    type: SQUARE,
    title: 'Square Breathing',
    icon: BiRadioCircleMarked,
    subtitle: 'Add square breathing to lesson',
    name: 'Sqaure Breathing',
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-100',
    desc:
      'Ideal for a calm down breathe session at the beginning or at the end of the day to relax and clear your mind.',
  },
  {
    icon: BiCheckboxChecked,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-100',
    subtitle: 'Add 4-7-8 breathing to lesson',
    id: 1,
    name: '4-7-8 Breathing',
    type: FOUR_SEVEN_EIGHT,
    title: '4-7-8 Breathing',
    desc:
      'With this exercise, you’ll get your desired focus back so you can be even more productive.',
  },
];

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

/* View in fullscreen */
function openFullscreen(): void {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
    // @ts-ignore
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    // @ts-ignore
    elem.webkitRequestFullscreen();
    // @ts-ignore
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    // @ts-ignore
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    // @ts-ignore
    document.webkitExitFullscreen();
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    /* IE11 */
    // @ts-ignore
    document.msExitFullscreen();
  }
}

export {
  cardsList,
  FSEBreathingHowTo,
  FSEInfoText,
  sqaureBreathingHowTo,
  sqaureBreathingInfoText,
  openFullscreen,
  closeFullscreen,
};
