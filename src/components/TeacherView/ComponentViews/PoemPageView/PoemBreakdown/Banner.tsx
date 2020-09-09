import React from 'react';
import { IconContext } from "react-icons";
import { FaPenFancy } from 'react-icons/fa';

interface BannerProps {
    title?: string,
    artist?: string,
    display: string,
    fullscreen: boolean
}

const Banner = (props: BannerProps) => {
    const { title, artist, display, fullscreen } = props;
    
    return (
        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2`}>
                    <FaPenFancy />
                </div>
            </IconContext.Provider> 
           
            <div className={`${fullscreen ? 'text-4xl' : 'text-2xl px-4 py-2'} h-full bg-dark-blue w-full flex flex-row justify-center items-center text-center font-open font-bold text-gray-200 rounded-lg shadow-2 z-10`}>
                    { title ? title : null }
            </div>
        </div>
    )
}

export default Banner;