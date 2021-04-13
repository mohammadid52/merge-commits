import Buttons from '../../../Atoms/Buttons';
import React from 'react';
import { VscNewFile, VscReferences, VscSave } from 'react-icons/vsc';
import DropdownFancy from '../../../Atoms/DropdownFancy';

interface ToolbarProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Toolbar = (props: ToolbarProps) => {
  const { galleryVisible, setGalleryVisible } = props;
  const dropDownOptions = [
    {
      value: 'Save Draft',
      option: 'Save Draft',
    },
    {
      value: 'Publish Lesson',
      option: 'Publish Lesson',
    },
    {
      value: 'Save Changes',
      option: 'Save Changes',
    },
    {
      value: 'Discard Changes',
      option: 'Discard Changes',
    },
    {
      value: 'Delete Lesson',
      option: 'Delete Lesson',
    },
  ];

  const handleSetGalleryVisibility = () => {
    setGalleryVisible(!galleryVisible);
  };

  return (
    <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
      <div className={`grid grid-cols-3 gap-2`}>
        <h3 className="text-lg leading-6 font-medium text-gray-900">The Lesson Title</h3>
        <Buttons label="Page Gallery" onClick={handleSetGalleryVisibility} btnClass="px-4" />
        <DropdownFancy options={dropDownOptions} />
      </div>
    </div>
  );
};
