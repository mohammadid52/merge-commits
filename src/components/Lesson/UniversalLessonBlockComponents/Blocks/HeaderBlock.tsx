import './styles/HeaderStyles.scss';
import React, {useContext} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId: string;
}

export const HeaderBlock = (props: HeaderBlockProps) => {
  const {id, value, type, classString} = props;

  const {
    state: {lessonPage: {themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const composeHeader = (inputID: string, inputValue: any, inputType: string) => {
    return (
      <h3
        id={inputID}
        className={`relative ${classString} w-full flex font-medium   text-left flex-row items-center ${themeTextColor} mt-4 mb-2"`}>
        {inputValue.value}
      </h3>
    );
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <div key={id}>{composeHeader(id, v, type)}</div>
        ))}
    </div>
  );
};
