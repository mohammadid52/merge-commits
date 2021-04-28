import React from 'react';
import ButtonsRound from '../../Atoms/ButtonsRound';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineInfoCircle,
  AiOutlineMenu,
} from 'react-icons/ai';

export const FloatingBar = (props: {
  menuState?: number;
  setMenuState?: (level: number) => void;
  isChatActive: boolean;
  toggleChat: (desiredState: boolean) => void;
}) => {
  const {menuState, setMenuState, isChatActive, toggleChat} = props;

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
      
      bg-gray-700 border-r-1 border-gray-200 rounded-l-lg shadow
      flex flex-col`}>
      <div className={`flex-0 h-12`}>
        <ButtonsRound
          Icon={AiOutlineMenu}
          iconSizePX={16}
          buttonWHClass={`w-8 h-8`}
          onClick={() => setMenuState(1)}
          containerBgClass={`bg-transparent`}
          buttonBgClass={`bg-gray-800`}
          iconTxtColorClass={`text-indigo-200`}
        />
      </div>
      <div className={`flex flex-1 items-center justify-center text-center`}>
        <ButtonsRound
          Icon={menuState > 0 ? AiOutlineArrowRight : AiOutlineArrowLeft}
          iconSizePX={16}
          buttonWHClass={`w-8 h-8`}
          onClick={() => setMenuState(1)}
          containerBgClass={`bg-transparent`}
          buttonBgClass={`bg-gray-800`}
          iconTxtColorClass={`text-indigo-200`}
        />
      </div>
      <div className={`flex-0 h-12`}>
        <ButtonsRound
          Icon={AiOutlineInfoCircle}
          iconSizePX={16}
          buttonWHClass={`w-8 h-8`}
          containerBgClass={`bg-transparent`}
          buttonBgClass={`bg-gray-800`}
          iconTxtColorClass={`text-indigo-200`}
        />
      </div>
    </div>
  );
};