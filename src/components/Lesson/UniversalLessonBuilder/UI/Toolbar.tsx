import React from 'react';
import {HierarchyToggle} from './Toolbar/HierarchyToggle';
import {PageGalleryToggle} from './Toolbar/PageGalleryToggle';
import {UniversalLessonPage} from '../../../../interfaces/UniversalLessonInterfaces';
import {BuilderMenuToggle} from './Toolbar/BuilderMenuToggle';
import ModalPopIn from '../../../Molecules/ModalPopIn';
import NewPageDialog from './ModalDialogs/NewPageDialog';
import UseTemplateDialog from './ModalDialogs/UseTemplateDialog';
import AddContentDialog from './ModalDialogs/AddContentDialog';

export interface ToolbarProps {
  selectedPageDetails?: UniversalLessonPage;
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
  setBuilderMenuVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  modalPopVisible?: boolean;
  setModalPopVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  currentModalDialog?: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
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
    modalPopVisible,
    setModalPopVisible,
    currentModalDialog,
    handleModalPopToggle,
  } = props;

  const handleModalVisibility = () => {
    if (modalPopVisible) {
      setModalPopVisible(false);
    }
  };

  const handleSetGalleryVisibility = () => {
    // handleModalVisibility();
    handleModalPopToggle('VIEW_PAGES')
    setGalleryVisible(!galleryVisible);
  };

  const handleSetHierarchyVisibility = () => {
    handleModalVisibility();
    setHierarchyVisible(!hierarchyVisible);
  };

  const handleSetBuilderMenuVisibility = () => {
    handleModalVisibility();
    setBuilderMenuVisible(!builderMenuVisible);
  };

  return (
    <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
      <div className={`grid grid-cols-3 gap-2`}>
        <HierarchyToggle
          selectedPageDetails={selectedPageDetails}
          handleSetHierarchyVisibility={handleSetHierarchyVisibility}
        />
        <PageGalleryToggle
          handleSetGalleryVisibility={handleSetGalleryVisibility}
          handleModalPopToggle={handleModalPopToggle}
        />
        <BuilderMenuToggle
          handleSetBuilderMenuVisibility={handleSetBuilderMenuVisibility}
        />
      </div>
    </div>
  );
};
