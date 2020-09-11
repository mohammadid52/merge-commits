import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const BioBlock = (props: props) => {
    const { theme, state } = useContext(LessonControlContext);
    const artistBio = state.data.lesson.artist.bio
    const {fullscreen} = props;

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
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} rounded-sm shadow-inner`}>
            <h1 className={`${fullscreen ? 'text-2xl font-extrabold mb-4 underline' : 'text-base font-extrabold mb-3'}`}>Biography of the artist:</h1>
            <div className={`${fullscreen ? 'text-base h-9/10' : 'text-xs h-full'} w-full flex-grow overflow-scroll`}>
                {artistBio}
            </div>
        </div> 

    </div>
    )
}

export default BioBlock;