import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Connect = () => {
    const { state, theme } = useContext(LessonContext);
    const artistBio = state.data.artist.bio

    // const firstLetterFunction = (str: string) => {
    //     let arr = str.split('');
    //     arr.map((char, key) => {
    //         if (key === 0) {
    //             return <span>{char}</span>
    //         }
    //     })
    // }


    return (
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} rounded-sm shadow-inner`}>
            <h1 className="text-lg font-extrabold mb-6">Connect:</h1>
            <div>
            <p className="text-sm">Ways students can connect to the lesson</p>
            </div>
        </div>
    )
}

export default Connect;