import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

const DashboardHome: React.FC = () => {
    const { theme, state } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`test flex flex-col-reverse justify-end md:flex-row ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-80 rounded-sm p-8 `}>
                <div>
                Welcome, { state.user.firstName }
                </div>
                <div className="flex flex-col w-auto items-center">
                    <img className="w-auto md:w-56 mb-8 border border-dark-blue" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/schoollogos/aldine/thumbnail_LOGO_AVALOS_PRIMARY.png" alt="Aldine"/>
                </div>
            </div>

        </div>
    )
} 

export default DashboardHome;