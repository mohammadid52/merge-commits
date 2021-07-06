/**
 * THIS WILL CHANGE BECAUSE OF
 * TYPE DEFINITION UPDATES
 */

const exampleFinalTeacherContext = {
  status: 'loaded',
  // universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482', // formerly: syllabusLessonID
  // universalLessonPageID: 'page_2',
  roster: [{}],
  studentDataUpdated: false,
  // lessonData: {},
  // pages: [
  //   //contains: lessonData.universalLessonPlan
  //   {enabled: true, open: true, active: true, label: 'Introduction', displayMode: 'SELF'},
  //   {enabled: true, open: false, active: false, label: 'Story', displayMode: 'SELF'},
  //   {
  //     enabled: true,
  //     open: false,
  //     active: false,
  //     label: 'Story Breakdown',
  //     displayMode: 'SELF',
  //   },
  //   {
  //     enabled: true,
  //     open: false,
  //     active: false,
  //     label: 'Core Lesson',
  //     displayMode: 'SELF',
  //   },
  //   {
  //     enabled: true,
  //     open: false,
  //     active: false,
  //     label: 'Core Lesson Breakdown',
  //     displayMode: 'SELF',
  //   },
  //   {enabled: true, open: false, active: false, label: 'Activity', displayMode: 'SELF'},
  //   {
  //     enabled: true,
  //     open: false,
  //     active: false,
  //     label: 'Activity Breakdown',
  //     displayMode: 'SELF',
  //   },
  //   {enabled: true, open: false, active: false, label: 'Checkpoint', displayMode: 'SELF'},
  //   {enabled: true, open: false, active: false, label: 'Outro', displayMode: 'SELF'},
  // ],
  sharing: false,
  displayData: [
    //contains: student's shared BreakdownData
    {
      id: '000002', // studentDataID
      universalLessonID: '3gd3g2cb-6699-4d8c-9b03-383310a56482',
      universalLessonPageID: 'page_2',
      studentAuthID: '9101f663-f819-4180-9d31-63afd81d7b56',
      studentID: 'otherstudent@yopmail.com',
      pageData: [
        {
          pagePartID: 'page_2_part_1',
          studentPageInput: [
            {
              domID: 'title',
              input: "Another student's title",
            },
            {
              domID: 'story',
              input: 'A story that another student wrote',
            },
          ],
        },
        {
          pagePartID: 'page_2_part_2',
          studentPageInput: [
            {
              domID: 'culture',
              input: 'Dutch',
            },
            {
              domID: 'storyteller',
              input: 'Grandmother',
            },
            {
              domID: 'lessons',
              input: 'Perseverance',
            },
          ],
        },
      ],
    },
  ],
  studentViewing: '00000001',
  // studentViewing: {
  //   live: true,
  //   studentInfo: {
  //     id: '000001',
  //     universalLessonID: '7ad8e2ce-2882-4d8c-9b03-383310a56482',
  //     universalLessonPageID: 'page_2',
  //     studentAuthID: '9101f663-f819-4180-9d31-63afd81d7b56',
  //     studentID: 'jasperprague@yopmail.com',
  //     currentLocation: '2',
  //     lessonProgress: '2',
  //     anthologyContent: [{}],
  //     pageData: [
  //       {
  //         pagePartID: 'page_2_part_1',
  //         studentPageInput: [
  //           {
  //             domID: 'title',
  //             input: 'My story title',
  //           },
  //           {
  //             domID: 'story',
  //             input: 'My story content',
  //           },
  //         ],
  //       },
  //       {
  //         pagePartID: 'page_2_part_2',
  //         studentPageInput: [
  //           {
  //             domID: 'culture',
  //             input: 'Dutch',
  //           },
  //           {
  //             domID: 'storyteller',
  //             input: 'Grandmother',
  //           },
  //           {
  //             domID: 'lessons',
  //             input: 'Perseverance',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
};