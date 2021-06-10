import React, { useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';

import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {HierarchyPanel} from '../UI/HierarchyPanel';
import {EditPanel} from '../UI/EditPanel';
import {RowWrapper} from '../../UniversalLessonBlockComponents/RowWrapper';
import {AddNewBlock} from '../../UniversalLessonBlockComponents/UtilityBlocks/AddNewBlock';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import EditOverlayBlock from '../../UniversalLessonBlockComponents/UtilityBlocks/EditOverlayBlock';
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
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<Boolean>(false);
  const {
    mode,
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
    handleModalPopToggle,
  } = props;
  const {previewMode, setPreviewMode} = useULBContext();

  const handleColorPickerSelect = (pickedColor: string) => {
    updateFromULBHandler(selectedPageID, 'class', `bg-${pickedColor}`);
  };

  const activePageData = universalLessonDetails.universalLessonPages.find(
    (lessonPage) => lessonPage.id === selectedPageID
  );

  const onColorPickerToggle = () => {
    setIsColorPickerOpen((prevValue) => !prevValue);
  };
    
  return (
    <div
      className={`h-full overflow-hidden overflow-y-scroll ${
        activePageData && activePageData.class ? activePageData.class : 'bg-dark-gray'
      }`}>
      <div className={`relative w-full flex flex-row mx-auto`}>
        <ClickAwayListener onClickAway={onColorPickerToggle}>
          <div className={`w-auto my-10 mx-5`}>
            <Buttons
              onClick={onColorPickerToggle}
              label="BG Color"
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
              Icon={AiOutlineBgColors}
            />
            {isColorPickerOpen && (
              <ColorPicker
                callbackColor={handleColorPickerSelect}
                classString={
                  activePageData && activePageData.class ? activePageData.class : ''
                }
                isMainPage={true}
              />
            )}
          </div>
        </ClickAwayListener>
        <LessonPageWrapper>
          <RowComposer
            mode={mode}
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
