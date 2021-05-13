import React from 'react';
import {
  RowComposerProps,
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface StringifyBlockProps extends RowWrapperProps {
  id: string;
  anyObj: any;
}

export const StringifyBlock = (props: StringifyBlockProps) => {
  const {mode, id, dataIdAttribute, anyObj, handleMouseOverToggle} = props;
  return (
    <p
      id={id}
      data-id={dataIdAttribute}
      className={`bg-white bg-opacity-20`}
      onMouseEnter={mode === 'building' ? handleMouseOverToggle : undefined}
      onMouseLeave={mode === 'building' ? handleMouseOverToggle : undefined}>
      {JSON.stringify(anyObj)}
    </p>
  );
};
