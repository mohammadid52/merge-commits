export const getClass = /* GraphQL */ `
  query GetClass($id: ID!) {
    getClass(id: $id) {
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
        instructions {
          video
          link
          text
        }
        inputs {
          title
          additionalInputs {
            name
            prompt
            example
          }
        }
        breakdown {
          included
          reflectionQuestions
        }
      }
      coreLesson {
        id
        title
        label
        stage
        type
        language
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
      }
      activity {
        id
        title
        label
        stage
        type
        language
        instructions {
          video
          link
          text
        }
        lineNumber
        writingPrompts {
          name
          prompt
          example
        }
        breakdown {
          included
          reflectionQuestions
        }
      }
      data {
        studentID
        dataObjects {
          type
          data
        }
      }
    }
  }
`;