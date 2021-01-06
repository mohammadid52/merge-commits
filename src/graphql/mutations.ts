/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createInstitution = /* GraphQL */ `
  mutation CreateInstitution(
    $input: CreateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    createInstitution(input: $input, condition: $condition) {
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
export const updateInstitution = /* GraphQL */ `
  mutation UpdateInstitution(
    $input: UpdateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    updateInstitution(input: $input, condition: $condition) {
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
export const deleteInstitution = /* GraphQL */ `
  mutation DeleteInstitution(
    $input: DeleteInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    deleteInstitution(input: $input, condition: $condition) {
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
export const createServiceProvider = /* GraphQL */ `
  mutation CreateServiceProvider(
    $input: CreateServiceProviderInput!
    $condition: ModelServiceProviderConditionInput
  ) {
    createServiceProvider(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateServiceProvider = /* GraphQL */ `
  mutation UpdateServiceProvider(
    $input: UpdateServiceProviderInput!
    $condition: ModelServiceProviderConditionInput
  ) {
    updateServiceProvider(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteServiceProvider = /* GraphQL */ `
  mutation DeleteServiceProvider(
    $input: DeleteServiceProviderInput!
    $condition: ModelServiceProviderConditionInput
  ) {
    deleteServiceProvider(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createStaff = /* GraphQL */ `
  mutation CreateStaff(
    $input: CreateStaffInput!
    $condition: ModelStaffConditionInput
  ) {
    createStaff(input: $input, condition: $condition) {
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
export const updateStaff = /* GraphQL */ `
  mutation UpdateStaff(
    $input: UpdateStaffInput!
    $condition: ModelStaffConditionInput
  ) {
    updateStaff(input: $input, condition: $condition) {
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
export const deleteStaff = /* GraphQL */ `
  mutation DeleteStaff(
    $input: DeleteStaffInput!
    $condition: ModelStaffConditionInput
  ) {
    deleteStaff(input: $input, condition: $condition) {
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
export const createRoom = /* GraphQL */ `
  mutation CreateRoom(
    $input: CreateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    createRoom(input: $input, condition: $condition) {
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
export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom(
    $input: UpdateRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    updateRoom(input: $input, condition: $condition) {
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
export const deleteRoom = /* GraphQL */ `
  mutation DeleteRoom(
    $input: DeleteRoomInput!
    $condition: ModelRoomConditionInput
  ) {
    deleteRoom(input: $input, condition: $condition) {
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
export const createClass = /* GraphQL */ `
  mutation CreateClass(
    $input: CreateClassInput!
    $condition: ModelClassConditionInput
  ) {
    createClass(input: $input, condition: $condition) {
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
export const updateClass = /* GraphQL */ `
  mutation UpdateClass(
    $input: UpdateClassInput!
    $condition: ModelClassConditionInput
  ) {
    updateClass(input: $input, condition: $condition) {
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
export const deleteClass = /* GraphQL */ `
  mutation DeleteClass(
    $input: DeleteClassInput!
    $condition: ModelClassConditionInput
  ) {
    deleteClass(input: $input, condition: $condition) {
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
export const createClassStudent = /* GraphQL */ `
  mutation CreateClassStudent(
    $input: CreateClassStudentInput!
    $condition: ModelClassStudentConditionInput
  ) {
    createClassStudent(input: $input, condition: $condition) {
      id
      classID
      studentID
      studentEmail
      studentAuthID
      status
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
      createdAt
      updatedAt
    }
  }
`;
export const updateClassStudent = /* GraphQL */ `
  mutation UpdateClassStudent(
    $input: UpdateClassStudentInput!
    $condition: ModelClassStudentConditionInput
  ) {
    updateClassStudent(input: $input, condition: $condition) {
      id
      classID
      studentID
      studentEmail
      studentAuthID
      status
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteClassStudent = /* GraphQL */ `
  mutation DeleteClassStudent(
    $input: DeleteClassStudentInput!
    $condition: ModelClassStudentConditionInput
  ) {
    deleteClassStudent(input: $input, condition: $condition) {
      id
      classID
      studentID
      studentEmail
      studentAuthID
      status
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
          objectives
          curriculumID
          languages
          createdAt
          updatedAt
        }
        nextToken
      }
      topics {
        items {
          id
          curriculumID
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
export const updateCurriculum = /* GraphQL */ `
  mutation UpdateCurriculum(
    $input: UpdateCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    updateCurriculum(input: $input, condition: $condition) {
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
          objectives
          curriculumID
          languages
          createdAt
          updatedAt
        }
        nextToken
      }
      topics {
        items {
          id
          curriculumID
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
export const deleteCurriculum = /* GraphQL */ `
  mutation DeleteCurriculum(
    $input: DeleteCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    deleteCurriculum(input: $input, condition: $condition) {
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
          objectives
          curriculumID
          languages
          createdAt
          updatedAt
        }
        nextToken
      }
      topics {
        items {
          id
          curriculumID
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
export const createTopic = /* GraphQL */ `
  mutation CreateTopic(
    $input: CreateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    createTopic(input: $input, condition: $condition) {
      id
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
        topics {
          nextToken
        }
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
export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic(
    $input: UpdateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    updateTopic(input: $input, condition: $condition) {
      id
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
        topics {
          nextToken
        }
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
export const deleteTopic = /* GraphQL */ `
  mutation DeleteTopic(
    $input: DeleteTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    deleteTopic(input: $input, condition: $condition) {
      id
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
        topics {
          nextToken
        }
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
export const createLearningObjective = /* GraphQL */ `
  mutation CreateLearningObjective(
    $input: CreateLearningObjectiveInput!
    $condition: ModelLearningObjectiveConditionInput
  ) {
    createLearningObjective(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateLearningObjective = /* GraphQL */ `
  mutation UpdateLearningObjective(
    $input: UpdateLearningObjectiveInput!
    $condition: ModelLearningObjectiveConditionInput
  ) {
    updateLearningObjective(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteLearningObjective = /* GraphQL */ `
  mutation DeleteLearningObjective(
    $input: DeleteLearningObjectiveInput!
    $condition: ModelLearningObjectiveConditionInput
  ) {
    deleteLearningObjective(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createRubric = /* GraphQL */ `
  mutation CreateRubric(
    $input: CreateRubricInput!
    $condition: ModelRubricConditionInput
  ) {
    createRubric(input: $input, condition: $condition) {
      id
      criteria
      distinguished
      excelled
      Adequite
      basic
      learningObjectiveID
      learningObjective {
        id
        name
        description
        createdAt
        updatedAt
      }
      topicID
      topic {
        id
        curriculumID
        curriculum {
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
        name
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateRubric = /* GraphQL */ `
  mutation UpdateRubric(
    $input: UpdateRubricInput!
    $condition: ModelRubricConditionInput
  ) {
    updateRubric(input: $input, condition: $condition) {
      id
      criteria
      distinguished
      excelled
      Adequite
      basic
      learningObjectiveID
      learningObjective {
        id
        name
        description
        createdAt
        updatedAt
      }
      topicID
      topic {
        id
        curriculumID
        curriculum {
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
        name
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteRubric = /* GraphQL */ `
  mutation DeleteRubric(
    $input: DeleteRubricInput!
    $condition: ModelRubricConditionInput
  ) {
    deleteRubric(input: $input, condition: $condition) {
      id
      criteria
      distinguished
      excelled
      Adequite
      basic
      learningObjectiveID
      learningObjective {
        id
        name
        description
        createdAt
        updatedAt
      }
      topicID
      topic {
        id
        curriculumID
        curriculum {
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
        name
        description
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTeacherCurriculum = /* GraphQL */ `
  mutation CreateTeacherCurriculum(
    $input: CreateTeacherCurriculumInput!
    $condition: ModelTeacherCurriculumConditionInput
  ) {
    createTeacherCurriculum(input: $input, condition: $condition) {
      id
      staffID
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
        topics {
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
export const updateTeacherCurriculum = /* GraphQL */ `
  mutation UpdateTeacherCurriculum(
    $input: UpdateTeacherCurriculumInput!
    $condition: ModelTeacherCurriculumConditionInput
  ) {
    updateTeacherCurriculum(input: $input, condition: $condition) {
      id
      staffID
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
        topics {
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
export const deleteTeacherCurriculum = /* GraphQL */ `
  mutation DeleteTeacherCurriculum(
    $input: DeleteTeacherCurriculumInput!
    $condition: ModelTeacherCurriculumConditionInput
  ) {
    deleteTeacherCurriculum(input: $input, condition: $condition) {
      id
      staffID
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
        topics {
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
export const createRoomCurriculum = /* GraphQL */ `
  mutation CreateRoomCurriculum(
    $input: CreateRoomCurriculumInput!
    $condition: ModelRoomCurriculumConditionInput
  ) {
    createRoomCurriculum(input: $input, condition: $condition) {
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
        topics {
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
export const updateRoomCurriculum = /* GraphQL */ `
  mutation UpdateRoomCurriculum(
    $input: UpdateRoomCurriculumInput!
    $condition: ModelRoomCurriculumConditionInput
  ) {
    updateRoomCurriculum(input: $input, condition: $condition) {
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
        topics {
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
export const deleteRoomCurriculum = /* GraphQL */ `
  mutation DeleteRoomCurriculum(
    $input: DeleteRoomCurriculumInput!
    $condition: ModelRoomCurriculumConditionInput
  ) {
    deleteRoomCurriculum(input: $input, condition: $condition) {
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
        topics {
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
export const createSyllabus = /* GraphQL */ `
  mutation CreateSyllabus(
    $input: CreateSyllabusInput!
    $condition: ModelSyllabusConditionInput
  ) {
    createSyllabus(input: $input, condition: $condition) {
      id
      name
      type
      description
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
export const updateSyllabus = /* GraphQL */ `
  mutation UpdateSyllabus(
    $input: UpdateSyllabusInput!
    $condition: ModelSyllabusConditionInput
  ) {
    updateSyllabus(input: $input, condition: $condition) {
      id
      name
      type
      description
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
export const deleteSyllabus = /* GraphQL */ `
  mutation DeleteSyllabus(
    $input: DeleteSyllabusInput!
    $condition: ModelSyllabusConditionInput
  ) {
    deleteSyllabus(input: $input, condition: $condition) {
      id
      name
      type
      description
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
export const createSyllabusLesson = /* GraphQL */ `
  mutation CreateSyllabusLesson(
    $input: CreateSyllabusLessonInput!
    $condition: ModelSyllabusLessonConditionInput
  ) {
    createSyllabusLesson(input: $input, condition: $condition) {
      id
      syllabusID
      lessonID
      unit
      sequence
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
      createdAt
      updatedAt
    }
  }
`;
export const updateSyllabusLesson = /* GraphQL */ `
  mutation UpdateSyllabusLesson(
    $input: UpdateSyllabusLessonInput!
    $condition: ModelSyllabusLessonConditionInput
  ) {
    updateSyllabusLesson(input: $input, condition: $condition) {
      id
      syllabusID
      lessonID
      unit
      sequence
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteSyllabusLesson = /* GraphQL */ `
  mutation DeleteSyllabusLesson(
    $input: DeleteSyllabusLessonInput!
    $condition: ModelSyllabusLessonConditionInput
  ) {
    deleteSyllabusLesson(input: $input, condition: $condition) {
      id
      syllabusID
      lessonID
      unit
      sequence
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
export const updateCourse = /* GraphQL */ `
  mutation UpdateCourse(
    $input: UpdateCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    updateCourse(input: $input, condition: $condition) {
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
export const deleteCourse = /* GraphQL */ `
  mutation DeleteCourse(
    $input: DeleteCourseInput!
    $condition: ModelCourseConditionInput
  ) {
    deleteCourse(input: $input, condition: $condition) {
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
export const createStudentData = /* GraphQL */ `
  mutation CreateStudentData(
    $input: CreateStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    createStudentData(input: $input, condition: $condition) {
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
export const updateStudentData = /* GraphQL */ `
  mutation UpdateStudentData(
    $input: UpdateStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    updateStudentData(input: $input, condition: $condition) {
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
export const deleteStudentData = /* GraphQL */ `
  mutation DeleteStudentData(
    $input: DeleteStudentDataInput!
    $condition: ModelStudentDataConditionInput
  ) {
    deleteStudentData(input: $input, condition: $condition) {
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
export const createArtist = /* GraphQL */ `
  mutation CreateArtist(
    $input: CreateArtistInput!
    $condition: ModelArtistConditionInput
  ) {
    createArtist(input: $input, condition: $condition) {
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
export const updateArtist = /* GraphQL */ `
  mutation UpdateArtist(
    $input: UpdateArtistInput!
    $condition: ModelArtistConditionInput
  ) {
    updateArtist(input: $input, condition: $condition) {
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
export const deleteArtist = /* GraphQL */ `
  mutation DeleteArtist(
    $input: DeleteArtistInput!
    $condition: ModelArtistConditionInput
  ) {
    deleteArtist(input: $input, condition: $condition) {
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
export const createClassroom = /* GraphQL */ `
  mutation CreateClassroom(
    $input: CreateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    createClassroom(input: $input, condition: $condition) {
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
export const updateClassroom = /* GraphQL */ `
  mutation UpdateClassroom(
    $input: UpdateClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    updateClassroom(input: $input, condition: $condition) {
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
export const deleteClassroom = /* GraphQL */ `
  mutation DeleteClassroom(
    $input: DeleteClassroomInput!
    $condition: ModelClassroomConditionInput
  ) {
    deleteClassroom(input: $input, condition: $condition) {
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
export const createFeedback = /* GraphQL */ `
  mutation CreateFeedback(
    $input: CreateFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    createFeedback(input: $input, condition: $condition) {
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
export const updateFeedback = /* GraphQL */ `
  mutation UpdateFeedback(
    $input: UpdateFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    updateFeedback(input: $input, condition: $condition) {
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
export const deleteFeedback = /* GraphQL */ `
  mutation DeleteFeedback(
    $input: DeleteFeedbackInput!
    $condition: ModelFeedbackConditionInput
  ) {
    deleteFeedback(input: $input, condition: $condition) {
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
export const createSelStructure = /* GraphQL */ `
  mutation CreateSelStructure(
    $input: CreateSELStructureInput!
    $condition: ModelSELStructureConditionInput
  ) {
    createSELStructure(input: $input, condition: $condition) {
      id
      name
      description
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
      createdAt
      updatedAt
    }
  }
`;
export const createThemeTemplate = /* GraphQL */ `
  mutation CreateThemeTemplate(
    $input: CreateThemeTemplateInput!
    $condition: ModelThemeTemplateConditionInput
  ) {
    createThemeTemplate(input: $input, condition: $condition) {
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
export const updateThemeTemplate = /* GraphQL */ `
  mutation UpdateThemeTemplate(
    $input: UpdateThemeTemplateInput!
    $condition: ModelThemeTemplateConditionInput
  ) {
    updateThemeTemplate(input: $input, condition: $condition) {
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
export const deleteThemeTemplate = /* GraphQL */ `
  mutation DeleteThemeTemplate(
    $input: DeleteThemeTemplateInput!
    $condition: ModelThemeTemplateConditionInput
  ) {
    deleteThemeTemplate(input: $input, condition: $condition) {
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
export const createLesson = /* GraphQL */ `
  mutation CreateLesson(
    $input: CreateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    createLesson(input: $input, condition: $condition) {
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
export const updateLesson = /* GraphQL */ `
  mutation UpdateLesson(
    $input: UpdateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    updateLesson(input: $input, condition: $condition) {
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
export const deleteLesson = /* GraphQL */ `
  mutation DeleteLesson(
    $input: DeleteLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    deleteLesson(input: $input, condition: $condition) {
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
export const createLessonCheckpoint = /* GraphQL */ `
  mutation CreateLessonCheckpoint(
    $input: CreateLessonCheckpointInput!
    $condition: ModelLessonCheckpointConditionInput
  ) {
    createLessonCheckpoint(input: $input, condition: $condition) {
      id
      lessonID
      checkpointID
      position
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
export const updateLessonCheckpoint = /* GraphQL */ `
  mutation UpdateLessonCheckpoint(
    $input: UpdateLessonCheckpointInput!
    $condition: ModelLessonCheckpointConditionInput
  ) {
    updateLessonCheckpoint(input: $input, condition: $condition) {
      id
      lessonID
      checkpointID
      position
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
export const deleteLessonCheckpoint = /* GraphQL */ `
  mutation DeleteLessonCheckpoint(
    $input: DeleteLessonCheckpointInput!
    $condition: ModelLessonCheckpointConditionInput
  ) {
    deleteLessonCheckpoint(input: $input, condition: $condition) {
      id
      lessonID
      checkpointID
      position
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
export const createDoFirst = /* GraphQL */ `
  mutation CreateDoFirst(
    $input: CreateDoFirstInput!
    $condition: ModelDoFirstConditionInput
  ) {
    createDoFirst(input: $input, condition: $condition) {
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
export const updateDoFirst = /* GraphQL */ `
  mutation UpdateDoFirst(
    $input: UpdateDoFirstInput!
    $condition: ModelDoFirstConditionInput
  ) {
    updateDoFirst(input: $input, condition: $condition) {
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
export const deleteDoFirst = /* GraphQL */ `
  mutation DeleteDoFirst(
    $input: DeleteDoFirstInput!
    $condition: ModelDoFirstConditionInput
  ) {
    deleteDoFirst(input: $input, condition: $condition) {
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
export const createDoFirstQuestion = /* GraphQL */ `
  mutation CreateDoFirstQuestion(
    $input: CreateDoFirstQuestionInput!
    $condition: ModelDoFirstQuestionConditionInput
  ) {
    createDoFirstQuestion(input: $input, condition: $condition) {
      id
      doFirstID
      questionID
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
      createdAt
      updatedAt
    }
  }
`;
export const updateDoFirstQuestion = /* GraphQL */ `
  mutation UpdateDoFirstQuestion(
    $input: UpdateDoFirstQuestionInput!
    $condition: ModelDoFirstQuestionConditionInput
  ) {
    updateDoFirstQuestion(input: $input, condition: $condition) {
      id
      doFirstID
      questionID
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteDoFirstQuestion = /* GraphQL */ `
  mutation DeleteDoFirstQuestion(
    $input: DeleteDoFirstQuestionInput!
    $condition: ModelDoFirstQuestionConditionInput
  ) {
    deleteDoFirstQuestion(input: $input, condition: $condition) {
      id
      doFirstID
      questionID
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
export const createCheckpoint = /* GraphQL */ `
  mutation CreateCheckpoint(
    $input: CreateCheckpointInput!
    $condition: ModelCheckpointConditionInput
  ) {
    createCheckpoint(input: $input, condition: $condition) {
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
export const updateCheckpoint = /* GraphQL */ `
  mutation UpdateCheckpoint(
    $input: UpdateCheckpointInput!
    $condition: ModelCheckpointConditionInput
  ) {
    updateCheckpoint(input: $input, condition: $condition) {
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
export const deleteCheckpoint = /* GraphQL */ `
  mutation DeleteCheckpoint(
    $input: DeleteCheckpointInput!
    $condition: ModelCheckpointConditionInput
  ) {
    deleteCheckpoint(input: $input, condition: $condition) {
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
export const createCheckpointQuestions = /* GraphQL */ `
  mutation CreateCheckpointQuestions(
    $input: CreateCheckpointQuestionsInput!
    $condition: ModelCheckpointQuestionsConditionInput
  ) {
    createCheckpointQuestions(input: $input, condition: $condition) {
      id
      checkpointID
      questionID
      required
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
      createdAt
      updatedAt
    }
  }
`;
export const updateCheckpointQuestions = /* GraphQL */ `
  mutation UpdateCheckpointQuestions(
    $input: UpdateCheckpointQuestionsInput!
    $condition: ModelCheckpointQuestionsConditionInput
  ) {
    updateCheckpointQuestions(input: $input, condition: $condition) {
      id
      checkpointID
      questionID
      required
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteCheckpointQuestions = /* GraphQL */ `
  mutation DeleteCheckpointQuestions(
    $input: DeleteCheckpointQuestionsInput!
    $condition: ModelCheckpointQuestionsConditionInput
  ) {
    deleteCheckpointQuestions(input: $input, condition: $condition) {
      id
      checkpointID
      questionID
      required
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
      createdAt
      updatedAt
    }
  }
`;
export const createAssessment = /* GraphQL */ `
  mutation CreateAssessment(
    $input: CreateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    createAssessment(input: $input, condition: $condition) {
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
export const updateAssessment = /* GraphQL */ `
  mutation UpdateAssessment(
    $input: UpdateAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    updateAssessment(input: $input, condition: $condition) {
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
export const deleteAssessment = /* GraphQL */ `
  mutation DeleteAssessment(
    $input: DeleteAssessmentInput!
    $condition: ModelAssessmentConditionInput
  ) {
    deleteAssessment(input: $input, condition: $condition) {
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
export const createAssessmentCheckpoint = /* GraphQL */ `
  mutation CreateAssessmentCheckpoint(
    $input: CreateAssessmentCheckpointInput!
    $condition: ModelAssessmentCheckpointConditionInput
  ) {
    createAssessmentCheckpoint(input: $input, condition: $condition) {
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
export const updateAssessmentCheckpoint = /* GraphQL */ `
  mutation UpdateAssessmentCheckpoint(
    $input: UpdateAssessmentCheckpointInput!
    $condition: ModelAssessmentCheckpointConditionInput
  ) {
    updateAssessmentCheckpoint(input: $input, condition: $condition) {
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
export const deleteAssessmentCheckpoint = /* GraphQL */ `
  mutation DeleteAssessmentCheckpoint(
    $input: DeleteAssessmentCheckpointInput!
    $condition: ModelAssessmentCheckpointConditionInput
  ) {
    deleteAssessmentCheckpoint(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
export const createQuestionData = /* GraphQL */ `
  mutation CreateQuestionData(
    $input: CreateQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    createQuestionData(input: $input, condition: $condition) {
      id
      questionID
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
      response
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionData = /* GraphQL */ `
  mutation UpdateQuestionData(
    $input: UpdateQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    updateQuestionData(input: $input, condition: $condition) {
      id
      questionID
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
      response
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionData = /* GraphQL */ `
  mutation DeleteQuestionData(
    $input: DeleteQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    deleteQuestionData(input: $input, condition: $condition) {
      id
      questionID
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
      response
      createdAt
      updatedAt
    }
  }
`;
export const createQuestionDataStudentData = /* GraphQL */ `
  mutation CreateQuestionDataStudentData(
    $input: CreateQuestionDataStudentDataInput!
    $condition: ModelQuestionDataStudentDataConditionInput
  ) {
    createQuestionDataStudentData(input: $input, condition: $condition) {
      id
      studentDataID
      studentData {
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
      questionDataID
      questionData {
        id
        questionID
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
        response
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionDataStudentData = /* GraphQL */ `
  mutation UpdateQuestionDataStudentData(
    $input: UpdateQuestionDataStudentDataInput!
    $condition: ModelQuestionDataStudentDataConditionInput
  ) {
    updateQuestionDataStudentData(input: $input, condition: $condition) {
      id
      studentDataID
      studentData {
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
      questionDataID
      questionData {
        id
        questionID
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
        response
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionDataStudentData = /* GraphQL */ `
  mutation DeleteQuestionDataStudentData(
    $input: DeleteQuestionDataStudentDataInput!
    $condition: ModelQuestionDataStudentDataConditionInput
  ) {
    deleteQuestionDataStudentData(input: $input, condition: $condition) {
      id
      studentDataID
      studentData {
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
      questionDataID
      questionData {
        id
        questionID
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
        response
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createWord = /* GraphQL */ `
  mutation CreateWord(
    $input: CreateWordInput!
    $condition: ModelWordConditionInput
  ) {
    createWord(input: $input, condition: $condition) {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const updateWord = /* GraphQL */ `
  mutation UpdateWord(
    $input: UpdateWordInput!
    $condition: ModelWordConditionInput
  ) {
    updateWord(input: $input, condition: $condition) {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const deleteWord = /* GraphQL */ `
  mutation DeleteWord(
    $input: DeleteWordInput!
    $condition: ModelWordConditionInput
  ) {
    deleteWord(input: $input, condition: $condition) {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const createLessonKeyWord = /* GraphQL */ `
  mutation CreateLessonKeyWord(
    $input: CreateLessonKeyWordInput!
    $condition: ModelLessonKeyWordConditionInput
  ) {
    createLessonKeyWord(input: $input, condition: $condition) {
      id
      wordID
      lessonID
      word {
        id
        word
        definition
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const updateLessonKeyWord = /* GraphQL */ `
  mutation UpdateLessonKeyWord(
    $input: UpdateLessonKeyWordInput!
    $condition: ModelLessonKeyWordConditionInput
  ) {
    updateLessonKeyWord(input: $input, condition: $condition) {
      id
      wordID
      lessonID
      word {
        id
        word
        definition
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteLessonKeyWord = /* GraphQL */ `
  mutation DeleteLessonKeyWord(
    $input: DeleteLessonKeyWordInput!
    $condition: ModelLessonKeyWordConditionInput
  ) {
    deleteLessonKeyWord(input: $input, condition: $condition) {
      id
      wordID
      lessonID
      word {
        id
        word
        definition
        createdAt
        updatedAt
      }
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
      createdAt
      updatedAt
    }
  }
`;
export const createStudentWord = /* GraphQL */ `
  mutation CreateStudentWord(
    $input: CreateStudentWordInput!
    $condition: ModelStudentWordConditionInput
  ) {
    createStudentWord(input: $input, condition: $condition) {
      id
      wordID
      studentID
      studentAuthID
      word {
        id
        word
        definition
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
      createdAt
      updatedAt
    }
  }
`;
export const updateStudentWord = /* GraphQL */ `
  mutation UpdateStudentWord(
    $input: UpdateStudentWordInput!
    $condition: ModelStudentWordConditionInput
  ) {
    updateStudentWord(input: $input, condition: $condition) {
      id
      wordID
      studentID
      studentAuthID
      word {
        id
        word
        definition
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteStudentWord = /* GraphQL */ `
  mutation DeleteStudentWord(
    $input: DeleteStudentWordInput!
    $condition: ModelStudentWordConditionInput
  ) {
    deleteStudentWord(input: $input, condition: $condition) {
      id
      wordID
      studentID
      studentAuthID
      word {
        id
        word
        definition
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
      createdAt
      updatedAt
    }
  }
`;
export const createFilterGroup = /* GraphQL */ `
  mutation CreateFilterGroup(
    $input: CreateFilterGroupInput!
    $condition: ModelFilterGroupConditionInput
  ) {
    createFilterGroup(input: $input, condition: $condition) {
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
export const updateFilterGroup = /* GraphQL */ `
  mutation UpdateFilterGroup(
    $input: UpdateFilterGroupInput!
    $condition: ModelFilterGroupConditionInput
  ) {
    updateFilterGroup(input: $input, condition: $condition) {
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
export const deleteFilterGroup = /* GraphQL */ `
  mutation DeleteFilterGroup(
    $input: DeleteFilterGroupInput!
    $condition: ModelFilterGroupConditionInput
  ) {
    deleteFilterGroup(input: $input, condition: $condition) {
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
export const createFilterGroupFilter = /* GraphQL */ `
  mutation CreateFilterGroupFilter(
    $input: CreateFilterGroupFilterInput!
    $condition: ModelFilterGroupFilterConditionInput
  ) {
    createFilterGroupFilter(input: $input, condition: $condition) {
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
export const updateFilterGroupFilter = /* GraphQL */ `
  mutation UpdateFilterGroupFilter(
    $input: UpdateFilterGroupFilterInput!
    $condition: ModelFilterGroupFilterConditionInput
  ) {
    updateFilterGroupFilter(input: $input, condition: $condition) {
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
export const deleteFilterGroupFilter = /* GraphQL */ `
  mutation DeleteFilterGroupFilter(
    $input: DeleteFilterGroupFilterInput!
    $condition: ModelFilterGroupFilterConditionInput
  ) {
    deleteFilterGroupFilter(input: $input, condition: $condition) {
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
export const createFilter = /* GraphQL */ `
  mutation CreateFilter(
    $input: CreateFilterInput!
    $condition: ModelFilterConditionInput
  ) {
    createFilter(input: $input, condition: $condition) {
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
export const updateFilter = /* GraphQL */ `
  mutation UpdateFilter(
    $input: UpdateFilterInput!
    $condition: ModelFilterConditionInput
  ) {
    updateFilter(input: $input, condition: $condition) {
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
export const deleteFilter = /* GraphQL */ `
  mutation DeleteFilter(
    $input: DeleteFilterInput!
    $condition: ModelFilterConditionInput
  ) {
    deleteFilter(input: $input, condition: $condition) {
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
export const createFilterOption = /* GraphQL */ `
  mutation CreateFilterOption(
    $input: CreateFilterOptionInput!
    $condition: ModelFilterOptionConditionInput
  ) {
    createFilterOption(input: $input, condition: $condition) {
      id
      filterID
      text
      createdAt
      updatedAt
    }
  }
`;
export const updateFilterOption = /* GraphQL */ `
  mutation UpdateFilterOption(
    $input: UpdateFilterOptionInput!
    $condition: ModelFilterOptionConditionInput
  ) {
    updateFilterOption(input: $input, condition: $condition) {
      id
      filterID
      text
      createdAt
      updatedAt
    }
  }
`;
export const deleteFilterOption = /* GraphQL */ `
  mutation DeleteFilterOption(
    $input: DeleteFilterOptionInput!
    $condition: ModelFilterOptionConditionInput
  ) {
    deleteFilterOption(input: $input, condition: $condition) {
      id
      filterID
      text
      createdAt
      updatedAt
    }
  }
`;
