/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
          designers
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
        filters
        lastLoggedIn
        lastLoggedOut
        createdAt
        updatedAt
      }
      curricula {
        items {
          id
          staffID
          curriculumID
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
          createdAt
          updatedAt
        }
        curricula {
          nextToken
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
      type
      firstName
      preferredName
      lastName
      externalId
      grade
      wordbank {
        items {
          id
          wordID
          studentID
          studentAuthID
          createdAt
          updatedAt
        }
        nextToken
      }
      onBoardSurvey
      offBoardSurvey
      phone
      birthdate
      image
      language
      classes {
        items {
          id
          classID
          studentID
          studentEmail
          studentAuthID
          status
          createdAt
          updatedAt
        }
        nextToken
      }
      filters
      lastLoggedIn
      lastLoggedOut
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
        filters
        lastLoggedIn
        lastLoggedOut
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
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
        }
        filters
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
          createdAt
          updatedAt
        }
        nextToken
      }
      designers
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
          createdAt
          updatedAt
        }
        syllabi {
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
          createdAt
          updatedAt
        }
        syllabi {
          nextToken
        }
        designers
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
          description
          objectives
          languages
          designers
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
      distinguished
      excelled
      adequite
      basic
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
          description
          objectives
          languages
          designers
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
        distinguished
        excelled
        adequite
        basic
        topicID
        topic {
          id
          curriculumID
          learningObjectiveID
          name
          description
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
          createdAt
          updatedAt
        }
        syllabi {
          nextToken
        }
        designers
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
          description
          objectives
          languages
          designers
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
          createdAt
          updatedAt
        }
        nextToken
      }
      designers
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
          createdAt
          updatedAt
        }
        nextToken
      }
      startDate
      duration
      createdAt
      updatedAt
    }
  }
`;
export const listCourses = /* GraphQL */ `
  query ListCourses(
    $filter: ModelCourseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        classrooms {
          nextToken
        }
        startDate
        duration
        createdAt
        updatedAt
      }
      nextToken
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
      classroom {
        id
        open
        openedAt
        closedAt
        complete
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartDate
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          type
          startDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          type
          instructions
          grades
          artistID
          language
          SELStructure
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
          filters
          createdAt
          updatedAt
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
        data {
          nextToken
        }
        feedback {
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
        filters
        lastLoggedIn
        lastLoggedOut
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
      createdAt
      updatedAt
    }
  }
`;
export const listStudentDatas = /* GraphQL */ `
  query ListStudentDatas(
    $classroomID: ID
    $studentID: ModelStringKeyConditionInput
    $filter: ModelStudentDataFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listStudentDatas(
      classroomID: $classroomID
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
        classroomID
        classroom {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getArtist = /* GraphQL */ `
  query GetArtist($id: ID!) {
    getArtist(id: $id) {
      id
      images
      name
      type
      bio
      quotes {
        id
        source
        text
      }
      additionalContent {
        video
        links {
          id
          type
          text
          link
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listArtists = /* GraphQL */ `
  query ListArtists(
    $filter: ModelArtistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArtists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        images
        name
        type
        bio
        quotes {
          id
          source
          text
        }
        additionalContent {
          video
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      open
      openedAt
      closedAt
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
      expectedStartDate
      expectedEndDate
      SELStructure
      courseID
      course {
        id
        name
        type
        classrooms {
          nextToken
        }
        startDate
        duration
        createdAt
        updatedAt
      }
      lessonID
      lesson {
        id
        title
        type
        instructions
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
        artist {
          id
          images
          name
          type
          bio
          createdAt
          updatedAt
        }
        language
        SELStructure
        keywords {
          nextToken
        }
        connection
        summary
        objectives
        checkpoints {
          nextToken
        }
        doFirstID
        doFirst {
          id
          type
          required
          createdAt
          updatedAt
        }
        warmUpId
        warmUp {
          id
          title
          label
          stage
          type
          language
          SELTypes
          createdAt
          updatedAt
        }
        coreLessonId
        coreLesson {
          id
          title
          label
          stage
          type
          language
          SELTypes
          createdAt
          updatedAt
        }
        activityId
        activity {
          id
          title
          label
          stage
          type
          language
          SELTypes
          lineNumber
          createdAt
          updatedAt
        }
        assessmentID
        assessment {
          id
          title
          type
          openingMessage
          closingMessage
          createdAt
          updatedAt
        }
        filters
        createdAt
        updatedAt
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
      data {
        items {
          id
          lessonProgress
          currentLocation
          status
          saveType
          classroomID
          studentID
          studentAuthID
          createdAt
          updatedAt
        }
        nextToken
      }
      feedback {
        items {
          id
          classroomID
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
export const listClassrooms = /* GraphQL */ `
  query ListClassrooms(
    $filter: ModelClassroomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassrooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        open
        openedAt
        closedAt
        complete
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartDate
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          type
          startDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          type
          instructions
          grades
          artistID
          language
          SELStructure
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
          filters
          createdAt
          updatedAt
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
        data {
          nextToken
        }
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
export const getFeedback = /* GraphQL */ `
  query GetFeedback($id: ID!) {
    getFeedback(id: $id) {
      id
      classroomID
      liked
      comment
      classroom {
        id
        open
        openedAt
        closedAt
        complete
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartDate
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          type
          startDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          type
          instructions
          grades
          artistID
          language
          SELStructure
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
          filters
          createdAt
          updatedAt
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
        data {
          nextToken
        }
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
export const listFeedbacks = /* GraphQL */ `
  query ListFeedbacks(
    $filter: ModelFeedbackFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeedbacks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        classroomID
        liked
        comment
        classroom {
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
export const getSelStructure = /* GraphQL */ `
  query GetSelStructure($id: ID!) {
    getSELStructure(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listSelStructures = /* GraphQL */ `
  query ListSelStructures(
    $filter: ModelSELStructureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSELStructures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getThemeTemplate = /* GraphQL */ `
  query GetThemeTemplate($id: ID!) {
    getThemeTemplate(id: $id) {
      id
      type
      name
      summary
      summaryLabel
      quote {
        id
        source
        text
      }
      keywords {
        items {
          id
          wordID
          lessonID
          createdAt
          updatedAt
        }
        nextToken
      }
      connection
      images
      additionalContent {
        video
        links {
          id
          type
          text
          link
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listThemeTemplates = /* GraphQL */ `
  query ListThemeTemplates(
    $filter: ModelThemeTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listThemeTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        name
        summary
        summaryLabel
        quote {
          id
          source
          text
        }
        keywords {
          nextToken
        }
        connection
        images
        additionalContent {
          video
        }
        createdAt
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
      instructions
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
      artist {
        id
        images
        name
        type
        bio
        quotes {
          id
          source
          text
        }
        additionalContent {
          video
        }
        createdAt
        updatedAt
      }
      language
      SELStructure
      keywords {
        items {
          id
          wordID
          lessonID
          createdAt
          updatedAt
        }
        nextToken
      }
      connection
      summary
      objectives
      checkpoints {
        items {
          id
          lessonID
          checkpointID
          position
          createdAt
          updatedAt
        }
        nextToken
      }
      doFirstID
      doFirst {
        id
        type
        required
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
      warmUpId
      warmUp {
        id
        title
        label
        stage
        type
        language
        SELTypes
        instructions {
          video
          link
          text
        }
        inputs {
          title
          example
          titleExample
          textExample
          listInputNumber
        }
        breakdown {
          included
          reflectionQuestions
        }
        createdAt
        updatedAt
      }
      coreLessonId
      coreLesson {
        id
        title
        label
        stage
        type
        language
        SELTypes
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
          id
          name
          color
          icon
        }
        breakdown {
          included
          reflectionQuestions
        }
        createdAt
        updatedAt
      }
      activityId
      activity {
        id
        title
        label
        stage
        type
        language
        SELTypes
        instructions {
          video
          link
          text
        }
        lineNumber
        writingPrompts {
          id
          name
          prompt
          example
        }
        breakdown {
          included
          reflectionQuestions
        }
        createdAt
        updatedAt
      }
      assessmentID
      assessment {
        id
        title
        type
        openingMessage
        closingMessage
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
      filters
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
        instructions
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
        artist {
          id
          images
          name
          type
          bio
          createdAt
          updatedAt
        }
        language
        SELStructure
        keywords {
          nextToken
        }
        connection
        summary
        objectives
        checkpoints {
          nextToken
        }
        doFirstID
        doFirst {
          id
          type
          required
          createdAt
          updatedAt
        }
        warmUpId
        warmUp {
          id
          title
          label
          stage
          type
          language
          SELTypes
          createdAt
          updatedAt
        }
        coreLessonId
        coreLesson {
          id
          title
          label
          stage
          type
          language
          SELTypes
          createdAt
          updatedAt
        }
        activityId
        activity {
          id
          title
          label
          stage
          type
          language
          SELTypes
          lineNumber
          createdAt
          updatedAt
        }
        assessmentID
        assessment {
          id
          title
          type
          openingMessage
          closingMessage
          createdAt
          updatedAt
        }
        filters
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDoFirst = /* GraphQL */ `
  query GetDoFirst($id: ID!) {
    getDoFirst(id: $id) {
      id
      type
      required
      questions {
        items {
          id
          doFirstID
          questionID
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
export const listDoFirsts = /* GraphQL */ `
  query ListDoFirsts(
    $filter: ModelDoFirstFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDoFirsts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        required
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWarmUp = /* GraphQL */ `
  query GetWarmUp($id: ID!) {
    getWarmUp(id: $id) {
      id
      title
      label
      stage
      type
      language
      SELTypes
      instructions {
        video
        link
        text
      }
      inputs {
        title
        example
        titleExample
        textExample
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
        }
        adventureGameInputs {
          id
          text
        }
      }
      breakdown {
        included
        reflectionQuestions
      }
      createdAt
      updatedAt
    }
  }
`;
export const listWarmUps = /* GraphQL */ `
  query ListWarmUps(
    $filter: ModelWarmUpFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWarmUps(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        label
        stage
        type
        language
        SELTypes
        instructions {
          video
          link
          text
        }
        inputs {
          title
          example
          titleExample
          textExample
          listInputNumber
        }
        breakdown {
          included
          reflectionQuestions
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCoreLesson = /* GraphQL */ `
  query GetCoreLesson($id: ID!) {
    getCoreLesson(id: $id) {
      id
      title
      label
      stage
      type
      language
      SELTypes
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
        id
        name
        color
        icon
      }
      breakdown {
        included
        reflectionQuestions
      }
      createdAt
      updatedAt
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
        stage
        type
        language
        SELTypes
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
          id
          name
          color
          icon
        }
        breakdown {
          included
          reflectionQuestions
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getActivity = /* GraphQL */ `
  query GetActivity($id: ID!) {
    getActivity(id: $id) {
      id
      title
      label
      stage
      type
      language
      SELTypes
      instructions {
        video
        link
        text
      }
      lineNumber
      writingPrompts {
        id
        name
        prompt
        example
      }
      breakdown {
        included
        reflectionQuestions
      }
      createdAt
      updatedAt
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
        stage
        type
        language
        SELTypes
        instructions {
          video
          link
          text
        }
        lineNumber
        writingPrompts {
          id
          name
          prompt
          example
        }
        breakdown {
          included
          reflectionQuestions
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
      type
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
        type
        instructions
        questions {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAssessment = /* GraphQL */ `
  query GetAssessment($id: ID!) {
    getAssessment(id: $id) {
      id
      title
      type
      openingMessage
      closingMessage
      checkpoints {
        items {
          id
          assessmentID
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
export const listAssessments = /* GraphQL */ `
  query ListAssessments(
    $filter: ModelAssessmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssessments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        type
        openingMessage
        closingMessage
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
export const getAssessmentCheckpoint = /* GraphQL */ `
  query GetAssessmentCheckpoint($id: ID!) {
    getAssessmentCheckpoint(id: $id) {
      id
      assessmentID
      checkpointID
      assessment {
        id
        title
        type
        openingMessage
        closingMessage
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
      checkpoint {
        id
        label
        title
        subtitle
        type
        instructions
        questions {
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
export const listAssessmentCheckpoints = /* GraphQL */ `
  query ListAssessmentCheckpoints(
    $filter: ModelAssessmentCheckpointFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssessmentCheckpoints(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        assessmentID
        checkpointID
        assessment {
          id
          title
          type
          openingMessage
          closingMessage
          createdAt
          updatedAt
        }
        checkpoint {
          id
          label
          title
          subtitle
          type
          instructions
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
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
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
export const getQuestionData = /* GraphQL */ `
  query GetQuestionData($id: ID!) {
    getQuestionData(id: $id) {
      id
      classroomID
      email
      authID
      classroom {
        id
        open
        openedAt
        closedAt
        complete
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartDate
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          type
          startDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          type
          instructions
          grades
          artistID
          language
          SELStructure
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
          filters
          createdAt
          updatedAt
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
        data {
          nextToken
        }
        feedback {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
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
        classroomID
        email
        authID
        classroom {
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
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const listWords = /* GraphQL */ `
  query ListWords(
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        word
        definition
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFilterGroup = /* GraphQL */ `
  query GetFilterGroup($id: ID!) {
    getFilterGroup(id: $id) {
      id
      name
      description
      filters {
        items {
          id
          filterGroupID
          filterID
          zoiq
          admin
          show
          required
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
export const listFilterGroups = /* GraphQL */ `
  query ListFilterGroups(
    $filter: ModelFilterGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFilterGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFilterGroupFilter = /* GraphQL */ `
  query GetFilterGroupFilter($id: ID!) {
    getFilterGroupFilter(id: $id) {
      id
      filterGroupID
      filterID
      zoiq
      admin
      show
      required
      filter {
        id
        name
        description
        options {
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
export const listFilterGroupFilters = /* GraphQL */ `
  query ListFilterGroupFilters(
    $filter: ModelFilterGroupFilterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFilterGroupFilters(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        filterGroupID
        filterID
        zoiq
        admin
        show
        required
        filter {
          id
          name
          description
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
export const getFilter = /* GraphQL */ `
  query GetFilter($id: ID!) {
    getFilter(id: $id) {
      id
      name
      description
      options {
        items {
          id
          filterID
          text
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
export const listFilters = /* GraphQL */ `
  query ListFilters(
    $filter: ModelFilterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFilters(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        options {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFilterOption = /* GraphQL */ `
  query GetFilterOption($id: ID!) {
    getFilterOption(id: $id) {
      id
      filterID
      text
      createdAt
      updatedAt
    }
  }
`;
export const listFilterOptions = /* GraphQL */ `
  query ListFilterOptions(
    $id: ID
    $filter: ModelFilterOptionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listFilterOptions(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        filterID
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClients = /* GraphQL */ `
  query GetClients($id: ID!) {
    getClients(id: $id) {
      id
      name
      subdomain
      key
      createdAt
      updatedAt
    }
  }
`;
export const listClientss = /* GraphQL */ `
  query ListClientss(
    $id: ID
    $filter: ModelClientsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listClientss(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        name
        subdomain
        key
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
        filters
        lastLoggedIn
        lastLoggedOut
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
        wordbank {
          nextToken
        }
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        classes {
          nextToken
        }
        filters
        lastLoggedIn
        lastLoggedOut
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchByWord = /* GraphQL */ `
  query SearchByWord(
    $word: String
    $sortDirection: ModelSortDirection
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchByWord(
      word: $word
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        word
        definition
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
