import React, {useContext, useState, useEffect} from 'react';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';

import PageSelector from '../UI/PageSelector';
import {Toolbar} from '../UI/Toolbar';
import {PartContent} from '../../../../interfaces/UniversalLessonInterfaces';
import {CoreBuilder} from './CoreBuilder';
import {HierarchyPanel} from '../UI/HierarchyPanel';
import {BuilderMenu} from '../UI/BuilderMenu';

import NewPageDialog from '../UI/ModalDialogs/NewPageDialog';
import AddContentDialog from '../UI/ModalDialogs/AddContentDialog';

import UseTemplateDialog from '../UI/ModalDialogs/UseTemplateDialog';
import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

import Modal from '../../../Atoms/Modal';

import HeaderModalComponent from '../UI/ModalDialogs/HeaderFormDialog';
import ParaModalComponent from '../UI/ModalDialogs/ParaFormDialog';
import InputModalComponent from '../UI/ModalDialogs/InputFormDialog';
import YouTubeMediaDialog from '../UI/ModalDialogs/YouTubeMediaDialog';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import ImageFormComponent from '../UI/FormElements/ImageComponent';
import EditPageNameDialog from '../UI/ModalDialogs/EditPageNameDialog';
import TagInputDialog from '../UI/ModalDialogs/TagInputDialog';

import CheckpointComponent from '../UI/ModalDialogs/CheckpointFormDialog';
import JumbotronFormDialog from '../UI/ModalDialogs/JumbotronModalDialog';
import LinestarterModalDialog from '../UI/ModalDialogs/LinestarterModalDialog';
import ImageGallery from '../UI/ImageGallery';
import KeywordModalDialog from '../UI/ModalDialogs/KeywordModalDialog';
import HighlighterFormDialog from '../UI/ModalDialogs/HighlighterFormDialog';
import LinksModalDialog from '../UI/ModalDialogs/LinksModalDialog';
import {
  FORM_TYPES,
  LINK,
  SELECT_MANY,
  SELECT_ONE,
  INPUT,
  ATTACHMENTS,
  DATE_PICKER,
  INPUT_WITH_EMOJI,
} from '../UI/common/constants';
import UniversalInputDialog from '../UI/ModalDialogs/UniversalInputDialog';
import UniversalOptionDialog from '../UI/ModalDialogs/UniversalOptionDialog';
import LessonPlanNavigation from '../UI/LessonPlanNavigation';
import { useQuery } from '../../../../customHooks/urlParam';

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
    createNewBlockULBHandler,
    updateBlockContentULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
    selectedPageID,
    setSelectedPageID,
    initialUniversalLessonPagePartContent,
  } = props;
  const {
    userLanguage,
    clientKey,
    state: {user},
  } = useContext(GlobalContext);
  const {universalLessonDetails} = useULBContext();
  //@ts-ignore
  const {UniversalBuilderDict} = useDictionary(clientKey);
  const params = useQuery(location.search);
  const isNewPage = params.get('isNewPage');

  const [loading] = useState(false);

  // UI elements show/hide
  const [hierarchyVisible, setHierarchyVisible] = useState<boolean>(false);
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [builderMenuVisible, setBuilderMenuVisible] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);
  const [blockConfig, setBlockConfig] = useState<{
    section: string;
    position: number;
    targetId: string;
    classString?: string;
    inputObj?: any;
    isEditingMode?: boolean;
  }>({
    section: 'pageContent',
    position: 0,
    targetId: '',
  });
  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  // Manage image gallery component
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [selectedImageFromGallery, setSelectedImageFromGallery] = useState<string>('');

  useEffect(() => {
    if (isNewPage === 'true') {
      handleModalPopToggle(dialogLabelList.NEW_PAGE);
    }
  },[]);

  const handleGalleryModal = () => {
    setOpenGallery((prevShow) => !prevShow);
  };
  const onSelectImage = (url: string) => {
    setSelectedImageFromGallery(url);
    setOpenGallery(false);
  };

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
    setAddContentModal({type: '', show: false});
    setCurrentModalDialog('');
  };

  const handleModalPopToggle = (
    dialogToToggle: string,
    position?: number,
    section: string = 'pageContent',
    targetId?: string
  ) => {
    // Hide all UI Menus
    hideAllUIMenus();

    // Toggle Modal Pop Visibility
    if (!modalPopVisible) {
      setBlockConfig({
        section,
        position,
        targetId,
        isEditingMode: false,
      });
      setModalPopVisible(true);
    }
    // Toggle Which Dialog is Shown
    if (currentModalDialog !== dialogToToggle) {
      setCurrentModalDialog(dialogToToggle);
    }
  };

  const handleEditBlockContent = (
    type: string,
    section: string = 'pageContent',
    inputObj: any,
    targetContainerId: string, // Parent id of element like page id in case of page content and page_content id in case of page part editing
    indexToUpdate: number,
    classString: string = ''
  ) => {
    // Hide all UI Menus
    hideAllUIMenus();
    setAddContentModal({type, show: true});
    setBlockConfig({
      section,
      position: indexToUpdate,
      targetId: targetContainerId,
      classString,
      inputObj,
      isEditingMode: true,
    });
    // if (type !== 'video' && type !== 'image') {
    //   setInputFields((prevInputFields: any) => ({
    //     ...prevInputFields,
    //     [type]: inputObj && inputObj.length ? inputObj[0] : ""
    //   }));
    // }
  };

  const handleTagModalOpen = (targetId: string, inputObj: any) => {
    setAddContentModal({type: 'tag', show: true});
    setBlockConfig({
      section: 'pageContent',
      position: 0,
      targetId,
      classString: '',
      inputObj: inputObj,
      isEditingMode: false,
    });
  };

  const [addContentModal, setAddContentModal] = useState<{show: boolean; type: string}>({
    show: false,
    type: '',
  });

  const dialogLabelList = {
    VIEW_PAGES: 'VIEW_PAGES',
    NEW_PAGE: 'NEW_PAGE',
    ADD_CONTENT: 'ADD_CONTENT',
    USE_TEMPLATE: 'USE_TEMPLATE',
  };

  const modalDialogSwitch = (dialogLabel: string) => {
    switch (dialogLabel) {
      case dialogLabelList.VIEW_PAGES:
        return (
          <PageSelector
            universalLessonDetails={universalLessonDetails}
            deleteFromULBHandler={deleteFromULBHandler}
            universalBuilderDict={UniversalBuilderDict}
            userLanguage={userLanguage}
            galleryVisible={galleryVisible}
            loading={loading}
            setEditModal={setEditModal}
            selectedPageID={selectedPageID}
            setSelectedPageID={setSelectedPageID}
            handleModalPopToggle={handleModalPopToggle}
            hideAllModals={hideAllModals}
          />
        );
      case dialogLabelList.NEW_PAGE:
        return (
          <NewPageDialog
            universalLessonDetails={universalLessonDetails}
            closeAction={hideAllModals}
          />
        );
      case dialogLabelList.USE_TEMPLATE:
        return <UseTemplateDialog />;
      case dialogLabelList.ADD_CONTENT:
        return (
          <AddContentDialog
            hideAllModals={hideAllModals}
            addContentModal={addContentModal}
            setAddContentModal={setAddContentModal}
          />
        );

      default:
        return (
          <NewPageDialog
            universalLessonDetails={universalLessonDetails}
            closeAction={hideAllModals}
          />
        );
    }
  };

  const closeAction = () => setAddContentModal({type: '', show: false});

  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }

  const modalByType = (type: string) => {
    const {
      position = 0,
      section = 'pageContent',
      inputObj = {},
      classString: selectedContentClass = '',
    } = blockConfig;

    console.log(type);

    const updateBlockContent = (
      targetID: string,
      propertyToTarget: string,
      contentType: string,
      inputValue: any,
      _: number,
      classString: string
    ) =>
      updateBlockContentULBHandler(
        targetID || blockConfig.targetId,
        propertyToTarget || section,
        contentType,
        inputValue,
        position,
        classString
      );

    const createNewBlock = (
      targetID: string,
      propertyToTarget: string,
      contentType: string,
      inputValue: any,
      _: number,
      classString?: string
    ) =>
      createNewBlockULBHandler(
        targetID || blockConfig.targetId,
        propertyToTarget || section,
        contentType,
        inputValue,
        position,
        classString
      );

    let commonProps = {
      createNewBlockULBHandler: createNewBlock,
      closeAction: closeAction,
      inputObj: inputObj,
      selectedPageID,
      updateBlockContentULBHandler: updateBlockContent,
    };

    switch (type) {
      case 'header':
      case 'header-section':
        return (
          <HeaderModalComponent classString={selectedContentClass} {...commonProps} />
        );
      case 'questions':
        return <CheckpointComponent {...commonProps} />;
      case 'image':
        return (
          <ImageFormComponent
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
            handleGalleryModal={handleGalleryModal}
            selectedImageFromGallery={selectedImageFromGallery}
          />
        );
      case 'paragraph':
        return <ParaModalComponent {...commonProps} />;
      case 'input':
      case 'form-numbered':
      case 'form-default':
        return <InputModalComponent {...commonProps} contentType={type} />;
      case 'video':
        return (
          <YouTubeMediaDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );
      case 'tag':
        return (
          <TagInputDialog
            updateBlockContentULBHandler={updateBlockContent}
            closeAction={closeAction}
            inputObj={inputObj}
          />
        );
      case 'jumbotron':
        return (
          <JumbotronFormDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );
      case 'highlighter':
        return (
          <HighlighterFormDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );
      case 'poem':
        return (
          <LinestarterModalDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );
      case 'keywords':
        return (
          <KeywordModalDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );
      case 'links':
        return (
          <LinksModalDialog
            createNewBlockULBHandler={createNewBlock}
            closeAction={closeAction}
            inputObj={inputObj}
            updateBlockContentULBHandler={updateBlockContent}
          />
        );

      case FORM_TYPES.ATTACHMENTS:
      case FORM_TYPES.LINK:
      case FORM_TYPES.TEXT:
      case FORM_TYPES.DATE_PICKER:
      case FORM_TYPES.EMOJI:
        return (
          <UniversalInputDialog
            inputObj={inputObj}
            isEditingMode={blockConfig.isEditingMode}
            createNewContent={createNewBlock}
            updateContent={updateBlockContent}
            closeAction={closeAction}
            selectedForm={
              type === FORM_TYPES.ATTACHMENTS
                ? ATTACHMENTS
                : type === FORM_TYPES.LINK
                ? LINK
                : type === FORM_TYPES.EMOJI
                ? INPUT_WITH_EMOJI
                : type === FORM_TYPES.DATE_PICKER
                ? DATE_PICKER
                : type === FORM_TYPES.TEXT
                ? INPUT
                : INPUT
            }
          />
        );

      case FORM_TYPES.RADIO:
      case FORM_TYPES.MULTIPLE:
        return (
          <UniversalOptionDialog
            inputObj={inputObj}
            isEditingMode={blockConfig.isEditingMode}
            createNewContent={createNewBlock}
            updateContent={updateBlockContent}
            closeAction={closeAction}
            selectedForm={type === FORM_TYPES.RADIO ? SELECT_ONE : SELECT_MANY}
          />
        );

      default:
        break;
    }
  };

  const getTitleByType = (dialogLabel: string) => {
    switch (dialogLabel) {
      case dialogLabelList.ADD_CONTENT:
        return 'Add Content';
      case dialogLabelList.NEW_PAGE:
        return 'Add New Page';
      case dialogLabelList.VIEW_PAGES:
        return 'Lesson Pages';
      case dialogLabelList.USE_TEMPLATE:
        return 'Use Template';

      default:
        return 'Title';
    }
  };

  // For Edit Page Names
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editModal, setEditModal] = useState({
    show: false,
    content: {},
    editOnlyId: true,
  });
  const closeEditModal = () => setEditModal({show: false, content: {}, editOnlyId: true});
  const content: any = editModal.content;
  const getEditModalTitle = () => {
    if (!editModal.editOnlyId) {
      return `Edit - ${content.id}`;
    } else {
      return `Edit - ${content.partContentId || content.pageContentId}`;
    }
  };

  return (
    <div
      id={`builderWrapper`}
      className="relative h-full bg-white shadow-5 sm:rounded-lg flex flex-col">
      {/* <Toolbar
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
      /> */}
      <LessonPlanNavigation
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        universalLessonDetails={universalLessonDetails}
      />

      {modalPopVisible && (
        <Modal
          showHeader
          showFooter={false}
          showHeaderBorder
          title={getTitleByType(currentModalDialog)}
          closeOnBackdrop
          closeAction={hideAllModals}>
          <div className="min-w-256">{modalDialogSwitch(currentModalDialog)}</div>
        </Modal>
      )}
      {addContentModal.show && (
        <Modal
          showHeader={true}
          title={`Add ${capitalizeFirstLetter(addContentModal.type)} ${
            addContentModal.type === 'questions' ? 'To Lesson' : ''
          }`}
          showHeaderBorder={true}
          showFooter={false}
          titleButton={
            <span
              onClick={() => {
                hideAllModals();
                handleModalPopToggle(dialogLabelList.ADD_CONTENT);
              }}
              className="ml-4 inline-flex items-center px-3 py-0.5 rounded-md cursor-pointer text-sm font-medium bg-gray-200 text-gray-800 w-auto">
              Go Back
            </span>
          }
          closeAction={closeAction}>
          <div className="min-w-256">{modalByType(addContentModal.type)}</div>
        </Modal>
      )}

      {editModal.show && (
        <Modal
          showHeader={true}
          title={getEditModalTitle()}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={closeEditModal}>
          <div className="min-w-256">
            <EditPageNameDialog
              editOnlyId={editModal.editOnlyId}
              closeAction={closeEditModal}
              content={content}
            />
          </div>
        </Modal>
      )}
      {openGallery && (
        <Modal
          showHeader={true}
          title={`Select from gallery`}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={handleGalleryModal}>
          <div className="min-w-256">
            <ImageGallery basePath={`ULB/${user.id}`} onSelectImage={onSelectImage} />
          </div>
        </Modal>
      )}
      {/* <HierarchyPanel
        universalLessonDetails={universalLessonDetails}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        hierarchyVisible={hierarchyVisible}
        editMode={editMode}
        setEditMode={setEditMode}
        setEditModal={setEditModal}
        setHierarchyVisible={setHierarchyVisible}
      />

      <BuilderMenu
        galleryVisible={galleryVisible}
        setGalleryVisible={setGalleryVisible}
        builderMenuVisible={builderMenuVisible}
        setBuilderMenuVisible={setBuilderMenuVisible}
      /> */}

      <CoreBuilder
        mode={mode}
        createNewBlockULBHandler={createNewBlockULBHandler}
        deleteFromULBHandler={deleteFromULBHandler}
        updateFromULBHandler={updateFromULBHandler}
        universalLessonDetails={universalLessonDetails}
        galleryVisible={galleryVisible}
        hierarchyVisible={hierarchyVisible}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
        handleEditBlockContent={handleEditBlockContent}
        handleModalPopToggle={handleModalPopToggle}
        handleTagModalOpen={handleTagModalOpen}
        setEditModal={setEditModal}
      />
    </div>
  );
};

export default BuilderWrapper;
