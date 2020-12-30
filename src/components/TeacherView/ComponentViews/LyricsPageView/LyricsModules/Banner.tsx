import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaHeadphonesAlt } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface props {
    fullscreen: boolean
}
const Banner = (props: props) => {
    const { fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
    const { title, artist } = state.data.lesson.coreLesson.content

    return (
        <div className={`w-full text-4xl ${theme.banner}`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                <div className='w-auto h-auto mr-2'>
                    <FaHeadphonesAlt />
                </div>
            </IconContext.Provider>
            {title}
        </div>
    )
}

export default Banner;