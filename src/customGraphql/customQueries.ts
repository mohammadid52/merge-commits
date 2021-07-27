export const getDashboardData = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      classes {
        items {
          class {
            name
            rooms {
              items {
                id
                institutionID
                classID
                teacherAuthID
                teacherEmail
                name
                maxPersons
                activeSyllabus
                activeLessonId
                ClosedPages
                disabledPages
                studentViewing
                displayData
                currentPage
                teacher {
                  firstName
                  lastName
                  image
                  email
                  role
                  phone
                  authId
                }
                coTeachers {
                  items {
                    teacher {
                      authId
                      firstName
                      lastName
                      image
                      email
                      role
                      phone
                    }
                  }
                }
                curricula {
                  items {
                    id
                    curriculumID
                    curriculum {
                      name
                      image
                      id
                      description
                      designers
                      objectives
                      summary
                      type
                    }
                  }
                }
              }
            }
            students {
              items {
                student {
                  firstName
                  lastName
                  image
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getTeacherLookUp = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        teacherAuthID
        teacher {
          id
          authId
        }
        class {
          students {
            items {
              student {
                id
                authId
              }
            }
          }
        }
        coTeachers {
          items {
            teacher {
              id
              authId
            }
          }
        }
      }
      nextToken
    }
  }
`;

export const getDashboardDataForTeachers = /* GraphQL */ `
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
          filters
          createdAt
          updatedAt
        }
        teacher {
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
        class {
          id
          institutionID
          type
          name
          createdAt
          updatedAt
          students {
            items {
              student {
                firstName
                lastName
                image
                id
              }
            }
          }
        }
        curricula {
          items {
            id
            curriculumID
            curriculum {
              name
              image
              id
              description
              designers
              objectives
              summary
              type
            }
          }
        }
        filters
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        coTeachers {
          items {
            teacher {
              firstName
              lastName
              image
              email
              role
              phone
            }
          }
        }
        activeLessonId
        ClosedPages
        disabledPages
        studentViewing
        displayData
        currentPage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

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
export const fetchPersons = /* GraphQL */ `
  query ListPersons(
    $email: String
    $authId: ModelStringKeyConditionInput
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersons(
      email: $email
      authId: $authId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
export const listClassStudents = /* GraphQL */ `
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
        teacher {
          firstName
          preferredName
          lastName
        }
        activeLessonId
        ClosedPages
        disabledPages
        studentViewing
        displayData
        currentPage
      }
      nextToken
    }
  }
`;

export const getRoom = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      name
      maxPersons
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
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
      teacher {
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
        classes {
          nextToken
        }
        createdAt
        updatedAt
      }
      class {
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
          filters
          createdAt
          updatedAt
        }
        rooms {
          nextToken
        }
        students {
          nextToken
        }
        createdAt
        updatedAt
      }
      curricula {
        items {
          id
          roomID
          curriculumID
          createdAt
          updatedAt
        }
        nextToken
      }
      filters
      location
      startDate
      startTime
      length
      repeat
      notes
      activeSyllabus
      coTeachers {
        items {
          id
          roomID
          teacherID
          teacherEmail
          teacherAuthID
          createdAt
          updatedAt
          teacher {
            firstName
            lastName
          }
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;

export const listRoomsDashboard = /* GraphQL */ `
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
          filters
          createdAt
          updatedAt
        }
        teacher {
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
        class {
          id
          institutionID
          type
          name
          createdAt
          updatedAt
        }
        curricula {
          nextToken
          items {
            id
            curriculumID
            curriculum {
              name
            }
          }
        }
        filters
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        activeLessonId
        ClosedPages
        disabledPages
        studentViewing
        displayData
        currentPage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listRoomCurriculums = /* GraphQL */ `
  query ListRoomCurriculums(
    $filter: ModelRoomCurriculumFilterInput
    $limit: Int
    $nextToken: String
  ) {
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
    listSyllabuss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
        instructionsTitle
        instructions
        filters
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
          stage
        }
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
        purpose
        designers
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
    listSyllabusLessons(filter: {syllabusID: {contains: $syllabusID}}) {
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
          purpose
          designers
          objectives
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
    listCurriculums(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
        objectives
        languages
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listCurriculumsForLessons = /* GraphQL */ `
  query ListCurriculums(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurriculums(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        description
        objectives
        languages
        institution {
          id
          name
        }
        universalSyllabus {
          items {
            id
            name
            lessons{
              items{
                id
                lessonID
              }
            }
            curriculumID
          }
          nextToken
        }
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
  query ListCoreLessons(
    $filter: ModelCoreLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
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
  query ListActivitys(
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
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
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        label
        type
        question
        required
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
    listLessons(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
    listLessonFilters(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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

export const listUniversalLessons = /* GraphQL */ `
  query ListUniversalLessons(
    $id: ID
    $filter: ModelUniversalLessonFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessons(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        type
        label
        title
        institutionID
        language
        designers
        objectives
        purpose
        instructions
        summary
        duration
        resources
        notes
        cardImage
        cardCaption
        createdAt
        updatedAt
        lessonPlan {
          id
          title
          label
          description
          class
          active
          disabled
          displayMode
          open
          estTime
          pageContent {
            id
            tags
            partType
            class
            partContent {
              id
              type
              class
              value {
                id
                type
                label
                value
                caption
                width
                height
                options {
                  id
                  label
                  text
                }
              }
              isRequired
            }
          }
        }
      }
      nextToken
    }
  }
`;
export const listUniversalLessonsOptions = /* GraphQL */ `
  query ListUniversalLessons(
    $id: ID
    $filter: ModelUniversalLessonFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessons(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        type
        label
        title
        institutionID
        language
        lessonPlan {
          id
        }
      }
      nextToken
    }
  }
`;

export const getUniversalSyllabus = /* GraphQL */ `
  query GetUniversalSyllabus($id: ID!) {
    getUniversalSyllabus(id: $id) {
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
        items {
          id
          syllabusID
          lessonID
          unit
          sequence
          status
          complete
          roster
          viewing
          lesson {
            id
            type
            label
            title
            institutionID
            language
            designers
            objectives
            purpose
            introduction
            introductionTitle
            instructions
            instructionsTitle
            summary
            summaryTitle
            duration
            resources
            notes
            cardImage
            cardCaption
            lessonPlan {
              id
              title
              label
              description
              class
              active
              disabled
              displayMode
              open
              estTime
              activityType
              interactionType
              tags
            }
            darkMode
            rubrics
            createdAt
            updatedAt
          }
          startDate
          endDate
          createdAt
          updatedAt
        }
        nextToken
      }
      universalLessonsSeq
      designers
      status
      createdAt
      updatedAt
    }
  }
`;

export const getUniversalSyllabusData = /* GraphQL */ `
  query GetUniversalSyllabus($id: ID!) {
    getUniversalSyllabus(id: $id) {
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
      universalLessonsSeq
      designers
      status
      createdAt
      updatedAt
    }
  }
`;

export const getUniversalLesson = /* GraphQL */ `
  query GetUniversalLesson($id: ID!) {
    getUniversalLesson(id: $id) {
      id
      type
      label
      title
      institutionID
      language
      designers
      objectives
      purpose
      summary
      summaryTitle
      duration
      resources
      notes
      darkMode
      cardImage
      cardCaption
      lessonPlan {
        id
        title
        label
        description
        class
        active
        tags
        disabled
        interactionType
        displayMode
        open
        estTime
        pageContent {
          id
          tags
          partType
          class
          partContent {
            id
            type
            class
            value {
              id
              type
              label
              value
              caption
              width
              height
              options {
                id
                label
                text
              }
            }
            isRequired
          }
        }
      }
      rubrics
      createdAt
      updatedAt
    }
  }
`;

export const listInstitutions = /* GraphQL */ `
  query ListInstitutions(
    $id: ID
    $filter: ModelInstitutionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInstitutions(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
          items {
            staffAuthID
            staffEmail
          }
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
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
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
    listInstitutions(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
    listLessons(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        title
        type
        language
        designers
        lessonPlan {
          type
        }
        institutionID
        createdAt
        updatedAt
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
      distinguished
      excelled
      adequite
      basic
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
        curriculumID
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
      universalSyllabus {
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
      universalSyllabusSeq
      createdAt
      updatedAt
    }
  }
`;

export const getCurriculumUniversalSyllabusSequence = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      universalSyllabusSeq
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
      institutionID
      institution {
        id
        name
      }
      measurements {
        nextToken
      }
    }
  }
`;
export const listCheckpoints = /* GraphQL */ `
  query ListCheckpoints(
    $filter: ModelCheckpointFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCheckpoints(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        title
        subtitle
        id
        type
        language
        questions {
          nextToken
          items {
            required
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
  query ListLessonRubricss(
    $filter: ModelLessonRubricsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLessonRubricss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lessonID
        rubricID
        rubric {
          id
          name
          topicID
          curriculumID
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const userById = /* GraphQL */ `
  query UserById(
    $id: ID
    $sortDirection: ModelSortDirection
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userById(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        onDemand
        classes {
          items {
            classID
            class {
              id
              type
              name
              createdAt
              updatedAt
              institutionID
              institution {
                name
                checkpoints {
                  items {
                    type
                    typeID
                    checkpoint {
                      scope
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
                  teacher {
                    firstName
                    preferredName
                    lastName
                    image
                  }
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
                              scope
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
      status
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
                    scope
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
                            scope
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
      scope
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
          otherResponse
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

export const getCompleteLesson = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      title
      type
      label
      instructions
      instructionsTitle
      grades
      artistID
      language
      SELStructure
      connection
      summary
      purpose
      designers
      objectives
      checkpoints {
        items {
          id
          lessonID
          checkpointID
          position
          createdAt
          updatedAt
          checkpoint {
            id
            label
            title
            subtitle
            stage
            type
            instructionsTitle
            instructions
            questions {
              items {
                required
                id
                checkpointID
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
                  published
                  options {
                    text
                    label
                    icon
                    color
                  }
                }
              }
            }
            purpose
            objectives
            designers
            language
            estTime
          }
        }
        nextToken
      }
      doFirstID
      warmUpId
      coreLessonId
      filters
      coverImage
      summaryTitle
      introductionTitle
      introduction
      connectionTitle
      lessonPlan {
        type
        LessonComponentID
        sequence
        stage
      }
      measurements {
        items {
          id
          lessonID
          rubricID
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

export const getSyllabus = /* GraphQL */ `
  query GetSyllabus($id: ID!) {
    getSyllabus(id: $id) {
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
        items {
          id
          syllabusID
          lessonID
          lesson {
            title
            measurements {
              items {
                id
                lessonID
                rubricID
                rubric {
                  id
                  name
                  criteria
                  topicID
                }
                createdAt
                updatedAt
              }
              nextToken
            }
          }
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
        nextToken
      }
      designers
      status
      createdAt
      updatedAt
    }
  }
`;

// delete once lessons table updated in production
// export const listLessonsIds = /* GraphQL */ `
//   query ListLessons(
//     $id: ID
//     $filter: ModelLessonFilterInput
//     $limit: Int
//     $nextToken: String
//     $sortDirection: ModelSortDirection
//   ) {
//     listLessons(id: $id, filter: $filter, limit: $limit, nextToken: $nextToken, sortDirection: $sortDirection) {
//       items {
//         id
//       }
//       nextToken
//     }
//   }
// `;

export const getInstitutionCurriculars = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      type
      curricula {
        items {
          id
          institutionID
          name
          type
          languages
          designers
          syllabi {
            items {
              id
              name
              type
            }
          }
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

export const getChatRooms = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      id
      classes {
        items {
          id
          classID
          class {
            id
            rooms {
              items {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;
export const listFilteredSyllabusLessons = /* GraphQL */ `
  query ListSyllabusLessons(
    $filter: ModelSyllabusLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSyllabusLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        syllabusID
        lessonID
        unit
        sequence
        status
        complete
        roster
        viewing
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getInstitutionsList = /* GraphQL */ `
  query ListInstitutions($nextToken: String) {
    listInstitutions(nextToken: $nextToken) {
      items {
        id
        name
        classes {
          items {
            id
            type
            name
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const getInstClassRooms = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      rooms {
        items {
          id
          name
          classID
          class {
            id
            name
          }
          curricula {
            items {
              id
              curriculumID
              curriculum {
                id
                name
              }
            }
          }
          teacher {
            firstName
            lastName
          }
        }
        nextToken
      }
    }
  }
`;

export const listUnits = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      checkpoints {
        items {
          id
          type
          typeID
          checkpoint {
            id
            questions {
              items {
                id
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
      syllabi {
        items {
          id
          name
          type
        }
        nextToken
      }
    }
  }
`;

export const listSurveys = /* GraphQL */ `
  query GetUniversalSyllabus($id: ID!) {
    getUniversalSyllabus(id: $id) {
      id
      lessons {
        items {
          id
          lessonID
          lesson {
            id
            title
            type
          }
        }
        nextToken
      }
    }
  }
`;

export const getSurveyQuestions = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      checkpoints {
        items {
          checkpointID
          checkpoint {
            questions {
              items {
                questionID
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
  }
`;

export const fetchClassStudents = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
      id
      students {
        items {
          student {
            id
            authId
            email
            firstName
            lastName
          }
        }
        nextToken
      }
    }
  }
`;

export const getStudentResponse = /* GraphQL */ `
  query ListQuestionDatas(
    $filter: ModelQuestionDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        person {
          id
          email
          authId
        }
        responseObject {
          qid
          response
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getInstListForAdmin = /* GraphQL */ `
  query ListInstitutions(
    $id: ID
    $filter: ModelInstitutionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listInstitutions(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        type
        phone
        website
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInstListForNonAdmin = /* GraphQL */ `
  query ListStaffs($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaffs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
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
          filters
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
