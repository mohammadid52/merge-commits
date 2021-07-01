import {find, findIndex, get, includes, keys, update} from 'lodash';
import React, {useContext, createContext, useState, useEffect} from 'react';
import {exampleUniversalLesson} from '../components/Lesson/UniversalLessonBuilder/example_data/exampleUniversalLessonData';
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

export const UniversalLessonBuilderProvider = ({children}: any) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [enableDnD, setEnableDnD] = useState<boolean>(false);
  const [builderTheme, setBuilderTheme] = useState<'light' | 'dark'>('dark');
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);
  const [universalLessonsList, setUniversalLessonsList] = useState<UniversalLesson[]>([]);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const [selectedPageID, setSelectedPageID] = useState<string>('page_2');
  const [selectedLessonID, setSelectedLessonID] = useState<string>('');

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
    console.log('universalLessonDetails: ----> ', universalLessonDetails.lessonPlan);

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

  return (
    <UniversalLessonBuilderContext.Provider
      value={{
        builderTheme,
        setBuilderTheme,
        previewMode,
        setPreviewMode,
        selectedLessonID,
        setSelectedLessonID,
        newBlockSeqId,
        setNewBlockSeqId,
        getCurrentPageIdx,
        universalLessonDetails,
        selectedPageID,
        activeTab,
        setActiveTab,
        setSelectedPageID,
        getCurrentPage,
        theme,
        setUniversalLessonDetails,
        setEnableDnD,
        addFromULBHandler: addULBHandler,
        addNewPageHandler,
        updateMovableList,
        getPartContent,
        getPageContent,
        enableDnD,
        universalLessonsList,
        setUniversalLessonsList,
        themeTextColor: builderTheme === 'light' ? 'text-dark-gray' : 'text-white',
        themeBackgroundColor: builderTheme === 'light' ? 'bg-dark-gray' : 'bg-white',
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
