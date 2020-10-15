import React, { useContext } from 'react';
// import { IconContext } from "react-icons/lib/esm/iconContext";
// import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Connect = () => {
    const { state, theme } = useContext(LessonContext);
    const connection = state.data.lesson.connection;
    console.log(state, 'state ')
 


    return (
        <div className={`flex flex-col md:w-full md:h-full ${theme.block.text} text-lx rounded-r-lg`}>
            <div className={`md:w-full md:h-full p-4 flex flex-col ${theme.block.text} text-lx rounded-r-lg`}>
                <h1 className={`text-2xl font-medium ${theme.underline}`}>SEL Connection:</h1>
                <p className="font-light text-base text-blue-100 text-opacity-75">{ connection }</p>
            </div>
        </div>
    )
}

export default Connect;