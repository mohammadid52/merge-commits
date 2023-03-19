import {TeachingStyle} from 'API';
import {v4 as uuidv4} from 'uuid';

export const emojiList = [
  {
    emoji: '😠',
    link: 'angry',
    id: uuidv4(),
    label: 'Awful'
  },
  {
    emoji: '😞',
    link: 'sad',
    id: uuidv4(),
    label: 'Bad'
  },
  {
    emoji: '😐',
    link: 'neutral',
    id: uuidv4(),
    label: 'Okay'
  },

  {
    emoji: '🙂',
    link: 'happy',
    id: uuidv4(),
    label: 'Good'
  },
  {
    emoji: '🤩',
    link: 'excited',
    id: uuidv4(),
    label: 'Great'
  }
];

export const languageList = [
  {label: 'English', value: 'EN'},
  {label: 'Spanish', value: 'ES'}
];

export const lessonTypeList: any = [
  {id: '1', label: 'Lesson', value: 'lesson'},
  {id: '2', label: 'Assessment', value: 'assessment'},
  {id: '3', label: 'Survey', value: 'survey'}
];

export const schooltypeList = [
  {id: 0, value: 'In-School Programming', label: 'In-School Programming'},
  {
    id: 1,
    value: 'After-School Programming',
    label: 'After-School Programming'
  },
  {
    id: 2,
    value: 'Summer Intensives (2 week programming)',
    label: 'Summer Intensives (2 week programming)'
  },
  {id: 3, value: "Writer's Retreat", label: "Writer's Retreat"}
];

export const tinting: any = [
  {id: '1', label: 'None'},
  {id: '2', label: 'Light'},
  {id: '3', label: 'Medium'},
  {id: '4', label: 'Dark'}
];
export const blur: any = [
  {id: '1', label: 'Low'},
  {id: '2', label: 'Medium'},
  {id: '3', label: 'High'}
];
export const scrim: any = [
  {id: '1', label: 'Bottom'},
  {id: '2', label: 'Center'},
  {id: '3', label: 'Top'}
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
      {id: uuidv4(), text: 'Very easy'}
    ]
  },
  {
    title: 'Frequency',
    content: [
      {id: uuidv4(), text: 'Never'},
      {id: uuidv4(), text: 'Rarely'},
      {id: uuidv4(), text: 'Sometimes'},
      {id: uuidv4(), text: 'Often'},
      {id: uuidv4(), text: 'Always'}
    ]
  },
  {
    title: 'Quality',
    content: [
      {id: uuidv4(), text: 'Very poor'},
      {id: uuidv4(), text: 'Poor'},
      {id: uuidv4(), text: 'Fair'},
      {id: uuidv4(), text: 'Good'},
      {id: uuidv4(), text: 'Excellent'}
    ]
  },
  {
    title: 'Intensity',
    content: [
      {id: uuidv4(), text: 'None'},
      {id: uuidv4(), text: 'Very mild'},
      {id: uuidv4(), text: 'Mild'},
      {id: uuidv4(), text: 'Moderate'},
      {id: uuidv4(), text: 'Severe'}
    ]
  },
  {
    title: 'Agreement',
    content: [
      {id: uuidv4(), text: 'Strongly disagree'},
      {id: uuidv4(), text: 'Disagree'},
      {id: uuidv4(), text: 'Neither agree nor disagree'},
      {id: uuidv4(), text: 'Agree'},
      {id: uuidv4(), text: 'Strongly agree'}
    ]
  },
  {
    title: 'Approval',
    content: [
      {id: uuidv4(), text: 'Strongly disapprove'},
      {id: uuidv4(), text: 'Dissaprove'},
      {id: uuidv4(), text: 'Neutral'},
      {id: uuidv4(), text: 'Approve'},
      {id: uuidv4(), text: 'Strongly approve'}
    ]
  },
  {
    title: 'Awareness',
    content: [
      {id: uuidv4(), text: 'Not at all aware'},
      {id: uuidv4(), text: 'Slightly aware'},
      {id: uuidv4(), text: 'Moderately aware'},
      {id: uuidv4(), text: 'Very aware'},
      {id: uuidv4(), text: 'Extremely aware'}
    ]
  },
  {
    title: 'Importance',
    content: [
      {id: uuidv4(), text: 'Not at all important'},
      {id: uuidv4(), text: 'Slightly important'},
      {id: uuidv4(), text: 'Moderately important'},
      {id: uuidv4(), text: 'Very important'},
      {id: uuidv4(), text: 'Extremely important'}
    ]
  },
  {
    title: 'Familiarity',
    content: [
      {id: uuidv4(), text: 'Not at all familiar'},
      {id: uuidv4(), text: 'Slightly familiar'},
      {id: uuidv4(), text: 'Moderately familiar'},
      {id: uuidv4(), text: 'Very familiar'},
      {id: uuidv4(), text: 'Extremely familiar'}
    ]
  },
  {
    title: 'Satisfaction',
    content: [
      {id: uuidv4(), text: 'Not at all satisfied'},
      {id: uuidv4(), text: 'Slightly satisfied'},
      {id: uuidv4(), text: 'Moderately satisfied'},
      {id: uuidv4(), text: 'Very satisfied'},
      {id: uuidv4(), text: 'Extremely satisfied'}
    ]
  },
  {
    title: 'Performance',
    content: [
      {id: uuidv4(), text: 'Far below standards'},
      {id: uuidv4(), text: 'Below standards'},
      {id: uuidv4(), text: 'Meets standards'},
      {id: uuidv4(), text: 'Above standards'},
      {id: uuidv4(), text: 'Far above standards'}
    ]
  }
];

export const estimatedTimeList = Array(30)
  .fill({})
  .map((_, index: number) => ({
    id: index + 1,
    label: `${index + 1} min`,
    value: (index + 1).toString()
  }));

export const statusList = [
  {id: 1, label: 'ACTIVE', value: 'ACTIVE'},
  {id: 2, label: 'INACTIVE', value: 'INACTIVE'},
  {id: 3, label: 'TRAINING', value: 'TRAINING'}
];

export const statesList = [
  {
    id: 1,
    label: 'Alabama',
    value: 'Alabama'
  },
  {
    id: 2,
    label: 'Alaska',
    value: 'Alaska'
  },
  {
    id: 4,
    label: 'Arizona',
    value: 'Arizona'
  },
  {
    id: 5,
    label: 'Arkansas',
    value: 'Arkansas'
  },
  {
    id: 6,
    label: 'California',
    value: 'California'
  },
  {
    id: 8,
    label: 'Colorado',
    value: 'Colorado'
  },
  {
    id: 9,
    label: 'Connecticut',
    value: 'Connecticut'
  },
  {
    id: 10,
    label: 'Delaware',
    value: 'Delaware'
  },
  {
    id: 11,
    label: 'District of Columbia',
    value: 'District of Columbia'
  },
  {
    id: 12,
    label: 'Florida',
    value: 'Florida'
  },
  {
    id: 13,
    label: 'Georgia',
    value: 'Georgia'
  },
  {
    id: 15,
    label: 'Hawaii',
    value: 'Hawaii'
  },
  {
    id: 16,
    label: 'Idaho',
    value: 'Idaho'
  },
  {
    id: 17,
    label: 'Illinois',
    value: 'Illinois'
  },
  {
    id: 18,
    label: 'Indiana',
    value: 'Indiana'
  },
  {
    id: 19,
    label: 'Iowa',
    value: 'Iowa'
  },
  {
    id: 20,
    label: 'Kansas',
    value: 'Kansas'
  },
  {
    id: 21,
    label: 'Kentucky',
    value: 'Kentucky'
  },
  {
    id: 22,
    label: 'Louisiana',
    value: 'Louisiana'
  },
  {
    id: 23,
    label: 'Maine',
    value: 'Maine'
  },
  {
    id: 24,
    label: 'Maryland',
    value: 'Maryland'
  },
  {
    id: 25,
    label: 'Massachusetts',
    value: 'Massachusetts'
  },
  {
    id: 26,
    label: 'Michigan',
    value: 'Michigan'
  },
  {
    id: 27,
    label: 'Minnesota',
    value: 'Minnesota'
  },
  {
    id: 28,
    label: 'Mississippi',
    value: 'Mississippi'
  },
  {
    id: 29,
    label: 'Missouri',
    value: 'Missouri'
  },
  {
    id: 30,
    label: 'Montana',
    value: 'Montana'
  },
  {
    id: 31,
    label: 'Nebraska',
    value: 'Nebraska'
  },
  {
    id: 32,
    label: 'Nevada',
    value: 'Nevada'
  },
  {
    id: 33,
    label: 'New Hampshire',
    value: 'New Hampshire'
  },
  {
    id: 34,
    label: 'New Jersey',
    value: 'New Jersey'
  },
  {
    id: 35,
    label: 'New Mexico',
    value: 'New Mexico'
  },
  {
    id: 36,
    label: 'New York',
    value: 'New York'
  },
  {
    id: 37,
    label: 'North Carolina',
    value: 'North Carolina'
  },
  {
    id: 38,
    label: 'North Dakota',
    value: 'North Dakota'
  },
  {
    id: 39,
    label: 'Ohio',
    value: 'Ohio'
  },
  {
    id: 40,
    label: 'Oklahoma',
    value: 'Oklahoma'
  },
  {
    id: 41,
    label: 'Oregon',
    value: 'Oregon'
  },
  {
    id: 42,
    label: 'Pennsylvania',
    value: 'Pennsylvania'
  },
  {
    id: 72,
    label: 'Puerto Rico',
    value: 'Puerto Rico'
  },
  {
    id: 44,
    label: 'Rhode Island',
    value: 'Rhode Island'
  },
  {
    id: 45,
    label: 'South Carolina',
    value: 'South Carolina'
  },
  {
    id: 46,
    label: 'South Dakota',
    value: 'South Dakota'
  },
  {
    id: 47,
    label: 'Tennessee',
    value: 'Tennessee'
  },
  {
    id: 48,
    label: 'Texas',
    value: 'Texas'
  },
  {
    id: 49,
    label: 'Utah',
    value: 'Utah'
  },
  {
    id: 50,
    label: 'Vermont',
    value: 'Vermont'
  },
  {
    id: 51,
    label: 'Virginia',
    value: 'Virginia'
  },
  {
    id: 78,
    label: 'Virgin Islands',
    value: 'Virgin Islands'
  },
  {
    id: 53,
    label: 'Washington',
    value: 'Washington'
  },
  {
    id: 54,
    label: 'West Virginia',
    value: 'West Virginia'
  },
  {
    id: 55,
    label: 'Wisconsin',
    value: 'Wisconsin'
  },
  {
    id: 56,
    label: 'Wyoming',
    value: 'Wyoming'
  }
];

export const groupOptions: any = [
  {id: 1, label: 'Blue'},
  {id: 2, label: 'Black'},
  {id: 3, label: 'Red'}
];

export const frequencyOptions: any = [
  {id: 1, label: 'One Time'},
  {id: 2, label: 'Daily'},
  {id: 3, label: 'Weekly'},
  {id: 4, label: 'Bi-weekly'},
  {id: 9, label: 'M/W/F'},
  {id: 10, label: 'Tu/Th'},
  {id: 5, label: 'Monthly'},
  {id: 6, label: 'Trimestral'},
  {id: 7, label: 'Quarterly'},
  {id: 8, label: 'Semestral'}
];

export const frequencyMapping: {[key: string]: {unit: any; step: number}} = {
  Weekly: {unit: 'week', step: 1},
  Monthly: {unit: 'month', step: 1},
  Trimestral: {unit: 'month', step: 4},
  Quarterly: {unit: 'month', step: 3},
  Semestral: {unit: 'month', step: 6},
  'M/W/F': {unit: 'day', step: 1},
  'Tu/Th': {unit: 'day', step: 1},
  'One Time': {unit: 'day', step: 1},
  Daily: {unit: 'day', step: 1}
};

export const weekdaysOption: any = [
  {id: 1, label: 'Monday'},
  {id: 2, label: 'Tuesday'},
  {id: 3, label: 'Wednesday'},
  {id: 4, label: 'Thursday'},
  {id: 5, label: 'Friday'}
];

export const targetAudienceForIconoclast = [
  {id: 1, label: 'Middle School', value: 'Middle School'},
  {id: 2, label: 'High School', value: 'High School'},
  {id: 3, label: 'All', value: 'All'}
];

export const periodOptions = [
  {id: 1, label: '.25', value: '.25'},
  {id: 2, label: '.33', value: '.33'},
  {id: 3, label: '.5', value: '.5'},
  {id: 4, label: '.66', value: '.66'},
  {id: 5, label: '.75', value: '.75'},
  {id: 6, label: '1', value: '1'},
  {id: 7, label: '2', value: '2'},
  {id: 8, label: '3', value: '3'},
  {id: 9, label: '4', value: '4'},
  {id: 10, label: '5', value: '5'}
];

export const typeList = [
  {
    id: 1,
    label: 'ONLINE',
    value: 'ONLINE'
  },
  {
    id: 2,
    label: 'TRADITIONAL',
    value: 'TRADITIONAL'
  }
];

export const methods = [
  {
    id: 1,
    label: 'Performer',
    value: TeachingStyle.PERFORMER
  },
  {
    id: 2,
    label: 'Academic',
    value: TeachingStyle.ACADEMIC
  }
];

export const scopeList = [
  {id: 0, label: 'Public', value: 'public'},
  {id: 1, label: 'Private', value: 'private'}
];
