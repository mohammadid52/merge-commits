import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonContext } from '../../../../../contexts/LessonContext';

interface BannerProps {
    title?: string,
    display: string,
    fullscreen: boolean
}

const Banner = (props: BannerProps) => {
    const {theme} = useContext(LessonContext);
    const { title, display, fullscreen } = props;

    return (
        <>
            {display === 'SELF' ? 
            <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 shadow-2">
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className={`h-full ${theme.banner} text-xl md:text-3xl rounded-xl px-4 py-2 z-10`}>
                    { title }
            </div>
            </div>
            : display === 'COOP' ?
            <div className="w-full h-full flex flex-row justify-center items-center">
                <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                    <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-xl shadow-2">
                        <FaScroll />
                    </div>
                </IconContext.Provider>
                <div className={`${fullscreen ? 'text-4xl' : 'text-2xl'} h-full bg-dark-blue w-full flex flex-row justify-center items-center text-center rounded-lg px-4 py-2 z-10`}>
                        { title }
                </div>
            </div>
            :    
            <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-xl shadow-2">
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-2xl'} h-full ${theme.banner} px-4 py-2 z-10`}>
                    { title }
            </div>
            </div>
            }  
            
        
    </>
    )
}

export default Banner;