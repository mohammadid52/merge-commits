import React, { useContext, useState } from 'react';
import Keyword from './Keyword';
import BioBlock from './BioBLock';
import Ties from './Ties';
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
    const [select, setSelect] = useState('Bio');


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

    <div className={`relative md:w-full md:h-full ${theme.block.bg} flex justify-start ${theme.block.text} text-sm rounded-lg ${theme.block.shadow}`}>
    
            <div className="bg-dark w-2/10 h-full flex flex-col justify-between font-medium text-lg">
                <div onClick={() => setSelect('Bio')} className={`${ select === 'Bio' ? `${theme.block.bg} font-extrabold` : 'border-4 border-blue-900 '} h-3/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    Bio
                </div>
                <div onClick={() => setSelect('Keyword')} className={`${ select === 'Keyword' ? `${theme.block.bg} font-extrabold` : 'border-4 border-blue-900 '} h-3/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    Keywords
                </div>
                <div onClick={() => setSelect('Ties')} className={`${ select === 'Ties' ? `${theme.block.bg} font-extrabold` : 'border-4 border-blue-900 '} h-3/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    Ties
                </div>
            </div>

            <div className="p-8">
                { select === 'Bio' ? <BioBlock /> : select === 'Keyword' ? <Keyword /> : select === 'Ties' ? <Ties /> : null}
            </div>

    </div>
    )
}

export default Block;