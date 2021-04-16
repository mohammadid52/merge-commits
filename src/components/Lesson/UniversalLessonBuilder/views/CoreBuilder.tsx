import React from 'react';
import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import { HierarchyPanel } from '../UI/HierarchyPanel';
import { EditPanel } from '../UI/EditPanel';

interface CoreBuilderProps {
  mode: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
  initialUniversalLessonPagePartContent: PartContent;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const {
    mode,
    universalLessonDetails,
    selectedPageDetails,
    hierarchyVisible,
    galleryVisible,
    setSelectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
    initialUniversalLessonPagePartContent,
  } = props;

  return (
    <div className={`bg-dark-gray`}>
      <div className={`relative w-full flex flex-row min-h-256 mx-auto`}>
        <RowComposer mode={mode} selectedPageDetails={selectedPageDetails} />
      </div>
    </div>
  );
};
