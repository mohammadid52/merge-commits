import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import { AnthologyContentType } from '../../../customHooks/timer';

const Anthology = () => {
  const { state } = useContext(GlobalContext);
  const [studentData, setStudentData] = useState<AnthologyContentType[]>([]);
  const [subSection, setSubSection] = useState<string>('Stories');

  useEffect(() => {
    const listStudentData = async () => {
      try {
        const studentDataFetch: any = await API.graphql(
          graphqlOperation(queries.listStudentDatas, { filter: { studentAuthID: { eq: state.user.authId } } }),
        );
        const response = await studentDataFetch;
        const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;
        const reducedAnthologyContent = arrayOfResponseObjects.reduce((acc: AnthologyContentType[], contentObj: any) => {
          if (contentObj.anthologyContent) {
            return [...acc, ...contentObj.anthologyContent];
          } else {
            return acc;
          }
        }, []);
        setStudentData(reducedAnthologyContent);
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

  const subSectionKey: any = {
    'Stories': 'story',
    'Poems': 'poem',
    'Journal': 'journal',
  };

  const filterContentBySubsection = () => {
    return studentData.filter((contentObj: AnthologyContentType) => {
      if(contentObj.type === subSectionKey[subSection]) return contentObj;
    });
  };

  // useEffect(() => {
  //   console.log('studentData -> ', studentData)
  //   // if (studentData && studentData.length > 0) console.log(filterContentBySubsection());
  //   // (filterContentBySubsection());
  // }, [studentData]);

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
      <AnthologyContent subSection={subSection} content={studentData.length > 0 && filterContentBySubsection()} />
    </React.Fragment>
  );
};

export default Anthology;
