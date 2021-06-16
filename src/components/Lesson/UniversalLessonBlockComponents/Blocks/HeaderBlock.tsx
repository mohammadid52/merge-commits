import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: string;
  type?: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {mode, id, dataIdAttribute, value, type, handleEditBlockToggle} = props;

  const composeHeader = (inputId: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      case 'header-default':
        return (
          <h2
            className={`
            relative
            w-full text-xl font-semibold  font-open text-left flex flex-row items-center text-gray-100 mt-4 border-b border-white border-opacity-10`}>
            {inputValue}
          </h2>
        );
      case 'header-section':
        return (
          <h3
            className={`
            relative
            w-full flex text-xl border-b-4 border-sea-green font-open font-medium text-left flex flex-row items-center text-gray-100 mt-4`}>
            {inputValue}
          </h3>
        );
      default:
        return <p id={inputId}>{inputValue}</p>;
    }
  };

  return (
    <>
      {value ? (
        <div
          id={id}
          data-id={dataIdAttribute}
          className={`p-4`}>
          {composeHeader(id, value, type)}
        </div>
      ) : null}
    </>
  );
};
