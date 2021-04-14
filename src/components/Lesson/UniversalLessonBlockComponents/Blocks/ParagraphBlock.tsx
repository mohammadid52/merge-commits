import React from 'react';

interface ParagraphBlockProps {
  id?: string;
  value?: string;
  type?: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const { id, value, type } = props;

  const composeParagraph = (inputId: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return <p id={inputId}>{inputValue}</p>;
    }
  };

  return value && composeParagraph(id, value, type);
};
