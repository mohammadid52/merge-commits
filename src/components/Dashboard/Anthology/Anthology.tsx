import React, { useContext, useEffect, useState } from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { API, graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';

export interface AnthologyContentInterface {
  type: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
}

export interface AnthologyMapItem extends AnthologyContentInterface {
  studentDataID?: string;
  lessonProgress?: string;
  currentLocation?: string;
  status: string;
  syllabusLessonID: string;
  studentID: string;
  studentAuthID: string;
  updatedAt?: string;
}

export type ViewEditMode = {
  mode: 'view' | 'edit' | 'save' | 'create' | 'savenew' | '';
  studentDataID: string;
}

const Anthology = () => {
  const { state, userLanguage, clientKey } = useContext(GlobalContext);
  const { anthologyDict } = useDictionary(clientKey);
  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [newStudentData, setNewStudentData] = useState<AnthologyMapItem>({
    type: 'story',
    title: '',
    subTitle: '',
    description: '',
    content: '',
    lessonProgress: '0',
    currentLocation: '0',
    status: 'ACTIVE',
    syllabusLessonID: '',
    studentID: state.user.email,
    studentAuthID: state.user.authId,
  });

  // For switching sections & knowing which field to edit
  const [subSection, setSubSection] = useState<string>('Stories');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({ mode: '', studentDataID: '' });

  // TOP Function to load student data
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
            return {
              ...contentMapItem,
              status: contentObj.status,
              syllabusLessonID: contentObj.syllabusLessonID,
              studentID: contentObj.studentID,
              studentAuthID: contentObj.studentAuthID,
              studentDataID: contentObj.id,
              updatedAt: contentObj.updatedAt,
            };
          });
          return [...acc, ...mapIdToItem];
        } else {
          return acc;
        }
      }, []);
      setStudentData(reducedAnthologyContent);
    } catch (e) {
      console.error('Anthology student data fetch error: ', e);
    }
  };

  // Useeffect to load student data and process it
  useEffect(() => {
    const initializeStudentData = async()=> {
      if (state.user.authId) {
        await listStudentData();
      }
    }
    initializeStudentData();
  }, [state.user.authId]);

  // Useeffect to initialize newStudentData
  useEffect(() => {
    if (studentData.length > 0) {
      setNewStudentData({ ...newStudentData, syllabusLessonID: customSyllabusLessonID() });
    }
  }, [studentData]);

  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const { id, value } = e.target as HTMLInputElement;
    const [key, type, studentDataID] = id.split('_');
    switch (viewEditMode.mode) {
      case 'edit':
        const updatedStudentData = studentData.reduce((acc: AnthologyMapItem[], contentObj: any) => {
          if (contentObj.type === type && contentObj.studentDataID === studentDataID) {
            return [...acc, { ...contentObj, [key]: value }];
          } else {
            return [...acc, contentObj];
          }
        }, []);
        setStudentData(updatedStudentData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewStudentData = { ...newStudentData, [key]: value };
          setNewStudentData(updatedNewStudentData);
        }
        break;
    }
  };

  const handleEditToggle = (editMode: 'view' | 'edit' | 'create' | 'save' | 'savenew' | '', studentDataID: string) => {
    setViewEditMode({ mode: editMode, studentDataID: studentDataID });
  };

  // Function group to handle section-switching
  const handleTabClick = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
        setNewStudentData({ ...newStudentData, type: subSectionKey[id] });
      }
    }
  };

  const subSectionKey: any = {
    'Stories': 'story',
    'Poems': 'poem',
    'Journal': 'journal',
  };

  // Function group for filtering the studentData/anthology content
  const customSyllabusLessonID = () => {
    return `custom_${state.user.authId}_${filterAnthologyContentWithSimilarSyllabusLessonID('custom').length}`;
  };

  const filterAnthologyContentBySubsection = studentData.filter((contentObj: AnthologyMapItem) => {
    if (contentObj.type === subSectionKey[subSection]) return contentObj;
  });

  const filterAnthologyContentWithSimilarSyllabusLessonID = (inputSyllabusLessonID: string) => studentData.filter((contentObj: AnthologyMapItem) => {
    if (contentObj.syllabusLessonID.includes(inputSyllabusLessonID)) return contentObj;
  });

  const getAnthologyContentByStudentDataID = studentData.find((contentObj: AnthologyMapItem) => {
    return contentObj.studentDataID === viewEditMode.studentDataID;
  });

  const filterAnthologyContentByType = (inputType: string) => studentData.filter((contentObj: AnthologyMapItem) => {
    return contentObj.type === inputType;
  });

  // Function group for mutating database
  const anthologySave = async () => {
    const removeHelperProperties = {
      type: getAnthologyContentByStudentDataID.type,
      title: getAnthologyContentByStudentDataID.title,
      subTitle: getAnthologyContentByStudentDataID.subTitle,
      description: getAnthologyContentByStudentDataID.description,
      content: getAnthologyContentByStudentDataID.content,
    };

    try {
      const studentDataUpdate: any = await API.graphql(
        graphqlOperation(mutations.updateStudentData, {
          input: {
            id: getAnthologyContentByStudentDataID.studentDataID,
            status: getAnthologyContentByStudentDataID.status,
            syllabusLessonID: getAnthologyContentByStudentDataID.syllabusLessonID,
            studentID: state.user.email,
            studentAuthID: state.user.authId,
            anthologyContent: removeHelperProperties,
          },
        }),
      );
    } catch (e) {
      console.error('studentDataUpdate: ', e);
    } finally {
      setViewEditMode({ mode: '', studentDataID: '' });
    }
  };

  const anthologyCreate = async () => {
    const removeHelperProperties = {
      type: newStudentData.type,
      title: newStudentData.title,
      subTitle: newStudentData.subTitle,
      description: newStudentData.description,
      content: newStudentData.content,
    };
    try {
      const studentDataCreate: any = await API.graphql(graphqlOperation(mutations.createStudentData, {
        input:
          {
            lessonProgress: newStudentData.lessonProgress,
            currentLocation: newStudentData.currentLocation,
            status: newStudentData.status,
            syllabusLessonID: newStudentData.syllabusLessonID,
            studentID: state.user.email,
            studentAuthID: state.user.authId,
            anthologyContent: removeHelperProperties,
          },
      }));
    } catch (e) {
      console.error('studentDataCreate: Anthology: ', e);
    } finally {
      setViewEditMode({ mode: '', studentDataID: '' });
    }
  };

  // UseEffect for monitoring save/create new changes and calling functions
  useEffect(() => {
    const manageSaveAndCreate = async() => {
      if (viewEditMode.mode === 'save') {
        await anthologySave();
      } else if (viewEditMode.mode === 'savenew') {
        await anthologyCreate();
        await listStudentData();
      }
    }
    manageSaveAndCreate();
  }, [viewEditMode]);

  const getTranslation = Object.keys(anthologyDict[userLanguage].TABS).map((key: any) => {
    return anthologyDict[userLanguage].TABS[key];
  })

  // RETURN
  return (
    <React.Fragment>
      <SectionTitle title={anthologyDict[userLanguage].TITLE} />
      {/*
        Tabs to select between:
          - Lesson Data
          - Journal
          - Your Stories & Poems
    */}
      <SubSectionTabs
        subSection={subSection}
        handleTabClick={handleTabClick}
        subSectionList={['Journal', 'Stories', 'Poems']}
        translations={getTranslation}
      />
      {/*<SectionTitle title={subSection} />*/}
      {/*
        This section shows rows of:
          - ADD NEW ENTRY
          - Journal entries
          - Stories
          - Poems
    */}
      <AnthologyContent viewEditMode={viewEditMode} handleEditToggle={handleEditToggle}
                        handleEditUpdate={handleEditUpdate} subSection={subSection}
                        createTemplate={newStudentData}
                        content={studentData.length > 0 && filterAnthologyContentBySubsection} />
    </React.Fragment>
  );
};

export default Anthology;
