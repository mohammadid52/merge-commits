import React, {useContext, useState} from 'react';
import {useHistory} from 'react-router';

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

import LessonPlanDescription from '../UI/LessonPlanDescription';
import Loader from '../../../Atoms/Loader';
import Toolbar from '../UI/UIComponents/Toolbar';
import NewLessonPlanSO from '../UI/UIComponents/NewLessonPlanSO';
import {PlusIcon} from '@heroicons/react/solid';
import {IconType} from 'react-icons/lib';
import {RiPagesLine} from 'react-icons/ri';
import Modal from '../../../Atoms/Modal';
import {findLastIndex, lastIndexOf, remove} from 'lodash';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import useDictionary from '../../../../customHooks/dictionary';
import ModalPopUp from '../../../Molecules/ModalPopUp';
interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;
  pageDetailsModal: boolean;
  setPageDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
  lessonId: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
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
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
    handleEditBlockContent,
    handleModalPopToggle,
    handleTagModalOpen,
    setEditModal,
    setPageDetailsModal,
    pageDetailsModal,
  } = props;
  const {previewMode, setUniversalLessonDetails, fetchingLessonDetails} = useULBContext();
  const {
    dispatch,
    clientKey,
    userLanguage,
    state: {
      lessonPage: {theme: lessonPageTheme = 'dark', themeBackgroundColor = ''} = {},
    },
  } = useContext(GlobalContext);

  const {LessonBuilderDict} = useDictionary(clientKey);

  const handleThemeChange = () => {
    dispatch({
      type: 'UPDATE_LESSON_PAGE_THEME',
      payload: {theme: lessonPageTheme === 'dark' ? 'light' : 'dark'},
    });
  };

  const handleAddNewPage = () => {
    history.push(`/dashboard/lesson-builder/lesson/add/lesson-plan?lessonId=${lessonId}`);
  };

  const goToLessonPlan = () => {
    history.push(`/dashboard/lesson-builder/lesson/view?lessonId=${lessonId}&tab=1`);
  };

  const activePageData = universalLessonDetails.lessonPlan.find(
    (lessonPage) => lessonPage.id === selectedPageID
  );

  const [newLessonPlanShow, setNewLessonPlanShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }

  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;
    saveAction?: () => void;
  }>({
    show: false,
    message: '',
  });
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
    } else {
      goToLessonPlan();
    }
  };

  const GiantButton = ({
    onClick,
    text = '',
    side = 'left',
    icon: Icon,
  }: {
    side?: 'left' | 'right';
    onClick?: () => void;
    text: string;
    icon: IconType;
  }) => {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`w-auto z-10 absolute bottom-5 ${side}-3 h-10 inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
        <Icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
        {text}
      </button>
    );
  };

  return (
    <>
      {show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deleteLessonPlan(activePageData.id)}
        />
      )}

      {!previewMode && (
        <GiantButton
          icon={PlusIcon}
          text="Add New Activity"
          onClick={() => {
            setNewLessonPlanShow(true);
            setEditMode(false);
          }}
        />
      )}
      {!previewMode && (
        <GiantButton
          onClick={() => {
            setNewLessonPlanShow(true);
            setEditMode(true);
          }}
          icon={RiPagesLine}
          text="Show Page Details"
          side={'right'}
        />
      )}

      {/* {pageDetailsModal && (
        <Modal
          closeAction={() => setPageDetailsModal(false)}
          showHeader
          titleButton={
            <span
              onClick={() => {
                setPageDetailsModal(false);
                setEditModal({
                  show: true,
                  content: {
                    id: activePageData.id,
                    title: activePageData.title,
                    description: activePageData.description,
                    label: activePageData.label,
                    estTime: activePageData.estTime,
                  },
                  editOnlyId: false,
                });
              }}
              className="ml-4 inline-flex items-center px-3 py-0.5 rounded-md cursor-pointer text-sm font-medium bg-indigo-200 text-indigo-800 w-auto">
              Edit
            </span>
          }
          closeOnBackdrop
          showHeaderBorder
          title={'Page Details'}
          showFooter={false}>
          <LessonPlanDescription activePageData={activePageData} />
        </Modal>
      )} */}
      <div
        className={`relative grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll ${themeBackgroundColor} ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        {/* <div className="h-12 flex items-center justify-center p-4 font-semibold">
          <h2 className="text-white text-xl">
            {capitalizeFirstLetter(activePageData?.title)}
          </h2>
        </div> */}
        <div
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 flex flex-col mx-auto`}>
          <Toolbar
            deleteLesson={onDeleteButtonClick}
            newLessonPlanShow={newLessonPlanShow}
            setNewLessonPlanShow={setNewLessonPlanShow}
          />
          <LessonPageWrapper>
            {fetchingLessonDetails ? (
              <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">Loading...</p>
                </div>
              </div>
            ) : (
              <BuilderRowComposer
                mode={mode}
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
        {/* <div className="absolute top-10 right-2 w-auto flex flex-col items-center z-30">
        <div className="bg-dark flex flex-col items-center justify-center w-32 p-2">
          <button
            onClick={handleThemeChange}
            className="text-white bg-indigo-500 h-auto py-2 my-2 px-2 rounded-md shadow hover:shadow-lg text-2xl">
            {lessonPageTheme === 'light' ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="text-white bg-indigo-500 h-auto py-2 my-2 px-2 rounded-md shadow hover:shadow-lg text-2xl">
            {previewMode ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>

          <button
            onClick={() => setEnableDnD(!enableDnD)}
            className="text-white bg-indigo-500 h-auto py-2 my-2 px-2 rounded-md shadow hover:shadow-lg text-2xl">
            {enableDnD ? <RiDragDropFill /> : <RiDragDropLine />}
          </button>

          <button
            onClick={handleAddNewPage}
            className="text-white bg-indigo-500 h-auto py-2 my-2 w-full px-2 rounded-md shadow hover:shadow-lg text-base">
            Add page
          </button>
          <button
            onClick={goToLessonPlan}
            className="text-white bg-indigo-500 h-auto py-2 my-2 w-full px-2 rounded-md shadow hover:shadow-lg text-base">
            Lesson Plan
          </button>
        </div>
      </div> */}
        <div className={`col-span-1`}>
          {/* <div className="w-4/6 min-w-64">
          <LessonPlanDescription
            activePageData={activePageData}
            setEditModal={setEditModal}
          />
        </div> */}

          <NewLessonPlanSO
            editMode={editMode}
            pageDetails={editMode ? activePageData : {}} // don't send unwanted page details if not editing
            open={newLessonPlanShow}
            setOpen={setNewLessonPlanShow}
          />
        </div>
      </div>
    </>
  );
};
