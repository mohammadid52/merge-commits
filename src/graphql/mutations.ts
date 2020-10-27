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
export const createInstitution = /* GraphQL */ `
  mutation CreateInstitution(
    $input: CreateInstitutionInput!
    $condition: ModelInstitutionConditionInput
  ) {
    createInstitution(input: $input, condition: $condition) {
      id
      name
      institutionTypeId
      institutionType {
        id
        name
        createdAt
        updatedAt
      }
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
      institutionTypeId
      institutionType {
        id
        name
        createdAt
        updatedAt
      }
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
      institutionTypeId
      institutionType {
        id
        name
        createdAt
        updatedAt
      }
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
          onBoardSurvey
          offBoardSurvey
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
        items {
          id
          curriculumID
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
          onBoardSurvey
          offBoardSurvey
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
        items {
          id
          curriculumID
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
          onBoardSurvey
          offBoardSurvey
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
        items {
          id
          curriculumID
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
export const createCurriculumLessons = /* GraphQL */ `
  mutation CreateCurriculumLessons(
    $input: CreateCurriculumLessonsInput!
    $condition: ModelCurriculumLessonsConditionInput
  ) {
    createCurriculumLessons(input: $input, condition: $condition) {
      id
      curriculumID
      lessonID
      curriculum {
        id
        name
        contributors {
          nextToken
        }
        grade
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateCurriculumLessons = /* GraphQL */ `
  mutation UpdateCurriculumLessons(
    $input: UpdateCurriculumLessonsInput!
    $condition: ModelCurriculumLessonsConditionInput
  ) {
    updateCurriculumLessons(input: $input, condition: $condition) {
      id
      curriculumID
      lessonID
      curriculum {
        id
        name
        contributors {
          nextToken
        }
        grade
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteCurriculumLessons = /* GraphQL */ `
  mutation DeleteCurriculumLessons(
    $input: DeleteCurriculumLessonsInput!
    $condition: ModelCurriculumLessonsConditionInput
  ) {
    deleteCurriculumLessons(input: $input, condition: $condition) {
      id
      curriculumID
      lessonID
      curriculum {
        id
        name
        contributors {
          nextToken
        }
        grade
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
      courseTypeID
      institution {
        id
        name
        institutionTypeId
        institutionType {
          id
          name
          createdAt
          updatedAt
        }
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
      classID
      class {
        id
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
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
          nextToken
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
      courseTypeID
      institution {
        id
        name
        institutionTypeId
        institutionType {
          id
          name
          createdAt
          updatedAt
        }
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
      classID
      class {
        id
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
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
          nextToken
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
      courseTypeID
      institution {
        id
        name
        institutionTypeId
        institutionType {
          id
          name
          createdAt
          updatedAt
        }
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
      classID
      class {
        id
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
        contributors {
          nextToken
        }
        grade
        languages
        lessons {
          nextToken
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
export const createClass = /* GraphQL */ `
  mutation CreateClass(
    $input: CreateClassInput!
    $condition: ModelClassConditionInput
  ) {
    createClass(input: $input, condition: $condition) {
      id
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
export const updateClass = /* GraphQL */ `
  mutation UpdateClass(
    $input: UpdateClassInput!
    $condition: ModelClassConditionInput
  ) {
    updateClass(input: $input, condition: $condition) {
      id
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
export const deleteClass = /* GraphQL */ `
  mutation DeleteClass(
    $input: DeleteClassInput!
    $condition: ModelClassConditionInput
  ) {
    deleteClass(input: $input, condition: $condition) {
      id
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
      studentAuth
      class {
        id
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
      studentAuth
      class {
        id
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
      studentAuth
      class {
        id
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
        createdAt
        updatedAt
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
      status
      saveType
      classroomID
      classroom {
        id
        open
        openedAt
        closedAt
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
      status
      saveType
      classroomID
      classroom {
        id
        open
        openedAt
        closedAt
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
      status
      saveType
      classroomID
      classroom {
        id
        open
        openedAt
        closedAt
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        source
        text
      }
      additionalContent {
        video
        links {
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
        source
        text
      }
      additionalContent {
        video
        links {
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
        source
        text
      }
      additionalContent {
        video
        links {
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
      expectedStartData
      expectedEndDate
      SELStructure
      courseID
      course {
        id
        name
        courseTypeID
        institution {
          id
          name
          institutionTypeId
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
        classID
        class {
          id
          name
          createdAt
          updatedAt
        }
        curriculumID
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
      lessonID
      lesson {
        id
        title
        type
        instructions
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
      expectedStartData
      expectedEndDate
      SELStructure
      courseID
      course {
        id
        name
        courseTypeID
        institution {
          id
          name
          institutionTypeId
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
        classID
        class {
          id
          name
          createdAt
          updatedAt
        }
        curriculumID
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
      lessonID
      lesson {
        id
        title
        type
        instructions
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
      expectedStartData
      expectedEndDate
      SELStructure
      courseID
      course {
        id
        name
        courseTypeID
        institution {
          id
          name
          institutionTypeId
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
        classID
        class {
          id
          name
          createdAt
          updatedAt
        }
        curriculumID
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
      lessonID
      lesson {
        id
        title
        type
        instructions
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        nextToken
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
      SELStructureID
      SELStructure {
        id
        name
        description
        createdAt
        updatedAt
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
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        nextToken
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
      SELStructureID
      SELStructure {
        id
        name
        description
        createdAt
        updatedAt
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
          onBoardSurvey
          offBoardSurvey
          phone
          birthdate
          image
          language
          createdAt
          updatedAt
        }
        nextToken
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
      SELStructureID
      SELStructure {
        id
        name
        description
        createdAt
        updatedAt
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        example
        titleExample
        textExample
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
        example
        titleExample
        textExample
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        roster
        viewing
        displayData {
          breakdownComponent
        }
        expectedStartData
        expectedEndDate
        SELStructure
        courseID
        course {
          id
          name
          courseTypeID
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
          SELStructureID
          connection
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
          assessmentID
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
        status
        saveType
        classroomID
        classroom {
          id
          open
          openedAt
          closedAt
          roster
          viewing
          expectedStartData
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
          roster
          viewing
          expectedStartData
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
        status
        saveType
        classroomID
        classroom {
          id
          open
          openedAt
          closedAt
          roster
          viewing
          expectedStartData
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
          roster
          viewing
          expectedStartData
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
        status
        saveType
        classroomID
        classroom {
          id
          open
          openedAt
          closedAt
          roster
          viewing
          expectedStartData
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
          roster
          viewing
          expectedStartData
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        contributors {
          nextToken
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
        SELStructureID
        SELStructure {
          id
          name
          description
          createdAt
          updatedAt
        }
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
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
