import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customMutations from '../../../customGraphql/customMutations';

export interface AnthologyContentInterface {
  type: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
}

export interface AnthologyMapItem extends AnthologyContentInterface {
  studentDataID: string;
  status: string;
  syllabusLessonID: string;
  studentID: string;
  studentAuthID: string;
  updatedAt: string;
}

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | '';
  studentDataID: string;
}

const Anthology = () => {
  const { state } = useContext(GlobalContext);
  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  // const [rawData, setRawData] = useState();

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Stories');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({ mode: '', studentDataID: '' });

  // Useeffect to load student data and process it
  useEffect(() => {
    const listStudentData = async () => {
      try {
        const studentDataFetch: any = await API.graphql(
          graphqlOperation(queries.listStudentDatas, { filter: { studentAuthID: { eq: state.user.authId } } }),
        );
        const response = await studentDataFetch;
        const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;
        const reducedAnthologyContent = arrayOfResponseObjects.reduce((acc: AnthologyMapItem[], contentObj: any) => {
          if (contentObj.anthologyContent) {
            const mapIdToItem = contentObj.anthologyContent.map((contentMapItem: AnthologyContentInterface) => {
              return { ...contentMapItem,
                status: contentObj.status,
                syllabusLessonID: contentObj.syllabusLessonID,
                studentID: contentObj.studentID,
                studentAuthID: contentObj.studentAuthID,
                studentDataID: contentObj.id,
                updatedAt: contentObj.updatedAt };
            });
            return [...acc, ...mapIdToItem];
          } else {
            return acc;
          }
        }, []);
        // setRawData(arrayOfResponseObjects);
        setStudentData(reducedAnthologyContent);
      } catch (e) {
        console.error('Anthology student data fetch error: ', e);
      }
    };

    if (state.user.authId) {
      listStudentData();
    }
  }, [state.user.authId]);

  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const { id, value } = e.target as HTMLInputElement;
    const [key, type, studentDataID] = id.split('_');
    const updatedStudentData = studentData.reduce((acc: AnthologyMapItem[], contentObj: any) => {
      if (contentObj.type === type && contentObj.studentDataID === studentDataID) {
        return [...acc, { ...contentObj, [key]: value }];
      } else {
        return [...acc, contentObj];
      }
    }, []);
    setStudentData(updatedStudentData);
  };

  const handleEditToggle = (editMode: 'view' | 'edit' | '', studentDataID: string) => {
    setViewEditMode({ mode: editMode, studentDataID: studentDataID });
  };

  // Function group to handle section-switching
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
    return studentData.filter((contentObj: AnthologyMapItem) => {
      if (contentObj.type === subSectionKey[subSection]) return contentObj;
    });
  };

  // Function group for mutating database
  useEffect(() => {
    const anthologySave = async () => {
      const getAnthologyContentByStudentDataID = studentData.filter((contentObj: AnthologyMapItem) => {
        return contentObj.studentDataID === viewEditMode.studentDataID;
      });
      const removeHelperProperties = getAnthologyContentByStudentDataID.map((contentObj: AnthologyMapItem) => {
        return {
          type: contentObj.type,
          title: contentObj.title,
          subTitle: contentObj.subTitle,
          description: contentObj.description,
          content: contentObj.content,
        };
      });

      try {
        const studentDataUpdate: any = await API.graphql(
          graphqlOperation(mutations.updateStudentData, {
            input: {
              id: getAnthologyContentByStudentDataID[0].studentDataID,
              status: getAnthologyContentByStudentDataID[0].status,
              syllabusLessonID: getAnthologyContentByStudentDataID[0].syllabusLessonID,
              studentID: getAnthologyContentByStudentDataID[0].studentID,
              studentAuthID: getAnthologyContentByStudentDataID[0].studentAuthID,
              anthologyContent: removeHelperProperties
            },
          }),
        );
      } catch (e) {
        console.error('studentDataUpdate: ', e);
      } finally {
        setViewEditMode({ mode: '', studentDataID: '' });
      }
    };

    if (viewEditMode.mode === 'save') {
      anthologySave();
    }

  }, [viewEditMode]);

  // RETURN
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
        subSectionList={['Stories', 'Poems', 'Journal']}
      />
      <SectionTitle title={subSection} />
      {/*
        This section shows rows of:
          - Lessons
          - Journal entries
          - User written stories & poems
    */}
      <AnthologyContent viewEditMode={viewEditMode} handleEditToggle={handleEditToggle}
                        handleEditUpdate={handleEditUpdate} subSection={subSection}
                        content={studentData.length > 0 && filterContentBySubsection()} />
    </React.Fragment>
  );
};

export default Anthology;
