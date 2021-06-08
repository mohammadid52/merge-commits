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
import AddContentDialog from '../UI/ModalDialogs/AddContentDialog';
import ApplyTemplateDialog from '../UI/ModalDialogs/UseTemplateDialog';
import UseTemplateDialog from '../UI/ModalDialogs/UseTemplateDialog';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import FormInput from '../../../Atoms/Form/FormInput';
import Modal from '../../../Atoms/Modal';

interface ExistingLessonTemplateProps extends ULBSelectionProps {
  mode?: 'building' | 'viewing';
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
  initialUniversalLessonPagePartContent: PartContent;
}

// GRID SHOWING EXISTING TEMPLATES TILES
const BuilderWrapper = (props: ExistingLessonTemplateProps) => {
  const {
    mode,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    selectedPageID,
    setSelectedPageID,
    initialUniversalLessonPagePartContent,
  } = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  //@ts-ignore
  const {UniversalBuilderDict} = useDictionary(clientKey);

  const [loading] = useState(false);

  // UI elements show/hide
  const [hierarchyVisible, setHierarchyVisible] = useState<boolean>(false);
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [builderMenuVisible, setBuilderMenuVisible] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);
  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  /**
   *
   *
   * MODAL CONTROLS
   *
   *
   * */

  const hideAllUIMenus = () => {
    if (hierarchyVisible) {
      setHierarchyVisible(false);
    }
    if (builderMenuVisible) {
      setBuilderMenuVisible(false);
    }
  };

  const hideAllModals = () => {
    setModalPopVisible(false);
    setCurrentModalDialog('');
  };

  const handleModalPopToggle = (dialogToToggle: string) => {
    // Hide all UI Menus
    hideAllUIMenus();

    // Toggle Modal Pop Visibility
    if (!modalPopVisible) {
      setModalPopVisible(true);
    }
    // Toggle Which Dialog is Shown
    if (currentModalDialog !== dialogToToggle) {
      setCurrentModalDialog(dialogToToggle);
    }
  };
  const [inputFields, setInputFields] = useState<any>({});

  const [addContentModal, setAddContentModal] = useState<{show: boolean; type: string}>({
    show: false,
    type: '',
  });

  const modalDialogSwitch = (dialogLabel: string) => {
    switch (dialogLabel) {
      case 'VIEW_PAGES':
        return (
          <PageSelector
            universalLessonDetails={universalLessonDetails}
            deleteFromULBHandler={deleteFromULBHandler}
            universalBuilderDict={UniversalBuilderDict}
            userLanguage={userLanguage}
            galleryVisible={galleryVisible}
            loading={loading}
            selectedPageID={selectedPageID}
            setSelectedPageID={setSelectedPageID}
            handleModalPopToggle={handleModalPopToggle}
            hideAllModals={hideAllModals}
          />
        );
      case 'NEW_PAGE':
        return <NewPageDialog />;
      case 'USE_TEMPLATE':
        return <UseTemplateDialog />;
      case 'ADD_CONTENT':
        return (
          <AddContentDialog
            hideAllModals={hideAllModals}
            addContentModal={addContentModal}
            setAddContentModal={setAddContentModal}
          />
        );
      default:
        return <NewPageDialog />;
    }
  };

  const onChange = (e: any) => {
    const {value, id} = e.target;
    setInputFields({
      ...inputFields,
      [id]: value,
    });
  };

  const getValue = (id: string) => inputFields[id];

  return (
    <div
      id={`builderWrapper`}
      className="relative h-full bg-white shadow-5 sm:rounded-lg flex flex-col">
      <Toolbar
        universalLessonDetails={universalLessonDetails}
        deleteFromULBHandler={deleteFromULBHandler}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        hierarchyVisible={hierarchyVisible}
        setHierarchyVisible={setHierarchyVisible}
        galleryVisible={galleryVisible}
        setGalleryVisible={setGalleryVisible}
        builderMenuVisible={builderMenuVisible}
        setBuilderMenuVisible={setBuilderMenuVisible}
        modalPopVisible={modalPopVisible}
        setModalPopVisible={setModalPopVisible}
        hideAllModals={hideAllModals}
        currentModalDialog={currentModalDialog}
        handleModalPopToggle={handleModalPopToggle}
      />

      {modalPopVisible && (
        <ModalPopIn
          closeAction={() => hideAllModals()}
          inputJSX={modalDialogSwitch(currentModalDialog)}
        />
      )}
      {addContentModal.show && (
        <Modal
          showHeader={true}
          title={'Add Header'}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={() => setAddContentModal({type: '', show: false})}>
          <div className="min-w-256 py-6">
            <FormInput
              onChange={onChange}
              label="Title"
              isRequired
              value={getValue('title')}
              id="title"
              placeHolder="Enter title"
              type="text"
            />
          </div>
        </Modal>
      )}

      <HierarchyPanel
        universalLessonDetails={universalLessonDetails}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        hierarchyVisible={hierarchyVisible}
        setHierarchyVisible={setHierarchyVisible}
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
        deleteFromULBHandler={deleteFromULBHandler}
        updateFromULBHandler={updateFromULBHandler}
        universalLessonDetails={universalLessonDetails}
        galleryVisible={galleryVisible}
        hierarchyVisible={hierarchyVisible}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
        handleModalPopToggle={handleModalPopToggle}
      />
    </div>
  );
};

export default BuilderWrapper;
