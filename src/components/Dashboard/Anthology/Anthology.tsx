import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';

const Anthology = () => {
  const { state } = useContext(GlobalContext);

  const [studentData, setStudentData] = useState<any>();

  const [subSection, setSubSection] = useState<string>('Stories');

  useEffect(() => {
    const listStudentData = async () => {
      try {
        const studentDataFetch: any = await API.graphql(
          graphqlOperation(queries.listStudentDatas, {filter: {studentAuthID: {eq: state.user.authId}}})
        );
        const response = await studentDataFetch;
        const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;
        console.log('Anthology student data fetch: ', arrayOfResponseObjects)
        // console.log('Anthology student data reduce: ', studentDataGroupPick(arrayOfResponseObjects))
      } catch (e) {
        console.error('Anthology student data fetch error: ', e);
      }
    };

    if(state.user.authId){
      listStudentData();
    }
  }, [state.user.authId]);

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
        subSectionList={['Stories', 'Poems','Journal']}
      />
      <SectionTitle title={subSection} />
      {/*
        This section shows rows of:
          - Lessons
          - Journal entries
          - User written stories & poems
    */}
      <AnthologyContent subSection={subSection} content={studentData} />
    </React.Fragment>
  );
};

export default Anthology;
