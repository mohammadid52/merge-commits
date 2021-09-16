import update from 'lodash/update';
import findIndex from 'lodash/findIndex';
import React, {useContext, createContext, useState} from 'react';
import {useHistory} from 'react-router';
import {UniversalLesson} from '../interfaces/UniversalLessonInterfaces';
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
  const [newBlockSeqId, setNewBlockSeqId] = useState(null);

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(
    initialUniversalLessonData
  );

  const [selectedPageID, setSelectedPageID] = useState<string>('page_2');

  const [lessonPlanFields, setLessonPlanFields] = useState(INITIAL_STATE);

  // Getters

  const getCurrentPage = (id: string) =>
    universalLessonDetails.lessonPlan.find((page: any) => page.id === id);

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

  const [blockConfig, setBlockConfig] = useState<{
    section: string;
    position: number;
    targetId: string;
    classString?: string;
    inputObj?: any;
    isEditingMode?: boolean;
  }>({
    section: 'pageContent',
    position: 0,
    targetId: '',
  });

  const [activeTab, setActiveTab] = useState<number>(0);
  const [fetchingLessonDetails, setFetchingLessonDetails] = useState(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  /**
   * Specifically for the NEWLESSONPLAN modal
   */
  const [newLessonPlanShow, setNewLessonPlanShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selID, setSelID] = useState({pageContentID: '', partContentID: ''});
  const [selIDForHover, setSelIDForHover] = useState({
    pageContentID: '',
    partContentID: '',
  });

  const [toolbarOnTop, setToolbarOnTop] = useState(true);

  const [suggestionModal, setSuggestionModal] = useState({
    show: false,
    data: [{title: '', content: [{id: '', text: ''}]}],
    selectedResponse: [],
    idx: 0,
  });

  const history = useHistory();

  /**
   *
   * @param lessonId
   * @param pageId
   * @NOTE Use this function only for ULB navigation
   */
  const pushUserToThisId = (lessonId: string, pageId: string) => {
    try {
      history.push(
        `/dashboard/lesson-builder/lesson/page-builder?lessonId=${lessonId}&pageId=${pageId}`
      );
    } catch (error) {
      console.log(
        '@pushUserToThisId: Error while navigating user to other page: ' + error
      );
    }
  };

  const [savingStatus, setSavingStatus] = useState<
    'initial' | 'loaded' | 'loading' | 'failed'
  >('initial');

  return (
    <UniversalLessonBuilderContext.Provider
      value={{
        previewMode,
        setPreviewMode,

        suggestionModal,
        setSuggestionModal,
        editMode,
        toolbarOnTop,
        setToolbarOnTop,
        selID,
        pushUserToThisId,
        setSelID,
        setEditMode,
        savingStatus,
        setSavingStatus,
        newBlockSeqId,
        setNewBlockSeqId,
        universalLessonDetails,
        selectedPageID,
        lessonPlanFields,
        selIDForHover,
        setSelIDForHover,
        setLessonPlanFields,
        activeTab,
        setActiveTab,
        setSelectedPageID,
        getCurrentPage,
        newLessonPlanShow,
        blockConfig, // move this to Builder wrapper
        setBlockConfig, // move this to Builder wrapper
        setNewLessonPlanShow,
        setUniversalLessonDetails,
        addNewPageHandler,
        updateMovableList,

        fetchingLessonDetails,
        setFetchingLessonDetails,
      }}>
      {children}
    </UniversalLessonBuilderContext.Provider>
  );
};
export const useULBContext = () => useContext(UniversalLessonBuilderContext);
