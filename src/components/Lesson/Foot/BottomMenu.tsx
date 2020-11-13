import React, { useState, useRef, useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';

const BottomMenu = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
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




      {/* FLOATING NAV BUTTONS */}


      <div className='w-screen  bg-dark-gray'>

        <div className='w-full max-w-256 mx-auto py-2 flex flex-row row-reverse justify-between items-center text-white'>


          <div
            className={` w-24 h-8 text-center transform leading-relaxed rounded-full ${state.currentPage > 0 ? 'cursor-pointer bg-dark-red' : 'cursor-default bg-darker-gray'
              } }`}
            onClick={handleBack}>Back</div>


          <div
            className={` w-24 h-8 text-center transform leading-relaxed rounded-full ${state.canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
              } `}
            onClick={handleForward}>Continue</div>


        </div>

      </div>

    </>
  );
};

export default BottomMenu;
