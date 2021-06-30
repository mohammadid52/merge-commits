import React, { useContext, ReactNode, useState, ReactElement } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

import StageLabels from '../../General/LabelSwitch';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface StageButtonProps {
  iconID?: number;
  active?: boolean;
  open?: boolean;
  disabled?: boolean;
  label?: string;
  breakdown?: boolean;
  menuOpen?: boolean;
  handleOpenMenu?: (stage: string) => void;
  handlePageChange?: any;
  counter?: number;
}

const StageButton = (props: StageButtonProps) => {
  const {
    iconID,
    active,
    breakdown,
    open,
    menuOpen,
    handleOpenMenu,
    disabled,
    label,
    handlePageChange,
    counter,
  } = props;
  const {lessonState, lessonDispatch, controlState, controlDispatch} = useContext(GlobalContext);
  const match = useRouteMatch();
  const history = useHistory();

  const PAGES = lessonState.lessonData.lessonPlan;

  const stageIsViewed = lessonState.currentPage === iconID;
  const stageIsDisabled = PAGES[iconID].disabled === true;
  const stageIsClosed = PAGES[iconID].open === false;

  const handleView = () => {
    controlDispatch({ type: 'QUIT_STUDENT_VIEWING' });

    /**
     *
     * SET CURRENT VIEWED PAGE FOR
     * USE IN studentWindowTitleBar
     *
     **/

    handlePageChange(iconID);

    return history.push(`${match.url}/${iconID}`);
  };

  const stageButtonChoice = () => {
    if (iconID === 0) {
      return (
        <div className="flex items-center">
          <a
            onClick={() => {
              handleView();
            }}
            className={`text-sm font-medium text-gray-500 
            ${stageIsDisabled ? null : 'hover:font-bold hover:underline hover:text-sea-green'} 
            ${stageIsViewed && !stageIsClosed && !stageIsDisabled ? 'font-bold' : null}`}>
            <div className="text-blueberry text-center flex flex-row">
              <StageLabels label={PAGES ? label : 'n/a'} />
            </div>
          </a>
        </div>
      );
    } else if (iconID < PAGES.length - 1) {
      return (
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-2 h-6 text-light-gray"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
          </svg>
          <a
            onClick={() => {
              handleView();
            }}
            className={`text-sm font-medium 
            ${stageIsDisabled ? 'line-through' : null}
            ${stageIsClosed || stageIsDisabled ? 'text-gray-500' : null}
            ${stageIsClosed ? 'hover:underline' : null}
            ${stageIsViewed && stageIsClosed ? 'font-bold underline' : null}
            ${!stageIsClosed && !stageIsDisabled ? 'hover:text-sea-green hover:underline' : null}
            ${stageIsViewed && !stageIsClosed && !stageIsDisabled ? 'font-bold text-sea-green underline' : null}`}>
            <div className={`pl-2 text-center flex flex-row`}>
              <StageLabels label={PAGES ? label : 'n/a'} />
            </div>
          </a>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 w-2 h-6 text-light-gray"
            viewBox="0 0 24 44"
            preserveAspectRatio="none"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
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
              <StageLabels label={PAGES ? label : 'n/a'} />
            </div>
          </a>
        </div>
      );
    }
  };

  return (
    <li className="relative flex w-full">{stageButtonChoice()}</li>
    // </div>
  );
};

export default StageButton;
