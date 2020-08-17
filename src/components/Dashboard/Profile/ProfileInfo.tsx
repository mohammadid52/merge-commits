import React, { useContext } from 'react';
import Dropdown from './Dropdown';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { UserInfo } from './Profile';

interface UserInfoProps {
    user: UserInfo
}

const ProfileInfo = (props: UserInfoProps) => {
   const {user} = props;

    const { theme, state, dispatch } = useContext(GlobalContext);
    const match = useRouteMatch();

    const language = () => {
        if (user.language === 'EN') {
            return 'English'
        } else if (user.language === 'ES') {
            return 'Spanish'
        }

    }

    return (
        <div className="w-full md:p-6">
            <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
                <div className="flex justify-between border-b border-gray-200 sm:px-6">
                    <h3 className="px-4 py-5 text-lg leading-6 font-medium text-gray-900">
                    Personal Information
                    </h3>
                    <div className="py-2 flex">
                    <Dropdown />
                    </div>
                </div>
                <div className="px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Full name
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {`${ user.firstName } ${ user.lastName }`} 
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Nickname
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {`${ user.preferredName ? user.preferredName : 'not set' }`} 
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Birthday
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {`${ user.birthdate ? user.birthdate : 'not set' }`} 
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Language
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        { language() } 
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Email address
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {`${ user.email }`} 
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Contact Number 
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {`${ user.phone ? user.phone : 'not set' }`}
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
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                            Institution
                            </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {`${ user.institution ? user.institution : 'not set' }`}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                            Grade 
                            </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {`${ user.grade ? user.grade : 'not set' }`}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="p-4 w-full flex justify-end">   
                <span className="flex w-32 ml-3 inline-flex rounded-md shadow-sm">
                    <NavLink to={`${match.url}/edit`}>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                    Edit
                    </button>
                    </NavLink>
                </span>
            </div>

        </div>
    )
}

export default ProfileInfo;