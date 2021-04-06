const exampleFinalTeacherContext = {
  status: 'loaded',
  universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482', // formerly: syllabusLessonID
  universalLessonPageID: 'page_2',
  roster: [{}],
  studentDataUpdated: false,
  lessonData: {},
  pages: [ //contains: lessonData.universalLessonPlan
    { enabled: true, open: true, active: true, label: 'Introduction', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Story', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Story Breakdown', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Core Lesson', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Core Lesson Breakdown', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Activity', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Activity Breakdown', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Checkpoint', displayMode: 'SELF' },
    { enabled: true, open: false, active: false, label: 'Outro', displayMode: 'SELF' },
  ],
  sharing: false,
  displayData:{},
  studentViewing: {
    live: true,
    studentInfo:{
      id: '000001',
      universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482',
      universalLessonPageID: 'page_2',
      studentAuthID: '9101f663-f819-4180-9d31-63afd81d7b56',
      studentID: 'jasperprague@yopmail.com',
      currentLocation: '2',
      lessonProgress: '2',
      anthologyContent: [{}],
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
    }
  },
  open: false,
};