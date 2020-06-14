import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';

const ProfileLink: React.FC = () => {
    return (
        <NavLink to="/profile">
            <div className="w-full h-14 flex justify-between items-center border-t border-gray-200 py-4">
                <IconContext.Provider value={{ size: '2rem', color: 'white' }}>
                    <FaUserCircle />
                </IconContext.Provider>
                <div className="flex-grow h-full flex justify-center">
                    Profile
                </div>
            </div>
        </NavLink>
    )
}

export default ProfileLink;