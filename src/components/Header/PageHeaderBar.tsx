import React, { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import { NavLink } from 'react-router-dom';

const PageHeaderBar = () => {
    const { theme, lightSwitch } = useContext(GlobalContext);

    return (
        <div className={`w-full h-12 ${theme.toolbar.bg} text-gray-200 shadow-2 flex justify-between`}>
            <div className={`w-2/12 h-full flex justify-center items-center text-2xl font-bold`}>
                <NavLink to="/">
                    SELReady
                </NavLink>
            </div>
            <button className={`w-1/12 h-full flex justify-center items-center text-lg`} onClick={lightSwitch}>
                Lights
            </button>
        </div>
    )
}

export default PageHeaderBar;