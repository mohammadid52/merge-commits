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

export const onUpdateClassroom = /* GraphQL */ `
  subscription onUpdateClassroom($id: ID!) {
    onUpdateClassroom(id: $id) {
      id
      open
      lessonID
      roster
      viewing
      displayData {
        breakdownComponent
        studentInfo {
          id
          firstName
          preferredName
          lastName
        }
        warmUpData {
          story
          title
          additional {
            name
            input
          }
          truthGame {
            id
            label
            isLie
            text
          }
          poll {
            id
            question
            option {
              id
              option
              isChoice
            }
          }
        }
        corelessonData {
          selected {
            anchor
            color
            content {
              id
              text
            }
            focus
            id
          }
          rawSelected {
            color
            selected
          }
          selectGroup
        }
        activityData {
          editInput
          editMode
          lines {
            example
            id
            menuOpen
            text
          }
          title
        }
      }
      lessonPlan {
        id
        disabled
        open
        active
        stage
        type
        displayMode
      }
      createdAt
      updatedAt
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

export const onChangeSyllabusLesson = /* GraphQL */ `
  subscription OnChangeSyllabusLesson($id: ID!) {
    onChangeSyllabusLesson(id: $id) {
      id
      syllabusID
      lessonID
      unit
      sequence
      status
      complete
      roster
      viewing
      displayData {
        breakdownComponent
        studentInfo {
          id
          firstName
          preferredName
          lastName
        }
        warmUpData {
          story
          title
        }
        corelessonData {
          selectGroup
        }
        activityData {
          editInput
          editMode
          title
        }
      }
      lessonPlan {
        id
        disabled
        open
        active
        stage
        type
        displayMode
      }
      startDate
      endDate
      createdAt
      updatedAt
    }
  }
`;

export const onChangeStudentData = /* GraphQL */ `
  subscription onChangeStudentData($syllabusLessonID: ID!) {
    onChangeStudentData(syllabusLessonID: $syllabusLessonID) {
      id
      lessonProgress
      currentLocation
      status
      saveType
      syllabusLessonID
      studentID
      studentAuthID
      student {
        id
        authId
        email
        firstName
        preferredName
        lastName
        language
        role
      }
      warmupData {
        story
        title
        additional {
          name
          input
        }
        truthGame {
          id
          label
          isLie
          text
        }
        poll {
          id
          question
          option {
            id
            option
            isChoice
          }
        }
      }
      corelessonData {
        selected {
          anchor
          color
          content {
            id
            text
          }
          focus
          id
        }
        rawSelected {
          color
          selected
        }
        selectGroup
      }
      activityData {
        editInput
        editMode
        lines {
          example
          id
          menuOpen
          text
        }
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const onDeleteRoomMsgs = /* GraphQL */ `
  subscription OnDeleteRoomMsgs {
    onDeleteRoomMsgs {
      id
    }
  }
`;

export const onCreateRoomMsgs = /* GraphQL */ `
  subscription OnCreateRoomMsgs {
    onCreateRoomMsgs {
      id
      body
      sender {
        id
        email
        firstName
        preferredName
        lastName
        image
      }
      createdAt
      updatedAt
    }
  }
`;

export const onUpdateRoomMsgs = /* GraphQL */ `
  subscription OnUpdateRoomMsgs {
    onUpdateRoomMsgs {
      id
      body
      createdAt
      updatedAt
    }
  }
`;
