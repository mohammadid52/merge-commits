import React from 'react';
import {RowWrapperProps} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';

const EditOverlayControls = (props: RowWrapperProps) => {
  const {mode, children, contentID, hoveredID} = props;
  /**
   * Here is where I should add buttons
   * and dials and switches and controls
   * for adding/removing/modifying the
   * hovered component
   */
  return <div className={`absolute h-full w-full bg-white z-50`} />;
};

export default EditOverlayControls;
