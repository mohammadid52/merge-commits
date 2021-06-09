import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {
    mode,
    id,
    dataIdAttribute,
    value,
    type,
    handleEditBlockToggle,
    classString,
  } = props;

  const composeHeader = (inputID: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      case 'header-default':
        return (
          <h2
            className={`
            relative
            w-full text-xl font-semibold  text-left flex flex-row items-center text-gray-100 mt-4 border-b border-white border-opacity-10`}>
            {inputValue}
          </h2>
        );
      case 'header-section':
        return (
          <h3
            className={`
            ${classString || 'border-sea-green text-xl'}
            relative
            w-full flex border-b-4  font-medium text-left  flex-row items-center text-gray-100 mt-4`}>
            {inputValue}
          </h3>
        );
      default:
        return <p id={inputID}>{inputValue}</p>;
    }
  };

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <div key={id} className={`p-4`}>
            {composeHeader(id, v, type)}
          </div>
        ))}
    </>
  );
};
