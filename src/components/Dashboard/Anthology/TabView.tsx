import React, {useContext, useState} from 'react';
import {FaEdit} from 'react-icons/fa';

import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';

import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';

import AnthologyContent, {ContentCardProps} from './AnthologyContent';
import {UniversalJournalData} from '../../../interfaces/UniversalLessonInterfaces';
import AnthologyUnderlinedTabs from './AnthologyUnderlinedTabs';
import EmptyViewWrapper from './EmptyViewWrapper';

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
}: ContentCardProps) => {
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);

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

  const pickClassContent = () => {
    if (mainSection === 'Class' && sectionRoomID !== '') {
      if (subSection !== 'Work') {
        return filteredJournalContent;
      } else {
        return allExerciseData;
      }
    } else if (mainSection === 'Private') {
      return filteredJournalContent;
    } else {
      return [];
    }
  };

  const Content = (
    <AnthologyContent
      // loadingContent={loadingContent}
      onCancel={() => {}}
      viewEditMode={viewEditMode}
      handleEditToggle={handleEditToggle}
      updateJournalContent={updateJournalContent}
      subSection={subSection}
      createTemplate={createTemplate}
      currentContentObj={currentContentObj}
      content={pickClassContent()}
      allUniversalJournalData={allUniversalJournalData}
      setAllUniversalJournalData={setAllUniversalJournalData}
      allStudentData={allStudentData}
      setAllStudentData={setAllStudentData}
    />
  );

  // ~~~~~~~~~~~~~~~~~ TABS ~~~~~~~~~~~~~~~~ //

  const CLASS_TABS = [
    {
      index: 0,
      title: anthologyDict[userLanguage].TABS.B,
      id: 'Work',
      content: Content,
    },
    {
      index: 1,
      title: anthologyDict[userLanguage].TABS.C,
      id: 'Notes',
      content: Content,
    },
  ];

  const JOURNAL_TABS = [
    {
      index: 0,
      title: anthologyDict[userLanguage].TABS.A,
      id: 'Journal',
      content: Content,
    },
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
    <EmptyViewWrapper revealContents={mainSection !== ''}>
      <SectionTitleV3
        fontSize="2xl"
        fontStyle="bold"
        extraContainerClass="h-16 px-10"
        extraClass="leading-6 text-gray-900"
        withButton={
          subSection === 'Journal' && (
            <Buttons
              Icon={FaEdit}
              customStyles={{width: '14rem'}}
              label={anthologyDict[userLanguage].ACTIONS.CREATE}
              onClick={() => handleEditToggle('create', '')}
              type="button"
            />
          )
        }
        title={getTitle()}
      />
      <div className={` min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
        <AnthologyUnderlinedTabs
          hideTooltip
          activeTab={tab}
          mainSection={mainSection}
          tabs={mainSection === 'Class' ? CLASS_TABS : JOURNAL_TABS}
          handleTabSelect={handleTabSelect}
        />
      </div>
    </EmptyViewWrapper>
  );
};

export default TabView;
