import {v4 as uuidv4} from 'uuid';

export const emojiList = [
  {
    emoji: '😠',
    link: 'angry',
    id: uuidv4(),
    name: 'Awful',
  },
  {
    emoji: '😞',
    link: 'sad',
    id: uuidv4(),
    name: 'Bad',
  },
  {
    emoji: '😐',
    link: 'neutral',
    id: uuidv4(),
    name: 'Okay',
  },

  {
    emoji: '🙂',
    link: 'happy',
    id: uuidv4(),
    name: 'Good',
  },
  {
    emoji: '🤩',
    link: 'excited',
    id: uuidv4(),
    name: 'Great',
  },
];

export const languageList = [
  {id: '1', name: 'English', value: 'EN'},
  {id: '2', name: 'Spanish', value: 'ES'},
];

export const lessonTypeList: any = [
  {id: '1', name: 'Lesson', value: 'lesson'},
  {id: '2', name: 'Assessment', value: 'assessment'},
  {id: '3', name: 'Survey', value: 'survey'},
];

export const tinting: any = [
  {id: '1', name: 'None'},
  {id: '2', name: 'Light'},
  {id: '3', name: 'Medium'},
  {id: '4', name: 'Dark'},
];
export const blur: any = [
  {id: '1', name: 'Low'},
  {id: '2', name: 'Medium'},
  {id: '3', name: 'High'},
];
export const scrim: any = [
  {id: '1', name: 'Bottom'},
  {id: '2', name: 'Center'},
  {id: '3', name: 'Top'},
];

/**
 * This is response data values for select one list
 */
export const optionResponses = [
  {
    title: 'Difficulty',
    content: [
      {id: uuidv4(), text: 'Very Difficult'},
      {id: uuidv4(), text: 'Difficult'},
      {id: uuidv4(), text: 'Easy'},
      {id: uuidv4(), text: 'Very easy'},
    ],
  },
  {
    title: 'Frequency',
    content: [
      {id: uuidv4(), text: 'Never'},
      {id: uuidv4(), text: 'Rarely'},
      {id: uuidv4(), text: 'Sometimes'},
      {id: uuidv4(), text: 'Often'},
      {id: uuidv4(), text: 'Always'},
    ],
  },
  {
    title: 'Quality',
    content: [
      {id: uuidv4(), text: 'Very poor'},
      {id: uuidv4(), text: 'Poor'},
      {id: uuidv4(), text: 'Fair'},
      {id: uuidv4(), text: 'Good'},
      {id: uuidv4(), text: 'Excellent'},
    ],
  },
  {
    title: 'Intensity',
    content: [
      {id: uuidv4(), text: 'None'},
      {id: uuidv4(), text: 'Very mild'},
      {id: uuidv4(), text: 'Mild'},
      {id: uuidv4(), text: 'Moderate'},
      {id: uuidv4(), text: 'Severe'},
    ],
  },
  {
    title: 'Agreement',
    content: [
      {id: uuidv4(), text: 'Strongly disagree'},
      {id: uuidv4(), text: 'Disagree'},
      {id: uuidv4(), text: 'Neither agree nor disagree'},
      {id: uuidv4(), text: 'Agree'},
      {id: uuidv4(), text: 'Strongly agree'},
    ],
  },
  {
    title: 'Approval',
    content: [
      {id: uuidv4(), text: 'Strongly disapprove'},
      {id: uuidv4(), text: 'Dissaprove'},
      {id: uuidv4(), text: 'Neutral'},
      {id: uuidv4(), text: 'Approve'},
      {id: uuidv4(), text: 'Strongly approve'},
    ],
  },
  {
    title: 'Awareness',
    content: [
      {id: uuidv4(), text: 'Not at all aware'},
      {id: uuidv4(), text: 'Slightly aware'},
      {id: uuidv4(), text: 'Moderately aware'},
      {id: uuidv4(), text: 'Very aware'},
      {id: uuidv4(), text: 'Extremely aware'},
    ],
  },
  {
    title: 'Importance',
    content: [
      {id: uuidv4(), text: 'Not at all important'},
      {id: uuidv4(), text: 'Slightly important'},
      {id: uuidv4(), text: 'Moderately important'},
      {id: uuidv4(), text: 'Very important'},
      {id: uuidv4(), text: 'Extremely important'},
    ],
  },
  {
    title: 'Familiarity',
    content: [
      {id: uuidv4(), text: 'Not at all familiar'},
      {id: uuidv4(), text: 'Slightly familiar'},
      {id: uuidv4(), text: 'Moderately familiar'},
      {id: uuidv4(), text: 'Very familiar'},
      {id: uuidv4(), text: 'Extremely familiar'},
    ],
  },
  {
    title: 'Satisfaction',
    content: [
      {id: uuidv4(), text: 'Not at all satisfied'},
      {id: uuidv4(), text: 'Slightly satisfied'},
      {id: uuidv4(), text: 'Moderately satisfied'},
      {id: uuidv4(), text: 'Very satisfied'},
      {id: uuidv4(), text: 'Extremely satisfied'},
    ],
  },
  {
    title: 'Performance',
    content: [
      {id: uuidv4(), text: 'Far below standards'},
      {id: uuidv4(), text: 'Below standards'},
      {id: uuidv4(), text: 'Meets standards'},
      {id: uuidv4(), text: 'Above standards'},
      {id: uuidv4(), text: 'Far above standards'},
    ],
  },
];

export const estimatedTimeList = Array(30)
  .fill({})
  .map((_, index: number) => ({
    id: index + 1,
    name: `${index + 1} min`,
    value: index + 1,
  }));

export const statusList = [
  {id: 1, name: 'Active', value: 'Active'},
  {id: 2, name: 'Inactive', value: 'Inactive'},
  {id: 3, name: 'Dropped', value: 'Dropped'},
];

export const statesList = [
  {
    id: 1,
    name: 'Alabama',
    value: 'Alabama',
  },
  {
    id: 2,
    name: 'Alaska',
    value: 'Alaska',
  },
  {
    id: 4,
    name: 'Arizona',
    value: 'Arizona',
  },
  {
    id: 5,
    name: 'Arkansas',
    value: 'Arkansas',
  },
  {
    id: 6,
    name: 'California',
    value: 'California',
  },
  {
    id: 8,
    name: 'Colorado',
    value: 'Colorado',
  },
  {
    id: 9,
    name: 'Connecticut',
    value: 'Connecticut',
  },
  {
    id: 10,
    name: 'Delaware',
    value: 'Delaware',
  },
  {
    id: 11,
    name: 'District of Columbia',
    value: 'District of Columbia',
  },
  {
    id: 12,
    name: 'Florida',
    value: 'Florida',
  },
  {
    id: 13,
    name: 'Georgia',
    value: 'Georgia',
  },
  {
    id: 15,
    name: 'Hawaii',
    value: 'Hawaii',
  },
  {
    id: 16,
    name: 'Idaho',
    value: 'Idaho',
  },
  {
    id: 17,
    name: 'Illinois',
    value: 'Illinois',
  },
  {
    id: 18,
    name: 'Indiana',
    value: 'Indiana',
  },
  {
    id: 19,
    name: 'Iowa',
    value: 'Iowa',
  },
  {
    id: 20,
    name: 'Kansas',
    value: 'Kansas',
  },
  {
    id: 21,
    name: 'Kentucky',
    value: 'Kentucky',
  },
  {
    id: 22,
    name: 'Louisiana',
    value: 'Louisiana',
  },
  {
    id: 23,
    name: 'Maine',
    value: 'Maine',
  },
  {
    id: 24,
    name: 'Maryland',
    value: 'Maryland',
  },
  {
    id: 25,
    name: 'Massachusetts',
    value: 'Massachusetts',
  },
  {
    id: 26,
    name: 'Michigan',
    value: 'Michigan',
  },
  {
    id: 27,
    name: 'Minnesota',
    value: 'Minnesota',
  },
  {
    id: 28,
    name: 'Mississippi',
    value: 'Mississippi',
  },
  {
    id: 29,
    name: 'Missouri',
    value: 'Missouri',
  },
  {
    id: 30,
    name: 'Montana',
    value: 'Montana',
  },
  {
    id: 31,
    name: 'Nebraska',
    value: 'Nebraska',
  },
  {
    id: 32,
    name: 'Nevada',
    value: 'Nevada',
  },
  {
    id: 33,
    name: 'New Hampshire',
    value: 'New Hampshire',
  },
  {
    id: 34,
    name: 'New Jersey',
    value: 'New Jersey',
  },
  {
    id: 35,
    name: 'New Mexico',
    value: 'New Mexico',
  },
  {
    id: 36,
    name: 'New York',
    value: 'New York',
  },
  {
    id: 37,
    name: 'North Carolina',
    value: 'North Carolina',
  },
  {
    id: 38,
    name: 'North Dakota',
    value: 'North Dakota',
  },
  {
    id: 39,
    name: 'Ohio',
    value: 'Ohio',
  },
  {
    id: 40,
    name: 'Oklahoma',
    value: 'Oklahoma',
  },
  {
    id: 41,
    name: 'Oregon',
    value: 'Oregon',
  },
  {
    id: 42,
    name: 'Pennsylvania',
    value: 'Pennsylvania',
  },
  {
    id: 72,
    name: 'Puerto Rico',
    value: 'Puerto Rico',
  },
  {
    id: 44,
    name: 'Rhode Island',
    value: 'Rhode Island',
  },
  {
    id: 45,
    name: 'South Carolina',
    value: 'South Carolina',
  },
  {
    id: 46,
    name: 'South Dakota',
    value: 'South Dakota',
  },
  {
    id: 47,
    name: 'Tennessee',
    value: 'Tennessee',
  },
  {
    id: 48,
    name: 'Texas',
    value: 'Texas',
  },
  {
    id: 49,
    name: 'Utah',
    value: 'Utah',
  },
  {
    id: 50,
    name: 'Vermont',
    value: 'Vermont',
  },
  {
    id: 51,
    name: 'Virginia',
    value: 'Virginia',
  },
  {
    id: 78,
    name: 'Virgin Islands',
    value: 'Virgin Islands',
  },
  {
    id: 53,
    name: 'Washington',
    value: 'Washington',
  },
  {
    id: 54,
    name: 'West Virginia',
    value: 'West Virginia',
  },
  {
    id: 55,
    name: 'Wisconsin',
    value: 'Wisconsin',
  },
  {
    id: 56,
    name: 'Wyoming',
    value: 'Wyoming',
  },
];

export const groupOptions: any = [
  {id: 1, name: 'Blue'},
  {id: 2, name: 'Black'},
  {id: 3, name: 'Red'},
];

export const frequencyOptions: any = [
  {id: 1, name: 'One Time'},
  {id: 2, name: 'Weekly'},
  {id: 3, name: 'Bi-weekly'},
  {id: 3, name: 'Monthly'},
  {id: 3, name: 'Trimestral'},
  {id: 3, name: 'Quarterly'},
  {id: 3, name: 'Semestral'},
];

export const weekdaysOption: any = [
  {id: 1, name: 'Monday'},
  {id: 2, name: 'Tuesday'},
  {id: 3, name: 'Wednesday'},
  {id: 4, name: 'Thursday'},
  {id: 5, name: 'Friday'},
];
