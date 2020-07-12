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
        warmUpData {
          story
          title
        }
        activityData {
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