export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson($input: UpdatePersonInput!, $condition: ModelPersonConditionInput) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      status
      email
      role
      firstName
      preferredName
      lastName
      grade
      phone
      birthdate
      image
      language
    }
  }
`;

export const updatePersonLoginTime = /* GraphQL */ `
  mutation UpdatePerson($input: UpdatePersonInput!, $condition: ModelPersonConditionInput) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      email
      lastLoggedIn
    }
  }
`;

export const updatePersonLogoutTime = /* GraphQL */ `
  mutation UpdatePerson($input: UpdatePersonInput!, $condition: ModelPersonConditionInput) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      email
      lastLoggedIn
    }
  }
`;

export const createStudentData = /* GraphQL */ `
  mutation CreateStudentData($input: CreateStudentDataInput!, $condition: ModelStudentDataConditionInput) {
    createStudentData(input: $input, condition: $condition) {
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
      doFirstData {
        items {
          id
          studentDataID
          questionDataID
          createdAt
          updatedAt
        }
        nextToken
      }
      checkpointData {
        items {
          id
          studentDataID
          questionDataID
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateStudentData = /* GraphQL */ `
  mutation UpdateStudentData($input: UpdateStudentDataInput!, $condition: ModelStudentDataConditionInput) {
    updateStudentData(input: $input, condition: $condition) {
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

export const updateClassroom = /* GraphQL */ `
  mutation UpdateClassroom($input: UpdateClassroomInput!, $condition: ModelClassroomConditionInput) {
    updateClassroom(input: $input, condition: $condition) {
      id
      open
      lessonID
      roster
      complete
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

export const updateClassroomDate = /* GraphQL */ `
  mutation UpdateClassroom($input: UpdateClassroomInput!, $condition: ModelClassroomConditionInput) {
    updateClassroom(input: $input, condition: $condition) {
      id
      open
      lessonID
      roster
      complete
      expectedStartDate
      expectedEndDate
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

export const createQuestionData = /* GraphQL */ `
  mutation CreateQuestionData($input: CreateQuestionDataInput!, $condition: ModelQuestionDataConditionInput) {
    createQuestionData(input: $input, condition: $condition) {
      id
      syllabusLessonID
      email
      authID
      componentType
      lessonID
      scheduleID
      responseObject {
        qid
        response
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateSurveyStatus = /* GraphQL */ `
  mutation UpdatePerson($input: UpdatePersonInput!, $condition: ModelPersonConditionInput) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      email
      onBoardSurvey
    }
  }
`;

export const createFeedback = /* GraphQL */ `
  mutation CreateFeedback($input: CreateFeedbackInput!, $condition: ModelFeedbackConditionInput) {
    createFeedback(input: $input, condition: $condition) {
      id
      syllabusLessonID
      liked
      comment
      createdAt
      updatedAt
    }
  }
`;

export const createInstitution = /* GraphQL */ `
  mutation CreateInstitution($input: CreateInstitutionInput!, $condition: ModelInstitutionConditionInput) {
    createInstitution(input: $input, condition: $condition) {
      id
      name
      type
      district
      address
      addressLine2
      city
      state
      zip
      phone
      website
      image
      isServiceProvider
      createdAt
      updatedAt
    }
  }
`;

export const updateInstitution = /* GraphQL */ `
  mutation UpdateInstitution($input: UpdateInstitutionInput!, $condition: ModelInstitutionConditionInput) {
    updateInstitution(input: $input, condition: $condition) {
      id
      name
      type
      district
      address
      addressLine2
      city
      state
      zip
      phone
      website
      image
      isServiceProvider
    }
  }
`;

export const createCurriculum = /* GraphQL */ `
  mutation CreateCurriculum($input: CreateCurriculumInput!, $condition: ModelCurriculumConditionInput) {
    createCurriculum(input: $input, condition: $condition) {
      id
      name
      institutionID
    }
  }
`;

export const createClass = /* GraphQL */ `
  mutation CreateClass($input: CreateClassInput!, $condition: ModelClassConditionInput) {
    createClass(input: $input, condition: $condition) {
      id
      institutionID
      name
      institution {
        id
        name
      }
    }
  }
`;

export const createClassStudent = /* GraphQL */ `
  mutation CreateClassStudent($input: CreateClassStudentInput!, $condition: ModelClassStudentConditionInput) {
    createClassStudent(input: $input, condition: $condition) {
      id
      classID
      studentID
      status
      studentEmail
      studentAuthID
    }
  }
`;

export const updateClassStudent = /* GraphQL */ `
  mutation UpdateClassStudent($input: UpdateClassStudentInput!, $condition: ModelClassStudentConditionInput) {
    updateClassStudent(input: $input, condition: $condition) {
      id
      status
    }
  }
`;

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($input: CreateRoomInput!, $condition: ModelRoomConditionInput) {
    createRoom(input: $input, condition: $condition) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      name
      maxPersons
    }
  }
`;

export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom($input: UpdateRoomInput!, $condition: ModelRoomConditionInput) {
    updateRoom(input: $input, condition: $condition) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      name
      maxPersons
      activeSyllabus
    }
  }
`;

export const updateStaff = /* GraphQL */ `
  mutation UpdateStaff($input: UpdateStaffInput!, $condition: ModelStaffConditionInput) {
    updateStaff(input: $input, condition: $condition) {
      id
      status
    }
  }
`;

export const updateServiceProviderStatus = /* GraphQL */ `
  mutation UpdateServiceProvider($input: UpdateServiceProviderInput!, $condition: ModelServiceProviderConditionInput) {
    updateServiceProvider(input: $input, condition: $condition) {
      id
      status
    }
  }
`;

export const createSyllabusLesson = /* GraphQL */ `
  mutation CreateSyllabusLesson($input: CreateSyllabusLessonInput!, $condition: ModelSyllabusLessonConditionInput) {
    createSyllabusLesson(input: $input, condition: $condition) {
      id
      syllabusID
      lessonID
      unit
      status
      sequence
      createdAt
      updatedAt
    }
  }
`;

export const createTopic = /* GraphQL */ `
  mutation CreateTopic($input: CreateTopicInput!, $condition: ModelTopicConditionInput) {
    createTopic(input: $input, condition: $condition) {
      id
      curriculumID
      learningObjectiveID
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic($input: UpdateTopicInput!, $condition: ModelTopicConditionInput) {
    updateTopic(input: $input, condition: $condition) {
      id
      learningObjectiveID
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const createRubric = /* GraphQL */ `
  mutation CreateRubric($input: CreateRubricInput!, $condition: ModelRubricConditionInput) {
    createRubric(input: $input, condition: $condition) {
      id
      name
      criteria
      distinguished
      excelled
      adequite
      basic
      topicID
      createdAt
      updatedAt
    }
  }
`;

export const updateRubric = /* GraphQL */ `
  mutation UpdateRubric($input: UpdateRubricInput!, $condition: ModelRubricConditionInput) {
    updateRubric(input: $input, condition: $condition) {
      id
      name
      criteria
      distinguished
      excelled
      adequite
      basic
      topicID
      curriculumID
      createdAt
      updatedAt
    }
  }
`;

export const updateSyllabusLesson = /* GraphQL */ `
  mutation UpdateSyllabusLesson($input: UpdateSyllabusLessonInput!, $condition: ModelSyllabusLessonConditionInput) {
    updateSyllabusLesson(input: $input, condition: $condition) {
      id
      status
      complete
      startDate
      endDate
      syllabusID
      lessonID
      lessonPlan {
        id
        disabled
        open
        active
        stage
        type
        displayMode
      }
      unit
      sequence
      status
      lesson {
        id
        title
        type
      }
      createdAt
      updatedAt
    }
  }
`;

export const createRoomMsgs = /* GraphQL */ `
  mutation CreateRoomMsgs(
    $input: CreateRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    createRoomMsgs(input: $input, condition: $condition) {
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

export const updateRoomMsgs = /* GraphQL */ `
  mutation UpdateRoomMsgs(
    $input: UpdateRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    updateRoomMsgs(input: $input, condition: $condition) {
      id
      body
      createdAt
      updatedAt
    }
  }
`;

export const deleteRoomMsgs = /* GraphQL */ `
  mutation DeleteRoomMsgs(
    $input: DeleteRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    deleteRoomMsgs(input: $input, condition: $condition) {
      id
    }
  }
`;