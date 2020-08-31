import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaPenFancy } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}

const Banner = (props: props) => {
    const { fullscreen } = props
    const { state, theme } = useContext(LessonControlContext);
    const title = state.data.lesson.title
    console.log(state.data)
    
    return (
        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2 ${theme.block.shadow}`}>
                    <FaPenFancy />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-2xl py-2'} ${theme.block.bg} w-full flex flex-row justify-center items-center text-center font-open font-bold ${theme.block.text} rounded-lg ${theme.block.shadow} px-4 z-10`}>
                { title }
            </div>
        </div>
    )
}

export default Banner;