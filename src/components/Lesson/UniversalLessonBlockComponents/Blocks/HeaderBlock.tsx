import React from 'react';

interface HeaderBlockProps {
  id?: string;
  value?: string;
  type?: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const { id, value, type } = props;

  const composeHeader = (inputId: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      case 'header-default':
        return (
          <h2
            id={inputId}
            className={`w-full text-xl font-semibold pb-2 mb-2 relative font-open text-left flex flex-row items-center text-gray-100 mt-4 border-b border-white border-opacity-10`}>
            {inputValue}
          </h2>
        );
      case 'header-section':
        return (
          <h3
            id={inputId}
            className={`w-full flex text-xl border-b-4 border-sea-green pb-2 mb-2 relative font-open font-medium text-left flex flex-row items-center text-gray-100 mt-4`}>
            {inputValue}
          </h3>
        );
      default:
        return <p id={inputId}>{inputValue}</p>;
    }
  };

  return value && composeHeader(id, value, type);
};
