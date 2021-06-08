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
import Buttons from '../../../Atoms/Buttons';
import {EditQuestionModalDict} from '../../../../dictionary/dictionary.iconoclast';
import {uniqueId} from 'lodash';
import Selector from '../../../Atoms/Form/Selector';
import ColorPicker from '../UI/ColorPicker/ColorPicker';

interface ExistingLessonTemplateProps extends ULBSelectionProps {
  mode?: 'building' | 'viewing';
  universalBuilderStep?: string;
  setUniversalBuilderStep?: React.Dispatch<React.SetStateAction<string>>;
  universalBuilderTemplates?: any[];
  initialUniversalLessonPagePartContent: PartContent;
  addFromULBHandler?: (pageId: string, newDataObject: any) => void;
}

// GRID SHOWING EXISTING TEMPLATES TILES
const BuilderWrapper = (props: ExistingLessonTemplateProps) => {
  const {
    mode,
    deleteFromULBHandler,
    updateFromULBHandler,
    universalLessonDetails,
    addFromULBHandler,
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
  const closeAction = () => setAddContentModal({type: '', show: false});

  const onSave = (fieldId: string) => {
    const value: string = getValue(fieldId);
    const pageContentId: string = uniqueId(`${selectedPageID}_`);
    const partContentId: string = uniqueId(`${pageContentId}_`);
    const fontSizeClass: string = convertSizeNameToClass(selectedValues.size);
    const bgColorClass: string = selectedValues.color;
    const newDataObject = {
      id: pageContentId,
      partType: 'default',
      class: 'rounded-lg',
      partContent: [
        {
          id: partContentId,
          type: 'header-section',
          value: [value],
          class: `${fontSizeClass} border-${bgColorClass}`,
        },
      ],
    };
    // add data to list
    addFromULBHandler(selectedPageID, newDataObject);
    // close modal after saving
    closeAction();
    // clear fields
    setInputFields({
      ...inputFields,
      [fieldId]: '',
    });
  };

  function capitalizeFirstLetter(str: string = '') {
    if (str.length > 0) {
      const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
  }

  const fontSizeList = [
    {id: 1, name: 'smallest'},
    {id: 2, name: 'small'},
    {id: 3, name: 'medium'},
    {id: 4, name: 'large'},
    {id: 5, name: 'largest'},
  ];

  const [selectedValues, setSelectedValues] = useState({
    size: 'medium',
    color: 'sea-green',
  });

  const convertSizeNameToClass = (sizeName: string) => {
    switch (sizeName) {
      case 'smallest':
        return 'text-base';
      case 'small':
        return 'text-lg';
      case 'medium':
        return 'text-xl';
      case 'large':
        return 'text-2xl';
      case 'largest':
        return 'text-3xl';
      default:
        return 'text-xl';
    }
  };
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const handleColorPickerSelect = (pickedColor: string) => {
    setSelectedValues({...selectedValues, color: pickedColor});
    setColorPickerActive(false);
  };
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
        <Modal
          showHeader={false}
          showFooter={false}
          showHeaderBorder={false}
          closeOnBackdrop
          closeAction={() => hideAllModals()}>
          <div className="min-w-256">{modalDialogSwitch(currentModalDialog)}</div>
        </Modal>
      )}
      {addContentModal.show && (
        <Modal
          showHeader={true}
          title={`Add ${capitalizeFirstLetter(addContentModal.type)}`}
          showHeaderBorder={true}
          showFooter={false}
          closeAction={closeAction}>
          <div className="min-w-256">
            <div className="grid grid-cols-2 my-2 gap-4">
              <div className="col-span-2">
                <FormInput
                  onChange={onChange}
                  label={capitalizeFirstLetter(addContentModal.type)}
                  isRequired
                  value={getValue(addContentModal.type)}
                  id={addContentModal.type}
                  placeHolder={`Enter ${addContentModal.type}`}
                  type="text"
                />
              </div>
              <Selector
                onChange={(c: any, name: string) =>
                  setSelectedValues({...selectedValues, size: name})
                }
                list={fontSizeList}
                placeholder="Select font size"
                selectedItem={selectedValues.size}
              />
              <button
                onClick={() => setColorPickerActive(!colorPickerActive)}
                className={`border-0 border-gray-300 rounded shadow-xs flex items-center justify-center`}>
                <span className={'text-gray-700 w-auto text-sm mr-2'}>
                  Select Border Color{' '}
                </span>

                <span
                  className={`h-4 block w-4 bg-${selectedValues.color} rounded-full`}></span>
              </button>
              {colorPickerActive && (
                <ColorPicker classString={''} callbackColor={handleColorPickerSelect} />
              )}
            </div>
            <div className="flex mt-8 justify-center px-6 pb-4">
              <div className="flex justify-end">
                <Buttons
                  btnClass="py-1 px-4 text-xs mr-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['CANCEL']}
                  onClick={closeAction}
                  transparent
                />
                <Buttons
                  btnClass="py-1 px-8 text-xs ml-2"
                  label={EditQuestionModalDict[userLanguage]['BUTTON']['SAVE']}
                  onClick={() => onSave(addContentModal.type)}
                />
              </div>
            </div>
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
