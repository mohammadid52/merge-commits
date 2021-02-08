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