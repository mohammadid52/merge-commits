import {findIndex, update} from 'lodash';
import React, {useRef, useState} from 'react';
import {BiCheckCircle} from 'react-icons/bi';
import {BsCheck} from 'react-icons/bs';
import {GiCancel} from 'react-icons/gi';
import {HiPencil} from 'react-icons/hi';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface HeaderBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId: string;
  updateOnSave: any;
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
    pagePartId,
    updateOnSave,
  } = props;
  const {previewMode} = mode !== 'lesson' ? useULBContext() : true;

  const EditButton = ({onEdit, editing, onSave, onCancel}: any) => {
    const btnClass =
      'absolute right-1 flex items-center justify-center cursor-pointer p-0.5 px-1 z-100 text-xs edit-icon bg-gray-100 text-gray-400 bg-opacity-10 rounded hover:bg-opacity-20 transition-all w-auto';
    return editing ? (
      <div
        style={{bottom: '0.5rem'}}
        className={`absolute right-1 flex items-center justify-center w-auto text-xs`}>
        <span
          onClick={onCancel}
          className="cursor-pointer flex items-center justify-center p-0.5 px-1.5 z-100 edit-icon bg-gray-100 bg-opacity-10 rounded hover:bg-opacity-20 transition-all">
          Cancel
          <GiCancel className="hover:text-red-400 text-red-300 w-auto ml-1" size={14} />
        </span>
        <span
          onClick={onSave}
          className="cursor-pointer flex items-center justify-center p-0.5 px-1.5 z-100 ml-2 edit-icon bg-gray-100 bg-opacity-10 rounded hover:bg-opacity-20 transition-all">
          Save
          <BiCheckCircle
            className="hover:text-green-400 text-green-300 w-auto ml-1"
            size={14}
          />
        </span>
      </div>
    ) : (
      <div
        style={{bottom: '0.5rem'}}
        onClick={onEdit}
        className={`${btnClass} px-1.5 p-0.5`}>
        Edit Content
        <HiPencil className="hover:text-gray-400 text-gray-300 w-auto ml-1" size={14} />
      </div>
    );
  };

  const Header = ({inputID, inputValue, section = false}: any) => {
    const [editing, setEditing] = useState(false);
    const [updatedText, setUpdatedText] = useState(inputValue);

    const conditionalClass = classString || 'border-sea-green text-xl';
    const classStr = section ? conditionalClass : '';

    const onChange = (e: any) => {
      const {value} = e.target;
      setUpdatedText(value);
    };
    const onSave = () => {
      setEditing(false);
      updateOnSave(inputID, updatedText, pagePartId);
      setUpdatedText(updatedText);
    };

    const onEdit = () => {
      setEditing(true);
    };

    const onCancel = () => {
      setEditing(false);
      setUpdatedText(inputValue);
    };

    return (
      <div className="flex w-auto items-center justify-center">
        {editing ? (
          <input
            className={`${classStr} relative w-full flex border-b-4  font-medium text-left  flex-row items-center text-gray-100 mt-4 border-none bg-transparent z-50`}
            value={updatedText}
            id={inputID}
            autoFocus={true}
            onChange={onChange}
          />
        ) : (
          <h3
            className={`${classStr} relative w-full flex border-b-4  font-medium text-left  flex-row items-center text-gray-100 mt-4 border-none bg-transparent z-50`}>
            {updatedText}
          </h3>
        )}
        {!previewMode && (
          <EditButton
            editing={editing}
            onCancel={onCancel}
            onSave={onSave}
            onEdit={onEdit}
          />
        )}
      </div>
    );
  };

  const composeHeader = (inputID: string, inputValue: string, inputType: string) => {
    return (
      <h3
        id={inputID}
        className={`
            relative
            w-full flex font-medium text-left flex-row items-center text-gray-100 mt-4`}>
        {inputValue}
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
