import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from 'react-icons';
import { IoLogoYoutube } from 'react-icons/io';
import { AiOutlineYoutube } from 'react-icons/ai';
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoIosGlobe } from 'react-icons/io';
import { AiOutlineInstagram } from 'react-icons/ai';
import { FaSpotify } from 'react-icons/fa';

const MoreArtist = () => {
  const { state, dispatch, theme } = useContext(LessonContext);
  const [fullscreen, setFullscreen] = useState(false);
  const [artistLink, setArtistLinks] = useState([
    {
      type: 'etc',
      link: 'https://iconoclastartists.org/',
      label: 'Iconoclast Artists Website',
    },
    {
      type: 'instagram',
      link: 'https://www.instagram.com/iconoclastartists/',
      label: 'Iconoclast Artists Instagram',
    },
    {
      type: 'youtube',
      link: 'https://youtu.be/bp10ZOtv_zY',
      label: 'MARLON HAVIKORO',
    },
    {
      type: 'youtube',
      link: 'https://youtu.be/pguAGyNHVAo',
      label: 'Red Bull BC One Houston Camp',
    },
    {
      type: 'youtube',
      link: 'https://youtu.be/gNtJewsy-3w',
      label: 'CreativeMornings Houston',
    },
    
  ]);

  const img = '../../../../../public/instagram.svg';

  return (
    // <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
    <div className={`h-4/10 ${theme.gradient.cardBase} bg-dark-blue w-full text-gray-200 py-3 px-6 flex flex-col justify-between items-center rounded-lg`}>
        <h3 className='w-full text-gray-200 text-2xl font-medium border-b border-white border-opacity-50 mr-4'>
          Learn more about {state.data.lesson.artist.name}
        </h3>
      <div className='h-full w-full flex flex-col items-center rounded-lg'>
        {/* <PhotoBlock /> */}

        <div className='w-full h-full flex flex-row items-center justify-center '>
          <div className='h-full w-full flex flex-row'>
            {artistLink.map(
              (
                item: { type: string; link: string; label: string },
                key: number
              ) => (
                <div
                  key={key}
                  className='h-full p-2 flex justify-center items-start'>
                  <a href={item.link} target='_blank' rel='noopener noreferrer'>
                    {item.type === 'youtube' ? (
                      <IconContext.Provider
                        value={{
                          color: '#CA2222',
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <AiOutlineYoutube />
                      </IconContext.Provider>
                    ) : item.type === 'etc' ? (
                      <IconContext.Provider
                        value={{
                          color: '#3d7cef',
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <IoIosGlobe />
                      </IconContext.Provider>
                    ) : item.type === 'spotify' ? (
                      <IconContext.Provider
                        value={{
                          color: 'white',
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <FaSpotify />
                      </IconContext.Provider>
                    ) : item.type === 'instagram' ? (
                      <IconContext.Provider
                        value={{
                          color: 'white',
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <AiOutlineInstagram />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider
                        value={{
                          color: 'white',
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <IoIosGlobe />
                      </IconContext.Provider>
                    )}

                    <p className='flex-grow text-sm text-center text-blue-100 text-opacity-75'>
                      {item.label}
                    </p>
                  </a>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {/* <div className="h-5/10 rounded-lg">
                <VideoBlock link='https://www.youtube.com/embed/bp10ZOtv_zY' fullscreen={fullscreen}/>
            </div> */}
    </div>
  );
};

export default MoreArtist;
