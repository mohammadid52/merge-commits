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

export const FloatingBar = (props: {
  menuState?: number;
  setMenuState?: (level: number) => void;
  toggleChat: (desiredState: boolean) => void;
}) => {
  const {menuState, setMenuState, toggleChat} = props;

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
      {/*<div className={`flex-0 h-12`}>*/}
      {/*  <ButtonsRound*/}
      {/*    Icon={AiOutlineMenu}*/}
      {/*    iconSizePX={16}*/}
      {/*    buttonWHClass={`w-8 h-8`}*/}
      {/*    onClick={() => setMenuState(1)}*/}
      {/*    containerBgClass={`bg-transparent hover:bg-gray-800`}*/}
      {/*    buttonBgClass={`bg-transparent`}*/}
      {/*    iconTxtColorClass={`text-indigo-400`}*/}
      {/*  />*/}
      {/*</div>*/}
      <div
        className={`flex flex-1 flex-col items-center justify-center text-center items-center bg-charcoal rounded-l-lg cursor-pointer`}
        onClick={() => setMenuState(1)}>
        <div
          className={`transform -rotate-90 w-max flex flex-1 justify-center content-center items-center`}>
          <div
            className={`text-sm font-regular text-white w-24 h-8 text-right transform translate-y-1`}>
            Info & Chat
          </div>
          <ButtonsRound
            Icon={menuState > 0 ? AiOutlineArrowDown : AiOutlineArrowUp}
            iconSizePX={24}
            buttonWHClass={`w-8 h-8`}
            containerBgClass={`bg-transparent h-auto hover:bg-gray-800`}
            buttonBgClass={`bg-transparent`}
            iconTxtColorClass={`text-white`}
          />
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