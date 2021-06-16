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
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const [selectedPageID, setSelectedPageID] = useState<string>('page_1');

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

        setUniversalLessonDetails,
        addFromULBHandler: addULBHandler,
        getPartContent,
        getPageContent,
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
