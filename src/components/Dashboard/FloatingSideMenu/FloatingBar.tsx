import React from 'react';
import ButtonsRound from '../../Atoms/ButtonsRound';
import {
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineInfoCircle,
  AiOutlineMenu,
} from 'react-icons/ai';
import {RiChat1Line} from 'react-icons/ri';
import {IoChatbubble, IoDocument} from 'react-icons/io5';
import {ImPhone} from 'react-icons/im';

export const FloatingBar = (props: {
  menuState?: number;
  setMenuState?: (level: number, section: string) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  chatroom?: any;
}) => {
  const {menuState, setMenuState, focusSection, setFocusSection, chatroom} = props;

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
      transform transition-all ease-in-out duration-700 
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
          containerBgClass={`bg-transparent rounded-tl-lg hover:bg-gray-800`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`text-white`}
        />
      </div>
      <div className={`flex-0 h-12 border-b-0 border-charcoal`}>
        <ButtonsRound
          Icon={ImPhone}
          iconSizePX={16}
          buttonWHClass={`w-12 h-12`}
          onClick={() => handleSectionButtons('Call')}
          containerBgClass={`bg-transparent hover:bg-gray-800`}
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
          containerBgClass={`bg-transparent hover:bg-gray-800`}
          buttonBgClass={`bg-transparent`}
          iconTxtColorClass={`text-white`}
        />
      </div>
      <div
        className={`flex flex-1 flex-col items-center justify-center text-center items-center bg-charcoal rounded-bl-lg cursor-pointer`}>
        <div
          className={`transform -rotate-90 w-max flex flex-1 justify-center content-center items-center`}>
          <div
            className={`text-sm font-regular text-white w-64 h-8 text-center transform translate-y-1`}>
            Links & Chatrooms
          </div>
          {/*<ButtonsRound*/}
          {/*  Icon={menuState > 0 ? AiOutlineArrowDown : AiOutlineArrowUp}*/}
          {/*  iconSizePX={24}*/}
          {/*  buttonWHClass={`w-8 h-8`}*/}
          {/*  containerBgClass={`bg-transparent h-auto hover:bg-gray-800`}*/}
          {/*  buttonBgClass={`bg-transparent`}*/}
          {/*  iconTxtColorClass={`text-white`}*/}
          {/*/>*/}
        </div>
      </div>
      {/*<div className={`flex-0 h-12`}>*/}
      {/*  <ButtonsRound*/}
      {/*    Icon={AiOutlineInfoCircle}*/}
      {/*    iconSizePX={16}*/}
      {/*    buttonWHClass={`w-8 h-8`}*/}
      {/*    containerBgClass={`bg-transparent hover:bg-gray-800`}*/}
      {/*    buttonBgClass={`bg-transparent`}*/}
      {/*    iconTxtColorClass={`text-indigo-400`}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
};