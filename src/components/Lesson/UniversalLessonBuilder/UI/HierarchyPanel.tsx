import React, { useEffect, useState } from 'react';
import { FiLayers } from 'react-icons/Fi';
import ButtonsRound from '../../../Atoms/ButtonsRound';
import { SlideOutTreeView } from './HierarchyPanel/SlideOutTreeView';
import { Transition } from '@headlessui/react';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';

interface HierarchyPanelProps {
  mode?: 'building' | 'viewing';
  selectedPageDetails?: UniversalLessonPage;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HierarchyPanel = (props: HierarchyPanelProps) => {
  const {
    selectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
    hierarchyVisible,
    setHierarchyVisible,
  } = props;

  useEffect(() => {
    if (selectedPageDetails && !(selectedPageDetails.pageContent.length > 0)) {
      setHierarchyVisible(false);
    }
  }, [selectedPageDetails]);

  return (
    <div className={`${hierarchyVisible ? 'absolute w-48 h-full bg-gray-600 z-50' : 'hidden'}`}>
      <Transition
        show={hierarchyVisible}
        enter="transition duration-200"
        enterFrom="opacity-0 transform -translate-x-48"
        enterTo="opacity-100 transform translate-x-0"
        leave="transition duration-200"
        leaveFrom="opacity-100 transform translate-x-0"
        leaveTo="opacity-0 transform -translate-x-48">
        <SlideOutTreeView
          selectedPageDetails={selectedPageDetails}
          selectedPagePartDetails={selectedPagePartDetails}
          setSelectedPagePartDetails={setSelectedPagePartDetails}
          selectedPartContentDetails={selectedPartContentDetails}
          setSelectedPartContentDetails={setSelectedPartContentDetails}
        />
      </Transition>
    </div>
  );
};
