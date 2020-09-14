import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Connect = (props: props) => {
    const {  fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
    const artistBio = state.data.lesson.artist.bio

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
            <h1 className={`${fullscreen ? 'text-2xl font-extrabold mb-4 underline' : 'text-base font-extrabold mb-3'}`}>SEL Connection:</h1>
            <div> 
            <p className={`${fullscreen ? 'text-base' : 'text-xs'} `}>This lesson explores the idea of self-identity, the characteristics, qualities, and abilities we choose to describe ourselves.  It is important in this lesson to remember that there are no judgments in how we see ourselves.  This week just think about all the things that make you who you are, and write about these things.</p>
            </div>
        </div>
    )
}

export default Connect;