import React, {useContext, useEffect, useState} from 'react';
import SectionTitle from '../../Atoms/SectionTitleV2';
import SubSectionTabs from './SubSectionTabs';
import AnthologyContent from './AnthologyContent';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {API, graphqlOperation} from '@aws-amplify/api';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import * as customMutations from '../../../customGraphql/customMutations';
import useDictionary from '../../../customHooks/dictionary';
import HeroBanner from '../../Header/HeroBanner';
import {getAsset} from '../../../assets';
import SectionTitleV3 from '../../Atoms/SectionTitleV3';
import UnderlinedTabs from '../../Atoms/UnderlinedTabs';
import Buttons from '../../Atoms/Buttons';

import {FaEdit} from 'react-icons/fa';
import {initials, stringToHslColor} from '../../../utilities/strings';
import {getImageFromS3} from '../../../utilities/services';
import {BiCloudDownload} from 'react-icons/bi';
import Modal from '../../Atoms/Modal';
import Loader from '../../Atoms/Loader';

export interface AnthologyContentInterface {
  type: string;
  subType: string;
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
  idx: number;
};

const Anthology = () => {
  const {state, dispatch, userLanguage, theme, clientKey} = useContext(GlobalContext);
  const {anthologyDict} = useDictionary(clientKey);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [tab, setTab] = useState(0);

  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [newStudentData, setNewStudentData] = useState<AnthologyMapItem>({
    type: 'journal',
    subType: '',
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
  const [subSection, setSubSection] = useState<string>('Journal');
  // For editing specific poems/stories
  const [viewEditMode, setViewEditMode] = useState<ViewEditMode>({
    mode: '',
    studentDataID: '',
    idx: 0,
  });

  useEffect(() => {
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'anthology'}});
  }, []);

  // TOP Function to load student data
  const listStudentData = async () => {
    try {
      const studentDataFetch: any = await API.graphql(
        graphqlOperation(queries.listStudentDatas, {
          filter: {studentAuthID: {eq: state.user.authId}},
        })
      );
      const response = await studentDataFetch;
      const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;
      const reducedAnthologyContent = arrayOfResponseObjects.reduce(
        (acc: AnthologyMapItem[], contentObj: any) => {
          if (contentObj.anthologyContent) {
            const mapIdToItem = contentObj.anthologyContent.map(
              (contentMapItem: AnthologyContentInterface) => {
                return {
                  ...contentMapItem,
                  status: contentObj.status,
                  syllabusLessonID: contentObj.syllabusLessonID,
                  studentID: contentObj.studentID,
                  studentAuthID: contentObj.studentAuthID,
                  studentDataID: contentObj.id,
                  updatedAt: contentObj.updatedAt,
                };
              }
            );
            return [...acc, ...mapIdToItem];
          } else {
            return acc;
          }
        },
        []
      );
      setStudentData(reducedAnthologyContent);
    } catch (e) {
      console.error('Anthology student data fetch error: ', e);
    }
  };

  // Useeffect to load student data and process it
  useEffect(() => {
    const initializeStudentData = async () => {
      if (state.user.authId) {
        await listStudentData();
      }
    };
    initializeStudentData();
  }, [state.user.authId]);

  // Useeffect to initialize newStudentData
  useEffect(() => {
    setNewStudentData({...newStudentData, syllabusLessonID: customSyllabusLessonID()});
  }, [studentData]);

  // Function group to handle updating student data
  const handleEditUpdate = (e: React.ChangeEvent) => {
    const {id, value} = e.target as HTMLInputElement;
    const [key, type, studentDataID] = id.split('_');
    switch (viewEditMode.mode) {
      case 'edit':
        const updatedStudentData = studentData.reduce(
          (acc: AnthologyMapItem[], contentObj: any, idx: number) => {
            if (
              contentObj.type === type &&
              contentObj.studentDataID === studentDataID &&
              idx === viewEditMode.idx
            ) {
              return [...acc, {...contentObj, [key]: value}];
            } else {
              return [...acc, contentObj];
            }
          },
          []
        );
        setStudentData(updatedStudentData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewStudentData = {...newStudentData, [key]: value};
          setNewStudentData(updatedNewStudentData);
        }
        break;
    }
  };

  const handleWYSIWYGupdate = (id: string, value: string) => {
    const [key, type, studentDataID] = id.split('_');
    switch (viewEditMode.mode) {
      case 'edit':
        const updatedStudentData = studentData.reduce(
          (acc: AnthologyMapItem[], contentObj: any, idx: number) => {
            if (
              contentObj.type === type &&
              contentObj.studentDataID === studentDataID &&
              idx === viewEditMode.idx
            ) {
              return [...acc, {...contentObj, [key]: value}];
            } else {
              return [...acc, contentObj];
            }
          },
          []
        );
        setStudentData(updatedStudentData);
        break;
      case 'create':
        if (viewEditMode.mode === 'create') {
          const updatedNewStudentData = {...newStudentData, [key]: value};
          setNewStudentData(updatedNewStudentData);
        }
        break;
    }
  };

  const handleEditToggle = (
    editMode: 'view' | 'edit' | 'create' | 'save' | 'savenew' | '',
    studentDataID: string,
    idx: number
  ) => {
    setViewEditMode({mode: editMode, studentDataID: studentDataID, idx: idx});
  };

  const onCancel = (type: string) => {
    setNewStudentData({...newStudentData, content: '', title: ''});
  };

  // Function group to handle section-switching
  const handleTabClick = (tab: number, e: React.MouseEvent) => {
    const {id} = e.target as HTMLElement;
    setViewEditMode({...viewEditMode, mode: ''});
    setTab(tab);

    if (id !== subSection) {
      if (id !== 'subSectionTabs') {
        setSubSection(id);
        setNewStudentData({...newStudentData, type: subSectionKey[id][0]});
      }
    }
  };

  const subSectionKey: any = {
    Journal: ['journal'],
    Work: ['poem', 'story'],
    Notes: ['notes'],
  };

  // Function group for filtering the studentData/anthology content
  const customSyllabusLessonID = () => {
    return `custom_${state.user.authId}_${
      filterAnthologyContentWithSimilarSyllabusLessonID('custom').length
    }`;
  };

  const filterAnthologyContentBySubsection = studentData.filter(
    (contentObj: AnthologyMapItem) => {
      if (subSectionKey[subSection].includes(contentObj.type)) return contentObj;
    }
  );

  const filterAnthologyContentWithSimilarSyllabusLessonID = (
    inputSyllabusLessonID: string
  ) =>
    studentData.filter((contentObj: AnthologyMapItem) => {
      if (contentObj.syllabusLessonID.includes(inputSyllabusLessonID)) return contentObj;
    });

  const getAnthologyContentByStudentDataID = studentData.find(
    (contentObj: AnthologyMapItem) => {
      return contentObj.studentDataID === viewEditMode.studentDataID;
    }
  );

  const getContentObjIndex = (contentObj: AnthologyMapItem) =>
    studentData.indexOf(contentObj);

  // Function group for mutating database
  const anthologySave = async () => {
    const removeHelperProperties = {
      type: getAnthologyContentByStudentDataID.type,
      subType: getAnthologyContentByStudentDataID.subType,
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
        })
      );
    } catch (e) {
      console.error('studentDataUpdate: ', e);
    } finally {
      setViewEditMode({mode: '', studentDataID: '', idx: 0});
    }
  };

  const anthologyCreate = async () => {
    const removeHelperProperties = {
      type: newStudentData.type,
      subType: newStudentData.subType,
      title: newStudentData.title,
      subTitle: newStudentData.subTitle,
      description: newStudentData.description,
      content: newStudentData.content,
    };

    try {
      const studentDataCreate: any = await API.graphql(
        graphqlOperation(mutations.createStudentData, {
          input: {
            lessonProgress: newStudentData.lessonProgress,
            currentLocation: newStudentData.currentLocation,
            status: newStudentData.status,
            syllabusLessonID: newStudentData.syllabusLessonID,
            studentID: state.user.email,
            studentAuthID: state.user.authId,
            anthologyContent: removeHelperProperties,
          },
        })
      );
    } catch (e) {
      console.error('studentDataCreate: Anthology: ', e);
    } finally {
      setViewEditMode({mode: '', studentDataID: '', idx: 0});
    }
  };

  // UseEffect for monitoring save/create new changes and calling functions
  useEffect(() => {
    const manageSaveAndCreate = async () => {
      if (viewEditMode.mode === 'save') {
        await anthologySave();
      } else if (viewEditMode.mode === 'savenew') {
        await anthologyCreate();
        await listStudentData();
      }
    };
    manageSaveAndCreate();
  }, [viewEditMode]);

  const getTranslation = Object.keys(anthologyDict[userLanguage].TABS).map((key: any) => {
    return anthologyDict[userLanguage].TABS[key];
  });
  const notebookBanner = getAsset(clientKey, 'dashboardBanner1');

  const Content = (
    <AnthologyContent
      viewEditMode={viewEditMode}
      handleEditToggle={handleEditToggle}
      handleEditUpdate={handleEditUpdate}
      handleWYSIWYGupdate={handleWYSIWYGupdate}
      subSection={subSection}
      createTemplate={newStudentData}
      content={studentData.length > 0 && filterAnthologyContentBySubsection}
      getContentObjIndex={getContentObjIndex}
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

  return (
    <React.Fragment>
      <div>
        <HeroBanner imgUrl={notebookBanner} title={'Notebook'} />
      </div>

      <div
        className={`${theme.section} -mt-6 mb-4 px-6 py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
        <h2 className={`text-base text-center font-semibold`}>All your work in place</h2>
      </div>

      <SectionTitleV3
        fontSize="2xl"
        fontStyle="bold"
        extraContainerClass="max-w-256"
        extraClass="leading-6 text-gray-900"
        withButton={
          tab === 0 && (
            <Buttons
              Icon={FaEdit}
              customStyles={{width: '14rem'}}
              label={anthologyDict[userLanguage].ACTIONS.CREATE}
              onClick={() =>
                handleEditToggle('create', newStudentData.syllabusLessonID, 0)
              }
              type="button"
            />
          )
        }
        title={anthologyDict[userLanguage].TITLE}
      />

      <div
        className={`mx-auto max-w-256 min-h-48 pb-4 overflow-hidden bg-white rounded-lg shadow mb-4`}>
        <UnderlinedTabs tabs={tabs} updateTab={handleTabClick} />
      </div>

      {/*
        Tabs to select between:
          - Lesson Data
          - Journal
          - Your Stories & Poems
    */}
      {/* <SubSectionTabs
        subSection={subSection}
        handleTabClick={handleTabClick}
        subSectionList={Object.keys(subSectionKey)}
        translations={getTranslation}
      /> */}
      {/*
        This section shows rows of:
          - ADD NEW ENTRY
          - Journal entries
          - Stories
          - Poems
    */}
      {/* <AnthologyContent
        viewEditMode={viewEditMode}
        handleEditToggle={handleEditToggle}
        handleEditUpdate={handleEditUpdate}
        handleWYSIWYGupdate={handleWYSIWYGupdate}
        subSection={subSection}
        createTemplate={newStudentData}
        content={studentData.length > 0 && filterAnthologyContentBySubsection}
        getContentObjIndex={getContentObjIndex}
      /> */}
    </React.Fragment>
  );
};

export default Anthology;
