/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateClassroom = /* GraphQL */ `
  subscription OnUpdateClassroom($id: ID!) {
    onUpdateClassroom(id: $id) {
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
          createdAt
          updatedAt
        }
        classID
        class {
          id
          type
          name
          createdAt
          updatedAt
        }
        curriculumID
        curriculum {
          id
          name
          type
          description
          objectives
          languages
          createdAt
          updatedAt
        }
        classrooms {
          nextToken
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
export const onChangeStudentData = /* GraphQL */ `
  subscription OnChangeStudentData($classroomID: ID!) {
    onChangeStudentData(classroomID: $classroomID) {
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
        filters
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
export const onCreateInstitution = /* GraphQL */ `
  subscription OnCreateInstitution {
    onCreateInstitution {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateServiceProvider = /* GraphQL */ `
  subscription OnCreateServiceProvider {
    onCreateServiceProvider {
      id
      partnerID
      providerID
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
        serviceProviders {
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
export const onUpdateServiceProvider = /* GraphQL */ `
  subscription OnUpdateServiceProvider {
    onUpdateServiceProvider {
      id
      partnerID
      providerID
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
        serviceProviders {
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
export const onDeleteServiceProvider = /* GraphQL */ `
  subscription OnDeleteServiceProvider {
    onDeleteServiceProvider {
      id
      partnerID
      providerID
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
        serviceProviders {
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
export const onCreateStaff = /* GraphQL */ `
  subscription OnCreateStaff {
    onCreateStaff {
      id
      institutionID
      staffAuthID
      staffEmail
      status
      statusChangeDate
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStaff = /* GraphQL */ `
  subscription OnUpdateStaff {
    onUpdateStaff {
      id
      institutionID
      staffAuthID
      staffEmail
      status
      statusChangeDate
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStaff = /* GraphQL */ `
  subscription OnDeleteStaff {
    onDeleteStaff {
      id
      institutionID
      staffAuthID
      staffEmail
      status
      statusChangeDate
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePerson = /* GraphQL */ `
  subscription OnCreatePerson {
    onCreatePerson {
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
      filters
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
      filters
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
      filters
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
      type
      description
      objectives
      languages
      units {
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
      type
      description
      objectives
      languages
      units {
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
      type
      description
      objectives
      languages
      units {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUnit = /* GraphQL */ `
  subscription OnCreateUnit {
    onCreateUnit {
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
          unitID
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
export const onUpdateUnit = /* GraphQL */ `
  subscription OnUpdateUnit {
    onUpdateUnit {
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
          unitID
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
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit {
    onDeleteUnit {
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
          unitID
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
export const onCreateSyllabus = /* GraphQL */ `
  subscription OnCreateSyllabus {
    onCreateSyllabus {
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
export const onUpdateSyllabus = /* GraphQL */ `
  subscription OnUpdateSyllabus {
    onUpdateSyllabus {
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
export const onDeleteSyllabus = /* GraphQL */ `
  subscription OnDeleteSyllabus {
    onDeleteSyllabus {
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
export const onCreateSyllabusLesson = /* GraphQL */ `
  subscription OnCreateSyllabusLesson {
    onCreateSyllabusLesson {
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
export const onUpdateSyllabusLesson = /* GraphQL */ `
  subscription OnUpdateSyllabusLesson {
    onUpdateSyllabusLesson {
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
export const onDeleteSyllabusLesson = /* GraphQL */ `
  subscription OnDeleteSyllabusLesson {
    onDeleteSyllabusLesson {
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
export const onCreateLessonUnit = /* GraphQL */ `
  subscription OnCreateLessonUnit {
    onCreateLessonUnit {
      id
      unitID
      lessonID
      unit {
        id
        name
        type
        description
        objectives
        curriculumID
        languages
        lessons {
          nextToken
        }
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
export const onUpdateLessonUnit = /* GraphQL */ `
  subscription OnUpdateLessonUnit {
    onUpdateLessonUnit {
      id
      unitID
      lessonID
      unit {
        id
        name
        type
        description
        objectives
        curriculumID
        languages
        lessons {
          nextToken
        }
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
export const onDeleteLessonUnit = /* GraphQL */ `
  subscription OnDeleteLessonUnit {
    onDeleteLessonUnit {
      id
      unitID
      lessonID
      unit {
        id
        name
        type
        description
        objectives
        curriculumID
        languages
        lessons {
          nextToken
        }
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
export const onCreateCourse = /* GraphQL */ `
  subscription OnCreateCourse {
    onCreateCourse {
      id
      name
      type
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
        serviceProviders {
          nextToken
        }
        createdAt
        updatedAt
      }
      classID
      class {
        id
        type
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
        type
        description
        objectives
        languages
        units {
          nextToken
        }
        syllabi {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      type
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
        serviceProviders {
          nextToken
        }
        createdAt
        updatedAt
      }
      classID
      class {
        id
        type
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
        type
        description
        objectives
        languages
        units {
          nextToken
        }
        syllabi {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      type
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
        serviceProviders {
          nextToken
        }
        createdAt
        updatedAt
      }
      classID
      class {
        id
        type
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
        type
        description
        objectives
        languages
        units {
          nextToken
        }
        syllabi {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      location
      startDate
      endDate
      duration
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClass = /* GraphQL */ `
  subscription OnCreateClass {
    onCreateClass {
      id
      type
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
export const onUpdateClass = /* GraphQL */ `
  subscription OnUpdateClass {
    onUpdateClass {
      id
      type
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
export const onDeleteClass = /* GraphQL */ `
  subscription OnDeleteClass {
    onDeleteClass {
      id
      type
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
export const onCreateClassStudent = /* GraphQL */ `
  subscription OnCreateClassStudent {
    onCreateClassStudent {
      id
      classID
      studentID
      studentEmail
      studentAuth
      class {
        id
        type
        name
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateClassStudent = /* GraphQL */ `
  subscription OnUpdateClassStudent {
    onUpdateClassStudent {
      id
      classID
      studentID
      studentEmail
      studentAuth
      class {
        id
        type
        name
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteClassStudent = /* GraphQL */ `
  subscription OnDeleteClassStudent {
    onDeleteClassStudent {
      id
      classID
      studentID
      studentEmail
      studentAuth
      class {
        id
        type
        name
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateArtist = /* GraphQL */ `
  subscription OnCreateArtist {
    onCreateArtist {
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
export const onUpdateArtist = /* GraphQL */ `
  subscription OnUpdateArtist {
    onUpdateArtist {
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
export const onDeleteArtist = /* GraphQL */ `
  subscription OnDeleteArtist {
    onDeleteArtist {
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
export const onCreateFeedback = /* GraphQL */ `
  subscription OnCreateFeedback {
    onCreateFeedback {
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
export const onUpdateFeedback = /* GraphQL */ `
  subscription OnUpdateFeedback {
    onUpdateFeedback {
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
export const onDeleteFeedback = /* GraphQL */ `
  subscription OnDeleteFeedback {
    onDeleteFeedback {
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
export const onCreateSelStructure = /* GraphQL */ `
  subscription OnCreateSelStructure {
    onCreateSELStructure {
      id
      name
      description
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateThemeTemplate = /* GraphQL */ `
  subscription OnCreateThemeTemplate {
    onCreateThemeTemplate {
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
export const onUpdateThemeTemplate = /* GraphQL */ `
  subscription OnUpdateThemeTemplate {
    onUpdateThemeTemplate {
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
export const onDeleteThemeTemplate = /* GraphQL */ `
  subscription OnDeleteThemeTemplate {
    onDeleteThemeTemplate {
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
export const onCreateLesson = /* GraphQL */ `
  subscription OnCreateLesson {
    onCreateLesson {
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
export const onUpdateLesson = /* GraphQL */ `
  subscription OnUpdateLesson {
    onUpdateLesson {
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
export const onDeleteLesson = /* GraphQL */ `
  subscription OnDeleteLesson {
    onDeleteLesson {
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
export const onCreateLessonCheckpoint = /* GraphQL */ `
  subscription OnCreateLessonCheckpoint {
    onCreateLessonCheckpoint {
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
export const onUpdateLessonCheckpoint = /* GraphQL */ `
  subscription OnUpdateLessonCheckpoint {
    onUpdateLessonCheckpoint {
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
export const onDeleteLessonCheckpoint = /* GraphQL */ `
  subscription OnDeleteLessonCheckpoint {
    onDeleteLessonCheckpoint {
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
export const onCreateDoFirst = /* GraphQL */ `
  subscription OnCreateDoFirst {
    onCreateDoFirst {
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
export const onUpdateDoFirst = /* GraphQL */ `
  subscription OnUpdateDoFirst {
    onUpdateDoFirst {
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
export const onDeleteDoFirst = /* GraphQL */ `
  subscription OnDeleteDoFirst {
    onDeleteDoFirst {
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
export const onCreateDoFirstQuestion = /* GraphQL */ `
  subscription OnCreateDoFirstQuestion {
    onCreateDoFirstQuestion {
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
export const onUpdateDoFirstQuestion = /* GraphQL */ `
  subscription OnUpdateDoFirstQuestion {
    onUpdateDoFirstQuestion {
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
export const onDeleteDoFirstQuestion = /* GraphQL */ `
  subscription OnDeleteDoFirstQuestion {
    onDeleteDoFirstQuestion {
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
export const onCreateCheckpoint = /* GraphQL */ `
  subscription OnCreateCheckpoint {
    onCreateCheckpoint {
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
export const onUpdateCheckpoint = /* GraphQL */ `
  subscription OnUpdateCheckpoint {
    onUpdateCheckpoint {
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
export const onDeleteCheckpoint = /* GraphQL */ `
  subscription OnDeleteCheckpoint {
    onDeleteCheckpoint {
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
export const onCreateCheckpointQuestions = /* GraphQL */ `
  subscription OnCreateCheckpointQuestions {
    onCreateCheckpointQuestions {
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
export const onUpdateCheckpointQuestions = /* GraphQL */ `
  subscription OnUpdateCheckpointQuestions {
    onUpdateCheckpointQuestions {
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
export const onDeleteCheckpointQuestions = /* GraphQL */ `
  subscription OnDeleteCheckpointQuestions {
    onDeleteCheckpointQuestions {
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
export const onCreateAssessment = /* GraphQL */ `
  subscription OnCreateAssessment {
    onCreateAssessment {
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
export const onUpdateAssessment = /* GraphQL */ `
  subscription OnUpdateAssessment {
    onUpdateAssessment {
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
export const onDeleteAssessment = /* GraphQL */ `
  subscription OnDeleteAssessment {
    onDeleteAssessment {
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
export const onCreateAssessmentCheckpoint = /* GraphQL */ `
  subscription OnCreateAssessmentCheckpoint {
    onCreateAssessmentCheckpoint {
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
export const onUpdateAssessmentCheckpoint = /* GraphQL */ `
  subscription OnUpdateAssessmentCheckpoint {
    onUpdateAssessmentCheckpoint {
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
export const onDeleteAssessmentCheckpoint = /* GraphQL */ `
  subscription OnDeleteAssessmentCheckpoint {
    onDeleteAssessmentCheckpoint {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion {
    onCreateQuestion {
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
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion {
    onUpdateQuestion {
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
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion {
    onDeleteQuestion {
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
export const onCreateQuestionData = /* GraphQL */ `
  subscription OnCreateQuestionData {
    onCreateQuestionData {
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
        filters
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestionData = /* GraphQL */ `
  subscription OnUpdateQuestionData {
    onUpdateQuestionData {
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
        filters
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestionData = /* GraphQL */ `
  subscription OnDeleteQuestionData {
    onDeleteQuestionData {
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
        filters
        createdAt
        updatedAt
      }
      response
      createdAt
      updatedAt
    }
  }
`;
export const onCreateQuestionDataStudentData = /* GraphQL */ `
  subscription OnCreateQuestionDataStudentData {
    onCreateQuestionDataStudentData {
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
export const onUpdateQuestionDataStudentData = /* GraphQL */ `
  subscription OnUpdateQuestionDataStudentData {
    onUpdateQuestionDataStudentData {
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
export const onDeleteQuestionDataStudentData = /* GraphQL */ `
  subscription OnDeleteQuestionDataStudentData {
    onDeleteQuestionDataStudentData {
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
export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord {
    onCreateWord {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWord = /* GraphQL */ `
  subscription OnUpdateWord {
    onUpdateWord {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWord = /* GraphQL */ `
  subscription OnDeleteWord {
    onDeleteWord {
      id
      word
      definition
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLessonKeyWord = /* GraphQL */ `
  subscription OnCreateLessonKeyWord {
    onCreateLessonKeyWord {
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
export const onUpdateLessonKeyWord = /* GraphQL */ `
  subscription OnUpdateLessonKeyWord {
    onUpdateLessonKeyWord {
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
export const onDeleteLessonKeyWord = /* GraphQL */ `
  subscription OnDeleteLessonKeyWord {
    onDeleteLessonKeyWord {
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
export const onCreateStudentWord = /* GraphQL */ `
  subscription OnCreateStudentWord {
    onCreateStudentWord {
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateStudentWord = /* GraphQL */ `
  subscription OnUpdateStudentWord {
    onUpdateStudentWord {
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteStudentWord = /* GraphQL */ `
  subscription OnDeleteStudentWord {
    onDeleteStudentWord {
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
        filters
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateFilter = /* GraphQL */ `
  subscription OnCreateFilter {
    onCreateFilter {
      id
      name
      description
      editable
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
export const onUpdateFilter = /* GraphQL */ `
  subscription OnUpdateFilter {
    onUpdateFilter {
      id
      name
      description
      editable
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
export const onDeleteFilter = /* GraphQL */ `
  subscription OnDeleteFilter {
    onDeleteFilter {
      id
      name
      description
      editable
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
export const onCreateFilterOption = /* GraphQL */ `
  subscription OnCreateFilterOption {
    onCreateFilterOption {
      id
      filterID
      text
      filter {
        id
        name
        description
        editable
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
export const onUpdateFilterOption = /* GraphQL */ `
  subscription OnUpdateFilterOption {
    onUpdateFilterOption {
      id
      filterID
      text
      filter {
        id
        name
        description
        editable
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
export const onDeleteFilterOption = /* GraphQL */ `
  subscription OnDeleteFilterOption {
    onDeleteFilterOption {
      id
      filterID
      text
      filter {
        id
        name
        description
        editable
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
export const onCreateClient = /* GraphQL */ `
  subscription OnCreateClient {
    onCreateClient {
      id
      name
      architecture {
        items {
          id
          name
          clientID
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
export const onUpdateClient = /* GraphQL */ `
  subscription OnUpdateClient {
    onUpdateClient {
      id
      name
      architecture {
        items {
          id
          name
          clientID
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
export const onDeleteClient = /* GraphQL */ `
  subscription OnDeleteClient {
    onDeleteClient {
      id
      name
      architecture {
        items {
          id
          name
          clientID
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
export const onCreateArchitecture = /* GraphQL */ `
  subscription OnCreateArchitecture {
    onCreateArchitecture {
      id
      name
      clientID
      client {
        id
        name
        architecture {
          nextToken
        }
        createdAt
        updatedAt
      }
      types {
        items {
          id
          name
          architectureID
          createdAt
          updatedAt
        }
        nextToken
      }
      filters {
        items {
          id
          architectureID
          filterID
          multiselect
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
export const onUpdateArchitecture = /* GraphQL */ `
  subscription OnUpdateArchitecture {
    onUpdateArchitecture {
      id
      name
      clientID
      client {
        id
        name
        architecture {
          nextToken
        }
        createdAt
        updatedAt
      }
      types {
        items {
          id
          name
          architectureID
          createdAt
          updatedAt
        }
        nextToken
      }
      filters {
        items {
          id
          architectureID
          filterID
          multiselect
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
export const onDeleteArchitecture = /* GraphQL */ `
  subscription OnDeleteArchitecture {
    onDeleteArchitecture {
      id
      name
      clientID
      client {
        id
        name
        architecture {
          nextToken
        }
        createdAt
        updatedAt
      }
      types {
        items {
          id
          name
          architectureID
          createdAt
          updatedAt
        }
        nextToken
      }
      filters {
        items {
          id
          architectureID
          filterID
          multiselect
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
export const onCreateType = /* GraphQL */ `
  subscription OnCreateType {
    onCreateType {
      id
      name
      architectureID
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filters {
        items {
          id
          typeID
          filterID
          multiselect
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
export const onUpdateType = /* GraphQL */ `
  subscription OnUpdateType {
    onUpdateType {
      id
      name
      architectureID
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filters {
        items {
          id
          typeID
          filterID
          multiselect
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
export const onDeleteType = /* GraphQL */ `
  subscription OnDeleteType {
    onDeleteType {
      id
      name
      architectureID
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filters {
        items {
          id
          typeID
          filterID
          multiselect
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
export const onCreateFilterType = /* GraphQL */ `
  subscription OnCreateFilterType {
    onCreateFilterType {
      id
      typeID
      filterID
      multiselect
      required
      type {
        id
        name
        architectureID
        architecture {
          id
          name
          clientID
          createdAt
          updatedAt
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
export const onUpdateFilterType = /* GraphQL */ `
  subscription OnUpdateFilterType {
    onUpdateFilterType {
      id
      typeID
      filterID
      multiselect
      required
      type {
        id
        name
        architectureID
        architecture {
          id
          name
          clientID
          createdAt
          updatedAt
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
export const onDeleteFilterType = /* GraphQL */ `
  subscription OnDeleteFilterType {
    onDeleteFilterType {
      id
      typeID
      filterID
      multiselect
      required
      type {
        id
        name
        architectureID
        architecture {
          id
          name
          clientID
          createdAt
          updatedAt
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
export const onCreateArchitectureFilter = /* GraphQL */ `
  subscription OnCreateArchitectureFilter {
    onCreateArchitectureFilter {
      id
      architectureID
      filterID
      multiselect
      required
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
export const onUpdateArchitectureFilter = /* GraphQL */ `
  subscription OnUpdateArchitectureFilter {
    onUpdateArchitectureFilter {
      id
      architectureID
      filterID
      multiselect
      required
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
export const onDeleteArchitectureFilter = /* GraphQL */ `
  subscription OnDeleteArchitectureFilter {
    onDeleteArchitectureFilter {
      id
      architectureID
      filterID
      multiselect
      required
      architecture {
        id
        name
        clientID
        client {
          id
          name
          createdAt
          updatedAt
        }
        types {
          nextToken
        }
        filters {
          nextToken
        }
        createdAt
        updatedAt
      }
      filter {
        id
        name
        description
        editable
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
