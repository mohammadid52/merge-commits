import React from 'react';
import { IconContext } from "react-icons";
import { FaPenFancy } from 'react-icons/fa';

interface BannerProps {
    title: string,
    artist?: string,
}

const Banner = (props: BannerProps) => {
    const { title, artist } = props;
    
    return (
        <div className="banner w-full flex flex-row justify-center items-center my-4 ">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
            <div className="red bg-dark-red h-24 w-24 mx- flex flex-col items-center justify-center z-20 rounded-sm shadow-2">
                <FaPenFancy />
            </div>
            </IconContext.Provider>
            <div className="title bg-dark-blue shadow-2 w-full flex flex-row justify-between items-center text-xl text-center font-open font-bold text-gray-200 px-4 py-2 z-10 text-center">
                <div className="text-5xl ml-2"> 
                    { title }
                </div>
            </div>
        </div>
    )
}

export default Banner;