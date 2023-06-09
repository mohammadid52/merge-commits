import Buttons from '@components/Atoms/Buttons';
import {logError, uploadImageToS3} from 'graphql-functions/functions';
import {XLSX_TO_CSV_URL} from 'assets';
import {API, graphqlOperation} from 'aws-amplify';

import UploadButton from '@components/Atoms/Form/UploadButton';
import Modal from '@components/Atoms/Modal';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import {
  focusOn,
  getExtension,
  insertExtraDataForClassroom,
  removeDuplicates,
  withZoiqFilter
} from '@utilities/functions';
import {getImageFromS3} from '@utilities/services';
import {
  ClassroomType,
  CreateUniversalArchiveDataInput,
  CreateUploadLogsInput,
  UpdateUniversalArchiveDataInput
} from 'API';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import {createUploadLogs} from 'customGraphql/customMutations';
import {
  getUniversalLesson,
  listRoomCoTeachers,
  listRoomsDashboard,
  listSurveys,
  listUnits
} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {
  createCheckpoint,
  createQuestionData,
  createTemporaryDemographicsUploadData,
  createTemporaryUniversalUploadSurveyData,
  createUniversalArchiveData,
  deleteTemporaryDemographicsUploadData,
  deleteTemporaryUniversalUploadSurveyData,
  updateQuestionData,
  updateUniversalArchiveData
} from 'graphql/mutations';
import {
  getQuestionData,
  getUniversalSurveyStudentData,
  listTemporaryDemographicsUploadData,
  listTemporaryUniversalUploadSurveyData
} from 'graphql/queries';
import PageLayout from 'layout/PageLayout';
import {isEmpty, uniqBy} from 'lodash';
import Papa from 'papaparse';
import React, {useEffect, useRef, useState} from 'react';
import {RiErrorWarningLine} from 'react-icons/ri';
import {v4 as uuidv4} from 'uuid';

interface ICsvProps {
  institutionId?: string;
}

type IModal = {
  show: boolean;
  element: React.ReactNode;
  title: string;
  saveLabel?: string;
  saveAction?: () => void;
  closeLabel?: string;
  saveElement?: React.ReactNode;
};

const INITIAL_MODAL_STATE: IModal = {
  show: false,
  element: <div />,
  title: '',
  saveAction: () => {},
  saveLabel: '',
  closeLabel: '',
  saveElement: null
};

const UploadCsv = ({institutionId}: ICsvProps) => {
  const {state, userLanguage, zoiqFilter} = useGlobalContext();

  const {CsvDict, Institute_info} = useDictionary();

  const [file, setFile] = useState<any>(null);

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
  const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
  const [classRoomLoading, setClassRoomLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [instClassRooms, setInstClassRooms] = useState<any[]>([]);
  const [classRoomsList, setClassRoomsList] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(INITIAL_MODAL_STATE);

  const [selectedClassRoom, setSelectedClassRoom] = useState<any | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any | null>(null);

  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [__, setActiveUnits] = useState<any[]>([]);
  const [uploadingCSV, setUploadingCSV] = useState(false);

  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveysLoading, setSurveysLoading] = useState(false);

  const [checkingCsvFile, setCheckingCsvFile] = useState(false);

  const [parsedObj, setParsedObj] = useState({});

  const {authId, isTeacher, isFellow, email, firstName, lastName} = useAuth();

  const fileReader = new FileReader();

  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const reasonDropdown = [
    {
      id: 1,
      label: 'Paper Survey',
      value: 'paper-survey'
    },
    {
      id: 2,
      label: 'User Update Survey',
      value: 'user-update'
    }
  ];

  const listQuestions = async (lessonId: string) => {
    try {
      let universalLesson: any = await API.graphql(
        graphqlOperation(getUniversalLesson, {
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
    if (data[0][0] === '') {
      setError('Invalid formatted header.. Make sure column headers are not changed');
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
          if (typeof value === 'string' || typeof value === 'number') {
            let updateValue = value.toString().trim();
            headers[keys[index2]] = [...headers[keys[index2]], updateValue || '-'];
          } else {
            return false;
          }

          return null;
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
    _: string
  ) => {
    const getUniversalSurveyStudent: any = await API.graphql(
      graphqlOperation(getUniversalSurveyStudentData, {
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
          (item: any) => item && item?.domID === surveyDomId
        );

        const updateSurveyInput = findSurveyDatabasedonDomId.find((item: any) => {
          if (item) {
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
          return null;
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
    _: string
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

  const ddIDAndDemographicData = async (value: string, parsed: any, _: number) => {
    const getDemographicsData: any = await API.graphql(
      graphqlOperation(getQuestionData, {
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
          (item: any) => item && item.qid === demographicsQuesId
        );
        const updateDemographicsQuesResponse = findDemographicsQuesIdResponse.find(
          (item: any) => {
            if (item && item.qid === demographicsQuesId) {
              item.response = [value];
              return true;
            }
            return false;
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
    _: number
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

  const clearModal = () => setShowModal(INITIAL_MODAL_STATE);

  const resetFile = () => {
    setFile(null);
    setSurveyData([]);
    setNewUniversalSurveyData([]);
  };

  const removeBlankAuthIds = (obj: any): any => {
    // record which index has blank auth_id
    let indexOfBlankAuthId: number[] = [];
    let authIdArr = obj['AuthId'];

    authIdArr.forEach((_d: string, index: number) => {
      if (_d === '-') {
        indexOfBlankAuthId.push(index);
      }
    });

    let result: any = {};

    Object.keys(obj).forEach((_d) => {
      const values = obj[_d];
      indexOfBlankAuthId.forEach((idxToBeRemoved) => {
        values.splice(idxToBeRemoved, 1);
      });
      result[_d] = values;
    });

    return result;
  };

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const ext = getExtension(file.name);

    if (ext === 'csv') {
      clearModal();
      try {
        setCheckingCsvFile(true);
        let surveyQuestionOptions: any = {};
        fileReader.onload = async (event: any) => {
          setIsMapping(true);
          const result: any = Papa.parse(event.target.result);

          let parsed = customParse(result.data);
          if (typeof parsed === 'boolean' && !parsed) {
            resetFile();
            setIsMapping(false);
            setShowModal({
              show: true,
              title: 'Confirm File',
              element: (
                <div>
                  <p className="p-4 text-sm text-dark  ">
                    please check your input file, You are trying to import unapproved
                    response types
                  </p>
                </div>
              ),

              saveAction: () => {},
              saveLabel: '',
              closeLabel: ''
            });
            return;
          }

          parsed = removeBlankAuthIds(parsed);

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
                  <p className="p-4 text-sm text-dark  ">
                    Selected file does not match target survey
                  </p>
                </div>
              ),

              saveAction: () => {},
              saveLabel: '',
              closeLabel: ''
            });
            return;
          } else if (surveyID && unitID && classroomName) {
            setParsedObj(parsed);

            resetFile();
            setFile(file);
            let listOptionsId = await listQuestions(surveyID);

            listOptionsId &&
              listOptionsId.length > 0 &&
              listOptionsId.forEach((ques: any) => {
                return (surveyQuestionOptions[ques.question.id] = ques.question.options);
              });

            focusOn('reason-button');

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
        setCheckingCsvFile(false);
      }
    } else if (ext === 'xlsx') {
      setShowModal({
        show: true,
        title: 'Not supported',
        closeLabel: 'Cancel',
        saveAction: () => {},
        saveElement: (
          <a
            href={XLSX_TO_CSV_URL}
            onClick={() => clearModal()}
            target="_blank"
            rel="no-referrer"
            className="">
            Convert to csv
          </a>
        ),
        element: (
          <div className="flex flex-col justify-center items-center gap-y-4">
            <RiErrorWarningLine fontSize={'4rem'} className="text-yellow-500 animate-y" />
            <p className="text-medium  pt-0 p-4 text-center">
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
        graphqlOperation(createTemporaryUniversalUploadSurveyData, {
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
        graphqlOperation(createTemporaryDemographicsUploadData, {
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
        urlLink: csvUrl,
        authID: authId,
        email,
        surveyName: selectedSurvey.name,
        roomName: selectedReason.name,
        personName: `${firstName} ${lastName}`,
        unitName: selectedUnit.name
      };

      const newUploadLogs: any = await API.graphql(
        graphqlOperation(createUploadLogs, {
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
        await createTempSurveyData(item.UniversalSurveyStudentID, item.surveyData);
        await API.graphql(
          graphqlOperation(updateUniversalArchiveData, {
            input: {
              id: item.UniversalSurveyStudentID,
              surveyData: item.surveyData
            } as UpdateUniversalArchiveDataInput
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
        const input: CreateUniversalArchiveDataInput = {
          id: uuidv4(),
          lessonPageID: '999',
          lessonID: item.lessonID,
          studentAuthID: item.studentAuthID,
          studentEmail: item.studentEmail,
          studentID: item.studentAuthID,
          syllabusLessonID: item.syllabusLessonID,
          surveyData: item.surveyData
        };
        const createData: any = await API.graphql(
          graphqlOperation(createUniversalArchiveData, {
            input
          })
        );
        if (createData) {
          await createTempSurveyData(
            createData.data.createUniversalArchiveData.id,
            item.surveyData
          );
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
        await createTempDemographicsData(item.questionDataId, item.responseObject);
        // createTempDemographicsDataResult &&

        await API.graphql(
          graphqlOperation(updateQuestionData, {
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
          graphqlOperation(createCheckpoint, {
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
            graphqlOperation(createQuestionData, {
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
            await createTempDemographicsData(
              createDemographicsQuestionData.data.createQuestionData.id,
              item.responseObject
            );
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

  const showModalWhenUploadCsv = (e: any) => {
    setShowModal({
      show: true,
      title: 'Confirmation',
      element: (
        <div>
          <p className="text-dark   text-sm p-4">
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

        const fileUrl = (await getImageFromS3(fileUpload.key)) || '';

        return fileUrl as string;
      }
      return null;
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'UploadCSV @uploadCsvToS3');
      return null;
    }
  };

  const deletePrevTempDataUploadSurveyData = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(listTemporaryUniversalUploadSurveyData)
      );

      const list: any[] = res.data.listTemporaryUniversalUploadSurveyData.items || [];

      if (list.length > 0) {
        list.forEach(async (item) => {
          await API.graphql(
            graphqlOperation(deleteTemporaryUniversalUploadSurveyData, {
              input: {id: item.id}
            })
          );
        });
      }
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'UploadCSV @deletePrevTempData');
    }
  };

  const deletePrevTempDataDempographics = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(listTemporaryDemographicsUploadData)
      );

      const list: any[] = res.data.listTemporaryDemographicsUploadData.items || [];

      if (list.length > 0) {
        list.forEach(async (item) => {
          await API.graphql(
            graphqlOperation(deleteTemporaryDemographicsUploadData, {
              input: {id: item.id}
            })
          );
        });
      }
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'UploadCSV @deletePrevTempData');
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.persist();
      e.preventDefault();
      setUploadingCSV(true);

      // step 1  - upload csv file to s3 and get the url
      const csvUrl = await uploadCsvToS3();

      // step 2 - create upload log record and use csv url there
      if (csvUrl) {
        await createUploadLog(csvUrl);

        // step 3 - delete previous temporary records for both tables
        await deletePrevTempDataUploadSurveyData();
        await deletePrevTempDataDempographics();

        // step 4 - upload everything to table
        await handleSurveyExistingUpload();
        await handleNewSurveyUniversalUpload();
        await handleDemographicsExistingUpload();
        await handleDemographicsNewUpload();

        setSelectedReason({
          id: 0,
          name: '',
          value: ''
        });

        if (csvInputRef.current && csvInputRef?.current?.value !== null) {
          csvInputRef.current.value = '';
        }
        setFile(null);

        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 4500);
      }
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

  const onChangeSurvey = (id: any, name: string, value: string) => {
    resetFile();
    let reasonDropdownValue = {id, name, value};
    setSelectedSurvey(reasonDropdownValue);
  };

  const fetchUnits = async (curriculumId: string) => {
    try {
      setUnitsLoading(true);
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(listUnits, {
          filter: {curriculumId: {eq: curriculumId}}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units
        .map((syl: any) => {
          let unitData = syl.unit;
          if (Boolean(unitData)) {
            return {
              id: unitData.id,
              name: unitData.name,
              value: unitData.name
            };
          }
          return null;
        })
        .filter(Boolean);
      // console.log('units', units)
      setUnits(units);

      // here we have curricularCheckpoints and use syllabusLessonId 999999 to fetch list of question data
    } catch (err) {
      console.error('fetch units (syllabus) error', err);
      logError(err, {authId, email}, 'UploadCSV @fetchUnits');
    } finally {
      setUnitsLoading(false);
    }
  };

  const fetchActiveUnits = async (crList: any) => {
    const arrayOfActiveUnits = crList
      ?.filter((_c: {activeSyllabus: any}) => Boolean(_c?.activeSyllabus))
      .map((_c: {activeSyllabus: string | null}) => {
        if (_c?.activeSyllabus) return {unitId: {eq: _c.activeSyllabus}};
        return null;
      })
      .filter(Boolean);

    try {
      let curriculumUnits: any = await API.graphql(
        graphqlOperation(listUnits, {
          filter: {or: arrayOfActiveUnits}
        })
      );
      let units = curriculumUnits?.data.listCurriculumUnits?.items || [];

      units = units
        .map((syl: any) => {
          if (syl.unit) {
            let unitData = syl.unit;
            return {id: unitData.id, name: unitData.name};
          }
          return null;
        })
        .filter(Boolean);

      setActiveUnits(units);
    } catch (error) {
      console.error('error at fetchActiveUnits Csv.tsx', error);
      logError(error, {authId, email}, 'UploadCSV @fetchActiveUnits');
    }
  };

  const [isFetchedClassroom, setIsFetchedClassroom] = useState(false);

  const fetchClassRooms = async () => {
    try {
      setClassRoomLoading(true);
      let instCRs: any = [];

      let classrooms: any;
      let coTeahcerClassrooms: any;

      if (isTeacher || isFellow) {
        classrooms = await API.graphql(
          graphqlOperation(listRoomsDashboard, {
            filter: withZoiqFilter(
              {
                teacherAuthID: {eq: authId},
                type: {eq: ClassroomType.TRADITIONAL}
              },
              zoiqFilter
            )
          })
        );

        coTeahcerClassrooms = await API.graphql(
          graphqlOperation(listRoomCoTeachers, {
            filter: {
              teacherAuthID: {eq: authId},

              type: {eq: ClassroomType.TRADITIONAL}
            }
          })
        );
      } else {
        classrooms = await API.graphql(
          graphqlOperation(listRoomsDashboard, {
            filter: withZoiqFilter({type: {eq: ClassroomType.TRADITIONAL}}, zoiqFilter)
          })
        );

        coTeahcerClassrooms = await API.graphql(
          graphqlOperation(listRoomCoTeachers, {
            filter: {type: {eq: ClassroomType.TRADITIONAL}}
          })
        );
      }

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

              label: cr.name,
              value: cr.name,
              class: {...cr.class},
              curriculum,
              ...insertExtraDataForClassroom(cr)
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log(instCRs);

      setClassRoomsList(classrooms);
      setInstClassRooms(removeDuplicates(instCRs));
      fetchActiveUnits(classrooms);
    } catch (error) {
      console.error(error);
      logError(error, {authId, email}, 'UploadCSV @fetchClassRooms');
    } finally {
      setClassRoomLoading(false);
      setIsFetchedClassroom(true);
    }
  };

  useEffect(() => {
    if (institutionId && !isFetchedClassroom) {
      fetchClassRooms();
    }
  }, [institutionId, isFetchedClassroom]);

  const fetchSurveys = async (unitId: string) => {
    setSurveysLoading(true);
    try {
      let syllabusLessons: any = await API.graphql(
        graphqlOperation(listSurveys, {
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
      logError(err, {authId, email}, 'UploadCSV @fetchSurveys');
    } finally {
      setSurveysLoading(false);
    }
  };

  const onClassRoomSelect = async (id: string, label: string, value: string) => {
    try {
      let sCR = selectedClassRoom;
      let cr = {id, label, value};
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
      logError(err, {authId, email}, 'UploadCSV @onClassRoomSelect');
    }
  };

  const onUnitSelect = (id: string, name: string, value: string) => {
    let unit = {id, name, value};
    resetFile();
    setSelectedUnit(unit);
    fetchSurveys(unit.id);
    setSurveys([]);
    setSelectedSurvey(null);
  };

  const [_, setHoveringItem] = useState<{name?: string}>({});

  const getMappedValues = (input: any) => {
    if (input) {
      let result: any[] = [];

      const values = input['AuthId'];

      if (values) {
        values.forEach(() => {
          let res: any = {};
          Object.keys(input).forEach((_d) => {
            res[_d] = '';
          });
          result.push(res);
        });

        let mapped = result.map((_e, idx) => {
          let final = _e;

          Object.keys(_e).forEach((_v) => {
            final[_v] = input[_v][idx];
          });

          return final;
        });

        return mapped;
      }
      return [];
    }
    return [];
  };

  const dataList = getMappedValues(parsedObj).map((listItem, idx) => ({
    no: idx + 1,
    onClick: () => {},
    id: listItem['AuthId'],
    name: `${listItem['First Name']} ${listItem['Last Name']}`,

    email: listItem['Email'],
    takenSurvey: listItem['UniversalSurveyStudentID'] === 'Not-taken-yet' ? 'No' : 'Yes'
  }));

  const tableConfig: ITableProps = {
    headers: ['No', 'Id', 'Name', 'Email', 'Taken Survey'],
    dataList,
    config: {
      dataList: {
        loading: isEmpty(parsedObj)
      }
    }
  };

  return (
    <>
      <Modal
        open={showModal.show}
        showHeader
        title={showModal.title}
        closeAction={clearModal}
        saveAction={showModal.saveAction}
        closeOnBackdrop
        saveElement={showModal?.saveElement}
        closeLabel={showModal.closeLabel}
        saveLabel={showModal?.saveLabel}
        showFooter={Boolean(showModal.closeLabel)}>
        {showModal.element}
      </Modal>

      <PageLayout
        hideGoBack
        hideInstProfile
        extra={
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="w-auto relative">
              <Selector
                dataCy="upload-analytics-classroom"
                loading={classRoomLoading}
                selectedItem={selectedClassRoom ? selectedClassRoom.label : ''}
                placeholder="Select Classroom"
                width={250}
                list={instClassRooms}
                onChange={(value, option: any) => {
                  setHoveringItem({});
                  onClassRoomSelect(option.id, value, value);
                  focusOn('upload-analytics-unit');
                }}
              />
            </div>
            <Selector
              dataCy="upload-analytics-unit"
              loading={unitsLoading}
              selectedItem={selectedUnit ? selectedUnit.name : ''}
              placeholder="Select Unit"
              list={units}
              width={250}
              disabled={!selectedCurriculum}
              onChange={(value, option: any) => {
                onUnitSelect(option.id, value, value);
                focusOn('analytics-survey');
              }}
            />

            <Selector
              dataCy="analytics-survey"
              loading={surveysLoading}
              disabled={!selectedUnit}
              selectedItem={selectedSurvey ? selectedSurvey.name : ''}
              placeholder="Select Survey"
              list={surveys}
              onChange={(value, option: any) => onChangeSurvey(option.id, value, value)}
            />
          </div>
        }
        title={Institute_info[userLanguage]['TABS']['UPLOAD_SURVEY']}>
        <div className="flex flex-col overflow-h-scroll w-full h-full">
          <div className="flex items-center justify-start  gap-x-4 mb-4">
            <UploadButton
              disabled={isMapping || !Boolean(selectedSurvey)}
              label={file ? 'Change file' : 'Choose file'}
              acceptedFilesFormat=".csv, .xlsx"
              ref={csvInputRef}
              id="upload-csv-button"
              onUpload={handleUpload}
            />

            <Selector
              disabled={!file}
              selectedItem={selectedReason ? selectedReason.name : ''}
              placeholder={CsvDict[userLanguage]['SELECT_REASON']}
              list={reasonDropdown}
              width={250}
              onChange={(value, option: any) => onReasonSelected(option.id, value, value)}
            />
          </div>
          <AnimatedContainer show={checkingCsvFile} animationType="translateY">
            {checkingCsvFile && (
              <p className={`mt-1 text-medium  text-xs`}>Checking file information...</p>
            )}
          </AnimatedContainer>

          <AnimatedContainer show={success} animationType="translateY">
            {success && (
              <p className={`mt-1 text-green-500 text-xs`}>Successfully Uploaded!</p>
            )}
          </AnimatedContainer>

          <AnimatedContainer show={error} animationType="translateY">
            {error && <p className={`mt-1 text-red-500 text-xs`}>{error}</p>}
          </AnimatedContainer>

          {!isEmpty(parsedObj) && (
            <>
              <Table {...tableConfig} />
            </>
          )}

          <div className="flex items-center justify-end mt-3">
            <Buttons
              label={uploadingCSV ? 'Uploading Please wait...' : 'Upload CSV'}
              disabled={uploadingCSV || isEmpty(parsedObj)}
              onClick={(e) => showModalWhenUploadCsv(e)}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default React.memo(UploadCsv);
