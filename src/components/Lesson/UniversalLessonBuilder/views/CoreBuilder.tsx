import React, {useState} from 'react';
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
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';
import {IoColorFill, IoColorFillOutline} from 'react-icons/io5';

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
  const {previewMode, setPreviewMode, enableDnD, setEnableDnD} = useULBContext();

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

      <div className="absolute top-7 right-2 w-auto flex flex-col items-center">
        <div className=" w-auto my-2">
          <Tooltip
            placement="left"
            text={`${previewMode ? 'Show pencil' : 'Hide Pencil'}`}>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-white bg-dark h-auto py-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
              {previewMode ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </Tooltip>
        </div>
        <div className="w-auto my-2">
          <Tooltip
            placement="left"
            text={`${enableDnD ? 'Disable Drag' : 'Enable Drag'}`}>
            <button
              onClick={() => setEnableDnD(!enableDnD)}
              className="text-white bg-dark h-auto py-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
              {enableDnD ? <RiDragDropFill /> : <RiDragDropLine />}
            </button>
          </Tooltip>
        </div>
      </div>

      <ClickAwayListener onClickAway={onClickAwayFromColorPicker}>
        <div className={`absolute w-auto top-7 left-2 z-30`}>
          <Tooltip placement="right" text={`Select background color`}>
            {/* <Buttons
              onClick={onColorPickerToggle}
              label=""
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto p-2 font-bold uppercase text-xs text-white bg-dark rounded-md"
              Icon={AiOutlineBgColors}
            /> */}
            <button
              onClick={onColorPickerToggle}
              className="text-white bg-dark h-auto py-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
              {isColorPickerOpen ? <IoColorFill /> : <IoColorFillOutline />}
            </button>
          </Tooltip>
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
