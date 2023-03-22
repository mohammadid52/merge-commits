export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson {
    onUpdatePerson {
      id
      authId
      email
      pageState
      lastPageStateUpdate
      status
    }
  }
`;

export const onChangeRoom = /* GraphQL */ `
  subscription OnChangeRoom($id: ID!) {
    onChangeRoom(id: $id) {
      id
      activeLessonId
      ClosedPages
      disabledPages
      studentViewing
      displayData {
        isTeacher
        studentAuthID
        lessonPageID
      }
      currentPage
      createdAt
      updatedAt
    }
  }
`;

export const onChangeUniversalLessonStudentData = /* GraphQL */ `
  subscription OnChangeUniversalLessonStudentData(
    $syllabusLessonID: ID!
    $lessonID: ID!
    $studentAuthID: ID!
  ) {
    onChangeUniversalLessonStudentData(
      syllabusLessonID: $syllabusLessonID
      lessonID: $lessonID
      studentAuthID: $studentAuthID
    ) {
      id
      syllabusLessonID
      lessonID
      lesson {
        id
        type
        label
        title
        institutionID

        lessonPlan {
          id
          title
          label
          class
          active
          disabled
          open
        }
      }
      lessonPageID
      studentID
      studentAuthID
      studentEmail
      roomID
      currentLocation
      lessonProgress
      pageData {
        domID
        options
        input
        comments {
          commentBy
          comment
        }
        hasTakenSurvey
      }
      hasExerciseData
      exerciseData {
        id
        entryData {
          domID
          type
          input
        }
        feedbacks
        shared
      }
      date
      createdAt
      updatedAt
    }
  }
`;
