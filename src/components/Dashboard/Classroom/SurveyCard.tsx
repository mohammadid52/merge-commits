import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { FaClock, FaUserAlt } from 'react-icons/fa';
import ProgressRing from './ProgressRing';
import { CurriculumInfo } from './Classroom';

interface ClassProps {
        link: string,
        curriculum: CurriculumInfo
    }


const SurveyCard: React.FC<ClassProps> = (props: ClassProps) => {
    const {link, curriculum} = props
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        // come back to this later
        history.push(link);
    }

    return (
            <div className={`relative bg-white rounded-xl shadow-container ${theme.elem.text} w-64rem h-auto flex mb-8`}>
                
                <div className={`w-2.5/10 bg-dark rounded-tl-xl rounded-bl-xl`}>
                    <div className="h-6/10 flex justify-center items-center">
                        {/* <img className=" w-32 rounded-full " src={`${curriculum && curriculum.artist.images ? curriculum.artist.images : null}`} alt={`${curriculum && curriculum.artist.name ? curriculum.artist.name : ''}`} /> */}
                    </div>
                    <div className="h-1/10 pl-6">
                        <div className="tracking-widest border-b text-gray-300 border-ketchup">
                            BEFORE WE BEGIN
                        </div>
                    </div>
                    <div className="h-3/10 flex flex-row-reverse">
                        <h2 className={`first w-6/10 text-2xl font-open leading-8 font-medium tracking-widest mb-4 text-gray-200`}>
                            <p> Survey </p>
                        </h2>
                    </div>
                </div>
                <div className="w-7.5/10 flex flex-col ">
                    <div className="h-8.7/10 p-4 flex flex-col justify-center items-center">
                        <h1 className={`text-2xl text-black font-open text-left`}>
                            On-boarding Survey
                        </h1>
                        <p className="text-md text-left">
                            This is a quick survey to see where you're at in terms of some of the topics we'll cover this semester. Please click the button below and answer each of the questions to the best of your ability. We appreciate your time in completing this survey, and we're excited to get started on this Iconoclast journey with you!
                        </p>
                        {/* <div className="flex w-3/10">
                            <span className="mt-4 inline-flex rounded-full shadow-md">
                                <button type="submit" onClick={handleLink} className="
                                tracking-wider text-white bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500
                                inline-flex justify-center py-2 px-2 border border-transparent leading-5 font-medium rounded-full focus:outline-none transition duration-150 ease-in-out">
                                    START SURVEY
                                </button>
                            </span>
                        </div> */}

                    </div>
                    <div className={`h-2/10 bg-dark flex justify-between rounded-br-xl`}>
                        <div className={`flex justify-center items-center my-2 w-3/10 text-gray-300`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'}}}>
                                    <FaClock />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-300`}>
                                15 min.
                            </div>
                        </div>
                        <div className={`flex justify-center items-center my-2 w-3/10`} >
                            <div className="w-auto text-gray-300">
                                <IconContext.Provider value={{ size: '1.5rem', style: {width: 'auto'} }}>
                                    <FaUserAlt />
                                </IconContext.Provider>
                            </div>
                            <div className={`w-auto mx-4 text-gray-200`}>
                                Self
                            </div>
                        </div>
                        <div className="flex w-3/10">
                            
                                <button type="submit" onClick={handleLink} className={`bg-ketchup hover:bg-red-300 focus:border-red-700 focus:shadow-outline-red active:bg-red-500 text-white
                                w-full text-white rounded-br-xl focus:outline-none transition duration-150 ease-in-out`}>
                                    <span className='w-auto h-auto'>START SURVEY</span>
                                </button>
                            
                        </div>
                    </div>
                </div>
                
            </div>
    )
}

export default SurveyCard;