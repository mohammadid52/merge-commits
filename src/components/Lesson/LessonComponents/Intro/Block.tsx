import React, { useContext, useState } from 'react';
import Keyword from './Keyword';
import BioBlock from './BioBLock';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';
import { 
    Switch, 
    Route,
    useRouteMatch,
    Link,
    NavLink
 } from 'react-router-dom';
 


const Block = () => {
    const { state, theme } = useContext(LessonContext);
    const artistBio = state.data.artist.bio
    const match = useRouteMatch();
    const [bio, setBio] = useState(true);
    const [concept, setConcept] = useState(false);
    const [select, setSelect] = useState(bio);


    const handleClick = () => {
        setBio(!bio)
        console.log(bio, 'bio');
    }

    const firstLetterFunction = (str: string) => {
        let arr = str.split('');
        arr.map((char, key) => {
            if (key === 0) {
                return <span>{char}</span>
            }
        })
    }



    return (

    <div className={`relative md:w-full md:h-full ${theme.block.bg} p-2 md:p-8 flex justify-start ${theme.block.text} text-sm rounded-lg ${theme.block.shadow}`}>
    
            <div className="absolute w-4/10 h-auto pl-6 pt-4 top-0 left-0 flex justify-between font-medium text-lg" style={{top: 0, left: 0}}>
                
                <div onClick={() => setBio(!bio)} className={`${select === bio ? 'text-gray-600': 'text-gray-400'} w-4.5/10 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    Bio
                </div>
                <div onClick={() => setBio(!bio)} className={`${select === bio ? 'text-gray-400': 'text-gray-600'} w-4.5/10 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    Concept
                </div>
                
            </div>
            <div>
                { select === bio ? <BioBlock /> : <Keyword /> }
            </div>

    </div>
    )
}

export default Block;