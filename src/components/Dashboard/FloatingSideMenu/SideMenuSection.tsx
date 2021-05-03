import React from 'react';
import ButtonsRound from '../../Atoms/ButtonsRound';
import { AiOutlineCloseCircle } from 'react-icons/ai';

export const SideMenuSection = (props: {
  menuState?: number;
  setMenuState?: (level: number, section: string) => void;
  children?: React.ReactNode;
  sectionLabel?: string;
  sectionTitle?: string;
  setIsolatedSection?: (sectionStr: string) => void;
  focusSection?: string;
  setFocusSection?: React.Dispatch<React.SetStateAction<string>>;
  isOpen?: boolean;
  isChatActive?: boolean;
}) => {
  const {
    menuState,
    setMenuState,
    children,
    sectionLabel,
    sectionTitle,
    focusSection,
    setFocusSection,
  } = props;
  const thisSectionActive = focusSection === sectionLabel;
  const noSectionActive = focusSection === '';

  return (
    <div
      className={`
      relative flex flex-col
      transform transition-all ease-in-out duration-400
       ${thisSectionActive ? 'opacity-100 flex-grow flex-1' : 'w-0 opacity-0'}
       ${thisSectionActive && menuState === 1 ? 'px-2' : ''}
       ${thisSectionActive && menuState === 2 ? 'bg-white' : ''}
    `}>
      {menuState > 0 && thisSectionActive ? (
        <>
          <p
            className={`h-12 max-w-72 truncate overflow-ellipsis overflow-hidden border-b-0 border-gray-400 ${
              menuState === 2
                ? 'pl-2 text-gray-700 text-xl bg-white'
                : 'text-indigo-100 text-sm '
            } flex items-center  font-medium z-50`}>
            {sectionTitle || 'Section Title'}{' '}
          </p>
          <div
            onClick={() => setMenuState(-1, 'reset')}
            className={`w-auto absolute right-0 ${
              menuState > 0 ? '' : 'w-0 overflow-hidden'
            } text-sm fond-medium text-indigo-600 cursor-pointer z-100`}>
            <ButtonsRound
              Icon={AiOutlineCloseCircle}
              iconSizePX={24}
              buttonWHClass={`w-8 h-8`}
              containerBgClass={`bg-transparent p-2 border-b-0 border-gray-400`}
              buttonBgClass={`bg-transparent`}
              iconTxtColorClass={`${menuState === 2 ? 'text-gray-800' : 'text-white'}`}
            />
          </div>
        </>
      ) : null}

      {children ? (
        menuState === 1 && thisSectionActive ? (
          <div className={`flex flex-col flex-1 bg-gray-600 rounded-lg pt-2`}>
            {children}
          </div>
        ) : menuState === 2 && thisSectionActive ? (
          <div className={`flex flex-col flex-1`}>{children}</div>
        ) : menuState === 0 && thisSectionActive ? (
          <div className={`flex flex-col flex-1 pt-2 w-0 overflow-hidden`}>
            {children}
          </div>
        ) : null
      ) : null}
    </div>
  );
};