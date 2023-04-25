import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import CopyCloneSlideOver from 'components/Lesson/UniversalLessonBuilder/UI/SlideOvers/CopyCloneSlideOver';
import PageLoader from 'components/Lesson/UniversalLessonBuilder/views/CoreBuilder/PageLoader';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useOverlayContext} from 'contexts/OverlayContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {getUniversalLesson} from 'customGraphql/customQueries';
import {useQuery} from 'customHooks/urlParam';
import {ULBSelectionProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage
} from 'interfaces/UniversalLessonInterfaces';
import BuilderRowComposer from 'lesson/UniversalLessonBuilder/views/CoreBuilder/BuilderRowComposer';
import {find, findIndex, isEmpty, map} from 'lodash';
import {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;
  instId: string;
  lessonId: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;

  activePageData: UniversalLessonPage;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const {
    mode,

    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,

    selectedPageID,
    setSelectedPageID,
    targetID,
    setTargetID,
    selectedPagePartID,
    updateBlockContentULBHandler,
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
    handleEditBlockContent,
    handleModalPopToggle,
    handleTagModalOpen
  } = props;
  const {
    setNewLessonPlanShow,
    fetchingLessonDetails,

    setEditMode,
    previewMode,
    pushUserToThisId,

    newLessonPlanShow
  } = useULBContext();

  const {lessonDispatch} = useGlobalContext();
  const params = useQuery(location.search);

  const pageId = params.get('pageId');

  useEffect(() => {
    if (!isEmpty(universalLessonDetails) && pageId) {
      const pageIdx = findIndex(
        universalLessonDetails.lessonPlan,
        (plan: UniversalLessonPage) => plan.id === pageId
      );
      lessonDispatch({
        type: 'SET_CURRENT_PAGE',
        payload: pageIdx >= 0 ? pageIdx : 0
      });
      lessonDispatch({
        type: 'SET_LAST_PAGE',
        payload: universalLessonDetails.lessonPlan.length - 1 === pageIdx
      });
    }
  }, [universalLessonDetails, pageId]);

  const {setShowLessonEditOverlay, setCollapseSidebarOverlay, showDataForCopyClone} =
    useOverlayContext();

  useEffect(() => {
    setCollapseSidebarOverlay(true);
  }, []);

  useEffect(() => {
    if (newLessonPlanShow || showDataForCopyClone) {
      setShowLessonEditOverlay(false);
    } else {
      if (previewMode) {
        setShowLessonEditOverlay(false);
      } else {
        setShowLessonEditOverlay(true);
      }
    }
  }, [newLessonPlanShow, previewMode, showDataForCopyClone]);

  useEffect(() => {
    if (pageId === 'open-overlay') {
      setNewLessonPlanShow(true);
      setEditMode(false);
    }
  }, [pageId]);

  /**
   * This is very important thing to implement.
   * When user type weird / wrong pageId or lessonId
   * the ULB will show normal black data page.
   * THIS SHOULD NOT HAPPEN
   */
  const checkPageIdOnLoad = () => {
    // First collect all page ids of current lesson
    const ids = map(universalLessonDetails.lessonPlan, (page) => page.id);
    // then check if current pageId is in the `ids` or not
    if (selectedPageID) {
      if (ids && ids.length > 0 && !ids.includes(selectedPageID)) {
        setSelectedPageID?.(ids[0]);
        pushUserToThisId(universalLessonDetails.id, ids[0]);
      }
    }
  };

  useEffect(() => {
    if (!fetchingLessonDetails) {
      checkPageIdOnLoad();
    }
  }, [fetchingLessonDetails]);

  const getLessonById = async (lessonId: string) => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(getUniversalLesson, {id: lessonId})
      );
      return res.data.getUniversalLesson;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getPageById = async (lessonId: string, pageId: string) => {
    const selectedLesson: UniversalLesson = await getLessonById(lessonId);
    if (selectedLesson) {
      const selectedPage = find(
        selectedLesson.lessonPlan,
        (lesson) => lesson.id === pageId
      );
      return selectedPage;
    }
    return null;
  };

  const getCloneData = async (lessonId: string, pageId: string) => {
    const selectedPage = await getPageById(lessonId, pageId);

    const replaceAllExistingIds: UniversalLessonPage = {
      ...selectedPage,
      id: uuidv4(),
      title: 'TBD',
      estTime: 1,
      tags: [],
      interactionType: [],
      description: '',
      class: '',
      // @ts-ignore
      pageContent:
        selectedPage?.pageContent && selectedPage.pageContent.length > 0
          ? map(selectedPage.pageContent, (pgContent) => ({
              ...pgContent,

              id: uuidv4(),
              partContent:
                pgContent.partContent && pgContent.partContent.length > 0
                  ? map(pgContent.partContent, (ptContent) => ({
                      ...ptContent,
                      id: uuidv4(),
                      value:
                        ptContent.value && ptContent.value.length > 0
                          ? map(ptContent.value, (ptValue) => ({
                              ...ptValue,
                              id: uuidv4(),
                              options:
                                ptValue.options && ptValue.options.length > 0
                                  ? map(ptValue.options, (opt) => ({
                                      ...opt,
                                      id: uuidv4()
                                    }))
                                  : null
                            }))
                          : []
                    }))
                  : []
            }))
          : []
    };

    return replaceAllExistingIds;
  };

  const getCopyData = async (lessonId: string, pageId: string) => {
    const selectedPage = await getPageById(lessonId, pageId);

    const replaceAllExistingIds: UniversalLessonPage = {
      ...selectedPage,
      id: uuidv4(),

      // @ts-ignore
      pageContent:
        selectedPage?.pageContent && selectedPage.pageContent.length > 0
          ? map(selectedPage.pageContent, (pgContent) => ({
              ...pgContent,

              id: uuidv4(),
              partContent:
                pgContent.partContent && pgContent.partContent.length > 0
                  ? map(pgContent.partContent, (ptContent) => ({
                      ...ptContent,
                      id: uuidv4(),

                      value:
                        ptContent.value && ptContent.value.length > 0
                          ? map(ptContent.value, (ptValue) => ({
                              ...ptValue,
                              id: uuidv4(),
                              label: ptContent.type !== 'jumbotron' ? '' : ptValue.label,
                              value:
                                ptContent.type === 'jumbotron' ||
                                ptContent.type === 'links'
                                  ? ptValue.value
                                  : '-',
                              options:
                                ptValue.options && ptValue.options.length > 0
                                  ? map(ptValue.options, (opt) => ({
                                      ...opt,
                                      text: '-',
                                      id: uuidv4()
                                    }))
                                  : null
                            }))
                          : []
                    }))
                  : []
            }))
          : []
    };

    return replaceAllExistingIds;
  };

  return (
    <div className="relative">
      <CopyCloneSlideOver getCopyData={getCopyData} getCloneData={getCloneData} />

      <div
        id="core-builder"
        // style={{minHeight: '100vh', maxHeight: '100vh'}}
        className={``}>
        {/* <LessonSlideover /> */}

        <div className={`text-white max-w-[890px] mx-auto`}>
          {fetchingLessonDetails ? (
            <PageLoader len={5} />
          ) : (
            <BuilderRowComposer
              mode={mode}
              updateBlockContentULBHandler={updateBlockContentULBHandler}
              createNewBlockULBHandler={createNewBlockULBHandler}
              deleteFromULBHandler={deleteFromULBHandler}
              updateFromULBHandler={updateFromULBHandler}
              universalLessonDetails={universalLessonDetails}
              selectedPageID={selectedPageID}
              setSelectedPageID={setSelectedPageID}
              targetID={targetID}
              setTargetID={setTargetID}
              selectedPagePartID={selectedPagePartID}
              setSelectedPagePartID={setSelectedPagePartID}
              selectedPartContentID={selectedPartContentID}
              setSelectedPartContentID={setSelectedPartContentID}
              handleModalPopToggle={handleModalPopToggle}
              handleTagModalOpen={handleTagModalOpen}
              handleEditBlockContent={handleEditBlockContent}
            />
          )}
        </div>
      </div>
    </div>
  );
};
