import {findIndex, update} from 'lodash';
import React, {useState} from 'react';
import {BiCheckCircle} from 'react-icons/bi';
import {GiCancel} from 'react-icons/gi';
import {HiPencil} from 'react-icons/hi';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {
  RowComposerProps,
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {doResize} from '../../../../utilities/functions';

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  updateOnSave: any;
  pagePartId: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const {id, value, type, pagePartId, updateOnSave} = props;
  const {previewMode} = useULBContext();

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
          className="cursor-pointer flex items-center justify-center p-0.5 px-1.5 ml-2 z-100 edit-icon bg-gray-100 bg-opacity-10 rounded hover:bg-opacity-20 transition-all">
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

  const Paragraph = ({inputID, inputValue}: any) => {
    const [editing, setEditing] = useState(false);
    const [updatedText, setUpdatedText] = useState(inputValue);

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
      <div className="flex w-auto items-center p-4">
        {editing ? (
          <textarea
            value={updatedText}
            id={inputID}
            onKeyDown={(e: any) => doResize(e.target)}
            autoFocus={true}
            onChange={onChange}
            className="border-none bg-transparent"
          />
        ) : (
          <p key={inputID} id={inputID}>
            {updatedText}
          </p>
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

  const composeParagraph = (inputID: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return <Paragraph inputID={inputID} inputValue={inputValue} />;
    }
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => composeParagraph(id, v, type))}
    </div>
  );
};
