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
      lessonID
      lesson {
        id
        title
        type
        instructions
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
          additionalContent {
            video
            links {
              type
              text
              link
            }
          }
        }
        language
        summary
        connection
        keywords {
          items {
            wordID
            word {
              word
              definition
            }
          }
        }
        objectives
        checkpoints {
          items {
            position
            checkpoint {
              id
              instructions
              label
              type
              questions {
                items {
                  required
                  question {
                    id
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
                id
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
            textExample
            titleExample
            example
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
        assessmentID
        assessment {
          id
          title
          type
          openingMessage
          closingMessage
          checkpoints {
            items {
              checkpoint {
                id
                instructions
                label
                type
                questions {
                  items {
                    required
                    question {
                      id
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
        }
        createdAt
        updatedAt
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

export const getClassroomStudent = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      open
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
      lessonID
      lesson {
        id
        title
        type
        instructions
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
          additionalContent {
            video
            links {
              type
              text
              link
            }
          }
        }
        language
        connection
        keywords {
          items {
            wordID
            word {
              word
              definition
            }
          }
        }
        summary
        objectives
        checkpoints {
          items {
            position
            checkpoint {
              id
              title
              instructions
              label
              type
              questions {
                items {
                  required
                  question {
                    id
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
                id
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
            example
            textExample
            titleExample
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
        assessmentID
        assessment {
          id
          title
          type
          openingMessage
          closingMessage
          checkpoints {
            items {
              checkpoint {
                id
                instructions
                label
                type
                questions {
                  items {
                    required
                    question {
                      id
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
        }
        createdAt
        updatedAt
      }
      lessonPlan {
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

export const getStudentData = /* GraphQL */ `
  query GetStudentData($classroomID: ID!, $studentID: String!) {
    getStudentData(classroomID: $classroomID, studentID: $studentID) {
      id
      lessonProgress
      status
      saveType
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