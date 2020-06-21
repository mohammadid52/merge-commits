import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaMusic } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const BioBlock = () => {
    const { state, theme } = useContext(LessonContext);
    const artistBio = state.data.artist.bio

    const firstLetterFunction = (str: string) => {
        let arr = str.split('');
        arr.map((char, key) => {
            if (key === 0) {
                return <span>{char}</span>
            }
        })
    }


    return (
        <div className={`w-5/10 h-152 ${theme.block.bg} p-8 flex flex-col justify-start ${theme.block.text} text-sm rounded-sm ${theme.block.shadow} mt-3 mb-2 ml-4`}>
            <div className="w-full flex flex-row items-center border-b border-gray-700">
                {/* <IconContext.Provider value={{ color: '#EDF2F7', size: '1.5rem'}}>
                    <div className="bg-dark-red h-12 w-12 flex flex-col items-center justify-center z-20 rounded-sm shadow-2 mr-8">
                        <FaMusic />
                    </div>
                </IconContext.Provider> */}
                <h1 className="text-5xl font-open font-bold"> 
                    About the artist
                </h1>
            </div>
            <div className="text-base overflow-scroll my-4 p-2">
                { artistBio.map((line: string, key: number) => (
                    <p className="mb-2" key={key}>
                        {line}
                    </p>
                )) }
            </div>
        </div>
    )
}

export default BioBlock;