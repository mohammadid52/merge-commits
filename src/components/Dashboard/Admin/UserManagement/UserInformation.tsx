import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import * as queries from '../../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import { UserInfo } from './User';
import UserStatus from './UserStatus';
import UserRole from './UserRole';

interface UserInfoProps {
    user: UserInfo
    status: string
}

const UserInformation = (props: UserInfoProps) => {
    const { user, status } = props;
    const match = useRouteMatch();
    const history = useHistory();
    const location = useLocation();
    const queryParams = queryString.parse(location.search);

    
    let created = () => {
        let date = new Date(user.createdAt);
        return (
            (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()
        )
        }

    
    if ( status !== 'done') {
        return (
            <LessonLoading />
        )
        }
    {  
    return (

            <div className="w-full md:px-2 pt-2">
                <div className="w-full flex justify-end mb-4">
                    <span className="w-20 flex inline-flex rounded-md shadow-sm">
                        <button type="submit" onClick={history.goBack} className="
                        text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
                        inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                            Back
                        </button>
                    </span>
                </div>

                <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Personal Information
                        </h3>
                    </div>

                    <div className="px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Full Name 
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                {`${ user.firstName } ${ user.lastName }`} 
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Nickname
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                {`${ user.preferredName ? user.preferredName : 'not set' }`} 
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Role
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                    <UserRole 
                                        role= {user.role}/> 
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Status
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                    <UserStatus 
                                        status= {user.status}/>
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Birthday
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                {`${ user.birthdate ? user.birthdate : 'not set' }`}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Email Address
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                {`${ user.email }`} 
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Contact Number 
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                {`${ user.phone }`}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-base leading-5 font-medium text-gray-500">
                                Account Created
                                </dt>
                                <dd className="mt-2 text-base leading-5 text-gray-900">
                                    { created() }
                                </dd>
                            </div>
                        </dl>
                    </div>

                </div>

                <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Institution Information
                        </h3>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-lg leading-5 font-medium text-gray-500">
                                Institution
                                </dt>
                                <dd className="mt-2 text-lg leading-5 text-gray-900">
                                {`${ user.institution ? user.institution : 'not set'}`}
                                </dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-lg leading-5 font-medium text-gray-500">
                                Grade 
                                </dt>
                                <dd className="mt-2 text-lg leading-5 text-gray-900">
                                {`${ user.grade ? user.grade : 'not set'}`}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="px-4 pt-4 w-full flex justify-end">
                    <div className="flex w-32">
                        <span className="ml-3 inline-flex rounded-md shadow-sm">
                        {<NavLink to={`${match.url}/edit`}>
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                Edit
                            </button>
                        </NavLink>}
                        </span>
                    </div>
                </div>

            </div>
               


    )
}
}
export default UserInformation;