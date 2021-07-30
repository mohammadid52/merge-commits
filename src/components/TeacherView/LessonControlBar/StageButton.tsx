import React, {useContext, ReactNode, useState, ReactElement} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {LessonControlContext} from '../../../contexts/LessonControlContext';

import StageLabels from '../../General/LabelSwitch';
import {GlobalContext} from '../../../contexts/GlobalContext';
import {UniversalLessonPage} from '../../../interfaces/UniversalLessonInterfaces';

interface StageButtonProps {
  iconID?: number;
  active?: boolean;
  open?: boolean;
  disabled?: boolean;
  label?: string;
  id?: string;
  breakdown?: boolean;
  menuOpen?: boolean;
  handleOpenMenu?: (stage: string) => void;
  handlePageChange?: any;
  counter?: number;
  page?: UniversalLessonPage;
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
    page,
  } = props;
  const {lessonState, id, lessonDispatch, controlState, controlDispatch} = useContext(
    GlobalContext
  );

  const match = useRouteMatch();
  const history = useHistory();

  const PAGES = lessonState.lessonData.lessonPlan;

  const stageIsViewed = lessonState.currentPage === iconID;
  const stageIsDisabled = PAGES[iconID].disabled === true;
  const stageIsClosed = PAGES[iconID].open === false;

  const handleView = () => {
    controlDispatch({type: 'QUIT_STUDENT_VIEWING'});

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
            ${
              stageIsDisabled
                ? null
                : 'hover:font-bold hover:underline hover:text-sea-green'
            } 
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
            ${
              !stageIsClosed && !stageIsDisabled
                ? 'hover:text-sea-green hover:underline'
                : null
            }
            ${
              stageIsViewed && !stageIsClosed && !stageIsDisabled
                ? 'font-bold text-sea-green underline'
                : null
            }`}>
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
            ${
              stageIsDisabled
                ? null
                : 'hover:font-bold hover:underline hover:text-sea-green'
            } 
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

  const Nav = () => {
    return (
      <div className="flex items-center w-auto group">
        <svg
          className="flex-shrink-0 w-6 h-full text-gray-300 group-hover:text-gray-400 transition-all duration-150 "
          viewBox="0 0 24 44"
          preserveAspectRatio="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>

        <a
          href={page.href}
          className={` ${
            stageIsViewed && !stageIsClosed && !stageIsDisabled
              ? 'border-b-0 border-indigo-400 text-indigo-600 hover:text-indigo-700'
              : 'text-gray-600 hover:text-gray-700'
          }
            ml-4 cursor-pointer w-auto  text-sm font-medium transform hover:scale-110 transition-transform duration-150`}>
          {page.label}
        </a>
      </div>
    );
  };

  return (
    <li
      onClick={() => {
        handleView();
      }}
      className="relative flex w-auto">
      <Nav />
      {/* {stageButtonChoice()} */}
    </li>
  );
};

export default StageButton;
