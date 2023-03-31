import {FaEdit} from 'react-icons/fa';

import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';

import Buttons from 'atoms/Buttons';

import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
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
import {filter, orderBy} from 'lodash';
import {IoIosJournal} from 'react-icons/io';
import {stringToHslColor} from 'utilities/strings';
import {Tabs, TabsProps} from 'antd';

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
  const {clientKey, state, userLanguage, theme} = useGlobalContext();

  const themeColor = getAsset(clientKey, 'themeClassName');
  const {anthologyDict} = useDictionary();

  // ~~~~~~~~~~~~~~~ CONTENT ~~~~~~~~~~~~~~~ //

  const filteredJournalContent =
    allUniversalJournalData && allUniversalJournalData?.length > 0
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
  const removeDuplicatesAndSort = (arr: any) => {
    let result: any[] = [];
    arr.forEach((item: any) => {
      if (!result.find((i: any) => i.id === item.id)) {
        result.push(item);
      }
    });

    result = orderBy(result, ['updatedAt'], 'desc');

    return result;
  };

  const pickClassContent = () => {
    if (mainSection === 'Class' && sectionRoomID !== '') {
      if (subSection == 'Work') {
        return filteredClassContent;
      } else {
        return filteredJournalContent;
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
      content={removeDuplicatesAndSort(pickClassContent())}
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

  const CLASS_TABS: TabsProps['items'] = [
    {
      key: '1',
      label: anthologyDict[userLanguage].TABS.B,
      children: WrittenContent,
      id: 'Work'
    },
    {
      key: '2',
      label: anthologyDict[userLanguage].TABS.C,
      children: WrittenContent,
      id: 'Notes'
    },
    {
      key: '3',
      label: anthologyDict[userLanguage].TABS.D,
      children: (
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
      ),
      id: 'Uploads'
    }
  ];

  const JOURNAL_TABS: TabsProps['items'] = [
    {
      key: '1',
      label: 'Check-In',
      id: 'checkIn',
      children: <SentimentTab />
    },
    {
      key: '2',
      label: anthologyDict[userLanguage].TABS.A,
      id: 'Journal',
      children: WrittenContent
    }
  ];

  const items = mainSection === 'Class' ? CLASS_TABS : JOURNAL_TABS;

  const handleTabSelect = (activeKey: string) => {
    // get id of tab by activeKey
    const tabSubSection = items.find((item) => item.key === activeKey)?.id;
    // setTab(index);
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
        <div className="w-auto" id="anthology_tabs">
          <div
            className={`w-full h-14 leading-6 text-gray-900 flex flex-row justify-between items-center`}>
            <div
              className={`relative border-b-0 border-gray-200 shadow px-4 w-auto bg-white rounded-t-lg h-full flex flex-row justify-start items-center`}>
              <IoIosJournal
                style={{color: stringToHslColor(sectionRoomID)}}
                className=" my-auto mr-2 w-auto h-auto fill-current"
                size={24}
              />

              <h2
                className={`text-sm mb-0 md:text-lg 2xl:text-xl font-semibold leading-6 text-gray-900`}>
                {getTitle()}
              </h2>
            </div>
            <AnimatedContainer
              className="w-auto"
              show={subSection === 'Journal' && tab === 1}>
              {subSection === 'Journal' && tab === 1 && (
                <Buttons
                  Icon={FaEdit}
                  label={anthologyDict[userLanguage].ACTIONS.CREATE}
                  onClick={() => handleEditToggle?.('create', '')}
                  type="button"
                />
              )}
            </AnimatedContainer>
          </div>
          <div
            className={`w-full min-h-48 p-4 overflow-hidden bg-white rounded-b-lg mb-12`}>
            <Tabs
              animated
              defaultActiveKey="1"
              onChange={handleTabSelect}
              items={items}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TabView;
