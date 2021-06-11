import React, {useEffect, useState} from 'react';
import {SlideOutTreeView} from './HierarchyPanel/SlideOutTreeView';
import {Transition} from '@headlessui/react';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import ClickAwayListener from 'react-click-away-listener';

interface HierarchyPanelProps extends ULBSelectionProps {
  mode?: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  hierarchyVisible?: boolean;
  setHierarchyVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setEditModal?: React.Dispatch<
    React.SetStateAction<{show: boolean; content: string; editOnlyId: boolean}>
  >;
}

export const HierarchyPanel = (props: HierarchyPanelProps) => {
  const {
    universalLessonDetails,
    hierarchyVisible,
    setHierarchyVisible,
    selectedPageID,

    editMode,
    setEditMode,
    setEditModal,
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
      className={`${
        hierarchyVisible ? 'relative min-w-72 max-w-96 h-0 bg-gray-400 z-50' : 'hidden'
      }`}>
      <Transition
        show={hierarchyVisible}
        enter="transition duration-200"
        enterFrom="opacity-0 transform -translate-x-48"
        enterTo="opacity-100 transform translate-x-0"
        leave="transition duration-300"
        leaveFrom="opacity-100 transform translate-x-0"
        leaveTo="opacity-0 transform -translate-x-48">
        <ClickAwayListener onClickAway={() => setHierarchyVisible(false)}>
          <div className="m-2 ">
            {/* Header */}
            <div className="relative text-white bg-gray-700 py-2 rounded-t-md">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-400"></div>
              </div>
              <div className="relative flex items-center justify-center px-4 text-center">
                <span className="text-md text-white font-semibold w-auto">Layers</span>]
              </div>
            </div>

            {/* The Tree View */}
            <SlideOutTreeView
              editMode={editMode}
              setHierarchyVisible={setHierarchyVisible}
              setEditModal={setEditModal}
              setEditMode={setEditMode}
              selectedPageDetails={selectedPageDetails}
            />
          </div>
        </ClickAwayListener>
      </Transition>
    </div>
  );
};
