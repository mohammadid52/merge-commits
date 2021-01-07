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
      classroomID
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
      classroomID
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
      questionID
      classroomID
      email
      authID
      response
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
      classroomID
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
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
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

export const updateStaff = /* GraphQL */ `
  mutation UpdateStaff($input: UpdateStaffInput!, $condition: ModelStaffConditionInput) {
    updateStaff(input: $input, condition: $condition) {
      id
      status
    }
  }
`;
export const updateServiceProviderStatus = /* GraphQL */ `
  mutation UpdateServiceProvider(
    $input: UpdateServiceProviderInput!
    $condition: ModelServiceProviderConditionInput
  ) {
    updateServiceProvider(input: $input, condition: $condition) {
      id
      status
    }
  }
`;
