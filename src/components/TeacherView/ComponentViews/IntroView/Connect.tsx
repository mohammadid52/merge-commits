import React, { useContext } from 'react';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Connect = (props: props) => {
    const {  fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
    const connection = state.data.lesson.connection;

    return (
        <div className={`flex flex-col md:w-full md:h-full text-sm rounded-r-lg`}>
            <div className={`md:w-full md:h-full flex flex-col text-lx rounded-r-lg`}>
                <h1 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>Objectives:</h1>
                <p className={`${theme.elem.text}`}>{ connection }</p>
            </div>
        </div>
    )
}

export default Connect;