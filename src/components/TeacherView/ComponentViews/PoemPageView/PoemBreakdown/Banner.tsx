import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaPenFancy } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
    title?: string,
    artist?: string,
    display: string,
    fullscreen: boolean
}

const Banner = (props: BannerProps) => {
    const { title, artist, display, fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);

    return (
        <div className={`w-full h-1/10 text-2xl ${theme.banner}`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                <div className='w-auto h-auto mr-2'>
                    <FaPenFancy />
                </div>
            </IconContext.Provider>
            <div
                className={``}>
                {typeof title !== 'undefined' ? title : 'Your Poem Title :)'}
            </div>
        </div>
    )
}

export default Banner;