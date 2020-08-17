import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';


const UpcomingClass: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        history.push('/lesson');
    }

    return (
            <div className={`relative test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-2.5/10 rounded-sm flex flex-col mb-4`}>        
                <span style={{right: 0}}
                className="absolute right-0 mr-4 p-4 sm:h-8 bg-opacity-90 w-auto inline-flex items-center rounded-md text-sm sm:text-2xl font-bold leading-5 bg-red-100 text-red-800">
                Upcoming Lessons
                </span>
                  
                <div className="p-6">
                <div className="h-9/10 absolute flex items-center left-0">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-90 hover:bg-opacity-70 hover:shadow-gray hover:bg-gray-300 cursor-pointer flex justify-center items-center">
                        <div className="w-6 h-6 border-dark border-t-6 border-l-6 transform -rotate-45 ml-2"></div>
                    </div>
                </div>
                <div style={{right: 0}} className="h-9/10 w-auto mr-4 absolute flex items-center right-0">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-90 over:bg-opacity-70 hover:shadow-gray hover:bg-gray-300 cursor-pointer flex justify-center items-center">
                        <div className="w-6 h-6 border-dark border-t-6 border-r-6 transform rotate-45 mr-2"></div>
                    </div>
                </div>
                <h1 className={`bg-dark text-xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                    Where I'm From
                </h1>
                <div className={`flex flex-col pt-2 md:flex-row justify-around items-center`} style={{height: "95%"}}>
                    <div className={`block1 w-1/5 h-full flex flex-col items-center text-center`}>
                        <h2 className={`text-xl font-open font-bold mb-2`}>
                            Marlon Lizama
                        </h2>
                        <img className="w-24 shadow-elem-light" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/marlon.jpeg" alt="Marlon Lizama" />
                    </div>
                    <div className={`block2 w-1/2 h-full flex flex-col`}>
                        <h2 className={`text-lg font-bold font-open md:mb-2`}>
                            Lesson Description
                        </h2>
                        <p className="text-xs">
                            In this lesson, we'll be discussing heritage and culture in the context of stories and experiences passed down through the generations. We'll be analysing and reacting to a poem by our own Marlon Lizama, called 'Where I'm from'. In reponse, you'll have the opportunity to write and present your own poem too!
                        </p>
                    </div>
                    
                    <div className={`block3 w-2/10 h-full flex flex-col-reverse justify-end items-center my-4`}>

                        <div className={`w-full`}>
                            <div className={`flex my-1`} >
                                <div className="w-1/2">
                                    <IconContext.Provider value={{ size: '1rem' }}>
                                        <FaClock />
                                    </IconContext.Provider>
                                </div>
                                <div className={`w-1/2 mx-2 text-sm`}>
                                    45 min.
                                </div>
                            </div>
                            <div className={`flex my-1`} >
                                <div className="w-1/2">
                                    <IconContext.Provider value={{ size: '1rem' }}>
                                        <FaUserAlt />
                                    </IconContext.Provider>
                                </div>
                                <div className={`w-1/2 mx-2 text-sm`}>
                                    Marlon
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
    )
}

export default UpcomingClass;