export const onUpdateClassroom = /* GraphQL */ `
  subscription onUpdateClassroom($id: ID!) {
    onUpdateClassroom(id: $id) {
        id
        open
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
        lessonID
        lesson {
            id
            title
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
            }
            language
            summary
            objectives
            checkpoints {
            items {
                position
                checkpoint {
                instructions
                label
                type
                questions {
                    items {
                    required
                    question {
                        label
                        type
                        question
                        options {
                            # label
                            color
                            text
                            icon
                        }
                    }
                    }
                    nextToken
                }
                }
            }
            nextToken
            }
            doFirstID
            doFirst {
            id
            type
            required
            questions {
                items {
                question {
                    label
                    type
                    question
                    options {
                        # label
                        color
                        text
                        icon
                    }
                }
                }
                nextToken
            }
            }
            warmUpId
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
                id
                name
                prompt
                example
                }
            }
            breakdown {
                reflectionQuestions
            }
            }
            coreLessonId
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
                reflectionQuestions
            }
            }
            activityId
            activity {
            id
            title
            label
            stage
            type
            language
            lineNumber
            instructions {
                video
                link
                text
            }
            writingPrompts {
                id
                name
                prompt
                example
            }
            breakdown {
                reflectionQuestions
            }
            }
        }
        lessonPlan {
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
            live
            classroomID
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

export const onChangeStudentData = /* GraphQL */ `
  subscription onChangeStudentData($classroomID: ID!) {
    onChangeStudentData(classroomID: $classroomID) {
        id
        lessonProgress
        status
        live
        classroomID
        studentID
        createdAt
        updatedAt
    }
  }
`;