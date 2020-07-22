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
      institution {
        id
        name
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
        coordinator {
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
      externalId
      grade
      courses {
        id
        name
        courseType {
          id
          name
          createdAt
          updatedAt
        }
        institution {
          id
          name
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
        classroomTeacher {
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
        fellow {
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
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
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
        id
        title
        contributors {
          nextToken
        }
        grade
        artist {
          images
          name
          bio
        }
        language
        quotes {
          text
          source
        }
        summary
        objectives
        primarySELType {
          id
          structureID
          name
          description
          createdAt
          updatedAt
        }
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
          id
          title
          grade
          language
          summary
          objectives
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
export const getCourse = /* GraphQL */ `
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      name
      courseType {
        id
        name
        createdAt
        updatedAt
      }
      institution {
        id
        name
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
        coordinator {
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
      classroomTeacher {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      fellow {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      curriculum {
        id
        name
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
          id
          title
          grade
          language
          summary
          objectives
          createdAt
          updatedAt
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
        courseType {
          id
          name
          createdAt
          updatedAt
        }
        institution {
          id
          name
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
        classroomTeacher {
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
        fellow {
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
export const getInstitution = /* GraphQL */ `
  query GetInstitution($id: ID!) {
    getInstitution(id: $id) {
      id
      name
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
      coordinator {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
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
        coordinator {
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
export const getSelStructure = /* GraphQL */ `
  query GetSelStructure($id: ID!) {
    getSELStructure(id: $id) {
      id
      name
      description
      types {
        items {
          id
          structureID
          name
          description
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
        types {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSelType = /* GraphQL */ `
  query GetSelType($id: ID!) {
    getSELType(id: $id) {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listSelTypes = /* GraphQL */ `
  query ListSelTypes(
    $filter: ModelSELTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSELTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        structureID
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroomDataTest = /* GraphQL */ `
  query GetClassroomDataTest($classroomID: ID!, $studentID: String!) {
    getClassroomDataTest(classroomID: $classroomID, studentID: $studentID) {
      lessonProgress
      classroomID
      classroom {
        id
        courseID
        lessonID
        lessonPlan {
          stage
          type
          breakdown
        }
        artist {
          images
          name
          bio
        }
        quotes {
          text
          source
        }
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
        data {
          nextToken
        }
        createdAt
        updatedAt
      }
      studentID
      student {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      data {
        warmup {
          story
          title
        }
        activity {
          editInput
          editMode
          title
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const listClassroomDataTests = /* GraphQL */ `
  query ListClassroomDataTests(
    $classroomID: ID
    $studentID: ModelStringKeyConditionInput
    $filter: ModelClassroomDataTestFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listClassroomDataTests(
      classroomID: $classroomID
      studentID: $studentID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        lessonProgress
        classroomID
        classroom {
          id
          courseID
          lessonID
          createdAt
          updatedAt
        }
        studentID
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassroomData = /* GraphQL */ `
  query GetClassroomData($id: ID!) {
    getClassroomData(id: $id) {
      classID
      lessonProgress
      class {
        id
        courseID
        lessonID
        lessonPlan {
          stage
          type
          breakdown
        }
        artist {
          images
          name
          bio
        }
        quotes {
          text
          source
        }
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
        data {
          nextToken
        }
        createdAt
        updatedAt
      }
      studentID
      student {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const listClassroomDatas = /* GraphQL */ `
  query ListClassroomDatas(
    $filter: ModelClassroomDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassroomDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        classID
        lessonProgress
        class {
          id
          courseID
          lessonID
          createdAt
          updatedAt
        }
        studentID
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
        dataObjects {
          name
          data
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClassData = /* GraphQL */ `
  query GetClassData($id: ID!) {
    getClassData(id: $id) {
      classroomID
      lessonProgress
      classroom {
        id
        courseID
        lessonID
        lessonPlan {
          stage
          type
          breakdown
        }
        artist {
          images
          name
          bio
        }
        quotes {
          text
          source
        }
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
        data {
          nextToken
        }
        createdAt
        updatedAt
      }
      studentID
      student {
        id
        authId
        status
        email
        role
        firstName
        preferredName
        lastName
        institution {
          id
          name
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
        externalId
        grade
        courses {
          id
          name
          location
          startDate
          endDate
          duration
          createdAt
          updatedAt
        }
        phone
        birthdate
        image
        language
        createdAt
        updatedAt
      }
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const listClassDatas = /* GraphQL */ `
  query ListClassDatas(
    $filter: ModelClassDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClassDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        classroomID
        lessonProgress
        classroom {
          id
          courseID
          lessonID
          createdAt
          updatedAt
        }
        studentID
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
        dataObjects {
          name
          data
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClass = /* GraphQL */ `
  query GetClass($id: ID!, $courseID: ID!, $lessonID: ID!) {
    getClass(id: $id, courseID: $courseID, lessonID: $lessonID) {
      id
      courseID
      lessonID
      lessonPlan {
        stage
        type
        breakdown
      }
      artist {
        images
        name
        bio
      }
      quotes {
        text
        source
      }
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
      data {
        items {
          classID
          lessonProgress
          studentID
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
    $id: ID
    $courseIDLessonID: ModelClassPrimaryCompositeKeyConditionInput
    $filter: ModelClassFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listClasss(
      id: $id
      courseIDLessonID: $courseIDLessonID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        courseID
        lessonID
        lessonPlan {
          stage
          type
          breakdown
        }
        artist {
          images
          name
          bio
        }
        quotes {
          text
          source
        }
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
export const getClassroom = /* GraphQL */ `
  query GetClassroom($id: ID!) {
    getClassroom(id: $id) {
      id
      courseID
      lessonID
      lessonPlan {
        stage
        type
        breakdown
      }
      artist {
        images
        name
        bio
      }
      quotes {
        text
        source
      }
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
      data {
        items {
          classID
          lessonProgress
          studentID
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
        courseID
        lessonID
        lessonPlan {
          stage
          type
          breakdown
        }
        artist {
          images
          name
          bio
        }
        quotes {
          text
          source
        }
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
      grade
      artist {
        images
        name
        bio
      }
      language
      quotes {
        text
        source
      }
      summary
      objectives
      primarySELType {
        id
        structureID
        name
        description
        createdAt
        updatedAt
      }
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
        grade
        artist {
          images
          name
          bio
        }
        language
        quotes {
          text
          source
        }
        summary
        objectives
        primarySELType {
          id
          structureID
          name
          description
          createdAt
          updatedAt
        }
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
