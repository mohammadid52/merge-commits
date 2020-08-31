import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from "react-icons";
import { IoLogoYoutube, } from 'react-icons/io';
import { AiFillPlusCircle } from 'react-icons/ai';
import { AiFillInstagram, } from 'react-icons/ai';
import { FaSpotify, } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const MoreArtist = (props: props) => {
    const {  fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext)
    const [ fullscreenOutro, setFullscreenOutro ] = useState(false);
    const [artistLink, setArtistLinks] = useState(
        {
            youtube: '',
            spotify: '',
            instagram: 'https://www.instagram.com/iconoclastartists/',
            etc: 'https://linktr.ee/iconoclastartists'

        }
    )

    return(
        <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
            <h3 className={`${fullscreen ? 'text-3xl' : 'text-lg'} h-.8/10 w-full text-gray-200 font-open font-bold border-b border-white`}>
                Learn more about the artist
            </h3>
            <div className="h-3.5/10 w-8/10 flex justify-around items-center rounded-lg">
                <div className="w-6/10 h-full">
                    <PhotoBlock fullscreen={fullscreen}/>
                </div>

                <div className="w-4.8/10 flex flex-col items-center justify-center ">
                    <div className="h-full flex justify-center items-center">
                        <div className="flex flex-col w-4/10">
                            {
                                artistLink.youtube ?
                            <div className={`${fullscreen ? 'px-4 py-2' : ''} cursor-pointer`}> 
                                <a href={artistLink.youtube} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#ff0000', size: '5rem'}}>
                                    <IoLogoYoutube />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className={`${fullscreen ? 'px-4 py-2' : ''} opacity-25`}> 
                            <IconContext.Provider value={{ color: '#666666', size: '5rem'}}>
                                <IoLogoYoutube />
                            </IconContext.Provider>
                        </div>
                            }
                            { artistLink.spotify ?
                            <div className={`${fullscreen ? 'px-4 py-2' : ''} cursor-pointer`}>
                                <a href={artistLink.spotify} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#1DB954', size: '5rem'}}>
                                    <FaSpotify />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className={`${fullscreen ? 'px-4 py-2' : ''} opacity-25`}>
                            <IconContext.Provider value={{ color: '#666666', size: '5rem'}}>
                                <FaSpotify />
                            </IconContext.Provider>
                        </div>
                            }
                            
                        </div>
                        <div className="flex flex-col w-4/10">
                            {artistLink.instagram ?
                                <div className={`${fullscreen ? 'px-4' : ''} cursor-pointer`}> 
                                    <a href={artistLink.instagram} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider  value={{ color: '#C13584', size: '6rem'}}>
                                        <AiFillInstagram />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className={`${fullscreen ? 'px-4' : ''} opacity-25`}> 
                                    <IconContext.Provider  value={{ color: '#666666', size: '6rem'}}>
                                        <AiFillInstagram />
                                    </IconContext.Provider>
                                </div>
                            }
                            {artistLink.etc ?
                                <div className={`${fullscreen ? 'px-4' : ''} cursor-pointer`}>
                                    <a href={artistLink.etc} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider value={{ color: '#1a7fd8', size: '5rem'}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className={`${fullscreen ? 'px-4' : ''} opacity-25`}>
                                    <IconContext.Provider value={{ color: '#666666', size: '5rem'}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                </div>
                            }
                            
                            
                        </div>
                    </div>
                </div>


            </div>
            <div className="h-5/10 rounded-lg">
                <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreenOutro={fullscreenOutro}/>
            </div>
        </div>
    )
}

export default MoreArtist;
