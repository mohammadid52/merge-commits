import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface SideMenuProps {
    children: React.ReactNode;
    [key: string]: any;
}

const SideMenu: React.FC = ({children, ...props}: SideMenuProps) => {
    const { theme } = useContext(GlobalContext);

    return (
        <div className={`sidebar w-2/12 h-full ${theme.toolbar.bg} text-gray-200 shadow-2 px-4 cursor-pointer`}>
            { children }
        </div>
    )
}


export default SideMenu;