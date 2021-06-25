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
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const [selectedPageID, setSelectedPageID] = useState<string>('page_2');

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
    pageId: string,
    pageContentId: string,
    partContentId: string
  ) => {
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
          ...content
        },
      ],
    }));
  }

  useEffect(() => {
    setUniversalLessonDetails(exampleUniversalLesson);
  }, []);

  return (
    <UniversalLessonBuilderContext.Provider
      value={{
        previewMode,
        setPreviewMode,
        newBlockSeqId,
        setNewBlockSeqId,
        getCurrentPageIdx,
        universalLessonDetails,
        selectedPageID,
        setSelectedPageID,
        getCurrentPage,
        theme,
        setUniversalLessonDetails,
        enableDnD,
        setEnableDnD,
        addFromULBHandler: addULBHandler,
        addNewPageHandler,
        updateMovableList,
        getPartContent,
        getPageContent,
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
