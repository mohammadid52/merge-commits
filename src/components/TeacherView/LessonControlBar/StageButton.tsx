import React, { useContext, ReactNode, useState, ReactElement } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import StageLabels from '../../General/LabelSwitch';

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
  pageViewed: { pageID: number; stage: string };
  setPageViewed: React.Dispatch<React.SetStateAction<object>>;
  counter?: number;
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
    pageViewed,
    setPageViewed,
    counter,
  } = props;
  const { state, dispatch } = useContext(LessonControlContext);
  const match = useRouteMatch();
  const history = useHistory();

  const stageIsViewed = pageViewed.pageID === iconID;
  const stageIsDisabled = state.pages[iconID].disabled === true;
  const stageIsClosed = state.pages[iconID].open === false;

  const handleView = () => {
    dispatch({ type: 'QUIT_STUDENT_VIEWING' });

    /**
     *
     * SET CURRENT VIEWED PAGE FOR
     * USE IN studentWindowTitleBar
     *
     **/

    setPageViewed({
      pageID: iconID,
      stage: stage,
    });

    return history.push(`${match.url}/${stage}`);
  };

  const buttonLabel = (): string => {
    return props.stage.charAt(0).toUpperCase() + props.stage.slice(1);
  };

  const stageButtonChoice = () => {
    if (iconID === 0) {
      return (
        <div className='flex items-center'>
          <a
            onClick={() => {
              handleView();
            }}
            className={`text-sm font-medium text-gray-500 
            ${stageIsDisabled ? null : 'hover:font-bold hover:underline hover:text-sea-green'} 
            ${stageIsViewed && !stageIsClosed && !stageIsDisabled ? 'font-bold' : null}`}>
            <div className='text-blueberry text-center flex flex-row'>
              <StageLabels label={buttonLabel()} counter={counter}/>
            </div>
          </a>
        </div>
      );
    } else if (iconID < state.pages.length - 1) {
      return (
        <div className='flex items-center'>
          <svg
            className='flex-shrink-0 w-2 h-6 text-light-gray'
            viewBox='0 0 24 44'
            preserveAspectRatio='none'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'>
            <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
          </svg>
          <a
            onClick={() => {
              handleView();
            }}
            className={`text-sm font-medium 
            ${stageIsDisabled ? 'line-through' : null }
            ${stageIsClosed || stageIsDisabled ? 'text-gray-500':null}
            ${stageIsClosed ? 'hover:underline' : null}
            ${stageIsViewed && stageIsClosed ? 'font-bold underline' : null}
            ${!stageIsClosed && !stageIsDisabled ? 'hover:text-sea-green hover:underline' : null}
            ${stageIsViewed && !stageIsClosed && !stageIsDisabled ? 'font-bold text-sea-green underline' : null}`}>
            <div className={`pl-2 text-center flex flex-row`}>
              <StageLabels label={buttonLabel()} counter={counter}/>
            </div>
          </a>
        </div>
      );
    } else {
      return (
        <div className='flex items-center'>
          <svg
            className='flex-shrink-0 w-2 h-6 text-light-gray'
            viewBox='0 0 24 44'
            preserveAspectRatio='none'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'>
            <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
          </svg>
          <a
            onClick={() => {
              handleView();
            }}
            className={`text-sm font-medium text-gray-500 
            ${stageIsDisabled ? null : 'hover:font-bold hover:underline hover:text-sea-green'} 
            ${stageIsViewed && !stageIsClosed && !stageIsDisabled ? 'font-bold' : null}`}>
            <div
              className={`text-ketchup pl-2 text-center  flex flex-row ${
                stageIsDisabled ? 'line-through text-gray-500' : null
              }`}>
              <StageLabels label={buttonLabel()} counter={counter}/>
            </div>
          </a>
        </div>
      );
    }
  };

  return (
    <li className='relative flex w-full'>{stageButtonChoice()}</li>
    // </div>
  );
};

export default StageButton;
