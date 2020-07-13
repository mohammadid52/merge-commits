/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson {
    onCreatePerson {
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
        type
        image
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
          district
          address
          city
          state
          zip
          phone
          type
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
export const onUpdatePerson = /* GraphQL */ `
  subscription OnUpdatePerson {
    onUpdatePerson {
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
        type
        image
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
          district
          address
          city
          state
          zip
          phone
          type
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
export const onDeletePerson = /* GraphQL */ `
  subscription OnDeletePerson {
    onDeletePerson {
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
        type
        image
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
          district
          address
          city
          state
          zip
          phone
          type
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
export const onCreateCurriculum = /* GraphQL */ `
  subscription OnCreateCurriculum {
    onCreateCurriculum {
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
export const onUpdateCurriculum = /* GraphQL */ `
  subscription OnUpdateCurriculum {
    onUpdateCurriculum {
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
export const onDeleteCurriculum = /* GraphQL */ `
  subscription OnDeleteCurriculum {
    onDeleteCurriculum {
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
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse {
    onCreateCourse {
      id
      name
      courseType
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
        type
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
          type
          image
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
          district
          address
          city
          state
          zip
          phone
          type
          image
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
export const onUpdateCourse = /* GraphQL */ `
  subscription OnUpdateCourse {
    onUpdateCourse {
      id
      name
      courseType
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
        type
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
          type
          image
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
          district
          address
          city
          state
          zip
          phone
          type
          image
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
export const onDeleteCourse = /* GraphQL */ `
  subscription OnDeleteCourse {
    onDeleteCourse {
      id
      name
      courseType
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
        type
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
          type
          image
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
          district
          address
          city
          state
          zip
          phone
          type
          image
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
export const onCreateInstitution = /* GraphQL */ `
  subscription OnCreateInstitution {
    onCreateInstitution {
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
          type
          image
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
      image
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateInstitution = /* GraphQL */ `
  subscription OnUpdateInstitution {
    onUpdateInstitution {
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
          type
          image
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
      image
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteInstitution = /* GraphQL */ `
  subscription OnDeleteInstitution {
    onDeleteInstitution {
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
          type
          image
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
      image
      createdAt
      updatedAt
    }
  }
`;
export const onCreateSelStructure = /* GraphQL */ `
  subscription OnCreateSelStructure {
    onCreateSELStructure {
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
export const onUpdateSelStructure = /* GraphQL */ `
  subscription OnUpdateSelStructure {
    onUpdateSELStructure {
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
export const onDeleteSelStructure = /* GraphQL */ `
  subscription OnDeleteSelStructure {
    onDeleteSELStructure {
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
export const onCreateSelType = /* GraphQL */ `
  subscription OnCreateSelType {
    onCreateSELType {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateSelType = /* GraphQL */ `
  subscription OnUpdateSelType {
    onUpdateSELType {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteSelType = /* GraphQL */ `
  subscription OnDeleteSelType {
    onDeleteSELType {
      id
      structureID
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClassroomDataTest = /* GraphQL */ `
  subscription OnCreateClassroomDataTest {
    onCreateClassroomDataTest {
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
          type
          image
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
export const onUpdateClassroomDataTest = /* GraphQL */ `
  subscription OnUpdateClassroomDataTest {
    onUpdateClassroomDataTest {
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
          type
          image
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
export const onDeleteClassroomDataTest = /* GraphQL */ `
  subscription OnDeleteClassroomDataTest {
    onDeleteClassroomDataTest {
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
          type
          image
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
export const onCreateClassroomData = /* GraphQL */ `
  subscription OnCreateClassroomData {
    onCreateClassroomData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClassroomData = /* GraphQL */ `
  subscription OnUpdateClassroomData {
    onUpdateClassroomData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClassroomData = /* GraphQL */ `
  subscription OnDeleteClassroomData {
    onDeleteClassroomData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClassData = /* GraphQL */ `
  subscription OnCreateClassData {
    onCreateClassData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClassData = /* GraphQL */ `
  subscription OnUpdateClassData {
    onUpdateClassData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClassData = /* GraphQL */ `
  subscription OnDeleteClassData {
    onDeleteClassData {
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
          type
          image
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
      dataObjects {
        name
        data
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClass = /* GraphQL */ `
  subscription OnCreateClass {
    onCreateClass {
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
export const onUpdateClass = /* GraphQL */ `
  subscription OnUpdateClass {
    onUpdateClass {
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
export const onDeleteClass = /* GraphQL */ `
  subscription OnDeleteClass {
    onDeleteClass {
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
export const onCreateClassroom = /* GraphQL */ `
  subscription OnCreateClassroom {
    onCreateClassroom {
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
export const onUpdateClassroom = /* GraphQL */ `
  subscription OnUpdateClassroom {
    onUpdateClassroom {
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
export const onDeleteClassroom = /* GraphQL */ `
  subscription OnDeleteClassroom {
    onDeleteClassroom {
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
export const onCreateLesson = /* GraphQL */ `
  subscription OnCreateLesson {
    onCreateLesson {
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
export const onUpdateLesson = /* GraphQL */ `
  subscription OnUpdateLesson {
    onUpdateLesson {
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
export const onDeleteLesson = /* GraphQL */ `
  subscription OnDeleteLesson {
    onDeleteLesson {
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
export const onCreateWarmUp = /* GraphQL */ `
  subscription OnCreateWarmUp {
    onCreateWarmUp {
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
export const onUpdateWarmUp = /* GraphQL */ `
  subscription OnUpdateWarmUp {
    onUpdateWarmUp {
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
export const onDeleteWarmUp = /* GraphQL */ `
  subscription OnDeleteWarmUp {
    onDeleteWarmUp {
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
export const onCreateCoreLesson = /* GraphQL */ `
  subscription OnCreateCoreLesson {
    onCreateCoreLesson {
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
export const onUpdateCoreLesson = /* GraphQL */ `
  subscription OnUpdateCoreLesson {
    onUpdateCoreLesson {
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
export const onDeleteCoreLesson = /* GraphQL */ `
  subscription OnDeleteCoreLesson {
    onDeleteCoreLesson {
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
export const onCreateActivity = /* GraphQL */ `
  subscription OnCreateActivity {
    onCreateActivity {
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
export const onUpdateActivity = /* GraphQL */ `
  subscription OnUpdateActivity {
    onUpdateActivity {
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
export const onDeleteActivity = /* GraphQL */ `
  subscription OnDeleteActivity {
    onDeleteActivity {
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
