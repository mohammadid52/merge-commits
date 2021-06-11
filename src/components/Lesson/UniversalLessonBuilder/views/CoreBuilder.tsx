import React from 'react';
import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import Tooltip from '../../../Atoms/Tooltip';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;
  handleModalPopToggle?: (dialogToToggle: string) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;
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
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
    handleEditBlockContent,
    handleModalPopToggle,
  } = props;
  const {previewMode, setPreviewMode} = useULBContext();

  return (
    <div className={`h-full bg-dark-gray overflow-hidden overflow-y-scroll`}>
      <div className={`relative w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <RowComposer
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
            handleEditBlockContent={handleEditBlockContent}
          />
        </LessonPageWrapper>
      </div>

      <div className="absolute top-7 right-2 w-auto">
        <Tooltip placement="left" text={`Preview Mode: ${previewMode ? 'On' : 'Off'}`}>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="text-white bg-dark h-auto py-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
            {previewMode ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
