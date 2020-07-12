export const getPerson = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      id
      authId
      status
      email
      role
      firstName
      preferredName
      lastName
      language
    }
  }
`;

export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      courseID
      lessonID
      lessonPlan {
        stage
        type
        breakdown
      }
      artist {
        images
        name
        bio
      }
      quotes {
        text
        source
      }
      warmUp {
        id
        title
        label
        stage
        type
        language
        instructions {
          video
          link
          text
        }
        inputs {
          title
          additionalInputs {
            name
            prompt
            example
          }
        }
        breakdown {
          included
          reflectionQuestions
        }
      }
      coreLesson {
        id
        title
        label
        stage
        type
        language
        instructions {
          video
          link
          text
        }
        content {
          video
          link
          title
          artist
          text
        }
        tools {
          name
          color
          icon
        }
        breakdown {
          included
          reflectionQuestions
        }
      }
      activity {
        id
        title
        label
        stage
        type
        language
        instructions {
          video
          link
          text
        }
        lineNumber
        writingPrompts {
          id
          name
          prompt
          example
        }
        breakdown {
          included
          reflectionQuestions
        }
      }
    }
  }
`;

export const getClassroomDataTest = /* GraphQL */ `
  query GetClassroomDataTest($classroomID: ID!, $studentID: String!) {
    getClassroomDataTest(classroomID: $classroomID, studentID: $studentID) {
      lessonProgress
      classroomID
      studentID
      data {
        warmup {
          story
          title
          additional {
            name
            input
          }
        }
        corelesson {
          selected {
            id
            anchor
            focus
            color
            content {
              id
              text
            }
          }
        }
        activity {
          editInput
          editMode
          title
          lines {
            example
            id
            menuOpen
            text
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;