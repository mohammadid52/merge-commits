/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onChangePersonLocation = /* GraphQL */ `
  subscription OnChangePersonLocation($syllabusLessonID: ID!) {
    onChangePersonLocation(syllabusLessonID: $syllabusLessonID) {
      id
      personAuthID
      personEmail
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        feedback {
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
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onChangeStudentData = /* GraphQL */ `
  subscription OnChangeStudentData($syllabusLessonID: ID!) {
    onChangeStudentData(syllabusLessonID: $syllabusLessonID) {
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
export const onChangeSyllabusLesson = /* GraphQL */ `
  subscription OnChangeSyllabusLesson($id: ID!) {
    onChangeSyllabusLesson(id: $id) {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
      onBoardSurvey
      offBoardSurvey
      phone
      birthdate
      image
      language
      filters
      lastLoggedIn
      lastLoggedOut
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
      onBoardSurvey
      offBoardSurvey
      phone
      birthdate
      image
      language
      filters
      lastLoggedIn
      lastLoggedOut
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
      onBoardSurvey
      offBoardSurvey
      phone
      birthdate
      image
      language
      filters
      lastLoggedIn
      lastLoggedOut
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
          length
          repeat
          notes
          activeSyllabus
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
          length
          repeat
          notes
          activeSyllabus
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
          length
          repeat
          notes
          activeSyllabus
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
export const onCreateServiceProvider = /* GraphQL */ `
  subscription OnCreateServiceProvider {
    onCreateServiceProvider {
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
export const onUpdateServiceProvider = /* GraphQL */ `
  subscription OnUpdateServiceProvider {
    onUpdateServiceProvider {
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
export const onDeleteServiceProvider = /* GraphQL */ `
  subscription OnDeleteServiceProvider {
    onDeleteServiceProvider {
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
export const onCreateStaff = /* GraphQL */ `
  subscription OnCreateStaff {
    onCreateStaff {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
export const onUpdateStaff = /* GraphQL */ `
  subscription OnUpdateStaff {
    onUpdateStaff {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
export const onDeleteStaff = /* GraphQL */ `
  subscription OnDeleteStaff {
    onDeleteStaff {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
export const onCreateRoom = /* GraphQL */ `
  subscription OnCreateRoom {
    onCreateRoom {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
      location
      startDate
      startTime
      length
      repeat
      notes
      activeSyllabus
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRoom = /* GraphQL */ `
  subscription OnUpdateRoom {
    onUpdateRoom {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
      location
      startDate
      startTime
      length
      repeat
      notes
      activeSyllabus
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRoom = /* GraphQL */ `
  subscription OnDeleteRoom {
    onDeleteRoom {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
      location
      startDate
      startTime
      length
      repeat
      notes
      activeSyllabus
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClass = /* GraphQL */ `
  subscription OnCreateClass {
    onCreateClass {
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
          location
          startDate
          startTime
          length
          repeat
          notes
          activeSyllabus
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
export const onUpdateClass = /* GraphQL */ `
  subscription OnUpdateClass {
    onUpdateClass {
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
          location
          startDate
          startTime
          length
          repeat
          notes
          activeSyllabus
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
export const onDeleteClass = /* GraphQL */ `
  subscription OnDeleteClass {
    onDeleteClass {
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
          location
          startDate
          startTime
          length
          repeat
          notes
          activeSyllabus
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
export const onCreateClassStudent = /* GraphQL */ `
  subscription OnCreateClassStudent {
    onCreateClassStudent {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
export const onUpdateClassStudent = /* GraphQL */ `
  subscription OnUpdateClassStudent {
    onUpdateClassStudent {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
export const onDeleteClassStudent = /* GraphQL */ `
  subscription OnDeleteClassStudent {
    onDeleteClassStudent {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
export const onCreateCurriculum = /* GraphQL */ `
  subscription OnCreateCurriculum {
    onCreateCurriculum {
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCurriculum = /* GraphQL */ `
  subscription OnUpdateCurriculum {
    onUpdateCurriculum {
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCurriculum = /* GraphQL */ `
  subscription OnDeleteCurriculum {
    onDeleteCurriculum {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTopic = /* GraphQL */ `
  subscription OnCreateTopic {
    onCreateTopic {
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
        designers
        syllabi {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTopic = /* GraphQL */ `
  subscription OnUpdateTopic {
    onUpdateTopic {
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
        designers
        syllabi {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTopic = /* GraphQL */ `
  subscription OnDeleteTopic {
    onDeleteTopic {
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
        designers
        syllabi {
          nextToken
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCSequences = /* GraphQL */ `
  subscription OnCreateCSequences {
    onCreateCSequences {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCSequences = /* GraphQL */ `
  subscription OnUpdateCSequences {
    onUpdateCSequences {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCSequences = /* GraphQL */ `
  subscription OnDeleteCSequences {
    onDeleteCSequences {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLearningObjective = /* GraphQL */ `
  subscription OnCreateLearningObjective {
    onCreateLearningObjective {
      id
      name
      description
      curriculumID
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLearningObjective = /* GraphQL */ `
  subscription OnUpdateLearningObjective {
    onUpdateLearningObjective {
      id
      name
      description
      curriculumID
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLearningObjective = /* GraphQL */ `
  subscription OnDeleteLearningObjective {
    onDeleteLearningObjective {
      id
      name
      description
      curriculumID
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRubric = /* GraphQL */ `
  subscription OnCreateRubric {
    onCreateRubric {
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
export const onUpdateRubric = /* GraphQL */ `
  subscription OnUpdateRubric {
    onUpdateRubric {
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
export const onDeleteRubric = /* GraphQL */ `
  subscription OnDeleteRubric {
    onDeleteRubric {
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
export const onCreateTeacherCurriculum = /* GraphQL */ `
  subscription OnCreateTeacherCurriculum {
    onCreateTeacherCurriculum {
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
        designers
        syllabi {
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
export const onUpdateTeacherCurriculum = /* GraphQL */ `
  subscription OnUpdateTeacherCurriculum {
    onUpdateTeacherCurriculum {
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
        designers
        syllabi {
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
export const onDeleteTeacherCurriculum = /* GraphQL */ `
  subscription OnDeleteTeacherCurriculum {
    onDeleteTeacherCurriculum {
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
        designers
        syllabi {
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
export const onCreateRoomCurriculum = /* GraphQL */ `
  subscription OnCreateRoomCurriculum {
    onCreateRoomCurriculum {
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
        designers
        syllabi {
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
export const onUpdateRoomCurriculum = /* GraphQL */ `
  subscription OnUpdateRoomCurriculum {
    onUpdateRoomCurriculum {
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
        designers
        syllabi {
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
export const onDeleteRoomCurriculum = /* GraphQL */ `
  subscription OnDeleteRoomCurriculum {
    onDeleteRoomCurriculum {
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
        designers
        syllabi {
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
        createdAt
        updatedAt
      }
      question {
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
        createdAt
        updatedAt
      }
      question {
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
        createdAt
        updatedAt
      }
      question {
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
      questions {
        items {
          id
          assessmentID
          questionID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      questions {
        items {
          id
          assessmentID
          questionID
          createdAt
          updatedAt
        }
        nextToken
      }
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
      questions {
        items {
          id
          assessmentID
          questionID
          createdAt
          updatedAt
        }
        nextToken
      }
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
export const onCreateAssessmentQuestions = /* GraphQL */ `
  subscription OnCreateAssessmentQuestions {
    onCreateAssessmentQuestions {
      id
      assessmentID
      questionID
      assessment {
        id
        title
        type
        openingMessage
        closingMessage
        questions {
          nextToken
        }
        checkpoints {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAssessmentQuestions = /* GraphQL */ `
  subscription OnUpdateAssessmentQuestions {
    onUpdateAssessmentQuestions {
      id
      assessmentID
      questionID
      assessment {
        id
        title
        type
        openingMessage
        closingMessage
        questions {
          nextToken
        }
        checkpoints {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAssessmentQuestions = /* GraphQL */ `
  subscription OnDeleteAssessmentQuestions {
    onDeleteAssessmentQuestions {
      id
      assessmentID
      questionID
      assessment {
        id
        title
        type
        openingMessage
        closingMessage
        questions {
          nextToken
        }
        checkpoints {
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
        createdAt
        updatedAt
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
        questions {
          nextToken
        }
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
        questions {
          nextToken
        }
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
        questions {
          nextToken
        }
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateQuestionSource = /* GraphQL */ `
  subscription OnCreateQuestionSource {
    onCreateQuestionSource {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestionSource = /* GraphQL */ `
  subscription OnUpdateQuestionSource {
    onUpdateQuestionSource {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestionSource = /* GraphQL */ `
  subscription OnDeleteQuestionSource {
    onDeleteQuestionSource {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateQuestionType = /* GraphQL */ `
  subscription OnCreateQuestionType {
    onCreateQuestionType {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestionType = /* GraphQL */ `
  subscription OnUpdateQuestionType {
    onUpdateQuestionType {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestionType = /* GraphQL */ `
  subscription OnDeleteQuestionType {
    onDeleteQuestionType {
      id
      name
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
        onBoardSurvey
        offBoardSurvey
        phone
        birthdate
        image
        language
        filters
        lastLoggedIn
        lastLoggedOut
        classes {
          nextToken
        }
        wordbank {
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
export const onCreateFilterGroup = /* GraphQL */ `
  subscription OnCreateFilterGroup {
    onCreateFilterGroup {
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
export const onUpdateFilterGroup = /* GraphQL */ `
  subscription OnUpdateFilterGroup {
    onUpdateFilterGroup {
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
export const onDeleteFilterGroup = /* GraphQL */ `
  subscription OnDeleteFilterGroup {
    onDeleteFilterGroup {
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
export const onCreateFilterGroupFilter = /* GraphQL */ `
  subscription OnCreateFilterGroupFilter {
    onCreateFilterGroupFilter {
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
export const onUpdateFilterGroupFilter = /* GraphQL */ `
  subscription OnUpdateFilterGroupFilter {
    onUpdateFilterGroupFilter {
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
export const onDeleteFilterGroupFilter = /* GraphQL */ `
  subscription OnDeleteFilterGroupFilter {
    onDeleteFilterGroupFilter {
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
export const onCreateFilter = /* GraphQL */ `
  subscription OnCreateFilter {
    onCreateFilter {
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
export const onUpdateFilter = /* GraphQL */ `
  subscription OnUpdateFilter {
    onUpdateFilter {
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
export const onDeleteFilter = /* GraphQL */ `
  subscription OnDeleteFilter {
    onDeleteFilter {
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
export const onCreateFilterOption = /* GraphQL */ `
  subscription OnCreateFilterOption {
    onCreateFilterOption {
      id
      filterID
      text
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRoomMsgs = /* GraphQL */ `
  subscription OnCreateRoomMsgs {
    onCreateRoomMsgs {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onUpdateRoomMsgs = /* GraphQL */ `
  subscription OnUpdateRoomMsgs {
    onUpdateRoomMsgs {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onDeleteRoomMsgs = /* GraphQL */ `
  subscription OnDeleteRoomMsgs {
    onDeleteRoomMsgs {
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      startDate
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
      startDate
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
      startDate
      duration
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
      purpose
      designers
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
        questions {
          nextToken
        }
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      purpose
      designers
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
        questions {
          nextToken
        }
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      purpose
      designers
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
        questions {
          nextToken
        }
        checkpoints {
          nextToken
        }
        createdAt
        updatedAt
      }
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
      }
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
        createdAt
        updatedAt
      }
      checkpoint {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
        createdAt
        updatedAt
      }
      checkpoint {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
        createdAt
        updatedAt
      }
      checkpoint {
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
        createdAt
        updatedAt
      }
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
        createdAt
        updatedAt
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
export const onUpdateSyllabus = /* GraphQL */ `
  subscription OnUpdateSyllabus {
    onUpdateSyllabus {
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
export const onDeleteSyllabus = /* GraphQL */ `
  subscription OnDeleteSyllabus {
    onDeleteSyllabus {
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
export const onCreateSyllabusLesson = /* GraphQL */ `
  subscription OnCreateSyllabusLesson {
    onCreateSyllabusLesson {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
export const onUpdateSyllabusLesson = /* GraphQL */ `
  subscription OnUpdateSyllabusLesson {
    onUpdateSyllabusLesson {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
export const onDeleteSyllabusLesson = /* GraphQL */ `
  subscription OnDeleteSyllabusLesson {
    onDeleteSyllabusLesson {
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
        purpose
        designers
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
        coverImage
        summaryTitle
        introductionTitle
        introduction
        connectionTitle
        lessonPlan {
          type
          LessonComponentID
          sequence
        }
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
export const onCreateQuestionData = /* GraphQL */ `
  subscription OnCreateQuestionData {
    onCreateQuestionData {
      id
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
export const onUpdateQuestionData = /* GraphQL */ `
  subscription OnUpdateQuestionData {
    onUpdateQuestionData {
      id
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
export const onDeleteQuestionData = /* GraphQL */ `
  subscription OnDeleteQuestionData {
    onDeleteQuestionData {
      id
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        syllabusLessonID
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
        syllabusLessonID
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
        syllabusLessonID
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateFeedback = /* GraphQL */ `
  subscription OnCreateFeedback {
    onCreateFeedback {
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
export const onCreateIntro = /* GraphQL */ `
  subscription OnCreateIntro {
    onCreateIntro {
      id
      title
      label
      stage
      type
      connectionTitle
      connection
      keywordsTitle
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
      questionsTitle
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
      language
      estTime
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateIntro = /* GraphQL */ `
  subscription OnUpdateIntro {
    onUpdateIntro {
      id
      title
      label
      stage
      type
      connectionTitle
      connection
      keywordsTitle
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
      questionsTitle
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
      language
      estTime
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteIntro = /* GraphQL */ `
  subscription OnDeleteIntro {
    onDeleteIntro {
      id
      title
      label
      stage
      type
      connectionTitle
      connection
      keywordsTitle
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
      questionsTitle
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
      language
      estTime
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateOutro = /* GraphQL */ `
  subscription OnCreateOutro {
    onCreateOutro {
      id
      title
      subtitle
      stage
      type
      closingTitle
      closingText
      questionsTitle
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
      additionalInfo
      language
      estTime
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateOutro = /* GraphQL */ `
  subscription OnUpdateOutro {
    onUpdateOutro {
      id
      title
      subtitle
      stage
      type
      closingTitle
      closingText
      questionsTitle
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
      additionalInfo
      language
      estTime
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteOutro = /* GraphQL */ `
  subscription OnDeleteOutro {
    onDeleteOutro {
      id
      title
      subtitle
      stage
      type
      closingTitle
      closingText
      questionsTitle
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
      additionalInfo
      language
      estTime
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePersonLocation = /* GraphQL */ `
  subscription OnCreatePersonLocation {
    onCreatePersonLocation {
      id
      personAuthID
      personEmail
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        feedback {
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
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePersonLocation = /* GraphQL */ `
  subscription OnUpdatePersonLocation {
    onUpdatePersonLocation {
      id
      personAuthID
      personEmail
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        feedback {
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
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePersonLocation = /* GraphQL */ `
  subscription OnDeletePersonLocation {
    onDeletePersonLocation {
      id
      personAuthID
      personEmail
      syllabusLessonID
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
        classes {
          nextToken
        }
        wordbank {
          nextToken
        }
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
          assessmentID
          filters
          coverImage
          summaryTitle
          introductionTitle
          introduction
          connectionTitle
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
        feedback {
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
        location
        startDate
        startTime
        length
        repeat
        notes
        activeSyllabus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
