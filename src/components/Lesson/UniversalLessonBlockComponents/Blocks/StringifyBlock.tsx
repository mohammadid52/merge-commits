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
  const {mode, id, anyObj, handleEditBlockToggle} = props;
  return (
    <p
      id={id}
      className={`bg-white bg-opacity-20 px-4 py-5 sm:p-6`}>
      {JSON.stringify(anyObj)}
    </p>
  );
};
