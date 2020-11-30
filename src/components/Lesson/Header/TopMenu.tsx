import React, { useState, useRef, useContext, useEffect } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ProgressBar from './ProgressBar/ProgressBar';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

const TopMenu = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const history = useHistory();
  const match = useRouteMatch();

  /**
   * STICKY NAV BUTTONS
   */
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

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





  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);






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

  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top <= 0);
    }
  };



  return (
    <>
      <div
        className={` ${theme.toolbar.bg} shadow-1 h-1.1/10 w-full flex justify-center items-center content-center py-4 px-6`}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <div className='w-full flex flex-row items-center justify-between'>






          <div ref={ref} className='flex flex-row justify-center'>

            {/* BACK BUTTON */}

            <div
              className={`mr-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${state.currentPage > 0 ? 'cursor-pointer bg-dark-red' : 'cursor-default bg-darker-gray'
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
            </div>


            {/* PROGRESS BAR */}

            <ProgressBar isHovered={isHovered} />



            {/* FORWARD BUTTON */}

            <div
              className={`ml-4 text-sm flex justify-between items-center rounded-full w-8 h-8 z-30 ${state.canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
                } `}
              onClick={handleForward}>

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
      </div>

      {/* ICON LABEL HOVER BAR */}
      <div className={`${isHovered ? 'opacity-100' : 'opacity-0'} w-full h-6 bg-darker-gray`}></div>



      {/* FLOATING NAV BUTTONS */}
{/* 
      {
        (isSticky
          ?
          (
            <>

              <div className='fixed h-16 bottom-1/2 w-full'>
                <div
                  className={`absolute right-0 w-24 h-8 text-center transform -translate-x-1/2 leading-relaxed rounded-full z-30 ${state.canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
                    } `}
                  onClick={handleForward}>Continue</div>

                <div className='max-w-256 w-full' style={{pointerEvents: 'none'}}></div>

                <div
                  className={`absolute left-0 w-24 h-8 text-center transform translate-x-1/2 leading-relaxed rounded-full z-30 ${state.currentPage > 0 ? 'cursor-pointer bg-dark-red' : 'cursor-default bg-darker-gray'
                    } }`}
                  onClick={handleBack}>Back</div>
              </div>

            </>
          )
          : null

        )
      } */}


    </>
  );
};

export default TopMenu;
