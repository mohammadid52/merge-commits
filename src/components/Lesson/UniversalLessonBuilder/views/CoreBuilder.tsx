import React from 'react';
import {useHistory} from 'react-router';

import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';

import BuilderRowComposer from './CoreBuilder/BuilderRowComposer';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';

import LessonPlanDescription from '../UI/LessonPlanDescription';
import Loader from '../../../Atoms/Loader';

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

  const handleAddNewPage = () => {
    history.push(`/dashboard/lesson-builder/lesson/add/lesson-plan?lessonId=${lessonId}`);
  };

  const goToLessonPlan = () => {
    history.push(`/dashboard/lesson-builder/lesson/view?lessonId=${lessonId}&tab=1`);
  };

  const activePageData = universalLessonDetails.lessonPlan.find(
    (lessonPage) => lessonPage.id === selectedPageID
  );

  return (
    <div
      className={`h-full overflow-hidden overflow-y-scroll ${
        activePageData && activePageData.class ? activePageData.class : 'bg-dark-gray'
      }`}>
      <div className={`w-full h-full flex flex-row mx-auto`}>
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
      <div className="absolute top-10 right-2 w-auto flex flex-col items-center z-30">
        <div className="bg-dark flex flex-col items-center justify-center w-32 p-2">
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
            // onClick={() => handleModalPopToggle('NEW_PAGE')}
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
      </div>
      <div className={`absolute w-auto top-10 left-1`}>
        <div className="w-4/6 min-w-64">
          <LessonPlanDescription
            activePageData={activePageData}
            setEditModal={setEditModal}
          />
        </div>
      </div>
    </div>
  );
};
