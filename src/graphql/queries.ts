/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPerson = /* GraphQL */ `
  query GetPerson($email: String!, $authId: String!) {
    getPerson(email: $email, authId: $authId) {
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
      inactiveStatusDate
      image
      language
      filters
      lastLoggedIn
      lastLoggedOut
      onDemand
      sentiments
      passcode
      classes {
        items {
          id
          classID
          studentID
          studentEmail
          studentAuthID
          status
          group
          createdAt
          updatedAt
        }
        nextToken
      }
      lessons {
        items {
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
        nextToken
      }
      spotlightUser
      spotlightDate
      statusReason
      addedby
      lastEmotionSubmission
      pageState
      lastPageStateUpdate
      statusChangedBy
      isZoiq
      createdAt
      updatedAt
    }
  }
`;
export const listPeople = /* GraphQL */ `
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
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
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPersonLessonsData = /* GraphQL */ `
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
        pages
        ratings
        isCompleted
        roomId
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
          type
          isZoiq
          teachingStyle
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
export const getInstitution = /* GraphQL */ `
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
      isZoiq
      serviceProviders {
        items {
          id
          partnerID
          providerID
          status
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
          type
          isZoiq
          teachingStyle
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
          summary
          description
          objectives
          languages
          designers
          universalSyllabusSeq
          syllabiHistory
          signedOff
          status
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
          roomId
          createdAt
          updatedAt
        }
        nextToken
      }
      filters
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
      setupComplete
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
        isZoiq
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
      nextToken
    }
  }
`;
export const getStaff = /* GraphQL */ `
  query GetStaff($id: ID!) {
    getStaff(id: $id) {
      id
      institutionID
      staffAuthID
      staffEmail
      status
      statusChangeDate
      staffMember {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
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
        phone
        website
        image
        isServiceProvider
        isZoiq
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
      createdAt
      updatedAt
    }
  }
`;
export const listStaff = /* GraphQL */ `
  query ListStaff($filter: ModelStaffFilterInput, $limit: Int, $nextToken: String) {
    listStaff(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        staffAuthID
        staffEmail
        status
        statusChangeDate
        staffMember {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
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
          phone
          website
          image
          isServiceProvider
          isZoiq
          filters
          setupComplete
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
        items {
          id
          roomID
          teacherID
          teacherEmail
          teacherAuthID
          type
          teachingStyle
          createdAt
          updatedAt
        }
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
        phone
        website
        image
        isServiceProvider
        isZoiq
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      class {
        id
        institutionID
        type
        name
        roomId
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
          isZoiq
          filters
          setupComplete
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
          type
          isZoiq
          teachingStyle
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
        items {
          id
          classRoomID
          groupName
          groupType
          advisorEmail
          advisorAuthId
          groupLocation
          createdAt
          updatedAt
        }
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
      type
      isZoiq
      teachingStyle
      createdAt
      updatedAt
    }
  }
`;
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getArchiveSurveyDataSQL = /* GraphQL */ `
  query GetArchiveSurveyDataSQL($Email: String!, $AuthId: String!) {
    getArchiveSurveyDataSQL(Email: $Email, AuthId: $AuthId) {
      id
      AuthId
      Email
      UniversalSurveyStudentID
      QuestionResult {
        QuestionId
        QuestionLabel
        QuestionResponse
      }
      createdAt
      updatedAt
    }
  }
`;
export const listArchiveSurveyDataSQLS = /* GraphQL */ `
  query ListArchiveSurveyDataSQLS(
    $Email: String
    $AuthId: ModelStringKeyConditionInput
    $filter: ModelArchiveSurveyDataSQLFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listArchiveSurveyDataSQLS(
      Email: $Email
      AuthId: $AuthId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        AuthId
        Email
        UniversalSurveyStudentID
        QuestionResult {
          QuestionId
          QuestionLabel
          QuestionResponse
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroomGroupStudents = /* GraphQL */ `
  query GetClassroomGroupStudents($id: ID!) {
    getClassroomGroupStudents(id: $id) {
      id
      classRoomGroupID
      classRoomGroup {
        id
        classRoomID
        classRoom {
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        groupName
        groupType
        advisorEmail
        advisorAuthId
        groupAdvisor {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        groupLocation
        classroomGroupsStudents {
          nextToken
        }
        createdAt
        updatedAt
      }
      studentEmail
      studentAuthId
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
        externalId
        grade
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      studentType
      studentNote
      createdAt
      updatedAt
    }
  }
`;
export const listClassroomGroupStudents = /* GraphQL */ `
  query ListClassroomGroupStudents(
    $filter: ModelClassroomGroupStudentsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroupStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classRoomGroupID
        classRoomGroup {
          id
          classRoomID
          groupName
          groupType
          advisorEmail
          advisorAuthId
          groupLocation
          createdAt
          updatedAt
        }
        studentEmail
        studentAuthId
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        studentType
        studentNote
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroomGroups = /* GraphQL */ `
  query GetClassroomGroups($id: ID!) {
    getClassroomGroups(id: $id) {
      id
      classRoomID
      classRoom {
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      groupName
      groupType
      advisorEmail
      advisorAuthId
      groupAdvisor {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      groupLocation
      classroomGroupsStudents {
        items {
          id
          classRoomGroupID
          studentEmail
          studentAuthId
          studentType
          studentNote
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
export const listClassroomGroups = /* GraphQL */ `
  query ListClassroomGroups(
    $filter: ModelClassroomGroupsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classRoomID
        classRoom {
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        groupName
        groupType
        advisorEmail
        advisorAuthId
        groupAdvisor {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        groupLocation
        classroomGroupsStudents {
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
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
      type
      teachingStyle
      createdAt
      updatedAt
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
          type
          isZoiq
          teachingStyle
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        curricula {
          nextToken
        }
        type
        teachingStyle
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClass = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
      id
      institutionID
      type
      name
      roomId
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
        isZoiq
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      students {
        items {
          id
          classID
          studentID
          studentEmail
          studentAuthID
          status
          group
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
export const listClasses = /* GraphQL */ `
  query ListClasses($filter: ModelClassFilterInput, $limit: Int, $nextToken: String) {
    listClasses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        institutionID
        type
        name
        roomId
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
          isZoiq
          filters
          setupComplete
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassStudent = /* GraphQL */ `
  query GetClassStudent($id: ID!) {
    getClassStudent(id: $id) {
      id
      classID
      studentID
      studentEmail
      studentAuthID
      status
      group
      class {
        id
        institutionID
        type
        name
        roomId
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
          isZoiq
          filters
          setupComplete
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        students {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        externalId
        grade
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listClassStudents = /* GraphQL */ `
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
        class {
          id
          institutionID
          type
          name
          roomId
          createdAt
          updatedAt
        }
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
export const getCurriculum = /* GraphQL */ `
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
        isZoiq
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
          checkpointID
          createdAt
          updatedAt
        }
        nextToken
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
      signedOff
      status
      signedOffSteps {
        authID
        date
        step
      }
      createdAt
      updatedAt
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          nextToken
        }
        syllabiHistory
        signedOff
        status
        signedOffSteps {
          authID
          date
          step
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTopic = /* GraphQL */ `
  query GetTopic($id: ID!) {
    getTopic(id: $id) {
      id
      curriculumID
      learningObjectiveID
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
          isZoiq
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
          nextToken
        }
        syllabiHistory
        signedOff
        status
        signedOffSteps {
          authID
          date
          step
        }
        createdAt
        updatedAt
      }
      learningObjective {
        id
        name
        description
        curriculumID
        createdAt
        updatedAt
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
export const listTopics = /* GraphQL */ `
  query ListTopics(
    $id: ID
    $filter: ModelTopicFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTopics(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        curriculumID
        learningObjectiveID
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
          signedOff
          status
          createdAt
          updatedAt
        }
        learningObjective {
          id
          name
          description
          curriculumID
          createdAt
          updatedAt
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
      nextToken
    }
  }
`;
export const getCSequences = /* GraphQL */ `
  query GetCSequences($id: ID!) {
    getCSequences(id: $id) {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const listCSequences = /* GraphQL */ `
  query ListCSequences(
    $id: ID
    $filter: ModelCSequencesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCSequences(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        sequence
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLearningObjective = /* GraphQL */ `
  query GetLearningObjective($id: ID!) {
    getLearningObjective(id: $id) {
      id
      name
      description
      curriculumID
      createdAt
      updatedAt
    }
  }
`;
export const listLearningObjectives = /* GraphQL */ `
  query ListLearningObjectives(
    $id: ID
    $filter: ModelLearningObjectiveFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLearningObjectives(
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
        curriculumID
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
        curriculumID
        learningObjectiveID
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
          signedOff
          status
          createdAt
          updatedAt
        }
        learningObjective {
          id
          name
          description
          curriculumID
          createdAt
          updatedAt
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
      curriculumID
      createdAt
      updatedAt
    }
  }
`;
export const listRubrics = /* GraphQL */ `
  query ListRubrics(
    $id: ID
    $filter: ModelRubricFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRubrics(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        criteria
        topicID
        topic {
          id
          curriculumID
          learningObjectiveID
          name
          description
          distinguished
          excelled
          adequite
          basic
          createdAt
          updatedAt
        }
        curriculumID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRoomCurriculum = /* GraphQL */ `
  query GetRoomCurriculum($id: ID!) {
    getRoomCurriculum(id: $id) {
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
          isZoiq
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
          nextToken
        }
        syllabiHistory
        signedOff
        status
        signedOffSteps {
          authID
          date
          step
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listRoomCurricula = /* GraphQL */ `
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
          signedOff
          status
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
export const getCheckpoint = /* GraphQL */ `
  query GetCheckpoint($id: ID!) {
    getCheckpoint(id: $id) {
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
          id
          checkpointID
          questionID
          required
          createdAt
          updatedAt
        }
        nextToken
      }
      purpose
      objectives
      designers
      language
      estTime
      scope
      questionSeq
      createdAt
      updatedAt
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
        id
        label
        title
        subtitle
        stage
        type
        instructionsTitle
        instructions
        questions {
          nextToken
        }
        purpose
        objectives
        designers
        language
        estTime
        scope
        questionSeq
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
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
      published
      createdAt
      updatedAt
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
        published
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestionSource = /* GraphQL */ `
  query GetQuestionSource($id: ID!) {
    getQuestionSource(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listQuestionSources = /* GraphQL */ `
  query ListQuestionSources(
    $filter: ModelQuestionSourceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionSources(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestionType = /* GraphQL */ `
  query GetQuestionType($id: ID!) {
    getQuestionType(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listQuestionTypes = /* GraphQL */ `
  query ListQuestionTypes(
    $filter: ModelQuestionTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRoomMsgs = /* GraphQL */ `
  query GetRoomMsgs($id: ID!) {
    getRoomMsgs(id: $id) {
      id
      roomID
      senderAuthID
      senderEmail
      body
      createdAt
      sender {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const listRoomMsgs = /* GraphQL */ `
  query ListRoomMsgs($filter: ModelRoomMsgsFilterInput, $limit: Int, $nextToken: String) {
    listRoomMsgs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        roomID
        senderAuthID
        senderEmail
        body
        createdAt
        sender {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
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
        externalId
        grade
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
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
      anthologyContent {
        type
        subType
        title
        subTitle
        description
        content
        classID
        feedbacks
        edited
      }
      createdAt
      updatedAt
    }
  }
`;
export const listStudentData = /* GraphQL */ `
  query ListStudentData(
    $syllabusLessonID: ID
    $studentID: ModelStringKeyConditionInput
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listStudentData(
      syllabusLessonID: $syllabusLessonID
      studentID: $studentID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        lessonProgress
        currentLocation
        status
        saveType
        syllabusLessonID
        studentID
        studentAuthID
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        doFirstData {
          nextToken
        }
        checkpointData {
          nextToken
        }
        anthologyContent {
          type
          subType
          title
          subTitle
          description
          content
          classID
          feedbacks
          edited
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAnthologyComment = /* GraphQL */ `
  query GetAnthologyComment($id: ID!) {
    getAnthologyComment(id: $id) {
      id
      text
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      attachments {
        type
        url
        filename
        size
      }
      edited
      createdAt
      updatedAt
      entryID
    }
  }
`;
export const listAnthologyComments = /* GraphQL */ `
  query ListAnthologyComments(
    $filter: ModelAnthologyCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnthologyComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        attachments {
          type
          url
          filename
          size
        }
        edited
        createdAt
        updatedAt
        entryID
      }
      nextToken
    }
  }
`;
export const getQuestionData = /* GraphQL */ `
  query GetQuestionData($id: ID!) {
    getQuestionData(id: $id) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      componentType
      scheduleID
      lessonID
      responseObject {
        qid
        response
        demographicsUpdated
        otherResponse
      }
      createdAt
      updatedAt
    }
  }
`;
export const listQuestionData = /* GraphQL */ `
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        componentType
        scheduleID
        lessonID
        responseObject {
          qid
          response
          demographicsUpdated
          otherResponse
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPersonLocation = /* GraphQL */ `
  query GetPersonLocation($personEmail: String!, $personAuthID: String!) {
    getPersonLocation(personEmail: $personEmail, personAuthID: $personAuthID) {
      id
      personAuthID
      personEmail
      syllabusLessonID
      lessonID
      roomID
      currentLocation
      lessonProgress
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
export const getAttendance = /* GraphQL */ `
  query GetAttendance($id: ID!) {
    getAttendance(id: $id) {
      id
      studentID
      curriculumID
      syllabusID
      lessonID
      roomID
      date
      time
      isComplete
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
          isZoiq
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
          nextToken
        }
        syllabiHistory
        signedOff
        status
        signedOffSteps {
          authID
          date
          step
        }
        createdAt
        updatedAt
      }
      syllabus {
        id
        name
        type
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
        priorities
        secondary
        objectives
        languages
        lessons {
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
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAttendances = /* GraphQL */ `
  query ListAttendances(
    $filter: ModelAttendanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttendances(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        studentID
        curriculumID
        syllabusID
        lessonID
        roomID
        date
        time
        isComplete
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
          signedOff
          status
          createdAt
          updatedAt
        }
        syllabus {
          id
          name
          type
          institutionID
          description
          methodology
          policies
          pupose
          priorities
          secondary
          objectives
          languages
          universalLessonsSeq
          designers
          status
          isUsed
          lessonHistory
          createdAt
          updatedAt
        }
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
          type
          isZoiq
          teachingStyle
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
export const getUniversalLesson = /* GraphQL */ `
  query GetUniversalLesson($id: ID!) {
    getUniversalLesson(id: $id) {
      id
      type
      label
      title
      institutionID
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
        isZoiq
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
      language
      designers
      objectives
      lessonPlanAttachment
      purpose
      introduction
      introductionTitle
      status
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
        pageContent {
          id
          tags
          partType
          class
          showIfAsync
        }
        activityType
        interactionType
        tags
        videoLink
        notes
      }
      homework {
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
          showIfAsync
        }
        activityType
        interactionType
        tags
        videoLink
        notes
      }
      darkMode
      rubrics
      smallGroup
      groupSize
      groupType
      smallGroupSize
      smallGroupOption
      studentMaterials
      targetAudience
      isUsed
      createdAt
      updatedAt
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
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
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
      }
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
export const listUniversalLessonStudentData = /* GraphQL */ `
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
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
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
          hasTakenSurvey
        }
        hasExerciseData
        exerciseData {
          id
          feedbacks
          shared
        }
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUniversalLessonWritingExcercises = /* GraphQL */ `
  query GetUniversalLessonWritingExcercises($id: ID!) {
    getUniversalLessonWritingExcercises(id: $id) {
      id
      syllabusLessonID
      lessonID
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
      }
      lessonPageID
      lessonName
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
      createdAt
      updatedAt
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
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
        lessonPageID
        lessonName
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
          hasTakenSurvey
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
export const getUniversalArchiveData = /* GraphQL */ `
  query GetUniversalArchiveData($id: ID!) {
    getUniversalArchiveData(id: $id) {
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
      surveyData {
        domID
        options
        input
        comments {
          commentBy
          comment
        }
        hasTakenSurvey
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalArchiveData = /* GraphQL */ `
  query ListUniversalArchiveData(
    $id: ID
    $filter: ModelUniversalArchiveDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalArchiveData(
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
          hasTakenSurvey
        }
        hasExerciseData
        exerciseData {
          id
          feedbacks
          shared
        }
        surveyData {
          domID
          options
          input
          hasTakenSurvey
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUniversalSurveyStudentData = /* GraphQL */ `
  query GetUniversalSurveyStudentData($id: ID!) {
    getUniversalSurveyStudentData(id: $id) {
      id
      syllabusLessonID
      lessonID
      studentID
      studentAuthID
      studentEmail
      roomID
      currentLocation
      lessonProgress
      surveyData {
        domID
        options
        input
        comments {
          commentBy
          comment
        }
        hasTakenSurvey
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalSurveyStudentData = /* GraphQL */ `
  query ListUniversalSurveyStudentData(
    $id: ID
    $filter: ModelUniversalSurveyStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalSurveyStudentData(
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
        studentID
        studentAuthID
        studentEmail
        roomID
        currentLocation
        lessonProgress
        surveyData {
          domID
          options
          input
          hasTakenSurvey
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTemporaryUniversalUploadSurveyData = /* GraphQL */ `
  query GetTemporaryUniversalUploadSurveyData($id: ID!) {
    getTemporaryUniversalUploadSurveyData(id: $id) {
      id
      updatedUserId
      universalSurveyId
      universalSurveyStudentData {
        id
        syllabusLessonID
        lessonID
        studentID
        studentAuthID
        studentEmail
        roomID
        currentLocation
        lessonProgress
        surveyData {
          domID
          options
          input
          hasTakenSurvey
        }
        createdAt
        updatedAt
      }
      surveyData {
        domID
        options
        input
        comments {
          commentBy
          comment
        }
        hasTakenSurvey
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTemporaryUniversalUploadSurveyData = /* GraphQL */ `
  query ListTemporaryUniversalUploadSurveyData(
    $id: ID
    $filter: ModelTemporaryUniversalUploadSurveyDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTemporaryUniversalUploadSurveyData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        updatedUserId
        universalSurveyId
        universalSurveyStudentData {
          id
          syllabusLessonID
          lessonID
          studentID
          studentAuthID
          studentEmail
          roomID
          currentLocation
          lessonProgress
          createdAt
          updatedAt
        }
        surveyData {
          domID
          options
          input
          hasTakenSurvey
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTemporaryDemographicsUploadData = /* GraphQL */ `
  query GetTemporaryDemographicsUploadData($id: ID!) {
    getTemporaryDemographicsUploadData(id: $id) {
      id
      updatedUserId
      questionDataID
      QuestionData {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        componentType
        scheduleID
        lessonID
        responseObject {
          qid
          response
          demographicsUpdated
          otherResponse
        }
        createdAt
        updatedAt
      }
      responseObject {
        qid
        response
        demographicsUpdated
        otherResponse
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTemporaryDemographicsUploadData = /* GraphQL */ `
  query ListTemporaryDemographicsUploadData(
    $id: ID
    $filter: ModelTemporaryDemographicsUploadDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTemporaryDemographicsUploadData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        updatedUserId
        questionDataID
        QuestionData {
          id
          syllabusLessonID
          checkpointID
          email
          authID
          componentType
          scheduleID
          lessonID
          createdAt
          updatedAt
        }
        responseObject {
          qid
          response
          demographicsUpdated
          otherResponse
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUploadLogs = /* GraphQL */ `
  query GetUploadLogs($id: ID!) {
    getUploadLogs(id: $id) {
      id
      TemporaryUniversalUploadSurveyDataID
      TemporaryUniversalUploadSurveyData {
        id
        updatedUserId
        universalSurveyId
        universalSurveyStudentData {
          id
          syllabusLessonID
          lessonID
          studentID
          studentAuthID
          studentEmail
          roomID
          currentLocation
          lessonProgress
          createdAt
          updatedAt
        }
        surveyData {
          domID
          options
          input
          hasTakenSurvey
        }
        createdAt
        updatedAt
      }
      TemporaryDemographicsUploadDataID
      TemporaryDemographicsUploadData {
        id
        updatedUserId
        questionDataID
        QuestionData {
          id
          syllabusLessonID
          checkpointID
          email
          authID
          componentType
          scheduleID
          lessonID
          createdAt
          updatedAt
        }
        responseObject {
          qid
          response
          demographicsUpdated
          otherResponse
        }
        createdAt
        updatedAt
      }
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      unit {
        id
        name
        type
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
        priorities
        secondary
        objectives
        languages
        lessons {
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
      surveyName
      unitName
      roomName
      personName
      createdAt
      updatedAt
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
        TemporaryUniversalUploadSurveyDataID
        TemporaryUniversalUploadSurveyData {
          id
          updatedUserId
          universalSurveyId
          createdAt
          updatedAt
        }
        TemporaryDemographicsUploadDataID
        TemporaryDemographicsUploadData {
          id
          updatedUserId
          questionDataID
          createdAt
          updatedAt
        }
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        unit {
          id
          name
          type
          institutionID
          description
          methodology
          policies
          pupose
          priorities
          secondary
          objectives
          languages
          universalLessonsSeq
          designers
          status
          isUsed
          lessonHistory
          createdAt
          updatedAt
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
export const getUniversalJournalData = /* GraphQL */ `
  query GetUniversalJournalData($id: ID!) {
    getUniversalJournalData(id: $id) {
      id
      studentID
      studentAuthID
      studentEmail
      type
      lessonName
      entryData {
        domID
        type
        input
      }
      feedbacks
      shared
      lessonID
      lesson {
        id
        type
        label
        title
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
      }
      syllabusLessonID
      lessonType
      roomID
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalJournalData = /* GraphQL */ `
  query ListUniversalJournalData(
    $id: ID
    $filter: ModelUniversalJournalDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalJournalData(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        studentID
        studentAuthID
        studentEmail
        type
        lessonName
        entryData {
          domID
          type
          input
        }
        feedbacks
        shared
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
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
        syllabusLessonID
        lessonType
        roomID
        createdAt
        updatedAt
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
        isZoiq
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
      description
      methodology
      policies
      pupose
      priorities
      secondary
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
      isUsed
      lessonHistory
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalSyllabi = /* GraphQL */ `
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
        priorities
        secondary
        objectives
        languages
        lessons {
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
export const getCurriculumUnits = /* GraphQL */ `
  query GetCurriculumUnits($id: ID!) {
    getCurriculumUnits(id: $id) {
      id
      unitId
      unit {
        id
        name
        type
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
        priorities
        secondary
        objectives
        languages
        lessons {
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
      curriculumId
      createdAt
      updatedAt
    }
  }
`;
export const listCurriculumUnits = /* GraphQL */ `
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
          description
          methodology
          policies
          pupose
          priorities
          secondary
          objectives
          languages
          universalLessonsSeq
          designers
          status
          isUsed
          lessonHistory
          createdAt
          updatedAt
        }
        curriculumId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUniversalSyllabusLesson = /* GraphQL */ `
  query GetUniversalSyllabusLesson($id: ID!) {
    getUniversalSyllabusLesson(id: $id) {
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
        isUsed
        createdAt
        updatedAt
      }
      displayData {
        breakdownComponent
        studentInfo {
          id
          firstName
          preferredName
          lastName
        }
      }
      lessonPlan {
        id
        disabled
        open
        active
        stage
        type
        displayMode
      }
      startDate
      endDate
      feedback {
        items {
          id
          syllabusLessonID
          liked
          comment
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
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
        displayData {
          breakdownComponent
        }
        lessonPlan {
          id
          disabled
          open
          active
          stage
          type
          displayMode
        }
        startDate
        endDate
        feedback {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUniversalLessonFeedback = /* GraphQL */ `
  query GetUniversalLessonFeedback($id: ID!) {
    getUniversalLessonFeedback(id: $id) {
      id
      syllabusLessonID
      liked
      comment
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
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
        displayData {
          breakdownComponent
        }
        lessonPlan {
          id
          disabled
          open
          active
          stage
          type
          displayMode
        }
        startDate
        endDate
        feedback {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalLessonFeedbacks = /* GraphQL */ `
  query ListUniversalLessonFeedbacks(
    $filter: ModelUniversalLessonFeedbackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUniversalLessonFeedbacks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        syllabusLessonID
        liked
        comment
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
export const getStudentConnections = /* GraphQL */ `
  query GetStudentConnections($id: ID!) {
    getStudentConnections(id: $id) {
      fromEmail
      fromAuthID
      toEmail
      toAuthID
      remarks
      fromStudent {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      toStudent {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      id
      createdAt
      updatedAt
    }
  }
`;
export const listStudentConnections = /* GraphQL */ `
  query ListStudentConnections(
    $filter: ModelStudentConnectionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudentConnections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        fromEmail
        fromAuthID
        toEmail
        toAuthID
        remarks
        fromStudent {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        toStudent {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        id
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPersonSentiments = /* GraphQL */ `
  query GetPersonSentiments($personAuthID: String!, $date: AWSDate!) {
    getPersonSentiments(personAuthID: $personAuthID, date: $date) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      date
      time
      responseText
      backstory
      createdAt
      updatedAt
    }
  }
`;
export const listPersonSentiments = /* GraphQL */ `
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        date
        time
        responseText
        backstory
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSentiments = /* GraphQL */ `
  query GetSentiments($id: ID!) {
    getSentiments(id: $id) {
      id
      sentimentName
      sentimentType
      createdAt
      updatedAt
    }
  }
`;
export const listSentiments = /* GraphQL */ `
  query ListSentiments(
    $filter: ModelSentimentsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSentiments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sentimentName
        sentimentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSentimentTracker = /* GraphQL */ `
  query GetSentimentTracker($personAuthID: String!, $date: AWSDate!) {
    getSentimentTracker(personAuthID: $personAuthID, date: $date) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      sentimentId
      sentiment {
        id
        sentimentName
        sentimentType
        createdAt
        updatedAt
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      syllabusLessonID
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
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
          createdAt
          updatedAt
        }
        displayData {
          breakdownComponent
        }
        lessonPlan {
          id
          disabled
          open
          active
          stage
          type
          displayMode
        }
        startDate
        endDate
        feedback {
          nextToken
        }
        createdAt
        updatedAt
      }
      date
      time
      sentimentName
      sentimentType
      createdAt
      updatedAt
    }
  }
`;
export const listSentimentTrackers = /* GraphQL */ `
  query ListSentimentTrackers(
    $personAuthID: String
    $date: ModelStringKeyConditionInput
    $filter: ModelSentimentTrackerFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSentimentTrackers(
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        sentimentId
        sentiment {
          id
          sentimentName
          sentimentType
          createdAt
          updatedAt
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        syllabusLessonID
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
        date
        time
        sentimentName
        sentimentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFeelingTracker = /* GraphQL */ `
  query GetFeelingTracker($personAuthID: String!, $date: AWSDate!) {
    getFeelingTracker(personAuthID: $personAuthID, date: $date) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      sentimentId
      sentiment {
        id
        sentimentName
        sentimentType
        createdAt
        updatedAt
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
        createdAt
        updatedAt
      }
      lessonID
      date
      time
      sentimentName
      sentimentType
      createdAt
      updatedAt
    }
  }
`;
export const listFeelingTrackers = /* GraphQL */ `
  query ListFeelingTrackers(
    $personAuthID: String
    $date: ModelStringKeyConditionInput
    $filter: ModelFeelingTrackerFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFeelingTrackers(
      personAuthID: $personAuthID
      date: $date
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        sentimentId
        sentiment {
          id
          sentimentName
          sentimentType
          createdAt
          updatedAt
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        lessonID
        date
        time
        sentimentName
        sentimentType
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFeelingsArchive = /* GraphQL */ `
  query GetFeelingsArchive($id: ID!) {
    getFeelingsArchive(id: $id) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      sentimentId
      sentiment {
        items {
          id
          sentimentName
          sentimentType
          createdAt
          updatedAt
        }
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
          phone
          website
          image
          isServiceProvider
          isZoiq
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
          externalId
          grade
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
        type
        isZoiq
        teachingStyle
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          videoLink
          notes
        }
        homework {
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
          videoLink
          notes
        }
        darkMode
        rubrics
        smallGroup
        groupSize
        groupType
        smallGroupSize
        smallGroupOption
        studentMaterials
        targetAudience
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
          type
          isZoiq
          teachingStyle
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
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
export const getPersonFiles = /* GraphQL */ `
  query GetPersonFiles($id: ID!) {
    getPersonFiles(id: $id) {
      id
      personAuthID
      personEmail
      uploadedAt
      feedbacks
      shared
      lessonID
      syllabusLessonID
      lessonType
      roomID
      files {
        fileName
        fileKey
        fileSize
      }
      lessonPageID
      createdAt
      updatedAt
    }
  }
`;
export const listPersonFiles = /* GraphQL */ `
  query ListPersonFiles(
    $id: ID
    $filter: ModelPersonFilesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonFiles(
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
        uploadedAt
        feedbacks
        shared
        lessonID
        syllabusLessonID
        lessonType
        roomID
        files {
          fileName
          fileKey
          fileSize
        }
        lessonPageID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCommunity = /* GraphQL */ `
  query GetCommunity($id: ID!) {
    getCommunity(id: $id) {
      id
      institutionID
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
        isZoiq
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
      cardName
      cardType
      cardDate
      summary
      cardImageLink
      startTime
      endTime
      location
      geoLocation
      additionalLinks
      additionalInfo
      personAuthID
      personEmail
      isEditedCard
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      chat {
        items {
          id
          communityId
          personAuthID
          personEmail
          msg
          createdAt
          isEditedChat
          updatedAt
        }
        nextToken
      }
      summaryHtml
      likes
      chatCount
      createdAt
      updatedAt
    }
  }
`;
export const listCommunities = /* GraphQL */ `
  query ListCommunities(
    $id: ID
    $filter: ModelCommunityFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunities(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        institutionID
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
          isZoiq
          filters
          setupComplete
          createdAt
          updatedAt
        }
        cardName
        cardType
        cardDate
        summary
        cardImageLink
        startTime
        endTime
        location
        geoLocation
        additionalLinks
        additionalInfo
        personAuthID
        personEmail
        isEditedCard
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        chat {
          nextToken
        }
        summaryHtml
        likes
        chatCount
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGameChanger = /* GraphQL */ `
  query GetGameChanger($id: ID!) {
    getGameChanger(id: $id) {
      id
      gameChangerName
      title
      objective
      gameChangerLinks
      inputs
      likes
      createdAt
      updatedAt
    }
  }
`;
export const listGameChangers = /* GraphQL */ `
  query ListGameChangers(
    $id: ID
    $filter: ModelGameChangerFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGameChangers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        gameChangerName
        title
        objective
        gameChangerLinks
        inputs
        likes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGameChangerLog = /* GraphQL */ `
  query GetGameChangerLog($id: ID!) {
    getGameChangerLog(id: $id) {
      id
      gameChangerID
      gameChanger {
        id
        gameChangerName
        title
        objective
        gameChangerLinks
        inputs
        likes
        createdAt
        updatedAt
      }
      personEmail
      personAuthID
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      startTime
      endTime
      createdAt
      updatedAt
    }
  }
`;
export const listGameChangerLogs = /* GraphQL */ `
  query ListGameChangerLogs(
    $id: ID
    $filter: ModelGameChangerLogFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listGameChangerLogs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        gameChangerID
        gameChanger {
          id
          gameChangerName
          title
          objective
          gameChangerLinks
          inputs
          likes
          createdAt
          updatedAt
        }
        personEmail
        personAuthID
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        startTime
        endTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCommunityChat = /* GraphQL */ `
  query GetCommunityChat($id: ID!) {
    getCommunityChat(id: $id) {
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCypressTesting = /* GraphQL */ `
  query GetCypressTesting($id: ID!) {
    getCypressTesting(id: $id) {
      id
      testID
      testName
      testType
      testSteps
      testData
      testExpResults
      edgeCases
      lastUpdate
      createdAt
      updatedAt
    }
  }
`;
export const listCypressTestings = /* GraphQL */ `
  query ListCypressTestings(
    $id: ID
    $filter: ModelCypressTestingFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCypressTestings(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        testID
        testName
        testType
        testSteps
        testData
        testExpResults
        edgeCases
        lastUpdate
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getErrorLog = /* GraphQL */ `
  query GetErrorLog($id: ID!) {
    getErrorLog(id: $id) {
      id
      pageUrl
      componentName
      error
      errorType
      errorTime
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      status
      createdAt
      updatedAt
    }
  }
`;
export const listErrorLogs = /* GraphQL */ `
  query ListErrorLogs(
    $id: ID
    $filter: ModelErrorLogFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listErrorLogs(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        pageUrl
        componentName
        error
        errorType
        errorTime
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDicitionary = /* GraphQL */ `
  query GetDicitionary($id: ID!) {
    getDicitionary(id: $id) {
      id
      authID
      email
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
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
        authID
        email
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
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
export const userById = /* GraphQL */ `
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByRole = /* GraphQL */ `
  query UsersByRole(
    $role: Role!
    $sortDirection: ModelSortDirection
    $filter: ModelPersonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByRole(
      role: $role
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
        inactiveStatusDate
        image
        language
        filters
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
        pageState
        lastPageStateUpdate
        statusChangedBy
        isZoiq
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const lessonsByType2 = /* GraphQL */ `
  query LessonsByType2(
    $lessonType: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPersonLessonsDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lessonsByType2(
      lessonType: $lessonType
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        studentAuthID
        studentEmail
        lessonID
        lessonType
        pages
        ratings
        isCompleted
        roomId
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
          type
          isZoiq
          teachingStyle
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
export const messagesByRoomID = /* GraphQL */ `
  query MessagesByRoomID(
    $roomID: ID!
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
        roomID
        senderAuthID
        senderEmail
        body
        createdAt
        sender {
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
          createdAt
          updatedAt
        }
        updatedAt
      }
      nextToken
    }
  }
`;
export const personLocationBySyllabusLesson = /* GraphQL */ `
  query PersonLocationBySyllabusLesson(
    $syllabusLessonID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPersonLocationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    personLocationBySyllabusLesson(
      syllabusLessonID: $syllabusLessonID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
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
          inactiveStatusDate
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
          statusReason
          addedby
          lastEmotionSubmission
          pageState
          lastPageStateUpdate
          statusChangedBy
          isZoiq
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
          type
          isZoiq
          teachingStyle
          createdAt
          updatedAt
        }
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
        isComplete
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
          signedOff
          status
          createdAt
          updatedAt
        }
        syllabus {
          id
          name
          type
          institutionID
          description
          methodology
          policies
          pupose
          priorities
          secondary
          objectives
          languages
          universalLessonsSeq
          designers
          status
          isUsed
          lessonHistory
          createdAt
          updatedAt
        }
        lesson {
          id
          type
          label
          title
          institutionID
          language
          designers
          objectives
          lessonPlanAttachment
          purpose
          introduction
          introductionTitle
          status
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
          isUsed
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
          type
          isZoiq
          teachingStyle
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
