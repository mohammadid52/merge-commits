import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonControlContext } from '../../../../contexts/LessonControlContext';

interface props {
        fullscreen: boolean
    }

const Keyword = (props: props) => {
    const {  fullscreen } = props;
    const { state, theme } = useContext(LessonControlContext);
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
        <div className={`md:w-full md:h-full ${theme.block.bg} flex flex-col ${theme.block.text} text rounded-sm shadow-inner`}>
            <h1 className={`${fullscreen ? 'text-2xl font-extrabold mb-4 underline' : 'text-base font-extrabold mb-3'}`}>Keywords we will cover in this lesson:</h1>
            <div>
            <p className="text-base"><span className="text-lg font-bold">Culture:</span> the customs, arts, social institutions, and achievements of a particular nation, people, or other social group.</p>
            <p className="text-base"><span className="text-lg font-bold">Dialects:</span> a particular form of a language which is peculiar to a specific region or social group.</p>
            <p className="text-base"><span className="text-lg font-bold">Ancestors:</span> a person, typically one more remote than a grandparent, from whom one is descended.</p>
            </div>
        </div>
    )
}

export default Keyword;