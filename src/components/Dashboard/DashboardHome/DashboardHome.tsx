import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaPencilRuler } from 'react-icons/fa';
import { BsFillChatFill, BsCalendarFill, BsFillGrid1X2Fill } from 'react-icons/bs'
import { MdClass } from 'react-icons/md'

const DashboardHome: React.FC = () => {
    const { theme, state } = useContext(GlobalContext);
    return (
        <div className={`w-full h-full flex flex-col p-8`}>
            <div className={`w-full h-4/10 flex`}>
                <div className={`flex flex-col justify-center items-center w-2/3 h-full rounded-lg mx-2`}>
                    <h3 className="w-full h-20 text-2xl text-center bg-white shadow-elem-light rounded-lg mb-2"> Welcome, { state.user.firstName } </h3>
                    <div className="w-full h-full rounded-lg flex flex-row">
                        <div className="w-1/2 flex flex-col mr-2 justify-between">
                            <div className="w-full flex">
                                <div className="h-28 w-28 bg-white shadow-elem-light mb-2 mr-2 rounded-lg flex-col justify-center items-center p-4">
                                    <IconContext.Provider value={{ size: '3rem', color: '#1C2C42' }}>
                                        <BsFillChatFill />
                                    </IconContext.Provider>
                                    <p className="text-lg text-center mt-2">Chat</p>
                                </div>
                                <div className="h-28 w-28 bg-white shadow-elem-light mb-2 mx-2 rounded-lg flex-col justify-center items-center p-4">
                                    <IconContext.Provider value={{ size: '3rem', color: '#1C2C42' }}>
                                        <MdClass />
                                    </IconContext.Provider>
                                    <p className="text-lg text-center mt-2">Journal</p>
                                </div>
                            </div>
                            <div className="w-full flex">
                                <div className="h-28 w-28 bg-white shadow-elem-light mr-2 rounded-lg flex-col justify-center items-center p-4">
                                    <IconContext.Provider value={{ size: '3rem', color: '#1C2C42' }}>
                                        <BsCalendarFill />
                                    </IconContext.Provider>
                                    <p className="text-lg text-center mt-2">Calendar</p>
                                </div>
                                <div className="h-28 w-28 bg-white shadow-elem-light mx-2 rounded-lg flex-col justify-center items-center p-4">
                                    <IconContext.Provider value={{ size: '3rem', color: '#1C2C42' }}>
                                        <BsFillGrid1X2Fill />
                                    </IconContext.Provider>
                                    <p className="text-lg text-center mt-2">Wall</p>
                                </div>
                            </div>
                        
                        </div>
                            <div className="flex-grow h-full bg-white shadow-elem-light text-2xl text-center rounded-lg ml-2 p-4 flex flex-col content-center">    
                                <NavLink to="/dashboard/classroom">
                                    <p className="mb-4">Click here to check out the classroom</p>
                                    <IconContext.Provider value={{ size: '4rem', color: '#1C2C42' }}>
                                        <FaPencilRuler />
                                    </IconContext.Provider>
                                </NavLink>
                            </div>
                    </div>
                </div>
                <div className={`flex h-full w-1/3 items-center bg-white ${theme.elem.text} ${theme.elem.shadow} rounded-lg p-4 mx-2`}>
                    <a href="https://avaloshs.aldineisd.org/" target="_blank">
                        <img className="w-auto border border-dark-blue shadow-elem-light" src="https://zoiqclients.s3.amazonaws.com/IconoclastArtist/schoollogos/aldine/thumbnail_LOGO_AVALOS_PRIMARY.png" alt="Aldine"/>
                    </a>

                </div>
            </div>
        </div>
    )
} 

export default DashboardHome;