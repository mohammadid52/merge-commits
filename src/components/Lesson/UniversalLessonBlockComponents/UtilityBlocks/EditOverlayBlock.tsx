import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {mode, children, contentID, hoveredID} = props;

  return (
    <>
      {mode === 'building' && contentID === hoveredID ? (
        <div className={`relative bg-red-400 bg-opacity-20 pointer-events-none`}>
          <EditOverlayControls />
          {children}
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default EditOverlayBlock;
