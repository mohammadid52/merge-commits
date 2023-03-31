import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Error} from '@components/Atoms/Alerts/Info';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useQuery} from '@customHooks/urlParam';
import useAuth from '@customHooks/useAuth';
import {updatePageState} from '@graphql/functions';
import {
  UniversalLessonWritingExcercises,
  UpdateUniversalLessonWritingExcercisesInput,
  UserPageState
} from 'API';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Modal from 'atoms/Modal';
import SectionTitleV3 from 'atoms/SectionTitleV3';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import usePrevious from 'customHooks/previousProps';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import {
  UniversalClassData,
  UniversalJournalData,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import {isEmpty} from 'lodash';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import {useEffect, useState} from 'react';
import {v4 as uuidV4} from 'uuid';
import HeroBanner from '../../Header/HeroBanner';
import HeaderTextBar from '../HeaderTextBar/HeaderTextBar';
import ChangePasscode from '../Profile/ChangePasscode';
import EmptyViewWrapper from './EmptyViewWrapper';
import RoomView from './RoomView';
import TabView from './TabView';

// ~~~~~~~~~~~~~~ INTERFACES ~~~~~~~~~~~~~ //

export interface IAnthologyProps {
  studentID?: string;
  studentAuthID?: string;
  studentEmail?: string;
  studentName?: string;
  isTeacher?: boolean;
  studentImage?: string | null;
}
export interface ViewEditMode {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '';
  dataID: string;
  option?: number;
  recordID?: string;
}

const Anthology = ({
  studentAuthID,
  studentEmail,
  studentName,
  isTeacher,
  studentImage
}: IAnthologyProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  // const {state, dispatch, userLanguage, theme, clientKey} = useGlobalContext();
  const {clientKey, state, dispatch, userLanguage} = useGlobalContext();

  // other
  const {anthologyDict} = useDictionary();

  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  // ##################################################################### //
  // ########################### INITIALIZATION ########################## //
  // ##################################################################### //

  useEffect(() => {
    if (isStudent) {
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
      updatePageState(UserPageState.NOTEBOOK, {
        authId: state.user.authId,
        email: state.user.email,
        pageState: state.user.pageState
      });
    }
  }, []);

  const [subSection, setSubSection] = useState<string>('none');
  const [loading, setLoading] = useState(false);

  const initialDataFetch = async () => {
    setLoading(true);
    await listUniversalJournalData();
    await getStudentData();
    await getUniversalArchiveData();
    await getUniversalLessonWritingExercises();
    setLoading(false);
  };

  useEffect(() => {
    if (subSection === 'none') {
      initialDataFetch();
    }
  }, [subSection]);

  // ##################################################################### //
  // ############################ MAIN STORAGE ########################### //
  // ##################################################################### //

  const [allStudentData, setAllStudentData] = useState<UniversalLessonStudentData[]>([]);
  const [allExerciseData, setAllExerciseData] = useState<
    UniversalLessonWritingExcercises[]
  >([]);
  const [classNotebook, setClassNotebook] = useState<any[]>([]);

  const [allUniversalJournalData, setAllUniversalJournalData] = useState<
    UniversalJournalData[]
  >([]);

  const [allUniversalClassData, setAllUniversalClassData] = useState<
    UniversalClassData[]
  >([]);

  // ##################################################################### //
  // ##################### CRUD STUDENT EXERCISE DATA #################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~ //
  const [studentDataLoaded, setStudentDataLoaded] = useState<boolean>(false);

  const getStudentData = async () => {
    try {
      const listFilter = {
        limit: SEARCH_LIMIT,
        filter: {
          studentAuthID: {eq: studentAuthID},
          hasExerciseData: {eq: true}
        }
      };

      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      );
      // existing student rows
      const studentDataRows =
        studentData?.data.listUniversalLessonStudentData?.items || [];
      if (studentDataRows?.length > 0) {
        setAllStudentData(studentDataRows);
      }
      setStudentDataLoaded(true);
    } catch (e) {
      //
      setStudentDataLoaded(true);
    }
  };

  const reduceRoomExerciseData = (roomID: string) => {
    const allExerciseEntryData = allUniversalClassData.reduce((acc: any[], val) => {
      if (val.roomID === roomID) {
        const adaptedExerciseEntries: any = val?.exerciseData?.map((exercise: any) => {
          if (!isEmpty(exercise?.entryData)) {
            return {
              id: exercise.id,

              studentID: val.studentID,
              studentAuthID: val.studentAuthID,
              studentEmail: val.studentEmail,
              feedbacks: exercise.feedbacks || [],
              shared: exercise?.shared || false,
              entryData:
                exercise?.entryData?.map((entry: any) => {
                  return {
                    ...entry,
                    type: entry.domID.includes('title') ? 'header' : 'content'
                  };
                }) || [],
              recordID: val.id,
              updatedAt: val?.updatedAt,
              roomID,
              lessonName: val.lessonName
            };
          }
          return {};
        });

        return [...acc, ...adaptedExerciseEntries];
      } else {
        return acc;
      }
    }, []);
    setAllExerciseData(allExerciseEntryData);
  };

  const updateStudentData = async () => {
    const selectStudentDataRecord = allStudentData.find(
      (record: any) => record.id === journalEntryData.recordID
    );

    if (!isEmpty(selectStudentDataRecord)) {
      const newExerciseData = {
        exerciseData: selectStudentDataRecord?.exerciseData?.map((exercise: any) => {
          if (exercise.id === journalEntryData.id) {
            return {...exercise, entryData: journalEntryData.entryData};
          } else {
            return exercise;
          }
        })
      };

      const mergedStudentData = allStudentData.map((dataRecord: any) => {
        if (dataRecord.id === selectStudentDataRecord.id) {
          return {...dataRecord, exerciseData: newExerciseData.exerciseData};
        } else {
          return dataRecord;
        }
      });

      try {
        await API.graphql(
          graphqlOperation(mutations.updateUniversalLessonStudentData, {
            input: {
              id: selectStudentDataRecord.id,
              exerciseData: newExerciseData.exerciseData
            }
          })
        );
        setAllStudentData(mergedStudentData);
      } catch (e) {
        console.error('error updating writing exercise - ', e);
      } finally {
        //
      }
    }
  };

  const DEFAULT_JOURNAL_ENTRY: UniversalJournalData = {
    id: '',
    studentID: studentAuthID || '',
    studentAuthID: studentAuthID || '',
    studentEmail: studentEmail || '',
    type: 'journal-entry',
    feedbacks: [''],
    shared: false,
    entryData: [
      {
        domID: `title_${nanoid(12)}`,
        type: 'header',
        input: ''
      },
      {
        domID: `note_${nanoid(12)}`,
        type: 'content',
        input: ''
      }
    ]
  };

  const [journalEntryData, setJournalEntryData] =
    useState<UniversalJournalData>(DEFAULT_JOURNAL_ENTRY);

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [universalJournalDataLoaded, setUniversalJournalDataLoaded] =
    useState<boolean>(false);

  const listUniversalJournalData = async () => {
    try {
      const listFilter = {
        limit: SEARCH_LIMIT,
        filter: {
          studentAuthID: {eq: studentAuthID}
        }
      };

      const journalEntryData: any = await API.graphql(
        graphqlOperation(queries.listUniversalJournalData, listFilter)
      );
      const journalEntryDataRows =
        journalEntryData?.data?.listUniversalJournalData?.items || [];

      if (journalEntryDataRows?.length > 0) {
        setAllUniversalJournalData(journalEntryDataRows);
      } else {
        console.log('anthology - NO universalJournalDatas');
      }
      setUniversalJournalDataLoaded(true);
    } catch (e) {
      console.error('error listing journal data - ', e);
      setUniversalJournalDataLoaded(true);
    }
  };

  const createJournalData = async () => {
    const input = {
      id: uuidV4(),
      studentID: journalEntryData.studentID,
      studentAuthID: journalEntryData.studentAuthID,
      studentEmail: journalEntryData.studentEmail,
      type: journalEntryData.type || 'journal-entry',
      entryData: journalEntryData.entryData,
      fromLesson: false
    };

    try {
      const newJournalData: any = await API.graphql(
        graphqlOperation(mutations.createUniversalJournalData, {input})
      );

      const returnedData = newJournalData.data.createUniversalJournalData;
      return returnedData;
    } catch (e) {
      console.error('error creating journal data - ', e);
    }
  };

  const updateJournalData = async () => {
    const mergedJournalData = allUniversalJournalData.map((dataRecord: any) => {
      if (dataRecord.id === journalEntryData.id) {
        return {...dataRecord, entryData: journalEntryData.entryData};
      } else {
        return dataRecord;
      }
    });

    // here we are getting error because of bad data.
    // let's add some edge cases to handle this.
    // updateUniversalJournalData mutation is giving error. because its origin data is missing.
    // so if we are getting that error. let's create a new data object

    try {
      const input = {
        id: journalEntryData.id,
        studentID: journalEntryData.studentID,
        studentAuthID: journalEntryData.studentAuthID,
        studentEmail: journalEntryData.studentEmail,
        entryData: journalEntryData.entryData
      };
      try {
        await API.graphql(
          graphqlOperation(customMutations.updateUniversalJournalData, {
            input
          })
        );
      } catch (error) {
        // if we are getting null. it means that data is missing. so we need to create a new data object
        await createJournalData();
      }

      setAllUniversalJournalData(mergedJournalData);
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      //
    }
  };
  const updateJournalDataForClassWork = async () => {
    const selectStudentDataRecord = allUniversalClassData.find(
      (record: any) => record.id === journalEntryData.recordID
    );

    const newExerciseData = {
      exerciseData: selectStudentDataRecord?.exerciseData?.map((exercise: any) => {
        if (exercise.id === journalEntryData.id) {
          return {...exercise, entryData: journalEntryData.entryData};
        } else {
          return exercise;
        }
      })
    };

    const updatedExerciseData = allExerciseData.filter(Boolean).map((exercise: any) => {
      if (exercise.id === journalEntryData.id) {
        return {...exercise, entryData: journalEntryData.entryData};
      } else {
        return exercise;
      }
    });

    // here we are getting error because of bad data.
    // let's add some edge cases to handle this.
    // updateUniversalJournalData mutation is giving error. because its origin data is missing.
    // so if we are getting that error. let's create a new data object

    try {
      const input: UpdateUniversalLessonWritingExcercisesInput = {
        id: journalEntryData.recordID || '',
        exerciseData: newExerciseData.exerciseData
      };
      try {
        const classDataIdx =
          allUniversalClassData?.findIndex((d) => d.id === journalEntryData.recordID) ||
          0;
        const exerciseIdx = allUniversalClassData?.[
          classDataIdx
        ]?.exerciseData?.findIndex((d) => d?.id === journalEntryData.id);
        const updated = update(
          allUniversalClassData[classDataIdx],
          `exerciseData[${exerciseIdx}].entryData`,
          () => journalEntryData.entryData
        );
        allUniversalClassData.splice(classDataIdx, 1, updated);

        setAllUniversalClassData(allUniversalClassData);

        await API.graphql(
          graphqlOperation(mutations.updateUniversalLessonWritingExcercises, {
            input
          })
        );
      } catch (error) {
        // if we are getting null. it means that data is missing. so we need to create a new data object
        // const newJournalData = await createJournalData();
      }

      setAllExerciseData(updatedExerciseData);
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      //
    }
  };

  const deleteJournalData = async () => {
    const deletedJournalData = allUniversalJournalData.reduce(
      (acc: any[], dataRecord: any) => {
        if (dataRecord.id === viewEditMode.dataID) {
          return acc;
        } else {
          return [...acc, dataRecord];
        }
      },
      []
    );

    try {
      await API.graphql(
        graphqlOperation(mutations.deleteUniversalJournalData, {
          input: {id: viewEditMode.dataID}
        })
      );
      setAllUniversalJournalData(deletedJournalData);
    } catch (e) {
      console.error('error deleting journal data - ', e);
    }
  };

  // ~~~~~~~~~~~~~ UPDATE NOTES ~~~~~~~~~~~~ //
  const selectJournalData = async () => {
    const selectSource =
      subSection !== 'Work' ? allUniversalJournalData : allExerciseData;

    const selectExisting =
      selectSource
        // @ts-ignore
        .filter(Boolean)
        .find((journalObj: any) => journalObj.id === viewEditMode.dataID) ||
      DEFAULT_JOURNAL_ENTRY;

    setJournalEntryData({
      id: selectExisting.id,
      studentID: selectExisting.studentID,
      studentAuthID: selectExisting.studentAuthID,
      studentEmail: selectExisting.studentEmail,
      shared: selectExisting?.shared || false,
      feedbacks: selectExisting.feedbacks || [],
      entryData: selectExisting.entryData,
      recordID: selectExisting?.recordID,
      updatedAt: selectExisting?.updatedAt
    });
  };

  const updateJournalDataContent = (html: string, targetType: string, idx?: number) => {
    if (idx !== undefined) {
      update(journalEntryData, `entryData[${idx}].input`, () => html);
      setJournalEntryData({...journalEntryData});
    } else {
      const updatedNotesData = {
        ...journalEntryData,
        entryData: journalEntryData?.entryData?.map((entryObj: any) => {
          if (entryObj.type === targetType) {
            return {...entryObj, input: html};
          } else {
            return entryObj;
          }
        })
      };

      setJournalEntryData(updatedNotesData);
    }
  };

  // ##################################################################### //
  // ################ TOGGLE EDITING & ADDING NEW JOURNAL ################ //
  // ##################################################################### //
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({
    mode: '',
    dataID: '',
    option: 0,
    recordID: ''
  });

  const handleEditToggle = (
    editMode: 'view' | 'edit' | 'create' | 'save' | 'savenew' | 'delete' | '',
    dataID: string,
    option?: number,
    recordID?: string
  ) => {
    setViewEditMode({
      mode: editMode,
      dataID: dataID,
      option: option || 0,
      recordID: recordID || ''
    });

    if (editMode === 'create') {
      const el = document.getElementById('anthology_Journal_create');
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  };

  const handleResetJournalEntry = async () => {
    setJournalEntryData(DEFAULT_JOURNAL_ENTRY);
  };
  const [mainSection, setMainSection] = useState<string>('');

  // UseEffect for monitoring save/create new changes and calling functions
  const isPrivate = mainSection.toLowerCase() === 'private';
  // TODO: functions need renaming so that
  useEffect(() => {
    const manageSaveAndCreate = async () => {
      if (subSection !== 'Work') {
        if (viewEditMode.mode === 'create') {
          await handleResetJournalEntry();
        } else if (viewEditMode.mode === 'edit' && viewEditMode.dataID !== '') {
          await selectJournalData();
        } else if (viewEditMode.mode === 'save') {
          await handleResetJournalEntry();
          await updateJournalData();
        } else if (viewEditMode.mode === 'savenew') {
          await createJournalData();
          await handleResetJournalEntry();
          await listUniversalJournalData();
        } else if (viewEditMode.mode === 'delete' && viewEditMode.option === 1) {
          await deleteJournalData();
        } else if (viewEditMode.mode === '') {
          await handleResetJournalEntry();
        }
      } else {
        if (viewEditMode.mode === 'edit' && viewEditMode.dataID !== '') {
          await selectJournalData();
        } else if (viewEditMode.mode === 'save') {
          await handleResetJournalEntry();
          if (isPrivate) {
            await updateStudentData();
            await updateJournalData();
          } else {
            await updateJournalDataForClassWork();
          }
        } else if (viewEditMode.mode === '') {
          await handleResetJournalEntry();
        }
      }
    };

    manageSaveAndCreate();
  }, [viewEditMode]);

  // ##################################################################### //
  // ####################### DISPLAY CONTENT LOGIC ####################### //
  // ##################################################################### //

  const [switchReady, setSwitchReady] = useState<boolean>(true);
  const [sectionRoomID, setSectionRoomID] = useState<string>('');

  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [tab, setTab] = useState<number>(0);

  const previousRoom = usePrevious(sectionRoomID);

  useEffect(() => {
    const notebookSwitchProcess = async () => {
      if (switchReady) {
        setSwitchReady(false);
        setTimeout(() => {
          setSwitchReady(true);
        }, 250);
      }
    };

    if (sectionRoomID !== previousRoom) {
      notebookSwitchProcess();
    }
  }, [sectionRoomID]);

  // ~~~~~~ FILTER ROOM EXERCISE DATA ~~~~~~ //

  useEffect(() => {
    // TODO: adding entrydata type with an additional map is bad coding...
    if (allUniversalClassData?.length > 0 && sectionRoomID !== '') {
      reduceRoomExerciseData(sectionRoomID);
    }
  }, [allUniversalClassData, sectionRoomID]);

  const {isStudent} = useAuth();
  const dynamicAuthID = isStudent ? state.user.authId : studentAuthID;
  const dynamicEmail = isStudent ? state.user.email : studentEmail;

  const getUniversalArchiveData = async () => {
    try {
      const archiveData: any = await API.graphql(
        graphqlOperation(queries.listUniversalArchiveData, {
          limit: SEARCH_LIMIT,
          filter: {
            studentID: {
              eq: dynamicAuthID
            }
          }
        })
      );
      setClassNotebook(archiveData.data.listUniversalArchiveData.items);
    } catch (error) {
      console.error(
        '🚀 ~ file: Anthology.tsx ~ line 527 ~ getUniversalArchiveData ~ error',
        error
      );
    }
  };

  const getUniversalLessonWritingExercises = async () => {
    try {
      const _allUniversalClassData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonWritingExcercises, {
          limit: SEARCH_LIMIT,
          filter: {
            studentID: {
              eq: dynamicAuthID
            },
            studentEmail: {
              eq: dynamicEmail
            }
          }
        })
      );

      const items =
        _allUniversalClassData?.data?.listUniversalLessonWritingExcercises?.items.filter(
          Boolean
        ) || [];

      const mappedItems: UniversalClassData[] = items.map((item: UniversalClassData) => {
        return {
          ...item,
          entryData:
            item?.exerciseData?.[0]?.entryData?.map((entryObj: any) => {
              return {
                ...entryObj,
                type: entryObj.domID.includes('title') ? 'header' : 'content'
              };
            }) || []
        };
      });

      setAllUniversalClassData(mappedItems);
    } catch (error) {
      console.error(
        '🚀 ~ file: Anthology.tsx ~ line 548 ~ getUniversalLessonWritingExcercises ~ error',
        error
      );
    }
  };

  // ~~~~~~~~~~~~~~ ROOM CARDS ~~~~~~~~~~~~~ //

  const [_, setNotebookLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (studentDataLoaded && universalJournalDataLoaded) {
      setNotebookLoaded(true);
    }
  }, [studentDataLoaded, universalJournalDataLoaded]);

  const [roomCardIds, setRoomCardIds] = useState<string[]>([]);
  useEffect(() => {
    const mergeAll = [
      ...allStudentData,
      ...allUniversalJournalData,
      ...classNotebook,
      ...allUniversalClassData
    ];
    if (mergeAll?.length > 0) {
      const uniqueIds = mergeAll.reduce((acc: string[], mixedObj: any) => {
        if (mixedObj.hasOwnProperty('roomID')) {
          if (acc.indexOf(mixedObj.roomID) === -1) {
            return [...acc, mixedObj.roomID];
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }, []);
      if (uniqueIds?.length > 0) {
        setRoomCardIds(uniqueIds);
      }
    }
  }, [allStudentData, allUniversalJournalData, classNotebook, allUniversalClassData]);

  // ~~~~~~ PRIVATE ROOM VERIFICATION ~~~~~~ //

  const [showPasscodeEntry, setShowPasscodeEntry] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [accessMessage, setAccessMessage] = useState<any>({
    message: '',
    textClass: ''
  });
  const [forgotPrompt, setForgotPrompt] = useState<boolean>(false);

  const handlePrivateSectionAccess = async () => {
    if (passcodeInput) {
      if (showPasscodeEntry) {
        try {
          setAccessMessage({
            message: 'Verifying',
            textClass: 'text-indigo-500'
          });
          const personPasscode: any = await API.graphql(
            graphqlOperation(customQueries.getPersonPasscode, {
              email: state?.user?.email,
              authId: state?.user?.authId
            })
          );
          const person = personPasscode?.data?.getPerson;
          const unset = person?.passcode === null;
          const verified = person?.passcode === passcodeInput;

          if (verified) {
            setMainSection('Private');
            setSectionRoomID('private');
            setSectionTitle(`Private Notebook`);
            setSubSection('Journal');
            setTab(0);
            setShowPasscodeEntry(false);
            setPasscodeInput('');
            setAccessMessage({message: '', textClass: ''});
          } else if (unset) {
            setAccessMessage({
              message: 'Please set a passcode!',
              textClass: 'text-blue-500'
            });
            handleForgotPasscode();
          } else {
            setAccessMessage({
              message: 'Passcode Incorrect',
              textClass: 'text-red-500'
            });
          }
        } catch (e) {
          console.error('handlePrivateSectionAccess - ', e);
        }
      }
    } else {
      setAccessMessage({
        message: 'Passcode field cannot be empty',
        textClass: 'text-red-500'
      });
    }
  };

  // ~~~~~~~~~~~ FORGOT CODE LINK ~~~~~~~~~~ //

  const handleForgotPasscode = (__?: boolean) => {
    if (forgotPrompt === false) {
      setForgotPrompt(true);
      setAccessMessage({message: '', textClass: ''});
    } else {
      setForgotPrompt(false);
    }
  };

  // ~~~~~~~~~ STANDARD ROOM SELECT ~~~~~~~~ //
  const handleSectionSelect = (
    section: string,
    roomIdString: string,
    roomName?: string
  ) => {
    if (section === 'Class Notebook') {
      setMainSection('Class');
      setSectionRoomID(roomIdString);
      roomName && setSectionTitle(roomName);
      setSubSection('Work');
      setTab(0);
      setShowPasscodeEntry(false);
      setPasscodeInput('');
      setAccessMessage('');
    } else if (section === 'Private Notebook' && !isTeacher) {
      setShowPasscodeEntry(true);
    } else if (section === 'Private Notebook' && isTeacher) {
      setMainSection('Private');
      setSectionRoomID('private');
      setSectionTitle(`Private Notebook`);
      setSubSection('Journal');
      setTab(0);
      setShowPasscodeEntry(false);
      setPasscodeInput('');
      setAccessMessage({message: '', textClass: ''});
    }

    const el = document.getElementById('anthology_tabs');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };
  const params = useQuery(location.search);

  const roomId = params.get('roomId');

  return (
    <ErrorBoundary componentName="Anthology">
      {!isTeacher && (
        <div>
          <HeroBanner imgUrl={notebookBanner} title={'Notebooks'} />
        </div>
      )}
      <div className="px-10">
        {!isTeacher && <HeaderTextBar>All your work in place</HeaderTextBar>}

        <div className={'z-100 flex justify-center items-center'}>
          <Modal
            open={showPasscodeEntry}
            title={`${
              !forgotPrompt
                ? 'This Notebook is Passcode Protected'
                : 'Change Your Passcode!'
            }`}
            showHeader={true}
            showHeaderBorder={false}
            showFooter={false}
            scrollHidden={true}
            closeAction={() => {
              setShowPasscodeEntry(false);
              setForgotPrompt(false);
              setAccessMessage({message: ''});
            }}>
            <div className="w-full flex justify-center">
              {!forgotPrompt ? (
                <div className="w-full">
                  <FormInput
                    dataCy="notebook-passcode-input"
                    value={passcodeInput}
                    type={'password'}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                    }}
                    id="passcode"
                    name="passcode"
                    label={'Enter Your Passcode:'}
                    placeHolder={'****'}
                    className={`w-full my-2`}
                    isRequired
                  />
                  {Boolean(accessMessage.message) &&
                    Boolean(accessMessage.textClass.startsWith('text-red')) && (
                      <Error message={accessMessage.message} />
                    )}
                  <div className="flex items-center mt-2 gap-4 justify-end">
                    <Buttons
                      dataCy="notebook-passcode-cancel"
                      label={'Cancel'}
                      transparent
                      size="middle"
                      onClick={() => {
                        setShowPasscodeEntry(false);
                        setForgotPrompt(false);
                        setAccessMessage({message: ''});
                      }}
                    />
                    <Buttons
                      dataCy="notebook-passcode-submit"
                      label={'Submit'}
                      size="middle"
                      onClick={handlePrivateSectionAccess}
                    />
                  </div>
                  <p
                    onClick={() => handleForgotPasscode()}
                    className={`cursor-pointer hover:underline hover:iconoclast:text-500 hover:curate:text-500 mt-4 mb-2 text-center text-xs iconoclast:text-main curate:text-main`}>
                    Forgot Passcode?
                  </p>
                </div>
              ) : (
                <ChangePasscode
                  fromWhere={'notebook'}
                  handleForgotPasscode={handleForgotPasscode}
                />
              )}
            </div>
          </Modal>
        </div>

        <div className="mx-auto md:max-w-none lg:max-w-192 2xl:max-w-256">
          <div className="my-8">
            <SectionTitleV3
              title={
                !isTeacher
                  ? 'Your ' + anthologyDict[userLanguage]['TITLE']
                  : studentName + "'s " + anthologyDict[userLanguage]['TITLE']
              }
              fontSize="xl"
              withButton={
                roomId ? (
                  <div className="w-auto flex items-end justify-end">
                    <a
                      className="w-auto hover:underline iconoclast:text-main curate:text-main"
                      href={`/dashboard/classroom/${roomId}`}>
                      Go back to classroom
                    </a>
                  </div>
                ) : (
                  false
                )
              }
              fontStyle="semibold"
              extraContainerClass="px-6"
              borderBottom
              extraClass="leading-6 text-gray-900"
            />
            <EmptyViewWrapper
              wrapperClass={`min-h-24 pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4`}
              revealContents={true}>
              <RoomView
                studentAuthId={studentAuthID}
                studentEmail={studentEmail}
                roomIdList={roomCardIds}
                mainSection={mainSection}
                sectionRoomID={sectionRoomID}
                studentImage={studentImage}
                sectionTitle={sectionTitle}
                handleSectionSelect={handleSectionSelect}
                isTeacher={isTeacher}
              />
            </EmptyViewWrapper>
          </div>

          <EmptyViewWrapper
            wrapperClass={`min-h-24 py-4 overflow-hidden mb-4`}
            revealContents={sectionRoomID !== 'none' || !loading}
            fallbackContents={
              <p className="text-center text-lg text-gray-500">
                Please select a notebook above to view your data
              </p>
            }>
            <TabView
              viewEditMode={viewEditMode}
              handleEditToggle={handleEditToggle}
              updateJournalContent={updateJournalDataContent}
              mainSection={mainSection}
              sectionRoomID={sectionRoomID}
              sectionTitle={sectionTitle}
              subSection={subSection}
              setSubSection={setSubSection}
              tab={tab}
              setTab={setTab}
              createTemplate={journalEntryData}
              currentContentObj={journalEntryData}
              allStudentData={allStudentData}
              setAllStudentData={setAllStudentData}
              allExerciseData={allExerciseData.filter(Boolean)}
              classNotebook={classNotebook}
              setClassNotebook={setClassNotebook}
              allUniversalClassData={allUniversalClassData}
              setAllUniversalClassData={setAllUniversalClassData}
              allUniversalJournalData={allUniversalJournalData}
              setAllUniversalJournalData={setAllUniversalJournalData}
            />
          </EmptyViewWrapper>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Anthology;
