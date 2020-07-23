import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaPenFancy } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Banner = () => {
    const { state, theme } = useContext(LessonContext);
    const artistName = state.data.artist.name
    
    return (
            // <div className="banner w-full flex flex-row justify-center items-center">
            //     <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
            //         <div className={`red bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-sm ${theme.block.shadow}`}>
            //             <FaMusic />
            //         </div>
            //     </IconContext.Provider>
            //     <div className={`${theme.block.bg} title h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-bold ${theme.block.text} rounded-sm ${theme.block.shadow} px-4 py-2 z-10`}>
            //         { artistName }
            //     </div>
            // </div>
        <div className="w-full flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                <div className={`red bg-dark-red h-24 w-24 flex flex-col items-center justify-center z-20 rounded-sm ${theme.block.shadow}`}>
                    <FaPenFancy />
                </div>
            </IconContext.Provider>
            <div className={`${theme.block.bg} title w-full flex flex-row justify-center items-center text-5xl text-center font-open font-bold ${theme.block.text} rounded-sm ${theme.block.shadow} px-4 py-2 z-10`}>
                { artistName }
            </div>
        </div>
    )
}

export default Banner;