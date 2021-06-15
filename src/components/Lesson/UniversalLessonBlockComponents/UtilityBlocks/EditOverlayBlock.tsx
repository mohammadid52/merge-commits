import React, { Fragment } from 'react';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import EditOverlayControls from './EditOverlayBlock/EditOverlayControls';

interface IEditOverlayBlockProps extends RowWrapperProps {
  handleEditBlockContent?: () => void;
  section?: string;
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
    // isLast,
    handleEditBlockContent,
    handleEditBlockToggle,
    isPagePart,
    section
  } = props;
  const {previewMode} = useULBContext();
  return (
    <Fragment key={`${contentID}`}>
      {mode === 'building' ? (
        <div
          className={`
        relative 
        h-auto 
        flex items-center rowWrapper
        ${
          isComponent && !previewMode
            ? 'border-b-0 border-dashed border-gray-400 pb-1'
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
            section={section}
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
