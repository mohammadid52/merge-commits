import React, { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';

const Profile: React.FC = () => {
    const { theme } = useContext(ThemeContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 `}>
                This is your profile
            </div>
        </div>
    )
}

export default Profile;