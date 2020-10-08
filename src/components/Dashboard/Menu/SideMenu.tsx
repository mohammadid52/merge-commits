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
        <div className={`min-h-screen w-44 md:flex flex-row md:flex-col  ${theme.sidemenu.bg}`}>
            <div className={`hidden w-full h-12 ${theme.sidemenu.bg} md:flex justify-center items-center text-2xl font-bold z-50`}>
                <NavLink to="/dashboard">
                    <img className="h-6" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`sidebar w-full h-1/2 text-gray-200 cursor-pointer`}>
                { children }
            </div>
        </div>
    )
}


export default SideMenu;