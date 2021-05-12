import React from 'react';
import {PagePart} from '../../../../interfaces/UniversalLessonInterfaces';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {mode, children} = props;

  return (
    <>
      {mode === 'building' ? (
        <div className={`hover:bg-red-400 bg-opacity-20`}>{children}</div>
      ) : (
        children
      )}
    </>
  );
};

export default EditOverlayBlock;
