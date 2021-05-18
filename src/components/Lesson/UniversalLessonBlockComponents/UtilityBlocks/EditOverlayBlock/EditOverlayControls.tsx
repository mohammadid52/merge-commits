import React, { useEffect, useState } from 'react';
import { RowWrapperProps } from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import Buttons from '../../../../Atoms/Buttons';
import { AiOutlineBgColors, AiOutlineCloseCircle, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsLayoutSplit } from 'react-icons/bs';
import { CgEditFlipH } from 'react-icons/cg';
import ButtonsRound from '../../../../Atoms/ButtonsRound';
import { FiEdit2 } from 'react-icons/fi';

interface EditOverlayControlsProps extends RowWrapperProps {
  isActive?: boolean;
  isComponent?: boolean;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {contentID, editedID, isActive, isComponent, handleEditBlockToggle} = props;
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

  useEffect(()=>{
    if(isActive){
      if(!overlayVisible){
        setOverlayVisible(true)
      }
    }
    if(!isActive){
      if(overlayVisible){
        setOverlayVisible(false)
      }
    }
  },[isActive])

  const handleOverlayToggle = (inputID: string) => {
    handleEditBlockToggle(inputID);
  }

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
  const rowAlignmentToggleClass = 'w-auto right-0 transform translate-x-1/2 ';

  return (
    <div
      className={`
          absolute 
          w-auto h-auto
          flex flex-row
          items-center
          bg-transparent rounded-lg
          z-100
          ${isComponent ? componentAlignmentToggleClass : rowAlignmentToggleClass}
          `}>

          {overlayVisible ? (
            <div
              className={`
                          h-auto w-full my-auto
                          flex flex-row justify-center items-center
                          `}>
                            <Buttons label="Split" btnClass="mx-2" Icon={BsLayoutSplit} />
                            <Buttons label="Flip" btnClass="mx-2" Icon={CgEditFlipH} />
                            <Buttons label="Edit" btnClass="mx-2" Icon={AiOutlineEdit} />
                            <Buttons label="BG Color" btnClass="mx-2" Icon={AiOutlineBgColors} />
                            <Buttons label="Delete" btnClass="mx-2" Icon={AiOutlineDelete} />
            </div>
          ) : null}

          <ButtonsRound
            Icon={overlayVisible ? AiOutlineCloseCircle : FiEdit2}
            onClick={() => handleOverlayToggle(contentID)}
            iconSizePX={24}
            buttonWHClass={`w-8 h-8`}
            containerBgClass={`rounded-full bg-gray-700 z-50 cursor-pointer`}
            buttonBgClass={`bg-transparent`}
            iconTxtColorClass={'text-white'}
          />
    </div>
  );
};

export default EditOverlayControls;
