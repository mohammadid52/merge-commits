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
      spotlightUser
      spotlightDate
      addedby
      createdAt
      updatedAt
    }
  }
`;
export const listPersons = /* GraphQL */ `
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
        classes {
          nextToken
        }
        spotlightUser
        spotlightDate
        addedby
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
        spotlightUser
        spotlightDate
        addedby
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
export const listStaffs = /* GraphQL */ `
  query ListStaffs(
    $filter: ModelStaffFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStaffs(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        spotlightUser
        spotlightDate
        addedby
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
      createdAt
      updatedAt
    }
  }
`;
export const listRooms = /* GraphQL */ `
  query ListRooms(
    $filter: ModelRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
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
        spotlightUser
        spotlightDate
        addedby
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
export const listClassroomGroupStudentss = /* GraphQL */ `
  query ListClassroomGroupStudentss(
    $filter: ModelClassroomGroupStudentsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroupStudentss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        spotlightUser
        spotlightDate
        addedby
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
export const listClassroomGroupss = /* GraphQL */ `
  query ListClassroomGroupss(
    $filter: ModelClassroomGroupsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomGroupss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        onDemand
        sentiments
        passcode
        classes {
          nextToken
        }
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listRoomCoTeacherss = /* GraphQL */ `
  query ListRoomCoTeacherss(
    $filter: ModelRoomCoTeachersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomCoTeacherss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const listClasss = /* GraphQL */ `
  query ListClasss(
    $filter: ModelClassFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClasss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        spotlightUser
        spotlightDate
        addedby
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        syllabi {
          nextToken
        }
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        syllabi {
          nextToken
        }
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          nextToken
        }
        syllabiHistory
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
export const listCSequencess = /* GraphQL */ `
  query ListCSequencess(
    $id: ID
    $filter: ModelCSequencesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCSequencess(
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        syllabi {
          nextToken
        }
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          nextToken
        }
        syllabiHistory
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
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
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const listRoomMsgss = /* GraphQL */ `
  query ListRoomMsgss(
    $filter: ModelRoomMsgsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoomMsgss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLesson = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      title
      type
      label
      instructions
      instructionsTitle
      theme {
        type
        name
        summary
        summaryLabel
        quote {
          id
          source
          text
        }
        connection
        images
        additionalContent {
          video
        }
      }
      grades
      artistID
      language
      SELStructure
      connection
      summary
      purpose
      designers
      objectives
      doFirstID
      warmUpId
      coreLessonId
      activityId
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
      duration
      resources
      notes
      targetAudience
      createdAt
      updatedAt
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
        label
        instructions
        instructionsTitle
        theme {
          type
          name
          summary
          summaryLabel
          connection
          images
        }
        grades
        artistID
        language
        SELStructure
        connection
        summary
        purpose
        designers
        objectives
        doFirstID
        warmUpId
        coreLessonId
        activityId
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
          nextToken
        }
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        duration
        resources
        notes
        targetAudience
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLessonRubrics = /* GraphQL */ `
  query GetLessonRubrics($id: ID!) {
    getLessonRubrics(id: $id) {
      id
      lessonID
      rubricID
      lesson {
        id
        title
        type
        label
        instructions
        instructionsTitle
        theme {
          type
          name
          summary
          summaryLabel
          connection
          images
        }
        grades
        artistID
        language
        SELStructure
        connection
        summary
        purpose
        designers
        objectives
        doFirstID
        warmUpId
        coreLessonId
        activityId
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
          nextToken
        }
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        duration
        resources
        notes
        targetAudience
        createdAt
        updatedAt
      }
      rubric {
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
      createdAt
      updatedAt
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
        lesson {
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
          createdAt
          updatedAt
        }
        rubric {
          id
          name
          criteria
          topicID
          curriculumID
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
export const listSyllabuss = /* GraphQL */ `
  query ListSyllabuss(
    $id: ID
    $filter: ModelSyllabusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listSyllabuss(
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
        status
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
      syllabusID
      lessonID
      unit
      sequence
      status
      lesson {
        id
        title
        type
        label
        instructions
        instructionsTitle
        theme {
          type
          name
          summary
          summaryLabel
          connection
          images
        }
        grades
        artistID
        language
        SELStructure
        connection
        summary
        purpose
        designers
        objectives
        doFirstID
        warmUpId
        coreLessonId
        activityId
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
          nextToken
        }
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        duration
        resources
        notes
        targetAudience
        createdAt
        updatedAt
      }
      complete
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
        }
        corelessonData {
          selectGroup
        }
        activityData {
          editInput
          editMode
          title
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
      data {
        items {
          id
          lessonProgress
          currentLocation
          status
          saveType
          syllabusLessonID
          studentID
          studentAuthID
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
export const listSyllabusLessons = /* GraphQL */ `
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
        lesson {
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
          createdAt
          updatedAt
        }
        complete
        roster
        viewing
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
        data {
          nextToken
        }
        createdAt
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
      syllabusLesson {
        id
        syllabusID
        lessonID
        unit
        sequence
        status
        lesson {
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
          createdAt
          updatedAt
        }
        complete
        roster
        viewing
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
        data {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      warmupData {
        story
        title
        additional {
          name
          input
        }
        truthGame {
          id
          label
          isLie
          text
        }
        poll {
          id
          question
        }
        adventureGame {
          id
          text
        }
      }
      corelessonData {
        selected {
          anchor
          color
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
export const listStudentDatas = /* GraphQL */ `
  query ListStudentDatas(
    $syllabusLessonID: ID
    $studentID: ModelStringKeyConditionInput
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listStudentDatas(
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
        warmupData {
          story
          title
        }
        corelessonData {
          selectGroup
        }
        activityData {
          editInput
          editMode
          title
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
        spotlightUser
        spotlightDate
        addedby
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
    }
  }
`;
export const listAnthologyComments = /* GraphQL */ `
  query ListAnthologyComments(
    $filter: ModelAnthologyCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnthologyComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        attachments {
          type
          url
          filename
          size
        }
        edited
        createdAt
        updatedAt
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
        spotlightUser
        spotlightDate
        addedby
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
        lesson {
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
          createdAt
          updatedAt
        }
        complete
        roster
        viewing
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
        data {
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
          onDemand
          sentiments
          passcode
          spotlightUser
          spotlightDate
          addedby
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
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      syllabusLesson {
        id
        syllabusID
        lessonID
        unit
        sequence
        status
        lesson {
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
          createdAt
          updatedAt
        }
        complete
        roster
        viewing
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
        data {
          nextToken
        }
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
          classSentiment
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
export const getNoticeboardWidget = /* GraphQL */ `
  query GetNoticeboardWidget($id: ID!) {
    getNoticeboardWidget(id: $id) {
      id
      teacherAuthID
      teacherEmail
      roomID
      type
      placement
      title
      description
      content {
        text
        image
      }
      quotes {
        text
        author
      }
      links {
        text
        url
      }
      active
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
        onDemand
        sentiments
        passcode
        classes {
          nextToken
        }
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listNoticeboardWidgets = /* GraphQL */ `
  query ListNoticeboardWidgets(
    $filter: ModelNoticeboardWidgetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNoticeboardWidgets(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        teacherAuthID
        teacherEmail
        roomID
        type
        placement
        title
        description
        content {
          text
          image
        }
        quotes {
          text
          author
        }
        links {
          text
          url
        }
        active
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
          onDemand
          sentiments
          passcode
          spotlightUser
          spotlightDate
          addedby
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        designers
        syllabi {
          nextToken
        }
        universalSyllabusSeq
        checkpoints {
          nextToken
        }
        universalSyllabus {
          nextToken
        }
        syllabiHistory
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPlanner = /* GraphQL */ `
  query GetPlanner($id: ID!) {
    getPlanner(id: $id) {
      id
      type
      lessonID
      lessonName
      syllabusID
      roomID
      description
      startDate
      endDate
      duration
      createdAt
      updatedAt
    }
  }
`;
export const listPlanners = /* GraphQL */ `
  query ListPlanners(
    $filter: ModelPlannerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        lessonID
        lessonName
        syllabusID
        roomID
        description
        startDate
        endDate
        duration
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
export const listUniversalLessonStudentDatas = /* GraphQL */ `
  query ListUniversalLessonStudentDatas(
    $id: ID
    $filter: ModelUniversalLessonStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessonStudentDatas(
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
export const getUniversalLessonWritingExcercises = /* GraphQL */ `
  query GetUniversalLessonWritingExcercises($id: ID!) {
    getUniversalLessonWritingExcercises(id: $id) {
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
export const listUniversalLessonWritingExcercisess = /* GraphQL */ `
  query ListUniversalLessonWritingExcercisess(
    $id: ID
    $filter: ModelUniversalLessonWritingExcercisesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalLessonWritingExcercisess(
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
export const listUniversalArchiveDatas = /* GraphQL */ `
  query ListUniversalArchiveDatas(
    $id: ID
    $filter: ModelUniversalArchiveDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalArchiveDatas(
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalSurveyStudentDatas = /* GraphQL */ `
  query ListUniversalSurveyStudentDatas(
    $id: ID
    $filter: ModelUniversalSurveyStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalSurveyStudentDatas(
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
        }
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
      entryData {
        domID
        type
        input
      }
      feedbacks
      shared
      lessonID
      syllabusLessonID
      lessonType
      roomID
      createdAt
      updatedAt
    }
  }
`;
export const listUniversalJournalDatas = /* GraphQL */ `
  query ListUniversalJournalDatas(
    $id: ID
    $filter: ModelUniversalJournalDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalJournalDatas(
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
        entryData {
          domID
          type
          input
        }
        feedbacks
        shared
        lessonID
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
export const listUniversalSyllabuss = /* GraphQL */ `
  query ListUniversalSyllabuss(
    $id: ID
    $filter: ModelUniversalSyllabusFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUniversalSyllabuss(
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        description
        methodology
        policies
        pupose
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
export const listCurriculumUnitss = /* GraphQL */ `
  query ListCurriculumUnitss(
    $filter: ModelcurriculumUnitsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCurriculumUnitss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        warmUpData {
          story
          title
        }
        corelessonData {
          selectGroup
        }
        activityData {
          editInput
          editMode
          title
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
    listUniversalSyllabusLessons(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
    listUniversalLessonFeedbacks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      id
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
        spotlightUser
        spotlightDate
        addedby
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
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listStudentConnectionss = /* GraphQL */ `
  query ListStudentConnectionss(
    $filter: ModelStudentConnectionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStudentConnectionss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
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
        spotlightUser
        spotlightDate
        addedby
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
export const listPersonSentimentss = /* GraphQL */ `
  query ListPersonSentimentss(
    $personAuthID: String
    $date: ModelStringKeyConditionInput
    $filter: ModelPersonSentimentsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonSentimentss(
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
export const listSentimentss = /* GraphQL */ `
  query ListSentimentss(
    $filter: ModelSentimentsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSentimentss(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        spotlightUser
        spotlightDate
        addedby
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
        spotlightUser
        spotlightDate
        addedby
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
        createdAt
        updatedAt
      }
      lessonID
      lesson {
        id
        title
        type
        label
        instructions
        instructionsTitle
        theme {
          type
          name
          summary
          summaryLabel
          connection
          images
        }
        grades
        artistID
        language
        SELStructure
        connection
        summary
        purpose
        designers
        objectives
        doFirstID
        warmUpId
        coreLessonId
        activityId
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
          nextToken
        }
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
          filters
          setupComplete
          createdAt
          updatedAt
        }
        duration
        resources
        notes
        targetAudience
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
          doFirstID
          warmUpId
          coreLessonId
          activityId
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
          institutionID
          duration
          resources
          notes
          targetAudience
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
        spotlightUser
        spotlightDate
        addedby
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
          lessonPlanAttachment
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
export const listPersonFiless = /* GraphQL */ `
  query ListPersonFiless(
    $id: ID
    $filter: ModelPersonFilesFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPersonFiless(
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
        spotlightUser
        spotlightDate
        addedby
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
export const listCommunitys = /* GraphQL */ `
  query ListCommunitys(
    $id: ID
    $filter: ModelCommunityFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listCommunitys(
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
        spotlightUser
        spotlightDate
        addedby
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
        sentiments
        passcode
        classes {
          nextToken
        }
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByRole = /* GraphQL */ `
  query UsersByRole(
    $role: Role
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
        spotlightUser
        spotlightDate
        addedby
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesByRoomID = /* GraphQL */ `
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
        updatedAt
      }
      nextToken
    }
  }
`;
export const personLocationBySyllabusLesson = /* GraphQL */ `
  query PersonLocationBySyllabusLesson(
    $syllabusLessonID: ID
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
          classSentiment
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
    $studentID: ID
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
