import React from 'react';
import RowComposer from '../../UniversalLessonBlockComponents/RowComposer';
import { UniversalLesson, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';

interface CoreBuilderProps {
  mode: 'building' | 'viewing';
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const { mode, universalLessonDetails, selectedPageDetails } = props;

  return (
    <div className={`bg-dark-gray`}>
      <div className={`w-full min-h-256 mx-auto`}>
        <RowComposer mode={mode} selectedPageDetails={selectedPageDetails} />
      </div>
    </div>
  );
};
