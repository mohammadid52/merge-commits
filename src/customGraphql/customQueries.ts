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
      open
      roster
      displayData {
        breakdownComponent
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
      lessonID
      lesson {
        id
        title
        artist {
          id
          images
          name
          type
          bio
          quotes {
            source
            text
          }
        }
        language
        summary
        objectives
        checkpoints {
          items {
            position
            checkpoint {
              instructions
              label
              type
              questions {
                items {
                  required
                  question {
                    label
                    type
                    question
                    options {
                        text
                        icon
                        color
                        
                    }
                  }
                }
                nextToken
              }
            }
          }
          nextToken
        }
        doFirstID
        doFirst {
          id
          type
          required
          questions {
            items {
              question {
                label
                type
                question
                options {
                    text
                    icon
                    color
                    
                }
              }
            }
            nextToken
          }
        }
        warmUpId
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
              id
              name
              prompt
              example
            }
          }
          breakdown {
            reflectionQuestions
          }
        }
        coreLessonId
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
            reflectionQuestions
          }
        }
        activityId
        activity {
          id
          title
          label
          stage
          type
          language
          lineNumber
          instructions {
            video
            link
            text
          }
          writingPrompts {
            id
            name
            prompt
            example
          }
          breakdown {
            reflectionQuestions
          }
        }
      }
      lessonPlan {
        disabled
        open
        active
        stage
        type
        displayMode
      }
      # data {
      #   items {
      #     id
      #     lessonProgress
      #     status
      #     live
      #     classroomID
      #     studentID
      #     createdAt
      #     updatedAt
      #   }
      #   nextToken
      # }
      createdAt
      updatedAt
    }
  }
`;

export const getStudentData = /* GraphQL */ `
  query GetStudentData($classroomID: ID!, $studentID: String!) {
    getStudentData(classroomID: $classroomID, studentID: $studentID) {
      id
      lessonProgress
      status
      live
      classroomID
      studentID
      warmupData {
        story
        title
        additional {
          name
          input
        }
      }
      corelessonData {
        selected {
          anchor
          color
          focus
          id
        }
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