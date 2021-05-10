import React, {useContext, useState} from 'react';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';

import PageSelector from '../UI/PageSelector';
import {Toolbar} from '../UI/Toolbar';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {CoreBuilder} from './CoreBuilder';
import {HierarchyPanel} from '../UI/HierarchyPanel';
import {BuilderMenu} from '../UI/BuilderMenu';
import ModalPopIn from '../../../Molecules/ModalPopIn';
import NewPageDialog from '../UI/ModalDialogs/NewPageDialog';

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
  const {userLanguage, clientKey} = useContext(GlobalContext);
  //@ts-ignore
  const {UniversalBuilderDict} = useDictionary(clientKey);

  const [loading, setLoading] = useState(false);

  // UI elements show/hide
  const [hierarchyVisible, setHierarchyVisible] = useState<boolean>(false);
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [builderMenuVisible, setBuilderMenuVisible] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);
  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  const handleModalPopToggle = (dialogToToggle: string) => {
    if(modalPopVisible){
      // setModalPopVisible(false)
    } else {
      setModalPopVisible(true);
    }
    if(currentModalDialog !== dialogToToggle){
      setCurrentModalDialog(dialogToToggle);
    }
  }

  const modalDialogSwitch = (dialogLabel: string) => {
    switch (dialogLabel) {
      default:
        return <NewPageDialog />;
    }
  };

  return (
    <div className="relative bg-white shadow-5 overflow-hidden sm:rounded-lg">
      <Toolbar
        selectedPageDetails={selectedPageDetails}
        hierarchyVisible={hierarchyVisible}
        setHierarchyVisible={setHierarchyVisible}
        galleryVisible={galleryVisible}
        setGalleryVisible={setGalleryVisible}
        builderMenuVisible={builderMenuVisible}
        setBuilderMenuVisible={setBuilderMenuVisible}
      />

      {modalPopVisible && (
        <ModalPopIn
          closeAction={()=>setModalPopVisible(false)}
          inputJSX={modalDialogSwitch('')}
        />
      )}

      <HierarchyPanel
        hierarchyVisible={hierarchyVisible}
        setHierarchyVisible={setHierarchyVisible}
        selectedPageDetails={selectedPageDetails}
        selectedPagePartDetails={selectedPagePartDetails}
        setSelectedPagePartDetails={setSelectedPagePartDetails}
        selectedPartContentDetails={selectedPartContentDetails}
        setSelectedPartContentDetails={setSelectedPartContentDetails}
      />

      <PageSelector
        universalLessonDetails={universalLessonDetails}
        universalBuilderDict={UniversalBuilderDict}
        userLanguage={userLanguage}
        galleryVisible={galleryVisible}
        loading={loading}
        selectedPageDetails={selectedPageDetails}
        setSelectedPageDetails={setSelectedPageDetails}
        handleModalPopToggle={handleModalPopToggle}
      />

      <BuilderMenu
        galleryVisible={galleryVisible}
        setGalleryVisible={setGalleryVisible}
        builderMenuVisible={builderMenuVisible}
      />

      {/*<EditPanel*/}
      {/*  selectedPageDetails={selectedPageDetails}*/}
      {/*  setSelectedPageDetails={setSelectedPageDetails}*/}
      {/*  selectedPagePartDetails={selectedPagePartDetails}*/}
      {/*  setSelectedPagePartDetails={setSelectedPagePartDetails}*/}
      {/*  selectedPartContentDetails={selectedPartContentDetails}*/}
      {/*  setSelectedPartContentDetails={setSelectedPartContentDetails}*/}
      {/*  initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}*/}
      {/*/>*/}

      <CoreBuilder
        mode={mode}
        universalLessonDetails={universalLessonDetails}
        galleryVisible={galleryVisible}
        hierarchyVisible={hierarchyVisible}
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
