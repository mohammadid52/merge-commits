import React, { useContext, ReactNode, useState, ReactElement } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import FooterLabels from '../../General/LabelSwitch';

interface StageButtonProps {
  iconID: number;
  stage: string;
  type: string;
  active: boolean;
  open: boolean;
  disabled: boolean;
  breakdown: boolean;
  menuOpen: boolean;
  handleOpenMenu: (stage: string) => void;
}

const StageButton = (props: StageButtonProps) => {
  const {
    iconID,
    stage,
    type,
    active,
    breakdown,
    open,
    menuOpen,
    handleOpenMenu,
    disabled,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();
  const history = useHistory();

  const handleView = () => {
    if (stage === 'intro') {
      handleOpenMenu(null);
      return history.push(`${match.url}`);
    }
    handleOpenMenu(null);
    dispatch({ type: 'QUIT_STUDENT_VIEWING' });
    return history.push(`${match.url}/${stage}`);
  };

  const handleStateChange = (type: string) => {
    dispatch({ type: type, payload: stage });
    handleOpenMenu(null);
  };

  const handleOpenCloseComponent = () => {
    if (stage !== 'intro') {
      if (open) {
        return handleStateChange('CLOSE_LESSON');
      }
      return handleStateChange('OPEN_LESSON');
    }
  };

  const buttonLabel = (): string => {
    return props.stage.charAt(0).toUpperCase() + props.stage.slice(1);
  };

  const stageButtonChoice = () => {
    if (iconID === 0) {
      return (
          <div className='flex items-center'>
          {/* <svg
              className='flex-shrink-0 w-4 h-8 text-light-gray'
              viewBox='0 0 24 44'
              preserveAspectRatio='none'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
            </svg> */}
              <a
              onClick={() => {
                handleOpenMenu(stage);
              }}
              className={`text-sm font-medium text-gray-500 ${(state.pages[iconID].disabled === true) ? null : 'hover: font-bold hover:underline hover:text-sea-green'} `}>
              <div className='text-blueberry font-bold text-center'><FooterLabels label={buttonLabel()} /></div>
            </a>
            
          </div>
      );
    } else if (iconID < state.pages.length - 1) {
      return (
          <div className='flex items-center'>
            <svg
              className='flex-shrink-0 w-4 h-12 text-light-gray'
              viewBox='0 0 24 44'
              preserveAspectRatio='none'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
            </svg>
            <a
              onClick={() => {
                handleOpenMenu(stage);
              }}
              className={`text-sm font-medium text-gray-500 ${(state.pages[iconID].disabled === true) ? null : 'hover: font-bold hover:underline hover:text-sea-green'} `}>
              <div className={`pl-2 text-center ${(state.pages[iconID].disabled === true) ? 'line-through' : null }`}><FooterLabels label={buttonLabel()} /></div>
            </a>
          </div>
      );
    } else {
      return (
          <div className='flex items-center'>
            <svg
              className='flex-shrink-0 w-4 h-12 text-light-gray'
              viewBox='0 0 24 44'
              preserveAspectRatio='none'
              fill='currentColor'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
            </svg>
            <a
              onClick={() => {
                handleOpenMenu(stage);
              }}
              className={`text-sm font-medium text-gray-500 ${(state.pages[iconID].disabled === true) ? null : 'hover: font-bold hover:underline hover:text-sea-green'} `}>
              <div className={`text-ketchup font-bold pl-2 text-center ${(state.pages[iconID].disabled === true) ? 'line-through' : null }`}><FooterLabels label={buttonLabel()} /></div>
            </a>
          </div>
      );
    }
  };

  return (
    // <div className={`relative w-auto flex flex-col justify-around items-center`}>
    //   <div
    //     className={`bg-gray-200 h-12 w-24 rounded-lg flex items-center justify-center border border-light-gray`}
    //     onClick={() => {
    //       handleOpenMenu(stage);
    //     }}>
    //     <FooterLabels label={buttonLabel()} />
    //   </div>
    <li className='relative flex w-full h-12'>
      {stageButtonChoice()}

      {menuOpen ? (
        <div
          className={`absolute bottom-0 transform translate-y-full flex flex-col items-center z-100`}>
          <div className={`arrow-up`}></div>

          <div className={`flex w-24 h-auto bg-gray-200 p-1 rounded-lg border-light-gray z-100`}>
            <div className={`flex flex-col w-full h-full bg-gray-400 rounded-lg z-100`}>
              <div
                className={`h-12 flex justify-center items-center bg-gray-200 text-gray-600 text-xs rounded-lg border border-light-gray active:shadow-none cursor-pointer`}
                onClick={handleView}>
                View
              </div>

              <div
                className={`h-12 my-2 flex justify-center items-center ${
                  stage !== 'intro'
                    ? 'bg-gray-200 text-gray-600 border border-light-gray active:shadow-none cursor-pointer'
                    : 'bg-gray-500 text-gray-600 shadow-none cursor-default'
                } text-xs rounded-lg`}
                onClick={handleOpenCloseComponent}>
                {!open ? 'Open' : 'Close'}
              </div>

              {/* <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('CLOSE_LESSON')}>
                            Close
                        </div> */}
              <div
                className={`h-12 flex justify-center items-center bg-gray-200 text-gray-600 text-xs rounded-lg border border-light-gray active:shadow-none active:shadow-none cursor-pointer`}
                onClick={() => handleStateChange('DISABLE_LESSON')}>
                {!disabled ? 'Disable' : 'Enable'}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </li>
    // </div>
  );
};

export default StageButton;
