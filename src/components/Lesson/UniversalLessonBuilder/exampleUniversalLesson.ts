import { UniversalLesson } from '../../../interfaces/LessonComponentsInterfaces';

const exampleFetch: UniversalLesson = {
  id: 'lesson_1',
  syllabusID: 'syllabus_1',
  description: 'This is the first lesson created with the universal lesson builder!',
  designers: ['Jasper Verbon', 'Michael Russell'],
  teachers: ['Marlon X.'],
  categories: ['Social Skills', 'Emotions', 'Creativity', 'Literature'],
  universalLessonPlan: [
    { enabled: true, open: true, active: true, label: 'Introduction', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Story', displayMode: 'SELF' },
  ],
  universalLessonPages: [
    {
      id: 'page_1',
      description: 'Introduction to this Class',
      class: 'grid grid-cols-1 gap-2',
      pageContent: [
        {
          id: 'page_1_part_1',
          partType: 'default',
          class: 'grid grid-cols-1 gap-2',
          partContent: ['<p>Hello World</p>'],
        },
      ],
    },
    {
      id: 'page_2',
      description: 'Writing a Shakespearean Story',
      class: 'grid grid-cols-1 gap-2',
      pageContent: [
        {
          id: 'page_2_part_1',
          partType: 'default',
          class: 'grid grid-cols-2 gap-2',
          partContent: ['<p>Hello World</p>', '<img src="https://www.google.com/image.jpg" alt=""/>'],
        },
      ],
    },
    {
      id: 'page_3',
      description: 'Exercise in 3 Columns x 3 Rows',
      class: 'grid grid-cols-3 gap-2',
      pageContent: [
        {
          id: 'page_3_part_1',
          partType: 'default',
          class: '',
          partContent: ['<span>Top left...</span>'],
        },
        {
          id: 'page_3_part_2',
          partType: 'default',
          class: '',
          partContent: ['<span>Center top...</span>'],
        },
        {
          id: 'page_3_part_3',
          partType: 'default',
          class: '',
          partContent: ['<span>Top right...</span>'],
        },
        {
          id: 'page_3_part_4',
          partType: 'default',
          class: '',
          partContent: ['<span>Mid Left...</span>'],
        },
        {
          id: 'page_3_part_5',
          partType: 'default',
          class: 'grid grid-cols-2 gap-2',
          partContent: [
            '<span>Mid center L...</span>',
            '<span>Mid center R...</span>',
          ],
        },
      ],
    },
  ],
};
