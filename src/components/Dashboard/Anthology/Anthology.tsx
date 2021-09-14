import React, {useContext, useEffect, useState} from 'react';
import {FaSpinner} from 'react-icons/fa';
import {API, graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customQueries from '../../../customGraphql/customQueries';

import HeroBanner from '../../Header/HeroBanner';
import {getAsset} from '../../../assets';
import {
  UniversalJournalData,
  UniversalLessonStudentData,
} from '../../../interfaces/UniversalLessonInterfaces';
import {nanoid} from 'nanoid';
import {Auth} from '@aws-amplify/auth';
import {useParams} from 'react-router-dom';

import TabView from './TabView';
import RoomView from './RoomView';
import EmptyViewWrapper from './EmptyViewWrapper';
import {IconContext} from 'react-icons/lib';
import usePrevious from '../../../customHooks/previousProps';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import Modal from '../../Atoms/Modal';
import FormInput from '../../Atoms/Form/FormInput';
import Buttons from '../../Atoms/Buttons';

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '';
  dataID: string;
  option?: number;
  recordID?: string;
};

const Anthology = () => {
  const {state, dispatch, userLanguage, theme, clientKey} = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);
  const urlParams: any = useParams();
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
    };
    initialDataFetch();
  }, []);

  // ##################################################################### //
  // ############################ MAIN STORAGE ########################### //
  // ##################################################################### //

  const [allStudentData, setAllStudentData] = useState<UniversalLessonStudentData[]>([]);
  const [allExerciseData, setAllExerciseData] = useState<UniversalJournalData[]>([]);

  const [allUniversalJournalData, setAllUniversalJournalData] = useState<
    UniversalJournalData[]
  >([]);

  // ##################################################################### //
  // ##################### CRUD STUDENT EXERCISE DATA #################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~ //
  const [studentDataLoaded, setStudentDataLoaded] = useState<boolean>(false);

  const getStudentData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
          hasExerciseData: {eq: true},
        },
      };

      const studentData: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonStudentDatas, listFilter)
      );
      // existing student rows
      const studentDataRows = studentData.data.listUniversalLessonStudentDatas.items;
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
                  type: entry.domID.includes('title') ? 'header' : 'content',
                };
              }),
              recordID: val.id,
              updatedAt: val?.updatedAt,
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
      }),
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
            exerciseData: newExerciseData.exerciseData,
          },
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
    studentID: state.user.authId,
    studentAuthID: state.user.authId,
    studentEmail: state.user.studentEmail,
    type: 'journal-entry',
    feedbacks: [''],
    shared: false,
    entryData: [
      {
        domID: `title_${nanoid(4)}`,
        type: 'header',
        input: 'Default Title',
      },
      {
        domID: `note_${nanoid(4)}`,
        type: 'content',
        input: '<p>Enter notes here...</p>',
      },
    ],
  });

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [universalJournalDataLoaded, setUniversalJournalDataLoaded] = useState<boolean>(
    false
  );

  const listUniversalJournalData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;

    try {
      const listFilter = {
        filter: {
          studentAuthID: {eq: studentAuthId},
        },
      };

      const journalEntryData: any = await API.graphql(
        graphqlOperation(queries.listUniversalJournalDatas, listFilter)
      );
      const journalEntryDataRows = journalEntryData.data.listUniversalJournalDatas.items;

      if (journalEntryDataRows?.length > 0) {
        console.log('anthology - universalJournalDatas exist ', journalEntryDataRows);

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
      studentID: journalEntryData.studentID,
      studentAuthID: journalEntryData.studentAuthID,
      studentEmail: journalEntryData.studentEmail,
      type: journalEntryData.type,
      entryData: journalEntryData.entryData,
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

    try {
      const input = {
        id: journalEntryData.id,
        studentID: journalEntryData.studentID,
        studentAuthID: journalEntryData.studentAuthID,
        studentEmail: journalEntryData.studentEmail,
        entryData: journalEntryData.entryData,
      };
      const updateJournalData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalJournalData, {input})
      );
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
          input: {id: viewEditMode.dataID},
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
      updatedAt: selectExisting?.updatedAt,
    });
  };

  const updateJournalDataContent = (html: string, targetType: string) => {
    const updatedNotesData = {
      ...journalEntryData,
      entryData: journalEntryData.entryData.map((entryObj: any) => {
        if (entryObj.type === targetType) {
          return {...entryObj, input: html};
        } else {
          return entryObj;
        }
      }),
    };
    // console.log('input - ', html);
    setJournalEntryData(updatedNotesData);
  };

  // ##################################################################### //
  // ################ TOGGLE EDITING & ADDING NEW JOURNAL ################ //
  // ##################################################################### //
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({
    mode: '',
    dataID: '',
    option: 0,
    recordID: '',
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
      recordID: recordID || '',
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
          input: 'Default Title',
        },
        {
          domID: `note_${nanoid(4)}`,
          type: 'content',
          input: '<p>Enter notes here...</p>',
        },
      ],
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
    if (allStudentData.length > 0 && sectionRoomID !== '') {
      reduceRoomExerciseData(sectionRoomID);
    }
  }, [allStudentData, sectionRoomID]);

  // ~~~~~~~~~~~~~~ ROOM CARDS ~~~~~~~~~~~~~ //

  const [notebookLoaded, setNotebookLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (studentDataLoaded && universalJournalDataLoaded) {
      setNotebookLoaded(true);
    }
  }, [studentDataLoaded, universalJournalDataLoaded]);

  const [roomCardIds, setRoomCardIds] = useState<string[]>([]);
  useEffect(() => {
    const mergeAll = [...allStudentData, ...allUniversalJournalData];
    if (mergeAll.length > 0) {
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
      if (uniqueIds.length > 0) {
        setRoomCardIds(uniqueIds);
      }
    } else {
    }
  }, [allStudentData, allUniversalJournalData]);

  // ~~~~~~ PRIVATE ROOM VERIFICATION ~~~~~~ //

  const [showPasscodeEntry, setShowPasscodeEntry] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [accessMessage, setAccessMessage] = useState<any>({message: '', textClass: ''});

  const handlePrivateSectionAccess = async () => {
    try {
      setAccessMessage({message: 'Verifying', textClass: 'text-indigo-500'});
      const personPasscode: any = await API.graphql(
        graphqlOperation(customQueries.getPersonPasscode, {
          email: state?.user?.email,
          authId: state?.user?.authId,
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
    } else if (section === 'Private Notebook') {
      setShowPasscodeEntry(true);
    }
  };

  return (
    <React.Fragment>
      <div>
        <HeroBanner imgUrl={notebookBanner} title={'Notebooks'} />
      </div>
      <div className="px-10">
        <div
          className={`w-full mx-auto flex flex-col justify-between items-center z-10 -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
          <h2 className={`text-base text-center font-semibold`}>
            All your work in place
          </h2>
        </div>

        {showPasscodeEntry && (
          <div className={'z-100 flex justify-center items-center'}>
            <Modal
              showHeader={true}
              showHeaderBorder={false}
              showFooter={false}
              closeAction={() => setShowPasscodeEntry(false)}>
              <FormInput
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
                label={'Submit'}
                btnClass="w-full px-6 py-4 my-2"
                onClick={handlePrivateSectionAccess}
              />
            </Modal>
          </div>
        )}

        <div className="mx-auto max-w-256">
          <div className="my-8">
            <SectionTitleV3
              title={anthologyDict[userLanguage]['TITLE_CONTAINER']}
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
                    className: `relative mr-4 animate-spin ${theme.textColor[themeColor]}`,
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
