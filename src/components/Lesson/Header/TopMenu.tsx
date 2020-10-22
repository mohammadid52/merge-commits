import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

const TopMenu = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [isHovered, setIsHovered] = useState<boolean>();
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    if (state.pages[state.currentPage + 1]) {
      if (state.pages[state.currentPage + 1].open) {
        // console.log(state.pages);
        return dispatch({ type: 'CAN_CONTINUE' });
      }
      return dispatch({ type: 'NO_CONTINUE' });
    }
    return dispatch({ type: 'NO_CONTINUE' });
  }, [state.pages, state.currentPage]);

  const handleForward = () => {
    if (state.canContinue && state.currentPage < state.pages.length - 1) {
      history.push(`${match.url}/${state.pages[state.currentPage + 1].stage}`);
      dispatch({ type: 'PAGE_FORWARD' });
    }
  };

  const handleBack = () => {
    if (state.currentPage === 1) {
      history.push(`/lesson`);
      dispatch({ type: 'PAGE_BACK' });
    }

    if (state.currentPage > 1) {
      history.push(`${match.url}/${state.pages[state.currentPage - 1].stage}`);
      dispatch({ type: 'PAGE_BACK' });
    }
  };

  return (
    <>
      <div
        className={` ${theme.toolbar.bg} shadow-1 h-1.1/10 w-full flex justify-center items-center content-center py-4 px-6`}>
        <div className='w-full flex flex-row items-center justify-between'>
          {/* BACK BUTTON */}
          <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
              state.currentPage > 0 ? 'cursor-pointer bg-dark-red' : 'cursor-default bg-darker-gray'
            } }`}
            onClick={handleBack}>
            <IconContext.Provider
              value={{
                size: '1.5rem',
                style: { width: '32px' },
                className: `text-white`,
              }}>
              <AiOutlineArrowLeft />
            </IconContext.Provider>

            {/* <p className='mr-3 text-right'>Back</p> */}
          </div>

          <ProgressBar />

          {/* FORWARD BUTTON */}
          <div
            className={`text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${
              state.canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
            } `}
            onClick={handleForward}>
            {/* <p className='ml-3'>Continue</p> */}

            <IconContext.Provider
              value={{
                size: '1.5rem',
                style: { width: '32px' },
                className: `text-white`,
              }}>
              <AiOutlineArrowRight />
            </IconContext.Provider>
          </div>
        </div>
      </div>
      <div className='w-full h-6 bg-darker-gray'></div>
    </>
  );
};

export default TopMenu;
