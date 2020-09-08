import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Banner = (props: props) => {
    const {  fullscreen } = props;
    const { state } = useContext(LessonControlContext);
    const title = state.data.lesson.warmUp.title


    return (
        <div className="w-full h-1/10 flex flex-row justify-center items-center">
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2`}>
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-3xl'} h-full bg-dark-blue w-full flex flex-row justify-center items-center text-center font-open font-bold text-gray-200 rounded-lg shadow-2 z-10`}>
                    { title }
            </div>
        </div>
    )
}

export default Banner;