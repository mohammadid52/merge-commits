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
import ActionLeft from '../UI/UIComponents/ActionLeft';
import NewLessonPlanSO from '../UI/UIComponents/NewLessonPlanSO';

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
  } = props;
  const {
    previewMode,
    setPreviewMode,
    fetchingLessonDetails,
    enableDnD,
    setEnableDnD,
  } = useULBContext();
  const {
    dispatch,
    state: {
      lessonPage: {theme: lessonPageTheme = 'dark', themeBackgroundColor = ''} = {},
    },
  } = useContext(GlobalContext);

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
  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }
  return (
    <>
      <div
        className={`grid gap-4 p-4 grid-cols-5 h-full overflow-hidden overflow-y-scroll ${themeBackgroundColor} ${
          activePageData && activePageData.class ? activePageData.class : ''
        }`}>
        <div className="h-12 flex items-center justify-center p-4 font-semibold">
          <h2 className="text-white text-xl">
            {capitalizeFirstLetter(activePageData?.title)}
          </h2>
        </div>
        <div
          className={`col-start-2 items-center col-end-5 w-full h-full col-span-3 flex flex-col mx-auto`}>
          <ActionLeft
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

          <NewLessonPlanSO open={newLessonPlanShow} setOpen={setNewLessonPlanShow} />
        </div>
      </div>
    </>
  );
};
