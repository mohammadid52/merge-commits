import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';

const Feedback = () => {

    return(
        <div className="bg-dark-blue w-full h-5/10 rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
            <h3 className="w-full text-xl text-gray-200 font-open font-bold border-b border-white mr-4 mb-4">
                Please give a feedback on the lesson. What did you like? What would you like to see changed?
            </h3>
            <div className="w-full h-8/10 flex flex-col justify-evenly text-gray-200">
                <p>Block of feedback questions</p>
            </div>
        </div>
    )
}

export default Feedback;
