import React from 'react';
import ButtonsRound from '../../Atoms/ButtonsRound';
import {AiOutlineSearch} from 'react-icons/ai';
import {IoChatbubble, IoDocument} from 'react-icons/io5';
import {CallLinkLauncher} from './CallLinkLauncher';
import {FloatingSideMenuProps} from './FloatingSideMenu';
import {BsPencilSquare} from 'react-icons/bs';

export const FloatingBar = (props: FloatingSideMenuProps) => {
  const {
    menuState,
    setMenuState,
    focusSection,
    setFocusSection,
    chatroom,
    overlay,
    setOverlay,
  } = props;

  const handleSectionButtons = (section: string) => {
    switch (section) {
      case 'Chat':
        if (focusSection !== section) setFocusSection('Chat');
        setMenuState(1, section);
        break;
      case 'Chatroom':
        if (focusSection !== section) setFocusSection('Chatroom');
        setMenuState(2, section);
        break;
      case 'Call':
        if (focusSection !== section) setFocusSection('Call');
        setMenuState(1, section);
        break;
      case 'File':
        if (focusSection !== section) setFocusSection('File');
        setMenuState(1, section);
        break;
      case 'Notes':
        if(overlay === ''){
          setOverlay('notes')
          if (focusSection !== section) setFocusSection('Notes');
        } else {
          setOverlay('')
        }
        break;
      case '':
        if (focusSection === section) setFocusSection('Chat');
        setMenuState(1, 'Chat');
        break;
      default:
        break;
    }
  };

  return (
    <div
      id={`floatingBar`}
      className={`
      w-12 -translate-x-12 left-0 top-1/2 -translate-y-1/2
      absolute 
      transform transition-all ease-in-out duration-400 
        ${menuState === 0 && 'h-100'}
        ${menuState === 1 && 'h-128'}
        ${menuState === 2 && 'h-136'}
      
      bg-gray-700 border-r-1 border-gray-700 rounded-l-lg shadow
      flex flex-col`}>
      <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
        <ButtonsRound
          Icon={IoChatbubble}
          iconSizePX={16}
          buttonWHClass={`w-12 h-12`}
          onClick={() =>
            handleSectionButtons(Object.keys(chatroom).length > 0 ? 'Chatroom' : 'Chat')
          }
          containerBgClass={`${
            (menuState > 0 && focusSection === 'Chat') || focusSection === 'Chatroom'
              ? 'bg-red-700 hover:bg-red-600'
              : 'bg-transparent hover:bg-gray-800'
          } rounded-tl-lg `}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`text-white`}
        />
      </div>

      <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
        <ButtonsRound
          Icon={IoDocument}
          iconSizePX={16}
          buttonWHClass={`w-12 h-12`}
          onClick={() => handleSectionButtons('File')}
          containerBgClass={`${
            menuState > 0 && focusSection === 'File'
              ? 'bg-red-700 hover:bg-red-600'
              : 'bg-transparent hover:bg-gray-800'
          }`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`text-white`}
        />
      </div>
      <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
        <ButtonsRound
          Icon={AiOutlineSearch}
          iconSizePX={16}
          buttonWHClass={`w-12 h-12`}
          pointerEvents={focusSection === 'Search'}
          onClick={() => handleSectionButtons('Search')}
          containerBgClass={`${
            menuState > 0 && focusSection === 'Search'
              ? 'bg-red-700 hover:bg-red-600'
              : 'bg-transparent hover:bg-gray-800'
          }`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`${
            focusSection === 'Search' ? 'text-white' : 'text-gray-600'
          }`}
        />
      </div>
      {typeof setOverlay !== 'undefined' ? (
        <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
          <ButtonsRound
            Icon={BsPencilSquare}
            iconSizePX={16}
            buttonWHClass={`w-12 h-12`}
            onClick={() => handleSectionButtons('Notes')}
            containerBgClass={`${
              menuState > 0 && focusSection === 'Notes'
                ? 'bg-red-700 hover:bg-red-600'
                : 'bg-transparent hover:bg-gray-800'
            }`}
            buttonBgClass={`bg-transparent`}
            iconTxtColorClass={`text-white`}
          />
        </div>
      ) : null}

      <div
        onClick={() => handleSectionButtons(focusSection)}
        className={`flex flex-1 flex-col items-center justify-center text-center items-center bg-charcoal hover:bg-gray-800 cursor-pointer`}>
        <div
          className={`transform -rotate-90 w-max flex flex-1 justify-center content-center items-center`}>
          <div
            className={`text-base tracking-wider font-regular text-white w-64 h-8 text-center transform translate-y-0.5`}>
            Links & Chatrooms
          </div>
        </div>
      </div>

      <CallLinkLauncher />
    </div>
  );
};
