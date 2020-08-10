import React, { useContext } from 'react';
import Dropdown from './Dropdown';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { NavLink, useRouteMatch } from 'react-router-dom';

const ProfileInfo: React.FC = (user: any) => {

    const { theme, state, dispatch } = useContext(GlobalContext);
    const match = useRouteMatch();

    // const person = user.user;
    
// console.log(person.firstName, 'props')
//     const language = () => {
//         if (person.language === 'EN') {
//             return 'English'
//         } else if (person.language === 'ES') {
//             return 'Spanish'
//         }

//     }
// console.log(user)
    return (
        <div className="w-full md:p-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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

                    {/* {`${ person.firstName } ${ person.lastName }`}  */}
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Nickname
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {/* {`${ person.preferredName ? person.preferredName : 'not set' }`}  */}
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Birthday
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {/* {`${ person.birthdate ? person.birthdate : 'not set' }`}  */}
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Language
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {/* { language() }  */}
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Email address
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {/* {`${ person.email }`}  */}
                    </dd>
                </div>
                <div className="sm:col-span-1">
                    <dt className="text-sm leading-5 font-medium text-gray-500">
                    Contact Number 
                    </dt>
                    <dd className="mt-1 text-sm leading-5 text-gray-900">
                    {/* {`${ person.phone ? person.phone : 'not set' }`} */}
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
                        {/* {`${ person.institution ? person.institution : 'not set' }`} */}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm leading-5 font-medium text-gray-500">
                        Grade 
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-gray-900">
                        {/* {`${ person.grade ? person.grade : 'not set' }`} */}
                        </dd>
                    </div>
                </dl>
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
        </div>
    )
}

export default ProfileInfo;