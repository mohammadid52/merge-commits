import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LessonContext } from '../../contexts/LessonContext';

import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineInstagram, AiOutlineFacebook } from 'react-icons/ai';

const Branding: React.FC = () => {
  const { state, theme } = useContext(LessonContext);
  return (
    <>
      {/* CONTACT */}
      <div className='bg-darker-gray flex-row justify-center items-center'>
        <div
          className={`w-256 h-auto mx-auto bg-darker-gray py-8 flex flex-row justify-center items-start text-center`}>
          <div className={`w-3.3/10 ${theme.elem.text}`}>
            <p className='mb-1'>CONTACT US</p>
            <p>Info@IconoclastArtists.org</p>
            <p>MAILING ADDRESS:</p>
            <p>Iconoclast Artists</p>
            <p>11140 Greenbay Street</p>
            <p>Houston, TX 77024</p>
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
          
          {/* SOCIAL */}
          <div className={`w-3.3/10 ${theme.elem.text}`}>
            <p className='mb-1'>FOLLOW US</p>
            <div className='flex flex-row justify-center'>
              <IconContext.Provider
                value={{ size: '2rem', style: { width: 'auto', cursor: 'pointer' } }}>
                <AiOutlineInstagram className='text-white' />
              </IconContext.Provider>

              <IconContext.Provider
                value={{ size: '2rem', style: { width: 'auto', cursor: 'pointer' } }}>
                <AiOutlineFacebook className='text-white' />
              </IconContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Branding;
