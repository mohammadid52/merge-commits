import React, {useContext, useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {AiOutlineBgColors, AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BsLayoutSplit} from 'react-icons/bs';
import {HiPencil} from 'react-icons/hi';
import {IoCloseSharp} from 'react-icons/io5';

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
import {BiDownArrowAlt, BiUpArrowAlt} from 'react-icons/bi';
import {UniversalLessonPage} from '../../../../../interfaces/UniversalLessonInterfaces';
import {find, findIndex, findLastIndex, update} from 'lodash';
import {reorder} from '../../../../../utilities/strings';
import {useQuery} from '../../../../../customHooks/urlParam';

interface EditOverlayControlsProps extends RowWrapperProps, ULBSelectionProps {
  isActive?: boolean;
  isComponent?: boolean;
  section?: string;
  handleEditBlockContent?: () => void;
  pageContentID?: string;
  partContentID?: string;
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
    pageContentID,
    partContentID,
  } = props;
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);
  const [colDropdownActive, setColDropdownActive] = useState<boolean>(false);
  const {
    previewMode,
    getCurrentPage,
    universalLessonDetails,
    selectedPageID,
    setUniversalLessonDetails,
    selID,
    setSelID,
  } = useULBContext();

  const clearIds = () => setSelID({pageContentID: '', partContentID: ''});

  const currentPage: UniversalLessonPage = getCurrentPage(selectedPageID);

  const pageIdx = findIndex(
    universalLessonDetails.lessonPlan,
    (item: any) => item.id === selectedPageID
  );

  const pageContentLen = currentPage?.pageContent?.length;

  const pageContentIdx = findIndex(
    currentPage?.pageContent,
    (d) => d.id === selID.pageContentID
  );
  const pageContent = find(currentPage?.pageContent, (d) => d.id === selID.pageContentID);

  const partContentIdx = findIndex(
    pageContent?.partContent,
    (d) => d.id === selID.partContentID
  );

  const partContentLen = pageContent?.partContent?.length;

  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const DISABLE = {
    BLOCK_UP: pageContentIdx === 0,
    BLOCK_DOWN: pageContentLen - 1 === pageContentIdx,
    COMPONENT_UP: partContentIdx === 0,
    COMPONENT_DOWN: partContentLen - 1 === partContentIdx,
  };

  const updateData = async (path: string, newArr: any) => {
    // clearIds();
    update(universalLessonDetails, path, () => newArr);
    setUniversalLessonDetails({...universalLessonDetails});
    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };

  const moveComponent = (dir: 'up' | 'down') => {
    const PATH_TO_PARTCONTENT = `lessonPlan[${pageIdx}].pageContent[${pageContentIdx}].partContent`;

    updateData(
      PATH_TO_PARTCONTENT,
      reorder(
        pageContent?.partContent,
        partContentIdx,
        dir === 'up' ? partContentIdx - 1 : partContentIdx + 1
      )
    );
  };
  const moveBlock = (dir: 'up' | 'down') => {
    const PATH_TO_PATHCONTENT = `lessonPlan[${pageIdx}].pageContent`;

    updateData(
      PATH_TO_PATHCONTENT,
      reorder(
        currentPage?.pageContent,
        pageContentIdx,
        dir === 'up' ? pageContentIdx - 1 : pageContentIdx + 1
      )
    );
  };

  useEffect(() => {
    if (isActive) {
      if (!overlayVisible) {
        setOverlayVisible(true);
      }
    }
    if (!isActive) {
      if (overlayVisible) {
        if (selID.pageContentID === contentID && !selID.partContentID) {
          clearIds();
        }
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
  const {
    state: {
      lessonPage: {
        theme = 'dark',
        themeSecBackgroundColor = 'bg-gray-700',
        themeTextColor = '',
      } = {},
    },
  } = useContext(GlobalContext);
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

  const bgClass = `hover:${
    theme === 'dark' ? 'bg-white' : 'bg-gray-700'
  } hover:bg-opacity-10`;

  const actionClass = `flex items-center justify-start w-auto   mx-2 px-2  my-2 py-1 font-bold uppercase text-xs rounded-lg`;

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

  const MoveButton = ({
    text,
    onClick,
    moveDir,
    disabled,
  }: {
    text: string;
    onClick: () => void;
    moveDir: 'up' | 'down';
    disabled: boolean;
  }) => {
    return (
      <button
        disabled={disabled}
        className={`${actionClass} ${disabled ? 'text-opacity-50' : ''} ${
          disabled ? 'cursor-not-allowed' : bgClass
        } ${themeTextColor}`}
        onClick={onClick}>
        <span className={iconClass}>
          {moveDir === 'up' ? <BiUpArrowAlt /> : <BiDownArrowAlt />}
        </span>
        <span className={textClass}>{text}</span>
      </button>
    );
  };

  const {message = '', show = false} = confirmationConfig;
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {LessonBuilderDict} = useDictionary(clientKey);

  // isComponent === 'the left one'
  return (
    <div
      id="editControlsWrapper"
      style={{...iconPos}}
      className={`absolute flex flex-row items-center bg-transparent rounded-lg ${
        overlayVisible ? 'z-100' : 'z-10'
      } h-auto w-auto ${isComponent ? componentAlignmentToggleClass : ''}`}>
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
          } ${themeSecBackgroundColor} rounded-lg shadow-lg `}>
          {/* {section === 'pageContent' ? (
            <>
              <button
                className={`${actionClass} ${themeTextColor}`}
                onClick={handleSplitColToggle}>
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
          ) : null} */}

          {section === 'pageContent' ? (
            <>
              <MoveButton
                disabled={DISABLE.BLOCK_UP}
                moveDir="up"
                text="Move Up"
                onClick={() => moveBlock('up')}
              />
              <MoveButton
                disabled={DISABLE.BLOCK_DOWN}
                moveDir="down"
                text="Move Down"
                onClick={() => moveBlock('down')}
              />
            </>
          ) : (
            <>
              <MoveButton
                disabled={DISABLE.COMPONENT_UP}
                moveDir="up"
                text="Move Up"
                onClick={() => moveComponent('up')}
              />
              <MoveButton
                disabled={DISABLE.COMPONENT_DOWN}
                moveDir="down"
                text="Move Down"
                onClick={() => moveComponent('down')}
              />
            </>
          )}

          {section !== 'pageContent' && (
            <button
              className={`${actionClass} ${bgClass} ${themeTextColor}`}
              onClick={() => {
                handleEditBlockContent();
                setOverlayVisible(false);
                clearIds();
              }}>
              <span className={iconClass}>
                <AiOutlineEdit />
              </span>
              <span className={textClass}>Edit</span>
            </button>
          )}

          {section !== 'pageContent' && (
            <div className={`relative`}>
              <button
                onClick={() => {
                  setColorPickerActive(!colorPickerActive);
                }}
                className={`${actionClass} ${bgClass} ${themeTextColor}`}>
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
            onClick={() => {
              onDeleteButtonClick(contentID, section === 'pageContent');
              setOverlayVisible(false);
              clearIds();
            }}
            className={`${actionClass} ${bgClass} text-red-400`}>
            <span className={iconClass}>
              <AiOutlineDelete />
            </span>
            <span className={textClass}>Delete</span>
          </button>
        </div>
      </ClickAwayListener>

      {!previewMode && (
        <button
          className={`${themeSecBackgroundColor} ${themeTextColor} customShadow rounded-full h-8 w-8 hover:shadow-lg shadow-md transition-all duration-300 z-10 cursor-pointer`}
          onClick={() => {
            handleEditBlockToggle();

            if (isComponent) {
              setSelID({pageContentID, partContentID});
            } else {
              setSelID({partContentID: '', pageContentID});
            }
          }}>
          {overlayVisible ? <IoCloseSharp size={20} /> : <HiPencil size={20} />}
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
