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
  const {mode, id, value, type, handleMouseOverToggle} = props;

  const composeParagraph = (inputId: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return (
          <p
            id={inputId}
            onMouseEnter={mode === 'building' ? handleMouseOverToggle : undefined}
            onMouseLeave={mode === 'building' ? handleMouseOverToggle : undefined}>
            {inputValue}
          </p>
        );
    }
  };

  return value && composeParagraph(id, value, type);
};
