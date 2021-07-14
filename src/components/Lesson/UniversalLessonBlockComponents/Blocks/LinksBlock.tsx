import React, {useContext, useState} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {IoIosGlobe} from 'react-icons/io';
import {AiOutlineInstagram, AiOutlineYoutube} from 'react-icons/ai';
import {FaSpotify} from 'react-icons/fa';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {GlobalContext} from '../../../../contexts/GlobalContext';

interface LinksBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  value?: {id: string; type: string; label: string; value: string}[];
}

const LinksBlock = (props: LinksBlockProps) => {
  const {id, value} = props;
  const {
    state: {lessonPage: {theme: lessonPageTheme = '', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const iconColor = lessonPageTheme === 'light' ? 'black' : 'white';
  const textColor = lessonPageTheme === 'light' ? 'text-blue-500' : 'text-blue-100';
  return (
    <div id={id} className="h-full w-full flex flex-col items-center rounded-lg">
      <div className="w-full h-full flex flex-row items-center justify-center ">
        <div className="h-full w-full flex flex-row">
          {value &&
            value.length > 0 &&
            value.map(
              (
                item: {id: string; type: string; label: string; value: string},
                key: number
              ) => (
                <div
                  key={`${id}_${key}`}
                  className="h-full p-2 flex justify-center items-start">
                  <a href={item.value} target="_blank" rel="noopener noreferrer">
                    {item.type === 'youtube' ? (
                      <IconContext.Provider
                        value={{
                          color: iconColor,
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <AiOutlineYoutube />
                      </IconContext.Provider>
                    ) : item.type === 'etc' ? (
                      <IconContext.Provider
                        value={{
                          color: iconColor,
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <IoIosGlobe />
                      </IconContext.Provider>
                    ) : item.type === 'spotify' ? (
                      <IconContext.Provider
                        value={{
                          color: iconColor,
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <FaSpotify />
                      </IconContext.Provider>
                    ) : item.type === 'instagram' ? (
                      <IconContext.Provider
                        value={{
                          color: iconColor,
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <AiOutlineInstagram />
                      </IconContext.Provider>
                    ) : (
                      <IconContext.Provider
                        value={{
                          size: '2rem',
                          className: 'flex flex-grow',
                        }}>
                        <IoIosGlobe
                          className={
                            lessonPageTheme === 'dark' ? 'text-white' : 'text-gray-600'
                          }
                        />
                      </IconContext.Provider>
                    )}

                    <p
                      className={`${textColor} flex-grow text-sm text-center text-opacity-75`}>
                      {item.label}
                    </p>
                  </a>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default LinksBlock;