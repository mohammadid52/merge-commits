import React, { useContext, useState } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import VideoBlock from './VideoBlock';
import PhotoBlock from './PhotoBlock';
import { IconContext } from "react-icons";
import { IoLogoYoutube, } from 'react-icons/io';
import { FaSpotify, } from 'react-icons/fa';


const MoreArtist = () => {
    const { state, dispatch } = useContext(LessonContext)
    const [ fullscreen, setFullscreen ] = useState(false)

    return(
        <div className="w-full h-full bg-dark-blue text-gray-200 p-4 flex flex-col justify-between items-center rounded-lg">
            <h3 className="h-.8/10 w-full text-3xl text-gray-200 font-open font-bold border-b border-white">
                Learn more about the artist
            </h3>
            <div className="h-3.5/10 w-8/10 flex justify-around items-center rounded-lg">
                <div className="w-6/10 h-full">
                    <PhotoBlock />
                </div>

                <div className="w-2/10 flex flex-col items-center justify-center ">
                    <div className="h-full flex flex-col justify-center items-center">
                        <div className="cursor-pointer"> 
                            <IconContext.Provider value={{ color: '#ff0000', size: '5rem'}}>
                                <IoLogoYoutube />
                            </IconContext.Provider>
                        </div>
                        <div className="cursor-pointer">
                            <IconContext.Provider value={{ color: '#1DB954', size: '5rem'}}>
                                <FaSpotify />
                            </IconContext.Provider>
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
