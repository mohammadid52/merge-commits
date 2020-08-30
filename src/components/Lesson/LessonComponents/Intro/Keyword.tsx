import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Keyword = () => {
    const { state, theme } = useContext(LessonContext);
    // const artistBio = state.data.artist.bio

    // const firstLetterFunction = (str: string) => {
    //     let arr = str.split('');
    //     arr.map((char, key) => {
    //         if (key === 0) {
    //             return <span>{char}</span>
    //         }
    //     })
    // }


    return (
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text-lx rounded-sm shadow-inner`}>
            <h1 className="text-2xl font-extrabold mb-6 underline">Keywords we will cover in this lesson:</h1>
            <div>
            <p className="text-lg "><span className="text-lg font-bold">Culture:</span> the beliefs, social practices, and characteristics of a racial, religious, or social group </p>
            <p className="text-lg "><span className="text-lg font-bold">Identity:</span> all of those things by which a person or thing is known or is considered as being </p>
            <p className="text-lg "><span className="text-lg font-bold">Self-Awareness:</span> conscious knowledge of one's own personality, character, motives, and feelings </p>
            </div>
        </div>
    )
}

export default Keyword;