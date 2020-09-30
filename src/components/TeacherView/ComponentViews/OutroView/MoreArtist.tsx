import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from "react-icons";
import { IoLogoYoutube, } from 'react-icons/io';
import { AiFillPlusCircle } from 'react-icons/ai';
import { IoIosGlobe } from 'react-icons/io';
import { AiOutlineInstagram } from 'react-icons/ai';
import { AiOutlineYoutube } from 'react-icons/ai';
import { FaSpotify, } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const MoreArtist = (props: props) => {
    const {  fullscreen } = props;
    const { state, dispatch, theme } = useContext(LessonControlContext)
    const [ fullscreenOutro, setFullscreenOutro ] = useState(false);
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
    ])

    return(
        // <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
        <div className={`h-4.5/10 ${theme.gradient.cardBase} ${fullscreen ? 'py-3 px-6' : 'py-1 px-2'} bg-dark-blue w-full text-gray-200 flex flex-col justify-between items-center rounded-lg`}>
            <h3 className={`${fullscreen ? 'text-2xl mr-4' : 'text-base'} w-full text-gray-200 font-medium border-b border-white border-opacity-50 `}>
            Learn more about {state.data.lesson.artist.name}
            </h3>
        <div className='h-full w-full flex flex-col items-center rounded-lg'>

            <div className='w-full h-full flex flex-row items-center justify-center '>
            <div className='h-full w-full flex flex-row'>
                {artistLink.map(
                (
                    item: { type: string; link: string; label: string },
                    key: number
                ) => (
                    <div
                    key={key}
                    className={`${fullscreen ? 'px-4 py-2' : ''} h-full p-2 flex justify-center items-start`}>
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

                        <p className={`${fullscreen ? 'text-sm' : 'text-xxs'} flex-grow text-center text-blue-100 text-opacity-75`}>
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

        // <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
        //     <h3 className={`${fullscreen ? 'text-3xl' : 'text-lg'} h-.8/10 w-full text-gray-200 font-open font-bold border-b border-white`}>
        //         Learn more about the artist
        //     </h3>
        //     <div className="h-3.5/10 w-9/10 flex justify-around items-center rounded-lg">
        //         <div className="w-6/10 h-full">
        //             <PhotoBlock fullscreen={fullscreen}/>
        //         </div>

        //         <div className="w-4.8/10 h-full flex flex-col items-center justify-center ">
        //             <div className="h-full w-full flex justify-center items-center">
        //             <div className="h-full w-full flex flex-col flex-wrap justify-center items-start">
        //                     {artistLink.map((item: {type: string, link: string, text: string}, key: number) => (
    
        //                         <div key={key} className={`${fullscreen ? 'px-4 py-2' : ''} cursor-pointer w-4.5/10 h-5/10 flex justify-center items-start`}> 
        //                             <a href={item.link} target="_blank" rel="noopener noreferrer">
        //                                 {
        //                                     item.type === 'youtube' ?
        //                                     <IconContext.Provider value={{ color: '#ff0000', size: '2rem', className: 'flex-grow'}}>
        //                                         <IoLogoYoutube />
        //                                     </IconContext.Provider> :
        //                                     item.type === 'etc' ?
        //                                     <IconContext.Provider value={{ color: '#1a7fd8', size: '2rem', className: 'flex-grow'}}>
        //                                         <AiFillPlusCircle />
        //                                     </IconContext.Provider> :
        //                                     item.type === 'spotify' ? 
        //                                     <IconContext.Provider value={{ color: '#1DB954', size: '3.8rem', className: 'flex-grow'}}>
        //                                         <FaSpotify />
        //                                     </IconContext.Provider> :
        //                                     item.type === 'instagram' ?
        //                                     <IconContext.Provider  value={{ color: 'white', size: '2rem', className: 'flex-grow' }}>
        //                                         <AiOutlineInstagram />
        //                                     </IconContext.Provider> :
        //                                     <IconContext.Provider value={{ color: '#1a7fd8', size: '2rem', className: 'flex-grow'}}>
        //                                         <AiFillPlusCircle />
        //                                     </IconContext.Provider>
        //                                 }
                                    
        //                             <p className={`${fullscreen ? 'text-sm' : 'text-xs'} flex-grow text-center`}>
        //                                 {item.text}
        //                             </p>
        //                             </a>
        //                         </div>
                                    
        //                     ))}
        //                 </div>
                       
        //             </div>
        //         </div>


        //     </div>
        //     <div className="h-5/10 rounded-lg">
        //         <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreenOutro={fullscreenOutro}/>
        //     </div>
        // </div>
    )
}

export default MoreArtist;
