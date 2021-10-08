/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUpdatePersonLocationItem = /* GraphQL */ `
  subscription OnCreateUpdatePersonLocationItem(
    $syllabusLessonID: ID!
    $lessonID: ID!
    $roomID: ID!
  ) {
    onCreateUpdatePersonLocationItem(
      syllabusLessonID: $syllabusLessonID
      lessonID: $lessonID
      roomID: $roomID
    ) {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePersonLocationItem = /* GraphQL */ `
  subscription OnDeletePersonLocationItem(
    $syllabusLessonID: ID!
    $lessonID: ID!
    $roomID: ID!
  ) {
    onDeletePersonLocationItem(
      syllabusLessonID: $syllabusLessonID
      lessonID: $lessonID
      roomID: $roomID
    ) {
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
export const onChangeUniversalLessonStudentData = /* GraphQL */ `
  subscription OnChangeUniversalLessonStudentData(
    $syllabusLessonID: ID!
    $lessonID: ID!
    $studentAuthID: ID!
  ) {
    onChangeUniversalLessonStudentData(
      syllabusLessonID: $syllabusLessonID
      lessonID: $lessonID
      studentAuthID: $studentAuthID
    ) {
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
export const onChangeRoom = /* GraphQL */ `
  subscription OnChangeRoom($id: ID!) {
    onChangeRoom(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateClassroomGroupStudents = /* GraphQL */ `
  subscription OnCreateClassroomGroupStudents {
    onCreateClassroomGroupStudents {
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
export const onUpdateClassroomGroupStudents = /* GraphQL */ `
  subscription OnUpdateClassroomGroupStudents {
    onUpdateClassroomGroupStudents {
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
export const onDeleteClassroomGroupStudents = /* GraphQL */ `
  subscription OnDeleteClassroomGroupStudents {
    onDeleteClassroomGroupStudents {
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
export const onCreateClassroomGroups = /* GraphQL */ `
  subscription OnCreateClassroomGroups {
    onCreateClassroomGroups {
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
export const onUpdateClassroomGroups = /* GraphQL */ `
  subscription OnUpdateClassroomGroups {
    onUpdateClassroomGroups {
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
export const onDeleteClassroomGroups = /* GraphQL */ `
  subscription OnDeleteClassroomGroups {
    onDeleteClassroomGroups {
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
export const onCreateRoomCoTeachers = /* GraphQL */ `
  subscription OnCreateRoomCoTeachers {
    onCreateRoomCoTeachers {
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
export const onUpdateRoomCoTeachers = /* GraphQL */ `
  subscription OnUpdateRoomCoTeachers {
    onUpdateRoomCoTeachers {
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
export const onDeleteRoomCoTeachers = /* GraphQL */ `
  subscription OnDeleteRoomCoTeachers {
    onDeleteRoomCoTeachers {
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
export const onCreateClass = /* GraphQL */ `
  subscription OnCreateClass {
    onCreateClass {
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
export const onUpdateClass = /* GraphQL */ `
  subscription OnUpdateClass {
    onUpdateClass {
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
export const onDeleteClass = /* GraphQL */ `
  subscription OnDeleteClass {
    onDeleteClass {
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
export const onCreateClassStudent = /* GraphQL */ `
  subscription OnCreateClassStudent {
    onCreateClassStudent {
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
export const onUpdateClassStudent = /* GraphQL */ `
  subscription OnUpdateClassStudent {
    onUpdateClassStudent {
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
export const onDeleteClassStudent = /* GraphQL */ `
  subscription OnDeleteClassStudent {
    onDeleteClassStudent {
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
export const onCreateCurriculum = /* GraphQL */ `
  subscription OnCreateCurriculum {
    onCreateCurriculum {
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
export const onUpdateRubric = /* GraphQL */ `
  subscription OnUpdateRubric {
    onUpdateRubric {
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
export const onDeleteRubric = /* GraphQL */ `
  subscription OnDeleteRubric {
    onDeleteRubric {
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
        createdAt
        updatedAt
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
      scope
      questionSeq
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
      scope
      questionSeq
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
      scope
      questionSeq
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCommonCheckpoint = /* GraphQL */ `
  subscription OnCreateCommonCheckpoint {
    onCreateCommonCheckpoint {
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
export const onUpdateCommonCheckpoint = /* GraphQL */ `
  subscription OnUpdateCommonCheckpoint {
    onUpdateCommonCheckpoint {
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
export const onDeleteCommonCheckpoint = /* GraphQL */ `
  subscription OnDeleteCommonCheckpoint {
    onDeleteCommonCheckpoint {
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
      published
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
      published
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
      published
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
export const onCreateLessonRubrics = /* GraphQL */ `
  subscription OnCreateLessonRubrics {
    onCreateLessonRubrics {
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
export const onUpdateLessonRubrics = /* GraphQL */ `
  subscription OnUpdateLessonRubrics {
    onUpdateLessonRubrics {
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
export const onDeleteLessonRubrics = /* GraphQL */ `
  subscription OnDeleteLessonRubrics {
    onDeleteLessonRubrics {
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
export const onCreateAnthologyComment = /* GraphQL */ `
  subscription OnCreateAnthologyComment {
    onCreateAnthologyComment {
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
export const onUpdateAnthologyComment = /* GraphQL */ `
  subscription OnUpdateAnthologyComment {
    onUpdateAnthologyComment {
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
export const onDeleteAnthologyComment = /* GraphQL */ `
  subscription OnDeleteAnthologyComment {
    onDeleteAnthologyComment {
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
export const onCreateQuestionData = /* GraphQL */ `
  subscription OnCreateQuestionData {
    onCreateQuestionData {
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
export const onUpdateQuestionData = /* GraphQL */ `
  subscription OnUpdateQuestionData {
    onUpdateQuestionData {
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
export const onDeleteQuestionData = /* GraphQL */ `
  subscription OnDeleteQuestionData {
    onDeleteQuestionData {
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
export const onCreatePersonLocation = /* GraphQL */ `
  subscription OnCreatePersonLocation {
    onCreatePersonLocation {
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateNoticeboardWidget = /* GraphQL */ `
  subscription OnCreateNoticeboardWidget {
    onCreateNoticeboardWidget {
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
export const onUpdateNoticeboardWidget = /* GraphQL */ `
  subscription OnUpdateNoticeboardWidget {
    onUpdateNoticeboardWidget {
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
export const onDeleteNoticeboardWidget = /* GraphQL */ `
  subscription OnDeleteNoticeboardWidget {
    onDeleteNoticeboardWidget {
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
export const onCreateAttendance = /* GraphQL */ `
  subscription OnCreateAttendance {
    onCreateAttendance {
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
        createdAt
        updatedAt
      }
      syllabus {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAttendance = /* GraphQL */ `
  subscription OnUpdateAttendance {
    onUpdateAttendance {
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
        createdAt
        updatedAt
      }
      syllabus {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAttendance = /* GraphQL */ `
  subscription OnDeleteAttendance {
    onDeleteAttendance {
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
        createdAt
        updatedAt
      }
      syllabus {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlanner = /* GraphQL */ `
  subscription OnCreatePlanner {
    onCreatePlanner {
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
export const onUpdatePlanner = /* GraphQL */ `
  subscription OnUpdatePlanner {
    onUpdatePlanner {
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
export const onDeletePlanner = /* GraphQL */ `
  subscription OnDeletePlanner {
    onDeletePlanner {
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
export const onCreateUniversalLesson = /* GraphQL */ `
  subscription OnCreateUniversalLesson {
    onCreateUniversalLesson {
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUniversalLesson = /* GraphQL */ `
  subscription OnUpdateUniversalLesson {
    onUpdateUniversalLesson {
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUniversalLesson = /* GraphQL */ `
  subscription OnDeleteUniversalLesson {
    onDeleteUniversalLesson {
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUniversalLessonStudentData = /* GraphQL */ `
  subscription OnCreateUniversalLessonStudentData {
    onCreateUniversalLessonStudentData {
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
export const onUpdateUniversalLessonStudentData = /* GraphQL */ `
  subscription OnUpdateUniversalLessonStudentData {
    onUpdateUniversalLessonStudentData {
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
export const onDeleteUniversalLessonStudentData = /* GraphQL */ `
  subscription OnDeleteUniversalLessonStudentData {
    onDeleteUniversalLessonStudentData {
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
export const onCreateUniversalJournalData = /* GraphQL */ `
  subscription OnCreateUniversalJournalData {
    onCreateUniversalJournalData {
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
export const onUpdateUniversalJournalData = /* GraphQL */ `
  subscription OnUpdateUniversalJournalData {
    onUpdateUniversalJournalData {
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
export const onDeleteUniversalJournalData = /* GraphQL */ `
  subscription OnDeleteUniversalJournalData {
    onDeleteUniversalJournalData {
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
export const onCreateUniversalSyllabus = /* GraphQL */ `
  subscription OnCreateUniversalSyllabus {
    onCreateUniversalSyllabus {
      id
      name
      type
      institutionID
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
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUniversalSyllabus = /* GraphQL */ `
  subscription OnUpdateUniversalSyllabus {
    onUpdateUniversalSyllabus {
      id
      name
      type
      institutionID
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
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUniversalSyllabus = /* GraphQL */ `
  subscription OnDeleteUniversalSyllabus {
    onDeleteUniversalSyllabus {
      id
      name
      type
      institutionID
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCurriculumUnits = /* GraphQL */ `
  subscription OnCreateCurriculumUnits {
    onCreateCurriculumUnits {
      id
      unitId
      unit {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
      curriculumId
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCurriculumUnits = /* GraphQL */ `
  subscription OnUpdateCurriculumUnits {
    onUpdateCurriculumUnits {
      id
      unitId
      unit {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
      curriculumId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCurriculumUnits = /* GraphQL */ `
  subscription OnDeleteCurriculumUnits {
    onDeleteCurriculumUnits {
      id
      unitId
      unit {
        id
        name
        type
        institutionID
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
        createdAt
        updatedAt
      }
      curriculumId
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUniversalSyllabusLesson = /* GraphQL */ `
  subscription OnCreateUniversalSyllabusLesson {
    onCreateUniversalSyllabusLesson {
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
export const onUpdateUniversalSyllabusLesson = /* GraphQL */ `
  subscription OnUpdateUniversalSyllabusLesson {
    onUpdateUniversalSyllabusLesson {
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
export const onDeleteUniversalSyllabusLesson = /* GraphQL */ `
  subscription OnDeleteUniversalSyllabusLesson {
    onDeleteUniversalSyllabusLesson {
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
export const onCreateUniversalLessonFeedback = /* GraphQL */ `
  subscription OnCreateUniversalLessonFeedback {
    onCreateUniversalLessonFeedback {
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
export const onUpdateUniversalLessonFeedback = /* GraphQL */ `
  subscription OnUpdateUniversalLessonFeedback {
    onUpdateUniversalLessonFeedback {
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
export const onDeleteUniversalLessonFeedback = /* GraphQL */ `
  subscription OnDeleteUniversalLessonFeedback {
    onDeleteUniversalLessonFeedback {
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
export const onCreateStudentConnections = /* GraphQL */ `
  subscription OnCreateStudentConnections {
    onCreateStudentConnections {
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
export const onUpdateStudentConnections = /* GraphQL */ `
  subscription OnUpdateStudentConnections {
    onUpdateStudentConnections {
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
export const onDeleteStudentConnections = /* GraphQL */ `
  subscription OnDeleteStudentConnections {
    onDeleteStudentConnections {
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
export const onCreatePersonSentiments = /* GraphQL */ `
  subscription OnCreatePersonSentiments {
    onCreatePersonSentiments {
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
export const onUpdatePersonSentiments = /* GraphQL */ `
  subscription OnUpdatePersonSentiments {
    onUpdatePersonSentiments {
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
export const onDeletePersonSentiments = /* GraphQL */ `
  subscription OnDeletePersonSentiments {
    onDeletePersonSentiments {
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
export const onCreatePersonFiles = /* GraphQL */ `
  subscription OnCreatePersonFiles {
    onCreatePersonFiles {
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
export const onUpdatePersonFiles = /* GraphQL */ `
  subscription OnUpdatePersonFiles {
    onUpdatePersonFiles {
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
export const onDeletePersonFiles = /* GraphQL */ `
  subscription OnDeletePersonFiles {
    onDeletePersonFiles {
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
export const onCreateCommunity = /* GraphQL */ `
  subscription OnCreateCommunity {
    onCreateCommunity {
      id
      cardName
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
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCommunity = /* GraphQL */ `
  subscription OnUpdateCommunity {
    onUpdateCommunity {
      id
      cardName
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
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCommunity = /* GraphQL */ `
  subscription OnDeleteCommunity {
    onDeleteCommunity {
      id
      cardName
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
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCommunityChat = /* GraphQL */ `
  subscription OnCreateCommunityChat {
    onCreateCommunityChat {
      id
      communityId
      personAuthID
      personEmail
      msg
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCommunityChat = /* GraphQL */ `
  subscription OnUpdateCommunityChat {
    onUpdateCommunityChat {
      id
      communityId
      personAuthID
      personEmail
      msg
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCommunityChat = /* GraphQL */ `
  subscription OnDeleteCommunityChat {
    onDeleteCommunityChat {
      id
      communityId
      personAuthID
      personEmail
      msg
      createdAt
      updatedAt
    }
  }
`;
