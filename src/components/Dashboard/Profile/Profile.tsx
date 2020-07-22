import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdSettings } from "react-icons/io";

const Profile: React.FC = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);

    const handleLink = () => {
        console.log('settings')
    }

    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`test profile ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 `}>
                <div className="w-full flex">
                    <div className={`w-40 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light mx-4`}>
                        <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
                            <FaUserCircle />
                        </IconContext.Provider>
                    </div>
                    <div className={`flex-grow flex px-4`}>
                        <div className={`text-3xl font-bold font-open text-gray-900 `}>
                        {`${ state.user.firstName } ${ state.user.lastName }`}
                        </div>

                    </div>
                    <button className="self-start" onClick={handleLink}>
                        <IconContext.Provider value={{ size: '2rem', color: '#4a5568' }}>
                            <IoMdSettings />
                        </IconContext.Provider>
                    </button>
                </div>
                {console.log(state.user)}
            </div>
        </div>
    )
}

export default Profile;