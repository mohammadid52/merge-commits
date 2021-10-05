import Buttons from '@components/Atoms/Buttons';
import {SPACER} from '@components/Lesson/UniversalLessonBuilder/UI/common/constants';
import {useOverlayContext} from '@contexts/OverlayContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import {Transition} from '@headlessui/react';
import {
  UniversalLesson,
  UniversalLessonPage,
} from '@interfaces/UniversalLessonInterfaces';
import AnimatedContainer from '@uiComponents/Tabs/AnimatedContainer';
import {classNames} from '@UlbUI/FormElements/TextInput';
import AddContentDialog from '@UlbUI/ModalDialogs/AddContentDialog';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import findIndex from 'lodash/findIndex';
import update from 'lodash/update';
import {nanoid} from 'nanoid';
import React, {useState} from 'react';
import {IconType} from 'react-icons';
import {AiOutlineArrowLeft, AiOutlinePlus} from 'react-icons/ai';
import {CgSpaceBetweenV} from 'react-icons/cg';
import {HiOutlineArrowRight} from 'react-icons/hi';

type NavState = 'home' | 'addContent' | 'space';

// Margin Constants
const SPACE = {
  SMALL: 16,
  MEDIUM: 32,
  LARGE: 48,
};

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

const OverylayHeaderTitle = ({
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
        className="dark:text-white text-gray-900 font-semibold tracking-wide text-2xl text-center">
        {title}
      </h4>
    </div>
  );
};

const Item = ({
  onClick,
  label = '',
  Icon,
  subTitle = '',
  selected = false,
  RightIcon = HiOutlineArrowRight,
}: {
  Icon?: IconType;
  RightIcon?: IconType;
  onClick: any;
  label: string;
  subTitle?: string;
  selected?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${
        selected
          ? 'iconoclast:border-500 curate:border-500'
          : 'border-gray-300 dark:border-gray-700 hover:curate:border-500 hover:iconoclast:border-500'
      } relative cursor-pointer form-button mt-4 form-button rounded-lg border-0  dark:bg-gray-800 bg-white shadow-sm flex items-center space-x-3  group   transition-all focus-within:ring-1 p-5`}>
      {Icon && (
        <span className={classNames('rounded-lg inline-flex w-auto')}>
          <Icon
            className="h-6 w-6 dark:text-white text-gray-900 group-hover:iconoclast:text-500 group-hover:curate:text-500 transition-all"
            aria-hidden="true"
          />
        </span>
      )}
      <div className="flex-1 min-w-0 focus:outline-none flex items-center justify-start">
        <p className="text-sm font-medium w-auto text-gray-900 dark:text-white">
          {label}
        </p>
        {subTitle && (
          <p className="text-sm w-auto font-light ml-2 text-gray-500">{subTitle}</p>
        )}
      </div>

      <div className="w-auto">
        <RightIcon
          className={`arrow-icon2 w-auto iconoclast:text-500 curate:text-500 `}
        />
      </div>
    </div>
  );
};

const SpaceItems = ({
  setSaving,

  setSelectedSpace,
  selectedSpace,
  askPos,
  setAskPos,
}: {
  onItemSelect: () => void;
  activePageData: UniversalLessonPage;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSpace: React.Dispatch<React.SetStateAction<number>>;
  setAskPos: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSpace: number;
  askPos?: boolean;
}) => {
  const {
    selectedPageID,
    universalLessonDetails,
    setUniversalLessonDetails,
  } = useULBContext();
  const onSpaceItemClick = (spaceAmt: number) => {
    setAskPos(true);
    setSelectedSpace(spaceAmt);
  };

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

  const updateSpaceInDatabase = async () => {
    try {
      const lessonPlan: UniversalLessonPage[] = universalLessonDetails.lessonPlan;
      setSaving(true);
      const pageIdx = findIndex(lessonPlan, (item: any) => item.id === selectedPageID);

      const pageContent = lessonPlan[pageIdx].pageContent;

      const blankSpaceComponent = {
        id: nanoid(9),
        partType: 'component',
        class: '',
        partContent: [
          {
            id: nanoid(9),
            type: SPACER,
            class: `space-${reverseSpace(selectedSpace)}`,
            value: [{id: nanoid(9), value: `${selectedSpace}`}],
          },
        ],
      };

      pageContent.push(blankSpaceComponent);
      const updatedPage = update(
        universalLessonDetails,
        `lessonPlan[${pageIdx}].pageContent`,
        () => [...pageContent]
      );

      const input = {
        id: updatedPage.id,
        lessonPlan: [...updatedPage.lessonPlan],
      };
      await updateLessonPageToDB(input);
      setUniversalLessonDetails(updatedPage);
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const onAddtoBottom = () => {
    setAskPos(false);
    updateSpaceInDatabase();
  };

  const btnClass = `font-semibold hover:text-gray-600 focus:curate:border-500 focus:iconoclast:border-500 transition-all text-xs px-4 py-2 rounded-xl flex items-center justify-center w-auto`;

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
        className="fixed bottom-0 inset-x-0 mb-24 w-auto"
        animationType="opacity"
        show={askPos}>
        {askPos && (
          <div className="h-28 flex items-center justify-between flex-col p-4 rounded-xl border-0 dark:border-gray-700 border-gray-200">
            <p className="w-auto dark:text-white">Where do you want to add space?</p>
            <div className="flex px-2 dark:text-gray-500 items-center justify-between">
              <Buttons overrideClass btnClass={btnClass} label="Above Component" />
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
    </div>
  );
};

const PageBuilderSlideOver = ({
  open,
  activePageData,
}: {
  open: boolean;
  activePageData: UniversalLessonPage;
}) => {
  const [navState, setNavState] = useState<NavState>('home');

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

  const onItemClick = (type: string) => {
    // setNavState('home');
    hideAllModals();
    setAddContentModal({show: true, type});
  };

  const [saving, setSaving] = useState(false);

  const [askPos, setAskPos] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);

  const onSpaceItemSelect = () => {
    setAskPos(true);
  };

  const toHome = () => {
    setSaving(false);
    setNavState('home');
    setAskPos(false);
    setSelectedSpace(null);
  };

  return (
    <div
      style={{
        zIndex: 999999,
        maxWidth: open ? '28rem' : '0rem',
        minWidth: open ? '28rem' : '0rem',
      }}
      className={classNames(
        open ? 'translate-x-0 ' : 'translate-x-full',
        'p-8 transform transition-all duration-300 fixed right-0 inset-y-0 break-normal h-screen bg-gray-100 dark:bg-gray-800 w-112 border-l-0 border-gray-200 dark:border-gray-700 shadow-lg'
      )}>
      <AnimatedContainer animationType="scale" show={onHome}>
        {onHome && (
          <div>
            <OverylayHeaderTitle showBackBtn={false} onBack={toHome} title="Edit page" />

            <Item
              Icon={AiOutlinePlus}
              label="Add new component"
              onClick={() => setNavState('addContent')}
            />
            <Item
              Icon={CgSpaceBetweenV}
              label="Add space between components"
              onClick={() => setNavState('space')}
            />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer animationType="scale" show={onAddContent}>
        {onAddContent && (
          <div>
            <OverylayHeaderTitle onBack={toHome} title="Add new components" />
            <AddContentDialog onItemClick={onItemClick} />
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer className="h-screen" animationType="scale" show={onSpace}>
        {onSpace && (
          <div className="relative h-full">
            <OverylayHeaderTitle onBack={toHome} title="Spacing Component" />
            <SpaceItems
              setSelectedSpace={setSelectedSpace}
              onItemSelect={onSpaceItemSelect}
              setSaving={setSaving}
              activePageData={activePageData}
              selectedSpace={selectedSpace}
              askPos={askPos}
              setAskPos={setAskPos}
            />
          </div>
        )}
      </AnimatedContainer>
      <Popup saving={saving} text={'Saving'} />
    </div>
  );
};

export default PageBuilderSlideOver;
