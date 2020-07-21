import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { useHistory } from 'react-router-dom';


const Classroom: React.FC = () => {
    const history = useHistory();
    const { theme } = useContext(GlobalContext);

    const handleLink = () => {
        history.push('/lesson');
    }

    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 flex justify-end`}>
                <div className={`cursor-pointer h-8 w-24 bg-green-500 text-gray-200 font-open font-bold shadow-elem-light flex justify-center items-center`} onClick={handleLink}>
                    Start Lesson!
                </div>
            </div>
        </div>
    )
}

export default Classroom;