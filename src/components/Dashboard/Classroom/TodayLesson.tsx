import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';
import ToolTip from '../../General/ToolTip/ToolTip';

interface ClassProps {
        link: string,
        display?: boolean,
        curriculum: CurriculumInfo
    }


const Today: React.FC<ClassProps> = (props: ClassProps) => {
    const { link, curriculum, display } = props
    const [ accessible, setAccessible ] = useState<boolean>(true);
    const history = useHistory();
    const { theme } = useContext(GlobalContext);


    const handleLink = () => {
        // come back to this later
        if ( accessible ) { history.push(link); }
    }

    useEffect(() => {
        if ( display ) {
            setAccessible(false)
        }

        if ( !display ) {
            setAccessible(true)
        }

    }, [props])

    return (
            <div className={`relative bg-white rounded-xl shadow-container ${theme.elem.text}  w-full h-auto flex mb-16`}>
                
                <div className={`w-2.5/10 bg-dark rounded-tl-xl rounded-bl-xl`}>
                    <div className="h-6/10 flex justify-center items-center">
                        <img className=" w-32 rounded-full " src={`${curriculum && curriculum.artist.images ? curriculum.artist.images : null}`} alt={`${curriculum && curriculum.artist.name ? curriculum.artist.name : ''}`} />
                    </div>
                    <div className="h-1/10 pl-6">
                        <div className="tracking-widest border-b text-gray-300 border-ketchup">
                            FEATURED ARTIST
                        </div>
                    </div>
                    <div className="h-3/10 flex flex-row-reverse">
                        <h2 className={`first w-6/10 text-4xl font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
                            <p>{ curriculum && curriculum.artist.name ? curriculum.artist.name : null }</p>
                        </h2>
                    </div>
                </div>
                <div className="w-7.5/10 flex flex-col ">
                    <div className="h-8.7/10 px-12 py-4 flex flex-col justify-center items-center">
                        <h1 className="text-xl flex justify-center">
                            <p className="w-auto text-black border-b border-ketchup font-light">Today's Lesson</p>
                        </h1>
                        <h1 className={`text-4xl text-black font-open px-8 text-center`}>
                            { curriculum && curriculum.title ? curriculum.title : null }
                        </h1>
                        <p className="text-md text-center">
                            { curriculum && curriculum.summary ? curriculum.summary : null }
                        </p>
                        <div className="flex w-3/10">
                            <span className="mt-4 inline-flex rounded-full shadow-md">
                                <button type="submit" onClick={handleLink} className={`${ accessible ? 'bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white' : 'bg-gray-500 text-gray-700 cursor-default' }
                                tracking-wider 
                                inline-flex justify-center py-2 px-2 border border-transparent leading-5 font-medium rounded-full focus:outline-none transition duration-150 ease-in-out`}>
                                    START LESSON
                                </button>
                            </span>
                        </div>

                    </div>
                    <div className={`h-1.3/10 bg-dark flex justify-between rounded-br-xl`}>
                        <div className={`flex justify-center items-center my-2 w-3/10 text-gray-300`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'}}}>
                                    <FaClock />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-300`}>
                                45 min.
                            </div>
                        </div>
                        <div className={`flex justify-center items-center my-2 w-3/10`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'} }}>
                                    <FaUserAlt />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-200`}>
                                Marlon
                            </div>
                        </div>
                    </div>
                </div>
                {/* <span style={{left: '50%', top: -20, transform: 'translateX(-50%)', textShadow:'1px 1px 2px #000000'}}
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

                        <div className={`w-full`}>
                            <div className={`hidden justify-center mb-4 text-center`} >
                                <div className="w-1/3">
                                    <ProgressRing
                                        radius={24} 
                                        stroke={3}
                                        progress={80}
                                    />
                                </div>
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
                </div> */}
    </div>
  );
};

export default Today;
