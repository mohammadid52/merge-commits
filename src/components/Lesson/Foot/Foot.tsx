import React, { useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineInstagram, AiOutlineFacebook } from 'react-icons/ai';

import BottomMenu from './BottomMenu';

const Branding: React.FC = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
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

  useEffect(() => {
    console.log('match url: ', history.location.pathname);
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

  return (
    <>
      <div className='mt-auto mb-0 bg-darker-gray flex-row justify-center items-center'>
        {/* <BottomMenu /> */}

        <div
          className={`w-256 h-auto mx-auto bg-darker-gray py-8 flex flex-row justify-center items-start text-center`}>
          {/* BACK */}
          <div className='w-3.3/10 flex justify-center items-center'>
            {!history.location.pathname.includes('corelesson') ? (
              <div
                className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                  state.currentPage > 0
                    ? 'cursor-pointer bg-dark-red'
                    : 'cursor-default bg-darker-gray'
                } }`}
                onClick={handleBack}>
                <div className='w-auto h-auto'>Back</div>
              </div>
            ) : null}
          </div>

          {/* LOGO */}
          <div className='w-3.3/10 flex justify-center items-center'>
            <NavLink to='/dashboard'>
              <img
                className='h-6 px-4'
                src='https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg'
                alt='Iconoclast Artists'
              />
            </NavLink>
          </div>

          {/* CONTINUE */}
          <div className='w-3.3/10 flex justify-center items-center'>
            {!history.location.pathname.includes('corelesson') ? (
              <div
                className={`z-0  w-24 h-8 text-center flex justify-center items-center rounded-full ${
                  state.canContinue ? 'bg-sea-green cursor-pointer' : 'bg-dark-gray cursor-default'
                } `}
                onClick={handleForward}>
                <div className='w-auto h-auto'>Continue</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Branding;
