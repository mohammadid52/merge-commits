import React, { useContext, useState } from 'react';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { UniversalBuilderDict } from '../../../../dictionary/dictionary.iconoclast';

import PageSelector from '../UI/PageSelector';
import { Toolbar } from '../UI/Toolbar';
import { UniversalLesson, UniversalLessonPage } from '../../../../interfaces/UniversalLessonInterfaces';
import { CoreBuilder } from './CoreBuilder';

interface ExistingLessonTemplateProps {
  universalLessonDetails?: UniversalLesson;
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
  selectedPageDetails?: UniversalLessonPage;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
}

// GRID SHOWING EXISTING TEMPLATES TILES
const BuilderWrapper = (props: ExistingLessonTemplateProps) => {
  const {
    universalLessonDetails,
    selectedPageDetails,
    setSelectedPageDetails,
    universalBuilderStep,
    setUniversalBuilderStep,
    universalBuilderTemplates,
  } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { UniversalBuilderDict } = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  // UI elements show/hide
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);

  return (
    <div className=" relative bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
      <Toolbar galleryVisible={galleryVisible} setGalleryVisible={setGalleryVisible} />

      <PageSelector
        universalLessonDetails={universalLessonDetails}
        universalBuilderDict={UniversalBuilderDict}
        userLanguage={userLanguage}
        galleryVisible={galleryVisible}
        loading={loading}
        selectedPageDetails={selectedPageDetails}
        setSelectedPageDetails={setSelectedPageDetails}
      />

      <CoreBuilder
        universalLessonDetails={universalLessonDetails}
        selectedPageDetails={selectedPageDetails}
        galleryVisible={galleryVisible}
      />
    </div>
  );
};

export default BuilderWrapper;
