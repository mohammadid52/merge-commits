import React from 'react';
import {HierarchyToggle} from './Toolbar/HierarchyToggle';
import {PageGalleryToggle} from './Toolbar/PageGalleryToggle';
import { UniversalLesson, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';
import {BuilderMenuToggle} from './Toolbar/BuilderMenuToggle';
import ModalPopIn from '../../../Molecules/ModalPopIn';
import NewPageDialog from './ModalDialogs/NewPageDialog';
import UseTemplateDialog from './ModalDialogs/UseTemplateDialog';
import AddContentDialog from './ModalDialogs/AddContentDialog';
import { ULBSelectionProps } from '../../../../interfaces/UniversalLessonBuilderInterfaces';

export interface ToolbarProps extends ULBSelectionProps {
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  galleryVisible?: boolean;
  setGalleryVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  builderMenuVisible?: boolean;
  setBuilderMenuVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  modalPopVisible?: boolean;
  setModalPopVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  hideAllModals?: () => void;
  currentModalDialog?: string;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export const Toolbar = (props: ToolbarProps) => {
  const {
    universalLessonDetails,
    deleteFromULBHandler,
    selectedPageID,
    galleryVisible,
    setGalleryVisible,
    hierarchyVisible,
    setHierarchyVisible,
    builderMenuVisible,
    setBuilderMenuVisible,
    modalPopVisible,
    setModalPopVisible,
    hideAllModals,
    currentModalDialog,
    handleModalPopToggle,
  } = props;

  const handleModalVisibility = (dialogToToggle?: string) => {
    if (dialogToToggle) {
      if (modalPopVisible) {
        if (currentModalDialog === dialogToToggle) {
          hideAllModals()
        } else {
          handleModalPopToggle(dialogToToggle);
        }
      } else {
        setModalPopVisible(true);
        handleModalPopToggle(dialogToToggle);
      }
    } else {
      hideAllModals()
    }
  };

  const handleSetGalleryVisibility = () => {
    handleModalVisibility('VIEW_PAGES');
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

  const selectedPageDetails = universalLessonDetails.universalLessonPages.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

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
          deleteFromULBHandler={deleteFromULBHandler}
        />
        <BuilderMenuToggle
          handleSetBuilderMenuVisibility={handleSetBuilderMenuVisibility}
        />
      </div>
    </div>
  );
};
