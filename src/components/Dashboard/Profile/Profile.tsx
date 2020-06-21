import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

const Profile: React.FC = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 `}>
                {console.log(state.user)} :)
            </div>
        </div>
    )
}

export default Profile;