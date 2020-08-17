export const createClassroomData = /* GraphQL */ `
  mutation CreateClassroomData(
    $input: CreateClassroomDataInput!
    $condition: ModelClassroomDataConditionInput
  ) {
    createClassroomData(input: $input, condition: $condition) {
      classID
      lessonProgress
      studentID
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;

export const createClassroomDataTest = /* GraphQL */ `
  mutation CreateClassroomDataTest(
    $input: CreateClassroomDataTestInput!
    $condition: ModelClassroomDataTestConditionInput
  ) {
    createClassroomDataTest(input: $input, condition: $condition) {
      lessonProgress
      classroomID
      studentID
      data {
        warmup {
          story
          title
        }
        activity {
          editInput
          editMode
          title
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateClassroomDataTest = /* GraphQL */ `
  mutation UpdateClassroomDataTest(
    $input: UpdateClassroomDataTestInput!
    $condition: ModelClassroomDataTestConditionInput
  ) {
    updateClassroomDataTest(input: $input, condition: $condition) {
      lessonProgress
      classroomID
      studentID
      data {
        warmup {
          story
          title
        }
        activity {
          editInput
          editMode
          title
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
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