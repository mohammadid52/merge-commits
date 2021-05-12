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
import { RowWrapper } from '../../UniversalLessonBlockComponents/RowWrapper';
import { AddNewBlock } from '../../UniversalLessonBlockComponents/UtilityBlocks/AddNewBlock';
import { LessonPageWrapper } from '../../UniversalLessonBlockComponents/LessonPageWrapper';

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
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const {
    mode,
    selectedPageDetails,
    handleModalPopToggle
  } = props;

  return (
    <div className={`bg-dark-gray`}>
      <div className={`relative w-full flex flex-row min-h-256 mx-auto`}>
        <LessonPageWrapper selectedPageDetails={selectedPageDetails}>
        <RowComposer mode={mode} selectedPageDetails={selectedPageDetails} handleModalPopToggle={handleModalPopToggle}/>
          {/* SHOW ADD NEW BLOCK CONTROL */}
          {mode === 'building' && (
            <RowWrapper>
              <AddNewBlock mode={mode} handleModalPopToggle={handleModalPopToggle}/>
            </RowWrapper>
          )}
        </LessonPageWrapper>
      </div>
    </div>
  );
};
