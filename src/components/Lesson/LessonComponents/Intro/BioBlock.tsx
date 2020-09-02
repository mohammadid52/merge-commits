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
                {/* <p className="text-lg "><span className="font-bold">Birth Place:</span> El Salvador</p>
                <p className="text-lg "><span className="font-bold">Grew Up In:</span> Puerto Rico</p>
                <p className="text-lg "><span className="font-bold">Family Background:</span> Parents are married. Youngest.  Has 2 brothers and 1 sister</p>
                <p className="text-lg "><span className="font-bold">Interesting Fact:</span> Marlon is on the committee to decided how medals will be awarded in Hip Hop in the upcoming Tokyo Olympics</p> */}
            </div>
        </div>

    </div>
    )
}

export default BioBlock;