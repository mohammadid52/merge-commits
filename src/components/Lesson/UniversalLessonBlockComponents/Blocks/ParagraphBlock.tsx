import React from 'react';
import {
  RowComposerProps,
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: string;
  type?: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const {mode, id, dataIdAttribute, value, type, handleEditBlockToggle} = props;

  const composeParagraph = (inputId: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return (
          <p
            id={inputId}
            className={`p-4`}
            data-id={dataIdAttribute}>
            {inputValue}
          </p>
        );
    }
  };

  return value && composeParagraph(id, value, type);
};
