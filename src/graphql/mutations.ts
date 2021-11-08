/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchAddClassStudent = /* GraphQL */ `
  mutation BatchAddClassStudent($classStudents: [CreateClassStudentInput]) {
    batchAddClassStudent(classStudents: $classStudents) {
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
export const batchAddLessonRubrics = /* GraphQL */ `
  mutation BatchAddLessonRubrics($lessonRubrics: [CreateLessonRubricsInput]) {
    batchAddLessonRubrics(lessonRubrics: $lessonRubrics) {
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
export const batchDeleteLessonRubrics = /* GraphQL */ `
  mutation BatchDeleteLessonRubrics(
    $lessonRubrics: [DeleteLessonRubricsInput]
  ) {
    batchDeleteLessonRubrics(lessonRubrics: $lessonRubrics) {
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
export const createClassroomGroupStudents = /* GraphQL */ `
  mutation CreateClassroomGroupStudents(
    $input: CreateClassroomGroupStudentsInput!
    $condition: ModelClassroomGroupStudentsConditionInput
  ) {
    createClassroomGroupStudents(input: $input, condition: $condition) {
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
export const updateClassroomGroupStudents = /* GraphQL */ `
  mutation UpdateClassroomGroupStudents(
    $input: UpdateClassroomGroupStudentsInput!
    $condition: ModelClassroomGroupStudentsConditionInput
  ) {
    updateClassroomGroupStudents(input: $input, condition: $condition) {
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
export const deleteClassroomGroupStudents = /* GraphQL */ `
  mutation DeleteClassroomGroupStudents(
    $input: DeleteClassroomGroupStudentsInput!
    $condition: ModelClassroomGroupStudentsConditionInput
  ) {
    deleteClassroomGroupStudents(input: $input, condition: $condition) {
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
export const createClassroomGroups = /* GraphQL */ `
  mutation CreateClassroomGroups(
    $input: CreateClassroomGroupsInput!
    $condition: ModelClassroomGroupsConditionInput
  ) {
    createClassroomGroups(input: $input, condition: $condition) {
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
export const updateClassroomGroups = /* GraphQL */ `
  mutation UpdateClassroomGroups(
    $input: UpdateClassroomGroupsInput!
    $condition: ModelClassroomGroupsConditionInput
  ) {
    updateClassroomGroups(input: $input, condition: $condition) {
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
export const deleteClassroomGroups = /* GraphQL */ `
  mutation DeleteClassroomGroups(
    $input: DeleteClassroomGroupsInput!
    $condition: ModelClassroomGroupsConditionInput
  ) {
    deleteClassroomGroups(input: $input, condition: $condition) {
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
export const createRoomCoTeachers = /* GraphQL */ `
  mutation CreateRoomCoTeachers(
    $input: CreateRoomCoTeachersInput!
    $condition: ModelRoomCoTeachersConditionInput
  ) {
    createRoomCoTeachers(input: $input, condition: $condition) {
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
export const updateRoomCoTeachers = /* GraphQL */ `
  mutation UpdateRoomCoTeachers(
    $input: UpdateRoomCoTeachersInput!
    $condition: ModelRoomCoTeachersConditionInput
  ) {
    updateRoomCoTeachers(input: $input, condition: $condition) {
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
export const deleteRoomCoTeachers = /* GraphQL */ `
  mutation DeleteRoomCoTeachers(
    $input: DeleteRoomCoTeachersInput!
    $condition: ModelRoomCoTeachersConditionInput
  ) {
    deleteRoomCoTeachers(input: $input, condition: $condition) {
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
export const createTopic = /* GraphQL */ `
  mutation CreateTopic(
    $input: CreateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    createTopic(input: $input, condition: $condition) {
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
export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic(
    $input: UpdateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    updateTopic(input: $input, condition: $condition) {
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
export const deleteTopic = /* GraphQL */ `
  mutation DeleteTopic(
    $input: DeleteTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    deleteTopic(input: $input, condition: $condition) {
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
export const createCSequences = /* GraphQL */ `
  mutation CreateCSequences(
    $input: CreateCSequencesInput!
    $condition: ModelCSequencesConditionInput
  ) {
    createCSequences(input: $input, condition: $condition) {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const updateCSequences = /* GraphQL */ `
  mutation UpdateCSequences(
    $input: UpdateCSequencesInput!
    $condition: ModelCSequencesConditionInput
  ) {
    updateCSequences(input: $input, condition: $condition) {
      id
      sequence
      createdAt
      updatedAt
    }
  }
`;
export const deleteCSequences = /* GraphQL */ `
  mutation DeleteCSequences(
    $input: DeleteCSequencesInput!
    $condition: ModelCSequencesConditionInput
  ) {
    deleteCSequences(input: $input, condition: $condition) {
      id
      sequence
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
      curriculumID
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
      curriculumID
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
      curriculumID
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
export const updateRubric = /* GraphQL */ `
  mutation UpdateRubric(
    $input: UpdateRubricInput!
    $condition: ModelRubricConditionInput
  ) {
    updateRubric(input: $input, condition: $condition) {
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
export const deleteRubric = /* GraphQL */ `
  mutation DeleteRubric(
    $input: DeleteRubricInput!
    $condition: ModelRubricConditionInput
  ) {
    deleteRubric(input: $input, condition: $condition) {
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
export const createCommonCheckpoint = /* GraphQL */ `
  mutation CreateCommonCheckpoint(
    $input: CreateCommonCheckpointInput!
    $condition: ModelcommonCheckpointConditionInput
  ) {
    createCommonCheckpoint(input: $input, condition: $condition) {
      id
      type
      typeID
      checkpointID
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
        scope
        questionSeq
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateCommonCheckpoint = /* GraphQL */ `
  mutation UpdateCommonCheckpoint(
    $input: UpdateCommonCheckpointInput!
    $condition: ModelcommonCheckpointConditionInput
  ) {
    updateCommonCheckpoint(input: $input, condition: $condition) {
      id
      type
      typeID
      checkpointID
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
        scope
        questionSeq
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteCommonCheckpoint = /* GraphQL */ `
  mutation DeleteCommonCheckpoint(
    $input: DeleteCommonCheckpointInput!
    $condition: ModelcommonCheckpointConditionInput
  ) {
    deleteCommonCheckpoint(input: $input, condition: $condition) {
      id
      type
      typeID
      checkpointID
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
        scope
        questionSeq
        createdAt
        updatedAt
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
        published
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
        published
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
        published
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
export const createQuestionSource = /* GraphQL */ `
  mutation CreateQuestionSource(
    $input: CreateQuestionSourceInput!
    $condition: ModelQuestionSourceConditionInput
  ) {
    createQuestionSource(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionSource = /* GraphQL */ `
  mutation UpdateQuestionSource(
    $input: UpdateQuestionSourceInput!
    $condition: ModelQuestionSourceConditionInput
  ) {
    updateQuestionSource(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionSource = /* GraphQL */ `
  mutation DeleteQuestionSource(
    $input: DeleteQuestionSourceInput!
    $condition: ModelQuestionSourceConditionInput
  ) {
    deleteQuestionSource(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createQuestionType = /* GraphQL */ `
  mutation CreateQuestionType(
    $input: CreateQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    createQuestionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestionType = /* GraphQL */ `
  mutation UpdateQuestionType(
    $input: UpdateQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    updateQuestionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestionType = /* GraphQL */ `
  mutation DeleteQuestionType(
    $input: DeleteQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    deleteQuestionType(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const createRoomMsgs = /* GraphQL */ `
  mutation CreateRoomMsgs(
    $input: CreateRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    createRoomMsgs(input: $input, condition: $condition) {
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
export const updateRoomMsgs = /* GraphQL */ `
  mutation UpdateRoomMsgs(
    $input: UpdateRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    updateRoomMsgs(input: $input, condition: $condition) {
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
export const deleteRoomMsgs = /* GraphQL */ `
  mutation DeleteRoomMsgs(
    $input: DeleteRoomMsgsInput!
    $condition: ModelRoomMsgsConditionInput
  ) {
    deleteRoomMsgs(input: $input, condition: $condition) {
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
export const createLesson = /* GraphQL */ `
  mutation CreateLesson(
    $input: CreateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    createLesson(input: $input, condition: $condition) {
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
export const updateLesson = /* GraphQL */ `
  mutation UpdateLesson(
    $input: UpdateLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    updateLesson(input: $input, condition: $condition) {
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
export const deleteLesson = /* GraphQL */ `
  mutation DeleteLesson(
    $input: DeleteLessonInput!
    $condition: ModelLessonConditionInput
  ) {
    deleteLesson(input: $input, condition: $condition) {
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
export const createLessonRubrics = /* GraphQL */ `
  mutation CreateLessonRubrics(
    $input: CreateLessonRubricsInput!
    $condition: ModelLessonRubricsConditionInput
  ) {
    createLessonRubrics(input: $input, condition: $condition) {
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
export const updateLessonRubrics = /* GraphQL */ `
  mutation UpdateLessonRubrics(
    $input: UpdateLessonRubricsInput!
    $condition: ModelLessonRubricsConditionInput
  ) {
    updateLessonRubrics(input: $input, condition: $condition) {
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
export const deleteLessonRubrics = /* GraphQL */ `
  mutation DeleteLessonRubrics(
    $input: DeleteLessonRubricsInput!
    $condition: ModelLessonRubricsConditionInput
  ) {
    deleteLessonRubrics(input: $input, condition: $condition) {
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
export const createAnthologyComment = /* GraphQL */ `
  mutation CreateAnthologyComment(
    $input: CreateAnthologyCommentInput!
    $condition: ModelAnthologyCommentConditionInput
  ) {
    createAnthologyComment(input: $input, condition: $condition) {
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
export const updateAnthologyComment = /* GraphQL */ `
  mutation UpdateAnthologyComment(
    $input: UpdateAnthologyCommentInput!
    $condition: ModelAnthologyCommentConditionInput
  ) {
    updateAnthologyComment(input: $input, condition: $condition) {
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
export const deleteAnthologyComment = /* GraphQL */ `
  mutation DeleteAnthologyComment(
    $input: DeleteAnthologyCommentInput!
    $condition: ModelAnthologyCommentConditionInput
  ) {
    deleteAnthologyComment(input: $input, condition: $condition) {
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
export const createQuestionData = /* GraphQL */ `
  mutation CreateQuestionData(
    $input: CreateQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    createQuestionData(input: $input, condition: $condition) {
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
export const updateQuestionData = /* GraphQL */ `
  mutation UpdateQuestionData(
    $input: UpdateQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    updateQuestionData(input: $input, condition: $condition) {
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
export const deleteQuestionData = /* GraphQL */ `
  mutation DeleteQuestionData(
    $input: DeleteQuestionDataInput!
    $condition: ModelQuestionDataConditionInput
  ) {
    deleteQuestionData(input: $input, condition: $condition) {
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
      questionDataID
      questionData {
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
      questionDataID
      questionData {
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
      questionDataID
      questionData {
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
      createdAt
      updatedAt
    }
  }
`;
export const createPersonLocation = /* GraphQL */ `
  mutation CreatePersonLocation(
    $input: CreatePersonLocationInput!
    $condition: ModelPersonLocationConditionInput
  ) {
    createPersonLocation(input: $input, condition: $condition) {
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
export const updatePersonLocation = /* GraphQL */ `
  mutation UpdatePersonLocation(
    $input: UpdatePersonLocationInput!
    $condition: ModelPersonLocationConditionInput
  ) {
    updatePersonLocation(input: $input, condition: $condition) {
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
export const deletePersonLocation = /* GraphQL */ `
  mutation DeletePersonLocation(
    $input: DeletePersonLocationInput!
    $condition: ModelPersonLocationConditionInput
  ) {
    deletePersonLocation(input: $input, condition: $condition) {
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
export const createNoticeboardWidget = /* GraphQL */ `
  mutation CreateNoticeboardWidget(
    $input: CreateNoticeboardWidgetInput!
    $condition: ModelNoticeboardWidgetConditionInput
  ) {
    createNoticeboardWidget(input: $input, condition: $condition) {
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
export const updateNoticeboardWidget = /* GraphQL */ `
  mutation UpdateNoticeboardWidget(
    $input: UpdateNoticeboardWidgetInput!
    $condition: ModelNoticeboardWidgetConditionInput
  ) {
    updateNoticeboardWidget(input: $input, condition: $condition) {
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
export const deleteNoticeboardWidget = /* GraphQL */ `
  mutation DeleteNoticeboardWidget(
    $input: DeleteNoticeboardWidgetInput!
    $condition: ModelNoticeboardWidgetConditionInput
  ) {
    deleteNoticeboardWidget(input: $input, condition: $condition) {
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
export const createAttendance = /* GraphQL */ `
  mutation CreateAttendance(
    $input: CreateAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    createAttendance(input: $input, condition: $condition) {
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
export const updateAttendance = /* GraphQL */ `
  mutation UpdateAttendance(
    $input: UpdateAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    updateAttendance(input: $input, condition: $condition) {
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
export const deleteAttendance = /* GraphQL */ `
  mutation DeleteAttendance(
    $input: DeleteAttendanceInput!
    $condition: ModelAttendanceConditionInput
  ) {
    deleteAttendance(input: $input, condition: $condition) {
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
export const createPlanner = /* GraphQL */ `
  mutation CreatePlanner(
    $input: CreatePlannerInput!
    $condition: ModelPlannerConditionInput
  ) {
    createPlanner(input: $input, condition: $condition) {
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
export const updatePlanner = /* GraphQL */ `
  mutation UpdatePlanner(
    $input: UpdatePlannerInput!
    $condition: ModelPlannerConditionInput
  ) {
    updatePlanner(input: $input, condition: $condition) {
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
export const deletePlanner = /* GraphQL */ `
  mutation DeletePlanner(
    $input: DeletePlannerInput!
    $condition: ModelPlannerConditionInput
  ) {
    deletePlanner(input: $input, condition: $condition) {
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
export const createUniversalLesson = /* GraphQL */ `
  mutation CreateUniversalLesson(
    $input: CreateUniversalLessonInput!
    $condition: ModelUniversalLessonConditionInput
  ) {
    createUniversalLesson(input: $input, condition: $condition) {
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
export const updateUniversalLesson = /* GraphQL */ `
  mutation UpdateUniversalLesson(
    $input: UpdateUniversalLessonInput!
    $condition: ModelUniversalLessonConditionInput
  ) {
    updateUniversalLesson(input: $input, condition: $condition) {
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
export const deleteUniversalLesson = /* GraphQL */ `
  mutation DeleteUniversalLesson(
    $input: DeleteUniversalLessonInput!
    $condition: ModelUniversalLessonConditionInput
  ) {
    deleteUniversalLesson(input: $input, condition: $condition) {
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
export const createUniversalLessonStudentData = /* GraphQL */ `
  mutation CreateUniversalLessonStudentData(
    $input: CreateUniversalLessonStudentDataInput!
    $condition: ModelUniversalLessonStudentDataConditionInput
  ) {
    createUniversalLessonStudentData(input: $input, condition: $condition) {
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
export const updateUniversalLessonStudentData = /* GraphQL */ `
  mutation UpdateUniversalLessonStudentData(
    $input: UpdateUniversalLessonStudentDataInput!
    $condition: ModelUniversalLessonStudentDataConditionInput
  ) {
    updateUniversalLessonStudentData(input: $input, condition: $condition) {
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
export const deleteUniversalLessonStudentData = /* GraphQL */ `
  mutation DeleteUniversalLessonStudentData(
    $input: DeleteUniversalLessonStudentDataInput!
    $condition: ModelUniversalLessonStudentDataConditionInput
  ) {
    deleteUniversalLessonStudentData(input: $input, condition: $condition) {
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
export const createUniversalArchiveData = /* GraphQL */ `
  mutation CreateUniversalArchiveData(
    $input: CreateUniversalArchiveDataInput!
    $condition: ModelUniversalArchiveDataConditionInput
  ) {
    createUniversalArchiveData(input: $input, condition: $condition) {
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
export const updateUniversalArchiveData = /* GraphQL */ `
  mutation UpdateUniversalArchiveData(
    $input: UpdateUniversalArchiveDataInput!
    $condition: ModelUniversalArchiveDataConditionInput
  ) {
    updateUniversalArchiveData(input: $input, condition: $condition) {
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
export const deleteUniversalArchiveData = /* GraphQL */ `
  mutation DeleteUniversalArchiveData(
    $input: DeleteUniversalArchiveDataInput!
    $condition: ModelUniversalArchiveDataConditionInput
  ) {
    deleteUniversalArchiveData(input: $input, condition: $condition) {
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
export const createUniversalSurveyStudentData = /* GraphQL */ `
  mutation CreateUniversalSurveyStudentData(
    $input: CreateUniversalSurveyStudentDataInput!
    $condition: ModelUniversalSurveyStudentDataConditionInput
  ) {
    createUniversalSurveyStudentData(input: $input, condition: $condition) {
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
export const updateUniversalSurveyStudentData = /* GraphQL */ `
  mutation UpdateUniversalSurveyStudentData(
    $input: UpdateUniversalSurveyStudentDataInput!
    $condition: ModelUniversalSurveyStudentDataConditionInput
  ) {
    updateUniversalSurveyStudentData(input: $input, condition: $condition) {
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
export const deleteUniversalSurveyStudentData = /* GraphQL */ `
  mutation DeleteUniversalSurveyStudentData(
    $input: DeleteUniversalSurveyStudentDataInput!
    $condition: ModelUniversalSurveyStudentDataConditionInput
  ) {
    deleteUniversalSurveyStudentData(input: $input, condition: $condition) {
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
export const createUniversalJournalData = /* GraphQL */ `
  mutation CreateUniversalJournalData(
    $input: CreateUniversalJournalDataInput!
    $condition: ModelUniversalJournalDataConditionInput
  ) {
    createUniversalJournalData(input: $input, condition: $condition) {
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
export const updateUniversalJournalData = /* GraphQL */ `
  mutation UpdateUniversalJournalData(
    $input: UpdateUniversalJournalDataInput!
    $condition: ModelUniversalJournalDataConditionInput
  ) {
    updateUniversalJournalData(input: $input, condition: $condition) {
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
export const deleteUniversalJournalData = /* GraphQL */ `
  mutation DeleteUniversalJournalData(
    $input: DeleteUniversalJournalDataInput!
    $condition: ModelUniversalJournalDataConditionInput
  ) {
    deleteUniversalJournalData(input: $input, condition: $condition) {
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
export const createUniversalSyllabus = /* GraphQL */ `
  mutation CreateUniversalSyllabus(
    $input: CreateUniversalSyllabusInput!
    $condition: ModelUniversalSyllabusConditionInput
  ) {
    createUniversalSyllabus(input: $input, condition: $condition) {
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
export const updateUniversalSyllabus = /* GraphQL */ `
  mutation UpdateUniversalSyllabus(
    $input: UpdateUniversalSyllabusInput!
    $condition: ModelUniversalSyllabusConditionInput
  ) {
    updateUniversalSyllabus(input: $input, condition: $condition) {
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
export const deleteUniversalSyllabus = /* GraphQL */ `
  mutation DeleteUniversalSyllabus(
    $input: DeleteUniversalSyllabusInput!
    $condition: ModelUniversalSyllabusConditionInput
  ) {
    deleteUniversalSyllabus(input: $input, condition: $condition) {
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
export const createCurriculumUnits = /* GraphQL */ `
  mutation CreateCurriculumUnits(
    $input: CreateCurriculumUnitsInput!
    $condition: ModelcurriculumUnitsConditionInput
  ) {
    createCurriculumUnits(input: $input, condition: $condition) {
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
export const updateCurriculumUnits = /* GraphQL */ `
  mutation UpdateCurriculumUnits(
    $input: UpdateCurriculumUnitsInput!
    $condition: ModelcurriculumUnitsConditionInput
  ) {
    updateCurriculumUnits(input: $input, condition: $condition) {
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
export const deleteCurriculumUnits = /* GraphQL */ `
  mutation DeleteCurriculumUnits(
    $input: DeleteCurriculumUnitsInput!
    $condition: ModelcurriculumUnitsConditionInput
  ) {
    deleteCurriculumUnits(input: $input, condition: $condition) {
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
export const createUniversalSyllabusLesson = /* GraphQL */ `
  mutation CreateUniversalSyllabusLesson(
    $input: CreateUniversalSyllabusLessonInput!
    $condition: ModelUniversalSyllabusLessonConditionInput
  ) {
    createUniversalSyllabusLesson(input: $input, condition: $condition) {
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
export const updateUniversalSyllabusLesson = /* GraphQL */ `
  mutation UpdateUniversalSyllabusLesson(
    $input: UpdateUniversalSyllabusLessonInput!
    $condition: ModelUniversalSyllabusLessonConditionInput
  ) {
    updateUniversalSyllabusLesson(input: $input, condition: $condition) {
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
export const deleteUniversalSyllabusLesson = /* GraphQL */ `
  mutation DeleteUniversalSyllabusLesson(
    $input: DeleteUniversalSyllabusLessonInput!
    $condition: ModelUniversalSyllabusLessonConditionInput
  ) {
    deleteUniversalSyllabusLesson(input: $input, condition: $condition) {
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
export const createUniversalLessonFeedback = /* GraphQL */ `
  mutation CreateUniversalLessonFeedback(
    $input: CreateUniversalLessonFeedbackInput!
    $condition: ModelUniversalLessonFeedbackConditionInput
  ) {
    createUniversalLessonFeedback(input: $input, condition: $condition) {
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
export const updateUniversalLessonFeedback = /* GraphQL */ `
  mutation UpdateUniversalLessonFeedback(
    $input: UpdateUniversalLessonFeedbackInput!
    $condition: ModelUniversalLessonFeedbackConditionInput
  ) {
    updateUniversalLessonFeedback(input: $input, condition: $condition) {
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
export const deleteUniversalLessonFeedback = /* GraphQL */ `
  mutation DeleteUniversalLessonFeedback(
    $input: DeleteUniversalLessonFeedbackInput!
    $condition: ModelUniversalLessonFeedbackConditionInput
  ) {
    deleteUniversalLessonFeedback(input: $input, condition: $condition) {
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
export const createStudentConnections = /* GraphQL */ `
  mutation CreateStudentConnections(
    $input: CreateStudentConnectionsInput!
    $condition: ModelStudentConnectionsConditionInput
  ) {
    createStudentConnections(input: $input, condition: $condition) {
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
export const updateStudentConnections = /* GraphQL */ `
  mutation UpdateStudentConnections(
    $input: UpdateStudentConnectionsInput!
    $condition: ModelStudentConnectionsConditionInput
  ) {
    updateStudentConnections(input: $input, condition: $condition) {
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
export const deleteStudentConnections = /* GraphQL */ `
  mutation DeleteStudentConnections(
    $input: DeleteStudentConnectionsInput!
    $condition: ModelStudentConnectionsConditionInput
  ) {
    deleteStudentConnections(input: $input, condition: $condition) {
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
export const createPersonSentiments = /* GraphQL */ `
  mutation CreatePersonSentiments(
    $input: CreatePersonSentimentsInput!
    $condition: ModelPersonSentimentsConditionInput
  ) {
    createPersonSentiments(input: $input, condition: $condition) {
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
export const updatePersonSentiments = /* GraphQL */ `
  mutation UpdatePersonSentiments(
    $input: UpdatePersonSentimentsInput!
    $condition: ModelPersonSentimentsConditionInput
  ) {
    updatePersonSentiments(input: $input, condition: $condition) {
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
export const deletePersonSentiments = /* GraphQL */ `
  mutation DeletePersonSentiments(
    $input: DeletePersonSentimentsInput!
    $condition: ModelPersonSentimentsConditionInput
  ) {
    deletePersonSentiments(input: $input, condition: $condition) {
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
export const createPersonFiles = /* GraphQL */ `
  mutation CreatePersonFiles(
    $input: CreatePersonFilesInput!
    $condition: ModelPersonFilesConditionInput
  ) {
    createPersonFiles(input: $input, condition: $condition) {
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
export const updatePersonFiles = /* GraphQL */ `
  mutation UpdatePersonFiles(
    $input: UpdatePersonFilesInput!
    $condition: ModelPersonFilesConditionInput
  ) {
    updatePersonFiles(input: $input, condition: $condition) {
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
export const deletePersonFiles = /* GraphQL */ `
  mutation DeletePersonFiles(
    $input: DeletePersonFilesInput!
    $condition: ModelPersonFilesConditionInput
  ) {
    deletePersonFiles(input: $input, condition: $condition) {
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
export const createCommunity = /* GraphQL */ `
  mutation CreateCommunity(
    $input: CreateCommunityInput!
    $condition: ModelCommunityConditionInput
  ) {
    createCommunity(input: $input, condition: $condition) {
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
      likes
      chatCount
      createdAt
      updatedAt
    }
  }
`;
export const updateCommunity = /* GraphQL */ `
  mutation UpdateCommunity(
    $input: UpdateCommunityInput!
    $condition: ModelCommunityConditionInput
  ) {
    updateCommunity(input: $input, condition: $condition) {
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
      likes
      chatCount
      createdAt
      updatedAt
    }
  }
`;
export const deleteCommunity = /* GraphQL */ `
  mutation DeleteCommunity(
    $input: DeleteCommunityInput!
    $condition: ModelCommunityConditionInput
  ) {
    deleteCommunity(input: $input, condition: $condition) {
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
      likes
      chatCount
      createdAt
      updatedAt
    }
  }
`;
export const createCommunityChat = /* GraphQL */ `
  mutation CreateCommunityChat(
    $input: CreateCommunityChatInput!
    $condition: ModelCommunityChatConditionInput
  ) {
    createCommunityChat(input: $input, condition: $condition) {
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
export const updateCommunityChat = /* GraphQL */ `
  mutation UpdateCommunityChat(
    $input: UpdateCommunityChatInput!
    $condition: ModelCommunityChatConditionInput
  ) {
    updateCommunityChat(input: $input, condition: $condition) {
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
export const deleteCommunityChat = /* GraphQL */ `
  mutation DeleteCommunityChat(
    $input: DeleteCommunityChatInput!
    $condition: ModelCommunityChatConditionInput
  ) {
    deleteCommunityChat(input: $input, condition: $condition) {
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
