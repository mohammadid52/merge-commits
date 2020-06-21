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
      firstName
      preferredName
      lastName
      institution {
        id
        name
        address
        phone
        contact {
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
        type
        createdAt
        updatedAt
      }
      externalId
      grade
      courses {
        id
        name
        courseType
        institution {
          id
          name
          address
          phone
          type
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
          address
          phone
          type
          createdAt
          updatedAt
        }
        externalId
        grade
        courses {
          id
          name
          courseType
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
      courseType
      institution {
        id
        name
        address
        phone
        contact {
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
        type
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
          address
          phone
          type
          createdAt
          updatedAt
        }
        externalId
        grade
        courses {
          id
          name
          courseType
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
          address
          phone
          type
          createdAt
          updatedAt
        }
        externalId
        grade
        courses {
          id
          name
          courseType
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
        courseType
        institution {
          id
          name
          address
          phone
          type
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
      address
      phone
      contact {
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
          address
          phone
          type
          createdAt
          updatedAt
        }
        externalId
        grade
        courses {
          id
          name
          courseType
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
      type
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
        address
        phone
        contact {
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
        type
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
export const getClass = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
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
        studentID
        dataObjects {
          type
          data
        }
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
          studentID
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
