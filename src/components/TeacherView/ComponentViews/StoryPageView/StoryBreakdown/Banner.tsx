import React, {useContext} from 'react';
import { IconContext } from "react-icons";
import { FaScroll } from 'react-icons/fa';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

interface BannerProps {
    dataProps?: {
        title?: string,
        story?: string,
        additional?: [{
            name: string,
            input: string,
        }]
    }
    fullscreen: boolean
}

const Banner = (props: BannerProps) => {
    const { dataProps, fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);

    return (
        
        <div className={`w-full h-1/10  ${theme.banner} flex flex-row justify-center items-center`}>
            <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                <div className={`${fullscreen ? 'h-20 w-20' : 'h-12 w-12'} red bg-dark-red flex flex-col items-center justify-center z-20 rounded-lg shadow-2`}>
                    <FaScroll />
                </div>
            </IconContext.Provider>
            <div className={`${fullscreen ? 'text-4xl' : 'text-3xl'} h-full w-full font-medium z-10 flex justify-center items-center`}>
                    { dataProps && dataProps.title ? dataProps.title : '' }
            </div>
        </div>
    )
}

export default Banner;