import React, { useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { IconContext } from 'react-icons'
import { FaTrophy } from 'react-icons/fa'

interface OutroTextProps {
    text?: string;
}

const OutroText = (props: OutroTextProps) => {
    const { state, theme } = useContext(LessonContext);
    const { text } = props; 
    

    return (
         <div className={`h-full w-full flex justify-center items-center`}>
            <div className="w-8.5/10 md:h-8/10 flex flex-col justify-between items-center ">
                <div className="h-1.3/10 w-full flex flex-row justify-center items-center"> 
                    <IconContext.Provider value={{ color: '#EDF2F7', size: '2rem'}}>
                        <div className="h-full bg-dark-red h-16 w-16 flex flex-col items-center justify-center z-20 rounded-lg shadow-2">
                            <FaTrophy />
                        </div>
                    </IconContext.Provider>
                    <div className={`h-full w-full flex flex-row justify-center items-center text-5xl text-center font-open font-medium ${theme.block.text} z-10`}>
                        Thank you!
                    </div>
                </div>
                <div className={`h-8.5/10 w-full scrolling-touch overflow-x-scroll overflow-y-scroll md:overflow-auto bg-dark-blue shadow-elem-dark rounded-lg p-4 md:p-8`}>
                    { text ? text : 
                        <div className={`text-gray-200`}>
                            Thanks for taking the survey!
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default OutroText;