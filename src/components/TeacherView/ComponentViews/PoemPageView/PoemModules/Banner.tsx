import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaPenFancy } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Banner = (props: props) => {
    const {  fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
    const title = state.data.lesson.activity.title;

    return (

        <div className={`w-full h-1/10  ${theme.banner} flex flex-row justify-center items-center`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2`}>
                    <FaPenFancy />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-3xl'} h-full w-full font-medium z-10 flex justify-center items-center`}>
                    { title }
            </div>
        </div>

    )
}

export default Banner;