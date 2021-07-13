import {findIndex, get, update} from 'lodash';
import React, {useContext, createContext, useState} from 'react';
import {UniversalLesson, PagePart} from '../interfaces/UniversalLessonInterfaces';
export const UniversalLessonBuilderContext = createContext(null);

const initialUniversalLessonData: UniversalLesson = {
  id: '',
  summary: '',
  designers: [''],
  teachers: [''],
  categories: [''],
  lessonPlan: [],
};

interface FieldsInterface {
  description: string;
  title: string;
  label: string;
  instructions: string;
  instructionsHtml: any;
  interactionType: string[];
  tags?: string[];
  estTime: string;
  classwork: boolean;
}
const INITIAL_STATE: FieldsInterface = {
  title: '',
  label: '',
  instructions: '',
  instructionsHtml: '',
  description: '', // ignore this field
  interactionType: [],
  tags: [],
  estTime: '1 min',
  classwork: true,
};

export const UniversalLessonBuilderProvider = ({children}: any) => {
  const [enableDnD, setEnableDnD] = useState<boolean>(false);
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const [selectedPageID, setSelectedPageID] = useState<string>('page_2');

  const [selectedLessonID, setSelectedLessonID] = useState<string>('');
  const [lessonPlanFields, setLessonPlanFields] = useState(INITIAL_STATE);

  // Getters

  const getCurrentPage = (id: string) =>
    universalLessonDetails.lessonPlan.find((page: any) => page.id === id);

  const getCurrentPageIdx = (id: string) =>
    findIndex(universalLessonDetails.lessonPlan, (page: any) => page.id === id);

  const getPageContent = (pageIdx: number) =>
    get(universalLessonDetails, `lessonPlan[${pageIdx}].pageContent`, []);

  const getPartContent = (pageIdx: number, pageContentIdx: number) =>
    get(
      universalLessonDetails,
      `lessonPlan[${pageIdx}].pageContent[${pageContentIdx}].partContent`,
      []
    );

  const addULBHandler = (pageId: string, newPageContent: PagePart) => {
    // find current page object from lessonPlan array
    let currentPage = getCurrentPage(pageId);
    // find current page content from pageContent array
    let pageContent = currentPage.pageContent;
    if (pageContent && pageContent.length > 0) {
      pageContent.splice(newBlockSeqId + 1, 0, newPageContent);

      setUniversalLessonDetails({...universalLessonDetails});
    }
  };

  const theme = {
    bg: 'bg-gray-800',
  };

  const updateMovableList = (
    items: any,
    section: string = 'pageContent',
    pageId?: string,
    pageContentId?: string,
    partContentId?: string
  ) => {
    switch (section) {
      case 'page':
        update(universalLessonDetails, 'lessonPlan', () => items);
        break;
      case 'pageContent':
        const pageIdx = findIndex(
          universalLessonDetails.lessonPlan,
          (item: any) => item.id === pageId
        );
        const pageContentIdx = findIndex(
          universalLessonDetails.lessonPlan[pageIdx].pageContent,
          (item: any) => item.id === pageContentId
        );

        const PATH = `lessonPlan[${pageIdx}].pageContent[${pageContentIdx}].partContent`;

        update(universalLessonDetails, PATH, () => items);
        break;
    }

    setUniversalLessonDetails({...universalLessonDetails});
  };

  const addNewPageHandler = (content: any) => {
    setUniversalLessonDetails((prevDetails) => ({
      ...prevDetails,
      lessonPlan: [
        ...prevDetails.lessonPlan,
        {
          enabled: true,
          open: true,
          active: true,
          class: '',
          displayMode: 'SELF',
          ...content,
        },
      ],
    }));
  };

  const [activeTab, setActiveTab] = useState<number>(0);
  const [fetchingLessonDetails, setFetchingLessonDetails] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  /**
   * Specifically for the NEWLESSONPLAN modal
   */
  const [newLessonPlanShow, setNewLessonPlanShow] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <UniversalLessonBuilderContext.Provider
      value={{
        previewMode,
        setPreviewMode,
        selectedLessonID,
        editMode,
        setEditMode,
        setSelectedLessonID,
        newBlockSeqId,
        setNewBlockSeqId,
        getCurrentPageIdx,
        universalLessonDetails,
        selectedPageID,
        lessonPlanFields,
        setLessonPlanFields,
        activeTab,
        setActiveTab,
        setSelectedPageID,
        getCurrentPage,
        theme,
        newLessonPlanShow,
        setNewLessonPlanShow,
        setUniversalLessonDetails,
        setEnableDnD,
        addFromULBHandler: addULBHandler,
        addNewPageHandler,
        updateMovableList,
        getPartContent,
        getPageContent,
        enableDnD,
        fetchingLessonDetails,
        setFetchingLessonDetails,
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
