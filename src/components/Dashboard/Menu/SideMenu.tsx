import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface SideMenuProps {
    children: React.ReactNode;
    [key: string]: any;
}

const SideMenu: React.FC = ({children, ...props}: SideMenuProps) => {
    const { theme } = useContext(GlobalContext);

    return (
        <div className={`sidebar w-2/12 h-full ${theme.toolbar.bg} text-gray-200 shadow-2 px-4 cursor-pointer`}>
            <div className={`w-full h-12 flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/dashboard">
                    <img className="h-6" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            { children }
        </div>
    )
}


export default SideMenu;