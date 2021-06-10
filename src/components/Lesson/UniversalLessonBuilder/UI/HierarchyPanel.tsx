import React, {useEffect} from 'react';
import {SlideOutTreeView} from './HierarchyPanel/SlideOutTreeView';
import {Transition} from '@headlessui/react';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import { ULBSelectionProps } from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface HierarchyPanelProps extends ULBSelectionProps{
  mode?: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HierarchyPanel = (props: HierarchyPanelProps) => {
  const {
    universalLessonDetails,
    hierarchyVisible,
    setHierarchyVisible,
    selectedPageID,
    setSelectedPageID,
    selectedPagePartID,
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
  } = props;

  const selectedPageDetails = universalLessonDetails.lessonPlan.find(
    (page: UniversalLessonPage) => page.id === selectedPageID
  );

  useEffect(() => {
    if (
      selectedPageID &&
      selectedPageDetails &&
      selectedPageDetails.pageContent.length > 0
    ) {
      setHierarchyVisible(false);
    }
  }, [selectedPageID]);

  return (
    <div
      className={`${hierarchyVisible ? 'relative w-48 h-0 bg-gray-400 z-50' : 'hidden'}`}>
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
          />
        </>
      </Transition>
    </div>
  );
};
