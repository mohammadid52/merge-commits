import React, {useContext, Fragment, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router';
import {Dialog, Transition} from '@headlessui/react';
import BuilderRowComposer from './CoreBuilder/BuilderRowComposer';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {v4 as uuidv4} from 'uuid';
import Toolbar from '../UI/UIComponents/Toolbar';
import * as customQueries from '../../../../customGraphql/customQueries';
import Storage from '@aws-amplify/storage';
import {filter, find, findLastIndex, forEach, map, remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import useDictionary from '../../../../customHooks/dictionary';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import {useQuery} from '../../../../customHooks/urlParam';
import {IconType} from 'react-icons/lib';
import Tooltip from '../../../Atoms/Tooltip';
import {AiOutlineEyeInvisible} from 'react-icons/ai';
import API, {graphqlOperation} from '@aws-amplify/api';
import {BsCloudDownload} from 'react-icons/bs';
import ClickAwayListener from 'react-click-away-listener';
import {getImageFromS3Static} from '../../../../utilities/services';
import Downloadables from '../UI/UIComponents/Downloadables';

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

    pushUserToThisId,
    previewMode,
    setPreviewMode,
  } = useULBContext();
  const {
    clientKey,
    userLanguage,
    state: {lessonPage: {themeBackgroundColor = ''} = {}},
  } = useContext(GlobalContext);

  const selectedPageDetails = universalLessonDetails.lessonPlan.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

  const downloadables =
    selectedPageID &&
    selectedPageDetails &&
    selectedPageDetails.pageContent &&
    selectedPageDetails.pageContent.length > 0
      ? filter(selectedPageDetails.pageContent, (f) =>
          f.id.includes('downloadable-files')
        )
      : [];

  const {
    state: {
      lessonPage: {
        theme = 'dark',
        themeSecBackgroundColor = 'bg-gray-700',
        themeTextColor = '',
      } = {},
    },
  } = useContext(GlobalContext);

  const params = useQuery(location.search);

  const pageId = params.get('pageId');

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
  const Button = ({
    onClick,
    icon: Icon,
    text = '',
    tooltip = '',
    invert = false,
    color = 'text-white',
  }: {
    onClick?: () => void;
    icon?: IconType;
    tooltip?: string;
    text?: string;
    color?: string;
    invert?: boolean;
  }) => {
    return (
      <Tooltip show={tooltip.length > 0} text={tooltip} placement="left">
        <button
          onClick={onClick}
          type="button"
          className={`${
            invert ? 'bg-indigo-600' : 'bg-transparent'
          } gray mx-2 hover:shadow-lg w-auto  inline-flex justify-center items-center p-2 border border-transparent rounded-md hover:text-white  transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
          {text}
        </button>
      </Tooltip>
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
    /**
     * This object will replace all the existing ids with new ones
     * hope this works 😼
     * Please don't change anything 👏
     */

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
    /**
     * This object will replace all the existing ids with new ones
     * hope this works 😼
     * Please don't change anything 👏
     */

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

  const getKeys = async (imgId: string) => {
    const key = await Storage.get(`ULB/studentdata_${imgId}`, {
      download: true,
    });
    console.log('🚀 ~ file: CoreBuilder.tsx ~ line 443 ~ {map ~ key', key);
  };

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

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
        className={`relative grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll dark:bg-dark-gray transition-all duration-200 bg-white ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        <div
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 flex flex-col mx-auto`}>
          <div
            style={{top: '12rem'}}
            className={`${
              !previewMode ? 'opacity-0 translate-x-100' : 'opacity-100 translate-x-0'
            } transform duration-200 transition-all  ${themeSecBackgroundColor}  ${themeTextColor} fixed right-5 z-10 customShadow  rounded-lg toolbar p-2 w-16`}>
            <Button
              onClick={() => {
                setPreviewMode(!previewMode);
                // setToolbarOnTop(true);
              }}
              tooltip="Preview"
              color={themeTextColor}
              icon={AiOutlineEyeInvisible}
            />
          </div>

          {downloadables && downloadables.length > 0 && (
            <Downloadables
              downloadables={downloadables}
              showDownloadMenu={showDownloadMenu}
              setShowDownloadMenu={setShowDownloadMenu}
            />
          )}

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
              // this is just a trial loader
              // if anyone is making a component out of it .
              // PLEASE replace this with that component
              // :)
              <div className="border border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto mt-12">
                <div className="animate-pulse space-y-8 flex flex-col">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-400 rounded"></div>
                      <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-400 rounded"></div>
                      <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-400 rounded"></div>
                      <div className="h-4 bg-gray-400 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
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
