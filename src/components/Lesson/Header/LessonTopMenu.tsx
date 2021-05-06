import React, {useContext, useEffect, useState} from 'react';
import {LessonContext} from '../../../contexts/LessonContext';
import {useHistory, useRouteMatch} from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import {IconContext} from 'react-icons/lib/esm/iconContext';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai';

const LessonTopMenu = (props: {handlePopup: () => void}) => {
  const {state, dispatch, theme} = useContext(LessonContext);
  const history = useHistory();
  const match = useRouteMatch();
  const userAtEnd = state.currentPage + 1 === state.pages.length;

  const [barType, setBarType] = useState<string>('');

  useEffect(() => {
    state.data.lesson.type && setBarType(state.data.lesson.type);
  }, [state.data.lesson.type]);

  useEffect(() => {
    if (state.pages[state.currentPage + 1]) {
      if (state.pages[state.currentPage + 1].open) {
        // console.log(state.pages);
        return dispatch({type: 'CAN_CONTINUE'});
      }
      return dispatch({type: 'NO_CONTINUE'});
    }
    return dispatch({type: 'NO_CONTINUE'});
  }, [state.pages, state.currentPage]);

  const handleForward = () => {
    if (state.canContinue && state.currentPage < state.pages.length - 1) {
      history.push(`${match.url}/${state.pages[state.currentPage + 1].stage}`);
      dispatch({type: 'PAGE_FORWARD'});
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

            <ProgressBar barType={barType} />

            {/* FORWARD BUTTON */}

            <div
              className={`ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
                state.canContinue || userAtEnd
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
      {barType === 'lesson' ? <div className={`w-full h-6 bg-darker-gray`} /> : null}
    </>
  );
};

export default LessonTopMenu;