import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from "react-icons";
import { IoLogoYoutube, } from 'react-icons/io';
import { AiFillPlusCircle } from 'react-icons/ai';
import { AiOutlineInstagram, } from 'react-icons/ai';
import { FaSpotify, } from 'react-icons/fa';

const MoreArtist = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ fullscreen, setFullscreen ] = useState(false);
    const [artistLink, setArtistLinks] = useState([
        {
            type: 'etc',
            link: 'https://linktr.ee/iconoclastartists',
            label: 'Iconoclast Website'
        },
        {
            type: 'youtube',
            link: 'https://youtube.com/',
            label: 'YouTube'
        },
        {
            type: 'instagram',
            link: 'https://www.instagram.com/iconoclastartists/',
            label: 'Instagram'
        },
        {
            type: 'youtube',
            link: 'https://youtube.com/',
            label: 'YouTube'
        },
    ])

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

                <div className="w-4.8/10 h-full flex flex-col items-center justify-center ">
                    <div className="h-full w-full flex justify-center items-start">
                        <div className="h-full w-full flex flex-col flex-wrap justify-center items-start">
                            {artistLink.map((item: {type: string, link: string, label: string}, key: number) => (
    
                                <div key={key} className="cursor-pointer px-4 py-2 w-4.5/10 h-5/10 flex justify-center items-start"> 
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {
                                            item.type === 'youtube' ?
                                            <IconContext.Provider value={{ color: '#ff0000', size: '3rem', className: 'flex-grow'}}>
                                                <IoLogoYoutube />
                                            </IconContext.Provider> :
                                            item.type === 'etc' ?
                                            <IconContext.Provider value={{ color: '#1a7fd8', size: '3rem', className: 'flex-grow'}}>
                                                <AiFillPlusCircle />
                                            </IconContext.Provider> :
                                            item.type === 'spotify' ? 
                                            <IconContext.Provider value={{ color: '#1DB954', size: '4.8rem', className: 'flex-grow'}}>
                                                <FaSpotify />
                                            </IconContext.Provider> :
                                            item.type === 'instagram' ?
                                            <IconContext.Provider  value={{ color: 'white', size: '3rem', className: 'flex-grow' }}>
                                                <AiOutlineInstagram />
                                            </IconContext.Provider> :
                                            <IconContext.Provider value={{ color: '#1a7fd8', size: '3rem', className: 'flex-grow'}}>
                                                <AiFillPlusCircle />
                                            </IconContext.Provider>
                                        }
                                    
                                    <p className="flex-grow text-center">
                                        {item.label}
                                    </p>
                                    </a>
                                </div>
                                    
                            ))}
                            {/* {
                                artistLink.youtube ?
                            <div className="cursor-pointer px-4 py-2"> 
                                <a href={artistLink.youtube} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#ff0000', size: '4rem', style: {height: 'auto'}}}>
                                    <IoLogoYoutube />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className="px-4 py-2 opacity-25"> 
                            <IconContext.Provider value={{ color: '#666666', size: '4rem', style: {opacity: '.25', height: 'auto'}}}>
                                <IoLogoYoutube />
                            </IconContext.Provider>
                        </div>
                            }
                            { artistLink.spotify ?
                            <div className="cursor-pointer px-4 py-2">
                                <a href={artistLink.spotify} target="_blank" rel="noopener noreferrer">
                                <IconContext.Provider value={{ color: '#1DB954', size: '4.8rem'}}>
                                    <FaSpotify />
                                </IconContext.Provider>
                                </a>
                            </div> :
                            <div className="px-4 py-2 opacity-25">
                            <IconContext.Provider value={{ color: '#666666', size: '4.8rem', style: {opacity: '.25'}}}>
                                <FaSpotify />
                            </IconContext.Provider>
                        </div>
                            }
                            
                        </div>
                        <div className="flex flex-col w-4/10">
                            {artistLink.instagram ?
                                <div className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"> 
                                    <a href={artistLink.instagram} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider  value={{ color: '#5851DB', size: '6rem', style: {height: 'auto'} }}>
                                        <AiOutlineInstagram />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className="px-4 py-2 opacity-25"> 
                                    <IconContext.Provider  value={{ color: '#666666', size: '6rem', style: {opacity: '.25', height: 'auto'}}}>
                                        <AiOutlineInstagram />
                                    </IconContext.Provider>
                                </div>
                            }
                            {artistLink.etc ?
                                <div className="cursor-pointer px-4 py-2">
                                    <a href={artistLink.etc} target="_blank" rel="noopener noreferrer">
                                    <IconContext.Provider value={{ color: '#1a7fd8', size: '6rem', style: {height: 'auto'}}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                    </a>
                                </div> :
                                <div className="px-4 py-2 opacity-25">
                                    <IconContext.Provider value={{ color: '#666666', size: '6rem', style: {opacity: '.25', height: 'auto'}}}>
                                        <AiFillPlusCircle />
                                    </IconContext.Provider>
                                </div>
                            } */}
                            
                            
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
