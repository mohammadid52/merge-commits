import Buttons from '../../../../Atoms/Buttons';
import React, { useEffect, useState } from 'react';
import { UniversalLessonPage } from '../../../../../interfaces/UniversalLessonInterfaces';
import { IoBookOutline } from 'react-icons/io5';

interface HierarchyToggleProps {
  selectedPageDetails?: UniversalLessonPage;
  handleSetHierarchyVisibility: () => void;
}

export const HierarchyToggle = (props: HierarchyToggleProps) => {
  const { selectedPageDetails, handleSetHierarchyVisibility } = props;
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPageDetails && selectedPageDetails.pageContent.length > 0) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [selectedPageDetails]);

  return (
    <Buttons
      disabled={!enabled}
      Icon={IoBookOutline}
      label="Hierarchy"
      onClick={handleSetHierarchyVisibility}
      btnClass="px-4"
    />
  );
};
