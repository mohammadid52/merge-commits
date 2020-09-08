import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import * as queries from '../../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import UserInformation from './UserInformation';
import UserEdit from './UserEdit';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import { 
    Switch, 
    Route,
    useRouteMatch,
    Link,
    NavLink
} from 'react-router-dom';

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


const User = () => {
    const match = useRouteMatch();
    const { theme, state, dispatch } = useContext(GlobalContext);
    const [status, setStatus] = useState('');
    const [ user, setUser ] = useState<UserInfo>(
        {
            id: '',
            authId: '',
            courses: null,
            createdAt: '',
            email: '',
            externalId: null,
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
    const location = useLocation();
    const queryParams = queryString.parse(location.search)
    
    async function getUserById(id: string) {
        try {
            const result: any = await API.graphql(graphqlOperation(queries.userById, { id: id }))
            const userData = result.data.userById.items.pop();
            setStatus('done');
            setUser(() => {
                if ( typeof userData === 'object') {
                    return userData
                }
                return user
            });
            
        } catch (error) {
            console.error(error);  
        }
    }

    useEffect(() => {
        let id = queryParams.id;
        if ( typeof id === 'string') {
            getUserById(id);
            
        }
    }, [])

    // const language = () => {
    //     if (user.language === 'EN') {
    //         return 'English'
    //     } else if (user.language === 'ES') {
    //         return 'Spanish'
    //     }

    // }

    if ( status !== 'done') {
        return (
            <LessonLoading />
        )
    }
{ 
    return (
            <div className={`w-9/10 h-full`}>
                <div className={`w-full h-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
                    <div className="h-9/10 flex flex-col md:flex-row">
                        <div className="w-auto p-4 flex flex-col text-center items-center">
                            <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                                <IconContext.Provider value={{ size: '8rem', color: '#4a5568' }}>
                                    <FaUserCircle />
                                </IconContext.Provider>
                            </div>
                            <div className={`text-lg md:text-3xl font-bold font-open text-gray-900 mt-4`}>
                                {`${ user.preferredName ? user.preferredName : user.firstName } ${ user.lastName }`}
                                <p className="text-md md:text-lg">
                                {`${ user.institution ? user.institution : '' }`}
                                </p>
                            </div>
                        </div>

                        <Switch>
                            <Route 
                                path={`${match.url}/edit`}
                                render={() => (
                                    <UserEdit 
                                        user={user}
                                        status = {status}
                                        setStatus = {setStatus}
                                        getUserById = {getUserById}
                                    />  
                                )} 
                            />
                            <Route 
                                path={`${match.url}/`}
                                render={() => (
                                    <UserInformation 
                                        user={user}
                                        status = {status} 
                                        />
                                 )}
                            />
                        </Switch>


                    </div>

                </div>
            </div>

    )
}
}

export default User;