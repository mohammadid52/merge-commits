/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getInstitutionType = /* GraphQL */ `
  query GetInstitutionType($id: ID!) {
    getInstitutionType(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listInstitutionTypes = /* GraphQL */ `
  query ListInstitutionTypes(
    $filter: ModelInstitutionTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInstitutionTypes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const getInstitution = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
      institutionTypeId
      institutionType {
        id
        name
        createdAt
        updatedAt
      }
      district
      address
      city
      state
      zip
      phone
      contact {
        name
        phone
        email
      }
      website
      type {
        id
        name
        createdAt
        updatedAt
      }
      image
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
        institutionTypeId
        institutionType {
          id
          name
          createdAt
          updatedAt
        }
        district
        address
        city
        state
        zip
        phone
        contact {
          name
          phone
          email
        }
        website
        type {
          id
          name
          createdAt
          updatedAt
        }
        image
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
      phone
      birthdate
      image
      language
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
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
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
      name
      contributors {
        items {
          id
          authId
          status
          email
          role
          firstName
          preferredName
          lastName
          externalId
          grade
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        nextToken
      }
      grade
      languages
      lessons {
        items {
          id
          curriculumID
          lessonID
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
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCourseType = /* GraphQL */ `
  query GetCourseType($id: ID!) {
    getCourseType(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listCourseTypes = /* GraphQL */ `
  query ListCourseTypes(
    $filter: ModelCourseTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCourseTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      courseTypeID
      courseType {
        id
        name
        createdAt
        updatedAt
      }
      institution {
        id
        name
        institutionTypeId
        institutionType {
          id
          name
          createdAt
          updatedAt
        }
        district
        address
        city
        state
        zip
        phone
        contact {
          name
          phone
          email
        }
        website
        type {
          id
          name
          createdAt
          updatedAt
        }
        image
        createdAt
        updatedAt
      }
      classID
      class {
        id
        name
        students {
          nextToken
        }
        createdAt
        updatedAt
      }
      curriculumID
      curriculum {
        id
        name
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
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
        courseTypeID
        courseType {
          id
          name
          createdAt
          updatedAt
        }
        institution {
          id
          name
          institutionTypeId
          district
          address
          city
          state
          zip
          phone
          website
          image
          createdAt
          updatedAt
        }
        classID
        class {
          id
          name
          createdAt
          updatedAt
        }
        curriculumID
        curriculum {
          id
          name
          grade
          languages
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
      nextToken
    }
  }
`;
export const getClass = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
      id
      name
      students {
        items {
          id
          classID
          studentID
          studentEmail
          studentAuth
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
        name
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
export const getStudentData = /* GraphQL */ `
  query GetStudentData($classroomID: ID!, $studentID: String!) {
    getStudentData(classroomID: $classroomID, studentID: $studentID) {
      id
      lessonProgress
      status
      classroomID
      classroom {
        id
        open
        openedAt
        closedAt
        roster
        displayData {
          breakdownComponent
        }
        courseID
        course {
          id
          name
          courseTypeID
          classID
          curriculumID
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          grades
          artistID
          language
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
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
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
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
      }
      corelessonData {
        selected {
          anchor
          color
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
        status
        classroomID
        classroom {
          id
          open
          openedAt
          closedAt
          roster
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
          firstName
          preferredName
          lastName
          externalId
          grade
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        warmupData {
          story
          title
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
      roster
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
        activityData {
          editInput
          editMode
          title
        }
      }
      courseID
      course {
        id
        name
        courseTypeID
        courseType {
          id
          name
          createdAt
          updatedAt
        }
        institution {
          id
          name
          institutionTypeId
          district
          address
          city
          state
          zip
          phone
          website
          image
          createdAt
          updatedAt
        }
        classID
        class {
          id
          name
          createdAt
          updatedAt
        }
        curriculumID
        curriculum {
          id
          name
          grade
          languages
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
      lessonID
      lesson {
        id
        title
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
          status
          classroomID
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
        roster
        displayData {
          breakdownComponent
        }
        courseID
        course {
          id
          name
          courseTypeID
          classID
          curriculumID
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        lessonID
        lesson {
          id
          title
          grades
          artistID
          language
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
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
export const getLesson = /* GraphQL */ `
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      title
      contributors {
        items {
          id
          authId
          status
          email
          role
          firstName
          preferredName
          lastName
          externalId
          grade
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        nextToken
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
      SELStructureID
      SELStructure {
        id
        name
        description
        createdAt
        updatedAt
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        additionalInputs {
          id
          name
          prompt
          example
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
      questionID
      email
      authID
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
        createdAt
        updatedAt
      }
      person {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      response
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
        questionID
        email
        authID
        question {
          id
          label
          type
          question
          createdAt
          updatedAt
        }
        person {
          id
          authId
          status
          email
          role
          firstName
          preferredName
          lastName
          externalId
          grade
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        response
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
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
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
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
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
export const searchPersons = /* GraphQL */ `
  query SearchPersons(
    $filter: SearchablePersonFilterInput
    $sort: SearchablePersonSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchPersons(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        externalId
        grade
        wordbank {
          nextToken
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      nextToken
      total
    }
  }
`;
