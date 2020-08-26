import React, { useContext, useState } from 'react';
import Keyword from './Keyword';
import BioBlock from './BioBLock';
import Connect from './Connect';
import { IconContext } from "react-icons";
import { FaLink } from 'react-icons/fa';
import { MdVpnKey } from 'react-icons/md';
import { BsPersonSquare } from 'react-icons/bs';
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

    <div className={`relative md:w-full md:h-full ${theme.block.bg} flex justify-start ${theme.block.text} rounded-lg ${theme.block.shadow} shadow-l-none text-sm `}>
    
            <div className="bg-dark w-1.3/10 h-full flex flex-col justify-between font-medium text-lg">
                <div onClick={() => setSelect('Bio')} className={`${ select === 'Bio' ? `${theme.block.bg} font-extrabold` : 'bg-darker-blue'} h-3.2/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                        <div className={`flex justify-center items-center`}>
                            <BsPersonSquare />
                        </div>
                    </IconContext.Provider>
                </div>
                <div onClick={() => setSelect('Keyword')} className={`${ select === 'Keyword' ? `${theme.block.bg} font-extrabold` : 'bg-darker-blue'} h-3.2/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                        <div className={`flex justify-center items-center`}>
                            <MdVpnKey />
                        </div>
                    </IconContext.Provider>
                </div>
                <div onClick={() => setSelect('Connect')} className={`${ select === 'Connect' ? `${theme.block.bg} font-extrabold` : 'bg-darker-blue'} h-3.2/10 pb-4 uppercase p-2 md:p-0 flex justify-end text-gray-400 text-md hover:text-gray-600 cursor-pointer`}>
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '3rem'}}>
                        <div className={`flex justify-center items-center`}>
                            <FaLink />
                        </div>
                    </IconContext.Provider>
                </div>
            </div>

            <div className={`p-8 rounded-lg`}>
                { select === 'Bio' ? <BioBlock /> : select === 'Keyword' ? <Keyword /> : select === 'Connect' ? <Connect /> : null}
            </div>

    </div>
    )
}

export default Block;