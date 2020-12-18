import React, { useContext } from 'react';
// import { IconContext } from "react-icons/lib/esm/iconContext";
// import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Connect = () => {
    const { state, theme } = useContext(LessonContext);
    const connection = state.data.lesson.connection;
    console.log(state, 'state ')
 


    return (
        <div className={`flex flex-col md:w-full md:h-full text-sm rounded-r-lg`}>
            <div className={`md:w-full md:h-full flex flex-col text-lx rounded-r-lg`}>
                <h1 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>SEL Connection:</h1>
                <p className={`${theme.elem.text}`}>{ connection }</p>
            </div>
        </div>
    )
}

export default Connect;