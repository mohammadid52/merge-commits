import React, {useContext, useEffect, useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import {API, graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';

import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';

import HeroBanner from '../../Header/HeroBanner';
import AnthologyContent from './AnthologyContent';
import {getAsset} from '../../../assets';
import {UniversalJournalData} from '../../../interfaces/UniversalLessonInterfaces';
import {nanoid} from 'nanoid';
import {Auth} from '@aws-amplify/auth';
import {useParams} from 'react-router-dom';

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '';
  dataID: string;
  option: number;
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
  const urlParams: any = useParams();
  const themeColor = getAsset(clientKey, 'themeClassName');
  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
  }, []);

  // ##################################################################### //
  // ######################## LOADED STUDENT DATA ######################## //
  // ##################################################################### //

  /**
   * This section is currently emptied out because
   * the data-structure for student data is different
   * Now it follows the UniversalLessonStudentData structure
   */

  const [loadingContent, setLoadingContent] = useState(false);

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
    const selectExisting = allUniversalJournalData.find(
      (journalObj: any) => journalObj.id === viewEditMode.dataID
    );
    setJournalEntryData({
      id: selectExisting.id,
      studentID: selectExisting.studentID,
      studentAuthID: selectExisting.studentAuthID,
      studentEmail: selectExisting.studentEmail,
      feedbacks: selectExisting.feedbacks,
      entryData: selectExisting.entryData,
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
  });

  const handleEditToggle = (
    editMode: 'view' | 'edit' | 'create' | 'save' | 'savenew' | 'delete' | '',
    dataID: string,
    option?: number
  ) => {
    setViewEditMode({mode: editMode, dataID: dataID, option: option | 0});
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
  useEffect(() => {
    const manageSaveAndCreate = async () => {
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
    };
    manageSaveAndCreate();
  }, [viewEditMode]);

  // ##################################################################### //
  // #################### DISPLAY CONTENT BASED ON TAB ################### //
  // ##################################################################### //
  const [tab, setTab] = useState(0);
  const [subSection, setSubSection] = useState<string>('Journal');

  const filteredContent =
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
      content={subSection !== 'Work' ? filteredContent : []}
      getContentObjIndex={() => 0}
    />
  );

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

  const handleTabClick = (tab: number, e: React.MouseEvent) => {
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

  return (
    <React.Fragment>
      <div>
        <HeroBanner imgUrl={notebookBanner} title={'Notebook'} />
      </div>
      <div className="px-10">
        <div
          className={`w-full mx-auto flex flex-col justify-between items-center z-50 -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
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
