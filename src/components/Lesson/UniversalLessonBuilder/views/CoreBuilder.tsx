import React from 'react';
import DummyBlock from '../../UniversalLessonBlockComponents/Dummy/DummyBlock';
import { UniversalLesson, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';

interface CoreBuilderProps {
  universalLessonDetails: UniversalLesson;
  selectedPageDetails?: UniversalLessonPage;
  galleryVisible?: boolean;
}

export const CoreBuilder = (props: CoreBuilderProps) => {
  const { universalLessonDetails, selectedPageDetails } = props;

  return (
    <div className={`bg-dark-gray`}>
      <div className={`w-full min-h-256 mx-auto`}>
        <DummyBlock selectedPageDetails={selectedPageDetails} />
      </div>
    </div>
  );
};
