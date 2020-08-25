import React, { useContext, useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../graphql/queries';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import ProfileInfo from './ProfileInfo';
import AboutMe from './AboutMe';
import ProfileVault from './ProfileVault';
import ProfileEdit from './ProfileEdit';
import { 
    Switch, 
    Route,
    useRouteMatch,
    Link,
    NavLink
 } from 'react-router-dom';
 import LessonLoading from '../../Lesson/Loading/LessonLoading';
 export interface UserInfo {
    authId: string
    courses?: string
    createdAt: string
    email: string
    externalId?: string
    firstName: string
    grade?: string
    id: string
    image?: string
    institution?: string
    language: string
    lastName: string
    preferredName?: string
    role: string
    status: string
    phone: string
    updatedAt: string
    birthdate?: string
}

const Profile: React.FC = () => {

    const [person, setPerson] = useState<UserInfo>(
        {
            id: '',
            authId: '',
            courses: '',
            createdAt: '',
            email: '',
            externalId: '',
            firstName: '',
            grade: null,
            image: null,
            institution: null,
            language: '',
            lastName: '',
            preferredName: null,
            role: '',
            status: '',
            phone: '',
            updatedAt: '',
            birthdate: null,
        }
    );

    const match = useRouteMatch();
    const {state, theme} = useContext(GlobalContext);
    const [status, setStatus] = useState('');
    const [select, setSelect] = useState('Profile');

    async function getUser() {
        try {
            const user: any = await API.graphql(graphqlOperation(queries.getPerson, { email: state.user.email, authId: state.user.authId }))
            setPerson(user.data.getPerson);
            setStatus('done');
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    
    if ( status !== 'done') {
            return (
                <LessonLoading />
            )
        }
    { 
    return (
        <div className="w-full h-9.28/10 md:h-full flex items-center justify-center">
            <div className={`w-9/10 h-full main_container`}>
                <div className={`w-full h-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
                    
                    <div className="h-9/10 flex flex-col md:flex-row">
                        
                        <div className="w-auto p-4 flex flex-col text-center items-center">
                            <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                                <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
                                    <FaUserCircle />
                                </IconContext.Provider>
                            </div>
                            <div className={`text-lg md:text-3xl font-bold font-open text-gray-900 mt-4`}>
                                {`${ person.preferredName ? person.preferredName : person.firstName } ${ person.lastName }`} 
                                <p className="text-md md:text-lg">{person.institution}</p>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="w-9/10 md:w-6/10 h-8 pl-6 flex justify-between">
                                <div onClick={() => setSelect('Profile')} className={` ${ select === 'Profile' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                                    <NavLink to={`${match.url}`}>
                                    My Profile
                                    </NavLink>
                                </div>
                                
                                <div onClick={() => setSelect('AboutMe')}className={` ${ select === 'AboutMe' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                                    <NavLink to={`${match.url}/about`}>
                                    Questionnaire  
                                    </NavLink>
                                </div>

                                <div onClick={() => setSelect('Vault')}className={` ${ select === 'Vault' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
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
                                        <ProfileInfo 
                                            user = {person}
                                            status = {status}
                                        />
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
                                        <ProfileEdit 
                                            user = {person}
                                            status = {status}
                                            setStatus = {setStatus}
                                            getUser = {getUser}
                                        />  
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
}


export default Profile;