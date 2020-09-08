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
          additional {
            name
            input
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
                      label
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
                  label
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
      data {
        items {
          id
          lessonProgress
          status
          live
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
          }
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
              content {
                id
                text
              }
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
          # doFirstData {
          #   items {
          #     id
          #     studentDataID
          #     questionDataID
          #     createdAt
          #     updatedAt
          #   }
          #   nextToken
          # }
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

export const getStudentData = /* GraphQL */ `
  query GetStudentData($classroomID: ID!, $studentID: String!) {
    getStudentData(classroomID: $classroomID, studentID: $studentID) {
      id
      lessonProgress
      status
      live
      classroomID
      studentID
      studentAuthID
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
          content {
            id
            text
          }
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
      createdAt
      updatedAt
    }
  }
`;
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      classID
      class {
        id
        name
        students {
          items {
            student {
              id
              authId
              status
              email
              firstName
              preferredName
              lastName
              language
            }
          } 
          nextToken
        }
        createdAt
        updatedAt
      }
      curriculumID
      curriculum {
        id
        name
        languages
        lessons {
          items {
            lesson {
              title
              artist {
                id
                images
                name
                type
              }
              language
              summary
            }
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      location
      startDate
      endDate
      duration
      createdAt
      updatedAt
    }
  }
`;