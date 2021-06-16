import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';

import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {AiOutlineEye, AiOutlineEyeInvisible, AiOutlineBgColors} from 'react-icons/ai';
import Tooltip from '../../../Atoms/Tooltip';
import Buttons from '../../../Atoms/Buttons';
import ColorPicker from '../UI/ColorPicker/ColorPicker';

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
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<Boolean>(false);
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
    handleTagModalOpen,
  } = props;
  const {previewMode, setPreviewMode} = useULBContext();

  const handleColorPickerSelect = (pickedColor: string) => {
    updateFromULBHandler(selectedPageID, 'class', `bg-${pickedColor}`);
  };

  const activePageData = universalLessonDetails.lessonPlan.find(
    (lessonPage) => lessonPage.id === selectedPageID
  );

  const onColorPickerToggle = () => {
    setIsColorPickerOpen((prevValue) => !prevValue);
  };

  const onClickAwayFromColorPicker = () => {
    setIsColorPickerOpen(false);
  };
    
  return (
    <div
      className={`h-full overflow-hidden overflow-y-scroll ${
        activePageData && activePageData.class ? activePageData.class : 'bg-dark-gray'
      }`}>
      <div className={`w-full flex flex-row mx-auto`}>
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
            handleTagModalOpen={handleTagModalOpen}
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
      <ClickAwayListener onClickAway={onClickAwayFromColorPicker}>
        <div className={`absolute w-auto top-7 left-2 z-30`}>
          <Buttons
            onClick={onColorPickerToggle}
            label="BG Color"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-md"
            Icon={AiOutlineBgColors}
          />
          {isColorPickerOpen && (
            <div className="relative">
              <ColorPicker
                callbackColor={handleColorPickerSelect}
                classString={
                  activePageData && activePageData.class ? activePageData.class : ''
                }
                isMainPage={true}
              />
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};
