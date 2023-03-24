import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import React from 'react';
import {ParagraphBlock} from './ParagraphBlock';
import './styles/HeaderStyles.scss';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId?: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {id, value, type, classString, pagePartId = ''} = props;

  const composeHeader = (inputID: string, inputValue: any) => {
    return (
      <h1
        id={inputID}
        dangerouslySetInnerHTML={{
          __html: inputValue.value
        }}
        className={`relative ${classString} w-full flex font-medium   text-left flex-row items-center  mt-4 mb-2"`}></h1>
    );
  };

  return (
    <div className="w-auto">
      {value && value.length > 0 && id && (
        <>
          <div key={id}>{composeHeader(id, value[0])}</div>

          {value[1] !== '' && (
            <ParagraphBlock
              mode="lesson"
              pagePartId={pagePartId}
              value={[value[1]]}
              id={id}
              type={type}
            />
          )}
        </>
      )}
    </div>
  );
};
