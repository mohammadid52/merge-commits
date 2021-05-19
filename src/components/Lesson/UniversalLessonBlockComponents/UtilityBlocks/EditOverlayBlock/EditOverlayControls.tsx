import React, {useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
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

interface EditOverlayControlsProps extends RowWrapperProps {
  isActive?: boolean;
  isComponent?: boolean;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {contentID, editedID, isActive, isComponent, handleEditBlockToggle} = props;
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

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

  const handleOverlayToggle = (inputID: string) => {
    handleEditBlockToggle(inputID);
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
          z-100
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
                      ${overlayVisible && isComponent ? 'w-auto' : 'w-full'} 
                      `}>
                        <Buttons label="Split" overrideClass={true} btnClass="bg-gray-400 mx-2 w-16 rounded-full" Icon={BsLayoutSplit} />
                        <Buttons label="Flip" overrideClass={true} btnClass="bg-gray-400 mx-2 w-16 rounded-full" Icon={CgEditFlipH} />
                        <Buttons label="Edit" overrideClass={true} btnClass="bg-gray-400 mx-2 w-16 rounded-full" Icon={AiOutlineEdit} />
                        <Buttons label="BG Color" overrideClass={true} btnClass="bg-gray-400 mx-2 w-16 rounded-full" Icon={AiOutlineBgColors} />
                        <Buttons label="Delete" overrideClass={true} btnClass="bg-gray-400 mx-2 w-16 rounded-full" Icon={AiOutlineDelete} />
        </div>
      ) : null}

      <ButtonsRound
        Icon={overlayVisible ? AiOutlineCloseCircle : FiEdit2}
        onClick={() => handleOverlayToggle(contentID)}
        iconSizePX={24}
        buttonWHClass={`w-8 h-8`}
        containerBgClass={`rounded-full bg-gray-600 z-50 cursor-pointer`}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={'text-white'}
      />
    </div>
  );
};

export default EditOverlayControls;
