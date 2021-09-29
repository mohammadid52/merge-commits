import React from 'react';
import {
  AiOutlineBorderlessTable,
  AiOutlineCalendar,
  AiOutlineFileImage,
  AiOutlineHighlight,
  AiOutlineLink,
  AiOutlineMinus,
  AiOutlineQuestionCircle,
  AiOutlineVideoCameraAdd,
  AiOutlineYoutube,
} from 'react-icons/ai';
import {BiRadioCircleMarked, BiSlider} from 'react-icons/bi';
import {BsCheckBox, BsCloudDownload, BsImages, BsNewspaper} from 'react-icons/bs';
import {CgNotes} from 'react-icons/cg';
import {
  HiOutlineArrowRight,
  HiOutlineEmojiHappy,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import {IoDocumentAttachOutline} from 'react-icons/io5';
import {MdInput, MdTitle} from 'react-icons/md';
import {VscSymbolKeyword, VscSymbolParameter} from 'react-icons/vsc';
import {DIVIDER, FORM_TYPES, TABLE} from '../common/constants';
import AnimatedContainer from '../UIComponents/Tabs/AnimatedContainer';
import Tabs, {useTabs} from '../UIComponents/Tabs/Tabs';

interface AddContentDialog {
  addContentModal: {show: boolean; type: string};
  setAddContentModal: React.Dispatch<React.SetStateAction<{show: boolean; type: string}>>;
  hideAllModals?: () => void;
}
const AddContentDialog = ({
  setAddContentModal,

  hideAllModals,
}: AddContentDialog) => {
  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  const tabs = [
    {name: 'Text Content', current: true},
    {name: 'Media', current: false},
    {name: 'User Interaction', current: false},
  ];

  const textContent = [
    {
      name: 'Title',
      type: 'header',
      subtitle: 'Add title',
      icon: MdTitle,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100',
    },
    {
      name: 'Paragraph',
      subtitle: 'Add paragraph',
      type: 'paragraph',
      icon: VscSymbolParameter,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100',
    },
    {
      name: 'Jumbotron',
      type: FORM_TYPES.JUMBOTRON,
      subtitle: 'Add image with details',
      icon: BsImages,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
    },
    {
      name: 'Word Tiles',
      subtitle: 'Add keywords',
      type: FORM_TYPES.KEYWORDS,
      icon: VscSymbolKeyword,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100',
    },
    {
      name: 'Links',
      subtitle: 'Add links',
      type: FORM_TYPES.LINKS,

      icon: AiOutlineLink,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100',
    },
    {
      name: 'Divider',
      subtitle: 'Add custom divider',
      type: DIVIDER,
      icon: AiOutlineMinus,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100',
    },
    {
      name: 'Table',
      subtitle: 'Add table',
      type: TABLE,
      icon: AiOutlineBorderlessTable,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100',
    },
  ];
  const mediaContent = [
    {
      subtitle: 'Add image',
      name: 'Image',
      type: 'image',
      icon: AiOutlineFileImage,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100',
    },
    {
      subtitle: 'Add Video',
      name: 'Video',
      type: FORM_TYPES.CUSTOM_VIDEO,
      icon: AiOutlineVideoCameraAdd,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100',
    },
    {
      name: 'Youtube Video',
      subtitle: 'Add youtube video link',
      type: FORM_TYPES.VIDEO,

      icon: AiOutlineYoutube,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100',
    },
    {
      name: 'Attachments',
      type: FORM_TYPES.ATTACHMENTS,
      subtitle: 'Students can upload',
      icon: IoDocumentAttachOutline,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
    },
    {
      name: 'Download',
      type: FORM_TYPES.DOWNLOAD,
      subtitle: 'Students can download',
      icon: BsCloudDownload,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100',
    },
    {
      name: 'Link',
      subtitle: 'Add link',
      type: FORM_TYPES.LINK,
      icon: HiOutlineExternalLink,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100',
    },
  ];
  const userInterfaceContent = [
    // {
    //   name: 'Notes ⭐',
    //   type: 'notes-form',
    //   subtitle: 'Interactive notes for students',
    //   icon: CgNotes,
    //   iconForeground: 'text-blue-700',
    //   iconBackground: 'bg-blue-100',
    // },
    {
      name: 'Review slider',
      type: FORM_TYPES.REVIEW_SLIDER,
      subtitle: 'Add review slider',
      icon: BiSlider,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100',
    },
    {
      name: 'Highlighter',
      type: FORM_TYPES.HIGHLIGHTER,
      subtitle: 'Add highlighter',
      icon: AiOutlineHighlight,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
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
      iconBackground: 'bg-red-100',
    },

    {
      name: 'Radio',
      subtitle: 'Add select one question field',
      type: FORM_TYPES.RADIO,
      icon: BiRadioCircleMarked,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-100',
    },
    {
      name: 'Text Responses',
      subtitle: 'Written answers to questions',
      type: FORM_TYPES.TEXT,
      icon: AiOutlineQuestionCircle,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100',
    },
    {
      name: 'Checkbox',
      subtitle: 'Add multiple option field',
      type: FORM_TYPES.MULTIPLE,
      icon: BsCheckBox,
      iconForeground: 'text-green-700',
      iconBackground: 'bg-green-100',
    },
    // {
    //   name: 'Emoji',
    //   subtitle: 'Add emoji field',
    //   type: FORM_TYPES.EMOJI,
    //   icon: HiOutlineEmojiHappy,
    //   iconForeground: 'text-blue-700',
    //   iconBackground: 'bg-blue-100',
    // },
    // {
    //   name: 'Date Picker',
    //   subtitle: 'Add date picker field',
    //   type: FORM_TYPES.DATE_PICKER,
    //   icon: AiOutlineCalendar,
    //   iconForeground: 'text-indigo-700',
    //   iconBackground: 'bg-indigo-100',
    // },
    // {
    //   name: 'Other',
    //   subtitle: 'Add other fields',
    //   type: 'input',
    //   icon: MdInput,
    //   iconForeground: 'text-red-700',
    //   iconBackground: 'bg-red-100',
    // },
  ];

  const {curTab, setCurTab, helpers} = useTabs(tabs);
  const [onTextTab, onMediaTab, onUIContentTab] = helpers;

  return (
    <>
      <Tabs tabs={tabs} curTab={curTab} setCurTab={setCurTab} />
      <AnimatedContainer show={onTextTab}>
        {onTextTab && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-2 my-4">
            {textContent.map((content) => (
              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: content.type});
                }}
                key={content.name}
                className={`relative form-button rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:${content.iconBackground} transition-all focus-within:ring-2`}>
                <span
                  className={classNames(
                    content.iconBackground,
                    content.iconForeground,
                    'rounded-lg inline-flex p-3 w-auto'
                  )}>
                  <content.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{content.name}</p>
                    <p className="text-sm text-gray-500 truncate">{content.subtitle}</p>
                  </a>
                </div>

                <div className="w-auto">
                  <HiOutlineArrowRight
                    className={`arrow-icon w-auto ${content.iconForeground}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={onMediaTab}>
        {onMediaTab && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-2 my-4">
            {mediaContent.map((content) => (
              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: content.type});
                }}
                key={content.name}
                className={`relative form-button rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:${content.iconBackground} transition-all focus-within:ring-2`}>
                <span
                  className={classNames(
                    content.iconBackground,
                    content.iconForeground,
                    'rounded-lg inline-flex p-3 w-auto'
                  )}>
                  <content.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{content.name}</p>
                    <p className="text-sm text-gray-500 truncate">{content.subtitle}</p>
                  </a>
                </div>

                <div className="w-auto">
                  <HiOutlineArrowRight
                    className={`arrow-icon w-auto ${content.iconForeground}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedContainer>
      <AnimatedContainer show={onUIContentTab}>
        {onUIContentTab && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-2 my-4">
            {userInterfaceContent.map((content) => (
              <div
                onClick={() => {
                  hideAllModals();
                  setAddContentModal({show: true, type: content.type});
                }}
                key={content.name}
                className={`relative form-button rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:${content.iconBackground} transition-all focus-within:ring-2`}>
                <span
                  className={classNames(
                    content.iconBackground,
                    content.iconForeground,
                    'rounded-lg inline-flex p-3 w-auto'
                  )}>
                  <content.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <a href="#" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-gray-900">{content.name}</p>
                    <p className="text-sm text-gray-500 truncate">{content.subtitle}</p>
                  </a>
                </div>

                <div className="w-auto">
                  <HiOutlineArrowRight
                    className={`arrow-icon w-auto ${content.iconForeground}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedContainer>
    </>
  );
};

export default AddContentDialog;
