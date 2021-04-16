import React, { useState } from 'react';
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
}

export const HierarchyPanel = (props: HierarchyPanelProps) => {
  const {
    selectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={`w-auto h-full bg-gray-600`}>
      <div className={`absolute ml-2 mt-2`}>
        <ButtonsRound
          Icon={FiLayers}
          type={`button`}
          disabled={selectedPageDetails.pageContent.length <= 0}
          btnClass={`
          ${isOpen ? 'transition duration-200' : 'transition duration-200'}
          ${isOpen ? 'transform translate-x-48' : 'transform translate-x-0'}
          inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <Transition
        show={isOpen}
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
