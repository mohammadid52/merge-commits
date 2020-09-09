import React, { useContext } from 'react';
import { IconContext } from "react-icons";
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { LessonContext } from '../../../../contexts/LessonContext';

const Feedback = () => {

    return(
        <div className="bg-dark-blue w-full h-4.8/10 flex flex-col justify-between rounded-lg shadow-2 text-gray-200 p-4">
            <div className="h-2/10 w-full flex justify-between items-center">
                <div className="w-6/10 text-xl text-gray-200 font-open font-bold">
                    What did you think about the lesson?
                </div>
                <div className="w-4/10 flex justify-center items-center">
                    <div className="cursor-pointer w-3/10"> 
                        <IconContext.Provider value={{ color: '#519c51', size: '2rem'}}>
                            <FaThumbsUp />
                        </IconContext.Provider>
                    </div>
                    <div className="cursor-pointer w-3/10">
                        <IconContext.Provider value={{ color: '#e62626d1', size: '2rem'}}>
                            <FaThumbsDown />
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
            <div className="h-8/10 w-full">
                <div className="h-2/10 w-full text-lg text-gray-200">
                    Do you have any comments?
                </div>
                <textarea id="text" className="h-8/10 bg-gray-300 w-full p-2 text-md text-gray-800 rounded-lg shadow-2" 
                // value={editInput.text} onChange={handleChange}
                />
            </div>

        </div>
    )
}

export default Feedback;
