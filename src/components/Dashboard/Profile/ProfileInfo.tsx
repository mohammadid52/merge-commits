import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';


const ProfileInfo: React.FC = () => {
    const { theme, state, dispatch } = useContext(GlobalContext);

    const language = () => {
        if (state.user.language === 'EN') {
            return 'English'
        } else if (state.user.language === 'ES') {
            return 'Spanish'
        }

    }

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
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Full name
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {`${ state.user.firstName } ${ state.user.lastName }`} 
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Nickname
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {`${ state.user.preferredName ? state.user.preferredName : 'not set' }`} 
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Birthday
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    06/01/1991
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
                    {`${ state.user.email }`} 
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Contact Number 
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    777 488 224
                    </dd>
                </div>
                </dl>
            </div>

            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                School Information
                </h3>
            </div>
            <div className="px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        School
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        Santa Clara High School
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Grade 
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        11th
                        </dd>
                    </div>
                </dl>
            </div>
            </div>
        </div>
    )
}

export default ProfileInfo;