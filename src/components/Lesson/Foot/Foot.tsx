import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../../contexts/LessonContext';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineInstagram, AiOutlineFacebook } from 'react-icons/ai';

import BottomMenu from './BottomMenu';

const Branding: React.FC = () => {
  const { state, theme } = useContext(LessonContext);
  return (
    <>
     
      <div className='mt-auto mb-0 bg-darker-gray flex-row justify-center items-center'>

      <BottomMenu/>

        <div
          className={`w-256 h-auto mx-auto bg-darker-gray py-8 flex flex-row justify-center items-start text-center`}>
     


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
        

        </div>
      </div>
    </>
  );
};

export default Branding;
