import {DownOutlined, UpOutlined} from '@ant-design/icons';
import {listFeelingsArchives} from '@customGraphql/customQueries';
import {Transition} from '@headlessui/react';
import {classNames} from '@UlbUI/FormElements/TextInput';
import AddContentDialog from '@UlbUI/ModalDialogs/AddContentDialog';
import {Alert} from 'antd';
import {
  DeleteFeelingsArchiveInput,
  FeelingsArchive,
  ListFeelingsArchivesQueryVariables
} from 'API';
import Buttons from 'atoms/Buttons';
import {SPACER} from 'components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useOverlayContext} from 'contexts/OverlayContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import useAuth from 'customHooks/useAuth';
import useGraphqlMutation from 'customHooks/useGraphqlMutation';
import useGraphqlQuery from 'customHooks/useGraphqlQuery';
import {UniversalLessonPage} from 'interfaces/UniversalLessonInterfaces';
import {forEach, isEmpty, remove} from 'lodash';
import map from 'lodash/map';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {IconType} from 'react-icons';
import {AiOutlineArrowLeft, AiOutlineEdit, AiOutlinePlus} from 'react-icons/ai';
import {BiTrashAlt} from 'react-icons/bi';
import {CgSpaceBetweenV} from 'react-icons/cg';
import {HiOutlineArrowRight, HiSwitchHorizontal} from 'react-icons/hi';
import {RiPagesLine} from 'react-icons/ri';
import {useRouteMatch} from 'react-router';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';
import {reorder} from 'utilities/strings';
import {updateLessonPageToDB} from 'utilities/updateLessonPageToDB';

type ActionTypes = 'edit' | 'delete' | 'init' | 'replace';

// ======constants===================>>

const MESSAGES = {
  CLICK_CIRCLE: 'Click on a circle to select position'
};

const ClickOnCircle = ({message, onClose}: {message: string; onClose: () => void}) => (
  <Alert description={message} type="warning" closable onClose={onClose} />
);

const BottomButtonWithMessage = ({
  btns,
  message
}: {
  message?: string;
  btns: {
    label?: string;
    Icon?: any;
    disabled?: boolean;
    transparent?: boolean;
    onClick: () => void;
  }[];
}) => {
  return (
    <div className="min-h-28 flex items-center justify-between flex-col p-4 rounded-xl border-0 iconoclast:border-main curate:border-main">
      {message && <p className="text-white">{message}</p>}
      <div
        className={` justify-${
          btns.length === 1 ? 'center' : 'between'
        } flex px-2 w-full dark:text-medium  items-center mt-2 2xl:mt-0`}>
        {map(btns, (btn, idx) => (
          <Buttons
            disabled={btn.disabled}
            key={idx}
            Icon={btn.Icon}
            onClick={() => btn.onClick()}
            transparent={btn.transparent}
            variant="primary"
            size="middle"
            label={btn.label}
          />
        ))}
      </div>
    </div>
  );
};

// Margin Constants
const SPACE = {
  SMALL: 16,
  MEDIUM: 32,
  LARGE: 48
};

// ====================================================== //
// =========================SPACE ITEMS COMPONENT HERE=============================>> //
// ====================================================== //

const SpaceItems = ({
  addSpaceComponent,
  setSelectedSpace,
  selectedSpace,
  askPos,
  setAskPos
}: {
  addSpaceComponent: (componentObj: any, customPos?: boolean) => void;
  setSelectedSpace: React.Dispatch<React.SetStateAction<number | null>>;
  setAskPos: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSpace: number | null;
  askPos?: boolean;
}) => {
  const onSpaceItemClick = (spaceAmt: number) => {
    setAskPos(true);
    setSelectedSpace(spaceAmt);
  };

  const {setShowingPin, showingPin, selectedComponent, setSelectedComponent} =
    usePageBuilderContext();

  const reverseSpace = (space: number) => {
    switch (space) {
      case SPACE.SMALL:
        return 'small';

      case SPACE.MEDIUM:
        return 'medium';

      case SPACE.LARGE:
        return 'large';
      default:
        return 'medium';
    }
  };

  const partContentObj = {
    id: nanoid(9),
    type: SPACER,
    class: `space-${reverseSpace(selectedSpace !== null ? selectedSpace : 2)}`,
    value: [{id: nanoid(9), value: `${selectedSpace}`}]
  };

  const blankSpaceComponent = {
    id: nanoid(9),
    partType: 'component',
    class: '',
    partContent: [partContentObj]
  };

  const onAddtoBottom = () => {
    setAskPos(false);
    addSpaceComponent(blankSpaceComponent);
  };
  const onAddSpace = () => {
    addSpaceComponent(partContentObj, true);
  };

  const onCustomPosition = () => {
    setShowingPin(true);
  };

  return (
    <div className="h-full">
      <Item
        RightIcon={AiOutlinePlus}
        label="Small"
        subTitle={`• ${SPACE.SMALL}px`}
        onClick={() => onSpaceItemClick(SPACE.SMALL)}
        selected={selectedSpace === SPACE.SMALL}
      />
      <Item
        RightIcon={AiOutlinePlus}
        label="Medium"
        subTitle={`• ${SPACE.MEDIUM}px`}
        onClick={() => onSpaceItemClick(SPACE.MEDIUM)}
        selected={selectedSpace === SPACE.MEDIUM}
      />
      <Item
        RightIcon={AiOutlinePlus}
        label="Large"
        subTitle={`• ${SPACE.LARGE}px`}
        onClick={() => onSpaceItemClick(SPACE.LARGE)}
        selected={selectedSpace === SPACE.LARGE}
      />

      <AnimatedContainer
        className={`my-6  w-auto`}
        animationType="custom"
        customAnimation={{
          show: 'scale-100 opacity-100',
          hide: 'scale-50 opacity-100'
        }}
        show={Boolean(askPos && !showingPin)}>
        {askPos && !showingPin && (
          <BottomButtonWithMessage
            btns={[
              {
                label: 'Custom position',
                onClick: onCustomPosition
              },
              {
                label: 'Add to Bottom',
                onClick: onAddtoBottom,
                transparent: true
              }
            ]}
            message={'Where do you want to add space?'}
          />
        )}
      </AnimatedContainer>
      <AnimatedContainer
        className={` my-6  w-auto`}
        show={showingPin && isEmpty(selectedComponent)}>
        {showingPin && isEmpty(selectedComponent) && (
          <ClickOnCircle
            onClose={() => {
              setShowingPin(false);
              setSelectedComponent(null);
            }}
            message={MESSAGES.CLICK_CIRCLE}
          />
        )}
      </AnimatedContainer>
      <AnimatedContainer
        animationType="custom"
        customAnimation={{
          show: 'scale-100 opacity-100',
          hide: 'scale-50 opacity-100'
        }}
        className={` my-6  w-auto`}
        show={!isEmpty(selectedComponent)}>
        {!isEmpty(selectedComponent) && (
          <BottomButtonWithMessage
            btns={[
              {
                label: 'Add White Space',
                onClick: onAddSpace,
                transparent: true
              }
            ]}
            message={'Click on below button to add space'}
          />
        )}
      </AnimatedContainer>
    </div>
  );
};

// ====================================================== //
// =========================POPUP=============================>> //
// ====================================================== //

const Popup = ({show, text}: {show: boolean; text: string}) => (
  <div className="fixed bottom-0 inset-x-0  w-auto ">
    <Transition
      appear
      show={show}
      enter="transform transition ease-in-out duration-300"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transform transition ease-in-out duration-300 delay-1000"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
      className="shadow-lg bg-transparent border-lightest dark:border-dark   flex items-center justify-center border-t-0">
      {show && <p className="text-medium  w-auto p-4">{text}</p>}
    </Transition>
  </div>
);

// ====================================================== //
// =========================OVERLAY HEADER TITLE=============================>> //
// ====================================================== //

const OverlayHeaderTitle = ({
  onBack,
  title,
  showBackBtn = true
}: {
  title?: string;
  showBackBtn?: boolean;
  onBack: () => void;
}) => {
  return (
    <div className={'flex items-center justify-start'} id="page_builder_overlay--header">
      {showBackBtn && (
        <div className="w-auto" onClick={onBack}>
          <AiOutlineArrowLeft className="text-light  hover:text-medium  transition-all text-lg 2xl:text-xl cursor-pointer" />
        </div>
      )}

      <h4
        id="page_builder_overlay--header-title"
        className=" text-white font-medium tracking-wide text-lg 2xl:text-xl text-center">
        {title}
      </h4>
    </div>
  );
};

// ====================================================== //
// =========================ITEM=============================>> //
// ====================================================== //

const Item = ({
  onClick,
  label = '',
  Icon,
  subTitle = '',
  className,
  deleteBtn = false,
  selected = false,
  RightIcon = HiOutlineArrowRight
}: {
  Icon?: IconType;
  RightIcon?: IconType;
  onClick: any;
  label: string;
  deleteBtn?: boolean;
  subTitle?: string;
  className?: string;
  selected?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${className} ${
        selected
          ? 'iconoclast:border-500 curate:border-500'
          : `border-dark   hover:curate:border-500 hover:iconoclast:border-500`
      } w-full relative my-6 2xl:my-8 cursor-pointer form-button 2xl:mt-4  rounded-lg border-0 bg-dark-blue shadow-sm flex items-center space-x-3  group   transition-all focus-within:ring-1 p-3 2xl:p-5`}>
      {Icon && (
        <span className={classNames('rounded-lg inline-flex w-auto')}>
          <Icon
            className={classNames(
              deleteBtn
                ? 'text-red-500'
                : 'group-hover:iconoclast:text-500 text-white group-hover:curate:text-500',
              'xl:h-6 h-2 w-4 xl:w-6  transition-all'
            )}
            aria-hidden="true"
          />
        </span>
      )}
      <div className="flex-1 min-w-0 focus:outline-none flex items-center justify-start">
        <p
          className={`${
            deleteBtn ? 'text-red-500' : 'text-white'
          } xl:text-sm text-xs font-medium mb-0 w-auto `}>
          {label}
        </p>
        {subTitle && (
          <p className="text-sm w-auto font-light ml-2 text-medium ">{subTitle}</p>
        )}
      </div>

      <div className="w-auto">
        <RightIcon
          className={`${
            deleteBtn ? 'text-red-500' : 'iconoclast:text-500 curate:text-500'
          } arrow-icon2 w-auto  `}
        />
      </div>
    </div>
  );
};

const addToDB = async (list: any) => {
  const input = {
    id: list.id,
    lessonPlan: [...list.lessonPlan]
  };

  await updateLessonPageToDB(input);
};

// ====================================================== //
// =========================ACTION BUTTONS=============================>> //
// ====================================================== //
const ActionButtons = ({
  actionMode,
  setActionMode
}: {
  actionMode: ActionTypes;
  deleteFromULBHandler?: (targetID: string) => UniversalLessonPage;
  setActionMode: React.Dispatch<React.SetStateAction<ActionTypes>>;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number,
    classString?: string
  ) => void;
}) => {
  const {setSelectedComponent, setShowingPin, setShowMovementBox, setShowingBlockPin} =
    usePageBuilderContext();

  const cleanup = () => {
    setSelectedComponent(null);
    setShowMovementBox(false);
    setShowingBlockPin(false);
  };

  return (
    <div className="flex items-center flex-col">
      <Item
        selected={actionMode === 'edit'}
        Icon={AiOutlineEdit}
        label="Edit component"
        onClick={() => {
          setActionMode('edit');
          setShowingPin(true);
          cleanup();
        }}
      />
      <Item
        selected={actionMode === 'replace'}
        Icon={HiSwitchHorizontal}
        label="Replace component"
        onClick={() => {
          setActionMode('replace');
          setShowingPin(true);
          cleanup();
        }}
      />
      <Item
        selected={actionMode === 'delete'}
        deleteBtn
        Icon={BiTrashAlt}
        label="Delete component"
        onClick={() => {
          setActionMode('delete');
          setShowingPin(true);
          cleanup();
        }}
      />
    </div>
  );
};
// ====================================================== //
// =========================MOVABLE BUTTONS=============================>> //
// ====================================================== //
const MovableButtons = () => {
  const {
    setSelectedComponent,
    setShowingPin,
    setActionMode,
    showMovementBox,
    setShowMovementBox,
    setShowingBlockPin
  } = usePageBuilderContext();

  return (
    <div className="flex items-center flex-col">
      <Item
        selected={showMovementBox}
        Icon={AiOutlineEdit}
        label="Move existing component"
        onClick={() => {
          setActionMode('init');
          setShowingPin(true);
          setShowMovementBox(true);
          setShowingBlockPin(true);
          setSelectedComponent(null);
        }}
      />
    </div>
  );
};

// ====================================================== //
// =========================PAGE BUILDER SLIDEROVER=============================>> //
// ====================================================== //

const PageBuilderSlideOver = ({
  deleteFromULBHandler,
  handleModalPopToggle,
  handleEditBlockContent,
  setNewLessonPlanShow,
  setEditMode
}: {
  deleteFromULBHandler?: (targetID: string) => UniversalLessonPage;
  open: boolean;
  handleModalPopToggle?: (
    dialogToToggle: string,
    position?: number,
    section?: string,
    targetID?: string
  ) => void;
  handleEditBlockContent?: (
    type: string,
    section: string,
    inputObj: any,
    targetId: string,
    indexToUpdate: number
  ) => void;
  setNewLessonPlanShow: React.Dispatch<React.SetStateAction<boolean>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {selectedPageID, universalLessonDetails, setUniversalLessonDetails} =
    useULBContext();

  const {
    selectedComponent,
    setSelectedComponent,
    setShowingPin,
    actionMode,
    setActionMode,
    navState,
    setNavState,
    setShowMovementBox,
    activeContentItem,
    setActiveContentItem,
    showMovementBox,
    setShowingBlockPin,
    showMessage,
    setShowMessage,
    setEmotionComponentExists
  } = usePageBuilderContext();

  // Remove message after three seconds
  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [showMessage]);

  const {lessonState} = useGlobalContext();
  const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

  const pageContent = lessonPlan?.[lessonState.currentPage]?.pageContent;

  const addSpaceComponent = async (componentObj: any, customPos?: boolean) => {
    try {
      if (customPos) {
        if (!isEmpty(selectedComponent)) {
          const partContent =
            pageContent?.[selectedComponent.pageContentIdx]?.partContent || [];
          partContent.splice(selectedComponent.partContentIdx + 1, 0, componentObj);

          const updatedPage = update(
            universalLessonDetails,
            `lessonPlan[${lessonState.currentPage}].pageContent[${selectedComponent.pageContentIdx}].partContent`,
            () => [...partContent]
          );
          cleanup();
          const input = {
            id: updatedPage.id,
            lessonPlan: [...updatedPage.lessonPlan]
          };

          await updateLessonPageToDB(input);
          setUniversalLessonDetails(updatedPage);
        }
      } else {
        pageContent?.push(componentObj);
        if (pageContent) {
          const updatedPage = update(
            universalLessonDetails,
            `lessonPlan[${lessonState.currentPage}].pageContent`,
            () => [...pageContent]
          );

          const input = {
            id: updatedPage.id,
            lessonPlan: [...updatedPage.lessonPlan]
          };
          await updateLessonPageToDB(input);
          setUniversalLessonDetails(updatedPage);
        }
      }
      setShowMessage(true);
    } catch (error) {
      console.error(error);
    }
  };

  // CONSTANTS
  const onHome = navState === 'home';
  const onAddContent = navState === 'addContent';
  const onSpace = navState === 'space';

  // OVERLAY BOOLEANS
  const {setAddContentModal, setModalPopVisible, setCurrentModalDialog} =
    useOverlayContext();

  const hideAllModals = () => {
    setModalPopVisible(false);
    setAddContentModal({type: '', show: false});
    setCurrentModalDialog('');
  };

  const onContentItemClick = (type: string, bottom: boolean = false) => {
    if (pageContent && pageContent?.length > 0) {
      if (bottom) {
        hideAllModals();

        setAddContentModal({show: true, type});

        handleModalPopToggle?.('', pageContent.length, 'pageContent', selectedPageID);
      } else {
        setShowingPin(true);
      }
    } else {
      hideAllModals();
      setAddContentModal({show: true, type});

      handleModalPopToggle?.('');
    }
  };

  const [askPos, setAskPos] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null);

  const cleanup = () => {
    setAskPos(false);
    setSelectedSpace(null);
    setSelectedComponent(null);
    setShowingPin(false);
    setShowingBlockPin(false);

    setShowMovementBox(false);
    setActionMode('init');
  };

  const toHome = () => {
    setNavState('home');
    setActiveContentItem(null);
    cleanup();
  };

  const notSelected = isEmpty(selectedComponent);

  const onDeleteMode = actionMode === 'delete' && !notSelected;

  const deleteMutation = useGraphqlMutation<
    {input: DeleteFeelingsArchiveInput},
    DeleteFeelingsArchiveInput
  >('deleteFeelingsArchive');

  const {authId} = useAuth();
  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;

  const {data = [], refetch} = useGraphqlQuery<
    ListFeelingsArchivesQueryVariables,
    FeelingsArchive[]
  >(
    listFeelingsArchives,
    {
      filter: {
        personAuthID: {eq: authId},
        lessonID: {eq: lessonId}
        // sentimentType: {eq: lessonState.currentPage.toString()},
      }
    },
    //  custom means use query from customQueries file.
    // enabled allows conditinational fetching. if it is enabled then only the query will be fetched. Default is true
    {custom: true, enabled: false}
  );

  const onDeleteClick = async () => {
    const currentPage = universalLessonDetails.lessonPlan[lessonState.currentPage];
    const _pageContent = currentPage?.pageContent || [];
    if (selectedComponent?.isEmotionComponentSelected) {
      setEmotionComponentExists(false);
      refetch?.().then(() => {
        if (data && data.length > 0) {
          data.forEach((em) => {
            deleteMutation.mutate({input: {id: em.id}});
          });
        }
      });
    }
    if (!notSelected) {
      forEach(selectedComponent?.extras, (obj, idx: number) => {
        const partContent = _pageContent[obj.pageContentIdx]?.partContent || [];
        const lastItem = partContent.length === 1;

        if (lastItem) {
          remove(_pageContent, (pgContent: any) => pgContent.id === obj.pageContentID);
          setUniversalLessonDetails({...universalLessonDetails});
        } else {
          remove(partContent, (partContent: any) => partContent.id === obj.partContentID);
          setUniversalLessonDetails({...universalLessonDetails});
        }

        let updatedExtras = [...selectedComponent?.extras].splice(idx, 1);
        setSelectedComponent({
          ...selectedComponent,
          extras: [...updatedExtras]
        });
      });

      onCancel();

      await addToDB(universalLessonDetails);
    }
  };

  const onCancel = () => {
    cleanup();
  };

  const onMovementCancel = () => {
    cleanup();
  };

  const updateData = async (path: string, newValue: any) => {
    update(universalLessonDetails, path, () => [...newValue]);

    setUniversalLessonDetails({...universalLessonDetails});

    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan]
    };
    await updateLessonPageToDB(input);
  };
  const pageContentIdx = selectedComponent?.pageContentIdx;

  const PATH_TO_PARTCONTENT = `lessonPlan[${lessonState.currentPage}].pageContent[${pageContentIdx}].partContent`;

  const partContentIdx = selectedComponent?.partContentIdx;
  const currentPage: UniversalLessonPage =
    universalLessonDetails.lessonPlan[lessonState.currentPage];

  const _pageContent = currentPage?.pageContent || [];

  useEffect(() => {
    if (pageContentIdx >= 0) {
      const partContent = _pageContent[pageContentIdx]?.partContent || [];
      setDisableState({
        BLOCK_UP: pageContentIdx === 0,
        BLOCK_DOWN: _pageContent.length - 1 === pageContentIdx,
        COMPONENT_UP: partContentIdx === 0,
        COMPONENT_DOWN: partContent.length - 1 === partContentIdx
      });
    }
  }, [selectedComponent, pageContentIdx]);

  const [disableState, setDisableState] = useState({
    COMPONENT_UP: true,
    COMPONENT_DOWN: true,
    BLOCK_UP: true,
    BLOCK_DOWN: true
  });

  const moveBlock = (dir: 'up' | 'down') => {
    const PATH_TO_PAGECONTENT = `lessonPlan[${lessonState.currentPage}].pageContent`;

    updateData(
      PATH_TO_PAGECONTENT,
      reorder(
        currentPage?.pageContent,
        pageContentIdx,
        dir === 'up' ? pageContentIdx - 1 : pageContentIdx + 1
      )
    );

    setSelectedComponent((prev: any) => ({
      ...prev,
      pageContentIdx: dir === 'up' ? pageContentIdx - 1 : pageContentIdx + 1
    }));
  };

  const onMoveUp = () => {
    if (selectedComponent) {
      if (!disableState.COMPONENT_UP) {
        updateData(
          PATH_TO_PARTCONTENT,
          reorder(
            pageContent?.[pageContentIdx]?.partContent,
            partContentIdx,
            partContentIdx - 1
          )
        );

        setSelectedComponent((prev: any) => ({
          ...prev,
          partContentIdx: partContentIdx - 1
        }));
      }
    }
  };
  const onMoveDown = () => {
    if (!disableState.COMPONENT_DOWN) {
      updateData(
        PATH_TO_PARTCONTENT,
        reorder(
          pageContent?.[pageContentIdx]?.partContent,
          partContentIdx,
          partContentIdx + 1
        )
      );
      setSelectedComponent((prev: any) => ({
        ...prev,
        partContentIdx: partContentIdx + 1
      }));
    }
  };

  const moveComponent = (dir: 'up' | 'down') => {
    const up = dir === 'up';
    if (selectedComponent.block) {
      moveBlock(dir);
    } else if (!notSelected) {
      if (up) onMoveUp();
      else onMoveDown();
    }

    setShowMessage(true);
  };

  const onInit = actionMode === 'init';
  const onReplace = actionMode === 'replace';

  const onActionCancel = () => {
    setShowMovementBox(false);
  };

  const isSurvey = universalLessonDetails?.type === 'survey';

  const handleReplce = () => {
    setNavState('addContent');
  };

  return (
    <>
      <AnimatedContainer
        // className={onHome ? 'h-screen' : ''}
        animationType="scale"
        show={onHome}>
        {onHome && (
          <div>
            <OverlayHeaderTitle showBackBtn={false} onBack={toHome} title="Edit page" />
            <AnimatedContainer
              className={`my-6 w-auto`}
              animationType="opacity"
              show={notSelected && !onInit}>
              {notSelected && !onInit && (
                <ClickOnCircle
                  onClose={() => {
                    onCancel();
                    onActionCancel();
                  }}
                  message={`Click on a circle to ${actionMode} component`}
                />
              )}
            </AnimatedContainer>
            <AnimatedContainer
              className={`my-6 w-auto`}
              animationType="opacity"
              show={!notSelected && onReplace}>
              {!notSelected && onReplace && (
                <BottomButtonWithMessage
                  btns={[
                    {
                      label: 'Cancel',
                      transparent: true,
                      onClick: () => {
                        onCancel();
                        onActionCancel();
                      }
                    },
                    {
                      label: 'Replace',
                      onClick: handleReplce
                    }
                  ]}
                  message={'Are you sure you want to replace this component?'}
                />
              )}
            </AnimatedContainer>
            <AnimatedContainer
              className={`my-2  w-auto`}
              animationType="custom"
              customAnimation={{
                show: 'scale-100 opacity-100',
                hide: 'scale-50 opacity-100'
              }}
              show={onDeleteMode}>
              {onDeleteMode && (
                <BottomButtonWithMessage
                  btns={[
                    {
                      label: 'Cancel',
                      transparent: true,
                      onClick: () => {
                        onCancel();
                        onActionCancel();
                      }
                    },
                    {
                      label: 'Delete',
                      onClick: onDeleteClick
                    }
                  ]}
                  message={'Are you sure you want to delete?'}
                />
              )}
            </AnimatedContainer>

            <AnimatedContainer
              className={`my-6 2xl:my-8 mt-3 2xl:mt-4 w-auto`}
              animationType="opacity"
              show={notSelected && showMovementBox}>
              {notSelected && showMovementBox && (
                <ClickOnCircle
                  onClose={() => onCancel()}
                  message={`Click on a circle to move component`}
                />
              )}
            </AnimatedContainer>
            <AnimatedContainer
              className={` my-2  w-auto`}
              animationType="custom"
              customAnimation={{
                show: 'scale-100 opacity-100',
                hide: 'scale-50 opacity-100'
              }}
              show={showMovementBox && !notSelected}>
              {showMovementBox && !notSelected && (
                <BottomButtonWithMessage
                  btns={[
                    {
                      Icon: UpOutlined,

                      disabled: disableState.COMPONENT_UP,
                      onClick: () => moveComponent('up')
                    },
                    {
                      label: 'Cancel',
                      transparent: true,
                      onClick: () => onMovementCancel()
                    },
                    {
                      Icon: DownOutlined,
                      disabled: disableState.COMPONENT_DOWN,

                      onClick: () => moveComponent('down')
                    }
                  ]}
                  message={'Select direction for movement'}
                />
              )}
            </AnimatedContainer>

            <Item
              Icon={AiOutlinePlus}
              label="Add new component"
              onClick={() => {
                cleanup();
                setNavState('addContent');
              }}
            />
            <div className="h-full">
              <ActionButtons
                deleteFromULBHandler={deleteFromULBHandler}
                setActionMode={setActionMode}
                handleEditBlockContent={handleEditBlockContent}
                actionMode={actionMode}
              />
            </div>

            <div className="h-full">
              <MovableButtons />
            </div>
            <Item
              Icon={CgSpaceBetweenV}
              label="Add space component"
              onClick={() => {
                cleanup();
                setNavState('space');
              }}
            />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer
        // className={onAddContent ? 'h-screen' : ''}
        animationType="scale"
        show={onAddContent}>
        {onAddContent && (
          <div>
            <OverlayHeaderTitle
              onBack={toHome}
              title={
                onReplace
                  ? 'Select a component to replace with'
                  : activeContentItem
                  ? 'Step 2: Where Do You Want To Place Component'
                  : 'Step 1: Select A Component'
              }
            />
            <AddContentDialog
              isSurvey={isSurvey}
              onItemClick={(type, bottom) => onContentItemClick(type, bottom)}
            />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer
        // className={onSpace ? 'h-screen' : ''}
        animationType="scale"
        show={onSpace}>
        {onSpace && (
          <div className="relative h-full">
            <OverlayHeaderTitle onBack={toHome} title="Spacing Component" />
            <SpaceItems
              setSelectedSpace={setSelectedSpace}
              selectedSpace={selectedSpace}
              askPos={askPos}
              setAskPos={setAskPos}
              addSpaceComponent={addSpaceComponent}
            />
          </div>
        )}
      </AnimatedContainer>
      {onHome && (
        <Item
          Icon={RiPagesLine}
          label="Page details"
          className="mt-12"
          onClick={() => {
            setNewLessonPlanShow(true);
            setEditMode(true);
          }}
        />
      )}
      <Popup show={showMessage} text={'Your changes are saved.'} />
    </>
  );
};

export default PageBuilderSlideOver;
