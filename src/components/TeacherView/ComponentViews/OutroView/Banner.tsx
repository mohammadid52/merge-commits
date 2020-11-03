import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineSmile } from 'react-icons/ai';
import { LessonContext } from '../../../../contexts/LessonContext';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

const keywordCapitilizer = (str: string) => {
    let capitalizedStr = str.replace(/^\w/, char => char.toUpperCase());
    return capitalizedStr;
}

interface props {
    fullscreen: boolean
}

const Banner = (props: props) => {
    const { fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);


    return (
        <div className={`w-full h-1/10 text-2xl ${theme.banner}`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                <div className='w-auto h-auto mr-2'>
                    <AiOutlineSmile />
                </div>
            </IconContext.Provider>
            <p>Congrats! You've completed '{state.data.lesson.title}'!</p>
        </div>
    )
}

export default Banner;