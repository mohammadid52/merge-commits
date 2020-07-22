import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

const DashboardHome: React.FC = () => {
    const { theme, state } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`test ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 `}>
                Welcome, { state.user.firstName }
            </div>
        </div>
    )
}

export default DashboardHome;