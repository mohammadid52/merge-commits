import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';

interface props {
        link: string
    }


const Class = (props: props) => {
    const {link} = props
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        // come back to this later
        history.push(link);
    }

    return (
            <div className={`test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-auto rounded-sm p-6 flex flex-col mb-8`}>
                <h1 className={`h-2.5/10 bg-dark text-4xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                    Where I'm From
                </h1>
                <div className={`h-7.5/10 flex flex-col md:flex-row justify-around items-center pt-4`}>
                    <div className={`block1 w-1/5 h-full flex flex-col items-center text-center`}>
                        <h2 className={`text-2xl font-open font-bold mb-4`}>
                            Marlon Lizama
                        </h2>
                        <img className="w-32 shadow-elem-light" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/marlon.jpeg" alt="Marlon Lizama" />
                    </div>
                    <div className={`block2 w-1/2 h-full flex flex-col`}>
                        <h2 className={`text-xl font-bold font-open md:mb-2`}>
                            Lesson Description
                        </h2>
                        <p className="text-md">
                            In this lesson, we'll be discussing heritage and culture in the context of stories and experiences passed down through the generations. We'll be analysing and reacting to a poem by our own Marlon Lizama, called 'Where I'm from'. In reponse, you'll have the opportunity to write and present your own poem too!
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

export default Class;