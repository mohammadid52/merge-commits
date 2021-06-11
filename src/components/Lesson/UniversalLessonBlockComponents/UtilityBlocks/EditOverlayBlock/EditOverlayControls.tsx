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
import ClickAwayListener from 'react-click-away-listener';
import {HiPencil} from 'react-icons/hi';
import {IoCloseSharp} from 'react-icons/io5';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
interface EditOverlayControlsProps extends RowWrapperProps, ULBSelectionProps {
  isActive?: boolean;
  isComponent?: boolean;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {
    contentID,
    editedID,
    isActive,
    isPagePart,
    classString,
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
  const {previewMode} = useULBContext();
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

  const actionClass =
    'flex items-center justify-start w-auto hover:bg-white hover:bg-opacity-10 mx-2 px-4  my-2 py-1 font-bold uppercase text-xs text-white rounded-lg';

  const iconClass = 'w-8 h-8 flex items-center text-xl';
  const textClass = 'mx-2 w-auto tracking-widest';
  if (previewMode) return null;
  return (
    <div
      id="editControlsWrapper"
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
      <ClickAwayListener
        onClickAway={() => {
          setOverlayVisible(false);
          setColorPickerActive(false);
        }}>
        <div
          style={{zIndex: 9999999}}
          className={`flex ulb_action ${
            overlayVisible ? 'opacit-100 visible' : 'opacit-0 invisible'
          }  justify-center flex-col my-auto h-auto w-44 absolute top-2 ${
            isComponent ? 'left-2' : 'right-3.5'
          } bg-gray-800 rounded-lg shadow-lg `}>
          <button className={`${actionClass}`}>
            <span className={iconClass}>
              <CgEditFlipH />
            </span>
            <span className={textClass}>Split</span>
          </button>
          <button className={`${actionClass}`}>
            <span className={iconClass}>
              <AiOutlineEdit />
            </span>
            <span className={textClass}>Edit</span>
          </button>

          <div className={`relative`}>
            <button
              onClick={() => setColorPickerActive(!colorPickerActive)}
              className={`${actionClass}`}>
              <span className={iconClass}>
                <AiOutlineEdit />
              </span>
              <span className={textClass}>BG Color</span>
            </button>
            {colorPickerActive && (
              <ColorPicker
                classString={classString}
                callbackColor={handleColorPickerSelect}
                isPagePart={isPagePart}
              />
            )}
          </div>

          <button
            onClick={() => deleteFromULBHandler(contentID)}
            className={`${actionClass} text-red-400`}>
            <span className={iconClass}>
              <AiOutlineDelete />
            </span>
            <span className={textClass}>Delete</span>
          </button>
        </div>
      </ClickAwayListener>

      {/* <ButtonsRound
        Icon={overlayVisible ? AiOutlineCloseCircle : FiEdit2}
        onClick={() => {
          handleEditBlockToggle();
        }}
        iconSizePX={24}
        buttonWHClass={`w-8 h-8`}
        containerBgClass={`rounded-full bg-gray-600 ${
          overlayVisible ? 'z-100' : 'z-10'
        } cursor-pointer`}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={'text-white'}
      /> */}

      <button
        className={`bg-gray-800 rounded-full h-8 w-${
          isComponent ? '8' : '16'
        } hover:shadow-lg shadow-md transition-all duration-300 z-10 cursor-pointer`}
        onClick={() => {
          handleEditBlockToggle();
        }}>
        {overlayVisible ? (
          <IoCloseSharp color={'#fff'} size={20} />
        ) : (
          <HiPencil color={'#fff'} size={20} />
        )}
      </button>

      <div></div>
    </div>
  );
};

export default EditOverlayControls;
