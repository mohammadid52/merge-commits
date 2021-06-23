import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';
import {GlobalContext} from '../../../contexts/GlobalContext';

const LessonTopMenu = (props: {handlePopup: () => void}) => {
  const {state, dispatch, lessonState, lessonDispatch, theme} = useContext(GlobalContext);
  const history = useHistory();
  const match = useRouteMatch();

  const [canContinue, setCanContinue] = useState<boolean>(false);
  const [userAtEnd, setUserAtEnd] = useState<boolean>(false);
  useEffect(()=>{
    if(lessonState.lessonData.currentPage){
      const PAGES = lessonState.lessonData.lessonPlan;
      const CURRENT_PAGE = lessonState.lessonData.currentPage;
      const CAN_CONTINUE = PAGES && CURRENT_PAGE ? PAGES[CURRENT_PAGE+1].open : false;
      const USER_AT_END = PAGES && CURRENT_PAGE ? CURRENT_PAGE < (PAGES.length-1) : false;
    }
  },[lessonState.lessonData])




  const handleForward = () => {
    if (canContinue && !userAtEnd) {
      history.push(`${match.url}/${lessonState.lessonData.currentPage}`);
      lessonDispatch({type: 'SET_CURRENT_PAGE', payload: (lessonState.lessonData.currentPage+1)});
    }
    if (userAtEnd) {
      props.handlePopup();
    }
  };

  const handleBack = () => {
    if (state.currentPage > 0) {
      history.push(`${match.url}/${state.pages[state.currentPage - 1].stage}`);
      dispatch({type: 'PAGE_BACK'});
    }
  };

  return (
    <>
      <div
        className={` ${theme.toolbar.bg} shadow-1 h-16 w-full flex justify-center items-center content-center py-4 px-6`}>
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row justify-center">
            {/* BACK BUTTON */}

            <div
              className={`mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                state.currentPage > 0
                  ? 'cursor-pointer bg-dark-red'
                  : 'cursor-default bg-darker-gray'
              } }`}
              onClick={handleBack}>
              <IconContext.Provider
                value={{
                  size: '1.5rem',
                  style: {width: '32px'},
                  className: `text-white`,
                }}>
                <AiOutlineArrowLeft />
              </IconContext.Provider>
            </div>

            {/* PROGRESS BAR */}

            <ProgressBar />

            {/* FORWARD BUTTON */}

            <div
              className={`ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                canContinue || userAtEnd
                  ? 'bg-sea-green cursor-pointer'
                  : 'bg-dark-gray cursor-default'
              } `}
              onClick={handleForward}>
              <IconContext.Provider
                value={{
                  size: '1.5rem',
                  style: {width: '32px'},
                  className: `text-white`,
                }}>
                <AiOutlineArrowRight />
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>

      {/* ICON LABEL HOVER BAR */}
      <div className={`w-full h-6 bg-darker-gray`} />
    </>
  );
};

export default LessonTopMenu;
