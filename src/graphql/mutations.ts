/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInstitutionType = /* GraphQL */ `
  mutation CreateInstitutionType(
    $input: CreateInstitutionTypeInput!
    $condition: ModelInstitutionTypeConditionInput
  ) {
    createInstitutionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateInstitutionType = /* GraphQL */ `
  mutation UpdateInstitutionType(
    $input: UpdateInstitutionTypeInput!
    $condition: ModelInstitutionTypeConditionInput
  ) {
    updateInstitutionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteInstitutionType = /* GraphQL */ `
  mutation DeleteInstitutionType(
    $input: DeleteInstitutionTypeInput!
    $condition: ModelInstitutionTypeConditionInput
  ) {
    deleteInstitutionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createCourseType = /* GraphQL */ `
  mutation CreateCourseType(
    $input: CreateCourseTypeInput!
    $condition: ModelCourseTypeConditionInput
  ) {
    createCourseType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateCourseType = /* GraphQL */ `
  mutation UpdateCourseType(
    $input: UpdateCourseTypeInput!
    $condition: ModelCourseTypeConditionInput
  ) {
    updateCourseType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteCourseType = /* GraphQL */ `
  mutation DeleteCourseType(
    $input: DeleteCourseTypeInput!
    $condition: ModelCourseTypeConditionInput
  ) {
    deleteCourseType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createPerson = /* GraphQL */ `
  mutation CreatePerson(
    $input: CreatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    createPerson(input: $input, condition: $condition) {
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
export const updatePerson = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
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
export const deletePerson = /* GraphQL */ `
  mutation DeletePerson(
    $input: DeletePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    deletePerson(input: $input, condition: $condition) {
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
export const createCurriculum = /* GraphQL */ `
  mutation CreateCurriculum(
    $input: CreateCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    createCurriculum(input: $input, condition: $condition) {
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
export const updateCurriculum = /* GraphQL */ `
  mutation UpdateCurriculum(
    $input: UpdateCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    updateCurriculum(input: $input, condition: $condition) {
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
export const deleteCurriculum = /* GraphQL */ `
  mutation DeleteCurriculum(
    $input: DeleteCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    deleteCurriculum(input: $input, condition: $condition) {
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
export const createCourse = /* GraphQL */ `
  mutation CreateCourse(
    $input: CreateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    createCourse(input: $input, condition: $condition) {
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createInstitution = /* GraphQL */ `
  mutation CreateInstitution(
    $input: CreateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    createInstitution(input: $input, condition: $condition) {
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
export const updateInstitution = /* GraphQL */ `
  mutation UpdateInstitution(
    $input: UpdateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    updateInstitution(input: $input, condition: $condition) {
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
export const deleteInstitution = /* GraphQL */ `
  mutation DeleteInstitution(
    $input: DeleteInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    deleteInstitution(input: $input, condition: $condition) {
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
export const createSelStructure = /* GraphQL */ `
  mutation CreateSelStructure(
    $input: CreateSELStructureInput!
    $condition: ModelSELStructureConditionInput
  ) {
    createSELStructure(input: $input, condition: $condition) {
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
export const updateSelStructure = /* GraphQL */ `
  mutation UpdateSelStructure(
    $input: UpdateSELStructureInput!
    $condition: ModelSELStructureConditionInput
  ) {
    updateSELStructure(input: $input, condition: $condition) {
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
export const deleteSelStructure = /* GraphQL */ `
  mutation DeleteSelStructure(
    $input: DeleteSELStructureInput!
    $condition: ModelSELStructureConditionInput
  ) {
    deleteSELStructure(input: $input, condition: $condition) {
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
export const createSelType = /* GraphQL */ `
  mutation CreateSelType(
    $input: CreateSELTypeInput!
    $condition: ModelSELTypeConditionInput
  ) {
    createSELType(input: $input, condition: $condition) {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateSelType = /* GraphQL */ `
  mutation UpdateSelType(
    $input: UpdateSELTypeInput!
    $condition: ModelSELTypeConditionInput
  ) {
    updateSELType(input: $input, condition: $condition) {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteSelType = /* GraphQL */ `
  mutation DeleteSelType(
    $input: DeleteSELTypeInput!
    $condition: ModelSELTypeConditionInput
  ) {
    deleteSELType(input: $input, condition: $condition) {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createClassroomDataTest = /* GraphQL */ `
  mutation CreateClassroomDataTest(
    $input: CreateClassroomDataTestInput!
    $condition: ModelClassroomDataTestConditionInput
  ) {
    createClassroomDataTest(input: $input, condition: $condition) {
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
export const updateClassroomDataTest = /* GraphQL */ `
  mutation UpdateClassroomDataTest(
    $input: UpdateClassroomDataTestInput!
    $condition: ModelClassroomDataTestConditionInput
  ) {
    updateClassroomDataTest(input: $input, condition: $condition) {
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
export const deleteClassroomDataTest = /* GraphQL */ `
  mutation DeleteClassroomDataTest(
    $input: DeleteClassroomDataTestInput!
    $condition: ModelClassroomDataTestConditionInput
  ) {
    deleteClassroomDataTest(input: $input, condition: $condition) {
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
export const createClassroomData = /* GraphQL */ `
  mutation CreateClassroomData(
    $input: CreateClassroomDataInput!
    $condition: ModelClassroomDataConditionInput
  ) {
    createClassroomData(input: $input, condition: $condition) {
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
export const updateClassroomData = /* GraphQL */ `
  mutation UpdateClassroomData(
    $input: UpdateClassroomDataInput!
    $condition: ModelClassroomDataConditionInput
  ) {
    updateClassroomData(input: $input, condition: $condition) {
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
export const deleteClassroomData = /* GraphQL */ `
  mutation DeleteClassroomData(
    $input: DeleteClassroomDataInput!
    $condition: ModelClassroomDataConditionInput
  ) {
    deleteClassroomData(input: $input, condition: $condition) {
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
export const createClassData = /* GraphQL */ `
  mutation CreateClassData(
    $input: CreateClassDataInput!
    $condition: ModelClassDataConditionInput
  ) {
    createClassData(input: $input, condition: $condition) {
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
export const updateClassData = /* GraphQL */ `
  mutation UpdateClassData(
    $input: UpdateClassDataInput!
    $condition: ModelClassDataConditionInput
  ) {
    updateClassData(input: $input, condition: $condition) {
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
export const deleteClassData = /* GraphQL */ `
  mutation DeleteClassData(
    $input: DeleteClassDataInput!
    $condition: ModelClassDataConditionInput
  ) {
    deleteClassData(input: $input, condition: $condition) {
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
export const createClass = /* GraphQL */ `
  mutation CreateClass(
    $input: CreateClassInput!
    $condition: ModelClassConditionInput
  ) {
    createClass(input: $input, condition: $condition) {
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
export const updateClass = /* GraphQL */ `
  mutation UpdateClass(
    $input: UpdateClassInput!
    $condition: ModelClassConditionInput
  ) {
    updateClass(input: $input, condition: $condition) {
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
export const deleteClass = /* GraphQL */ `
  mutation DeleteClass(
    $input: DeleteClassInput!
    $condition: ModelClassConditionInput
  ) {
    deleteClass(input: $input, condition: $condition) {
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
export const createClassroom = /* GraphQL */ `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
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
export const updateClassroom = /* GraphQL */ `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
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
export const deleteClassroom = /* GraphQL */ `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
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
export const createLesson = /* GraphQL */ `
  mutation CreateLesson(
    $input: CreateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    createLesson(input: $input, condition: $condition) {
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
export const updateLesson = /* GraphQL */ `
  mutation UpdateLesson(
    $input: UpdateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    updateLesson(input: $input, condition: $condition) {
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
export const deleteLesson = /* GraphQL */ `
  mutation DeleteLesson(
    $input: DeleteLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    deleteLesson(input: $input, condition: $condition) {
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
export const createWarmUp = /* GraphQL */ `
  mutation CreateWarmUp(
    $input: CreateWarmUpInput!
    $condition: ModelWarmUpConditionInput
  ) {
    createWarmUp(input: $input, condition: $condition) {
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
export const updateWarmUp = /* GraphQL */ `
  mutation UpdateWarmUp(
    $input: UpdateWarmUpInput!
    $condition: ModelWarmUpConditionInput
  ) {
    updateWarmUp(input: $input, condition: $condition) {
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
export const deleteWarmUp = /* GraphQL */ `
  mutation DeleteWarmUp(
    $input: DeleteWarmUpInput!
    $condition: ModelWarmUpConditionInput
  ) {
    deleteWarmUp(input: $input, condition: $condition) {
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
export const createCoreLesson = /* GraphQL */ `
  mutation CreateCoreLesson(
    $input: CreateCoreLessonInput!
    $condition: ModelCoreLessonConditionInput
  ) {
    createCoreLesson(input: $input, condition: $condition) {
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
export const updateCoreLesson = /* GraphQL */ `
  mutation UpdateCoreLesson(
    $input: UpdateCoreLessonInput!
    $condition: ModelCoreLessonConditionInput
  ) {
    updateCoreLesson(input: $input, condition: $condition) {
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
export const deleteCoreLesson = /* GraphQL */ `
  mutation DeleteCoreLesson(
    $input: DeleteCoreLessonInput!
    $condition: ModelCoreLessonConditionInput
  ) {
    deleteCoreLesson(input: $input, condition: $condition) {
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
export const createActivity = /* GraphQL */ `
  mutation CreateActivity(
    $input: CreateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    createActivity(input: $input, condition: $condition) {
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
export const updateActivity = /* GraphQL */ `
  mutation UpdateActivity(
    $input: UpdateActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    updateActivity(input: $input, condition: $condition) {
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
export const deleteActivity = /* GraphQL */ `
  mutation DeleteActivity(
    $input: DeleteActivityInput!
    $condition: ModelActivityConditionInput
  ) {
    deleteActivity(input: $input, condition: $condition) {
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
