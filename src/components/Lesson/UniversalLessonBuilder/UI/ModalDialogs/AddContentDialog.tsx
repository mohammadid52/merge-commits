import {DIVIDER, EMOTIONS, FORM_TYPES} from '@UlbUI/common/constants';
import {classNames} from '@UlbUI/FormElements/TextInput';
import {Tabs, TabsProps} from 'antd';
import Buttons from 'atoms/Buttons';
import {cardsList} from 'components/Dashboard/GameChangers/__contstants';
import {useOverlayContext} from 'contexts/OverlayContext';
import {usePageBuilderContext} from 'contexts/PageBuilderContext';
import {isEmpty} from 'lodash';
import React, {useEffect} from 'react';
import {
  AiFillCloseCircle,
  AiOutlineFileImage,
  AiOutlineHighlight,
  AiOutlineLink,
  AiOutlineMinus,
  AiOutlineQuestionCircle,
  AiOutlineVideoCameraAdd,
  AiOutlineYoutube
} from 'react-icons/ai';
import {BiCheckboxChecked, BiRadioCircleMarked, BiSlider} from 'react-icons/bi';
import {BsCloudDownload, BsImages, BsNewspaper} from 'react-icons/bs';
import {CgNotes} from 'react-icons/cg';
import {HiOutlineArrowRight, HiOutlineExternalLink} from 'react-icons/hi';
import {IoDocumentAttachOutline} from 'react-icons/io5';
import {MdTitle} from 'react-icons/md';
import {TbFileAnalytics} from 'react-icons/tb';
import {VscSymbolKeyword, VscSymbolParameter} from 'react-icons/vsc';
import AnimatedContainer from 'uiComponents/Tabs/AnimatedContainer';

interface AddContentDialog {
  setCurrentHelpStep?: React.Dispatch<React.SetStateAction<number>>;

  onItemClick?: (type: string, bottom?: boolean) => void;
  isSurvey: boolean;
}

const AddContentDialog = ({
  onItemClick = () => {},
  isSurvey = false,
  setCurrentHelpStep = () => {}
}: AddContentDialog) => {
  const {
    selectedComponent,
    setShowingPin,
    activeContentItem,
    setActiveContentItem,

    setSelectedType,
    emotionComponentExists,
    actionMode
  } = usePageBuilderContext();

  const {addContentModal} = useOverlayContext();

  const textContent = [
    {
      name: 'Title',
      type: 'header',
      subtitle: 'Add title',
      icon: MdTitle,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100'
    },
    {
      name: 'Paragraph',
      subtitle: 'Add paragraph',
      type: 'paragraph',
      icon: VscSymbolParameter,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100'
    },
    {
      name: 'Jumbotron',
      type: FORM_TYPES.JUMBOTRON,
      subtitle: 'Add image with details',
      icon: BsImages,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100'
    },
    !isSurvey && {
      name: 'Word Tiles',
      subtitle: 'Add keywords',
      type: FORM_TYPES.KEYWORDS,
      icon: VscSymbolKeyword,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100'
    },
    !isSurvey && {
      name: 'Links',
      subtitle: 'Add links',
      type: FORM_TYPES.LINKS,

      icon: AiOutlineLink,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100'
    },
    {
      name: 'Divider',
      subtitle: 'Add custom divider',
      type: DIVIDER,
      icon: AiOutlineMinus,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100'
    }
    // !isSurvey && {
    //   name: 'Table',
    //   subtitle: 'Add table',
    //   type: TABLE,
    //   icon: AiOutlineBorderlessTable,
    //   iconForeground: 'text-purple-700',
    //   iconBackground: 'bg-purple-100'
    // }
  ].filter(Boolean);

  const mediaContent = [
    {
      subtitle: 'Add image',
      name: 'Image',
      type: 'image',
      icon: AiOutlineFileImage,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100'
    },
    {
      subtitle: 'Add Video',
      name: 'Video',
      type: FORM_TYPES.CUSTOM_VIDEO,
      icon: AiOutlineVideoCameraAdd,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100'
    },
    {
      name: 'Youtube Video',
      subtitle: 'Add youtube video link',
      type: FORM_TYPES.VIDEO,

      icon: AiOutlineYoutube,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100'
    },
    !isSurvey && {
      name: 'Attachments',
      type: FORM_TYPES.ATTACHMENTS,
      subtitle: 'Students can upload',
      icon: IoDocumentAttachOutline,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100'
    },
    {
      name: 'Download',
      type: FORM_TYPES.DOWNLOAD,
      subtitle: 'Students can download',
      icon: BsCloudDownload,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100'
    },
    {
      name: 'Link',
      subtitle: 'Add link',
      type: FORM_TYPES.LINK,
      icon: HiOutlineExternalLink,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100'
    }
  ].filter(Boolean);

  const userInterfaceContent = [
    !isSurvey && {
      name: 'Notes ⭐',
      type: 'notes-form',
      subtitle: 'Interactive notes for students',
      icon: CgNotes,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100'
    },
    {
      name: 'Review slider',
      type: FORM_TYPES.REVIEW_SLIDER,
      subtitle: 'Add review slider',
      icon: BiSlider,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100'
    },
    !isSurvey && {
      name: 'Highlighter',
      type: FORM_TYPES.HIGHLIGHTER,
      subtitle: 'Add highlighter',
      icon: AiOutlineHighlight,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100'
    },
    // {
    //   name: 'Linestarter',
    //   subtitle: 'Add poem',
    //   type: FORM_TYPES.POEM,
    //   icon: BsNewspaper,
    //   iconForeground: 'text-red-700',
    //   iconBackground: 'bg-red-100',
    // },
    {
      name: 'Writing Exercise ⭐',
      subtitle: 'Add Writing Exercise',
      type: FORM_TYPES.WRITING_EXERCISE,
      icon: BsNewspaper,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100'
    },

    {
      name: 'Radio',
      subtitle: 'Add select one question field',
      type: FORM_TYPES.RADIO,
      icon: BiRadioCircleMarked,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100'
    },
    {
      name: 'Text Responses',
      subtitle: 'Written answers to questions',
      type: FORM_TYPES.TEXT,
      icon: AiOutlineQuestionCircle,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100'
    },
    {
      name: 'Checkbox',
      subtitle: 'Add multiple option field',
      type: FORM_TYPES.MULTIPLE,
      icon: BiCheckboxChecked,
      iconForeground: 'text-green-700',
      iconBackground: 'bg-green-100'
    },
    isSurvey && {
      name: 'Demographics',
      subtitle: 'Add demographic questions',
      type: FORM_TYPES.DEMOGRAPHICS,
      icon: TbFileAnalytics,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100'
    }
  ].filter(Boolean);

  const onCustomPositionClick = (e: any) => {
    e.stopPropagation();
    if (!addContentModal.show) {
      onItemClick(activeContentItem.type, false);
    }
    setCurrentHelpStep(1);
  };

  useEffect(() => {
    if (!isEmpty(selectedComponent)) {
      setCurrentHelpStep(2);
    }
  }, [selectedComponent]);

  const onBottomClick = (e: any) => {
    e.stopPropagation();
    if (!addContentModal.show) {
      onItemClick(activeContentItem.type, true);
      setCurrentHelpStep(0);
    }
  };

  const onCancel = (e: any) => {
    e.stopPropagation();
    setShowingPin(false);
    setActiveContentItem(null);
  };

  const handleReplace = (e: any) => {
    onBottomClick(e);
  };

  const Item = ({content}: {content: any}) => {
    const currentType = activeContentItem && activeContentItem?.type === content.type;

    const onFinalStep =
      currentType && !isEmpty(selectedComponent) && !addContentModal.show;
    const onReplace = currentType && actionMode === 'replace';
    const onOptions = currentType && !onFinalStep && !onReplace;
    const onInit = !currentType && !onFinalStep && !onReplace;

    const isDisabled = content.type === EMOTIONS && emotionComponentExists;

    return (
      <div
        onClick={() => {
          setActiveContentItem(content);
          setShowingPin(false);
          setSelectedType(content.type);
        }}
        className={`relative ${
          addContentModal.show ? 'pointer-events-none cursor-not-allowed' : ''
        } ${
          isDisabled ? 'opacity-60 pointer-events-none' : 'pointer-events-auto'
        } form-button rounded-lg border-0 border-lightest   bg-dark-blue p-4 2xl:py-5 shadow-sm flex items-center space-x-3 hover:${
          content.iconBackground
        }  transition-all focus-within:ring-2`}>
        <>
          {onInit && (
            <>
              <span
                className={classNames(
                  content.iconBackground,
                  content.iconForeground,
                  'rounded-lg inline-flex p-1.5 2xl:p-3 w-auto'
                )}>
                <content.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="focus:outline-none cursor-pointer">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-xs mb-0 2xl:text-sm font-medium text-white">
                    {content.name}
                  </p>
                  <p className="text-xs mb-0 2xl:text-sm text-medium">
                    {content.subtitle}
                  </p>
                </div>
              </div>

              <div className="w-auto">
                <HiOutlineArrowRight
                  className={`arrow-icon w-auto ${content.iconForeground}`}
                />
              </div>
            </>
          )}
        </>
        <>
          {onOptions && (
            <div className="px-2 dark:text-medium  flex  w-full flex-col gap-2">
              <Buttons
                onClick={onCustomPositionClick}
                variant="primary"
                size="middle"
                label="Custom position"
              />

              <Buttons
                onClick={onBottomClick}
                transparent
                size="middle"
                label="Add to Botom"
              />
            </div>
          )}
          {onReplace && (
            <div className="px-2 dark:text-medium  flex  flex-col gap-2">
              <Buttons
                onClick={handleReplace}
                transparent
                label="Replace with selected component"
              />
            </div>
          )}
        </>

        {activeContentItem && (
          <span
            onClick={onCancel}
            style={{top: '-.5rem', right: '-.5rem'}}
            className="absolute cursor-pointer -top-1 w-auto -right-1 p-1 rounded-full transition-all">
            <AiFillCloseCircle className="text-white text-base" />
          </span>
        )}
      </div>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Text Content`,
      children: (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1  px-2 my-4">
          {textContent.map((content, idx) => (
            <Item key={idx} content={content} />
          ))}
        </div>
      )
    },
    {
      key: '2',
      label: `Media`,
      children: (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-1  px-2 my-4">
          {mediaContent.map((content, idx) => (
            <Item key={idx} content={content} />
          ))}
        </div>
      )
    },
    {
      key: '3',
      label: `User Interaction`,
      children: (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-1  px-2 my-4">
          {userInterfaceContent.map((content, idx) => (
            <Item key={idx} content={content} />
          ))}
        </div>
      )
    },
    {
      key: '4',
      label: `Game Changers`,
      children: (
        <div className="grid grid-cols-1 gap-4  sm:grid-cols-1  px-2 my-4">
          {cardsList.map((content, idx) => (
            <Item key={idx} content={content} />
          ))}
        </div>
      )
    }
  ];

  return (
    <>
      {!activeContentItem && <Tabs className="dark-tabs" animated items={items} />}

      <AnimatedContainer show={!isEmpty(activeContentItem)} animationType="translateY">
        {!isEmpty(activeContentItem) && (
          <>
            <h4 className="text-white m-4 text-base font-medium capitalize">
              {activeContentItem.name} Component
            </h4>
            <div className="grid grid-cols-1 gap-4  sm:grid-cols-1  px-2 my-4">
              <Item content={activeContentItem} />
            </div>
          </>
        )}
      </AnimatedContainer>
    </>
  );
};

export default AddContentDialog;
