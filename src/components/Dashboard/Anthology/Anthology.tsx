import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Auth} from '@aws-amplify/auth';
import * as customMutations from '@customGraphql/customMutations';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {FaSpinner} from 'react-icons/fa';
import {v4 as uuidV4} from 'uuid';
import {IconContext} from 'react-icons/lib';
import {getAsset} from '../../../assets';
import {useGlobalContext} from '../../../contexts/GlobalContext';
import * as customQueries from '../../../customGraphql/customQueries';
import useDictionary from '../../../customHooks/dictionary';
import usePrevious from '../../../customHooks/previousProps';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import {
  UniversalClassData,
  UniversalJournalData,
  UniversalLessonStudentData
} from '../../../interfaces/UniversalLessonInterfaces';
import Buttons from '../../Atoms/Buttons';
import FormInput from '../../Atoms/Form/FormInput';
import Modal from '../../Atoms/Modal';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
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
}
export interface ViewEditMode {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '';
  dataID: string;
  option?: number;
  recordID?: string;
}

const Anthology = ({
  studentID,
  studentAuthID,
  studentEmail,
  studentName,
  isTeacher
}: IAnthologyProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  // const {state, dispatch, userLanguage, theme, clientKey} = useContext(GlobalContext);
  const gContext = useGlobalContext();
  const state = gContext.state;
  const dispatch = gContext.dispatch;
  const userLanguage = gContext.userLanguage;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;
  // other
  const {anthologyDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  // ##################################################################### //
  // ########################### INITIALIZATION ########################## //
  // ##################################################################### //

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
  }, []);

  useEffect(() => {
    const initialDataFetch = async () => {
      await listUniversalJournalData();
      await getStudentData();
      await getUniversalArchiveData();
      await getUniversalLessonWritingExercises();
    };
    initialDataFetch();
  }, []);

  // ##################################################################### //
  // ############################ MAIN STORAGE ########################### //
  // ##################################################################### //

  const [allStudentData, setAllStudentData] = useState<UniversalLessonStudentData[]>([]);
  const [allExerciseData, setAllExerciseData] = useState<UniversalJournalData[]>([]);
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
        filter: {
          studentAuthID: {eq: studentAuthID},
          hasExerciseData: {eq: true}
        }
      };

      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      );
      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentData.items;
      if (studentDataRows?.length > 0) {
        setAllStudentData(studentDataRows);
      }
      setStudentDataLoaded(true);
    } catch (e) {
      //
      setStudentDataLoaded(true);
    } finally {
    }
  };

  const reduceRoomExerciseData = (roomID: string) => {
    const allExerciseEntryData = allStudentData.reduce(
      (acc: UniversalJournalData[], val: UniversalLessonStudentData) => {
        if (val.roomID === roomID) {
          const adaptedExerciseEntries = val.exerciseData.map((exercise: any) => {
            return {
              id: exercise.id,
              studentID: val.studentID,
              studentAuthID: val.studentAuthID,
              studentEmail: val.studentEmail,
              feedbacks: exercise.feedbacks || [],
              shared: exercise?.shared || false,
              entryData: exercise.entryData.map((entry: any) => {
                return {
                  ...entry,
                  type: entry.domID.includes('title') ? 'header' : 'content'
                };
              }),
              recordID: val.id,
              updatedAt: val?.updatedAt
            };
          });
          return [...acc, ...adaptedExerciseEntries];
        } else {
          return acc;
        }
      },
      []
    );

    setAllExerciseData(allExerciseEntryData);
  };

  const updateStudentData = async () => {
    const selectStudentDataRecord = allStudentData.find(
      (record: any) => record.id === journalEntryData.recordID
    );

    const newExerciseData = {
      exerciseData: selectStudentDataRecord.exerciseData.map((exercise: any) => {
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
      let updatedStudentData: any = await API.graphql(
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
  };

  // ##################################################################### //
  // ##################### CRUD JOURNAL & CLASS NOTES #################### //
  // ##################################################################### //

  // ~~~~~~~~ LIVE JOURNAL EDIT DATA ~~~~~~~ //
  const [journalEntryData, setJournalEntryData] = useState<UniversalJournalData>({
    id: '',
    studentID: studentAuthID,
    studentAuthID: studentAuthID,
    studentEmail: studentEmail,
    type: 'journal-entry',
    feedbacks: [''],
    shared: false,
    entryData: [
      {
        domID: `title_${nanoid(4)}`,
        type: 'header',
        input: 'Default Title'
      },
      {
        domID: `note_${nanoid(4)}`,
        type: 'content',
        input: '<p>Enter notes here...</p>'
      }
    ]
  });

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [universalJournalDataLoaded, setUniversalJournalDataLoaded] = useState<boolean>(
    false
  );

  const listUniversalJournalData = async () => {
    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthID}
        }
      };
      const listFilterIfTeacher = {
        filter: {
          studentAuthID: {eq: studentAuthID},
          shared: {eq: 'true'}
        }
      };

      const journalEntryData: any = await API.graphql(
        graphqlOperation(
          queries.listUniversalJournalData,
          isTeacher ? listFilterIfTeacher : listFilter
        )
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
    } finally {
    }
  };

  const createJournalData = async () => {
    const input = {
      id: uuidV4(),
      studentID: journalEntryData.studentID,
      studentAuthID: journalEntryData.studentAuthID,
      studentEmail: journalEntryData.studentEmail,
      type: journalEntryData.type || 'journal-entry',
      entryData: journalEntryData.entryData
    };
    // console.log('create input - ', input);
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
        const res: any = await API.graphql(
          graphqlOperation(customMutations.updateUniversalJournalData, {
            input
          })
        );
      } catch (error) {
        // if we are getting null. it means that data is missing. so we need to create a new data object
        const newJournalData = await createJournalData();
      }

      setAllUniversalJournalData(mergedJournalData);
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
      const deleteJournalData: any = await API.graphql(
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
    const selectExisting = selectSource.find(
      (journalObj: any) => journalObj.id === viewEditMode.dataID
    );
    setJournalEntryData({
      id: selectExisting.id,
      studentID: selectExisting.studentID,
      studentAuthID: selectExisting.studentAuthID,
      studentEmail: selectExisting.studentEmail,
      shared: selectExisting?.shared,
      feedbacks: selectExisting.feedbacks,
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
        entryData: journalEntryData.entryData.map((entryObj: any) => {
          if (entryObj.type === targetType) {
            return {...entryObj, input: html};
          } else {
            return entryObj;
          }
        })
      };
      // console.log('input - ', html);
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
  };

  const handleResetJournalEntry = async () => {
    setJournalEntryData({
      id: '',
      studentID: state.user.authId,
      studentAuthID: state.user.authId,
      studentEmail: state.user.email,
      type: 'journal-entry',
      shared: false,
      feedbacks: [''],
      entryData: [
        {
          domID: `title_${nanoid(4)}`,
          type: 'header',
          input: 'Default Title'
        },
        {
          domID: `note_${nanoid(4)}`,
          type: 'content',
          input: '<p>Enter notes here...</p>'
        }
      ]
    });
  };

  // UseEffect for monitoring save/create new changes and calling functions

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
          await updateStudentData();
          await updateJournalData();
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
  const [mainSection, setMainSection] = useState<string>('');
  const [sectionRoomID, setSectionRoomID] = useState<string>('');
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [subSection, setSubSection] = useState<string>('checkIn');
  const [tab, setTab] = useState<number>(0);

  const previousRoom = usePrevious(sectionRoomID);

  useEffect(() => {
    const notebookSwitchProcess = async () => {
      if (switchReady) {
        await setSwitchReady(false);
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
    if (allStudentData?.length > 0 && sectionRoomID !== '') {
      reduceRoomExerciseData(sectionRoomID);
    }
  }, [allStudentData, sectionRoomID]);

  const getUniversalArchiveData = async () => {
    try {
      const archiveData: any = await API.graphql(
        graphqlOperation(queries.listUniversalArchiveData, {
          filter: {
            studentID: {
              eq: state.user.authId
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
      const allUniversalClassData: any = await API.graphql(
        graphqlOperation(queries.listUniversalLessonWritingExcercises, {
          filter: {
            studentID: {
              eq: state.user.authId
            }
          }
        })
      );
      setAllUniversalClassData(
        allUniversalClassData.data.listUniversalLessonWritingExcercises.items
      );
    } catch (error) {
      console.error(
        '🚀 ~ file: Anthology.tsx ~ line 548 ~ getUniversalLessonWritingExcercises ~ error',
        error
      );
    }
  };

  // ~~~~~~~~~~~~~~ ROOM CARDS ~~~~~~~~~~~~~ //

  const [notebookLoaded, setNotebookLoaded] = useState<boolean>(false);
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
    } else {
    }
  }, [allStudentData, allUniversalJournalData, classNotebook, allUniversalClassData]);

  // ~~~~~~ PRIVATE ROOM VERIFICATION ~~~~~~ //

  const [showPasscodeEntry, setShowPasscodeEntry] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [accessMessage, setAccessMessage] = useState<any>({message: '', textClass: ''});
  const [forgotPrompt, setForgotPrompt] = useState<boolean>(false);
  const previousForgot = usePrevious(forgotPrompt);

  const handlePrivateSectionAccess = async () => {
    try {
      setAccessMessage({message: 'Verifying', textClass: 'text-indigo-500'});
      const personPasscode: any = await API.graphql(
        graphqlOperation(customQueries.getPersonPasscode, {
          email: state?.user?.email,
          authId: state?.user?.authId
        })
      );
      const unset = personPasscode?.data?.getPerson?.passcode === null;
      const verified = personPasscode?.data?.getPerson?.passcode === passcodeInput;

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
        setAccessMessage({message: 'Please set a passcode!', textClass: 'text-blue-500'});
        setTimeout(() => {
          setMainSection('Private');
          setSectionRoomID('private');
          setSectionTitle(`Private Notebook`);
          setSubSection('Journal');
          setTab(0);
          setShowPasscodeEntry(false);
          setPasscodeInput('');
          setAccessMessage({message: '', textClass: ''});
        }, 1000);
      } else {
        setAccessMessage({message: 'Passcode Incorrect', textClass: 'text-red-500'});
      }
    } catch (e) {
      console.error('handlePrivateSectionAccess - ', e);
    }
  };

  // ~~~~~~~~~~~ FORGOT CODE LINK ~~~~~~~~~~ //

  const handleForgotPasscode = (success?: boolean) => {
    // history.push('/dashboard/profile/passcode');
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
      setSectionTitle(roomName);
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
  };

  return (
    <React.Fragment>
      {!isTeacher && (
        <div>
          <HeroBanner imgUrl={notebookBanner} title={'Notebooks'} />
        </div>
      )}
      <div className="px-10">
        {!isTeacher && <HeaderTextBar>All your work in place</HeaderTextBar>}

        {showPasscodeEntry && (
          <div className={'z-100 flex justify-center items-center'}>
            <Modal
              title={`${
                !forgotPrompt
                  ? 'This Notebook is Passcode Protected'
                  : 'Change Your Passcode!'
              }`}
              showHeader={true}
              showHeaderBorder={false}
              showFooter={false}
              scrollHidden={true}
              closeAction={() => setShowPasscodeEntry(false)}>
              <div className=" flex justify-center">
                {!forgotPrompt ? (
                  <div>
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
                      placeHolder={''}
                      className={`w-full my-2`}
                      isRequired
                    />
                    {accessMessage.message !== '' && (
                      <p className={`${accessMessage.textClass} text-center text-xs`}>
                        {accessMessage.message}
                      </p>
                    )}
                    <Buttons
                      dataCy="notebook-passcode-submit"
                      label={'Submit'}
                      btnClass="w-full mt-2"
                      onClick={handlePrivateSectionAccess}
                    />
                    <p
                      onClick={() => handleForgotPasscode()}
                      className={`cursor-pointer hover:underline hover:text-red-600 mt-4 mb-2 text-center text-xs text-red-500`}>
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
        )}

        <div className="mx-auto md:max-w-none lg:max-w-192 2xl:max-w-256">
          <div className="my-8">
            <SectionTitleV3
              title={
                !isTeacher
                  ? 'Your ' + anthologyDict[userLanguage]['TITLE']
                  : studentName + "'s " + anthologyDict[userLanguage]['TITLE']
              }
              fontSize="xl"
              fontStyle="semibold"
              extraContainerClass="px-6"
              borderBottom
              extraClass="leading-6 text-gray-900"
            />
            <EmptyViewWrapper
              wrapperClass={`min-h-24 pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-4`}
              revealContents={notebookLoaded}
              fallbackContents={
                <IconContext.Provider
                  value={{
                    size: '1.2rem',
                    style: {},
                    className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`
                  }}>
                  <FaSpinner />
                </IconContext.Provider>
              }>
              <RoomView
                roomIdList={roomCardIds}
                mainSection={mainSection}
                sectionRoomID={sectionRoomID}
                sectionTitle={sectionTitle}
                handleSectionSelect={handleSectionSelect}
                isTeacher={isTeacher}
              />
            </EmptyViewWrapper>
          </div>

          <EmptyViewWrapper
            wrapperClass={`min-h-24 py-4 overflow-hidden mb-4`}
            revealContents={sectionRoomID !== ''}
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
              allExerciseData={allExerciseData}
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
    </React.Fragment>
  );
};

export default Anthology;
