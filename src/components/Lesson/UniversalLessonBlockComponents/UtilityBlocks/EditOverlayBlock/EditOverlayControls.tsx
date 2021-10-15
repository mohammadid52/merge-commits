import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import {
  RowWrapperProps,
  ULBSelectionProps,
} from '@interfaces/UniversalLessonBuilderInterfaces';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import ModalPopUp from '@molecules/ModalPopUp';
import ColorPicker from '@UlbUI/ColorPicker/ColorPicker';
import {FORM_TYPES} from '@UlbUI/common/constants';
import {reorder} from '@utilities/strings';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {find, findIndex, update} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';
import {AiOutlineBgColors, AiOutlineDelete, AiOutlineEdit} from 'react-icons/ai';
import {BiDownArrowAlt, BiUpArrowAlt} from 'react-icons/bi';
import {HiPencil} from 'react-icons/hi';
import {IoCloseSharp} from 'react-icons/io5';

interface EditOverlayControlsProps extends RowWrapperProps, ULBSelectionProps {
  isActive?: boolean;
  isComponent?: boolean;
  section?: string;
  handleEditBlockContent?: () => void;
  pageContentID?: string;
  partContentID?: string;
  updateContent: any;
}

const EditOverlayControls = (props: EditOverlayControlsProps) => {
  const {
    contentID,

    isActive,
    isPagePart,
    classString,
    isComponent,
    section,
    handleEditBlockContent,
    handleEditBlockToggle,

    deleteFromULBHandler,
    updateFromULBHandler,
    pageContentID,
    partContentID,
  } = props;
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [colorPickerActive, setColorPickerActive] = useState<boolean>(false);

  const {
    previewMode,
    getCurrentPage,
    universalLessonDetails,
    selectedPageID,
    setUniversalLessonDetails,
    selID,

    setSelIDForHover,
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

  const isHighlighter =
    pageContent?.partContent[partContentIdx]?.type === FORM_TYPES.HIGHLIGHTER;

  const partContentLen = pageContent?.partContent?.length;

  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const DISABLE = {
    BLOCK_UP: pageContentIdx === 0,
    BLOCK_DOWN: pageContentLen - 1 === pageContentIdx,
    COMPONENT_UP: partContentIdx === 0,
    COMPONENT_DOWN: partContentLen - 1 === partContentIdx,
  };

  const updateData = async (path: string, newValue: any) => {
    // clearIds();

    update(universalLessonDetails, path, () => newValue);

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
    const PATH_TO_PAGECONTENT = `lessonPlan[${pageIdx}].pageContent`;

    updateData(
      PATH_TO_PAGECONTENT,
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
   * Add divider item below the selected partContent
   */

  /**
   * FUNCTIONALITY
   */

  const handleColorPickerSelect = (pickedColor: string) => {
    updateFromULBHandler(contentID, 'class', `bg-${pickedColor}`);
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

  const bgClass = `hover:${
    theme === 'dark' ? 'bg-white' : 'bg-gray-700'
  } hover:bg-opacity-10`;

  const actionClass = `flex items-center justify-start w-auto   mx-2 px-2  my-2 py-1 font-bold uppercase text-xs rounded-lg`;

  const iconClass = 'w-8 h-8 flex items-center text-xl';
  const textClass = 'mx-2 w-auto tracking-widest';
  // if (previewMode) return null;
  const iconPos = isComponent ? {top: '10%', left: '-8%'} : {top: '10%', right: '-13%'};

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
    type?: string;
    key?: string;
    id: string;
  }>({
    show: false,
    message: '',
    type: '',
    id: '',
    key: '',
  });

  const onDeleteButtonClick = (
    id: string,
    right?: boolean,
    type?: string,
    key?: string
  ) => {
    setConfirmationConfig({
      message: `Are you sure you want to delete this content? ${
        right
          ? 'All of the sub content will also be permanently removed.'
          : 'It will be permanently removed.'
      } This action cannot be undone.`,
      show: true,
      type,
      id,
      key,
    });
  };

  const closeAction = () => {
    setConfirmationConfig({
      message: '',
      show: false,
      id: '',
      type: '',
      key: '',
    });
  };

  const deletePartContent = async (contentID: string, type?: string, key?: string) => {
    // if (type === 'image' || type === 'custom_video') {
    //   await deletImageFromS3(key);
    // }
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
      onBlur={() => {
        setOverlayVisible(false);
      }}
      style={{...iconPos, zIndex: overlayVisible ? 2000 : 10}}
      className={`absolute ${
        overlayVisible ? 'active' : ''
      } flex flex-row items-center bg-transparent rounded-lg  h-auto w-auto ${
        isComponent ? componentAlignmentToggleClass : ''
      }`}>
      {!previewMode && (
        <ClickAwayListener
          onClickAway={() => {
            setOverlayVisible(false);
            setColorPickerActive(false);

            clearIds();
          }}>
          <div
            className={`flex ulb_action ${
              overlayVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
            }  justify-center flex-col my-auto h-auto w-44 absolute top-2 ${
              isComponent ? 'left-2 bg-indigo-600' : 'right-2 bg-purple-600'
            }  rounded-lg shadow-lg `}>
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

            {section !== 'pageContent' && !isHighlighter && (
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
                onDeleteButtonClick(
                  contentID,
                  section === 'pageContent',
                  pageContent?.partContent[partContentIdx]?.type,
                  pageContent?.partContent[partContentIdx]?.value[0].value
                );

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
      )}

      {!previewMode && isComponent && (
        <button
          onMouseLeave={() => {
            setSelIDForHover({partContentID: '', pageContentID: ''});
          }}
          className={`bg-indigo-600  ${
            overlayVisible ? 'scale-95' : 'scale-100'
          } transform whitespace-normal customShadow rounded-lg py-1 px-4 hover:shadow-lg shadow-md transition-all duration-300 cursor-pointer`}
          onClick={() => {
            handleEditBlockToggle();
            setSelID({pageContentID, partContentID});
          }}>
          {overlayVisible ? <IoCloseSharp size={20} /> : 'Edit'}
        </button>
      )}
      {!previewMode && !isComponent && (
        <button
          onMouseLeave={() => {
            setSelIDForHover({partContentID: '', pageContentID: ''});
          }}
          className={`bg-purple-600 ${
            overlayVisible ? 'scale-95' : 'scale-100'
          } transform  whitespace-normal customShadow rounded-lg py-1 px-4 hover:shadow-lg shadow-md transition-all duration-300 cursor-pointer`}
          onClick={() => {
            handleEditBlockToggle();
            setSelID({partContentID: '', pageContentID});
          }}>
          {overlayVisible ? <IoCloseSharp size={20} /> : 'Edit Block'}
        </button>
      )}
      {show && (
        <ModalPopUp
          message={message}
          closeAction={closeAction}
          saveLabel={LessonBuilderDict[userLanguage]['BUTTON']['DELETE']}
          saveAction={() =>
            deletePartContent(
              confirmationConfig.id,
              confirmationConfig.type,
              confirmationConfig.key
            )
          }
        />
      )}
    </div>
  );
};

export default EditOverlayControls;
