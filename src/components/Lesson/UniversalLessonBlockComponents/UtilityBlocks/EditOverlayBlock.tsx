import React, {useState} from 'react';
import {PagePart} from '../../../../interfaces/UniversalLessonInterfaces';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

const EditOverlayBlock = (props: RowWrapperProps) => {
  const {mode, children, contentID, hoveredID} = props;
  // const [mouseIn, setMouseIn] = useState<boolean>(false);
  //
  // const handleMouseOverToggle = () => {
  //   if (!mouseIn) {
  //     setMouseIn(true);
  //   } else {
  //     setMouseIn(false);
  //   }
  // };

  return (
    <>
      {mode === 'building' && contentID === hoveredID ? (
        <div className={`bg-red-400 bg-opacity-20`}>{children}</div>
      ) : (
        children
      )}
    </>
  );
};

export default EditOverlayBlock;
