import React, { Fragment } from 'react';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

interface IEditOverlayBlockProps extends RowWrapperProps {
  handleEditBlockContent?: () => void;
}

const EditOverlayBlock = (props: IEditOverlayBlockProps) => {
  const {
    mode,
    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    children,
    classString,
    contentID,
    editedID,
    isComponent,
    isLast,
    handleEditBlockContent,
    handleEditBlockToggle,
    isPagePart,
  } = props;
  const {previewMode} = useULBContext();
  return (
    <Fragment key={`${contentID}_${editedID}`}>
      {mode === 'building' ? (
        <div
          className={`
        relative 
        h-auto 
        flex items-center rowWrapper
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
            isPagePart={isPagePart}
            handleEditBlockContent={handleEditBlockContent}
            handleEditBlockToggle={handleEditBlockToggle}
            createNewBlockULBHandler={createNewBlockULBHandler}
            deleteFromULBHandler={deleteFromULBHandler}
            updateFromULBHandler={updateFromULBHandler}
          />
          <div>{children}</div>
        </div>
      ) : (
        children
      )}
    </Fragment>
  );
};

export default EditOverlayBlock;
