export const onUpdateClassroom = /* GraphQL */ `
  subscription onUpdateClassroom($id: ID!) {
    onUpdateClassroom(id: $id) {
        id
      open
      openedAt
      closedAt
      roster
      displayData {
        breakdownComponent
        warmUpData {
          story
          title
        }
        activityData {
          editInput
          editMode
          title
        }
      }
      courseID
      course {
        id
        name
        courseTypeID
        courseType {
          id
          name
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
          quotes
          createdAt
          updatedAt
        }
        language
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
          live
          classroomID
          studentDataClassroomId
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
    }
  }
`;

export const onChangeStudentData = /* GraphQL */ `
  subscription onChangeStudentData($classroomID: ID!) {
    onChangeStudentData(classroomID: $classroomID) {
      id
      lessonProgress
      live
      classroomID
      classroom {
        id
        open
        openedAt
        closedAt
        roster
        displayData {
          breakdownComponent
        }
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
          grades
          artistID
          language
          summary
          objectives
          doFirstID
          warmUpId
          coreLessonId
          activityId
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
        createdAt
        updatedAt
      }
      studentDataClassroomId
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
        externalId
        grade
        courses {
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