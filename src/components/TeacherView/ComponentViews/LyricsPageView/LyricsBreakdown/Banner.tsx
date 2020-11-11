import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { AiOutlineCustomerService } from 'react-icons/ai';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
    title?: string,
    artist?: string,
    fullscreen: boolean
}

const Banner = (props: BannerProps) => {
    const { title, artist, fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);

    return (
        <div className={`w-full text-4xl ${theme.banner}`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem' }}>
                <div className='w-auto h-auto mr-2'>
                    <AiOutlineCustomerService />
                </div>
            </IconContext.Provider>
            {title}
        </div>
    )
}

export default Banner;