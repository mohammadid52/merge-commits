import React from 'react';

import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {PartContentSub} from '../../../../interfaces/UniversalLessonInterfaces';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId: string;
  updateOnSave: any;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {id, value, type} = props;

  const composeHeader = (inputID: string, inputValue: any, inputType: string) => {
    return (
      <h3
        id={inputID}
        className={`
            relative
            w-full flex font-medium text-left flex-row items-center text-gray-100 mt-4`}>
        {inputValue.value}
      </h3>
    );
    // switch (inputType) {
    //   case 'header-default':
    //     return (
    //       <h2
    //         id={inputID}
    //         className={`
    //         relative
    //         w-full text-xl font-semibold  text-left flex flex-row items-center text-gray-100 mt-4 border-b border-white border-opacity-10`}>
    //         {inputValue}
    //       </h2>
    //     );
    //   case 'header-section':
    //     return (
    //       <h3
    //         id={inputID}
    //         className={`
    //         ${classString || 'border-sea-green text-xl'}
    //         relative
    //         w-full flex border-b-4  font-medium text-left  flex-row items-center text-gray-100 mt-4`}>
    //         {inputValue}
    //       </h3>
    //     );
    //   default:
    //     return <p id={inputID}>{inputValue}</p>;
    // }
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <div key={id} className={`p-4`}>
            {composeHeader(id, v, type)}
          </div>
        ))}
    </div>
  );
};
