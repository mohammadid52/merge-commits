import React, { useEffect, useState } from 'react';
import { FiLayers } from 'react-icons/fi';
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
    <div className={`${hierarchyVisible ? 'relative w-48 h-0 bg-gray-400 z-50' : 'hidden'}`}>
      <Transition
        show={hierarchyVisible}
        enter="transition duration-200"
        enterFrom="opacity-0 transform -translate-x-48"
        enterTo="opacity-100 transform translate-x-0"
        leave="transition duration-200"
        leaveFrom="opacity-100 transform translate-x-0"
        leaveTo="opacity-0 transform -translate-x-48">
        <>
          {/* Header */}
          <div className="relative bg-white py-2 ">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-400"></div>
            </div>
            <div className="relative flex text-center">
              <span className="text-sm text-gray-900">Layers</span>
            </div>
          </div>

          {/* The Tree View */}
          <SlideOutTreeView
            selectedPageDetails={selectedPageDetails}
            selectedPagePartDetails={selectedPagePartDetails}
            setSelectedPagePartDetails={setSelectedPagePartDetails}
            selectedPartContentDetails={selectedPartContentDetails}
            setSelectedPartContentDetails={setSelectedPartContentDetails}
          />
        </>
      </Transition>
    </div>
  );
};
