import React, { useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

const TopMenu = () => {
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
      <div
        className={`flex-grow-0 ${theme.toolbar.bg} shadow-1 h-1.1/10 w-full flex justify-center items-center content-center py-4 px-6`}>
        <div className='w-full flex flex-row items-center justify-around md:mx-8'>
          <div
            className={`flex-grow-0 ${
              state.currentPage > 0
                ? 'bg-dark-red text-gray-300 cursor-pointer'
                : 'bg-gray-500 text-gray-600 cursor-default'
            } text-sm text-gray-200 flex justify-center items-center w-32 h-8 rounded-lg z-30 `}
            onClick={handleBack}>
            Back
          </div>
          <ProgressBar />
          <div
            className={`flex-grow-0 ${
              state.canContinue
                ? 'bg-sea-green text-gray-300 cursor-pointer'
                : 'bg-gray-500 text-gray-600 cursor-default'
            } text-sm text-gray-200 flex justify-center items-center w-32 h-8 rounded-lg z-30 `}
            onClick={handleForward}>
            Continue
          </div>
        </div>
      </div>
      <div className='w-full h-4 bg-black opacity-10'></div>
    </>
  );
};

export default TopMenu;
