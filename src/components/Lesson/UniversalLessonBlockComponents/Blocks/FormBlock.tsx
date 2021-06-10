import React, {useEffect} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface FormBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  value2?: {id: string; type: string; label: string; value: string[]};
}

export const FormBlock = (props: FormBlockProps) => {
  const {id, mode, dataIdAttribute, value, handleEditBlockToggle} = props;

  const composeInput = (inputID: string, type: string, label: string, value: string) => {
    switch (type) {
      case 'text-input':
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <input
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full py-2 px-4 text-gray-800 rounded-xl bg-darker-gray`}
              name="title"
              type="text"
              placeholder={value.length > 0 ? value : 'Please input...'}
              value={''}
            />
          </div>
        );
      case 'text-area':
        return (
          <div id={id} key={inputID} className={`mb-4 p-4`}>
            <label className={`text-sm text-gray-200 my-2`} htmlFor="label">
              {label}
            </label>
            <textarea
              id={inputID}
              disabled={mode === 'building'}
              className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl bg-darker-gray text-blue-100`}
              name="story"
              placeholder={value.length > 0 ? value : 'Please input...'}
              value={''}
            />
          </div>
        );
      default:
        return <p>No valid form input type</p>;
    }
  };

  return (
    <>
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) =>
          composeInput(`${id}_${i}`, v.type, v.label, v.value)
        )}
    </>
  );
};
