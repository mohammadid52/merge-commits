import React from 'react';
import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {HierarchyPanel} from '../UI/HierarchyPanel';
import {EditPanel} from '../UI/EditPanel';
import {RowWrapper} from '../../UniversalLessonBlockComponents/RowWrapper';
import {AddNewBlock} from '../../UniversalLessonBlockComponents/UtilityBlocks/AddNewBlock';
import {LessonPageWrapper} from '../../UniversalLessonBlockComponents/LessonPageWrapper';
import EditOverlayBlock from '../../UniversalLessonBlockComponents/UtilityBlocks/EditOverlayBlock';
import { ULBSelectionProps } from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface CoreBuilderProps extends ULBSelectionProps {
  mode: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
  hierarchyVisible?: boolean;
  initialUniversalLessonPagePartContent: PartContent;
  handleModalPopToggle?: (dialogToToggle: string) => void;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const {
    mode,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    selectedPageID,
    setSelectedPageID,
    targetID,
    setTargetID,
    selectedPagePartID,
    setSelectedPagePartID,
    selectedPartContentID,
    setSelectedPartContentID,
    handleModalPopToggle,
  } = props;

  return (
    <div className={`h-full bg-dark-gray overflow-hidden overflow-y-scroll`}>
      <div className={`relative w-full flex flex-row mx-auto`}>
        <LessonPageWrapper>
          <RowComposer
            mode={mode}
            deleteFromULBHandler={deleteFromULBHandler}
            updateFromULBHandler={updateFromULBHandler}
            universalLessonDetails={universalLessonDetails}
            selectedPageID={selectedPageID}
            setSelectedPageID={setSelectedPageID}
            targetID={targetID}
            setTargetID={setTargetID}
            selectedPagePartID={selectedPagePartID}
            setSelectedPagePartID={setSelectedPagePartID}
            selectedPartContentID={selectedPartContentID}
            setSelectedPartContentID={setSelectedPartContentID}
            handleModalPopToggle={handleModalPopToggle}
          />
        </LessonPageWrapper>
      </div>
    </div>
  );
};
