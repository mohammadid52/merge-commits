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
        <div className={`min-h-screen w-0 md:w-2/12 md:flex flex-row md:flex-col`}>
            <div className={`hidden w-full h-12 ${theme.toolbar.bg} md:flex justify-center items-center text-2xl font-bold z-50`}>
                <NavLink to="/dashboard">
                    <img className="h-6" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`sidebar w-full h-full ${theme.toolbar.bg} text-gray-200 shadow-2 px-4 cursor-pointer`}>
                { children }
            </div>
        </div>
    )
}


export default SideMenu;