import React, {useEffect, useState, useContext, useRef} from 'react';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import * as mutations from '../../../graphql/mutations';
import * as queries from '@graphql/queries';
import Selector from '../../Atoms/Form/Selector';
import DateAndTime from '../DateAndTime/DateAndTime';
import {getAsset} from '../../../assets';
import useDictionary from '../../../customHooks/dictionary';
import {v4 as uuidv4} from 'uuid';
import {Storage} from 'aws-amplify';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {FaSpinner} from 'react-icons/fa';
import Papa from 'papaparse';
import * as customQueries from '../../../customGraphql/customQueries';
interface ICsvProps {
  institutionId?: string;
}

const UploadCsv = ({institutionId}: ICsvProps) => {
  const {state, theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [file, setFile] = useState<any>(null);
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [selectedReason, setSelectedReason] = useState<{
    id: number;
    name: string;
    value: string;
  }>({
    id: 0,
    name: '',
    value: '',
  });
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [newUniversalSurveyData, setNewUniversalSurveyData] = useState<string[]>([]);
  const [demographicsData, setDemographicsData] = useState<any[]>([]);
  const [newDemographicsData, setNewDemographicsData] = useState<string[]>([]);

  const [imgUrl, setImgUrl] = useState<string[] | Object[]>([]);

  const fileReader = new FileReader();
  const fileInputRef = useRef<HTMLInputElement>();
  const csvInputRef = useRef<HTMLInputElement>();

  const reasonDropdown = [
    {
      id: 1,
      name: 'Paper Survey',
      value: 'paper-survey',
    },
    {
      id: 2,
      name: 'User Update Survey',
      value: 'user-update',
    },
  ];

  const isSuperAdmin = state.user.role === 'SUP';

  const _UploadToS3 = async (
    imageFile: File,
    imageFileName: string,
    imageFileType: string
  ) => {
    try {
      const FileUpload = await Storage.put(imageFileName, imageFile, {
        contentType: imageFileType,
        contentEncoding: 'base64',
        completeCallback: (event: any) => {
          console.log(`Successfully uploaded ${event.key}`);
        },
        progressCallback: (progress: any) => {
          console.log(`Uploaded: ${progress.loaded * 100}/${progress.total}`);
        },
        errorCallback: (err: any) => {
          console.error('Unexpected error while uploading', err);
        },
      });

      return FileUpload;
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 81 ~ UploadCsv ~ error', error);
    }
  };

  const _GetUrlFromS3 = async (key: string) => {
    try {
      const getFileURL = await Storage.get(key, {
        level: 'public',
      });
      return getFileURL;
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 92 ~ const_GetUrlFromS3= ~ error',
        error
      );
    }
  };

  const listQuestions = async (lessonId: string) => {
    try {
      let universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId,
        })
      );
      let lessonObject = universalLesson.data.getUniversalLesson;
      let questionsListdata = await getQuestionListFromLesson(lessonObject);
      let questionList = questionsListdata.questionList;
      // console.log('questionList', questionList)
      let questions: any = [];
      if (questionList) {
        questionList.map((listItem: any) => {
          listItem.map((item: any) => {
            questions.push({
              question: {
                id: item.questionID,
                question: item.questionString,
                type: item.type,
                options: item.options,
              },
            });
          });
        });
      }

      setSurveyQuestions(questions);
      return questions;
    } catch (err) {
      console.log('list questions error', err);
    }
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
                                options: partContentSub.options,
                              },
                            ],
                          };
                        },
                        {pgInput: []}
                      );

                      return {
                        pageInputAcc: [
                          ...partInputAcc.pageInputAcc,
                          ...formSubInputs.pgInput,
                        ],
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
                            options: partContent.options,
                          },
                        ],
                      };
                    } else {
                      return partInputAcc;
                    }
                  },
                  {pageInputAcc: []}
                );

                return {
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc,
                  ],
                };
              } else {
                return pageInputsAcc;
              }
            },
            {pageInputAcc: []}
          );

          return {
            questionList: [...inputs.questionList, reducedPageInputs.pageInputAcc],
          };
        },

        {questionList: []}
      );
      return mappedPages;
    }
  };

  const handleUpload = async (e: any) => {
    try {
      setFile(null);
      setSurveyData([]);
      setNewUniversalSurveyData([]);
      setFile(e.target.files[0]);
      let surveyQuestionOptions: any = {};
      fileReader.onload = async (event: any) => {
        const result: any = Papa.parse(event.target.result, {header: true});
        const listOptionsId = await listQuestions(result.data[0].SurveyID);
        listOptionsId.map((ques: any) => {
          return (surveyQuestionOptions[ques.question.id] = ques.question.options);
        });
        result.data.forEach(async (item: any) => {
          for (let [key, value] of Object.entries(item)) {
            if (key === 'UniversalSurveyStudentID' && value !== 'Not-taken-yet') {
              const getUniversalSurveyStudent: any = await API.graphql(
                graphqlOperation(queries.getUniversalSurveyStudentData, {
                  id: value,
                })
              );
              const returnedData =
                getUniversalSurveyStudent.data.getUniversalSurveyStudentData;
              let input: any = {
                lessonID: '',
                studentAuthID: '',
                studentEmail: '',
                syllabusLessonID: '',
                UniversalSurveyStudentID: '',
                surveyData: [],
              };
              for (let [key, value] of Object.entries(item)) {
                const surveyDomId = key.split('-s-')[1];
                if (surveyDomId) {
                  const findSurveyDatabasedonDomId = returnedData.surveyData.filter(
                    (item: any) => item.domID === surveyDomId
                  );

                  const updateSurveyInput = findSurveyDatabasedonDomId.find(
                    (item: any) => {
                      let selectedOption = surveyQuestionOptions[surveyDomId].filter(
                        (option: any) => {
                          return option.text === value;
                        }
                      );
                      if (selectedOption.length > 0 && item.domID === surveyDomId) {
                        return (item.input = [selectedOption[0].id]);
                      } else {
                        return (item.input = [value]);
                      }
                    }
                  );

                  input = {
                    UniversalSurveyStudentID: returnedData.id,
                    lessonID: item.SurveyID,
                    syllabusLessonID: item.UnitID,
                    surveyData: [...input.surveyData, updateSurveyInput],
                  };

                  setSurveyData((prev: any) => {
                    return [...prev, input];
                  });
                }
              }
            } else if (key === 'UniversalSurveyStudentID' && value === 'Not-taken-yet') {
              let input: any = {
                lessonID: '',
                studentAuthID: '',
                studentEmail: '',
                syllabusLessonID: '',
                surveyData: [],
              };
              for (let [key, value] of Object.entries(item)) {
                let surveyDomId = key.split('-s-')[1];

                if (surveyDomId) {
                  let selectedOption = surveyQuestionOptions[surveyDomId].filter(
                    (option: any) => {
                      return option.text === value;
                    }
                  );
                  input = {
                    lessonID: item.SurveyID,
                    studentAuthID: item.AuthId,
                    studentEmail: item.Email,
                    syllabusLessonID: item.UnitID,
                    surveyData: [
                      ...input.surveyData,
                      {
                        domID: surveyDomId,
                        input:
                          selectedOption.length > 0 ? [selectedOption[0].id] : [value],
                        options: null,
                        hasTakenSurvey: !value ? false : true,
                      },
                    ],
                  };
                }
              }
              setNewUniversalSurveyData((prev: any) => {
                return [...prev, input];
              });
            } else if (key === 'DemographicsDataID' && value !== 'No-demographics-data') {
              const getDemographicsData: any = await API.graphql(
                graphqlOperation(queries.getQuestionData, {
                  id: value,
                })
              );
              let input: any = {
                questionDataId: '',
                responseObject: [],
              };
              const returnedData = getDemographicsData.data.getQuestionData;
              for (let [key, value] of Object.entries(item)) {
                const demographicsQuesId = key.split('-d-')[1]?.split(' ')[0];
                if (demographicsQuesId) {
                  const findDemographicsQuesIdResponse = returnedData.responseObject.filter(
                    (item: any) => item.qid === demographicsQuesId
                  );
                  const updateDemographicsQuesResponse = findDemographicsQuesIdResponse.find(
                    (item: any) => {
                      if (item.qid === demographicsQuesId) {
                        item.response = [value];
                        return true;
                      }
                    }
                  );

                  input = {
                    questionDataId: returnedData.id,
                    responseObject: [
                      ...input.responseObject,
                      updateDemographicsQuesResponse,
                    ],
                  };

                  setDemographicsData((prev: any) => {
                    return [...prev, input];
                  });
                }
              }
            } else if (key === 'DemographicsDataID' && value === 'No-demographics-data') {
              let input: any = {
                authId: '',
                email: '',
                syllabusLessonID: '',
                responseObject: [],
              };
              for (let [key, value] of Object.entries(item)) {
                const demographicsQuesId = key.split('-d-')[1]?.split(' ')[0];
                if (demographicsQuesId) {
                  input = {
                    authId: item.AuthId,
                    email: item.Email,
                    syllabusLessonID: item.UnitID,
                    responseObject: [
                      ...input.responseObject,
                      {
                        qid: demographicsQuesId,
                        response: [value],
                        demographicsUpdated: !value ? false : true,
                      },
                    ],
                  };
                }
              }
              setNewDemographicsData((prev: any) => {
                return [...prev, input];
              });
            }
          }
        });
      };
      fileReader.readAsText(e.target.files[0]);
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 39 ~ handleUpload ~ error', error);
    }
  };

  const createTempSurveyData = async (SurveyId: string, surveyData: string[]) => {
    try {
      const value = {
        id: uuidv4(),
        updatedUserId: state.user.authId,
        universalSurveyId: SurveyId,
        surveyData: surveyData,
      };

      const newSurveyData: any = await API.graphql(
        graphqlOperation(mutations.createTemporaryUniversalUploadSurveyData, {
          input: value,
        })
      );

      const returnedData = newSurveyData.data.createTemporaryUniversalUploadSurveyData;

      return returnedData;
    } catch (e) {
      console.error('error creating survey data - ', e);
      return {};
    }
  };

  const createTempDemographicsData = async (demoTempID: any, responseObject: any[]) => {
    try {
      const value = {
        id: uuidv4(),
        updatedUserId: state.user.authId,
        questionDataID: demoTempID,
        responseObject: responseObject,
      };

      const newDemographicsData: any = await API.graphql(
        graphqlOperation(mutations.createTemporaryDemographicsUploadData, {
          input: value,
        })
      );

      const returnedData = newDemographicsData.data.createTemporaryDemographicsUploadData;

      return returnedData;
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 447 ~ createTempDemographicsData ~ error',
        error
      );
    }
  };

  const createUploadLogs = async (
    surveyTempID: any,
    demoTempID: any,
    updateType: any,
    unitID: any,
    lessonID: any
  ) => {
    try {
      const value = {
        id: uuidv4(),
        ...(surveyTempID !== '' && {TemporaryUniversalUploadSurveyDataID: surveyTempID}),
        ...(demoTempID !== '' && {TemporaryDemographicsUploadDataID: demoTempID}),
        User_id: state.user.authId,
        Unit_id: unitID,
        lesson_id: lessonID,
        Date: new Date().toISOString().split('T')[0],
        UploadType: selectedReason.value,
        updateType: updateType,
        ...(imgUrl && {PaperSurveyURL: imgUrl}),
        Reason: reason,
      };

      const newUploadLogs: any = await API.graphql(
        graphqlOperation(mutations.createUploadLogs, {
          input: value,
        })
      );

      const returnedData = newUploadLogs.data.createUploadLogs;

      return returnedData;
    } catch (e) {
      console.error('error creating upload logs - ', e);
      return {};
    }
  };

  const handleSurveyExistingUpload = async () => {
    try {
      let index = [],
        data: any = [];
      for (let i = surveyData.length - 1; i >= 0; i--) {
        if (index.indexOf(surveyData[i].UniversalSurveyStudentID) === -1) {
          index.push(surveyData[i].UniversalSurveyStudentID);
          data.unshift(surveyData[i]);
        }
      }
      data.forEach(async (item: any) => {
        const updateData: any = await API.graphql(
          graphqlOperation(mutations.updateUniversalSurveyStudentData, {
            input: {
              id: item.UniversalSurveyStudentID,
              surveyData: item.surveyData,
            },
          })
        );
        if (updateData) {
          const createTempSurveyresult = await createTempSurveyData(
            updateData.data.updateUniversalSurveyStudentData.id,
            item.surveyData
          );

          createTempSurveyresult &&
            (await createUploadLogs(
              createTempSurveyresult.id,
              '',
              'SURVEY_DATA_UPDATE',
              updateData.data.updateUniversalSurveyStudentData.syllabusLessonID,
              updateData.data.updateUniversalSurveyStudentData.lessonID
            ));
        }
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 169 ~ handleExistingUpload ~ error',
        error
      );
    }
  };

  const handleNewSurveyUniversalUpload = async () => {
    try {
      const changedSurveyData = newUniversalSurveyData.filter((data: any) => {
        return data.surveyData.some((sData: any) => {
          return sData.hasTakenSurvey === true;
        });
      });
      changedSurveyData.forEach(async (item: any) => {
        const createData: any = await API.graphql(
          graphqlOperation(mutations.createUniversalSurveyStudentData, {
            input: {
              lessonID: item.lessonID,
              studentAuthID: item.studentAuthID,
              studentEmail: item.studentEmail,
              studentID: item.studentAuthID,
              syllabusLessonID: item.syllabusLessonID,
              surveyData: item.surveyData,
            },
          })
        );
        if (createData) {
          const createTempSurveyresult = await createTempSurveyData(
            createData.data.createUniversalSurveyStudentData.id,
            item.surveyData
          );
          createTempSurveyresult &&
            (await createUploadLogs(
              createTempSurveyresult.id,
              '',
              'SURVEY_DATA_UPDATE',
              item.syllabusLessonID,
              item.lessonID
            ));
        }
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 172 ~ handleUniversalUpload ~ error',
        error
      );
    }
  };

  const handleDemographicsExistingUpload = async () => {
    try {
      let index = [],
        data: any = [];
      for (let i = demographicsData.length - 1; i >= 0; i--) {
        if (index.indexOf(demographicsData[i].questionDataId) === -1) {
          index.push(demographicsData[i].questionDataId);
          data.unshift(demographicsData[i]);
        }
      }

      data.forEach(async (item: any) => {
        const updateDemographicsData: any = await API.graphql(
          graphqlOperation(mutations.updateQuestionData, {
            input: {
              id: item.questionDataId,
              responseObject: item.responseObject,
            },
          })
        );

        if (updateDemographicsData) {
          const createTempDemographicsDataResult = await createTempDemographicsData(
            updateDemographicsData.data.updateQuestionData.id,
            item.responseObject
          );
          createTempDemographicsDataResult &&
            (await createUploadLogs(
              '',
              createTempDemographicsDataResult.id,
              'DEMOGRAPHIC_DATA_UPDATE',
              updateDemographicsData.data.updateQuestionData.syllabusLessonID,
              updateDemographicsData.data.updateQuestionData.lessonID
            ));
        }
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 575 ~ handleDemographicsExistingUpload ~ error',
        error
      );
    }
  };

  const handleDemographicsNewUpload = async () => {
    try {
      const changedDemographicsUpdatedData = newDemographicsData.filter((data: any) => {
        return data.responseObject.some((dData: any) => {
          return dData.demographicsUpdated === true;
        });
      });
      changedDemographicsUpdatedData.forEach(async (item: any) => {
        const createCheckpointData: any = await API.graphql(
          graphqlOperation(mutations.createCheckpoint, {
            input: {
              label: 'IA1',
              type: 'profile',
              title: 'Profile Details',
              stage: 'checkpoint',
            },
          })
        );
        if (createCheckpointData) {
          const createDemographicsQuestionData: any = await API.graphql(
            graphqlOperation(mutations.createQuestionData, {
              input: {
                authID: item.authId,
                checkpointID: createCheckpointData.data.createCheckpoint.id,
                email: item.email,
                responseObject: item.responseObject,
                syllabusLessonID: '999999',
              },
            })
          );
          if (createDemographicsQuestionData) {
            const createTempDemographicsDataResult = await createTempDemographicsData(
              createDemographicsQuestionData.data.createQuestionData.id,
              item.responseObject
            );
            createTempDemographicsDataResult &&
              (await createUploadLogs(
                '',
                createTempDemographicsDataResult.id,
                'DEMOGRAPHIC_DATA_UPDATE',
                createDemographicsQuestionData.data.createQuestionData.syllabusLessonID,
                createDemographicsQuestionData.data.createQuestionData.lessonID
              ));
          }
        }
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: UploadCSV.tsx ~ line 575 ~ handleDemographicsNewUpload ~ error',
        error
      );
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setLoading(true);
      await handleSurveyExistingUpload();
      await handleNewSurveyUniversalUpload();
      await handleDemographicsExistingUpload();
      await handleDemographicsNewUpload();
      setSelectedReason({
        id: 0,
        name: '',
        value: '',
      });
      setImgUrl([]);
      csvInputRef.current.value = '';
      setFile(null);
      setReason('');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 4000);
    } catch (error) {
      console.log('🚀 ~ file: UploadCSV.tsx ~ line 38 ~ handleSubmit ~ error', error);
    }
  };

  const onReasonSelected = (id: any, name: string, value: string) => {
    let reasonDropdownValue = {id, name, value};
    setSelectedReason(reasonDropdownValue);
  };

  const imageUpload = async (e: any) => {
    setLoading(true);
    try {
      e.preventDefault();
      let imgArr = fileInputRef.current.files;
      for (let i = 0; i < imgArr.length; i++) {
        const file = imgArr[i];
        const fileName = file.name;
        const fileType = file.type;
        const fileUpload: any = await _UploadToS3(file, fileName, fileType);
        const fileUrl = await _GetUrlFromS3(fileUpload.key);
        setImgUrl((prevState: any) => [...prevState, fileUrl]);
      }
      setLoading(false);
    } catch (e) {
      console.log('error uploading image', e);
    }
  };

  return (
    <div className="flex flex-col overflow-h-scroll w-full h-full px-8 py-4">
      <div className="mx-auto w-full">
        <div className="flex flex-row my-0 w-full py-0 mb-8 justify-between">
          <h3 className="text-lg leading-6 text-gray-600 w-auto">
            {CsvDict[userLanguage]['TITLE']}
          </h3>
          {/* <div className={`border-l-6 pl-4 ${theme.verticalBorder[themeColor]}`}>
            <span>{CsvDict[userLanguage]['TITLE']}</span>
          </div> */}
          <div className="w-auto">
            <span className={`mr-0 float-right text-gray-600 text-right`}>
              <DateAndTime />
            </span>
          </div>
        </div>
      </div>
      <input
        id="csvFile"
        type="file"
        accept=".csv,.xlsx,.xls"
        ref={csvInputRef}
        onChange={handleUpload}
      />
      <br />
      <Selector
        btnClass={!file && 'cursor-not-allowed'}
        disabled={!file}
        loading={loading}
        selectedItem={selectedReason ? selectedReason.name : ''}
        placeholder="Select Reason"
        list={reasonDropdown}
        onChange={(value, name, id) => onReasonSelected(id, name, value)}
      />
      <br />
      {selectedReason.value === 'paper-survey' && (
        <>
          <label htmlFor="imgFile">Upload Multipe Survey Images</label>
          <input
            id="imgFile"
            multiple
            className="mt-2"
            type="file"
            disabled={!file}
            accept="image/*"
            ref={fileInputRef}
            onChange={imageUpload}
          />
          {loading && (
            <IconContext.Provider
              value={{
                size: '1.2rem',
                style: {
                  left: '-25%',
                  top: '-5%',
                },
                className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`,
              }}>
              <FaSpinner />
            </IconContext.Provider>
          )}
        </>
      )}
      <br />
      <textarea
        className={`w-full h-32 border-2 border-gray-300 rounded-lg ${
          (!file || loading || !selectedReason.value) && `cursor-not-allowed`
        }`}
        placeholder={'Reason'}
        rows={10}
        cols={50}
        value={reason}
        disabled={!file || loading || !selectedReason.value}
        onChange={(e: any) => setReason(e.target.value)}
      />
      {success && (
        <div className="flex flex-row mt-2 justify-center">
          <h2>Successfully Uploaded!</h2>
        </div>
      )}
      <div className="grid grid-cols-4 gap-x-4 mt-3">
        <button
          type="button"
          className={`col-end-5 ${
            isSuperAdmin ? 'mt-5' : ''
          } inline-flex justify-center h-9 border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo transition duration-150 ease-in-out items-center ${
            !reason && `cursor-not-allowed`
          }`}
          style={{
            /* stylelint-disable */
            opacity: reason ? 1 : 0.5,
          }}
          disabled={!reason || loading || !selectedReason.value}
          onClick={(e) => handleSubmit(e)}>
          Upload CSV
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export default React.memo(UploadCsv);
