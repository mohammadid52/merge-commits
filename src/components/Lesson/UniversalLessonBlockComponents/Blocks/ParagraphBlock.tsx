import React, { Fragment } from 'react';
import {
  RowComposerProps,
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import { AddNewBlock } from '../UtilityBlocks/AddNewBlock';

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const {mode, id, value, type, handleEditBlockToggle} = props;

  const composeParagraph = (inputID: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return (
          <p key={inputID} id={inputID} className={`p-4`}>
            {inputValue}
          </p>
        );
    }
  };

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) =>
          v ? (
            composeParagraph(`${id}_${i}`, v, type)
          ) : (
            <Fragment key={i}>
            <AddNewBlock
              idx={-1}
              mode={mode}
              // handleModalPopToggle={handleModalPopToggle}
            />
            </Fragment>
          )
        )}
    </>
  );
};
