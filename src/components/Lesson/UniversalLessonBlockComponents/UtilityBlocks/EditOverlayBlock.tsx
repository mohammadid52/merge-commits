import React from 'react';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {
    mode,
    deleteFromULBHandler,
    updateFromULBHandler,
    children,
    classString,
    contentID,
    editedID,
    isComponent,
    isLast,
    handleEditBlockToggle,
  } = props;
  const {previewMode} = useULBContext();

  return (
    <>
      {mode === 'building' ? (
        <div
          className={`
        relative 
        h-auto 
        flex items-center
        ${
          isComponent && !isLast && !previewMode
            ? 'border-b-0 border-dashed border-gray-400'
            : ''
        }
        `}>
          <EditOverlayControls
            mode={mode}
            contentID={contentID}
            classString={classString}
            isActive={contentID === editedID}
            isComponent={isComponent}
            handleEditBlockToggle={handleEditBlockToggle}
            deleteFromULBHandler={deleteFromULBHandler}
            updateFromULBHandler={updateFromULBHandler}
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
