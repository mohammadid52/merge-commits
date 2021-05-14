import React from 'react';
import {RowWrapperProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import Buttons from '../../../../Atoms/Buttons';
import {AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsLayoutSplit} from 'react-icons/bs';
import {CgEditFlipH} from 'react-icons/cg';

const EditOverlayControls = (props: RowWrapperProps) => {
  const {mode, children, contentID, hoveredID} = props;
  /**
   * Here is where I should add buttons
   * and dials and switches and controls
   * for adding/removing/modifying the
   * hovered component
   *
   */
  return (
    <div
      className={`
          absolute h-full w-full 
          bg-white z-50
          rounded-lg
          `}>
      <div
        className={`
          h-auto w-full my-auto
          flex flex-row justify-center items-center
          `}>
          <Buttons label="Split Horizontally" btnClass="mx-2" Icon={BsLayoutSplit} />
          <Buttons label="Flip Horizontally" btnClass="mx-2" Icon={CgEditFlipH} />
          <Buttons label="Edit Block" btnClass="mx-2" Icon={AiOutlineEdit} />
          <Buttons label="Delete Block" btnClass="mx-2" Icon={AiOutlineDelete} />
      </div>
    </div>
  );
};

export default EditOverlayControls;
