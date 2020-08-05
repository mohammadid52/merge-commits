import React, { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { IconContext } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import * as queries from '../../../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { NavLink, useRouteMatch } from 'react-router-dom';

const UserInformation = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);
    const match = useRouteMatch();
    let [ user, setUser ] = useState([]);
    const location = useLocation();
    const queryParams = queryString.parse(location.search)
    
    async function getUserById(id: string) {
        const data: any = await API.graphql(graphqlOperation(queries.userById, { id: id }))
        console.log('user', data.data.userById.items.pop())
    }

    useEffect(() => {
        let id = queryParams.id;
        // console.log(id);
        if ( typeof id === 'string') {
            getUserById(id);
        }
    }, [])

    // const language = () => {
    //     if (state.user.language === 'EN') {
    //         return 'English'
    //     } else if (state.user.language === 'ES') {
    //         return 'Spanish'
    //     }

    // }
    return (

            <div className="w-full md:p-6">

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Personal Information
                        </h3>
                    </div>
                <div className="px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Full Name
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        {/* {`${ state.user.firstName } ${ state.user.lastName }`}  */}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Nickname
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        {/* {`${ state.user.preferredName ? state.user.preferredName : 'not set' }`}  */}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Role
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        Admin
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Status
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        Active
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Birthday
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        06/01/1991
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Language
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        {/* { language() }  */}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Email Address
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        {/* {`${ state.user.email }`}  */}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Contact Number 
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        777 488 224
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-m leading-5 font-medium text-gray-500">
                        Account Created
                        </dt>
                        <dd className="mt-1 text-m leading-5 text-gray-900">
                        07/23/2020
                        </dd>
                    </div>
                    </dl>
                </div>

                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Institution Information
                    </h3>
                </div>
                <div className="px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-m leading-5 font-medium text-gray-500">
                            Institution
                            </dt>
                            <dd className="mt-1 text-m leading-5 text-gray-900">
                            Santa Clara High School
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-m leading-5 font-medium text-gray-500">
                            Grade 
                            </dt>
                            <dd className="mt-1 text-m leading-5 text-gray-900">
                            11th
                            </dd>
                        </div>
                    </dl>
                </div>
                </div>


                <div className="p-4 w-full flex justify-end">
                    <div className="flex w-32">
                <span className="ml-3 inline-flex rounded-md shadow-sm">
                    <NavLink to={`${match.url}/edit`}>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Edit
                    </button>
                    </NavLink>
                </span>
                </div>
                </div>

            </div>
               


    )
}

export default UserInformation;