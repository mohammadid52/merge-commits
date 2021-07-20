import React, {useState} from 'react';

import {VscSymbolKeyword, VscSymbolParameter} from 'react-icons/vsc';
import {
  AiOutlineCalendar,
  AiOutlineFileImage,
  AiOutlineHighlight,
  AiOutlineLink,
  AiOutlineQuestionCircle,
  AiOutlineSwapRight,
  AiOutlineVideoCameraAdd,
  AiOutlineYoutube,
} from 'react-icons/ai';
import {MdInput, MdTitle} from 'react-icons/md';
import {RiSurveyLine} from 'react-icons/ri';
import {BsCheckBox, BsImages, BsNewspaper} from 'react-icons/bs';
import {FORM_TYPES} from '../common/constants';
import {BiRadioCircleMarked} from 'react-icons/bi';
import {
  HiOutlineArrowRight,
  HiOutlineEmojiHappy,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import {GrDomain} from 'react-icons/gr';
import {IoDocumentAttachOutline} from 'react-icons/io5';

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
  const tabs = [{name: 'Text Content'}, {name: 'Media'}, {name: 'User Interaction'}];

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
      type: 'jumbotron',
      subtitle: 'Add image with details',
      icon: BsImages,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
    },
    {
      name: 'Word Tiles',
      subtitle: 'Add keywords',
      type: 'keywords',
      icon: VscSymbolKeyword,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100',
    },
    {
      name: 'Links',
      subtitle: 'Add links',
      type: 'links',
      icon: AiOutlineLink,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100',
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
      type: 'custom_video',
      icon: AiOutlineVideoCameraAdd,
      iconForeground: 'text-pink-700',
      iconBackground: 'bg-pink-100',
    },
    {
      name: 'Youtube Video',
      subtitle: 'Add youtube video link',
      type: 'video',
      icon: AiOutlineYoutube,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100',
    },
    {
      name: 'Attachments',
      type: FORM_TYPES.ATTACHMENTS,
      subtitle: 'Add image with details',
      icon: IoDocumentAttachOutline,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
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
    {
      name: 'Checkpoint',
      type: 'questions',
      subtitle: 'Add multiple questions',
      icon: RiSurveyLine,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-100',
    },
    {
      name: 'Highlighter',
      type: 'highlighter',
      subtitle: 'Add highlighter',
      icon: AiOutlineHighlight,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-100',
    },
    {
      name: 'Linestarter',
      subtitle: 'Add poem',
      type: 'poem',
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
      name: 'Text',
      subtitle: 'Add regular question',
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
    {
      name: 'Emoji',
      subtitle: 'Add emoji field',
      type: FORM_TYPES.EMOJI,
      icon: HiOutlineEmojiHappy,
      iconForeground: 'text-blue-700',
      iconBackground: 'bg-blue-100',
    },
    {
      name: 'Date Picker',
      subtitle: 'Add date picker field',
      type: FORM_TYPES.DATE_PICKER,
      icon: AiOutlineCalendar,
      iconForeground: 'text-indigo-700',
      iconBackground: 'bg-indigo-100',
    },
    {
      name: 'Other',
      subtitle: 'Add other fields',
      type: 'input',
      icon: MdInput,
      iconForeground: 'text-red-700',
      iconBackground: 'bg-red-100',
    },
  ];

  const [currentTab, setCurrentTab] = useState(tabs[0].name);
  const Tabs = () => {
    return (
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={tabs[0].name}>
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setCurrentTab(tab.name)}
                  className={classNames(
                    currentTab === tab.name
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent focus:outline-none text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'py-4 px-1 text-center border-b-3 font-medium text-sm'
                  )}
                  aria-current={currentTab === tab.name ? 'page' : undefined}>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    );
  };
  const getListByTab = (tab: string) => {
    switch (tab) {
      case 'Text Content':
        return textContent;
      case 'Media':
        return mediaContent;
      case 'User Interaction':
        return userInterfaceContent;
      default:
        return textContent;
    }
  };
  const Content = () => {
    const list = getListByTab(currentTab);

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-2 my-4">
        {list.map((content) => (
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
    );
  };

  return (
    <>
      <Tabs />
      <Content />
    </>
  );
};

export default AddContentDialog;
