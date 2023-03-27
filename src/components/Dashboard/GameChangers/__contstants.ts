import {
  EMOTIONS,
  FOUR_SEVEN_EIGHT,
  GRATITUDE,
  SINGING_BOWL,
  SQUARE,
  THINK_ABOUT_IT
} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {nanoid} from 'nanoid';
import {BiCheckboxChecked, BiRadioCircleMarked} from 'react-icons/bi';
import {BsFillJournalBookmarkFill} from 'react-icons/bs';
import {CgBowl} from 'react-icons/cg';
import {FcMindMap} from 'react-icons/fc';
import {RiEmotionHappyLine} from 'react-icons/ri';

//
const successSound = 'https://selready.s3.us-east-2.amazonaws.com/meditation.mp3';

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
    desc: 'Ideal for a calm down breathe session at the beginning or at the end of the day to relax and clear your mind.'
  },
  {
    icon: BiCheckboxChecked,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-100',
    subtitle: 'Add 4-7-8 breathing to lesson',
    id: 1,

    name: '4-7-8 Breathing',
    type: FOUR_SEVEN_EIGHT,
    title: '4-7-8 Breathing',
    desc: "With this exercise, you'll get your desired focus back so you can be even more productive."
  },
  {
    icon: FcMindMap,
    iconForeground: 'text-yellow-700',
    iconBackground: 'bg-yellow-100',
    subtitle: 'Add `Think about it` to lesson',
    id: 2,

    name: 'Think About It',
    type: THINK_ABOUT_IT,
    title: 'Think About It',
    desc: 'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
  },
  {
    icon: RiEmotionHappyLine,
    iconForeground: 'text-green-700',
    iconBackground: 'bg-green-100',
    subtitle: 'Get emotion feedback',
    id: 3,
    name: 'Emotions Component',
    type: EMOTIONS,
    title: 'Emotions',
    desc: 'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
  },
  {
    id: 4,
    name: 'Gratitude Component',
    subtitle: 'Write 3 things in journal',

    icon: BsFillJournalBookmarkFill,
    iconForeground: 'text-pink-700',
    iconBackground: 'bg-pink-100',
    type: GRATITUDE,
    title: 'Gratitude',
    desc: 'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
  },
  {
    id: 5,
    name: 'Singing Meditation',
    subtitle: 'Use singing meditation',
    icon: CgBowl,
    iconForeground: 'text-teal-700',
    iconBackground: 'bg-teal-100',
    type: SINGING_BOWL,
    title: 'Singing Bowl',
    desc: 'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
  }
];

const FSEBreathingHowTo = [
  'First, let your lips part. Make a whooshing sound, exhaling completely through your mouth.',
  'Next, close your lips, inhaling silently through your nose as you count to four in your head.',
  'Then, for seven seconds, hold your breath.',
  'Make another whooshing exhale from your mouth for eight seconds.'
];

const FSEInfoText = `The 4-7-8 breathing technique is a breathing pattern developed by Dr. Andrew Weil. It's based on an ancient yogic technique called pranayama, which helps practitioners gain control over their breathing.
  When practiced regularly, it's possible that this technique could help some people fall asleep in a shorter period of time.`;

const sqaureBreathingHowTo = [
  'Begin by slowly exhaling all of your air out',
  'Then, gently inhale through your nose to a slow count of 4',
  'Hold at the top of the breath for a count of 4',
  'Then gently exhale through your mouth for a count of 4',
  'At the bottom of the breath, pause and hold for the count of 4'
];

const sqaureBreathingInfoText = `Square breathing is a type of breathwork that can shift your energy, connect you
  more deeply with your body, calm your nervous system, and reduce the stress in
  your body. It is also referred to as box breathing, 4x4 breathing, and 4-part
  breath. Here are instructions for square breathing and some ideas for when to
  practice the technique. We'll also share tips for making the breathwork as
  effective as possible.`;

const qaList = [
  {
    id: nanoid(24),
    question: 'What just happened that made you doubt yourself?',
    placeholder: "I didn't do well in my math test today.",
    textarea: false
  },
  {
    id: nanoid(24),
    question: 'What are you telling yourself about the situation?',
    placeholder: "I'm useless. I can't do anything right.",
    textarea: false
  },
  {
    id: nanoid(24),
    question: 'What happens if you keep believing what you are thinking?',
    placeholder: 'I give up and stop studying for the exam next week.',
    textarea: false
  },
  {
    id: nanoid(24),
    question:
      'What am I not giving myself credit for in what happened?  What am I proud of?',
    placeholder:
      "I did well in the test last week. I've been studying well, but I hadn't covered this topic yet.\n The results show me where i need to focus my attention.",
    textarea: true
  },
  {
    id: nanoid(24),
    question:
      "What can I do where I would be proud of myself that doesn't include beating myself up or quitting?",
    placeholder:
      "I sit down with my teacher to understand where I went wrong.\n We work on parts of the test I didn't understand, and I include what i have learned in my future studying.",
    textarea: true
  }
];

export {
  cardsList,
  FSEBreathingHowTo,
  FSEInfoText,
  sqaureBreathingHowTo,
  sqaureBreathingInfoText,
  qaList,
  successSound
};
