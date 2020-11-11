import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';

import {LinkProps} from './Links';

interface SideMenuProps {
    children: React.ReactNode;
    [key: string]: any;
    // linkProps: LinkProps;
}

const SideMenu: React.FC<SideMenuProps> = ({children, ...props}: SideMenuProps) => {
    const { theme } = useContext(GlobalContext);

    const handleLink = (e: any) => {
        const id = e.target.id.toLowerCase();
        props.setCurrentPage(id);
      };

    return (
        <div className={`z-50 min-h-screen w-44 md:flex flex-row md:flex-col  ${theme.sidemenu.bg}`}>
            <div className={`hidden w-full h-12 ${theme.sidemenu.bg} md:flex justify-center items-center text-2xl font-bold z-50`}>
                <NavLink id="dashboard" to="/dashboard" onClick={handleLink}>
                    <img id="dashboard" className="h-6" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/logo_white.svg" alt="Iconoclast Artists"/>
                </NavLink>
            </div>
            <div className={`sidebar w-full h-1/2 text-gray-200 cursor-pointer`}>
                { children }
            </div>
        </div>
    )
}


export default SideMenu;