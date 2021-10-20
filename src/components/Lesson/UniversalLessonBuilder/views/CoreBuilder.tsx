import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Tooltip from '@components/Atoms/Tooltip';
import CopyCloneSlideOver from '@components/Lesson/UniversalLessonBuilder/UI/SlideOvers/CopyCloneSlideOver';
import NewLessonPlanSO from '@components/Lesson/UniversalLessonBuilder/UI/SlideOvers/NewLessonPlanSO';
import PageBuilderSlideOver from '@components/Lesson/UniversalLessonBuilder/UI/SlideOvers/PageBuilderSlideOver';
import PageLoader from '@components/Lesson/UniversalLessonBuilder/views/CoreBuilder/PageLoader';
import PageBuilderLayout from '@components/Lesson/UniversalLessonBuilder/views/PageBuilderLayout';
import {GlobalContext} from '@contexts/GlobalContext';
import {useOverlayContext} from '@contexts/OverlayContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import * as customQueries from '@customGraphql/customQueries';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import {ULBSelectionProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '@lesson/UniversalLessonBlockComponents/LessonPageWrapper';
import BuilderRowComposer from '@lesson/UniversalLessonBuilder/views/CoreBuilder/BuilderRowComposer';
import ModalPopUp from '@molecules/ModalPopUp';
import Toolbar from '@uiComponents/Toolbar';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {find, findLastIndex, map, remove, isEmpty, findIndex} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {RiArrowRightSLine} from 'react-icons/ri';
import {useHistory, useRouteMatch} from 'react-router';
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
  const history = useHistory();

  const {
    mode,

    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    lessonId,
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
    handleTagModalOpen,
    activePageData,
    instId,
  } = props;
  const {
    setUniversalLessonDetails,
    setNewLessonPlanShow,
    fetchingLessonDetails,
    setLessonPlanFields,
    setEditMode,
    previewMode,
    pushUserToThisId,
    editMode,

    getCurrentPage,
    newLessonPlanShow,
  } = useULBContext();

  const {clientKey, userLanguage} = useContext(GlobalContext);

  const LessonSlideover = () => {
    return (
      <div
        onClick={() => {
          setNewLessonPlanShow(true);
          setEditMode(true);
        }}
        className={`not-collapse-right absolute flex items-center right-0 justify-start bg-gray-700 h-10 w-6 cursor-pointer animate__sidebar-btn rounded-l-lg top-2 z-100`}>
        <Tooltip placement="left" text="Show Activity Panel">
          <div className="w-auto transform rotate-180 mr-1">
            <RiArrowRightSLine color="#fff" size={24} />
          </div>
        </Tooltip>
      </div>
    );
  };

  const {lessonDispatch} = useContext(GlobalContext);
  const params = useQuery(location.search);

  const pageId = params.get('pageId');

  useEffect(() => {
    if (!isEmpty(universalLessonDetails) && pageId) {
      const pageIdx = findIndex(
        universalLessonDetails.lessonPlan,
        (plan: UniversalLessonPage) => plan.id === pageId
      );
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: pageIdx >= 0 ? pageIdx : 0});
    }
  }, [universalLessonDetails, pageId]);

  const {
    showLessonEditOverlay,
    setShowLessonEditOverlay,
    setCollapseSidebarOverlay,
    showDataForCopyClone,
  } = useOverlayContext();

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

  const {LessonBuilderDict} = useDictionary(clientKey);

  const goToLessonPlan = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${universalLessonDetails.institutionID}/lessons/${lessonId}?step=activities`
    );
  };

  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;
    saveAction?: () => void;
  }>({
    show: false,
    message: '',
  });

  /**
   * @void trigger delete modal
   */
  const onDeleteButtonClick = () => {
    setConfirmationConfig({
      message:
        'Are you sure you want to delete the this page? All of your data will be permanently removed. This action cannot be undone.',
      show: true,
    });
  };
  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
    });
  };

  const {message = '', show = false} = confirmationConfig;

  /**
   * @param id - pageId - string
   * @void this function will delete the current lesson
   */
  const deleteLessonPlan = async (id: string) => {
    remove(universalLessonDetails.lessonPlan, (item: any) => item.id === id);
    setUniversalLessonDetails({...universalLessonDetails});
    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    closeAction();
    await updateLessonPageToDB(input);
    const lastIndex = findLastIndex(universalLessonDetails.lessonPlan);
    if (lastIndex > -1) {
      const pageID: string =
        universalLessonDetails.lessonPlan[universalLessonDetails.lessonPlan.length - 1]
          .id;
      setSelectedPageID(pageID);
      pushUserToThisId(universalLessonDetails.id, pageID);
    } else {
      goToLessonPlan();
    }
  };

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
    if (ids && ids.length > 0 && !ids.includes(selectedPageID)) {
      setSelectedPageID(ids[0]);
      pushUserToThisId(universalLessonDetails.id, ids[0]);
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
        graphqlOperation(customQueries.getUniversalLesson, {id: lessonId})
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
      pageContent:
        selectedPage.pageContent && selectedPage.pageContent.length > 0
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
                                      id: uuidv4(),
                                    }))
                                  : null,
                            }))
                          : [],
                    }))
                  : [],
            }))
          : [],
    };

    return replaceAllExistingIds;
  };

  const getCopyData = async (lessonId: string, pageId: string) => {
    const selectedPage = await getPageById(lessonId, pageId);

    const replaceAllExistingIds: UniversalLessonPage = {
      ...selectedPage,
      id: uuidv4(),

      pageContent:
        selectedPage.pageContent && selectedPage.pageContent.length > 0
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
                                      id: uuidv4(),
                                    }))
                                  : null,
                            }))
                          : [],
                    }))
                  : [],
            }))
          : [],
    };

    return replaceAllExistingIds;
  };

  const getResponsiveMargin = () => {
    const width = window.screen.availWidth;
    switch (true) {
      case width <= 1200:
        return '-12rem';
      case width <= 1000:
        return '-10rem';
      case width <= 700:
        return '-7rem';

      default:
        return '-15rem';
    }
  };
  const pathname = window.location.pathname;

  return (
    <div className="relative">
      {activePageData && show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}
      <PageBuilderLayout
        width="40rem"
        open={newLessonPlanShow && pathname.includes('page-builder')}>
        {newLessonPlanShow && pathname.includes('page-builder') && (
          <div className="p-8">
            <NewLessonPlanSO
              instId={instId}
              editMode={editMode}
              setEditMode={setEditMode}
              pageDetails={selectedPageID ? getCurrentPage(selectedPageID) : {}} // don't send unwanted page details if not editing
              open={newLessonPlanShow}
              setOpen={setNewLessonPlanShow}
              activePageData={selectedPageID ? getCurrentPage(selectedPageID) : {}}
            />
          </div>
        )}
      </PageBuilderLayout>
      <PageBuilderLayout
        className="overflow-hidden"
        overflowHidden
        open={showLessonEditOverlay}>
        {showLessonEditOverlay && (
          <div className="p-8">
            <PageBuilderSlideOver
              deleteFromULBHandler={deleteFromULBHandler}
              open={showLessonEditOverlay}
              handleEditBlockContent={handleEditBlockContent}
              handleModalPopToggle={handleModalPopToggle}
            />
          </div>
        )}
      </PageBuilderLayout>
      <CopyCloneSlideOver getCopyData={getCopyData} getCloneData={getCloneData} />

      <div
        id="core-builder"
        style={{minHeight: '100vh', maxHeight: '100vh'}}
        className={`relative rounded-lg  grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll dark:bg-dark-gray transition-all duration-200 bg-white ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        <LessonSlideover />

        <div
          style={{
            marginLeft:
              showLessonEditOverlay || newLessonPlanShow ? getResponsiveMargin() : '0rem',
          }}
          className={`col-start-2  items-center col-end-5 w-full h-full col-span-3 transition-all flex flex-col mx-auto `}>
          {!fetchingLessonDetails && (
            <Toolbar
              setFields={setLessonPlanFields}
              setEditMode={setEditMode}
              deleteLesson={onDeleteButtonClick}
              setNewLessonPlanShow={setNewLessonPlanShow}
            />
          )}
          <LessonPageWrapper>
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
          </LessonPageWrapper>
        </div>
      </div>
    </div>
  );
};
