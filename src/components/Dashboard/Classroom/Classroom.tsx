import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { Link } from 'react-router-dom';


const Classroom: React.FC = () => {
    const { theme } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 flex justify-end`}>
                <Link to="lesson" >
                    <div className={`h-8 w-24 bg-green-500 text-gray-200 font-open font-bold shadow-elem-light flex justify-center items-center`}>
                        Start Lesson!
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Classroom;