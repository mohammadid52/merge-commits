import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';

interface ClassProps {
        link: string,
        curriculum: CurriculumInfo
    }


const Today: React.FC<ClassProps> = (props: ClassProps) => {
    const {link, curriculum} = props
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        // come back to this later
        history.push(link);
    }

    return (
            <div className={`relative test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-auto rounded-sm p-6 flex flex-col mb-8 mt-4`}>
                <span style={{left: '50%', top: -20, transform: 'translateX(-50%)', textShadow:'1px 1px 2px #000000'}}
                    className="absolute p-5 sm:h-8 w-64 flex justify-center items-center text-center rounded-md text-sm sm:text-2xl font-bold leading-5 bg-ketchup text-white bg-opacity-90">
                    Today's Lesson
                </span>
                <h1 className={`h-2/10 bg-dark text-4xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                    { curriculum && curriculum.title ? curriculum.title : null }
                </h1>
                <div className={`h-7.5/10 flex flex-col md:flex-row justify-around items-center pt-8 overflow-scroll md:overflow-auto`}>
                    <div className={`block1 w-1/5 h-full flex flex-col items-center text-center`}>
                        <h2 className={`text-2xl font-open font-bold mb-4`}>
                            { curriculum && curriculum.artist.name ? curriculum.artist.name : null }
                        </h2>
                    <img className="w-32 shadow-elem-light" src={`${curriculum && curriculum.artist.images ? curriculum.artist.images : null}`} alt={`${curriculum && curriculum.artist.name ? curriculum.artist.name : ''}`} />
                    </div>
                    <div className={`block2 w-1/2 h-full flex flex-col`}>
                        <h2 className={`text-xl font-bold font-open md:mb-2`}>
                            Lesson Description
                        </h2>
                        <p className="text-md">
                            { curriculum && curriculum.summary ? curriculum.summary : null }
                        </p>
                    </div>
                    
                    <div className={`block3 w-2/10 h-full flex flex-col-reverse justify-end items-center`}>
                        <div className="flex w-7/10">
                            <span className="mt-4 inline-flex rounded-md shadow-md">
                                <button type="submit" onClick={handleLink} className="
                                text-gray-200 bg-green-500 hover:bg-green-300 focus:border-green-700 focus:shadow-outline-green active:bg-green-500
                                inline-flex justify-center py-2 px-2 border border-transparent text-s leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                                    Start Lesson!
                                </button>
                            </span>
                        </div>

                        {/* <div className="flex_column">
                            <div className={`flex mb-2 md:my-2 justify-between`} >
                                <IconContext.Provider value={{ size: '1.5rem' }}>
                                    <FaClock />
                                </IconContext.Provider>
                                <div className={`mx-4`}>
                                    45 min.
                                </div>
                            </div>
                            <div className={`flex mb-2 md:my-2 justify-center`} >
                                <IconContext.Provider value={{ size: '1.5rem' }}>
                                    <FaUserAlt />
                                </IconContext.Provider>
                                <div className={`mx-4`}> */}

                        <div className={`w-full`}>
                            <div className={`hidden justify-center mb-4 text-center`} >
                                <div className="w-1/3">
                                    <ProgressRing
                                        radius={24} 
                                        stroke={3}
                                        progress={80}
                                    />
                                </div>
                                {/* <div className={`w-1/2`}>
                                    75% complete
                                </div> */}
                            </div>
                            <div className={`flex my-2`} >
                                <div className="w-1/2">
                                    <IconContext.Provider value={{ size: '1.5rem' }}>
                                        <FaClock />
                                    </IconContext.Provider>
                                </div>
                                <div className={`w-1/2 mx-4`}>
                                    45 min.
                                </div>
                            </div>
                            <div className={`flex my-2`} >
                                <div className="w-1/2">
                                    <IconContext.Provider value={{ size: '1.5rem' }}>
                                        <FaUserAlt />
                                    </IconContext.Provider>
                                </div>
                                <div className={`w-1/2 mx-4`}>
                                    Marlon
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
    )
}

export default Today;