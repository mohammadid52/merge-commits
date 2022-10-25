import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as queries from 'graphql/queries';
import * as customQueries from 'customGraphql/customQueries';
import * as mutations from 'graphql/mutations';

const removeDoubleSpaces = (str: string) => {
  return str.replace(/\s{2,}/g, ' ');
};

// regex match double quotations and replace with single quotations
const removeDoubleQuotes = (str: string) => {
  return str.replace(/\"/g, "'");
};

const pipeFn = (...fns: any[]) => (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);

const cleanString = (str: string) => {
  return pipeFn(removeDoubleSpaces, removeDoubleQuotes)(str);
};

const getQuestionListFromLesson = async (lessonObj: any) => {
  if (lessonObj?.lessonPlan) {
    const mappedPages = lessonObj?.lessonPlan.reduce(
      (
        inputs: {
          questionList: any[];
        },
        page: any
      ) => {
        const pageParts = page.pageContent;
        const reducedPageInputs = pageParts.reduce(
          (
            pageInputsAcc: {
              pageInputAcc: any[];
            },
            pagePart: any
          ) => {
            if (pagePart.hasOwnProperty('partContent')) {
              const partInputs = pagePart.partContent.reduce(
                (
                  partInputAcc: {
                    pageInputAcc: any[];
                  },
                  partContent: any
                ) => {
                  //  CHECK WHICH INPUT TYPE  //
                  const isForm = /form/g.test(partContent.type);
                  const isOtherInput = /input/g.test(partContent.type);

                  // -------- IF FORM ------- //
                  if (isForm) {
                    const formSubInputs = partContent.value.reduce(
                      (subPartAcc: {pgInput: any[]}, partContentSub: any) => {
                        return {
                          ...subPartAcc,

                          pgInput: [
                            ...subPartAcc.pgInput,
                            {
                              questionID: partContentSub.id,
                              type: partContentSub.type,
                              questionString: partContentSub.label,
                              options: partContentSub.options
                            }
                          ]
                        };
                      },
                      {pgInput: []}
                    );

                    return {
                      pageInputAcc: [
                        ...partInputAcc.pageInputAcc,
                        ...formSubInputs.pgInput
                      ]
                    };
                  }
                  // ---- IF OTHER INPUT ---- //
                  else if (isOtherInput) {
                    return {
                      pageInputAcc: [
                        ...partInputAcc.pageInputAcc,
                        {
                          questionID: partContent.id,
                          type: partContent.type,
                          questionString: partContent.label,
                          options: partContent.options
                        }
                      ]
                    };
                  } else {
                    return partInputAcc;
                  }
                },
                {pageInputAcc: []}
              );

              return {
                pageInputAcc: [...pageInputsAcc.pageInputAcc, ...partInputs.pageInputAcc]
              };
            } else {
              return pageInputsAcc;
            }
          },
          {pageInputAcc: []}
        );

        return {
          questionList: [...inputs.questionList, reducedPageInputs.pageInputAcc]
        };
      },

      {questionList: []}
    );

    return mappedPages;
  }
};

const getAllData = async () => {
  const surveyList = await getAllSurvey();
  const studentsDetails = await listAllStudents(`ST`, undefined, []);

  let returnedData = surveyList.map(async (survey: any) => {
    const surveyResponse = await getAllStudentsSurveyQuestionsResponse(
      survey.id,
      undefined,
      []
    );
    const questions = await listQues(survey.id);

    return {surveyResponse, questions};
  });

  const allReturnedData: any = await Promise.all(returnedData);
  const SurveyQuestion = allReturnedData
    .map((surveyData: any) => {
      return surveyData.questions;
    })
    .reduce((prev: any, curr: any) => {
      return [...prev, ...curr];
    });

  const SurveyQuestionData = allReturnedData
    .map((surveyData: any) => {
      return surveyData.surveyResponse;
    })
    .reduce((prev: any, curr: any) => {
      return [...prev, ...curr];
    });

  return {
    SurveyQuestion,
    SurveyQuestionData,
    studentsDetails
  };
};

const getAllSurvey = async () => {
  try {
    let surveyList: any = await API.graphql(
      graphqlOperation(queries.listUniversalLessons, {
        filter: {
          type: {
            eq: 'survey'
          }
        }
      })
    );
    const returnedData = surveyList.data.listUniversalLessons.items;
    return returnedData;
  } catch (err) {
    console.error('getAllSurvey error', err);
  }
};

const listAllStudents = async (
  peopleType: string,
  nextToken: string,
  outArray: any[]
): Promise<any> => {
  let combined: any[];
  try {
    const result: any = await API.graphql(
      graphqlOperation(queries.listPeople, {
        filter: {role: {eq: peopleType}},
        nextToken: nextToken
      })
    );

    let returnedData = result.data.listPeople?.items;
    let NextToken = result.data.listPeople?.nextToken;

    combined = [...outArray, ...returnedData];

    if (NextToken) {
      combined = await listAllStudents(peopleType, NextToken, combined);
    }

    return combined;
  } catch (error) {
    console.log(
      '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
      error
    );
  }
};

const listQues = async (lessonId: string) => {
  try {
    let universalLesson: any = await API.graphql(
      graphqlOperation(customQueries.getUniversalLesson, {
        id: lessonId
      })
    );
    let lessonObject = universalLesson.data.getUniversalLesson;
    let questionsListdata = await getQuestionListFromLesson(lessonObject);
    let questionList = questionsListdata.questionList;
    let questions: any = [];
    if (questionList) {
      questionList.map((listItem: any) => {
        listItem.map((item: any) => {
          questions.push({
            question: {
              id: item.questionID,
              question: item.questionString,
              type: item.type,
              options: item.options
            }
          });
        });
      });
    }

    return questions;
  } catch (err) {
    console.error('list questions error', err);
  }
};

const getAllStudentsSurveyQuestionsResponse = async (
  lessonId: string,
  nextToken?: string,
  outArray?: any[]
) => {
  let universalSurveyStudentData: any = await API.graphql(
    graphqlOperation(queries.listUniversalSurveyStudentData, {
      nextToken: nextToken,
      filter: {
        lessonID: {
          eq: lessonId
        }
      }
    })
  );
  let studentsAnswersSurveyQuestionsData =
    universalSurveyStudentData.data.listUniversalSurveyStudentData.items;
  let theNextToken =
    universalSurveyStudentData.data.listUniversalSurveyStudentData?.nextToken;

  /**
   * combination of last fetch results
   * && current fetch results
   */
  let combined: any = [...studentsAnswersSurveyQuestionsData, ...outArray];

  // console.log('combined - - - -', combined);

  if (theNextToken) {
    combined = await getAllStudentsSurveyQuestionsResponse(
      lessonId,
      theNextToken,
      combined
    );
  }
  console.log('fetched from universalSurveyData');

  return combined;
};

const getCSVData = async () => {
  try {
    const {SurveyQuestion, SurveyQuestionData, studentsDetails} = await getAllData();
    let students = studentsDetails;
    let qids: any = [];
    let takenSurvey = 0;
    let notTakenSurvey = 0;
    let surveyDates: any = [];
    // creating an array of question Ids and creating a object to store all question options.
    let surveyQuestionOptions: any = {};
    let surveyQuestionHeaders = SurveyQuestion.map((ques: any) => {
      qids.push(ques.question.id);
      surveyQuestionOptions[ques.question.id] = ques.question.options;
      return {
        label: `${ques.question.question}-s-${ques.question.id}`,
        key: `${ques.question.id}`
      };
    });

    let Headers = [
      {label: 'AuthId', key: 'authId'},
      {label: 'Email', key: 'email'},
      {label: 'UniversalSurveyStudentID', key: 'universalSurveyStudentID'},
      ...surveyQuestionHeaders
    ];

    let data = students.map((stu: any) => {
      let surveyAnswerDates: any = [];
      let studentAnswers: any = {};
      let hasTakenSurvey = false;
      let universalSurveyStudentID = '';

      SurveyQuestionData.map((answerArray: any) => {
        if (answerArray.studentID === stu.authId) {
          hasTakenSurvey = true;
          universalSurveyStudentID = answerArray.id;

          answerArray.surveyData.map((singleAnswer: any) => {
            if (qids.indexOf(singleAnswer.domID) >= 0) {
              surveyAnswerDates.push(answerArray.updatedAt);
              surveyDates.push(answerArray.updatedAt);
              if (
                surveyQuestionOptions[singleAnswer.domID] &&
                Array.isArray(surveyQuestionOptions[singleAnswer.domID]) &&
                surveyQuestionOptions[singleAnswer.domID].length
              ) {
                if (
                  Array.isArray(singleAnswer.input) &&
                  singleAnswer.input.length &&
                  singleAnswer.input[0].length
                ) {
                  let selectedOption = surveyQuestionOptions[singleAnswer.domID].filter(
                    (option: any) => {
                      return option.id === singleAnswer.input[0];
                    }
                  );
                  if (Array.isArray(selectedOption) && selectedOption.length) {
                    // cleanup here
                    studentAnswers[singleAnswer.domID] = cleanString(
                      selectedOption[0].text
                    );
                  } else {
                    studentAnswers[singleAnswer.domID] = '';
                  }
                } else {
                  studentAnswers[singleAnswer.domID] = '';
                }
              } else {
                // cleanup here
                studentAnswers[singleAnswer.domID] =
                  Array.isArray(singleAnswer.input) && singleAnswer.input.length
                    ? cleanString(singleAnswer.input[0])
                    : '';
              }
            }
          });
        }
      });

      surveyAnswerDates = surveyAnswerDates.sort(
        // @ts-ignore
        (a: any, b: any) => new Date(b) - new Date(a)
      );

      if (hasTakenSurvey) {
        takenSurvey++;
      } else {
        notTakenSurvey++;
      }

      return {
        ...stu,
        universalSurveyStudentID: universalSurveyStudentID
          ? universalSurveyStudentID
          : 'Not-taken-yet',
        ...studentAnswers,
        hasTakenSurvey,
        first:
          (surveyAnswerDates[surveyAnswerDates.length - 1] &&
            new Date(surveyAnswerDates[surveyAnswerDates.length - 1]).toLocaleString(
              'en-US'
            )) ||
          '-',
        last:
          (surveyAnswerDates[0] &&
            new Date(surveyAnswerDates[0]).toLocaleString('en-US')) ||
          '-'
      };
    });
    surveyDates = surveyDates.sort(
      // @ts-ignore
      (a: any, b: any) => new Date(b) - new Date(a)
    );
    return {
      SurveyHeaders: Headers,
      SurveyData: data
    };
  } catch (err) {
    console.error('error', err);
  }
};

export const filterData = async () => {
  const {SurveyHeaders, SurveyData} = await getCSVData();
  let filteredData = SurveyData.filter((csvD: {[x: string]: string}): any => {
    return SurveyHeaders.find(({key}: any) => {
      if (csvD[key] === '') {
        return true;
      }
    });
  });
  let input: any[] = [];
  filteredData.map((csvD: any) => {
    input = [
      ...input,
      {
        AuthId: csvD.authId,
        Email: csvD.email,
        UniversalSurveyStudentID: csvD.universalSurveyStudentID,
        QuestionResult: SurveyHeaders.map((header: any) => {
          if (csvD[header.key] !== undefined) {
            return {
              QuestionId: header.key,
              QuestionLabel: header.label,
              QuestionResponse: csvD[header.key]
            };
          }
        }).filter((elem: any) => elem !== undefined)
      }
    ];
  });
  await CreateOrUpdateData(input);
};

const CreateOrUpdateData = async (input: any[]) => {
  try {
    input.map(async (data: any) => {
      const getData: any = await API.graphql(
        graphqlOperation(queries.getArchiveSurveyDataSQL, {
          AuthId: data.AuthId,
          Email: data.Email
        })
      );
      const ArchiveData = getData.data.getArchiveSurveyDataSQL;
      if (ArchiveData) {
        await API.graphql(
          graphqlOperation(mutations.updateArchiveSurveyDataSQL, {
            input: {
              id: ArchiveData.id,
              ...data
            }
          })
        );
      } else {
        await API.graphql(
          graphqlOperation(mutations.createArchiveSurveyDataSQL, {
            input: {
              ...data
            }
          })
        );
      }
    });
  } catch (err) {
    console.log(
      '🚀 ~ file: AnalyticsDashboard.tsx ~ line 532 ~ UploadDataToAthena ~ err',
      err
    );
  }
};
