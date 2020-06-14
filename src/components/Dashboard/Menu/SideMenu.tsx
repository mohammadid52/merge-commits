import React, { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface SideMenuProps {
    children: React.ReactNode;
    [key: string]: any;
}

const SideMenu: React.FC = ({children, ...props}: SideMenuProps) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className={`w-2/12 h-screen ${theme.toolbar.bg} text-gray-200 shadow-2 px-4 py-1`}>
            { children }
        </div>
    )
}


export default SideMenu;