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
      complete
      expectedStartDate
      expectedEndDate
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
            listInputNumber
            truthGameInputs {
              id
              label
            }
            additionalInputs {
              id
              name
              prompt
              example
            }
            pollInputs {
              id
              question
              option {
                id
                option
                isChoice
              }
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
          currentLocation
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
            role
          }
          warmupData {
            story
            title
            additional {
              name
              input
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
            listInputNumber
            truthGameInputs {
              id
              label
            }
            additionalInputs {
              id
              name
              prompt
              example
            }
            pollInputs {
              id
              question
              option {
                id
                option
                isChoice
              }
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
      currentLocation
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

export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      type
      classrooms {
        items {
          id
          open
          openedAt
          closedAt
          complete
          roster
          viewing
          expectedStartDate
          expectedEndDate
          SELStructure
          courseID
          lessonID
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
          createdAt
          updatedAt
        }
        nextToken
      }
      startDate
      createdAt
      updatedAt
    }
  }
`;

export const listCurriculums = /* GraphQL */ `
  query ListCurriculums(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurriculums(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items {
        id
        name
        description
        objectives
        languages
        units {
          items {
            id
            name
            description
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listWarmUps = /* GraphQL */ `
  query ListWarmUps($filter: ModelWarmUpFilterInput, $limit: Int, $nextToken: String) {
    listWarmUps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        label
      }
      nextToken
    }
  }
`;

export const listCoreLessons = /* GraphQL */ `
  query ListCoreLessons($filter: ModelCoreLessonFilterInput, $limit: Int, $nextToken: String) {
    listCoreLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        label
      }
      nextToken
    }
  }
`;

export const listActivitys = /* GraphQL */ `
  query ListActivitys($filter: ModelActivityFilterInput, $limit: Int, $nextToken: String) {
    listActivitys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        label
      }
      nextToken
    }
  }
`;

export const listQuestions = /* GraphQL */ `
  query ListQuestions($filter: ModelQuestionFilterInput, $limit: Int, $nextToken: String) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        type
        question
        options {
          text
          label
          icon
          color
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listLessons = /* GraphQL */ `
  query ListLessons(
    $id: ID
    $filter: ModelLessonFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLessons(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items {
        id
        title
        type
        instructions
        artistID
        language
        connection
        summary
        objectives
        doFirstID
        warmUpId
        coreLessonId
        activityId
        assessmentID
        filters {
          filterID
          option
        }
      }
      nextToken
    }
  }
`;

export const listFilters = /* GraphQL */ `
  query ListFilters($filter: ModelFilterFilterInput, $limit: Int, $nextToken: String) {
    listFilters(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        options {
          id
          text
        }
      }
      nextToken
    }
  }
`;

export const listLessonFilters = /* GraphQL */ `
  query ListLessonFilters(
    $id: ID
    $filter: ModelLessonFilterFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLessonFilters(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items {
        id
        lessonID
        filterID
        optionID
        lesson {
          id
          title
        }
        filter {
          id
          name
          description
          options {
            id
            text
          }
        }
      }
      nextToken
    }
  }
`;
