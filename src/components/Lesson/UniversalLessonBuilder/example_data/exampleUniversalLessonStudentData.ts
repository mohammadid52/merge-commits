import {UniversalLessonStudentData} from '../../../../interfaces/UniversalLessonInterfaces';

/**
 *
 * THIS DATA IS UPDATED AS PAGE IS MODIFIED AND GETS STORED IN
 *
 *        state.componentState.
 *
 *        -or-
 *
 *        state.studentData (would have to be created)
 *
 */

export const exampleStudentDataMutation: UniversalLessonStudentData = {
  id: '000001',
  universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482',
  universalLessonPageID: 'page_2',
  studentAuthID: '9101f663-f819-4180-9d31-63afd81d7b56',
  studentID: 'jasperprague@yopmail.com',
  currentLocation: '2',
  lessonProgress: '2',
  pageData: [
    {
      domID: 'title',
      input: ['My story title'],
      comments: [{commentBy: 'xxx', comment: 'abc'}],
    },
    {
      domID: 'story',
      input: ['My story content'],
      comments: [{commentBy: 'xxx', comment: 'abc'}],
    },

    {
      domID: 'culture',
      input: ['Dutch'],
      comments: [{commentBy: 'xxx', comment: 'abc'}],
    },
    {
      domID: 'storyteller',
      input: ['Grandmother'],
      comments: [{commentBy: 'xxx', comment: 'abc'}],
    },
    {
      domID: 'lessons',
      input: ['Perseverance'],
      comments: [{commentBy: 'xxx', comment: 'abc'}],
    },
  ],
};