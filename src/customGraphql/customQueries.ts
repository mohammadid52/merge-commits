export const getDashboardData = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      classes {
        items {
          class {
            name
            room {
              id
              institutionID
              classID
              teacherAuthID
              teacherEmail
              name
              maxPersons
              activeSyllabus
              activeLessonId
              activeLessons
              completedLessons {
                lessonID
                time
              }
              ClosedPages
              disabledPages
              studentViewing
              displayData {
                studentAuthID
                lessonPageID
              }
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
            students {
              items {
                student {
                  authId
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
                authId
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
        completedLessons {
          lessonID
          time
        }
        disabledPages
        studentViewing
        displayData {
          studentAuthID
          lessonPageID
        }
        currentPage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getDashboardDataForCoTeachers = /* GraphQL */ `
  query ListRoomCoTeachers(
    $filter: ModelRoomCoTeachersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomCoTeachers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        room {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          name
          maxPersons
          filters
          location
          startDate
          startTime
          endDate
          endTime
          length
          repeat
          notes
          activeSyllabus
          frequency
          activeLessonId
          ClosedPages
          completedLessons {
            lessonID
            time
          }
          disabledPages
          studentViewing
          currentPage
          activeLessons
          weekDay
          conferenceCallLink
          createdAt
          updatedAt
          coTeachers {
            items {
              id
              roomID
              teacher {
                id
                authId
                status
                email
                firstName
                lastName
              }
              teacherID
              teacherEmail
              teacherAuthID
              createdAt
              updatedAt
            }
            nextToken
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
                  authId
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
        }
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

export const getPersonPasscode = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      authId
      email
      passcode
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
  query ListPeople($filter: ModelPersonFilterInput, $sortDirection: ModelSortDirection) {
    listPeople(filter: $filter, sortDirection: $sortDirection) {
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
  query ListPeople(
    $email: String
    $authId: ModelStringKeyConditionInput
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
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

export const listClassStudentsForRoom = /* GraphQL */ `
  query ListClassStudents(
    $filter: ModelClassStudentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classID
        studentID
        studentEmail
        studentAuthID
        status
        group
        student {
          id
          authId
          status
          email
          role
          type
          firstName
          preferredName
          lastName
          image
        }
        createdAt
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
        activeLessons
        completedLessons {
          lessonID
          time
        }
        ClosedPages
        disabledPages
        studentViewing
        displayData {
          studentAuthID
          lessonPageID
        }
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
      endDate
      startTime
      endTime
      frequency
      weekDay
      conferenceCallLink
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

export const getRoomLessonImpactLogs = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      lessonImpactLog {
        impactDate
        reasonComment
        lessonImpact
        adjustment
      }
    }
  }
`;

export const getRoomSetup = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      activeLessonId
      ClosedPages
      disabledPages
      studentViewing
      displayData {
        studentAuthID
        lessonPageID
      }
      currentPage
      completedLessons {
        lessonID
        time
      }
      activeLessons
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
        displayData {
          studentAuthID
          lessonPageID
        }
        currentPage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listRoomCurriculums = /* GraphQL */ `
  query ListRoomCurricula(
    $filter: ModelRoomCurriculumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomCurricula(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        roomID
        curriculumID
        curriculum {
          id
          institutionID
          name
          type
          image
          summary
          description
          objectives
          languages
          designers
          universalSyllabusSeq
          syllabiHistory
          createdAt
          updatedAt
        }
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
  query ListUniversalSyllabusLessons {
    listUniversalSyllabusLessons {
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
      id
      personAuthID
      personEmail
      syllabusLessonID
      lessonID
      roomID
      currentLocation
      lessonProgress
    }
  }
`;

export const listPersonLocations = /* GraphQL */ `
  query ListPersonLocations(
    $personEmail: String
    $personAuthID: ModelStringKeyConditionInput
    $filter: ModelPersonLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonLocations(
      personEmail: $personEmail
      personAuthID: $personAuthID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        personAuthID
        personEmail
        syllabusLessonID
        lessonID
        roomID
        currentLocation
        lessonProgress
        createdAt
        updatedAt
      }
      nextToken
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

export const listCurriculumsForSuperAdmin = /* GraphQL */ `
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
        type
        image
        institutionID
        institution {
          id
          name
        }
        universalSyllabus {
          items {
            id
            unit {
              id
              name
            }
          }
        }
        universalSyllabusSeq
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
        image
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
            unitId
            unit {
              name
              type
              lessons {
                items {
                  id
                  lessonID
                }
              }
              universalLessonsSeq
            }
            curriculumId
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
        institution {
          id
          name
        }
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
        targetAudience
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
          videoLink
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
        isUsed
      }
      nextToken
    }
  }
`;
export const listUniversalSyllabusOptions = /* GraphQL */ `
  query ListUniversalSyllabi(
    $id: ID
    $filter: ModelUniversalSyllabusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalSyllabi(
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
        institutionID
        institution {
          id
          name
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

export const listUniversalLessonsForInstitution = /* GraphQL */ `
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
          title
          label
          pageContent {
            id
            partContent {
              id
            }
          }
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
      institutionID
      description
      methodology
      policies
      pupose
      objectives
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
            isUsed
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
      lessonHistory
      designers
      status
      createdAt
      updatedAt
    }
  }
`;

export const getUniversalSyllabusBasicDetails = /* GraphQL */ `
  query GetUniversalSyllabus($id: ID!) {
    getUniversalSyllabus(id: $id) {
      id
      name
    }
  }
`;

export const listUniversalSyllabuss = /* GraphQL */ `
  query ListUniversalSyllabi(
    $id: ID
    $filter: ModelUniversalSyllabusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalSyllabi(
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
        institutionID
        institution {
          id
          name
        }
        description
        methodology
        policies
        pupose
        objectives
        languages
        lessons {
          items {
            id
            lesson {
              id
              title
            }
          }
          nextToken
        }
        universalLessonsSeq
        designers
        status
        isUsed
        lessonHistory
        createdAt
        updatedAt
      }
      nextToken
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
      studentMaterials
      notes
      darkMode
      cardImage
      lessonPlanAttachment
      cardCaption
      targetAudience
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
        videoLink
        displayMode
        open
        estTime
        videoLink
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
              isRequired
              class
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
      isUsed
      createdAt
      updatedAt
    }
  }
`;

export const getUniversalLessonMinimum = /* GraphQL */ `
  query GetUniversalLesson($id: ID!) {
    getUniversalLesson(id: $id) {
      id
      title
      lessonPlan {
        id
        title
        label
      }
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

export const listInstitutionsForCurricula = /* GraphQL */ `
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
        rooms {
          items {
            id
            name
            teacher {
              firstName
              preferredName
              lastName
              image
              id
            }
            curricula {
              items {
                id
                curriculum {
                  id
                  name
                }
              }
            }
          }
        }
        curricula {
          items {
            id
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

export const listUniversalLessonStudentDatas = /* GraphQL */ `
  query ListUniversalLessonStudentData(
    $id: ID
    $filter: ModelUniversalLessonStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessonStudentData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        syllabusLessonID
        lessonID
        lessonPageID
        roomID
        studentID
        studentAuthID
        studentEmail
        currentLocation
        lessonProgress
        pageData {
          domID
          input
        }
        hasExerciseData
        exerciseData {
          id
          entryData {
            domID
            input
          }
          feedbacks
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
export const listUniversalSyllabusLessons = /* GraphQL */ `
  query ListUniversalSyllabusLessons(
    $filter: ModelUniversalSyllabusLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUniversalSyllabusLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        syllabusID
        lessonID
        lesson {
          id
          type
          label
          title
        }
      }
      nextToken
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
          image
          description
          syllabiHistory
          objectives
          languages
          universalSyllabus {
            items {
              id
              unit {
                id
                name
              }
            }
          }
          universalSyllabusSeq
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
      room {
        id
        institutionID
        classID
        teacherAuthID
        teacherEmail
        name
        maxPersons
        filters
        location
        startDate
        startTime
        endDate
        endTime
        length
        repeat
        notes
        activeSyllabus
        frequency
        activeLessonId
        ClosedPages
        disabledPages
        studentViewing
        currentPage
        activeLessons
        weekDay
        conferenceCallLink
        createdAt
        updatedAt
      }
      students {
        items {
          id
          classID
          group
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

export const getClassStudents = /* GraphQL */ `
  query GetClassDetails($id: ID!) {
    getClass(id: $id) {
      id
      students {
        items {
          id
          classID
          group
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
        distinguished
        excelled
        adequite
        basic
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
  query MessagesByRoomID(
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
      summary
      description
      objectives
      languages
      institution {
        id
        name
      }
      designers
      image
      universalSyllabus {
        items {
          id
          unitId
          unit {
            id
            name
            type
            institutionID
            description
            methodology
            policies
            pupose
            objectives
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
          curriculumId
          createdAt
          updatedAt
        }
        nextToken
      }
      universalSyllabusSeq
      syllabiHistory
      createdAt
      updatedAt
    }
  }
`;

export const getCurriculumBasicDetails = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      name
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

export const getUniversalLessonBasicDetails = /* GraphQL */ `
  query getUniversalLesson($id: ID!) {
    getUniversalLesson(id: $id) {
      id
      title
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
                id
                name
                class {
                  id
                  name
                  institution {
                    name
                  }
                }
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
export const getUserProfile = /* GraphQL */ `
  query UserById(
    $id: ID!
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
              room {
                id
                name
                class {
                  id
                  name
                  institution {
                    name
                  }
                }
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
                            questionSeq
                          }
                        }
                      }
                    }
                  }
                  nextToken
                }
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
                    questionSeq
                  }
                }
              }
            }
            room {
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
                          questionSeq
                        }
                      }
                    }
                  }
                }
                nextToken
              }
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
  query ListQuestionData(
    $filter: ModelQuestionDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionData(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  query GetUniversalLesson($id: ID!) {
    getUniversalLesson(id: $id) {
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
            room {
              id
              name
            }
          }
        }
      }
    }
  }
`;
export const listFilteredSyllabusLessons = /* GraphQL */ `
  query ListUniversalSyllabusLessons(
    $filter: ModelSyllabusLessonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUniversalSyllabusLessons(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
            roomId
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
  query ListCurriculumUnits(
    $filter: ModelCurriculumUnitsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCurriculumUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        unitId
        unit {
          id
          name
          type
          status
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;

export const getCurriculumCheckpointsData = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      name
      type
      image
      summary
      description
      objectives
      languages
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
        setupComplete
        createdAt
        updatedAt
      }
      designers
      universalSyllabusSeq
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
      universalSyllabus {
        items {
          id
          unitId
          curriculumId
          createdAt
          updatedAt
        }
        nextToken
      }
      syllabiHistory
      createdAt
      updatedAt
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
  query ListQuestionData(
    $filter: ModelQuestionDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionData(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
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

export const attendanceByStudent = /* GraphQL */ `
  query AttendanceByStudent(
    $studentID: ID!
    $date: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    attendanceByStudent(
      studentID: $studentID
      date: $date
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentID
        curriculumID
        syllabusID
        lessonID
        roomID
        date
        time
        curriculum {
          id
          institutionID
          name
        }
        lesson {
          id
          title
        }
        room {
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

export const listRoomsByActiveSyllabusId = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        activeSyllabus
      }
      nextToken
    }
  }
`;

export const getStaffsForInstitution = /* GraphQL */ `
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institution {
          id
          name
        }
        staffMember {
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getInstitutionBasicInfo = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
    }
  }
`;

export const getCurriculumRooms = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      rooms {
        items {
          roomID
          room {
            id
            name
            institutionID
            institution {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const getCurriculumBasicInfo = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      name
      institution {
        id
        name
      }
    }
  }
`;

export const getPersonSentiments = /* GraphQL */ `
  query GetPersonSentiments($personAuthID: String!, $date: AWSDate!) {
    getPersonSentiments(personAuthID: $personAuthID, date: $date) {
      personAuthID
      personEmail
      date
      time
      responseText
      createdAt
      updatedAt
    }
  }
`;
export const listPersonSentimentss = /* GraphQL */ `
  query ListPersonSentiments(
    $personAuthID: String
    $date: ModelStringKeyConditionInput
    $filter: ModelPersonSentimentsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonSentiments(
      personAuthID: $personAuthID
      date: $date
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        personAuthID
        personEmail
        date
        time
        backstory
        responseText
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listClassroomGroupss = /* GraphQL */ `
  query ListClassroomGroups(
    $filter: ModelClassroomGroupsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classRoomID
        groupName
        groupType
        advisorEmail
        advisorAuthId
        groupAdvisor {
          id
          authId
          firstName
          preferredName
          lastName
        }
        groupLocation
        classroomGroupsStudents {
          items {
            id
            classRoomGroupID
            studentEmail
            studentAuthId
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
      nextToken
    }
  }
`;

export const getAssignedInstitutionToStaff = /* GraphQL */ `
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institution {
          id
          name
        }
        staffMember {
          firstName
          lastName
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getClassroomSyllabus = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      universalSyllabusSeq
      universalSyllabus {
        items {
          id
          unitId
          unit {
            name
            type
            lessons {
              items {
                id
                lesson {
                  duration
                  title
                }
              }
            }
            universalLessonsSeq
            status
          }
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

export const getCurriculumForClasses = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      name
      type
      image
      summary
      description
      objectives
      languages
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
        setupComplete
        createdAt
        updatedAt
      }
      designers
      universalSyllabus {
        items {
          id
          unitId
          unit {
            id
            name
            type
            institutionID
            description
            methodology
            policies
            pupose
            objectives
            languages
            lessons {
              items {
                id
                syllabusID
                lessonID
                unit
                sequence
                status
                lesson {
                  duration
                  title
                }
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
            universalLessonsSeq
            isUsed
            lessonHistory
            designers
            status
            createdAt
            updatedAt
          }
          curriculumId
          createdAt
          updatedAt
        }
        nextToken
      }
      universalSyllabusSeq
      checkpoints {
        items {
          id
          type
          typeID
          checkpointID
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

export const getScheduleDetails = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      institutionID
      startDate
      endDate
      startTime
      endTime
      frequency
      weekDay
      completedLessons {
        lessonID
        time
      }
      lessonImpactLog {
        impactDate
        reasonComment
        lessonImpact
        adjustment
      }
    }
  }
`;

export const getRoomBasicDetails = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      name
    }
  }
`;

export const listRoomsNotebook = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        classID
        teacherAuthID
        teacherEmail
        name
        activeSyllabus
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
      }
      nextToken
    }
  }
`;

export const getCurriculumNotebook = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      name
      type
      image
      summary
      description
    }
  }
`;

export const getBasicDetailsOfInstitution = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      address
      image
    }
  }
`;

export const GetInstitutionClasses = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      type
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

export const getInstitutionCurriculums = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      type
      curricula {
        items {
          id
          image
          institutionID
          name
          type
          languages
          description
          designers
          objectives
          summary
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

export const listRoomsBasicDetails = /* GraphQL */ `
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
        filters
        location
        startDate
        startTime
        endDate
        endTime
        length
        repeat
        notes
        activeSyllabus
        frequency
        coTeachers {
          nextToken
        }
        activeLessons
        classroomGroups {
          nextToken
        }
        weekDay
        conferenceCallLink
        lessonImpactLog {
          impactDate
          reasonComment
          lessonImpact
          adjustment
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listRoomsCompletedLessons = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        completedLessons {
          lessonID
          time
        }
        activeLessons
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getStudentSurveyResponse = /* GraphQL */ `
  query ListUniversalLessonStudentData(
    $id: ID
    $filter: ModelUniversalLessonStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessonStudentData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        syllabusLessonID
        lessonID
        lessonPageID
        studentID
        studentAuthID
        studentEmail
        roomID
        currentLocation
        lessonProgress
        pageData {
          domID
          options
          input
        }
        hasExerciseData
        exerciseData {
          id
          feedbacks
          shared
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listStaffWithBasicInfo = /* GraphQL */ `
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        staffAuthID
        staffEmail
      }
    }
  }
`;

export const listStaffOptions = /* GraphQL */ `
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        staffAuthID
        staffEmail
        staffMember {
          firstName
          preferredName
          lastName
          role
        }
      }
    }
  }
`;

export const listCurriculumUnitss = /* GraphQL */ `
  query ListCurriculumUnits(
    $filter: ModelCurriculumUnitsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCurriculumUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        unitId
        unit {
          id
          name
          type
          institutionID
        }
        curriculumId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listClassroomGroupssOptions = /* GraphQL */ `
  query ListClassroomGroups(
    $filter: ModelClassroomGroupsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classRoomID
        groupName
        groupType
      }
      nextToken
    }
  }
`;

export const listInstitutionOptions = /* GraphQL */ `
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
      }
      nextToken
    }
  }
`;

export const listFeelingsArchives = /* GraphQL */ `
  query ListFeelingsArchives(
    $id: ID
    $filter: ModelFeelingsArchiveFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFeelingsArchives(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        personAuthID
        personEmail
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
          onDemand
          sentiments
          passcode
          spotlightUser
          spotlightDate
          addedby
          createdAt
          updatedAt
        }
        sentimentId
        sentiment {
          nextToken
        }
        classRoomID
        classRoom {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          name
          maxPersons
          filters
          location
          startDate
          startTime
          endDate
          endTime
          length
          repeat
          notes
          activeSyllabus
          frequency
          activeLessonId
          ClosedPages
          disabledPages
          studentViewing
          currentPage
          activeLessons
          weekDay
          conferenceCallLink
          classSentiment
          createdAt
          updatedAt
        }
        lessonID
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
          darkMode
          rubrics
          smallGroup
          groupSize
          groupType
          smallGroupSize
          smallGroupOption
          studentMaterials
          targetAudience
          lessonPlan {
            label
            title
          }
          isUsed
          createdAt
          updatedAt
        }
        date
        time
        sentimentName
        comments
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
