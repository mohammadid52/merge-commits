import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Buttons from '@components/Atoms/Buttons';
import FormInput from '@components/Atoms/Form/FormInput';
import {logError, uploadImageToS3} from '@graphql/functions';
import {getAsset, XLSX_TO_CSV_URL} from 'assets';

import UploadButton from '@components/Atoms/Form/UploadButton';
import Modal from '@components/Atoms/Modal';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import useAuth from '@customHooks/useAuth';
import {Transition} from '@headlessui/react';
import {getExtension} from '@utilities/functions';
import {getImageFromS3Static} from '@utilities/services';
import {CreateUploadLogsInput} from 'API';
import Selector from 'atoms/Form/Selector';
import {Storage} from 'aws-amplify';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {uniqBy} from 'lodash';
import Papa from 'papaparse';
import React, {useContext, useEffect, useRef, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {RiErrorWarningLine} from 'react-icons/ri';
import {v4 as uuidv4} from 'uuid';
import {removeDuplicates} from './Csv';
interface ICsvProps {
  institutionId?: string;
}

const DataValue = ({
  title,
  content
}: {
  title: string;
  content: string | React.ReactNode;
}) => {
  return (
    <div className="w-auto flex mb-2 flex-col items-start justify-start">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="text-dark-gray font-medium text-left w-auto text-sm">{content}</div>
    </div>
  );
};

const FieldValue = ({field, value}: {field: string; value: string}) => {
  return (
    <div className="w-auto flex items-center justify-start text-sm">
      <div className="w-auto text-gray-700 mr-2">{field}: </div>
      <div className="w-auto text-gray-700 font-medium">{value}</div>
    </div>
  );
};

const UploadCsv = ({institutionId}: ICsvProps) => {
  const {state, theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {CsvDict, Institute_info} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [file, setFile] = useState<any>(null);
  const [reason, setReason] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const [selectedReason, setSelectedReason] = useState<{
    id: number;
    name: string;
    value: string;
  }>({
    id: 0,
    name: '',
    value: ''
  });
  const [surveyData, setSurveyData] = useState<any[]>([]);

  const [newUniversalSurveyData, setNewUniversalSurveyData] = useState<string[]>([]);

  const [demographicsData, setDemographicsData] = useState<any[]>([]);

  const [newDemographicsData, setNewDemographicsData] = useState<string[]>([]);

  const fileReader = new FileReader();
  const fileInputRef = useRef<HTMLInputElement>();
  const csvInputRef = useRef<HTMLInputElement>();

  const reasonDropdown = [
    {
      id: 1,
      name: 'Paper Survey',
      value: 'paper-survey'
    },
    {
      id: 2,
      name: 'User Update Survey',
      value: 'user-update'
    }
  ];

  const _GetUrlFromS3 = async (key: string): Promise<string> => {
    try {
      const getFileURL = await Storage.get(key, {
        level: 'public'
      });
      return getFileURL.toString();
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @_GetUrlFromS3');

      console.error(
        '🚀 ~ file: UploadCSV.tsx ~ line 92 ~ const_GetUrlFromS3= ~ error',
        error
      );
    }
  };

  const listQuestions = async (lessonId: string) => {
    try {
      let universalLesson: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId
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
                options: item.options
              }
            });
          });
        });
      }

      return questions;
    } catch (err) {
      logError(err, {authId, email}, 'UploadCSV @listQuestions');
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
                  pageInputAcc: [
                    ...pageInputsAcc.pageInputAcc,
                    ...partInputs.pageInputAcc
                  ]
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

  const customParse = (data: any[]) => {
    if (data[0][0] !== 'AuthId') {
      setError('Invalid formatted header.. Make sure header has valid values');
      console.error('Invalid formatted header.. Make sure header has valid values');
      return;
    } else {
      const headers: any = {};

      data[0].forEach((header: string) => {
        headers[header] = [];
      });

      const keys = Object.keys(headers);

      data.slice(1, data.length).forEach((row) => {
        row.forEach((value: string, index2: number) => {
          headers[keys[index2]] = [...headers[keys[index2]], value || '-'];
        });
      });

      return headers;
    }
  };

  const ussIDAndTakenSurvey = async (
    value: string,
    surveyQuestionOptions: any,
    parsed: any,
    index: number,
    keyName: string
  ) => {
    const getUniversalSurveyStudent: any = await API.graphql(
      graphqlOperation(queries.getUniversalSurveyStudentData, {
        id: value
      })
    );
    const returnedData = getUniversalSurveyStudent.data.getUniversalSurveyStudentData;
    let input: any = {
      lessonID: '',
      studentAuthID: '',
      studentEmail: '',
      syllabusLessonID: '',
      UniversalSurveyStudentID: '',
      surveyData: []
    };

    Object.keys(parsed).forEach((keyName) => {
      let surveyDomId = keyName?.split('-s-')[1];

      if (surveyDomId) {
        const findSurveyDatabasedonDomId = returnedData.surveyData.filter(
          (item: any) => item.domID === surveyDomId
        );

        const updateSurveyInput = findSurveyDatabasedonDomId.find((item: any) => {
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
        });

        input = {
          UniversalSurveyStudentID: returnedData.id,
          lessonID: parsed['SurveyID'][index],
          syllabusLessonID: parsed['SurveyID'][index],
          surveyData: [...input.surveyData, updateSurveyInput]
        };

        setSurveyData((prev: any) => {
          return [...prev, input];
        });
      }
    });
  };

  const ussIdAndNotTakenSurvey = async (
    value: string,
    surveyQuestionOptions: any,
    parsed: any,
    index: number,
    keyName: string
  ) => {
    let input: any = {
      lessonID: '',
      studentAuthID: '',
      studentEmail: '',
      syllabusLessonID: '',
      surveyData: []
    };

    Object.keys(parsed).forEach((keyName) => {
      let surveyDomId = keyName?.split('-s-')[1];

      if (surveyDomId) {
        let selectedOption = surveyQuestionOptions[surveyDomId].filter((option: any) => {
          return option.text === value;
        });

        input = {
          lessonID: parsed['SurveyID'][index],
          studentAuthID: parsed['AuthId'][index],
          studentEmail: parsed['Email'][index],
          syllabusLessonID: parsed['UnitID'][index],
          surveyData: [
            ...input.surveyData,
            {
              domID: surveyDomId,
              input: selectedOption.length > 0 ? [selectedOption[0].id] : [value],
              options: null,
              hasTakenSurvey: !value ? false : true
            }
          ]
        };
      }
    });

    setNewUniversalSurveyData((prev: any) => {
      return [...prev, input];
    });
  };

  const ddIDAndDemographicData = async (value: string, parsed: any, index2: number) => {
    const getDemographicsData: any = await API.graphql(
      graphqlOperation(queries.getQuestionData, {
        id: value
      })
    );
    let input: any = {
      questionDataId: '',
      responseObject: []
    };
    const returnedData = getDemographicsData.data.getQuestionData;

    Object.keys(parsed).forEach((keyName) => {
      let demographicsQuesId = keyName.split('-d-')[1]?.split(' ')[0];

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
          responseObject: [...input.responseObject, updateDemographicsQuesResponse]
        };

        setDemographicsData((prev: any) => {
          return [...prev, input];
        });
      }
    });
  };

  const ddIDAndNotDemographicData = async (
    value: string,
    parsed: any,
    index: number,
    index2: number
  ) => {
    let input: any = {
      authId: '',
      email: '',
      syllabusLessonID: '',
      responseObject: []
    };
    Object.keys(parsed).forEach((keyName) => {
      let demographicsQuesId = keyName.split('-d-')[1]?.split(' ')[0];
      if (demographicsQuesId) {
        input = {
          authId: parsed['AuthId'][index],
          email: parsed['Email'][index],
          syllabusLessonID: parsed['UnitID'][index],
          responseObject: [
            ...input.responseObject,
            {
              qid: demographicsQuesId,
              response: [value],
              demographicsUpdated: !value ? false : true
            }
          ]
        };
      }
    });
    setNewDemographicsData((prev: any) => {
      return [...prev, input];
    });
  };

  const [isMapping, setIsMapping] = useState(false);

  const [error, setError] = useState(null);

  const {authId, isTeacher, isFellow, email} = useAuth();

  const INITIAL_MODAL_STATE = {
    show: false,
    element: <div />,
    title: '',
    saveAction: () => {},
    saveLabel: '',
    closeLabel: ''
  };
  const [showModal, setShowModal] = useState(INITIAL_MODAL_STATE);
  const clearModal = () => setShowModal(INITIAL_MODAL_STATE);

  const resetFile = () => {
    setFile(null);
    setSurveyData([]);
    setNewUniversalSurveyData([]);
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const ext = getExtension(file.name);

    if (ext === 'csv') {
      clearModal();
      try {
        let surveyQuestionOptions: any = {};
        fileReader.onload = async (event: any) => {
          setIsMapping(true);
          const result: any = Papa.parse(event.target.result);

          const parsed = customParse(result.data);

          const surveyID = parsed['SurveyID'][0];
          const unitID = parsed['UnitID'][0];
          const classroomName = parsed['Classroom'][0];

          if (
            surveyID !== selectedSurvey?.id ||
            unitID !== selectedUnit?.id ||
            classroomName !== selectedClassRoom?.name
          ) {
            resetFile();
            setIsMapping(false);
            setShowModal({
              show: true,
              title: 'Confirm File',
              element: (
                <div>
                  <p className="p-4 text-sm text-gray-700">
                    Selected file does not match target survey
                  </p>
                </div>
              ),

              saveAction: null,
              saveLabel: '',
              closeLabel: ''
            });
            return;
          } else if (surveyID && unitID && classroomName) {
            resetFile();
            setFile(file);
            let listOptionsId = await listQuestions(surveyID);
            listOptionsId &&
              listOptionsId.length > 0 &&
              listOptionsId.forEach((ques: any) => {
                return (surveyQuestionOptions[ques.question.id] = ques.question.options);
              });

            Object.keys(parsed).forEach((keyName, index2: number) => {
              const valueArray = parsed[keyName];

              valueArray.forEach(async (value: string, index: number) => {
                if (keyName === 'UniversalSurveyStudentID' && value !== 'Not-taken-yet') {
                  //
                  ussIDAndTakenSurvey(
                    value,
                    surveyQuestionOptions,
                    parsed,
                    index,
                    keyName
                  );
                } else if (
                  keyName === 'UniversalSurveyStudentID' &&
                  value === 'Not-taken-yet'
                ) {
                  //
                  ussIdAndNotTakenSurvey(
                    value,
                    surveyQuestionOptions,
                    parsed,
                    index,
                    keyName
                  );
                } else if (
                  keyName === 'DemographicsDataID' &&
                  value !== 'No-demographics-data'
                ) {
                  ddIDAndDemographicData(value, parsed, index2);
                  // }
                } else if (
                  keyName === 'DemographicsDataID' &&
                  value === 'No-demographics-data'
                ) {
                  ddIDAndNotDemographicData(value, parsed, index, index2);
                }
              });
            });

            setIsMapping(false);
          }
        };
        fileReader.readAsText(file);
      } catch (error) {
        logError(error, {authId, email}, 'UploadCSV @handleUpload');

        setError('Something went wrong!');

        console.error('🚀 ~ file: UploadCSV.tsx ~ line 39 ~ handleUpload ~ error', error);
      } finally {
      }
    } else if (ext === 'xlsx') {
      setShowModal({
        show: true,
        title: 'Not supported',
        saveLabel: 'Convert file',
        closeLabel: 'Cancel',
        saveAction: () => {
          window.location.replace(XLSX_TO_CSV_URL);
        },
        element: (
          <div className="flex flex-col justify-center items-center gap-y-4">
            <RiErrorWarningLine fontSize={'4rem'} className="text-yellow-500 animate-y" />
            <p className="text-gray-600 pt-0 p-4 text-center">
              xlsx file is not supported. Please convert it to csv file and then try
              again.
            </p>
          </div>
        )
      });
    }
  };

  const createTempSurveyData = async (SurveyId: string, surveyData: string[]) => {
    try {
      const value = {
        id: uuidv4(),
        updatedUserId: state.user.authId,
        universalSurveyId: SurveyId,
        surveyData: surveyData
      };

      const newSurveyData: any = await API.graphql(
        graphqlOperation(mutations.createTemporaryUniversalUploadSurveyData, {
          input: value
        })
      );

      const returnedData = newSurveyData.data.createTemporaryUniversalUploadSurveyData;

      return returnedData;
    } catch (e) {
      logError(e, {authId, email}, 'UploadCSV @createTempSurveyData');
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
        responseObject: responseObject
      };

      const newDemographicsData: any = await API.graphql(
        graphqlOperation(mutations.createTemporaryDemographicsUploadData, {
          input: value
        })
      );

      const returnedData = newDemographicsData.data.createTemporaryDemographicsUploadData;

      return returnedData;
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @createTempDemographicsData');
      console.error(
        '🚀 ~ file: UploadCSV.tsx ~ line 447 ~ createTempDemographicsData ~ error',
        error
      );
    }
  };

  // this will create single upload log
  const createUploadLog = async (csvUrl: string) => {
    try {
      let input: CreateUploadLogsInput = {
        id: uuidv4(),
        User_id: state.user.authId,
        Unit_id: selectedUnit.id,
        lesson_id: selectedSurvey.id,
        Date: new Date().toISOString().split('T')[0],
        UploadType: selectedReason.value,
        room_id: selectedClassRoom.id,
        // PaperSurveyURL: imgUrl as string[],
        Reason: reason,
        urlLink: csvUrl,
        authID: authId,
        email
      };

      const newUploadLogs: any = await API.graphql(
        graphqlOperation(customMutations.createUploadLogs, {
          input: input
        })
      );

      const returnedData = newUploadLogs.data.createUploadLogs;

      return returnedData;
    } catch (e) {
      console.error('error creating upload logs - ', e);
      logError(e, {authId, email}, 'UploadCSV @createUploadLogs');
      return {};
    }
  };

  const handleSurveyExistingUpload = async () => {
    try {
      let index = [],
        data: any[] = [];
      for (let i = surveyData.length - 1; i >= 0; i--) {
        if (index.indexOf(surveyData[i].UniversalSurveyStudentID) === -1) {
          index.push(surveyData[i].UniversalSurveyStudentID);
          data.unshift(surveyData[i]);
        }
      }

      data.forEach(async (item: any) => {
        // const createTempSurveyresult = await createTempSurveyData(
        //   item.UniversalSurveyStudentID,
        //   item.surveyData
        // );

        // createTempSurveyresult &&

        const updateData: any = await API.graphql(
          graphqlOperation(mutations.updateUniversalSurveyStudentData, {
            input: {
              id: item.UniversalSurveyStudentID,
              surveyData: item.surveyData
            }
          })
        );
      });
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @handleSurveyExistingUpload');
      console.error(
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
              surveyData: item.surveyData
            }
          })
        );
        if (createData) {
          // const createTempSurveyresult = await createTempSurveyData(
          //   createData.data.createUniversalSurveyStudentData.id,
          //   item.surveyData
          // );
          // createTempSurveyresult &&
        }
      });
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @handleNewSurveyUniversalUpload');
      console.error(
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
        // const createTempDemographicsDataResult = await createTempDemographicsData(
        //   item.questionDataId,
        //   item.responseObject
        // );
        // createTempDemographicsDataResult &&

        const updateDemographicsData: any = await API.graphql(
          graphqlOperation(mutations.updateQuestionData, {
            input: {
              id: item.questionDataId,
              responseObject: item.responseObject
            }
          })
        );
      });
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @handleDemographicsExistingUpload');
      console.error(
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
              stage: 'checkpoint'
            }
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
                syllabusLessonID: '999999'
              }
            })
          );
          if (createDemographicsQuestionData) {
            // const createTempDemographicsDataResult = await createTempDemographicsData(
            //   createDemographicsQuestionData.data.createQuestionData.id,
            //   item.responseObject
            // );
            // createTempDemographicsDataResult &&
          }
        }
      });
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @handleDemographicsNewUpload');
      console.error(
        '🚀 ~ file: UploadCSV.tsx ~ line 575 ~ handleDemographicsNewUpload ~ error',
        error
      );
    }
  };

  const [uploadingCSV, setUploadingCSV] = useState(false);

  const showModalWhenUploadCsv = (e: any) => {
    setShowModal({
      show: true,
      title: 'Confirmation',
      element: (
        <div>
          <p className="text-gray-700 text-sm p-4">
            Please confirm column headers and tab names have not been modified
          </p>
        </div>
      ),
      saveLabel: 'Confirm',
      closeLabel: 'Cancel',
      saveAction: () => {
        clearModal();
        handleSubmit(e);
      }
    });
  };

  const CSV_KEY = 'CSV';

  const uploadCsvToS3 = async () => {
    try {
      if (file) {
        const fileName = file.name;
        const fileType = file.type;
        const fileUpload: any = await uploadImageToS3(
          file,
          `${CSV_KEY}/${fileName}`,
          fileType
        );

        const fileUrl = await _GetUrlFromS3(fileUpload.key);

        return fileUrl;
      }
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'UploadCSV @uploadCsvToS3');
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.persist();
      e.preventDefault();
      setUploadingCSV(true);

      const csvUrl = await uploadCsvToS3();

      await createUploadLog(csvUrl);

      // await handleSurveyExistingUpload();
      // await handleNewSurveyUniversalUpload();
      // await handleDemographicsExistingUpload();
      // await handleDemographicsNewUpload();

      setSelectedReason({
        id: 0,
        name: '',
        value: ''
      });

      csvInputRef.current.value = '';
      setFile(null);
      setReason('');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 4500);
    } catch (error) {
      logError(error, {authId, email}, 'UploadCSV @handleSubmit');
      console.error('🚀 ~ file: UploadCSV.tsx ~ line 38 ~ handleSubmit ~ error', error);
    } finally {
      setUploadingCSV(false);
    }
  };

  const onReasonSelected = (id: any, name: string, value: string) => {
    let reasonDropdownValue = {id, name, value};
    setSelectedReason(reasonDropdownValue);
  };

  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const onChangeSurvey = (id: any, name: string, value: string) => {
    resetFile();
    let reasonDropdownValue = {id, name, value};
    setSelectedSurvey(reasonDropdownValue);
  };

  const [classRoomLoading, setClassRoomLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);

  const [instClassRooms, setInstClassRooms] = useState([]);
  const [classRoomsList, setClassRoomsList] = useState([]);

  const [units, setUnits] = useState([]);

  const fetchUnits = async (curriculumId: string) => {
    try {
      setUnitsLoading(true);
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          filter: {curriculumId: {eq: curriculumId}}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return {id: unitData.id, name: unitData.name, value: unitData.name};
      });
      // console.log('units', units)
      setUnits(units);

      // here we have curricularCheckpoints and use syllabusLessonId 999999 to fetch list of question data
    } catch (err) {
      console.log('fetch units (syllabus) error', err);
    } finally {
      setUnitsLoading(false);
    }
  };

  const insertExtraData = (cr: any) => {
    const teacherImage = getImageFromS3Static(cr?.teacher?.image);
    return {
      institutionName: cr?.institution?.name || '',
      teacher: {
        name: `${cr?.teacher?.firstName} ${cr?.teacher?.lastName}`,
        image: teacherImage
      },
      courseName: cr?.curricula?.items[0]?.curriculum?.name || '--',
      status: cr?.status,
      activeSyllabus: cr?.activeSyllabus
    };
  };

  const [activeUnits, setActiveUnits] = useState([]);

  const fetchActiveUnits = async (crList: any) => {
    const arrayOfActiveUnits = crList
      ?.filter((_c: {activeSyllabus: any}) => Boolean(_c?.activeSyllabus))
      .map((_c: {activeSyllabus: string | null}) => {
        if (_c?.activeSyllabus) return {unitId: {eq: _c.activeSyllabus}};
      });

    try {
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(customQueries.listUnits, {
          filter: {or: arrayOfActiveUnits}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units.map((syl: any) => {
        let unitData = syl.unit;
        return {id: unitData.id, name: unitData.name};
      });

      setActiveUnits(units);
    } catch (error) {
      console.error('error at fetchActiveUnits Csv.tsx', error);
    }
  };

  const fetchClassRooms = async () => {
    setClassRoomLoading(true);
    let instCRs: any = [];

    const variablesForTR_FR = {filter: {teacherAuthID: {eq: authId}}};
    const variablesForBLD_ADM = {};

    let classrooms: any = await API.graphql(
      graphqlOperation(
        customQueries.listRoomsDashboard,
        isTeacher || isFellow ? variablesForTR_FR : variablesForBLD_ADM
      )
    );
    let coTeahcerClassrooms: any = await API.graphql(
      graphqlOperation(
        customQueries.listRoomCoTeachers,
        isTeacher || isFellow ? variablesForTR_FR : variablesForBLD_ADM
      )
    );

    let coTeachersRooms = coTeahcerClassrooms?.data?.listRoomCoTeachers?.items.map(
      (item: any) => {
        if (item && item.room) {
          return {
            ...item,
            name: item.room.name,
            class: {id: item.room.classID},
            curricula: item?.curricula || {items: []}
          };
        }
      }
    );
    classrooms = [...coTeachersRooms, ...classrooms?.data.listRooms?.items] || [];
    classrooms = classrooms
      .map((cr: any) => {
        if (cr) {
          let curriculum =
            cr.curricula?.items &&
            Array.isArray(cr.curricula?.items) &&
            cr.curricula?.items.length > 0
              ? cr.curricula?.items[0].curriculum
              : null;

          !instCRs.find((d: any) => d.name === cr.name) &&
            instCRs.push({id: cr.id, name: cr.name, value: cr.name});

          return {
            id: cr.id,

            name: cr.name,
            value: cr.name,
            class: {...cr.class},
            curriculum,
            ...insertExtraData(cr)
          };
        }
      })
      .filter(Boolean);

    setClassRoomsList(classrooms);
    setInstClassRooms(removeDuplicates(instCRs));
    fetchActiveUnits(classrooms);

    setClassRoomLoading(false);
  };

  useEffect(() => {
    if (institutionId) {
      fetchClassRooms();
    }
  }, [institutionId]);

  const [selectedClassRoom, setSelectedClassRoom] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const [surveys, setSurveys] = useState([]);
  const [surveysLoading, setSurveysLoading] = useState(false);

  const fetchSurveys = async (unitId: string) => {
    setSurveysLoading(true);
    try {
      let syllabusLessons: any = await API.graphql(
        graphqlOperation(customQueries.listSurveys, {
          id: unitId
        })
      );
      syllabusLessons = syllabusLessons?.data.getUniversalSyllabus?.lessons?.items || [];
      let surveys: any = [];
      let syllabusLessonsData: any = [];
      syllabusLessons.filter((les: any) => {
        if (les.lesson && les.lesson.type === 'survey') {
          syllabusLessonsData.push({
            syllabusLessonID: les.id,
            lessonID: les.lessonID,
            lesson: les.lesson
          });
          surveys.push({
            id: les.lesson.id,
            name: les.lesson.title,
            value: les.lesson.title
          });
          return les.lesson;
        }
      });

      setSurveys(uniqBy(surveys, 'id'));
      setSurveysLoading(false);
    } catch (err) {
      console.error('fetch surveys list error', err);
    } finally {
      setSurveysLoading(false);
    }
  };

  const onClassRoomSelect = async (id: string, name: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = {id, name, value};
      resetFile();
      setSelectedClassRoom(cr);
      setUnits([]);
      setSelectedUnit(null);
      setSurveys([]);
      setSelectedSurvey(null);
      if (!sCR || sCR.id !== cr.id) {
        let classroom = classRoomsList.filter((c) => c.id === cr.id)[0];
        // with classroom => class and curriculum are directly selected
        setSelectedCurriculum(classroom?.curriculum);
        if (classroom?.curriculum?.id) {
          await fetchUnits(classroom?.curriculum?.id);
        }
        // units (syllabus fetched)
      } else {
        console.log('classroom already selected');
      }
    } catch (err) {
      console.log('on class room select', err);
    }
  };

  const [selectedUnit, setSelectedUnit] = useState(null);

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = {id, name, value};
    resetFile();
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
    setSurveys([]);
    setSelectedSurvey(null);
  };

  const [hoveringItem, setHoveringItem] = useState<{name?: string}>({});

  const currentSelectedClassroomData =
    hoveringItem &&
    hoveringItem?.name &&
    classRoomsList?.find((_c) => _c.name === hoveringItem?.name);

  const currentActiveUnit =
    currentSelectedClassroomData &&
    activeUnits.find((_d) => _d?.id === currentSelectedClassroomData?.activeSyllabus);

  return (
    <>
      {showModal.show && (
        <Modal
          showHeader
          title={showModal.title}
          closeAction={clearModal}
          saveAction={showModal.saveAction}
          closeOnBackdrop
          closeLabel={showModal.closeLabel}
          saveLabel={showModal.saveLabel}
          showFooter={Boolean(showModal.saveLabel && showModal.closeLabel)}>
          {showModal.element}
        </Modal>
      )}
      <div className="flex flex-col overflow-h-scroll w-full h-full px-8 py-4">
        <div className="mx-auto w-full">
          <div className="flex flex-row my-0 w-full py-0 justify-start">
            <div className="w-auto">
              <SectionTitleV3
                withButton={
                  <div className="w-auto flex items-center gap-x-4 ml-4">
                    <div className="w-auto relative">
                      <Selector
                        dataCy="upload-analytics-classroom"
                        loading={classRoomLoading}
                        selectedItem={selectedClassRoom ? selectedClassRoom.name : ''}
                        placeholder="select classroom"
                        width="w-64"
                        setHoveringItem={setHoveringItem}
                        list={instClassRooms}
                        onChange={(value, name, id) => {
                          setHoveringItem({});
                          onClassRoomSelect(id, name, value);
                        }}
                      />
                      {currentSelectedClassroomData && (
                        <ClickAwayListener onClickAway={() => setHoveringItem({})}>
                          <Transition
                            style={{
                              top: '0rem',
                              bottom: '1.5rem',
                              right: '-110%',
                              zIndex: 999999
                            }}
                            className="hidden md:block cursor-pointer select-none  absolute right-1 text-black "
                            show={Boolean(hoveringItem && hoveringItem.name)}>
                            <div className="bg-white flex flex-col border-gray-200 rounded-xl  customShadow border-0 p-4  min-w-70 max-w-70 w-auto">
                              <DataValue
                                title={'Institution Name'}
                                content={currentSelectedClassroomData?.institutionName}
                              />
                              <DataValue
                                title={'Clasroom Name'}
                                content={currentSelectedClassroomData?.name}
                              />
                              <DataValue
                                title={'Status'}
                                content={
                                  <p
                                    className={`${
                                      currentSelectedClassroomData.status === 'ACTIVE'
                                        ? 'text-green-500'
                                        : 'text-yellow-500'
                                    } lowercase`}>
                                    {currentSelectedClassroomData.status}
                                  </p>
                                }
                              />
                              <DataValue
                                title={'Teacher'}
                                content={
                                  <div className="flex items-center justify-center w-auto">
                                    <span className="w-auto">
                                      <img
                                        src={currentSelectedClassroomData.teacher.image}
                                        className="h-6 w-6 rounded-full"
                                      />
                                    </span>
                                    <p className="w-auto ml-2">
                                      {currentSelectedClassroomData.teacher.name}
                                    </p>
                                  </div>
                                }
                              />
                              <DataValue
                                title={'Course Name'}
                                content={currentSelectedClassroomData?.courseName || '--'}
                              />
                              <DataValue
                                title={'Active Unit'}
                                content={currentActiveUnit?.name || '--'}
                              />
                            </div>
                          </Transition>
                        </ClickAwayListener>
                      )}
                    </div>
                    <Selector
                      dataCy="upload-analytics-unit"
                      loading={unitsLoading}
                      selectedItem={selectedUnit ? selectedUnit.name : ''}
                      placeholder="select unit"
                      list={units}
                      width="w-64"
                      disabled={!selectedCurriculum}
                      onChange={(value, name, id) => onUnitSelect(id, name, value)}
                    />

                    <Selector
                      dataCy="analytics-survey"
                      loading={surveysLoading}
                      width="w-64"
                      direction="left"
                      disabled={!selectedUnit}
                      selectedItem={selectedSurvey ? selectedSurvey.name : ''}
                      placeholder="select survey"
                      list={surveys}
                      onChange={(value, name, id) => onChangeSurvey(id, name, value)}
                    />
                  </div>
                }
                title={Institute_info[userLanguage]['TABS']['UPLOAD_SURVEY']}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start  gap-x-4 border-t-0 border-b-0 border-gray-400 border-dashed py-4 mb-4">
          <UploadButton
            disabled={isMapping || !Boolean(selectedSurvey)}
            label={file ? 'Change file' : 'Choose file'}
            acceptedFilesFormat=".csv, .xlsx"
            ref={csvInputRef}
            id="upload-csv-button"
            onUpload={handleUpload}
          />

          <Selector
            additionalClass="w-auto"
            btnClass={!file && 'cursor-not-allowed'}
            disabled={!file}
            dropdownWidth="w-96"
            selectedItem={selectedReason ? selectedReason.name : ''}
            placeholder={CsvDict[userLanguage]['SELECT_REASON']}
            list={reasonDropdown}
            onChange={(value, name, id) => onReasonSelected(id, name, value)}
          />
        </div>

        <AnimatedContainer show={Boolean(file) && file?.name}>
          {file && file?.name && (
            <div className="p-2 px-4 border-dashed border-0 border-gray-400 rounded-md my-4">
              <FieldValue field={'Filename'} value={file?.name} />
              {Boolean(selectedReason.name) && (
                <FieldValue field={'Reason'} value={selectedReason?.name} />
              )}
            </div>
          )}
        </AnimatedContainer>

        {/* <AnimatedContainer
          animationType="translateY"
          show={selectedReason.value === 'paper-survey'}>
          {selectedReason.value === 'paper-survey' && (
            <div className="mb-4 flex items-center">
              <UploadButton
                isRequired
                id="upload-multiple-images"
                label={CsvDict[userLanguage]['UPLOAD_MULTIPLE_SURVEY_IMAGES']}
                disabled={!file || multipleImagesUploading}
                onUpload={imageUpload}
                multiple
                message={
                  multipleImagesUploaded
                    ? {message: 'Images uploaded', type: 'success'}
                    : null
                }
                ref={fileInputRef}
                acceptedFilesFormat="image/*"
              />
              {multipleImagesUploading && (
                <IconContext.Provider
                  value={{
                    size: '1.2rem',

                    className: `relative mx-4 w-auto animate-spin ${theme.textColor[themeColor]}`
                  }}>
                  <FaSpinner />
                </IconContext.Provider>
              )}
            </div>
          )}
        </AnimatedContainer> */}

        <FormInput
          textarea
          label={CsvDict[userLanguage]['DESCRIBE_REASON']}
          isRequired
          rows={10}
          resize={false}
          maxWidth="-"
          cols={50}
          value={reason}
          disabled={!file || uploadingCSV || !selectedReason.value}
          onChange={(e: any) => setReason(e.target.value)}
          placeHolder={CsvDict[userLanguage]['REASON']}
        />

        <AnimatedContainer show={success} animationType="translateY">
          {success && (
            <p className={`mt-1 text-green-500 text-xs`}>Successfully Uploaded!</p>
          )}
        </AnimatedContainer>
        <AnimatedContainer show={error} animationType="translateY">
          {error && <p className={`mt-1 text-red-500 text-xs`}>{error}</p>}
        </AnimatedContainer>

        <div className="flex items-center justify-end mt-3">
          <Buttons
            label={uploadingCSV ? 'Uploading Please wait...' : 'Upload CSV'}
            disabled={!reason || uploadingCSV}
            onClick={(e) => showModalWhenUploadCsv(e)}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(UploadCsv);
