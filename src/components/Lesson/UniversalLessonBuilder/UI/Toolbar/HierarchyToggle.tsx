import Buttons from '../../../../Atoms/Buttons';
import React from 'react';
import { UniversalLessonPage } from '../../../../../interfaces/UniversalLessonInterfaces';
import { IoBookOutline } from 'react-icons/io5';

interface HierarchyToggleProps {
  selectedPageDetails?: UniversalLessonPage;
  handleSetHierarchyVisibility: () => void;
}

export const HierarchyToggle = (props: HierarchyToggleProps) => {
  const { selectedPageDetails, handleSetHierarchyVisibility } = props;
  const isTherePageContent = selectedPageDetails && selectedPageDetails.pageContent.length > 0;
  return (
    <Buttons
      disabled={!isTherePageContent}
      Icon={IoBookOutline}
      label="Hierarchy"
      onClick={handleSetHierarchyVisibility}
      btnClass="px-4"
    />
  );
};
