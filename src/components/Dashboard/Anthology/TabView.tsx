import React from 'react';
import {FaEdit} from 'react-icons/fa';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import Buttons from 'atoms/Buttons';

import {getAsset} from 'assets';
import {ViewEditMode} from 'components/Dashboard/Anthology/Anthology';
import AnthologyUnderlinedTabs from 'components/Dashboard/Anthology/AnthologyUnderlinedTabs';
import SentimentTab from 'components/Dashboard/Anthology/SentimentTab';
import UploadsTab from 'components/Dashboard/Anthology/UploadsTab';
import WrittenContentTab from 'components/Dashboard/Anthology/WrittenContentTab';
import {
  UniversalClassData,
  UniversalJournalData,
  UniversalLessonStudentData
} from 'interfaces/UniversalLessonInterfaces';
import {IoIosJournal} from 'react-icons/io';
import {IconContext} from 'react-icons/lib';
import {stringToHslColor} from 'utilities/strings';
import {filter} from 'lodash';

export interface ITabParentProps {
  handleEditToggle?: (
    editMode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | 'delete' | '',
    dataID: string,
    option?: number | 0,
    recordID?: string
  ) => void;
  viewEditMode?: ViewEditMode;
  mainSection?: string;
  sectionRoomID?: string;
  sectionTitle?: string;
  subSection?: string;
  setSubSection?: any;
  tab?: any;
  setTab?: any;
  onCancel?: any;
  viewModeView?: any;
}

export interface ITabViewProps extends ITabParentProps {
  handleEditUpdate?: (e: any) => void;
  updateJournalContent?: (
    html: string,
    targetType: string,
    idx?: number,
    domID?: string
  ) => void;
  createTemplate?: any;
  currentContentObj?: UniversalJournalData | UniversalClassData;
  content?: UniversalJournalData[] | UniversalClassData[];
  allStudentData?: UniversalLessonStudentData[];
  setAllStudentData?: any;
  allExerciseData?: any[];
  allUniversalJournalData?: UniversalJournalData[];
  allUniversalClassData?: UniversalClassData[];
  classNotebook?: any;
  setClassNotebook?: any;
  setAllUniversalJournalData?: any;
  setAllUniversalClassData?: any;
}

const TabView = ({
  viewEditMode,
  handleEditToggle,
  updateJournalContent,
  mainSection,
  sectionRoomID,
  sectionTitle,
  subSection,
  setSubSection,
  tab,
  setTab,
  createTemplate,
  currentContentObj,
  allStudentData,
  setAllStudentData,
  allExerciseData,
  allUniversalJournalData,
  setAllUniversalJournalData,
  classNotebook,
  allUniversalClassData,
  setAllUniversalClassData
}: ITabViewProps) => {
  // ~~~~~~~~~~ CONTEXT SEPARATION ~~~~~~~~~ //
  const gContext = useGlobalContext();
  const state = gContext.state;
  const userLanguage = gContext.userLanguage;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;

  const themeColor = getAsset(clientKey, 'themeClassName');
  const {anthologyDict} = useDictionary();

  // ~~~~~~~~~~~~~~~ CONTENT ~~~~~~~~~~~~~~~ //

  const filteredJournalContent =
    allUniversalJournalData?.length > 0
      ? allUniversalJournalData.reduce(
          (acc: UniversalJournalData[], data: UniversalJournalData) => {
            if (subSection === 'Journal' && data.type === 'journal-entry') {
              return [...acc, data];
            } else if (
              subSection === 'Notes' &&
              data.type === 'class-note' &&
              data.roomID === sectionRoomID
            ) {
              return [...acc, data];
            } else {
              return acc;
            }
          },
          []
        )
      : [];

  const filteredClassContent = filter(allExerciseData, ['roomID', sectionRoomID]);

  const pickClassContent = () => {
    if (mainSection === 'Class' && sectionRoomID !== '') {
      if (subSection == 'Work') {
        return filteredClassContent;
      } else {
        return allExerciseData;
      }
    } else if (mainSection === 'Private') {
      return filteredJournalContent;
    } else {
      return [];
    }
  };

  const WrittenContent = (
    <WrittenContentTab
      // loadingContent={loadingContent}
      onCancel={() => {}}
      viewEditMode={viewEditMode}
      handleEditToggle={handleEditToggle}
      updateJournalContent={updateJournalContent}
      mainSection={mainSection}
      subSection={subSection}
      createTemplate={createTemplate}
      currentContentObj={currentContentObj}
      content={pickClassContent()}
      classNotebook={classNotebook}
      allUniversalJournalData={allUniversalJournalData}
      setAllUniversalJournalData={setAllUniversalJournalData}
      allStudentData={allStudentData}
      setAllStudentData={setAllStudentData}
      allUniversalClassData={allUniversalClassData}
      setAllUniversalClassData={setAllUniversalClassData}
    />
  );
  // ~~~~~~~~~~~~~~~~~ TABS ~~~~~~~~~~~~~~~~ //

  const CLASS_TABS = [
    {
      index: 0,
      title: anthologyDict[userLanguage].TABS.B,
      id: 'Work',
      content: WrittenContent
    },
    // {
    //   index: 1,
    //   title: anthologyDict[userLanguage].TABS.C,
    //   id: 'Notes',
    //   content: WrittenContent
    // },
    {
      index: 1,
      title: anthologyDict[userLanguage].TABS.D,
      id: 'Uploads',
      content: (
        <UploadsTab
          personAuthID={state?.user?.authId}
          personEmail={state?.user?.email}
          sectionRoomID={sectionRoomID}
          themeColor={theme?.textColor[themeColor]}
          onCancel={() => {}}
          viewEditMode={viewEditMode}
          handleEditToggle={handleEditToggle}
          mainSection={mainSection}
          subSection={subSection}
        />
      )
    }
  ];

  const JOURNAL_TABS = [
    {
      index: 0,
      title: 'Check-In',
      id: 'checkIn',
      content: <SentimentTab />
    },
    {
      index: 1,
      title: anthologyDict[userLanguage].TABS.A,
      id: 'Journal',
      content: WrittenContent
    }
  ];

  const handleTabSelect = (index: number, tabSubSection: string) => {
    setTab(index);
    setSubSection(tabSubSection);
  };

  const getTitle = () => {
    if (sectionTitle !== '') {
      if (mainSection === 'Class') {
        return sectionTitle + ' ' + anthologyDict[userLanguage].TITLE;
      } else {
        return sectionTitle;
      }
    } else {
      return anthologyDict[userLanguage].NO_SELECTED;
    }
  };

  return (
    <>
      {subSection !== 'none' && (
        <>
          <div
            className={`w-full h-14 leading-6 text-gray-900 flex flex-row justify-between items-center`}>
            <div
              className={`border-b-0 border-gray-200 shadow px-4 w-auto bg-white rounded-t-lg h-full flex flex-row justify-start items-center`}>
              <IconContext.Provider
                value={{
                  className: `relative`
                }}>
                <IoIosJournal
                  style={{color: stringToHslColor(sectionRoomID)}}
                  className="absolute my-auto mr-2 w-auto h-auto fill-current"
                  size={24}
                />
              </IconContext.Provider>

              <h2
                className={`text-sm md:text-lg 2xl:text-xl font-semibold leading-6 text-gray-900`}>
                {getTitle()}
              </h2>
            </div>
            {subSection === 'Journal' && tab === 1 && (
              <Buttons
                Icon={FaEdit}
                customStyles={{width: '14rem'}}
                label={anthologyDict[userLanguage].ACTIONS.CREATE}
                onClick={() => handleEditToggle('create', '')}
                type="button"
              />
            )}
          </div>
          <div
            className={`w-full min-h-48 pb-4 overflow-hidden bg-white rounded-b-lg shadow mb-12`}>
            <AnthologyUnderlinedTabs
              hideTooltip
              activeTab={tab}
              mainSection={mainSection}
              tabs={mainSection === 'Class' ? CLASS_TABS : JOURNAL_TABS}
              handleTabSelect={handleTabSelect}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TabView;
