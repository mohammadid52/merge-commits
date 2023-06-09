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

      website
      image
      isServiceProvider
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
      studentMaterials
      resources
      notes
      cardImage
      cardCaption
      darkMode
      lessonPlanAttachment

      lessonPlan {
        id
        title
        label
        description
        class
        active
        disabled
        interactionType
        tags
        displayMode
        open
        estTime
        pageContent {
          id
          tags
          partType
          class
          partContent {
            id
            type
            class
            value {
              id
              type
              label
              value
              caption
              width
              height
              isRequired
              class
              options {
                id
                label
                text
              }
            }
            isRequired
          }
        }
      }
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
      image

      language
      passcode
    }
  }
`;

export const updateLastSubmissionDate = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      lastEmotionSubmission
    }
  }
`;

export const updatePersonLoginTime = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      email
      lastLoggedIn
      pageState
      lastPageStateUpdate
    }
  }
`;

export const updatePersonLogoutTime = /* GraphQL */ `
  mutation UpdatePerson(
    $input: UpdatePersonInput!
    $condition: ModelPersonConditionInput
  ) {
    updatePerson(input: $input, condition: $condition) {
      id
      authId
      email
      lastLoggedIn
      pageState
      lastPageStateUpdate
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
      email
      authID
      componentType
      lessonID
      scheduleID
      responseObject {
        qid
        response
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
      componentType
      scheduleID
      lessonID
      responseObject {
        qid
        response
      }
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
      status

      website
      image
      isServiceProvider
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
      type
      summary
      institutionID
    }
  }
`;

export const createClass = /* GraphQL */ `
  mutation CreateClass($input: CreateClassInput!, $condition: ModelClassConditionInput) {
    createClass(input: $input, condition: $condition) {
      id
      institutionID
      name
      institution {
        id
        name
      }
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
      group
      classID
      studentID
      status
      student {
        onDemand
      }
      studentEmail
      studentAuthID
      createdAt
    }
  }
`;

export const updatePersonLessonsData = /* GraphQL */ `
  mutation UpdatePersonLessonsData(
    $input: UpdatePersonLessonsDataInput!
    $condition: ModelPersonLessonsDataConditionInput
  ) {
    updatePersonLessonsData(input: $input, condition: $condition) {
      id
      studentAuthID
      studentEmail
      lessonID
      lessonType
      pages
      ratings
      isCompleted
      roomId
      lesson {
        id
        type
        title
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
    }
  }
`;

export const createRoom = /* GraphQL */ `
  mutation CreateRoom($input: CreateRoomInput!, $condition: ModelRoomConditionInput) {
    createRoom(input: $input, condition: $condition) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      name
      maxPersons
    }
  }
`;

export const updateRoom = /* GraphQL */ `
  mutation UpdateRoom($input: UpdateRoomInput!, $condition: ModelRoomConditionInput) {
    updateRoom(input: $input, condition: $condition) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      teachingStyle
      name
      maxPersons
      activeSyllabus
    }
  }
`;

export const updateServiceProviderStatus = /* GraphQL */ `
  mutation UpdateServiceProvider(
    $input: UpdateServiceProviderInput!
    $condition: ModelServiceProviderConditionInput
  ) {
    updateServiceProvider(input: $input, condition: $condition) {
      id
      status
    }
  }
`;

export const createTopic = /* GraphQL */ `
  mutation CreateTopic($input: CreateTopicInput!, $condition: ModelTopicConditionInput) {
    createTopic(input: $input, condition: $condition) {
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
  }
`;

export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic($input: UpdateTopicInput!, $condition: ModelTopicConditionInput) {
    updateTopic(input: $input, condition: $condition) {
      id
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
      curriculumID
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
      instructionsTitle
      language
      summary
      purpose
      designers
      objectives
      summaryTitle
      introductionTitle
      introduction
      lessonPlan {
        type
        LessonComponentID
        sequence
        stage
      }
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
      assessmentID
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
      instructionsTitle
      instructions
      purpose
      scope
      objectives
      designers
      language
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
      scope
      instructionsTitle
      instructions
      purpose
      objectives
      designers
      language
      estTime
      questionSeq
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
      createdAt
      updatedAt
    }
  }
`;

export const createCommonCheckpoint = /* GraphQL */ `
  mutation CreateCommonCheckpoint(
    $input: CreateCommonCheckpointInput!
    $condition: ModelCommonCheckpointConditionInput
  ) {
    createCommonCheckpoint(input: $input, condition: $condition) {
      id
      type
      typeID
      checkpointID
      createdAt
      updatedAt
    }
  }
`;
export const deleteCommonCheckpoint = /* GraphQL */ `
  mutation DeleteCommonCheckpoint(
    $input: DeleteCommonCheckpointInput!
    $condition: ModelCommonCheckpointConditionInput
  ) {
    deleteCommonCheckpoint(input: $input, condition: $condition) {
      id
      type
      typeID
      checkpointID
    }
  }
`;

// delete once lessons table updated in production
// export const updateLessonInsts= /* GraphQL */ `
//   mutation UpdateLesson($input: UpdateLessonInput!, $condition: ModelLessonConditionInput) {
//     updateLesson(input: $input, condition: $condition) {
//       id
//       institutionID
//     }
//   }
// `;

export const updateCurriculumSyllabusSequence = /* GraphQL */ `
  mutation UpdateCurriculum(
    $input: UpdateCurriculumInput!
    $condition: ModelCurriculumConditionInput
  ) {
    updateCurriculum(input: $input, condition: $condition) {
      id
      universalSyllabusSeq
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
      lesson {
        id
        type
        label
        title
        institutionID
        institution {
          id
          name
        }
      }
    }
  }
`;

export const updateUniversalSyllabusLessonSequence = /* GraphQL */ `
  mutation UpdateUniversalSyllabus(
    $input: UpdateUniversalSyllabusInput!
    $condition: ModelUniversalSyllabusConditionInput
  ) {
    updateUniversalSyllabus(input: $input, condition: $condition) {
      id
      universalLessonsSeq
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
      date
      time
      responseText
      createdAt
      backstory
      updatedAt
    }
  }
`;

export const createPersonLessonsData = /* GraphQL */ `
  mutation CreatePersonLessonsData(
    $input: CreatePersonLessonsDataInput!
    $condition: ModelPersonLessonsDataConditionInput
  ) {
    createPersonLessonsData(input: $input, condition: $condition) {
      id
      studentAuthID
      studentEmail
      lessonID
      lessonType
      pages
      ratings
      isCompleted
      roomId
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

          website
          image
          isServiceProvider
          isZoiq

          setupComplete
          createdAt
          updatedAt
        }
        language
        designers
        objectives
        lessonPlanAttachment
        purpose
        introduction
        introductionTitle
        status
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
          notes
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
          notes
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
      date
      time
      backstory
      responseText
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
      groupName
      groupType
      advisorEmail
      advisorAuthId
      groupAdvisor {
        id
        authId
        email
        firstName
        preferredName
        lastName
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
          student {
            id
            firstName
            preferredName
            lastName
            image
          }
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
      groupName
      groupType
      advisorEmail
      advisorAuthId
      groupAdvisor {
        id
        authId
        status
        email
        firstName
        preferredName
        lastName
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
          student {
            id
            firstName
            preferredName
            lastName
            image
          }
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
        classroomGroupsStudents {
          items {
            id
            classRoomGroupID
            studentEmail
            studentAuthId
            studentType
            studentNote
            student {
              id
              firstName
              preferredName
              lastName
              image
            }
            createdAt
            updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
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
        classroomGroupsStudents {
          items {
            id
            classRoomGroupID
            studentEmail
            studentAuthId
            studentType
            studentNote
            student {
              id
              firstName
              preferredName
              lastName
              image
            }
            createdAt
            updatedAt
          }
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

export const deleteCurriculumUnits = /* GraphQL */ `
  mutation DeleteCurriculumUnits(
    $input: DeleteCurriculumUnitsInput!
    $condition: ModelCurriculumUnitsConditionInput
  ) {
    deleteCurriculumUnits(input: $input, condition: $condition) {
      id
      unitId
    }
  }
`;

export const createErrorLog = /* GraphQL */ `
  mutation CreateErrorLog(
    $input: CreateErrorLogInput!
    $condition: ModelErrorLogConditionInput
  ) {
    createErrorLog(input: $input, condition: $condition) {
      id
      pageUrl
      componentName
      error
      errorType
      errorTime
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
        onDemand
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateErrorLog = /* GraphQL */ `
  mutation UpdateErrorLog(
    $input: UpdateErrorLogInput!
    $condition: ModelErrorLogConditionInput
  ) {
    updateErrorLog(input: $input, condition: $condition) {
      id
      status
      createdAt
      updatedAt
    }
  }
`;

export const createUploadLogs = /* GraphQL */ `
  mutation CreateUploadLogs(
    $input: CreateUploadLogsInput!
    $condition: ModelUploadLogsConditionInput
  ) {
    createUploadLogs(input: $input, condition: $condition) {
      id
      TemporaryUniversalUploadSurveyDataID
      TemporaryDemographicsUploadDataID
      UploadType
      Date
      User_id
      Curricullum_id
      urlLink
      Unit_id
      authID
      email
      lesson_id
      room_id
      Class_id
      PaperSurveyURL
      Reason
      person {
        id
        authId
        email
        firstName
        preferredName
        lastName
      }
      lesson {
        id
        type
        label
        title
      }
      room {
        id
        name
      }
      unit {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const _updateRoom = /* GraphQL */ `
  mutation UpdateRoom($input: UpdateRoomInput!, $condition: ModelRoomConditionInput) {
    updateRoom(input: $input, condition: $condition) {
      id
      institutionID
      classID
      teacherAuthID
      teacherEmail
      name
      maxPersons
      status

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
          type
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
        inactiveStatusDate
        image
        language

        lastLoggedIn
        lastLoggedOut
        onDemand
        sentiments
        passcode
        classes {
          nextToken
        }
        lessons {
          nextToken
        }
        spotlightUser
        spotlightDate
        statusReason
        addedby
        lastEmotionSubmission
        pageState
        lastPageStateUpdate
        statusChangedBy
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

          website
          image
          isServiceProvider

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
          status

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
          type
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
      type
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
    }
  }
`;
