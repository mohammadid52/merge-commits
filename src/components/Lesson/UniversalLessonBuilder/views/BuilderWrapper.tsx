import CheckpointFormDialog from '@UlbModals/CheckpointFormDialog';
import DividerModal from '@UlbModals/DividerModal';
import DownloadModal from '@UlbModals/DownloadModal';
import HeaderModalComponent from '@UlbModals/HeaderFormDialog';
import HighlighterFormDialog from '@UlbModals/HighlighterFormDialog';
import InputModalComponent from '@UlbModals/InputFormDialog';
import JumbotronFormDialog from '@UlbModals/JumbotronModalDialog';
import KeywordModalDialog from '@UlbModals/KeywordModalDialog';
import LinestarterModalDialog from '@UlbModals/LinestarterModalDialog';
import LinksModalDialog from '@UlbModals/LinksModalDialog';
import NotesModalDialog from '@UlbModals/NotesModalDialog';
import ParaModalComponent from '@UlbModals/ParaFormDialog';
import ReviewSliderModal from '@UlbModals/ReviewSliderModal';
import UniversalInputDialog from '@UlbModals/UniversalInputDialog';
import UniversalOptionDialog from '@UlbModals/UniversalOptionDialog';
import WritingExerciseModal from '@UlbModals/WritingExerciseModal';
import YouTubeMediaDialog from '@UlbModals/YouTubeMediaDialog';
import {
  ATTACHMENTS,
  DATE_PICKER,
  DIVIDER,
  EMOTIONS,
  FORM_TYPES,
  FOUR_SEVEN_EIGHT,
  GRATITUDE,
  INPUT,
  INPUT_WITH_EMOJI,
  LINK,
  PARAGRAPH,
  SELECT_MANY,
  SELECT_ONE,
  SINGING_BOWL,
  SQUARE,
  THINK_ABOUT_IT
} from '@UlbUI/common/constants';
import ImageFormComponent from '@UlbUI/FormElements/ImageComponent';
import {Modal} from 'antd';
import Info from 'atoms/Alerts/Info';
import Buttons from 'atoms/Buttons';
// import Modal from 'atoms/Modal';
import ActivityModal from 'components/Lesson/UniversalLessonBuilder/UI/ModalDialogs/ActivityModal';
import DocsModal from 'components/Lesson/UniversalLessonBuilder/UI/ModalDialogs/DocsModal';
import {useOverlayContext} from 'contexts/OverlayContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import {
  IContentTypeComponentProps,
  ULBSelectionProps
} from 'interfaces/UniversalLessonBuilderInterfaces';
import {PartContent} from 'interfaces/UniversalLessonInterfaces';
import useUnsavedChanges from 'lesson/UniversalLessonBuilder/hooks/useUnsavedChanges';
import {CoreBuilder} from 'lesson/UniversalLessonBuilder/views/CoreBuilder';
import isEmpty from 'lodash/isEmpty';
import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router';
import {Accordion} from 'uiComponents/Accordian';
import {capitalizeFirstLetter, wait} from 'utilities/functions';

interface ExistingLessonTemplateProps extends ULBSelectionProps {
  mode: 'building' | 'viewing' | 'lesson';
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
  initialUniversalLessonPagePartContent: PartContent;
  instId: string;
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
    instId
  } = props;

  const {
    universalLessonDetails,
    selectedPageID,
    setSelectedPageID,
    blockConfig,
    setBlockConfig,
    getCurrentPage,
    suggestionModal,
    setSuggestionModal,

    setSavingStatus
  } = useULBContext();

  // const isNewPage = params.get('isNewPage');
  // const lessonId = params.get('lessonId');
  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;
  const isNewPage = route.params.isNewPage;

  // UI elements show/hide
  const [hierarchyVisible, setHierarchyVisible] = useState<boolean>(false);

  const {addContentModal, setAddContentModal} = useOverlayContext();

  useEffect(() => {
    if (isNewPage === 'true') {
      handleModalPopToggle(dialogLabelList.NEW_PAGE);
    }
  }, []);

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
  };

  const {
    setSelectedComponent,
    selectedComponent,
    setShowLocationIcon,

    setActiveContentItem
  } = usePageBuilderContext();

  useEffect(() => {
    if (!isEmpty(selectedComponent)) {
      setBlockConfig({
        ...blockConfig,
        position: selectedComponent.partContentIdx
      });
    }
  }, [selectedComponent]);

  const handleModalPopToggle = (
    _: string,
    position?: number,
    section: string = 'pageContent',
    targetId?: string
  ) => {
    // Hide all UI Menus
    hideAllUIMenus();

    // Toggle Modal Pop Visibility
    setBlockConfig({
      section,
      position,
      targetId,
      isEditingMode: false
    });
    // Toggle Which Dialog is Shown
    // if (currentModalDialog !== dialogToToggle) {
    //   setCurrentModalDialog(dialogToToggle);
    // }
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
    setAddContentModal({
      type: type === `${FORM_TYPES.REVIEW_SLIDER}-form` ? FORM_TYPES.REVIEW_SLIDER : type,
      show: true
    });

    setBlockConfig({
      section,
      position: indexToUpdate,
      targetId: targetContainerId,
      classString,
      inputObj,
      isEditingMode: true
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
      isEditingMode: false
    });
  };

  const dialogLabelList = {
    VIEW_PAGES: 'VIEW_PAGES',
    NEW_PAGE: 'NEW_PAGE',
    ADD_CONTENT: 'ADD_CONTENT',
    USE_TEMPLATE: 'USE_TEMPLATE'
  };

  const closeAction = (showPopup: boolean = false) => {
    setAddContentModal({type: '', show: false});
    setSelectedComponent(null);
    setShowLocationIcon(false);

    if (showPopup) {
      // setNavState('home');
      setActiveContentItem(null);
      // setActionMode('init');

      wait(700).then(() => {
        setSavingStatus('loading');
        wait(1000).then(() => {
          setSavingStatus('loaded');
          wait(1500).then(() => {
            setSavingStatus('initial');
          });
        });
      });
    }
  };

  /**
   * This is a hub for all the modal components
   * If you want to add a modal component,
   * first add constant type in constants.tsx and add component here
   */

  const modalByType = (type: string) => {
    const {
      section = 'pageContent',
      inputObj = {},
      classString: selectedContentClass = ''
    } = blockConfig;

    const updateBlockContent = (
      targetID: string,
      propertyToTarget: string,
      contentType: string,
      inputValue: any,
      position?: number,
      classString?: string
    ) => {
      return updateBlockContentULBHandler?.(
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
      position?: number,
      classString?: string,
      customPageContentId?: string
    ) =>
      createNewBlockULBHandler?.(
        targetID || blockConfig.targetId,
        propertyToTarget || section,
        contentType,
        inputValue,
        position,
        classString,
        customPageContentId
      );

    let commonProps: IContentTypeComponentProps = {
      createNewBlockULBHandler: createNewBlock,
      closeAction: () => closeAction(true),
      inputObj: inputObj,
      selectedPageID,
      updateBlockContentULBHandler: updateBlockContent,
      setUnsavedChanges,
      askBeforeClose: () => closeAction(false),
      setSavingStatus
    };

    switch (type) {
      case 'header':
      case 'header-section':
        return (
          <HeaderModalComponent classString={selectedContentClass} {...commonProps} />
        );
      case 'questions':
        return <CheckpointFormDialog {...commonProps} />;
      case 'image':
        return <ImageFormComponent {...commonProps} selectedImageFromGallery={''} />;
      case PARAGRAPH:
        return <ParaModalComponent {...commonProps} />;
      case DIVIDER:
        return <DividerModal {...commonProps} />;
      // case TABLE:
      // return <TableModal classString={selectedContentClass} {...commonProps} />;
      // Interactive component modals starts here
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
            selectedImageFromGallery={''}
          />
        );
      // case FORM_TYPES.TAG:
      //   return <TagInputDialog {...commonProps} />;
      case 'notes-form':
        return <NotesModalDialog {...commonProps} />;
      case FORM_TYPES.JUMBOTRON:
        return (
          <JumbotronFormDialog classString={selectedContentClass} {...commonProps} />
        );
      case FORM_TYPES.HIGHLIGHTER:
        return <HighlighterFormDialog {...commonProps} />;
      case FORM_TYPES.DOWNLOAD:
        return <DownloadModal {...commonProps} />;
      case FORM_TYPES.POEM:
      case 'poem-form-default':
        return <LinestarterModalDialog {...commonProps} />;
      case FORM_TYPES.KEYWORDS:
        return <KeywordModalDialog {...commonProps} />;
      case FORM_TYPES.LINKS:
        return <LinksModalDialog {...commonProps} />;

      case FORM_TYPES.WRITING_EXERCISE:
      case `writing-exercise-form-default`:
        return (
          <WritingExerciseModal classString={selectedContentClass} {...commonProps} />
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
            setUnsavedChanges={setUnsavedChanges}
            askBeforeClose={askBeforeClose}
            closeAction={() => closeAction(true)}
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
            setUnsavedChanges={setUnsavedChanges}
            askBeforeClose={askBeforeClose}
            closeAction={() => closeAction(true)}
            selectedForm={type === FORM_TYPES.RADIO ? SELECT_ONE : SELECT_MANY}
          />
        );

      case FORM_TYPES.REVIEW_SLIDER:
        return <ReviewSliderModal {...commonProps} />;

      case FORM_TYPES.DOCS:
        return <DocsModal {...commonProps} />;
      case SQUARE:
      case FOUR_SEVEN_EIGHT:
      case THINK_ABOUT_IT:
      case EMOTIONS:
      case GRATITUDE:
      case SINGING_BOWL:
        return <ActivityModal type={type} {...commonProps} />;

      default:
        return (
          <div className="flex items-center justify-center">
            <h3>Invalid type:{type} Please check it again</h3>
          </div>
        );
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
      case 'poem-form-default':
        return 'Poem Component';
      case FORM_TYPES.LINK:
        return 'Link Component';
      case FORM_TYPES.REVIEW_SLIDER:
        return 'Review Slider Component';
      case 'notes-form':
        return 'Notes Component';
      case FORM_TYPES.WRITING_EXERCISE:
      case 'writing-exercise-form-default':
        return 'Writing Exercise Component';
      case EMOTIONS:
        return 'Emotion Component';
      default:
        return `${capitalizeFirstLetter(type)} Component`;
    }
  };

  const {
    askBeforeClose,

    setUnsavedChanges
  } = useUnsavedChanges(closeAction);

  const [optionsCollapse, setOptionsCollapse] = useState(true);

  return (
    <div id={`builderWrapper`} className="relative  bg-dark-blue sm:rounded-lg">
      {/* <LessonPlanNavigation
        selectedPageID={selectedPageID}
        setSelectedPageID={setSelectedPageID}
        universalLessonDetails={universalLessonDetails}
      /> */}

      {/* {modalPopVisible && (
        <Modal
          showHeader
          showFooter={false}
          showHeaderBorder
          title={getTitleByType(currentModalDialog)}
          closeOnBackdrop
          closeAction={hideAllModals}>
          <div className="min-w-256">{modalDialogSwitch(currentModalDialog)}</div>
        </Modal>
      )} */}

      <Modal
        title={getComponentTitle(addContentModal.type)}
        onCancel={() => closeAction(false)}
        footer={null}
        open={addContentModal.show}>
        <div className="">
          <>{modalByType(addContentModal.type)}</>
        </div>
      </Modal>

      <Modal
        onCancel={() =>
          setSuggestionModal({
            ...suggestionModal,
            data: [{title: '', content: [{id: '', text: ''}]}],
            show: false
          })
        }
        open={suggestionModal.show}
        title={'Option Suggestions'}
        footer={null}>
        <div style={{minWidth: '30rem'}} className="bg-white ">
          <Info text="Click on value to see options" />
          <div className="max-h-132 overflow-y-scroll overflow-x-hidden">
            {suggestionModal.data.map((item: any) => (
              <Accordion
                overrideBool={optionsCollapse}
                onResponseSelect={(r: any) => {
                  setOptionsCollapse(true);
                  setSuggestionModal({
                    ...suggestionModal,
                    show: false,
                    selectedResponse: r
                  });
                }}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
          <Buttons
            btnClass="mt-4"
            label={`${optionsCollapse ? 'Show all options' : 'Collapse all options'} `}
            onClick={() => setOptionsCollapse(!optionsCollapse)}
          />
        </div>
      </Modal>

      <CoreBuilder
        mode={mode}
        instId={instId}
        createNewBlockULBHandler={createNewBlockULBHandler}
        deleteFromULBHandler={deleteFromULBHandler}
        updateFromULBHandler={updateFromULBHandler}
        universalLessonDetails={universalLessonDetails}
        galleryVisible={false}
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
