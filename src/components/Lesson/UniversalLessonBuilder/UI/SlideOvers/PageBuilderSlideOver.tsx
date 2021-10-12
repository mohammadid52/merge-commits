import Buttons from '@components/Atoms/Buttons';
import {SPACER} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {useOverlayContext} from '@contexts/OverlayContext';
import {usePageBuilderContext} from '@contexts/PageBuilderContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {useQuery} from '@customHooks/urlParam';
import {Transition} from '@headlessui/react';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import {classNames} from '@UlbUI/FormElements/TextInput';
import AddContentDialog from '@UlbUI/ModalDialogs/AddContentDialog';
import {reorder} from '@utilities/strings';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {isEmpty} from 'lodash';
import map from 'lodash/map';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useEffect, useState} from 'react';
import {IconType} from 'react-icons';
import {
  AiFillCloseCircle,
  AiOutlineArrowLeft,
  AiOutlineEdit,
  AiOutlinePlus,
} from 'react-icons/ai';
import {BiTrashAlt} from 'react-icons/bi';
import {CgSpaceBetweenV} from 'react-icons/cg';
import {HiOutlineArrowRight} from 'react-icons/hi';

type ActionTypes = 'edit' | 'delete' | 'init';

// ======constants===================>>
const btnClass = `font-semibold hover:text-gray-600 focus:curate:border-500 focus:iconoclast:border-500 transition-all text-xs px-4 py-2 rounded-xl flex items-center justify-center w-auto`;

const MESSAGES = {
  CLICK_CIRCLE: 'Click on a circle to select position',
};

const ClickOnCircle = ({message, onClose}: {message: string; onClose: () => void}) => (
  <div className="flex relative items-center justify-between group flex-col p-4 rounded-xl border-0 dark:border-gray-700 border-gray-200">
    <p className="w-auto dark:text-white">{message}</p>
    <span
      onClick={onClose}
      style={{top: '-.5rem', right: '-.5rem'}}
      className="absolute cursor-pointer -top-1 w-auto -right-1 p-1 rounded-full transition-all">
      <AiFillCloseCircle className="text-white text-base" />
    </span>
  </div>
);

const BottomButtonWithMessage = ({
  btns,
  message,
}: {
  message?: string;
  btns: {label: string; disabled?: boolean; transparent?: boolean; onClick: () => void}[];
}) => {
  return (
    <div className="h-28 flex items-center justify-between flex-col p-4 rounded-xl border-0 dark:border-gray-700 border-gray-200">
      {message && <p className="w-auto dark:text-white">{message}</p>}
      <div
        className={`flex px-2 dark:text-gray-500 items-center justify-${
          btns.length === 1 ? 'center' : 'between'
        }`}>
        {map(btns, (btn, idx) => (
          <Buttons
            disabled={btn.disabled}
            key={idx}
            onClick={() => btn.onClick()}
            overrideClass
            transparent={btn.transparent}
            btnClass={btnClass}
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
  LARGE: 48,
};

// ====================================================== //
// =========================SPACE ITEMS COMPONENT HERE=============================>> //
// ====================================================== //

const SpaceItems = ({
  addSpaceComponent,
  setSelectedSpace,
  selectedSpace,
  askPos,
  setAskPos,
}: {
  addSpaceComponent: (componentObj: any, customPos?: boolean) => void;
  setSelectedSpace: React.Dispatch<React.SetStateAction<number>>;
  setAskPos: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSpace: number;
  askPos?: boolean;
}) => {
  const onSpaceItemClick = (spaceAmt: number) => {
    setAskPos(true);
    setSelectedSpace(spaceAmt);
  };

  const {
    setShowingPin,
    showingPin,
    selectedComponent,
    setSelectedComponent,
  } = usePageBuilderContext();

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
    class: `space-${reverseSpace(selectedSpace)}`,
    value: [{id: nanoid(9), value: `${selectedSpace}`}],
  };

  const blankSpaceComponent = {
    id: nanoid(9),
    partType: 'component',
    class: '',
    partContent: [partContentObj],
  };

  const onAddtoBottom = () => {
    setAskPos(false);
    addSpaceComponent(blankSpaceComponent);
  };

  const onCustomPosition = () => {
    setShowingPin(true);
  };

  const onAddSpace = () => {
    addSpaceComponent(partContentObj, true);
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
        className={`fixed bottom-0 inset-x-0 ${askPos ? 'mb-24' : ''}  w-auto`}
        animationType="opacity"
        show={askPos && !showingPin}>
        {askPos && !showingPin && (
          <div className="h-28 flex items-center justify-between flex-col p-4 rounded-xl border-0 dark:border-gray-700 border-gray-200">
            <p className="w-auto dark:text-white">Where do you want to add space?</p>
            <div className="flex px-2 dark:text-gray-500 items-center justify-between">
              <Buttons
                onClick={onCustomPosition}
                overrideClass
                btnClass={btnClass}
                label="Custom position"
              />
              <Buttons
                overrideClass
                onClick={onAddtoBottom}
                btnClass={btnClass}
                transparent
                label="Add to Botom"
              />
            </div>
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer
        className={`fixed bottom-0 inset-x-0 ${askPos ? 'mb-24' : ''}  w-auto`}
        show={showingPin}>
        {showingPin && isEmpty(selectedComponent) && (
          <ClickOnCircle
            onClose={() => {
              setShowingPin(false);
              setSelectedComponent(null);
            }}
            message={MESSAGES.CLICK_CIRCLE}
          />
        )}
        {!isEmpty(selectedComponent) && (
          <div className="h-28 flex items-center justify-between flex-col p-4 rounded-xl border-0 dark:border-gray-700 border-gray-200">
            <p className="w-auto dark:text-white">Click on below button to add space</p>
            <div className="flex px-2 dark:text-gray-500 items-center justify-center">
              <Buttons
                onClick={onAddSpace}
                overrideClass
                transparent
                btnClass={btnClass}
                label="Add White Space"
              />
            </div>
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

// ====================================================== //
// =========================POPUP V2=============================>> //
// ====================================================== //

const Popup2 = ({
  currentStep,
  steps,
  show,
}: {
  show: boolean;
  steps: string[];
  currentStep: number;
}) => (
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
      className="shadow-lg bg-transparent text-gray-500 border-gray-200 dark:border-gray-700 flex items-center justify-center border-t-0">
      {show && <p className="text-center p-4 w-auto ">{steps[currentStep]}</p>}
    </Transition>
  </div>
);

// ====================================================== //
// =========================POPUP=============================>> //
// ====================================================== //

const Popup = ({saving, text}: {saving: boolean; text: string}) => (
  <div className="fixed bottom-0 inset-x-0  w-auto ">
    <Transition
      appear
      show={saving}
      enter="transform transition ease-in-out duration-300"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transform transition ease-in-out duration-300 delay-1000"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
      className="shadow-lg bg-transparent border-gray-200 dark:border-gray-700 flex items-center justify-center border-t-0">
      {saving && <p className="text-gray-500 w-auto p-4">{text}</p>}
    </Transition>
  </div>
);

// ====================================================== //
// =========================OVERLAY HEADER TITLE=============================>> //
// ====================================================== //

const OverlayHeaderTitle = ({
  onBack,
  title,
  showBackBtn = true,
}: {
  title?: string;
  showBackBtn?: boolean;
  onBack: () => void;
}) => {
  return (
    <div className={'flex items-center justify-start'} id="page_builder_overlay--header">
      {showBackBtn && (
        <div className="w-auto" onClick={onBack}>
          <AiOutlineArrowLeft className="text-gray-400 hover:text-gray-500 transition-all text-xl cursor-pointer" />
        </div>
      )}

      <h4
        id="page_builder_overlay--header-title"
        className="dark:text-white text-gray-900 font-semibold tracking-wide text-xl text-center">
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
  className = '',
  deleteBtn = false,
  selected = false,
  RightIcon = HiOutlineArrowRight,
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
      className={`${
        selected
          ? 'iconoclast:border-500 curate:border-500'
          : `border-gray-300 dark:border-gray-700 hover:curate:border-500 hover:iconoclast:border-500`
      } relative my-8 cursor-pointer form-button mt-4 form-button rounded-lg border-0  dark:bg-gray-800 bg-white shadow-sm flex items-center space-x-3  group   transition-all focus-within:ring-1 p-5`}>
      {Icon && (
        <span className={classNames('rounded-lg inline-flex w-auto')}>
          <Icon
            className={classNames(
              deleteBtn
                ? 'text-red-500'
                : 'group-hover:iconoclast:text-500 dark:text-white text-gray-900 group-hover:curate:text-500',
              'h-6 w-6  transition-all'
            )}
            aria-hidden="true"
          />
        </span>
      )}
      <div className="flex-1 min-w-0 focus:outline-none flex items-center justify-start">
        <p
          className={`${
            deleteBtn ? 'text-red-500' : 'text-gray-900 dark:text-white'
          } text-sm font-medium w-auto `}>
          {label}
        </p>
        {subTitle && (
          <p className="text-sm w-auto font-light ml-2 text-gray-500">{subTitle}</p>
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
    lessonPlan: [...list.lessonPlan],
  };

  await updateLessonPageToDB(input);
};

// ====================================================== //
// =========================ACTION BUTTONS=============================>> //
// ====================================================== //
const ActionButtons = ({
  actionMode,
  setActionMode,
  deleteFromULBHandler,
  handleEditBlockContent,
}: {
  actionMode: ActionTypes;
  deleteFromULBHandler?: (targetID: string) => UniversalLesson;
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
  const {
    selectedComponent,
    setSelectedComponent,
    setShowingPin,
    setShowMovementBox,
  } = usePageBuilderContext();

  const {setUniversalLessonDetails} = useULBContext();

  const notSelected = isEmpty(selectedComponent);

  const onDeleteMode = actionMode === 'delete' && !notSelected;
  const onInit = actionMode === 'init';

  const cleanup = () => {
    setSelectedComponent(null);
    setShowMovementBox(false);
  };

  const onDeleteClick = async () => {
    if (!notSelected) {
      const updatedList = deleteFromULBHandler(selectedComponent.partContentID);
      setUniversalLessonDetails({...updatedList});

      await addToDB(updatedList);
      onCancel();
    }
  };

  const onCancel = () => {
    setActionMode('init');
    cleanup();
    setShowingPin(false);
  };

  return (
    <div className="flex items-center flex-col">
      <Item
        selected={actionMode === 'edit'}
        Icon={AiOutlineEdit}
        label="Edit existing component"
        onClick={() => {
          setActionMode('edit');
          setShowingPin(true);
          cleanup();
        }}
      />
      <Item
        selected={actionMode === 'delete'}
        deleteBtn
        Icon={BiTrashAlt}
        label="Delete existing component"
        onClick={() => {
          setActionMode('delete');
          setShowingPin(true);
          cleanup();
        }}
      />

      <AnimatedContainer
        className={`fixed bottom-0 inset-x-0 mb-24  w-auto`}
        animationType="opacity"
        show={notSelected && !onInit}>
        {notSelected && !onInit && (
          <ClickOnCircle
            onClose={() => onCancel()}
            message={`Click on a circle to ${actionMode} component`}
          />
        )}
      </AnimatedContainer>
      {/* <AnimatedContainer
        className={`fixed bottom-0 inset-x-0 mb-24  w-auto`}
        animationType="opacity"
        show={onEditMode}>
        {onEditMode && (
          <BottomButtonWithMessage
            btns={[
              {
                label: 'Cancel',
                onClick: onCancel,
              },
              {label: 'Edit', onClick: onEditClick, transparent: true},
            ]}
            message={'Click on button to edit component'}
          />
        )}
      </AnimatedContainer> */}
      <AnimatedContainer
        className={`fixed bottom-0 inset-x-0 mb-24  w-auto`}
        animationType="opacity"
        show={onDeleteMode}>
        {onDeleteMode && (
          <BottomButtonWithMessage
            btns={[
              {
                label: 'Cancel',
                onClick: onCancel,
              },
              {label: 'Delete', onClick: onDeleteClick, transparent: true},
            ]}
            message={'Are you sure you want to delete?'}
          />
        )}
      </AnimatedContainer>
    </div>
  );
};
// ====================================================== //
// =========================MOVABLE BUTTONS=============================>> //
// ====================================================== //
const MovableButtons = () => {
  const {
    selectedComponent,
    setSelectedComponent,
    setShowingPin,
    setActionMode,
    showMovementBox,
    setShowMovementBox,
  } = usePageBuilderContext();

  const {setUniversalLessonDetails, universalLessonDetails} = useULBContext();
  const {lessonState} = useGlobalContext();

  const notSelected = isEmpty(selectedComponent);

  const pageContentIdx = selectedComponent?.pageContentIdx;
  const partContentIdx = selectedComponent?.partContentIdx;

  const currentPage: UniversalLessonPage =
    universalLessonDetails.lessonPlan[lessonState.currentPage];
  const pageContent = currentPage?.pageContent || [];

  const [disableState, setDisableState] = useState({
    COMPONENT_UP: true,
    COMPONENT_DOWN: true,
  });

  const cleanup = () => {
    setSelectedComponent(null);
  };

  useEffect(() => {
    if (pageContentIdx >= 0) {
      const partContent = pageContent[pageContentIdx]?.partContent || [];
      setDisableState({
        COMPONENT_UP: partContentIdx === 0,
        COMPONENT_DOWN: partContent.length - 1 === partContentIdx,
      });
    }
  }, [selectedComponent, pageContentIdx]);

  const onCancel = () => {
    setShowMovementBox(false);
    cleanup();
    setShowingPin(false);
  };

  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');

  const updateData = async (path: string, newValue: any) => {
    update(universalLessonDetails, path, () => [...newValue]);

    setUniversalLessonDetails({...universalLessonDetails});

    const input = {
      id: lessonId,
      lessonPlan: [...universalLessonDetails.lessonPlan],
    };
    await updateLessonPageToDB(input);
  };
  const PATH_TO_PARTCONTENT = `lessonPlan[${lessonState.currentPage}].pageContent[${pageContentIdx}].partContent`;

  const onMoveUp = () => {
    if (!disableState.COMPONENT_UP) {
      updateData(
        PATH_TO_PARTCONTENT,
        reorder(
          pageContent[pageContentIdx].partContent,
          partContentIdx,
          partContentIdx - 1
        )
      );

      setSelectedComponent((prev: any) => ({
        ...prev,
        partContentIdx: partContentIdx - 1,
      }));
    }
  };
  const onMoveDown = () => {
    if (!disableState.COMPONENT_DOWN) {
      updateData(
        PATH_TO_PARTCONTENT,
        reorder(
          pageContent[pageContentIdx].partContent,
          partContentIdx,
          partContentIdx + 1
        )
      );
      setSelectedComponent((prev: any) => ({
        ...prev,
        partContentIdx: partContentIdx + 1,
      }));
    }
  };

  const moveComponent = (dir: 'up' | 'down') => {
    const up = dir === 'up';

    if (!notSelected) {
      if (up) onMoveUp();
      else onMoveDown();
    }
  };

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
          setSelectedComponent(null);
        }}
      />

      <AnimatedContainer
        className={`fixed bottom-0 inset-x-0 mb-24  w-auto`}
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
        className={`fixed bottom-0 inset-x-0 mb-24  w-auto`}
        animationType="opacity"
        show={showMovementBox && !notSelected}>
        {showMovementBox && !notSelected && (
          <BottomButtonWithMessage
            btns={[
              {
                label: 'Move up',
                transparent: true,
                disabled: disableState.COMPONENT_UP,
                onClick: () => moveComponent('up'),
              },
              {
                label: 'Cancel',
                onClick: () => onCancel(),
              },
              {
                label: 'Move Down',
                disabled: disableState.COMPONENT_DOWN,
                transparent: true,
                onClick: () => moveComponent('down'),
              },
            ]}
            message={'Select direction for movement'}
          />
        )}
      </AnimatedContainer>
    </div>
  );
};

// ====================================================== //
// =========================PAGE BUILDER SLIDEROVER=============================>> //
// ====================================================== //

const PageBuilderSlideOver = ({
  open,
  deleteFromULBHandler,
  handleModalPopToggle,
  handleEditBlockContent,
}: {
  deleteFromULBHandler?: (targetID: string) => UniversalLesson;
  open: boolean;
  handleModalPopToggle?: (
    dialogToToggle: string,
    position?: Number,
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
}) => {
  const {
    selectedPageID,
    universalLessonDetails,
    setUniversalLessonDetails,
  } = useULBContext();

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
  } = usePageBuilderContext();

  const {lessonState} = useGlobalContext();
  const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;

  const pageContent = lessonPlan[lessonState.currentPage]?.pageContent;

  const addSpaceComponent = async (componentObj: any, customPos?: boolean) => {
    try {
      setSaving(true);

      if (customPos) {
        if (!isEmpty(selectedComponent)) {
          const partContent = pageContent[selectedComponent.pageContentIdx].partContent;
          partContent.splice(selectedComponent.partContentIdx + 1, 0, componentObj);

          const updatedPage = update(
            universalLessonDetails,
            `lessonPlan[${lessonState.currentPage}].pageContent[${selectedComponent.pageContentIdx}].partContent`,
            () => [...partContent]
          );
          cleanup();
          const input = {
            id: updatedPage.id,
            lessonPlan: [...updatedPage.lessonPlan],
          };

          await updateLessonPageToDB(input);
          setUniversalLessonDetails(updatedPage);
        }
      } else {
        pageContent.push(componentObj);
        const updatedPage = update(
          universalLessonDetails,
          `lessonPlan[${lessonState.currentPage}].pageContent`,
          () => [...pageContent]
        );

        const input = {
          id: updatedPage.id,
          lessonPlan: [...updatedPage.lessonPlan],
        };
        await updateLessonPageToDB(input);
        setUniversalLessonDetails(updatedPage);
      }
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  // CONSTANTS
  const onHome = navState === 'home';
  const onAddContent = navState === 'addContent';
  const onSpace = navState === 'space';

  // OVERLAY BOOLEANS
  const {
    setAddContentModal,
    setModalPopVisible,
    setCurrentModalDialog,
  } = useOverlayContext();

  const hideAllModals = () => {
    setModalPopVisible(false);
    setAddContentModal({type: '', show: false});
    setCurrentModalDialog('');
  };

  const onContentItemClick = (type: string, bottom: boolean = false) => {
    // setNavState('home');
    if (pageContent.length > 0) {
      if (bottom) {
        hideAllModals();
        setAddContentModal({show: true, type});
        handleModalPopToggle('', pageContent.length, 'pageContent', selectedPageID);
      } else {
        setShowingPin(true);
      }
    } else {
      hideAllModals();
      setAddContentModal({show: true, type});
      handleModalPopToggle('');
    }
  };

  const [saving, setSaving] = useState(false);

  const [askPos, setAskPos] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  const cleanup = () => {
    setAskPos(false);
    setSelectedSpace(null);
    setSelectedComponent(null);
    setShowingPin(false);

    setShowMovementBox(false);
    setActionMode('init');
  };

  const toHome = () => {
    setSaving(false);
    setNavState('home');
    setActiveContentItem(null);
    cleanup();
  };

  const [currentHelpStep, setCurrentHelpStep] = useState(0);

  return (
    <>
      <AnimatedContainer
        className={onHome ? 'h-screen' : ''}
        animationType="scale"
        show={onHome}>
        {onHome && (
          <div>
            <OverlayHeaderTitle showBackBtn={false} onBack={toHome} title="Edit page" />

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
        className={onAddContent ? 'h-screen' : ''}
        animationType="scale"
        show={onAddContent}>
        {onAddContent && (
          <div>
            <OverlayHeaderTitle
              onBack={toHome}
              title={
                activeContentItem
                  ? 'Step 2: Where Do You Want To Place Component'
                  : 'Step 1: Select A Component'
              }
            />
            <AddContentDialog
              setCurrentHelpStep={setCurrentHelpStep}
              onItemClick={onContentItemClick}
            />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer
        className={onSpace ? 'h-screen' : ''}
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
      <Popup saving={saving} text={'Saving'} />
      <Popup2
        show={onAddContent && currentHelpStep !== null}
        steps={[
          'Click on a component to add',
          'Click on a circle to select position',
          "Click on 'Create component'",
        ]}
        currentStep={currentHelpStep}
      />
    </>
  );
};

export default PageBuilderSlideOver;
