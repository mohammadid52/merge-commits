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


export const listLessonPlans = /* GraphQL */ `
  query ListClassrooms {
    listClassrooms {
      items {
        lessonPlan {
          active
          disabled
          displayMode
          id
          open
          stage
          type
        }
        lessonID
      }
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

export const listPersons = /* GraphQL */ `
  query ListPersons($filter: ModelPersonFilterInput, $sortDirection: ModelSortDirection) {
    listPersons(filter: $filter, sortDirection: $sortDirection) {
      items {
        id
        authId
        email
        role
        type
        firstName
        preferredName
        lastName
        image
      }
      nextToken
    }
  }
`;

export const listClassStudents = /* Graph QL */ `
  query ListClassStudents($studentID: ID) {
    listClassStudents(filter: {studentID: {contains: $studentID}}) {
      items {
        classID
        studentID
      }
    }
}
`;

/**
 * QUERY BELOW MADE BY AMAN, THE KING
 */
export const listRooms = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        classID
        teacherAuthID
        teacherEmail
        name
        maxPersons
        activeSyllabus
      }
      nextToken
    }
  }
`;

export const listRoomCurriculums = /* GraphQL */ `
  query ListRoomCurriculums($filter: ModelRoomCurriculumFilterInput, $limit: Int, $nextToken: String) {
    listRoomCurriculums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        roomID
        curriculumID
      }
      nextToken
    }
  }
`;

export const listSyllabuss = /* GraphQL */ `
  query ListSyllabuss(
    $filter: ModelSyllabusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSyllabuss(filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items {
        id
        name
        type
        description
        methodology
        policies
        pupose
        objectives
        curriculumID
        languages
        lessons {
          nextToken
        }
        designers
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getSyllabusLesson = /* GraphQL */ `
  query GetSyllabusLesson($id: ID!) {
    getSyllabusLesson(id: $id) {
      id
      status
      endDate
      startDate
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

export const listSyllabusLessons = /* GraphQL */ `
  query ListSyllabusLessons($syllabusID: ID) {
    listSyllabusLessons(filter: { syllabusID: { contains: $syllabusID } }) {
      nextToken
      items {
        id
        status
        complete
        lesson {
          SELStructure
          title
          type
          updatedAt
          artist {
            id
            images
            name
            type
            bio
          }
          summary
        }
        endDate
        startDate
        createdAt
        updatedAt
        syllabusID
        lessonID
      }
    }
  }
`;

export const listAllSyllabusLessons = /* GraphQL */ `
  query ListSyllabusLessons {
    listSyllabusLessons {
      nextToken
      items {
        id
        status
        complete
        createdAt
        updatedAt
        syllabusID
        lessonID
      }
    }
  }
`;

export const getStudentData = /* GraphQL */ `
  query GetStudentData($syllabusLessonID: ID!, $studentID: String!) {
    getStudentData(syllabusLessonID: $syllabusLessonID, studentID: $studentID) {
      id
      lessonProgress
      currentLocation
      status
      saveType
      syllabusLessonID
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

export const getPersonLocation = /* GraphQL */ `
  query GetPersonLocation($personAuthID: String!, $personEmail: String!) {
    getPersonLocation(personAuthID: $personAuthID, personEmail: $personEmail) {
      currentLocation
      id
      lessonProgress
      personAuthID
      personEmail
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

export const listServiceProviders = /* GraphQL */ `
  query ListInstitutions(
    $id: ID
    $filter: ModelInstitutionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInstitutions(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
      items {
        id
        name
        image
        isServiceProvider
      }
      nextToken
    }
  }
`;

export const getInstitution = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      isServiceProvider
      serviceProviders {
        items {
          id
          partnerID
          providerID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;

export const GetInstitutionDetails = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
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
      serviceProviders {
        items {
          id
          partnerID
          providerID
          status
          providerInstitution {
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
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      staff {
        items {
          id
          institutionID
          staffAuthID
          staffEmail
          status
          statusChangeDate
          createdAt
          updatedAt
        }
        nextToken
      }
      rooms {
        items {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          name
          maxPersons
          filters
          createdAt
          updatedAt
        }
        nextToken
      }
      curricula {
        items {
          id
          institutionID
          name
          type
          description
          objectives
          languages
          createdAt
          updatedAt
        }
        nextToken
      }
      classes {
        items {
          id
          institutionID
          type
          name
          createdAt
          updatedAt
        }
        nextToken
      }
      filters
      createdAt
      updatedAt
    }
  }
`;

export const getClassDetails = /* GraphQL */ `
  query GetClassDetails($id: ID!) {
    getClass(id: $id) {
      id
      institutionID
      type
      name
      institution {
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
        serviceProviders {
          nextToken
        }
        staff {
          nextToken
        }
        rooms {
          nextToken
        }
        curricula {
          nextToken
        }
        classes {
          nextToken
        }
        filters
        createdAt
        updatedAt
      }
      rooms {
        items {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          name
          maxPersons
          filters
          createdAt
          updatedAt
        }
        nextToken
      }
      students {
        items {
          id
          classID
          studentID
          studentEmail
          studentAuthID
          status
          createdAt
          updatedAt
          student {
            id
            firstName
            preferredName
            lastName
            image
          }
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const listTopics = /* GraphQL */ `
  query ListTopics($filter: ModelTopicFilterInput, $sortDirection: ModelSortDirection) {
    listTopics(filter: $filter, sortDirection: $sortDirection) {
      items {
        id
        curriculumID
        name
        description
        learningObjectiveID
        learningObjective {
          name
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listLessonsTitles = /* GraphQL */ `
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
        language
        designers
        lessonPlan {
          type
          LessonComponentID
          sequence
          stage
        }
      }
      nextToken
    }
  }
`;

export const getTopicDetails = /* GraphQL */ `
  query GetTopic($id: ID!) {
    getTopic(id: $id) {
      id
      curriculumID
      learningObjectiveID
      learningObjective {
        id
        name
      }
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const listRubrics = /* GraphQL */ `
  query ListRubrics($filter: ModelRubricFilterInput, $sortDirection: ModelSortDirection) {
    listRubrics(filter: $filter, sortDirection: $sortDirection) {
      items {
        id
        name
        criteria
        distinguished
        excelled
        adequite
        basic
        topicID
        topic {
          id
          name
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getRubric = /* GraphQL */ `
  query GetRubric($id: ID!) {
    getRubric(id: $id) {
      id
      name
      criteria
      distinguished
      excelled
      adequite
      basic
      topicID
      topic {
        id
        name
      }
      curriculumID
      createdAt
      updatedAt
    }
  }
`;

export const messagesByRoomId = /* GraphQL */ `
  query MessagesByRoomId(
    $roomID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelRoomMsgsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByRoomID(
      roomID: $roomID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getCurriculum = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      name
      type
      description
      objectives
      languages
      institution {
        id
        name
      }
      designers
      syllabi {
        items {
          id
          name
          type
          description
          methodology
          policies
          pupose
          objectives
          curriculumID
          languages
          designers
          status
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

export const getLesson = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      title
      type
      language
      purpose
      designers
      objectives
      introductionTitle
      instructionsTitle
      summaryTitle
      introduction
      instructions
      summary
      lessonPlan {
        type
        LessonComponentID
        sequence
        stage
      }
      measurements {
        nextToken
      }
    }
  }
`;
export const listCheckpoints = /* GraphQL */ `
  query ListCheckpoints($filter: ModelCheckpointFilterInput, $limit: Int, $nextToken: String) {
    listCheckpoints(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        title
        subtitle
        id
        questions {
          nextToken
          items {
            question {
              id
              label
              question
              type
              options {
                color
                icon
                label
                text
              }
            }
            checkpointID
            createdAt
            id
          }
        }
        instructions
        instructionsTitle
        label
      }
    }
  }
`;

export const listLessonRubricss = /* GraphQL */ `
  query ListLessonRubricss($filter: ModelLessonRubricsFilterInput, $limit: Int, $nextToken: String) {
    listLessonRubricss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lessonID
        rubricID
        rubric {
          id
          name
          topicID
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getPersonData = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      id
      authId
      email
      classes {
        items {
          classID
          class {
            id
            institutionID
            institution {
              name
              checkpoints {
                items {
                  type
                  typeID
                  checkpoint {
                    id
                    label
                    title
                    questions {
                      items {
                        id
                        required
                        question {
                          id
                          label
                          type
                          question
                        }
                      }
                    }
                  }
                }
              }
            }
            rooms {
              items {
                id
                curricula {
                  items {
                    curriculumID
                    curriculum {
                      name
                      checkpoints {
                        items {
                          type
                          typeID
                          checkpoint {
                            id
                            label
                            title
                            questions {
                              items {
                                id
                                required
                                question {
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
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  nextToken
                }
              }
              nextToken
            }
          }
        }
        nextToken
      }
    }
  }
`;
export const getCurriculumCheckpoints = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      checkpoints {
        items {
          id
          type
          typeID
          checkpointID
          checkpoint {
            title
            subtitle
          }
        }
      }
    }
  }
`;
export const getCheckpointDetails = /* GraphQL */ `
  query GetCheckpoint($id: ID!) {
    getCheckpoint(id: $id) {
      id
      label
      title
      stage
      type
      questions {
        items {
          id
          questionID
          required
          question {
            id
            label
            type
            question
            designers
            language
            sourceId
            note
            options {
              text
              label
              icon
              color
            }
            createdAt
            updatedAt
          }
        }
        nextToken
      }
      designers
      language
    }
  }
`;

export const listQuestionDatas = /* GraphQL */ `
  query ListQuestionDatas(
    $filter: ModelQuestionDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        syllabusLessonID
        checkpointID
        email
        authID
        person {
          id
          authId
          status
          email
          role
          type
          firstName
          preferredName
          lastName
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          image
          language
          filters
          lastLoggedIn
          lastLoggedOut
          createdAt
          updatedAt
        }
        componentType
        scheduleID
        lessonID
        responseObject {
          qid
          response
        }
        syllabusLesson {
          id
          syllabusID
          lessonID
          unit
          sequence
          status
          complete
          roster
          viewing
          startDate
          endDate
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
