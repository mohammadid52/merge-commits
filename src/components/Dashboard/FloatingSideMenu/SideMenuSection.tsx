import React from 'react';
import {IconType} from 'react-icons';
import {AiOutlineCloseCircle} from 'react-icons/ai';
import {AiOutlineSave} from 'react-icons/all';
import ButtonsRound from '../../Atoms/ButtonsRound';

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
  saveInProgress?: boolean;
  setSaveInProgress?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    menuState,
    setMenuState,
    children,
    sectionLabel,
    sectionTitle,
    focusSection,

    saveInProgress,
  } = props;
  const thisSectionActive = focusSection === sectionLabel;

  const switchCloseIcon = (sectionName: string): IconType => {
    switch (sectionName) {
      case 'Notes':
        return AiOutlineSave;
      default:
        return AiOutlineCloseCircle;
    }
  };

  const handleCloseOrSave = () => {
    if (menuState > 0 && thisSectionActive && focusSection === 'Notes') {
      setMenuState(-1, 'reset');
    } else {
      setMenuState(-1, 'reset');
    }
  };

  return (
    <div
      className={`
      relative flex flex-col
      transform transition-all ease-in-out duration-400 z-100
       ${thisSectionActive ? 'opacity-100 flex-grow flex-1' : 'w-0 opacity-0'}
       ${thisSectionActive && menuState === 1 ? 'px-2' : ''}
       ${thisSectionActive && menuState === 2 ? 'bg-white' : ''}
       ${thisSectionActive && menuState === 3 ? 'px-2' : ''}
    `}>
      {menuState > 0 && thisSectionActive ? (
        <>
          <div
            className={`
              h-12 max-w-72 truncate overflow-ellipsis overflow-hidden
              flex items-center  font-medium z-100
              border-b-0 border-gray-400 
            ${
              menuState === 2
                ? 'border-t-0 pl-2 text-gray-700 text-xl bg-white'
                : 'text-indigo-100 text-sm '
            } `}>
            <p>{sectionTitle || 'Section Title'} </p>
            {saveInProgress && <span className={`ml-4`}>Saving...</span>}
          </div>
          <div
            onClick={() => handleCloseOrSave()}
            className={`w-auto absolute right-0 ${
              menuState > 0 ? '' : 'w-0 overflow-hidden'
            } text-sm fond-medium text-indigo-600 cursor-pointer z-100`}>
            <ButtonsRound
              Icon={switchCloseIcon(sectionLabel)}
              iconSizePX={24}
              buttonWHClass={`w-8 h-8`}
              containerBgClass={`bg-transparent p-2 border-b-0 border-gray-400 ${
                menuState === 2 ? 'border-t-0' : ''
              }`}
              buttonBgClass={`bg-transparent`}
              iconTxtColorClass={`${menuState === 2 ? 'text-gray-800' : 'text-white'}`}
            />
          </div>
        </>
      ) : null}

      {children ? (
        menuState === 0 && thisSectionActive ? (
          <div className={`flex flex-col flex-1 pt-2 w-0 overflow-hidden`}>
            {children}
          </div>
        ) : menuState === 1 && thisSectionActive ? (
          <div className={`flex flex-col flex-1 bg-gray-600 rounded-lg pt-2`}>
            {children}
          </div>
        ) : menuState === 2 && thisSectionActive ? (
          <div className={`flex flex-col flex-1`}>{children}</div>
        ) : menuState === 3 && thisSectionActive ? (
          <div className={`flex flex-col flex-1`}>{children}</div>
        ) : null
      ) : null}
    </div>
  );
};
