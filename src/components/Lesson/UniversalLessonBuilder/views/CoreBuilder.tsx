import React, {useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {AiOutlineEye, AiOutlineEyeInvisible, AiOutlineBgColors} from 'react-icons/ai';
import {RiDragDropFill, RiDragDropLine} from 'react-icons/ri';
import {IoColorFill, IoColorFillOutline} from 'react-icons/io5';

import BuilderRowComposer from './CoreBuilder/BuilderRowComposer';
import {
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import Tooltip from '../../../Atoms/Tooltip';
import Buttons from '../../../Atoms/Buttons';
import ColorPicker from '../UI/ColorPicker/ColorPicker';
import LessonPlanDescription from '../UI/LessonPlanDescription';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
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
  setEditModal: React.Dispatch<React.SetStateAction<any>>;
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
    setEditModal,
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
        </LessonPageWrapper>
      </div>

      <div className="absolute top-7 right-2 w-auto flex flex-col items-center z-30">
        <div className="bg-dark w-32 p-2">
          <Tooltip
            placement="left"
            text={`${previewMode ? 'Show pencil' : 'Hide Pencil'}`}>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="text-white bg-indigo-500 h-auto py-2 my-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
              {previewMode ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </Tooltip>
          <Tooltip
            placement="left"
            text={`${enableDnD ? 'Disable Drag' : 'Enable Drag'}`}>
            <button
              onClick={() => setEnableDnD(!enableDnD)}
              className="text-white bg-indigo-500 h-auto py-2 my-2 w-auto px-2 rounded-md shadow hover:shadow-lg text-2xl">
              {enableDnD ? <RiDragDropFill /> : <RiDragDropLine />}
            </button>
          </Tooltip>
          <button
            onClick={() => handleModalPopToggle('NEW_PAGE')}
            className="text-white bg-indigo-500 h-auto py-2 my-2 w-full px-2 rounded-md shadow hover:shadow-lg text-base">
            Add page
          </button>
        </div>
      </div>

      <div className={`absolute w-auto top-7 left-1`}>
        <ClickAwayListener onClickAway={onClickAwayFromColorPicker}>
          <>
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
          </>
        </ClickAwayListener>
        <div className="mt-10 w-4/5">
          <LessonPlanDescription
            activePageData={activePageData}
            setEditModal={setEditModal}
          />
        </div>
      </div>
    </div>
  );
};
