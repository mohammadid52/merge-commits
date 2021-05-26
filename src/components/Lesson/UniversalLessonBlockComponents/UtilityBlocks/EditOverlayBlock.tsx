import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {mode, deleteULBHandler, children, contentID, editedID, isComponent, isLast, handleEditBlockToggle} = props;

  return (
    <>
      {mode === 'building' ? (
        <div className={`
        relative 
        h-auto 
        flex items-center
        ${isComponent && !isLast ? 'border-b-0 border-dashed border-gray-400':''}
        `}>
          <EditOverlayControls
            mode={mode}
            deleteULBHandler={deleteULBHandler}
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
