import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { NavLink } from 'react-router-dom';

interface PageHeaderBarProps {
    links?: {
        path: string
        name: string
    }[]
}

const PageHeaderBar = ({links}: PageHeaderBarProps) => {
    const { theme, lightSwitch } = useContext(ThemeContext);

    return (
        <div className={`w-full h-12 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-between`}>
            <div className={`w-2/12 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/">
                    SELReady
                </NavLink>
            </div>
            <div>
                {
                    links ? links.map((link, key) => (
                        <NavLink to={link.path} key={key} >
                            {link.name}
                        </NavLink>
                    )) : null
                }
            </div>
            <button className={`w-1/12 h-full flex justify-center items-center text-lg`} onClick={lightSwitch}>
                Lights
            </button>
        </div>
    )
}

export default PageHeaderBar;