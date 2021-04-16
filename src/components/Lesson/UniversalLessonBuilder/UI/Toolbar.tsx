import Buttons from '../../../Atoms/Buttons';
import React from 'react';
import { VscNewFile, VscReferences, VscSave } from 'react-icons/vsc';
import DropdownFancy from '../../../Atoms/DropdownFancy';
import { BuilderMenu } from './BuilderMenu';
import { HierarchyToggle } from './Toolbar/HierarchyToggle';
import { PageGalleryToggle } from './Toolbar/PageGalleryToggle';
import { UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';
import { BuilderMenuToggle } from './Toolbar/BuilderMenuToggle';

interface ToolbarProps {
  selectedPageDetails?: UniversalLessonPage;
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
  setBuilderMenuVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Toolbar = (props: ToolbarProps) => {
  const {
    selectedPageDetails,
    galleryVisible,
    setGalleryVisible,
    hierarchyVisible,
    setHierarchyVisible,
    builderMenuVisible,
    setBuilderMenuVisible,
  } = props;
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

  const handleSetHierarchyVisibility = () => {
    setHierarchyVisible(!hierarchyVisible);
  };

  const handleSetBuilderMenuVisibility = () => {
    setBuilderMenuVisible(!builderMenuVisible);
  };

  return (
    <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
      <div className={`grid grid-cols-3 gap-2`}>
        <HierarchyToggle
          selectedPageDetails={selectedPageDetails}
          handleSetHierarchyVisibility={handleSetHierarchyVisibility}
        />
        <PageGalleryToggle handleSetGalleryVisibility={handleSetGalleryVisibility} />
        <BuilderMenuToggle handleSetBuilderMenuVisibility={handleSetBuilderMenuVisibility} />
      </div>
    </div>
  );
};
