import React, {useContext, useState, useEffect} from 'react';
import {IoIosMenu} from 'react-icons/io';

import useDictionary from '../../../../customHooks/dictionary';
import {useQuery} from '../../../../customHooks/urlParam';
import {GlobalContext} from '../../../../contexts/GlobalContext';

import {
  PartContent,
  UniversalLessonPage,
} from '../../../../interfaces/UniversalLessonInterfaces';
import {CoreBuilder} from './CoreBuilder';

import {ULBSelectionProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

import Modal from '../../../Atoms/Modal';

import NewPageDialog from '../UI/ModalDialogs/NewPageDialog';
import AddContentDialog from '../UI/ModalDialogs/AddContentDialog';
import UseTemplateDialog from '../UI/ModalDialogs/UseTemplateDialog';
import PageSelector from '../UI/PageSelector';
// import {Toolbar} from '../UI/Toolbar';
// import {HierarchyPanel} from '../UI/HierarchyPanel';
import {BuilderMenu} from '../UI/BuilderMenu';
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
  LINK,
  SELECT_MANY,
  SELECT_ONE,
  INPUT,
  ATTACHMENTS,
  DATE_PICKER,
  INPUT_WITH_EMOJI,
  FORM_TYPES,
} from '../UI/common/constants';
import UniversalInputDialog from '../UI/ModalDialogs/UniversalInputDialog';
import UniversalOptionDialog from '../UI/ModalDialogs/UniversalOptionDialog';
import useUnsavedChanges from '../hooks/useUnsavedChanges';
import LessonPlanNavigation from '../UI/LessonPlanNavigation';
import NewLessonPlanSO from '../UI/UIComponents/NewLessonPlanSO';
import {Accordion} from '../UI/UIComponents/Accordian';

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
    initialUniversalLessonPagePartContent,
  } = props;
  const {
    userLanguage,
    clientKey,
    state: {user},
  } = useContext(GlobalContext);
  const {
    universalLessonDetails,
    selectedPageID,
    setSelectedPageID,
    blockConfig,
    setBlockConfig,
    getCurrentPage,
  } = useULBContext();

  //@ts-ignore
  const {UniversalBuilderDict} = useDictionary(clientKey);
  const params = useQuery(location.search);
  const isNewPage = params.get('isNewPage');
  const lessonId = params.get('lessonId');

  const [loading] = useState(false);

  // UI elements show/hide
  const [hierarchyVisible, setHierarchyVisible] = useState<boolean>(false);
  const [galleryVisible, setGalleryVisible] = useState<boolean>(false);
  const [builderMenuVisible, setBuilderMenuVisible] = useState<boolean>(false);
  // Modal popIn
  const [modalPopVisible, setModalPopVisible] = useState<boolean>(false);

  const [currentModalDialog, setCurrentModalDialog] = useState<string>('');

  // Manage image gallery component
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [selectedImageFromGallery, setSelectedImageFromGallery] = useState<string>('');

  useEffect(() => {
    if (isNewPage === 'true') {
      handleModalPopToggle(dialogLabelList.NEW_PAGE);
    }
  }, []);

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
  const [suggestionModal, setSuggestionModal] = useState({
    show: false,
    data: [{title: '', content: [{id: '', text: ''}]}],
    selectedResponse: [],
    idx: 0,
  });

  const [addContentModal, setAddContentModal] = useState<{show: boolean; type: string}>({
    show: true,
    type: FORM_TYPES.MULTIPLE,
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

    const updateBlockContent = (
      targetID: string,
      propertyToTarget: string,
      contentType: string,
      inputValue: any,
      _: number,
      classString: string
    ) => {
      return updateBlockContentULBHandler(
        targetID || blockConfig.targetId,
        propertyToTarget || section,
        contentType,
        inputValue,
        position,
        classString
      );
    };

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
      setUnsavedChanges,
      askBeforeClose,
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
            {...commonProps}
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
      case FORM_TYPES.VIDEO:
        return <YouTubeMediaDialog {...commonProps} />;
      case FORM_TYPES.CUSTOM_VIDEO:
        return (
          <ImageFormComponent
            {...commonProps}
            customVideo
            handleGalleryModal={handleGalleryModal}
            selectedImageFromGallery={selectedImageFromGallery}
          />
        );
      case FORM_TYPES.TAG:
        return <TagInputDialog {...commonProps} />;
      case FORM_TYPES.JUMBOTRON:
        return (
          <JumbotronFormDialog classString={selectedContentClass} {...commonProps} />
        );
      case FORM_TYPES.HIGHLIGHTER:
        return <HighlighterFormDialog {...commonProps} />;
      case FORM_TYPES.POEM:
        return <LinestarterModalDialog {...commonProps} />;
      case FORM_TYPES.KEYWORDS:
        return <KeywordModalDialog {...commonProps} />;
      case FORM_TYPES.LINKS:
        return <LinksModalDialog {...commonProps} />;

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
            setUnsavedChanges={setUnsavedChanges}
            askBeforeClose={askBeforeClose}
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
            suggestionModal={suggestionModal}
            setSuggestionModal={setSuggestionModal}
            updateContent={updateBlockContent}
            setUnsavedChanges={setUnsavedChanges}
            askBeforeClose={askBeforeClose}
            closeAction={closeAction}
            selectedForm={type === FORM_TYPES.RADIO ? SELECT_ONE : SELECT_MANY}
          />
        );

      default:
        break;
    }
  };

  /**
   *
   * @param dialogLabel string
   * @returns modal title name for parent level modals
   */
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

  const getComponentTitle = (type: string) => {
    switch (type) {
      case FORM_TYPES.TEXT:
        return 'Input Component';
      case FORM_TYPES.EMOJI:
        return 'Emoji Component';
      case FORM_TYPES.RADIO:
        return 'Single Option Component';
      case FORM_TYPES.MULTIPLE:
        return 'Multiple Options Component';
      case FORM_TYPES.DATE_PICKER:
        return 'Date Picker Component';
      case FORM_TYPES.CUSTOM_VIDEO:
        return 'Video Component';
      case FORM_TYPES.HIGHLIGHTER:
        return 'Highlighter Component';
      case FORM_TYPES.POEM:
        return 'Poem Component';
      case FORM_TYPES.LINK:
        return 'Link Component';
      default:
        return `${capitalizeFirstLetter(type)} Component`;
    }
  };

  const {
    UnsavedModal,
    askBeforeClose,
    unsavedChanges,
    setUnsavedChanges,
  } = useUnsavedChanges(closeAction);

  return (
    <div
      id={`builderWrapper`}
      className="relative h-full bg-white shadow-5 sm:rounded-lg flex flex-col">
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
          title={getComponentTitle(addContentModal.type)}
          showHeaderBorder={true}
          showFooter={false}
          titleButton={
            !blockConfig.isEditingMode && (
              <span
                onClick={() => {
                  if (unsavedChanges) {
                    askBeforeClose();
                  } else {
                    hideAllModals();
                    handleModalPopToggle(dialogLabelList.ADD_CONTENT);
                  }
                }}
                className="ml-4 inline-flex items-center px-3 py-0.5 rounded-md cursor-pointer text-sm font-medium bg-gray-200 text-gray-800 w-auto">
                Go Back
              </span>
            )
          }
          closeAction={askBeforeClose}>
          <div className="min-w-256">
            <>{modalByType(addContentModal.type)}</>
          </div>
          <UnsavedModal />
        </Modal>
      )}

      {suggestionModal.show && (
        <Modal
          showHeader={true}
          title={'Option Suggestions'}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={() =>
            setSuggestionModal({
              ...suggestionModal,
              data: [{title: '', content: [{id: '', text: ''}]}],
              show: false,
            })
          }>
          <div style={{minWidth: '30rem'}} className="bg-white">
            {suggestionModal.data.map((item) => (
              <Accordion
                onResponseSelect={(r: any) => {
                  setSuggestionModal({
                    ...suggestionModal,
                    show: false,
                    selectedResponse: r,
                  });
                }}
                title={item.title}
                content={item.content}
              />
            ))}
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

      {/* NO LONGER IN USE*/}
      {/* <BuilderMenu
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
        lessonId={lessonId}
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
        handleEditBlockContent={handleEditBlockContent}
        handleModalPopToggle={handleModalPopToggle}
        handleTagModalOpen={handleTagModalOpen}
        updateBlockContentULBHandler={updateBlockContentULBHandler}
        activePageData={selectedPageID ? getCurrentPage(selectedPageID) : {}}
      />
    </div>
  );
};

export default BuilderWrapper;
