export const getUnitsOnly = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id

      universalSyllabus {
        items {
          id
          unitId
          unit {
            id
            name
            institutionID
            universalLessonsSeq
            isUsed
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

      createdAt
      updatedAt
    }
  }
`;

export const getDashboardData = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
      classes {
        items {
          class {
            name
            room {
              id
              teachingStyle
              institutionID
              classID
              teacherAuthID
              status
              teacherEmail
              name
              maxPersons
              isZoiq
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
                status
                lastName
                image
                email
                role

                id
                authId
              }
              coTeachers {
                items {
                  teacher {
                    authId
                    id
                    status
                    firstName
                    lastName
                    image
                    email
                    role
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
                  pageState
                  lastName
                  image
                  email
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

export const getDashboardDataForTeachers = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        classID
        isZoiq
        teacherAuthID
        status
        teacherEmail
        name
        maxPersons
        teachingStyle
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
          status
          firstName
          preferredName
          lastName
          image
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
                email
                firstName
                lastName
                image
                role
                onDemand
                status
                pageState
                lastPageStateUpdate
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
              id
              email
              status
              authId
              role
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
        teachingStyle
        room {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          status
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
                email
                firstName
                lastName
                status
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
                  email
                  firstName
                  lastName
                  image
                  role
                  onDemand
                  status
                  pageState
                  lastPageStateUpdate
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

export const listRoomCoTeachers = /* GraphQL */ `
  query ListRoomCoTeachers(
    $filter: ModelRoomCoTeachersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomCoTeachers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        roomID
        teacherID
        teacherEmail
        teacherAuthID
        room {
          id
          institutionID
          classID
          teacherAuthID
          teacherEmail
          name
          maxPersons
          status
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
          inactiveStatusDate
          image
          language
          lastLoggedIn
          lastLoggedOut
          onDemand
          sentiments
          passcode
          spotlightUser
          spotlightDate
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getRoomCoTeachers = /* GraphQL */ `
  query GetRoomCoTeachers($id: ID!) {
    getRoomCoTeachers(id: $id) {
      id
      roomID
      teacherID

      teacherEmail
      teacherAuthID
      room {
        id
        institutionID
        classID
        teacherAuthID
        teacherEmail
        name
        maxPersons
        status
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

          website
          image
          isServiceProvider
          filters
          setupComplete
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

          inactiveStatusDate
          image
          language

          lastLoggedIn
          lastLoggedOut
          onDemand
          sentiments
          passcode
          spotlightUser
          spotlightDate
          statusReason
          addedby
          lastEmotionSubmission
          createdAt
          updatedAt
        }
        class {
          id
          institutionID
          type
          name
          roomId
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
        activeLessonId
        ClosedPages
        disabledPages
        studentViewing
        displayData {
          isTeacher
          studentAuthID
          lessonPageID
        }
        currentPage
        completedLessons {
          lessonID
          time
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
        classSentiment
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

        inactiveStatusDate
        image
        language

        lastLoggedIn
        lastLoggedOut
        onDemand
        sentiments
        passcode
        classes {
          nextToken
        }
        lessons {
          nextToken
        }
        spotlightUser
        spotlightDate
        statusReason
        addedby
        lastEmotionSubmission
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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

export const listPersons = /* GraphQL */ `
  query ListPeople(
    $limit: Int
    $filter: ModelPersonFilterInput
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        authId
        email
        onDemand
        role
        type
        firstName
        isZoiq
        status
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
        isZoiq
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
          onDemand
          lastName
          image
        }
        createdAt
      }
      nextToken
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
        isZoiq
        teacherEmail
        name
        maxPersons
        activeSyllabus
        teachingStyle
        coTeachers {
          nextToken
          items {
            id
            roomID
            teacherAuthID
            teacherEmail
            teacher {
              authId
              id
              role
              image
              lastName
              firstName
              status
            }
          }
        }
        teacher {
          firstName
          preferredName
          lastName
          image
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
      type
      teacherEmail
      name
      status
      maxPersons
      teachingStyle
      isZoiq
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

        image
        language

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
        activeSyllabus
        teacherEmail
        name
        teachingStyle
        maxPersons
        status
        isZoiq
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

          website
          image
          isServiceProvider
          filters
          createdAt
          updatedAt
        }
        teacher {
          id
          status
          firstName
          status
          preferredName
          lastName
          image
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
              id
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

export const getPersonLocation = /* GraphQL */ `
  query GetPersonLocation($personAuthID: String!, $personEmail: String!) {
    getPersonLocation(personAuthID: $personAuthID, personEmail: $personEmail) {
      id
      personAuthID
      personEmail
      syllabusLessonID
      lessonID
      roomID
      lesson {
        title
      }
      room {
        name
      }
      currentLocation
      lessonProgress
    }
  }
`;

export const listClassUserLookup = /* GraphQL */ `
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
        student {
          id
          authId
          status
          email
          role
          firstName
          preferredName
          lastName
          inactiveStatusDate
          image
          onDemand
          pageState
          lastPageStateUpdate
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listCurriculumsForSuperAdmin = /* GraphQL */ `
  query ListCurricula(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurricula(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        institutionID
        name
        type
        image
        status
        summary
        description
        institution {
          id
          name
        }
        designers
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          items {
            id
            unit {
              status
              id
              name
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
export const listCurriculumsForLessons = /* GraphQL */ `
  query ListCurricula(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurricula(
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
                  syllabusID
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
        status
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
        status
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

export const getUniversalLessonStudentData = /* GraphQL */ `
  query GetUniversalLessonStudentData($id: ID!) {
    getUniversalLessonStudentData(id: $id) {
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
        comments {
          commentBy
          comment
        }
        hasTakenSurvey
      }
      hasExerciseData
      exerciseData {
        id
        entryData {
          domID
          type
          input
        }
        feedbacks
        shared
      }
      date
      createdAt
      updatedAt
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
      priorities
      secondary
      status
      lessons {
        items {
          id
          syllabusID
          lessonID
          status
          lesson {
            id
            type
            label
            title
            status
            summary
            cardImage
            cardCaption
            lessonPlan {
              id
              title
              estTime
              label
            }
          }
        }
      }
      universalLessonsSeq
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
              status
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
      status
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
        lesson {
          title
          id
        }
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

export const listUniversalLessonWritingExcercises = /* GraphQL */ `
  query ListUniversalLessonWritingExcercises(
    $id: ID
    $filter: ModelUniversalLessonWritingExcercisesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessonWritingExcercises(
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
        lessonName
        lesson {
          title
          id
        }
        pageData {
          domID
          options
          input
          hasTakenSurvey
        }
        hasExerciseData
        exerciseData {
          id
          feedbacks
          shared
          entryData {
            domID
            input
          }
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
      status

      website
      image
      isServiceProvider
      isZoiq
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
                status
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

export const getCurriculum = /* GraphQL */ `
  query GetCurriculum($id: ID!) {
    getCurriculum(id: $id) {
      id
      institutionID
      name
      type
      summary
      status
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

        inactiveStatusDate

        image
        language

        statusReason
        lastLoggedIn
        isZoiq
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

      image
      language
      createdAt
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
        authID
        checkpointID
        responseObject {
          qid
          response
        }
      }
      nextToken
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

export const getInstitutionsList = /* GraphQL */ `
  query ListInstitutions($filter: ModelInstitutionFilterInput, $nextToken: String) {
    listInstitutions(filter: $filter, nextToken: $nextToken) {
      items {
        id
        name
        isZoiq
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

export const fetchClassStudents = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
      id
      students {
        items {
          student {
            id
            authId
            isZoiq
            email
            status
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

        isZoiq
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
          isZoiq
          id
          name
          type
          district
          address
          addressLine2
          city
          state
          zip

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
          type
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
      image
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

          image
          isServiceProvider
          website
          address
          isZoiq
          addressLine2
          city
          zip
          district
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

export const getRoomBasicDetails = /* GraphQL */ `
  query GetRoom($id: ID!) {
    getRoom(id: $id) {
      id
      name
      classID
    }
  }
`;

export const listRoomsNotebook = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        isZoiq
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
          status
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

          image
          language

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

export const lessonsByType = /* GraphQL */ `
  query ListPersonLessonsData(
    $id: ID
    $filter: ModelPersonLessonsDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonLessonsData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        studentAuthID
        studentEmail
        lessonID
        lessonType
        lesson {
          title
        }
        pages
        ratings
        isCompleted
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listPersonLessonsDataForGraph = /* GraphQL */ `
  query ListPersonLessonsData(
    $id: ID
    $filter: ModelPersonLessonsDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonLessonsData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        lessonType
        lesson {
          title
          id
        }
        isCompleted
      }
      nextToken
    }
  }
`;

export const getPersonLessonsData = /* GraphQL */ `
  query GetPersonLessonsData($id: ID!) {
    getPersonLessonsData(id: $id) {
      id
      studentAuthID
      studentEmail
      lessonID
      lessonType
      pages
      ratings
      isCompleted
      roomId
      createdAt
      updatedAt
    }
  }
`;

export const listCommunityChats = /* GraphQL */ `
  query ListCommunityChats(
    $filter: ModelCommunityChatFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommunityChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        communityId
        personAuthID
        personEmail
        msg
        createdAt
        isEditedChat
        person {
          id
          authId
          status
          email
          role
          firstName
          preferredName
          lastName
          image
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
    }
  }
`;

export const listCurricula = /* GraphQL */ `
  query ListCurricula(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurricula(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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

          website
          image
          isServiceProvider
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          items {
            id
            unitId
            unit {
              id
              name
              institutionID
              universalLessonsSeq
              isUsed
              status
              createdAt
              updatedAt
              lessons {
                items {
                  lessonID
                }
              }
            }
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
      nextToken
    }
  }
`;
export const listCurriculaForGraphs = /* GraphQL */ `
  query ListCurricula(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurricula(
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
      }
      nextToken
    }
  }
`;

export const listUploadLogs = /* GraphQL */ `
  query ListUploadLogs(
    $id: ID
    $filter: ModelUploadLogsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUploadLogs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        UploadType
        updateType
        Date
        User_id
        Curricullum_id
        urlLink
        Unit_id
        authID
        email
        lesson_id
        room_id
        Class_id
        PaperSurveyURL
        Reason
        person {
          id
          authId
          email
          firstName
          preferredName
          lastName
        }
        lesson {
          id
          type
          label
          title
        }
        room {
          id
          name
        }
        unit {
          id
          name
        }
        surveyName
        unitName
        roomName
        personName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listCurriculaForLesson = /* GraphQL */ `
  query ListCurricula(
    $id: ID
    $filter: ModelCurriculumFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCurricula(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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

          website
          image
          isServiceProvider
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          items {
            id
            unit {
              status
              id
              name
            }
          }
        }
        syllabiHistory

        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listDicitionaries = /* GraphQL */ `
  query ListDicitionaries(
    $id: ID
    $filter: ModelDicitionaryFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listDicitionaries(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        englishPhrase
        englishAudio
        englishDefinition
        translation {
          id
          translateLanguage
          languageTranslation
          languageDefinition
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listRoomCurriculaOnlyRoomID = /* GraphQL */ `
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
      }
      nextToken
    }
  }
`;

export const listRoomsOnlyName = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isZoiq
        institutionID
        name
      }
      nextToken
    }
  }
`;
export const listRoomsForGraphs = /* GraphQL */ `
  query ListRooms($filter: ModelRoomFilterInput, $limit: Int, $nextToken: String) {
    listRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isZoiq
        institutionID
        name
        status
        curricula {
          items {
            curriculum {
              status
              name
            }
          }
        }
      }
      nextToken
    }
  }
`;

export const listInstitutionsForGraphs = /* GraphQL */ `
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
        image
        status
        phone
        website
        name
        zip
      }
      nextToken
    }
  }
`;

export const listPersonWithCheckpointsForGraph = /* GraphQL */ `
  query ListPeople(
    $limit: Int
    $filter: ModelPersonFilterInput
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        classes {
          items {
            class {
              room {
                curricula {
                  items {
                    curriculumID
                    curriculum {
                      checkpoints {
                        items {
                          checkpoint {
                            scope
                            id

                            questions {
                              items {
                                id
                                required
                                question {
                                  id
                                  question
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const listPersonWithRoomsAndInstitutionForGraph = /* GraphQL */ `
  query ListPeople(
    $limit: Int
    $filter: ModelPersonFilterInput
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPeople(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        authId
        classes {
          items {
            class {
              institution {
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

export const listUniversalLessonsForGraph = /* GraphQL */ `
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
        title
      }
      nextToken
    }
  }
`;
