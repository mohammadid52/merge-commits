import React, { useContext, useState } from 'react';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { UniversalBuilderDict } from '../../../../dictionary/dictionary.iconoclast';

import PageSelector from '../UI/PageSelector';
import { Toolbar } from '../UI/Toolbar';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import { CoreBuilder } from './CoreBuilder';

interface ExistingLessonTemplateProps {
  mode?: 'building' | 'viewing';
  universalLessonDetails?: UniversalLesson;
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
  selectedPageDetails?: UniversalLessonPage;
  setSelectedPageDetails?: React.Dispatch<React.SetStateAction<UniversalLessonPage>>;
  selectedPagePartDetails: PagePart;
  setSelectedPagePartDetails: React.Dispatch<React.SetStateAction<PagePart>>;
  selectedPartContentDetails: PartContent;
  setSelectedPartContentDetails: React.Dispatch<React.SetStateAction<PartContent>>;
  initialUniversalLessonPagePartContent: PartContent;
}

// GRID SHOWING EXISTING TEMPLATES TILES
const BuilderWrapper = (props: ExistingLessonTemplateProps) => {
  const {
    mode,
    universalLessonDetails,
    selectedPageDetails,
    setSelectedPageDetails,
    selectedPagePartDetails,
    setSelectedPagePartDetails,
    selectedPartContentDetails,
    setSelectedPartContentDetails,
    initialUniversalLessonPagePartContent,
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
        mode={mode}
        universalLessonDetails={universalLessonDetails}
        galleryVisible={galleryVisible}
        selectedPageDetails={selectedPageDetails}
        setSelectedPageDetails={setSelectedPageDetails}
        selectedPagePartDetails={selectedPagePartDetails}
        setSelectedPagePartDetails={setSelectedPagePartDetails}
        selectedPartContentDetails={selectedPartContentDetails}
        setSelectedPartContentDetails={setSelectedPartContentDetails}
        initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
      />
    </div>
  );
};

export default BuilderWrapper;
