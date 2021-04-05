import { UniversalLessonStudentData } from '../../../interfaces/LessonComponentsInterfaces';

const exampleStudentDataMutation: UniversalLessonStudentData = {
  id: '000001',
  universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482',
  universalLessonPageID: 'page_2',
  studentAuthID: '9101f663-f819-4180-9d31-63afd81d7b56',
  studentID: 'jasperprague@yopmail.com',
  currentLocation: '2',
  lessonProgress: '2',
  anthologyContent: [],
  pageData: [
    {
      pagePartID: 'page_2_part_1',
      pagePartInput: [
        {
          domID: 'title',
          input: 'My story title',
        }, {
          domID: 'story',
          input: 'My story content',
        },
      ],
    },
    {
      pagePartID: 'page_2_part_2',
      pagePartInput: [
        {
          domID: 'culture',
          input: 'Dutch'
        },{
          domID: 'storyteller',
          input: 'Grandmother'
        },{
          domID: 'lessons',
          input: 'Perseverance'
        }
      ]
    }
  ],
};
