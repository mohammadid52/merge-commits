import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import ProfileInfo from './ProfileInfo';
import AboutMe from './AboutMe';
import ProfileVault from './ProfileVault';
import ProfileEdit from './ProfileEdit';
import Dropdown from './Dropdown';
import { 
    Switch, 
    Route,
    useRouteMatch,
    Link,
    NavLink
 } from 'react-router-dom';

const Profile: React.FC = () => {

    const style = {
        height: '80vh'
    }
    
    const { theme, state, dispatch } = useContext(GlobalContext);

    const match = useRouteMatch();

    return (
        <div className="w-full h-full flex items-center justify-center">
        <div className={`w-9/10 h-full main_container`}>
            <div className={`w-full h-full white_back ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
                
                <div className="flex">
                    <Dropdown />
                </div>

                <div className="h-9/10 flex flex-col md:flex-row">
                    <div className="w-auto p-4 flex flex-col text-center items-center">
                        <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                            <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
                                <FaUserCircle />
                            </IconContext.Provider>
                        </div>
                        <div className={`text-lg md:text-3xl font-bold font-open text-gray-900 `}>
                            {`${ state.user.firstName } ${ state.user.lastName }`} 
                            <p className="text-md md:text-lg">{`${state.user.preferredName ? state.user.preferredName : '' }`}</p>
                            <p className="text-md md:text-lg">Santa Clara High School</p>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-9/10 md:w-6/10 h-8 pl-6 flex justify-between">
                            <div className={`w-1/3 uppercase p-2 md:p-0 flex justify-center items-center ${theme.toolbar.bg} text-gray-200 shadow-2 rounded-lg text-center text-xs md:text-md`}>
                                <NavLink to={`${match.url}`}>
                                My Profile
                                </NavLink>
                            </div>
                            
                            <div className={`w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                                <NavLink to={`${match.url}/about`}>
                                Questionnaire  
                                </NavLink>
                            </div>

                            <div className={`w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                                <NavLink to={`${match.url}/vault`}>
                                Vault  
                                </NavLink>
                            </div>
                            
                        </div>
                        <Switch>
                            <Route 
                                exact
                                path={`${match.url}/`}
                                render={() => (
                                    <ProfileInfo />
                                )}
                            />
                            <Route 
                                path={`${match.url}/about`}
                                render={() => (
                                    <AboutMe />  
                                )} 
                            />
                              <Route 
                                path={`${match.url}/edit`}
                                render={() => (
                                    <ProfileEdit />  
                                )} 
                            />
                              <Route 
                                path={`${match.url}/vault`}
                                render={() => (
                                    <ProfileVault />  
                                )} 
                            />
                        </Switch>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default Profile;