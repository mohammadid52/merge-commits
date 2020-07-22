import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';
import { IconContext } from "react-icons";
import { FaClock, FaUserAlt } from 'react-icons/fa';


const Classroom: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        history.push('/lesson');
    }

    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 flex flex-col`}>
                <h1 className={`bg-dark text-4xl text-gray-200 font-bold font-open px-8 shadow-elem-light`}>
                    Where I'm From
                </h1>
                <div className={`flex justify-around`}>
                    <div className={`w-1/3 h-full flex flex-col items-center mt-4`}>
                        <h2 className={`text-3xl font-open font-bold mb-4`}>
                            Marlon Lizama
                        </h2>
                        <img className="w-40 shadow-elem-light" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/marlon.jpeg" alt="Marlon Lizama" />
                    </div>
                    <div className={`w-1/2 h-full flex flex-col mx-8 mt-8`}>
                        <h2 className={`text-xl font-bold font-open mb-4`}>
                            Lesson Description
                        </h2>
                        <p>
                            In this lesson, we'll be discussing heritage and culture in the context of stories and experiences passed down through the generations. We'll be analysing and reacting to a poem by our own Marlon Lizama, called 'Where I'm from'. In reponse, you'll have the opportunity to write and present your own poem too!
                        </p>
                    </div>
                    
                    <div className={`w-2/10 h-full flex flex-col items-center my-4`}>
                        <div className={`cursor-pointer h-8 w-24 bg-green-500 text-gray-200 font-open font-bold shadow-elem-light flex justify-center items-center my-4`} onClick={handleLink}>
                            Start Lesson!
                        </div>
                        <div className={`flex h-12 my-2`} >
    
                        </div>
                        <div className={`flex my-2 justify-center`} >
                            <IconContext.Provider value={{ size: '1.5rem' }}>
                                <FaClock />
                            </IconContext.Provider>
                            <div className={`mx-4`}>
                                45 min.
                            </div>
                        </div>
                        <div className={`flex my-2 justify-center`} >
                            <IconContext.Provider value={{ size: '1.5rem' }}>
                                <FaUserAlt />
                            </IconContext.Provider>
                            <div className={`mx-4`}>
                                Marlon
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Classroom;