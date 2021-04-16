import Buttons from '../../../Atoms/Buttons';
import React from 'react';
import { VscNewFile, VscReferences, VscSave } from 'react-icons/vsc';
import DropdownFancy from '../../../Atoms/DropdownFancy';

interface BuilderMenuProps {
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
}

export const BuilderMenu = (props: BuilderMenuProps) => {
  const { galleryVisible, setGalleryVisible, builderMenuVisible } = props;
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
    <>
      <DropdownFancy options={dropDownOptions} builderMenuVisible={builderMenuVisible} />
    </>
  );
};
