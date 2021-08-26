import React, {useContext, useEffect, useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import {API, graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customQueries from '../../../customGraphql/customQueries';

import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';

import HeroBanner from '../../Header/HeroBanner';
import AnthologyContent from './AnthologyContent';
import {getAsset} from '../../../assets';
import {
  StudentExerciseData,
  UniversalJournalData,
  UniversalLessonStudentData,
} from '../../../interfaces/UniversalLessonInterfaces';
import {nanoid} from 'nanoid';
import {Auth} from '@aws-amplify/auth';
import {useParams} from 'react-router-dom';
import {MenuIcon} from '@heroicons/react/outline';
import {Transition} from '@headlessui/react';
import Loader from '../../Atoms/Loader';
import Modal from '../../Atoms/Modal';
import FormInput from '../../Atoms/Form/FormInput';

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '';
  dataID: string;
  option?: number;
  recordID?: string;
};

const Anthology = () => {
  const {
    state,
    lessonState,
    lessonDispatch,
    dispatch,
    userLanguage,
    theme,
    clientKey,
  } = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);
  const {authId} = state.user;
  const urlParams: any = useParams();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
  }, []);

  // ##################################################################### //
  // ##################### CRUD STUDENT EXERCISE DATA #################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~ STORAGE ~~~~~~~~~~~~~~~ //
  const [allStudentData, setAllStudentData] = useState<UniversalLessonStudentData[]>([]);
  const [allExerciseData, setAllExerciseData] = useState<UniversalJournalData[]>([]);

  // ~~~~~~~~~~~~~~~~~ GET ~~~~~~~~~~~~~~~~~ //
  const [studentDataLoaded, setStudentDataLoaded] = useState<boolean>(false);

  const getStudentData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    // console.log('getOrCreateData - user - ', user);

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
    } finally {
    }
  };

  useEffect(() => {
    // TODO: adding entrydata type with an additional map is bad coding...
    if (allStudentData.length > 0) {
      const allExerciseEntryData = allStudentData.reduce(
        (acc: UniversalJournalData[], val: UniversalLessonStudentData) => {
          const adaptedExerciseEntries = val.exerciseData.map((exercise: any) => {
            return {
              id: exercise.id,
              studentID: val.studentID,
              studentAuthID: val.studentAuthID,
              studentEmail: val.studentEmail,
              feedbacks: exercise.feedbacks || [],
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
        },
        []
      );
      setAllExerciseData(allExerciseEntryData);
    }
  }, [allStudentData]);

  const updateStudentData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    const selectStudentDataRecord = allStudentData.find(
      (record: any) => record.id === journalEntryData.recordID
    );

    try {
      let newExerciseData = {
        id: selectStudentDataRecord.id,
        exerciseData: selectStudentDataRecord.exerciseData.map((exercise: any) => {
          if (exercise.id === journalEntryData.id) {
            return {...exercise, entryData: journalEntryData.entryData};
          } else {
            return exercise;
          }
        }),
      };

      let updatedStudentData: any = await API.graphql(
        graphqlOperation(mutations.updateUniversalLessonStudentData, {
          input: newExerciseData,
        })
      );
    } catch (e) {
      console.error('error updating writing exercise - ', e);
    } finally {
      //
    }
  };

  // ##################################################################### //
  // ##################### CRUD JOURNAL & CLASS NOTES #################### //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~ STORAGE ~~~~~~~~~~~~~~~ //
  const [allUniversalJournalData, setAllUniversalJournalData] = useState<
    UniversalJournalData[]
  >([]);
  const [journalEntryData, setJournalEntryData] = useState<UniversalJournalData>({
    id: '',
    studentID: '',
    studentAuthID: '',
    studentEmail: '',
    type: 'journal-entry',
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

  // ~~~~~~~~~~~~ GET OR CREATE ~~~~~~~~~~~~ //
  const [universalJournalDataLoaded, setUniversalJournalDataLoaded] = useState<boolean>(
    false
  );
  const [notesChanged, setNotesChanged] = useState<boolean>(false);
  const [saveInProgress, setSaveInProgress] = useState<boolean>(false);

  const listUniversalJournalData = async () => {
    const {lessonID} = urlParams;
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
    } catch (e) {
      console.error('error listing journal data - ', e);
    } finally {
      setUniversalJournalDataLoaded(true);
    }
  };

  const createJournalData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

    try {
      const input = {
        studentID: studentAuthId,
        studentAuthID: studentAuthId,
        studentEmail: email,
        type: journalEntryData.type,
        entryData: journalEntryData.entryData,
      };

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
    const user = await Auth.currentAuthenticatedUser();
    const studentAuthId = user.username;
    const email = user.attributes.email;

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
    } catch (e) {
      console.error('error updating journal data - ', e);
    } finally {
      // console.log('updated journal data...');
      if (notesChanged) setNotesChanged(false);
      if (saveInProgress) setSaveInProgress(false);
    }
  };

  const deleteJournalData = async () => {
    try {
      const deleteJournalData: any = await API.graphql(
        graphqlOperation(mutations.deleteUniversalJournalData, {
          input: {id: viewEditMode.dataID},
        })
      );
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
    if (!notesChanged) setNotesChanged(true);
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
      studentID: '',
      studentAuthID: '',
      studentEmail: '',
      type: 'journal-entry',
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
        if (viewEditMode.mode === 'edit' && viewEditMode.dataID !== '') {
          await selectJournalData();
        } else if (viewEditMode.mode === 'save') {
          await handleResetJournalEntry();
          await updateJournalData();
          await listUniversalJournalData();
        } else if (viewEditMode.mode === 'savenew') {
          await createJournalData();
          await handleResetJournalEntry();
          await listUniversalJournalData();
        } else if (viewEditMode.mode === 'delete' && viewEditMode.option === 1) {
          await deleteJournalData();
          await listUniversalJournalData();
        } else if (viewEditMode.mode === '') {
          await handleResetJournalEntry();
        }
      } else {
        if (viewEditMode.mode === 'edit' && viewEditMode.dataID !== '') {
          await selectJournalData();
        } else if (viewEditMode.mode === 'save') {
          await handleResetJournalEntry();
          await updateStudentData();
          await getStudentData();
        } else if (viewEditMode.mode === '') {
          await handleResetJournalEntry();
        }
      }
    };

    manageSaveAndCreate();
  }, [viewEditMode]);

  // ##################################################################### //
  // #################### DISPLAY CONTENT BASED ON TAB ################### //
  // ##################################################################### //
  const [tab, setTab] = useState(0);
  const [subSection, setSubSection] = useState<string>('Journal');

  const filteredJournalContent =
    allUniversalJournalData?.length > 0
      ? allUniversalJournalData.reduce(
          (acc: UniversalJournalData[], data: UniversalJournalData) => {
            if (subSection === 'Journal' && data.type === 'journal-entry') {
              return [...acc, data];
            } else if (subSection === 'Notes' && data.type === 'class-note') {
              return [...acc, data];
            } else {
              return acc;
            }
          },
          []
        )
      : [];

  const {EditQuestionModalDict} = useDictionary(clientKey);

  const Content = (
    <AnthologyContent
      // loadingContent={loadingContent}
      onCancel={() => {}}
      viewEditMode={viewEditMode}
      handleEditToggle={handleEditToggle}
      updateJournalContent={updateJournalDataContent}
      subSection={subSection}
      createTemplate={journalEntryData}
      currentContentObj={journalEntryData}
      content={subSection !== 'Work' ? filteredJournalContent : allExerciseData}
    />
  );

  const [studentSentiments, setStudentSentiments] = useState([]);

  const EditComment = ({show, setShow}: any) => {
    const [backstory, setBackstory] = useState(show.comment);
    return (
      show.show && (
        <Modal
          title="Edit Backstory"
          closeAction={() => setShow({show: false, comment: '', emotion: ''})}
          showHeader={true}
          showFooter={false}>
          <div className="min-w-96 min-h-32">
            <FormInput
              rows={5}
              showCharacterUsage
              className={'mb-2'}
              maxLength={144}
              textarea
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
              placeHolder={`Tell us why were/are you ${show.emotion}`}
            />
            <div className="flex items-center justify-end mt-4">
              <Buttons
                btnClass="py-1 px-8 text-xs ml-2"
                label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                onClick={() => {}}
              />
            </div>
          </div>
        </Modal>
      )
    );
  };

  const SentimentView = () => {
    const [nextToken, setNextToken] = useState<string>('');
    const [loadingSentiments, setLoadingSentiments] = useState(false);

    const fetchSentiments = async () => {
      try {
        setLoadingSentiments(true);
        let payload: any = {personAuthID: authId, limit: 6};
        if (nextToken) {
          payload.nextToken = nextToken;
        }
        const res: any = await API.graphql(
          graphqlOperation(customQueries.listPersonSentimentss, payload)
        );
        if (res && res.data && res.data.listPersonSentimentss) {
          setNextToken(res.data.listPersonSentimentss.nextToken);
          setStudentSentiments(res.data.listPersonSentimentss.items);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSentiments(false);
      }
    };
    const onLoadMore = () => {
      fetchSentiments();
    };

    useEffect(() => {
      if (studentSentiments.length === 0) {
        fetchSentiments();
      }
    }, []);

    const getGIFlinkByName = (name: string) => {
      switch (name) {
        case 'awful':
          return 'angry';
        case 'bad':
          return 'sad';
        case 'okay':
          return 'neutral';
        case 'good':
          return 'happy';
        case 'great':
          return 'excited';
        default:
          return 'happy';
      }
    };

    const [view, setView] = useState('emoji');
    // Modal state for comment edit
    const [showEditModal, setShowEditModal] = useState({
      show: false,
      emotion: '',
      comment: '',
    });
    return (
      <div className="mt-8 transition-all min-h-96">
        <EditComment show={showEditModal} setShow={setShowEditModal} />
        <div className="text-lg flex items-center justify-between my-4 px-8">
          <div className="w-auto" />
          <span className="mt-2 block text-xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {/* Add this to dict */}
            How are you doing today?
          </span>
          <span
            className="w-auto"
            title={`Show ${view === 'table' ? 'emoji' : 'table'} view`}>
            <MenuIcon
              onClick={() => setView(view === 'table' ? 'emoji' : 'table')}
              className="block h-6 w-6 cursor-pointer"
              aria-hidden="true"
            />
          </span>
        </div>
        <div className="h-full">
          <Transition
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            appear
            show={loadingSentiments}>
            <div className="flex h-96 items-center justify-center text-center">
              <Loader className="text-gray-500 text-lg" />
            </div>
          </Transition>

          <Transition
            enter="transform transition ease-in-out duration-500"
            enterFrom="-translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transform transition ease-in-out duration-700"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="-translate-x-full opacity-0"
            show={view === 'table'}
            className=""
            role="table">
            <div className="flex flex-col">
              <div className="">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="overflow-hidden border-2 border-gray-200 sm:rounded-lg">
                    <table className=" min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-in
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Backstory
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>

                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentSentiments.map((sentiment, sentimentIdx) => (
                          <tr
                            key={sentiment.email}
                            className={
                              sentimentIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }>
                            <td className="px-6 py-4 whitespace-nowrap capitalize text-sm font-medium text-gray-900">
                              {sentiment.responseText || 'happy'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sentiment.comment || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sentiment.date}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowEditModal({
                                    show: true,
                                    emotion: sentiment.responseText || 'happy',
                                    comment: sentiment.comment,
                                  });
                                }}
                                className={`cursor-pointer iconoclast:curate-600 hover:curate:text-900 iconoclast:text-600 hover:iconoclast:text-900 `}>
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <Transition
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            show={view === 'emoji'}
            as="ul"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            role="list">
            {studentSentiments.map((s) => (
              <li
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal({
                    show: true,
                    emotion: s.responseText || 'happy',
                    comment: s.comment,
                  });
                }}
                className="col-span-1 flex flex-col text-center items-center justify-center">
                <img
                  src={`${window.location.origin}/emojis/${getGIFlinkByName(
                    s.responseText
                  )}.gif`}
                  alt={s.name}
                  title={s.name}
                  className="h-32 w-32 transform hover:scale-110 transition-all duration-100 cursor-pointer"
                />
                <span className="w-auto text-gray-500 text-sm">Aug 25, 2021</span>
              </li>
            ))}
          </Transition>
        </div>
      </div>
    );
  };

  const tabs = [
    {
      index: 0,
      title: anthologyDict[userLanguage].TABS.A,
      id: 'Journal',
      content: Content,
    },
    {
      index: 1,
      title: anthologyDict[userLanguage].TABS.B,
      id: 'Work',
      content: Content,
    },
    {
      index: 2,
      title: anthologyDict[userLanguage].TABS.C,
      id: 'Notes',
      content: Content,
    },
  ];

  const handleTabClick = async (tab: number, e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;

    setViewEditMode({...viewEditMode, mode: ''});
    setTab(tab);

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
      }
    }
  };

  // ##################################################################### //
  // ###################### LOGIC FOR DATA FETCHING ###################### //
  // ##################################################################### //

  useEffect(() => {
    if (subSection === 'Journal' || subSection === 'Notes') {
      if (!universalJournalDataLoaded) {
        listUniversalJournalData();
      }
    }
  }, []);

  useEffect(() => {
    if (subSection === 'Journal' || subSection === 'Notes') {
      if (!universalJournalDataLoaded) {
        listUniversalJournalData();
      }
    } else {
      if (!studentDataLoaded) {
        getStudentData();
      }
    }
  }, [subSection]);

  return (
    <React.Fragment>
      <div>
        <HeroBanner imgUrl={notebookBanner} title={'Notebook'} />
      </div>
      <div className="px-10">
        <div
          className={`w-full mx-auto flex flex-col justify-between items-center z-10 -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
          <h2 className={`text-base text-center font-semibold`}>
            All your work in place
          </h2>
        </div>

        <div className="mx-auto max-w-256">
          <SectionTitleV3
            fontSize="2xl"
            fontStyle="bold"
            extraContainerClass="px-10"
            extraClass="leading-6 text-gray-900"
            withButton={
              tab === 0 && (
                <Buttons
                  Icon={FaEdit}
                  customStyles={{width: '14rem'}}
                  label={anthologyDict[userLanguage].ACTIONS.CREATE}
                  onClick={() => handleEditToggle('create', '')}
                  type="button"
                />
              )
            }
            title={anthologyDict[userLanguage].TITLE}
          />
          <div
            className={` min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
            <UnderlinedTabs
              hideTooltip
              activeTab={tab}
              tabs={tabs}
              updateTab={handleTabClick}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Anthology;
