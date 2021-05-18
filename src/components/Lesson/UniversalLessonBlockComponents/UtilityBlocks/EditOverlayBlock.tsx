import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {mode, children, contentID, editedID, isComponent, handleEditBlockToggle} = props;

  return (
    <>
      {mode === 'building' ? (
        <div className={`h-auto flex items-center`}>
          <EditOverlayControls
            mode={mode}
            contentID={contentID}
            isActive={contentID === editedID}
            isComponent={isComponent}
            handleEditBlockToggle={handleEditBlockToggle}
          />
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default EditOverlayBlock;
