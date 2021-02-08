import React from 'react';
import { useState, useEffect } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';

const Anthology = () => {
  const [subSection, setSubSection] = useState<string>('LessonData');

  const handleTabClick = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
      }
    }
  };

  return (
    <React.Fragment>
      <SectionTitle title={`Anthology`} />
    {/*
        Tabs to select between:
          - Lesson Data
          - Journal
          - Your Stories & Poems
    */}
    <SubSectionTabs
      subSection={subSection}
      handleTabClick={handleTabClick}
      subSectionList={['LessonData','Journal','Stories','Poems']}
    />
    <SectionTitle title={subSection}/>
    {/*
        This section shows rows of:
          - Lessons
          - Journal entries
          - User written stories & poems
    */}
    <AnthologyContent content={subSection}/>
    </React.Fragment>
  );
};

export default Anthology;
