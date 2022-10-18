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
    desc:
      'Ideal for a calm down breathe session at the beginning or at the end of the day to relax and clear your mind.'
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
    desc:
      "With this exercise, you'll get your desired focus back so you can be even more productive."
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
    desc:
      'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
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
    desc:
      'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
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
    desc:
      'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
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
    desc:
      'This supports us in changing our emotions and behaviors by identifying irrational beliefs and swapping them with rational ones'
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

const emotions = [
  {
    id: 1,
    name: 'happy',
    tier3: [
      {
        id: 111,
        name: 'aroused',
        connectedTo: 'playful'
      },
      {
        id: 112,
        connectedTo: 'playful',
        name: 'cheeky'
      },
      {
        id: 121,
        connectedTo: 'content',
        name: 'free'
      },
      {
        id: 122,
        connectedTo: 'content',
        name: 'joyful'
      },
      {
        id: 131,
        connectedTo: 'interested',
        name: 'curious'
      },
      {
        id: 132,
        name: 'inquisitve',
        connectedTo: 'interested'
      },
      {
        id: 141,
        name: 'successful',
        connectedTo: 'proud'
      },
      {
        id: 142,
        name: 'confident',
        connectedTo: 'proud'
      },
      {
        id: 151,
        name: 'respected',
        connectedTo: 'accepted'
      },
      {
        id: 152,
        name: 'valued',
        connectedTo: 'accepted'
      },
      {
        id: 161,
        name: 'courageous',
        connectedTo: 'powerful'
      },
      {
        id: 162,
        name: 'creative',
        connectedTo: 'powerful'
      },
      {
        id: 171,
        name: 'loving',
        connectedTo: 'peaceful'
      },
      {
        id: 172,
        name: 'thankful',
        connectedTo: 'peaceful'
      },
      {
        id: 181,
        name: 'sensitive',
        connectedTo: 'trusting'
      },
      {
        id: 182,
        name: 'intimate',
        connectedTo: 'trusting'
      },
      {
        id: 191,
        name: 'hopeful',
        connectedTo: 'optimistic'
      },
      {
        id: 192,
        connectedTo: 'optimistic',

        name: 'inspired'
      }
    ],
    children: [
      {
        id: 11,
        name: 'playful',
        children: [
          {
            id: 111,
            name: 'aroused'
          },
          {
            id: 112,
            name: 'cheeky'
          }
        ]
      },
      {
        id: 12,
        name: 'content',
        children: [
          {
            id: 121,
            name: 'free'
          },
          {
            id: 122,
            name: 'joyful'
          }
        ]
      },
      {
        id: 13,
        name: 'interested',
        children: [
          {
            id: 131,
            name: 'curious'
          },
          {
            id: 132,
            name: 'inquisitve'
          }
        ]
      },
      {
        id: 14,
        name: 'proud',
        children: [
          {
            id: 141,
            name: 'successful'
          },
          {
            id: 142,
            name: 'confident'
          }
        ]
      },
      {
        id: 15,
        name: 'accepted',
        children: [
          {
            id: 151,
            name: 'respected'
          },
          {
            id: 152,
            name: 'valued'
          }
        ]
      },
      {
        id: 16,
        name: 'powerful',
        children: [
          {
            id: 161,
            name: 'courageous'
          },
          {
            id: 162,
            name: 'creative'
          }
        ]
      },
      {
        id: 17,
        name: 'peaceful',
        children: [
          {
            id: 171,
            name: 'loving'
          },
          {
            id: 172,
            name: 'thankful'
          }
        ]
      },
      {
        id: 18,
        name: 'trusting',
        children: [
          {
            id: 181,
            name: 'sensitive'
          },
          {
            id: 182,
            name: 'intimate'
          }
        ]
      },
      {
        id: 19,
        name: 'optimistic',
        children: [
          {
            id: 191,
            name: 'hopeful'
          },
          {
            id: 192,
            name: 'inspired'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'surprised',
    tier3: [
      {
        id: 111,
        name: 'shoked',
        connectedTo: 'startled'
      },
      {
        id: 112,
        name: 'dismayed',
        connectedTo: 'startled'
      },
      {
        id: 111,
        name: 'disillusioned',
        connectedTo: 'confused'
      },
      {
        id: 112,
        name: 'perplexed',
        connectedTo: 'confused'
      },
      {
        id: 111,
        name: 'astonished',
        connectedTo: 'amazed'
      },
      {
        id: 112,
        name: 'awe',
        connectedTo: 'amazed'
      },
      {
        id: 111,
        name: 'eager',
        connectedTo: 'excited'
      },
      {
        id: 112,
        name: 'energetic',
        connectedTo: 'excited'
      }
    ],
    children: [
      {
        id: 21,
        name: 'startled',
        children: [
          {
            id: 111,
            name: 'shoked'
          },
          {
            id: 112,
            name: 'dismayed'
          }
        ]
      },
      {
        id: 22,
        name: 'confused',
        children: [
          {
            id: 111,
            name: 'disillusioned'
          },
          {
            id: 112,
            name: 'perplexed'
          }
        ]
      },
      {
        id: 23,
        name: 'amazed',
        children: [
          {
            id: 111,
            name: 'astonished'
          },
          {
            id: 112,
            name: 'awe'
          }
        ]
      },
      {
        id: 24,
        name: 'excited',
        children: [
          {
            id: 111,
            name: 'eager'
          },
          {
            id: 112,
            name: 'energetic'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'bad',
    tier3: [
      {
        id: 111,
        name: 'indifferent',
        connectedTo: 'bored'
      },
      {
        id: 112,
        name: 'apathetic',
        connectedTo: 'bored'
      },
      {
        id: 111,
        name: 'pressured',
        connectedTo: 'busy'
      },
      {
        id: 112,
        name: 'rushed',
        connectedTo: 'busy'
      },
      {
        id: 111,
        name: 'overwhelmed',
        connectedTo: 'stressed'
      },
      {
        id: 112,
        name: 'out of control',
        connectedTo: 'stressed'
      },
      {
        id: 111,
        name: 'sleepy',
        connectedTo: 'tired'
      },
      {
        id: 112,
        name: 'unfocused',
        connectedTo: 'tired'
      }
    ],
    children: [
      {
        id: 31,
        name: 'bored',
        children: [
          {
            id: 111,
            name: 'indifferent'
          },
          {
            id: 112,
            name: 'apathetic'
          }
        ]
      },
      {
        id: 32,
        name: 'busy',
        children: [
          {
            id: 111,
            name: 'pressured'
          },
          {
            id: 112,
            name: 'rushed'
          }
        ]
      },
      {
        id: 33,
        name: 'stressed',
        children: [
          {
            id: 111,
            name: 'overwhelmed'
          },
          {
            id: 112,
            name: 'out of control'
          }
        ]
      },
      {
        id: 34,
        name: 'tired',
        children: [
          {
            id: 111,
            name: 'sleepy'
          },
          {
            id: 112,
            name: 'unfocused'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'fearful',
    tier3: [
      {
        id: 111,
        name: 'helpless',
        connectedTo: 'scared'
      },
      {
        id: 112,
        name: 'frightened',
        connectedTo: 'scared'
      },
      {
        id: 111,
        name: 'distraught',
        connectedTo: 'anxious'
      },
      {
        id: 112,
        name: 'worried',
        connectedTo: 'anxious'
      },
      {
        id: 111,
        name: 'inadequate',
        connectedTo: 'insecure'
      },
      {
        id: 112,
        name: 'inferior',
        connectedTo: 'insecure'
      },
      {
        id: 111,
        name: 'worthless',
        connectedTo: 'weak'
      },
      {
        id: 112,
        name: 'insignicant',
        connectedTo: 'weak'
      },
      {
        id: 111,
        name: 'excluded',
        connectedTo: 'rejected'
      },
      {
        id: 112,
        name: 'persecuted',
        connectedTo: 'rejected'
      },
      {
        id: 111,
        name: 'nervous',
        connectedTo: 'threatened'
      },
      {
        id: 112,
        name: 'exposed',
        connectedTo: 'threatened'
      }
    ],
    children: [
      {
        id: 41,
        name: 'scared',
        children: [
          {
            id: 111,
            name: 'helpless'
          },
          {
            id: 112,
            name: 'frightened'
          }
        ]
      },
      {
        id: 42,
        name: 'anxious',
        children: [
          {
            id: 111,
            name: 'distraught'
          },
          {
            id: 112,
            name: 'worried'
          }
        ]
      },
      {
        id: 43,
        name: 'insecure',
        children: [
          {
            id: 111,
            name: 'inadequate'
          },
          {
            id: 112,
            name: 'inferior'
          }
        ]
      },
      {
        id: 44,
        name: 'weak',
        children: [
          {
            id: 111,
            name: 'worthless'
          },
          {
            id: 112,
            name: 'insignicant'
          }
        ]
      },
      {
        id: 45,
        name: 'rejected',
        children: [
          {
            id: 111,
            name: 'excluded'
          },
          {
            id: 112,
            name: 'persecuted'
          }
        ]
      },
      {
        id: 46,
        name: 'threatened',
        children: [
          {
            id: 111,
            name: 'nervous'
          },
          {
            id: 112,
            name: 'exposed'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'angry',
    tier3: [
      {
        id: 111,
        name: 'betrayed',
        connectedTo: 'let down'
      },
      {
        id: 112,
        name: 'resentful',
        connectedTo: 'let down'
      },
      {
        id: 111,
        name: 'disrespected',
        connectedTo: 'humiliated'
      },
      {
        id: 112,
        name: 'ridiculed',
        connectedTo: 'humiliated'
      },
      {
        id: 111,
        name: 'indignant',
        connectedTo: 'bitter'
      },
      {
        id: 112,
        name: 'violated',
        connectedTo: 'bitter'
      },
      {
        id: 111,
        name: 'furious',
        connectedTo: 'mad'
      },
      {
        id: 112,
        name: 'jealous',
        connectedTo: 'mad'
      },
      {
        id: 111,
        name: 'provoked',
        connectedTo: 'aggressive'
      },
      {
        id: 112,
        name: 'hostile',
        connectedTo: 'aggressive'
      },
      {
        id: 111,
        name: 'infuriated',
        connectedTo: 'frustrated'
      },
      {
        id: 112,
        connectedTo: 'frustrated',
        name: 'annoyed'
      },
      {
        id: 111,
        name: 'withdrawn',
        connectedTo: 'distant'
      },
      {
        id: 112,
        name: 'numb',
        connectedTo: 'distant'
      },
      {
        id: 111,
        name: 'skeptical',
        connectedTo: 'critical'
      },
      {
        id: 112,
        name: 'dismissive',
        connectedTo: 'critical'
      }
    ],
    children: [
      {
        id: 51,
        name: 'let down',
        children: [
          {
            id: 111,
            name: 'betrayed'
          },
          {
            id: 112,
            name: 'resentful'
          }
        ]
      },
      {
        id: 52,
        name: 'humiliated',
        children: [
          {
            id: 111,
            name: 'disrespected'
          },
          {
            id: 112,
            name: 'ridiculed'
          }
        ]
      },
      {
        id: 53,
        name: 'bitter',
        children: [
          {
            id: 111,
            name: 'indignant'
          },
          {
            id: 112,
            name: 'violated'
          }
        ]
      },
      {
        id: 54,
        name: 'mad',
        children: [
          {
            id: 111,
            name: 'furious'
          },
          {
            id: 112,
            name: 'jealous'
          }
        ]
      },
      {
        id: 55,
        name: 'aggressive',
        children: [
          {
            id: 111,
            name: 'provoked'
          },
          {
            id: 112,
            name: 'hostile'
          }
        ]
      },
      {
        id: 56,
        name: 'frustrated',
        children: [
          {
            id: 111,
            name: 'infuriated'
          },
          {
            id: 112,
            name: 'annoyed'
          }
        ]
      },
      {
        id: 57,
        name: 'distant',
        children: [
          {
            id: 111,
            name: 'withdrawn'
          },
          {
            id: 112,
            name: 'numb'
          }
        ]
      },
      {
        id: 58,
        name: 'critical',
        children: [
          {
            id: 111,
            name: 'skeptical'
          },
          {
            id: 112,
            name: 'dismissive'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'disgusted',
    tier3: [
      {
        id: 111,
        name: 'judgemental',
        connectedTo: 'disapproving'
      },
      {
        id: 112,
        name: 'humiliated',
        connectedTo: 'disapproving'
      },
      {
        id: 111,
        name: 'appalled',
        connectedTo: 'disappointed'
      },
      {
        id: 112,
        name: 'revolted',
        connectedTo: 'disappointed'
      },
      {
        id: 111,
        name: 'nauseated',
        connectedTo: 'awful'
      },
      {
        id: 112,
        name: 'detestable',
        connectedTo: 'awful'
      },
      {
        id: 111,
        name: 'horrified',
        connectedTo: 'repelled'
      },
      {
        id: 112,
        name: 'hesitant',
        connectedTo: 'repelled'
      }
    ],
    children: [
      {
        id: 61,
        name: 'disapproving',
        children: [
          {
            id: 111,
            name: 'judgemental'
          },
          {
            id: 112,
            name: 'humiliated'
          }
        ]
      },
      {
        id: 62,
        name: 'disappointed',
        children: [
          {
            id: 111,
            name: 'appalled'
          },
          {
            id: 112,
            name: 'revolted'
          }
        ]
      },
      {
        id: 63,
        name: 'awful',
        children: [
          {
            id: 111,
            name: 'nauseated'
          },
          {
            id: 112,
            name: 'detestable'
          }
        ]
      },
      {
        id: 64,
        name: 'repelled',
        children: [
          {
            id: 111,
            name: 'horrified'
          },
          {
            id: 112,
            name: 'hesitant'
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'sad',
    tier3: [
      {
        id: 111,
        name: 'isolated',
        connectedTo: 'lonely'
      },
      {
        id: 112,
        name: 'abandoned',
        connectedTo: 'lonely'
      },
      {
        id: 111,
        name: 'victimized',
        connectedTo: 'vulnerable'
      },
      {
        id: 112,
        name: 'fragile',
        connectedTo: 'vulnerable'
      },
      {
        id: 111,
        name: 'grief',
        connectedTo: 'despair'
      },
      {
        id: 112,
        name: 'powerless',
        connectedTo: 'despair'
      },
      {
        id: 111,
        name: 'ashamed',
        connectedTo: 'guilty'
      },
      {
        id: 112,
        name: 'remorseful',
        connectedTo: 'guilty'
      },
      {
        id: 111,
        name: 'empty',
        connectedTo: 'depressed'
      },
      {
        id: 112,
        name: 'unimportant',
        connectedTo: 'depressed'
      },
      {
        id: 111,
        name: 'disappointed',
        connectedTo: 'hurt'
      },
      {
        id: 112,
        name: 'embarrased',
        connectedTo: 'hurt'
      }
    ],
    children: [
      {
        id: 71,
        name: 'lonely',
        children: [
          {
            id: 111,
            name: 'isolated'
          },
          {
            id: 112,
            name: 'abandoned'
          }
        ]
      },
      {
        id: 72,
        name: 'vulnerable',
        children: [
          {
            id: 111,
            name: 'victimized'
          },
          {
            id: 112,
            name: 'fragile'
          }
        ]
      },
      {
        id: 73,
        name: 'despair',
        children: [
          {
            id: 111,
            name: 'grief'
          },
          {
            id: 112,
            name: 'powerless'
          }
        ]
      },
      {
        id: 74,
        name: 'guilty',
        children: [
          {
            id: 111,
            name: 'ashamed'
          },
          {
            id: 112,
            name: 'remorseful'
          }
        ]
      },
      {
        id: 75,
        name: 'depressed',
        children: [
          {
            id: 111,
            name: 'empty'
          },
          {
            id: 112,
            name: 'unimportant'
          }
        ]
      },
      {
        id: 76,
        name: 'hurt',
        children: [
          {
            id: 111,
            name: 'disappointed'
          },
          {
            id: 112,
            name: 'embarrased'
          }
        ]
      }
    ]
  }
];

export {
  cardsList,
  FSEBreathingHowTo,
  FSEInfoText,
  sqaureBreathingHowTo,
  sqaureBreathingInfoText,
  qaList,
  successSound,
  emotions
};
