import React from 'react';
import { NavLink } from 'react-router-dom';

const ProfileLink: React.FC = () => {
    return (
        <div className="w-full h-12 border-t border-gray-200 py-4">
            <NavLink to="/classroom">
                Classroom
            </NavLink>
        </div>
    )
}

export default ProfileLink;