import PageBuilderSlideOver from '@atoms/Slideover/PageBuilderSlideOver';
import API, {graphqlOperation} from '@aws-amplify/api';
import PageLoader from '@components/Lesson/UniversalLessonBuilder/views/CoreBuilder/PageLoader';
import {useGlobalContext} from '@contexts/GlobalContext';
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
import Notifications from '@UlbUI/Notifications/UlbNotifications';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {find, findLastIndex, map, remove} from 'lodash';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {v4 as uuidv4} from 'uuid';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;

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
  } = props;
  const {
    setUniversalLessonDetails,
    setNewLessonPlanShow,
    fetchingLessonDetails,
    setLessonPlanFields,
    setEditMode,
    previewMode,
    pushUserToThisId,
  } = useULBContext();
  const {clientKey, userLanguage} = useGlobalContext();

  const params = useQuery(location.search);

  const pageId = params.get('pageId');

  const {
    showLessonEditOverlay,
    setShowLessonEditOverlay,
    setCollapseSidebarOverlay,
  } = useOverlayContext();

  useEffect(() => {
    setCollapseSidebarOverlay(true);
  }, []);
  useEffect(() => {
    if (previewMode) {
      setShowLessonEditOverlay(false);
    } else {
      setShowLessonEditOverlay(true);
    }
  }, [previewMode]);

  useEffect(() => {
    if (pageId === 'open-overlay') {
      setNewLessonPlanShow(true);
      setEditMode(false);
    }
  }, [pageId]);

  const {LessonBuilderDict} = useDictionary(clientKey);

  const goToLessonPlan = () => {
    history.push(
      `/dashboard/lesson-builder/lesson/edit?lessonId=${lessonId}&step=activities`
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

  return (
    <>
      {activePageData && show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}

      <div
        id="main-builder-screen"
        className={`relative dark-scroll grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll dark:bg-dark-gray transition-all duration-200 bg-white `}>
        {/*  ~~~~~~~~~~~~~~~~~~NOTIFICATION STARTS HERE~~~~~~~~~~~~~~~~~~~~~ */}
        <Notifications />
        {/* ~~~~~~~~~~~~~~~~~~NOTIFICATION ENDS HERE~~~~~~~~~~~~~~~~~~~~~  */}

        {/*  ~~~~~~~~~~~~~~~~~~EDIT SLIDEOVER STARTS HERE~~~~~~~~~~~~~~~~~~~~~ */}
        <PageBuilderSlideOver
          activePageData={activePageData}
          open={showLessonEditOverlay}
        />
        {/* ~~~~~~~~~~~~~~~~~~EDIT SLIDEOVER ENDS HERE~~~~~~~~~~~~~~~~~~~~~  */}
        <div
          style={{marginLeft: showLessonEditOverlay ? '-15rem' : '0rem'}}
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 transition-all flex flex-col mx-auto `}>
          {!fetchingLessonDetails && (
            <Toolbar
              getCopyData={getCopyData}
              getCloneData={getCloneData}
              setFields={setLessonPlanFields}
              setEditMode={setEditMode}
              deleteLesson={onDeleteButtonClick}
              universalLessonDetails={universalLessonDetails}
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
    </>
  );
};
