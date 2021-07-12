import React, {useContext, useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {
  AiOutlineBgColors,
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from 'react-icons/ai';
import {BsLayoutSplit} from 'react-icons/bs';
import {HiPencil} from 'react-icons/hi';
import {IoCloseSharp} from 'react-icons/io5';
import {FaSortUp} from 'react-icons/fa';
import ButtonsRound from '../../../../Atoms/ButtonsRound';
import {FiEdit2} from 'react-icons/fi';

import {
  RowWrapperProps,
  ULBSelectionProps,
} from '../../../../../interfaces/UniversalLessonBuilderInterfaces';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';
import ColorPicker from '../../../UniversalLessonBuilder/UI/ColorPicker/ColorPicker';
import SplitColumnDropdown from '../../../UniversalLessonBuilder/UI/SplitColumn/SplitColumnDropdown';
import {updateLessonPageToDB} from '../../../../../utilities/updateLessonPageToDB';
import ModalPopUp from '../../../../Molecules/ModalPopUp';
import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';

interface EditOverlayControlsProps extends RowWrapperProps, ULBSelectionProps {
  isActive?: boolean;
  isComponent?: boolean;
  section?: string;
  handleEditBlockContent?: () => void;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {
    contentID,
    editedID,
    isActive,
    isPagePart,
    classString,
    isComponent,
    section,
    handleEditBlockContent,
    handleEditBlockToggle,
    createNewBlockULBHandler,
    deleteFromULBHandler,
    updateFromULBHandler,
  } = props;
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [colDropdownActive, setColDropdownActive] = useState<boolean>(false);

  useEffect(() => {
    if (isActive) {
      if (!overlayVisible) {
        setOverlayVisible(true);
      }
    }
    if (!isActive) {
      if (overlayVisible) {
        setOverlayVisible(false);
      }
    }
  }, [isActive]);

  /**
   * FUNCTIONALITY
   */

  const handleColorPickerSelect = (pickedColor: string) => {
    updateFromULBHandler(contentID, 'class', `bg-${pickedColor}`);
  };
  const handleSplitColumnChange = (column: number) => {
    createNewBlockULBHandler(
      contentID,
      'pageContentColumn',
      '',
      column,
      0,
      `grid grid-cols-${column} gap-1`
    );
  };
  const handleSplitColToggle = () => {
    setColDropdownActive((prevValue) => !prevValue);
    setColorPickerActive(false);
  };
  const {previewMode} = useULBContext();
  /**
   * Here is where I should add buttons
   * and dials and switches and controls
   * for adding/removing/modifying the
   * hovered component
   *
   */

  /**
   * Below classes will allow overlay control button to be
   * either in the middle of the row component, or to the side of the row
   */
  const componentAlignmentToggleClass = 'justify-center';
  const rowAlignmentToggleClass = 'w-auto';

  const actionClass =
    'flex items-center justify-start w-auto hover:bg-white hover:bg-opacity-10 mx-2 px-4  my-2 py-1 font-bold uppercase text-xs text-white rounded-lg';

  const iconClass = 'w-8 h-8 flex items-center text-xl';
  const textClass = 'mx-2 w-auto tracking-widest';
  // if (previewMode) return null;
  const iconPos = isComponent ? {left: '-2.5rem'} : {right: '-2.5rem'};

  const addToDB = async (list: any) => {
    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
  };

  const [confirmationConfig, setConfirmationConfig] = useState<{
    show: boolean;
    message: string;

    id: string;
  }>({
    show: false,
    message: '',
    id: '',
  });

  const onDeleteButtonClick = (id: string, right?: boolean) => {
    setConfirmationConfig({
      message: `Are you sure you want to delete this content? ${
        right
          ? 'All of the sub content will also be permanently removed.'
          : 'It will be permanently removed.'
      } This action cannot be undone.`,
      show: true,

      id,
    });
  };

  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
      id: '',
    });
  };

  const deletePartContent = async (contentID: string) => {
    const updatedList = deleteFromULBHandler(contentID);
    await addToDB(updatedList);
  };

  const {message = '', show = false} = confirmationConfig;
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);
  // isComponent === 'the left one'
  return (
    <div
      id="editControlsWrapper"
      style={{...iconPos}}
      className={`
          absolute 
          flex flex-row
          items-center
          bg-transparent rounded-lg
          ${overlayVisible ? 'z-100' : 'z-10'}
          h-auto w-auto
          ${isComponent ? componentAlignmentToggleClass : 'hidden'}
          `}>
      <ClickAwayListener
        onClickAway={() => {
          setOverlayVisible(false);
          setColorPickerActive(false);
          setColDropdownActive(false);
        }}>
        <div
          style={{zIndex: 9999999}}
          className={`flex ulb_action ${
            overlayVisible ? 'opacit-100 visible' : 'opacit-0 invisible'
          }  justify-center flex-col my-auto h-auto w-44 absolute top-2 ${
            isComponent ? 'left-2' : 'right-2'
          } bg-gray-800 rounded-lg shadow-lg `}>
          {section === 'pageContent' ? (
            <>
              <button className={`${actionClass}`} onClick={handleSplitColToggle}>
                <span className={iconClass}>
                  <BsLayoutSplit />
                </span>
                <span className={textClass}>Split</span>
              </button>
              {colDropdownActive && (
                <SplitColumnDropdown
                  isPagePart={isPagePart}
                  handleSplitColumnChange={handleSplitColumnChange}
                />
              )}
            </>
          ) : null}
          <button className={`${actionClass}`} onClick={() => handleEditBlockContent()}>
            <span className={iconClass}>
              <AiOutlineEdit />
            </span>
            <span className={textClass}>Edit</span>
          </button>

          {section === 'pageContent' && (
            <div className={`relative`}>
              <button
                onClick={() => setColorPickerActive(!colorPickerActive)}
                className={`${actionClass}`}>
                <span className={iconClass}>
                  <AiOutlineBgColors />
                </span>
                <span className={textClass}>BG Color</span>
              </button>
              {colorPickerActive && (
                <ColorPicker
                  classString={classString}
                  callbackColor={handleColorPickerSelect}
                  isPagePart={isPagePart}
                />
              )}
            </div>
          )}

          <button
            onClick={() => onDeleteButtonClick(contentID, section === 'pageContent')}
            className={`${actionClass} text-red-400`}>
            <span className={iconClass}>
              <AiOutlineDelete />
            </span>
            <span className={textClass}>Delete</span>
          </button>
        </div>
      </ClickAwayListener>

      {/* <ButtonsRound
        Icon={overlayVisible ? AiOutlineCloseCircle : FiEdit2}
        onClick={() => {
          handleEditBlockToggle();
        }}
        iconSizePX={24}
        buttonWHClass={`w-8 h-8`}
        containerBgClass={`rounded-full bg-gray-600 ${
          overlayVisible ? 'z-100' : 'z-10'
        } cursor-pointer`}
        buttonBgClass={`bg-transparent`}
        iconTxtColorClass={'text-white'}
      /> */}

      {!previewMode && (
        <button
          className={`bg-gray-700 rounded-full h-8 w-8 hover:shadow-lg shadow-md transition-all duration-300 z-10 cursor-pointer`}
          onClick={() => {
            handleEditBlockToggle();
          }}>
          {overlayVisible ? (
            <IoCloseSharp color={'#fff'} size={20} />
          ) : (
            <HiPencil color={'#fff'} size={20} />
          )}
        </button>
      )}
      {show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() => deletePartContent(confirmationConfig.id)}
        />
      )}
    </div>
  );
};

export default EditOverlayControls;
