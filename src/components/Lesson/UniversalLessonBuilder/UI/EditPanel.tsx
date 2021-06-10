import React, { useEffect, useState } from 'react';
import { PagePart, PartContent, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';
import { Transition } from '@headlessui/react';
import { EditPanelForm } from './EditPanel/EditPanelForm';
import { EditPanelControls } from './EditPanel/EditPanelControls';

interface EditPanelProps {
  mode?: 'building' | 'viewing';
  selectedPageDetails?: UniversalLessonPage;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
  initialUniversalLessonPagePartContent: PartContent;
}

export const EditPanel = (props: EditPanelProps) => {
  const {
    selectedPageDetails,
    setSelectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
    initialUniversalLessonPagePartContent,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedPartContentDetails && selectedPartContentDetails.id !== '') {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selectedPartContentDetails]);

  /***************************************
   * EDIT PANEL FUNCTIONALITY            *
   ***************************************/
  const discardChanges = () => {
    setSelectedPartContentDetails(initialUniversalLessonPagePartContent);
  };

  const updateSelectedPageDetails = () => {
    const newPagePartDetails = {
      ...selectedPagePartDetails,
      partContent: selectedPagePartDetails.partContent.map((partContent: PartContent) => {
        if (partContent.id === selectedPartContentDetails.id) {
          return selectedPartContentDetails;
        } else {
          return partContent;
        }
      }),
    };
    const newPageDetails = {
      ...selectedPageDetails,
      pageContent: selectedPageDetails.pageContent.map((pageContent: PagePart) => {
        if (pageContent.id === selectedPagePartDetails.id) {
          return newPagePartDetails;
        } else {
          return pageContent;
        }
      }),
    };

    setSelectedPageDetails(newPageDetails);
  };

  return (
    <div className={`w-auto`}>
      <Transition
        show={isOpen}
        enter="transition duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 transform">
        <div className={`absolute right-0 w-auto h-full bg-white z-50`}>
          <div className={``}>
            <EditPanelForm
              selectedPagePartDetails={selectedPagePartDetails}
              setSelectedPagePartDetails={setSelectedPagePartDetails}
              selectedPartContentDetails={selectedPartContentDetails}
              setSelectedPartContentDetails={setSelectedPartContentDetails}
            />
            <EditPanelControls updateSelectedPageDetails={updateSelectedPageDetails} discardChanges={discardChanges} />
          </div>
        </div>
      </Transition>
    </div>
  );
};
