import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from "react-icons";
import { IoLogoYoutube, } from 'react-icons/io';
import { AiFillPlusCircle } from 'react-icons/ai';
import { AiFillInstagram, } from 'react-icons/ai';
import { FaSpotify, } from 'react-icons/fa';

const MoreArtist = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ fullscreen, setFullscreen ] = useState(false);
    const [artistLink, setArtistLinks] = useState(
        {
            youtube: '',
            spotify: '',
            instagram: 'https://www.instagram.com/iconoclastartists/',
            etc: 'https://linktr.ee/iconoclastartists'

        }
    )

    const img = '../../../../../public/instagram.svg';

    return(
        <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
            <h3 className="h-.8/10 w-full text-3xl text-gray-200 font-open font-bold border-b border-white">
                Learn more about the artist
            </h3>
            <div className="h-3.5/10 w-9/10 flex justify-between items-center rounded-lg">
                <div className="w-5/10 h-full">
                    <PhotoBlock />
                </div>

                <div className="w-4.8/10 flex flex-col items-center justify-center ">
                    <div className="h-full flex justify-center items-center">
                        <div className="flex flex-col w-4/10">
                            {
                                artistLink.youtube ?
                            <div className="cursor-pointer px-4 py-2"> 
                                <a href={artistLink.youtube} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#ff0000', size: '4.5rem'}}>
                                    <IoLogoYoutube />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className="px-4 py-2 opacity-25"> 
                            <IconContext.Provider value={{ color: '#666666', size: '4.5rem', style: {opacity: '.25'}}}>
                                <IoLogoYoutube />
                            </IconContext.Provider>
                        </div>
                            }
                            { artistLink.spotify ?
                            <div className="cursor-pointer px-4 py-2">
                                <a href={artistLink.spotify} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#1DB954', size: '4.5rem'}}>
                                    <FaSpotify />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className="px-4 py-2 opacity-25">
                            <IconContext.Provider value={{ color: '#666666', size: '4.5rem', style: {opacity: '.25'}}}>
                                <FaSpotify />
                            </IconContext.Provider>
                        </div>
                            }
                            
                        </div>
                        <div className="flex flex-col w-4/10">
                            {artistLink.instagram ?
                                <div className="cursor-pointer px-4"> 
                                    <a href={artistLink.instagram} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider  value={{ size: '6rem' }}>
                                        <AiFillInstagram />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className="px-4 opacity-25"> 
                                    <IconContext.Provider  value={{ color: '#666666', size: '6rem', style: {opacity: '.25'}}}>
                                        <AiFillInstagram />
                                    </IconContext.Provider>
                                </div>
                            }
                            {artistLink.etc ?
                                <div className="cursor-pointer px-4">
                                    <a href={artistLink.etc} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider value={{ color: '#1a7fd8', size: '6rem'}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className="px-4 opacity-25">
                                    <IconContext.Provider value={{ color: '#666666', size: '6rem', style: {opacity: '.25'}}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                </div>
                            }
                            
                            
                        </div>
                    </div>
                </div>


            </div>
            <div className="h-5/10 rounded-lg">
                <VideoBlock link={state.data.lesson.coreLesson.content.link} fullscreen={fullscreen}/>
            </div>
        </div>
    )
}

export default MoreArtist;
