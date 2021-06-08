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
  universalLessonPlan: [],
  universalLessonPages: [],
};

export const UniversalLessonBuilderProvider = ({children}: any) => {
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const addULBHandler = (pageId: string, newPageContent: PagePart) => {
    // find current page object from universalLessonPages array
    let currentPage = universalLessonDetails.universalLessonPages.find(
      (page: any) => page.id === pageId
    );

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
        universalLessonDetails,
        setUniversalLessonDetails,
        addFromULBHandler: addULBHandler,
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
