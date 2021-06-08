import React, {useEffect, useState} from 'react';
import {
  RowWrapperProps,
  ULBSelectionProps,
} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import Buttons from '../../../../Atoms/Buttons';
import {
  AiOutlineBgColors,
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from 'react-icons/ai';
import {BsLayoutSplit} from 'react-icons/bs';
import {CgEditFlipH} from 'react-icons/cg';
import ButtonsRound from '../../../../Atoms/ButtonsRound';
import {FiEdit2} from 'react-icons/fi';
import ColorPicker from '../../../UniversalLessonBuilder/UI/ColorPicker/ColorPicker';

interface EditOverlayControlsProps extends RowWrapperProps, ULBSelectionProps {
  isActive?: boolean;
  isComponent?: boolean;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {
    classString,
    contentID,
    editedID,
    isActive,
    isComponent,
    handleEditBlockToggle,
    deleteFromULBHandler,
    updateFromULBHandler,
  } = props;
  
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);

  useEffect(() => {
    if (isActive) {
      if (!overlayVisible) {
        setOverlayVisible(true);
      }
    }
    if (!isActive) {
      if (overlayVisible) {
        setOverlayVisible(false);
      }
    }
  }, [isActive]);

  /**
   * FUNCTIONALITY
   */

  const handleColorPickerSelect = (pickedColor: string) => {
    updateFromULBHandler(contentID, 'class', `bg-${pickedColor}`);
  };

  /**
   * Here is where I should add buttons
   * and dials and switches and controls
   * for adding/removing/modifying the
   * hovered component
   *
   */

  /**
   * Below classes will allow overlay control button to be
   * either in the middle of the row component, or to the side of the row
   */
  const componentAlignmentToggleClass = 'w-full justify-center';
  const rowAlignmentToggleClass = 'w-auto right-0';

  const offsetClass = 'transform translate-x-6';

  return (
    <div
      className={`
          absolute 
          flex flex-row
          items-center
          bg-transparent rounded-lg
          ${overlayVisible ? 'z-100' : 'z-10'}
          h-auto w-auto
          ${isComponent ? componentAlignmentToggleClass : rowAlignmentToggleClass}
          ${isComponent ? '' : offsetClass}
          `}>
      {overlayVisible ? (
        <div
          className={`
                      grid grid-cols-5 gap-2
                      my-auto
                      h-auto
                      z-10
                      ${overlayVisible && isComponent ? 'w-auto' : 'w-full'} 
                      `}>
          <Buttons
            label="Split"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            Icon={BsLayoutSplit}
          />
          <Buttons
            label="Flip"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            Icon={CgEditFlipH}
          />
          <Buttons
            label="Edit"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            Icon={AiOutlineEdit}
          />
          <div className={`relative`}>
            <Buttons
              onClick={() => setColorPickerActive(!colorPickerActive)}
              label="BG Color"
              overrideClass={true}
              btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
              Icon={AiOutlineBgColors}
            />
            {colorPickerActive && (
              <ColorPicker
                callbackColor={handleColorPickerSelect}
                classString={classString}
              />
            )}
          </div>
          <Buttons
            onClick={() => deleteFromULBHandler(contentID)}
            label="Delete"
            overrideClass={true}
            btnClass="flex items-center justify-center w-auto mx-2 px-4 py-0 font-bold uppercase text-xs text-white bg-gray-400 rounded-lg"
            Icon={AiOutlineDelete}
          />
        </div>
      ) : null}

      <ButtonsRound
        Icon={overlayVisible ? AiOutlineCloseCircle : FiEdit2}
        onClick={() => handleEditBlockToggle()}
        iconSizePX={24}
        buttonWHClass={`w-8 h-8`}
        containerBgClass={`rounded-full bg-gray-600 ${
          overlayVisible ? 'z-100' : 'z-10'
        } cursor-pointer`}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={'text-white'}
      />
    </div>
  );
};

export default EditOverlayControls;
