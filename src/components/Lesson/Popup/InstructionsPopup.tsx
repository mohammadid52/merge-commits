import React, { useState } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaPlus } from 'react-icons/fa';

interface InstructionsPopupProps {
    video: string, 
    open: boolean, 
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InstructionsPopup = (props: InstructionsPopupProps) => {
    const { video, open, setOpen } = props;
    
    const handleClose = () => {
        setOpen(false);
    }
    
    if ( !open ) {
        return null
    }

    return (
        <div className="absolute h-full w-full bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-dark-blue w-7/12 h-140 text-gray-900 text-2xl flex flex-col justify-around items-center py-4 px-8 shadow-2">
                <div className="w-full flex justify-between mb-4 border-b-0 border-white border-opacity-10">
                    <h3 className="flex-grow text-4xl text-gray-200 font-open font-bold">
                        Instructions
                    </h3>
                    <div className="w-12 h-12 flex justify-center items-center" onClick={handleClose}>
                        <IconContext.Provider value={{ color: '#EDF2F7',  size: '1.5rem', style: { transform: 'rotate(45deg)'}}}>
                            <FaPlus />
                        </IconContext.Provider>
                    </div>
                </div>
                <div className="h-full flex items-center">
                    <video controls width="800" className="shadow-2">
                        <source src={`${video}`} type="video/mp4" />
                        <p>Your browser does not support embedded video playback!</p>
                    </video>
                </div>
            </div>
        </div>
    )
}

export default InstructionsPopup;