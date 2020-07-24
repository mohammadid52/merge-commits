import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { GiExitDoor } from 'react-icons/gi';

const DashboardHome: React.FC = () => {
    const { theme, state } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`test flex flex-col-reverse justify-center items-center md:flex-row ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} w-full h-full rounded-sm p-8 `}>
                <div className="w-5/10 h-6/10 rounded-lg flex flex-col justify-around">
                    <div className="flex flex-col w-auto items-center">
                        <img className="w-auto md:w-56 border border-dark-blue shadow-elem-light" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/schoollogos/aldine/thumbnail_LOGO_AVALOS_PRIMARY.png" alt="Aldine"/>
                    </div>
                    <h3 className="text-4xl text-center"> Welcome, { state.user.firstName } </h3>
                    <div className="text-2xl text-center"> 
                        <NavLink to="/dashboard/classroom">
                            
                        click to get into the classroom!
                        <IconContext.Provider value={{ size: '5rem' }}>
                            <GiExitDoor />
                        </IconContext.Provider>
                        </NavLink>
                    </div>
                </div>

               
               
            </div>

        </div>
    )
} 

export default DashboardHome;