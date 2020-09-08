import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const BioBlock = () => {
    const { state, theme } = useContext(LessonContext);
    const artistBio = state.data.lesson.artist.bio

    const firstLetterFunction = (str: string) => {
        let arr = str.split('');
        arr.map((char, key) => {
            if (key === 0) {
                return <span>{char}</span>
            }
        })
    }


    return (

    <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col justify-center ${theme.block.text} text-base rounded-sm shadow-inner`}>
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text-lx rounded-sm shadow-inner`}>
            <h1 className="text-2xl font-extrabold mb-6 underline">Biography of the artist:</h1>
            <div className="overflow-scroll">
                {artistBio}
            </div>
        </div>

    </div>
    )
}

export default BioBlock;