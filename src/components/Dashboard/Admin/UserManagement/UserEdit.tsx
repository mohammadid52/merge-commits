import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import DropdownForm from '../../Profile/DropdownForm';

const UserEdit: React.FC = () => {

    const items = [
        {
            id: 1,
            value: 'English',
        },
        {
            id: 2,
            value: 'Spanish',
        },
        {
            id: 3,
            value: 'Vietnamese'
        },
    ];

    const items_status = [
        {
            id: 1,
            value: 'Active',
        },
        {
            id: 2,
            value: 'Inactive',
        },
    ];

    const items_role = [
        {
            id: 1,
            value: 'Admin',
        },
        {
            id: 2,
            value: 'Fellow',
        },
        {
            id: 3,
            value: 'Teacher',
        },
    ];

    return (
        <div className="h-full w-full md:p-6">
            <div className="h-full bg-white shadow sm:rounded-lg">
            <form>
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit Information
                    </h3>
                </div>

                <div className="h-full px-4 py-5 sm:px-6">
                    
                    <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                        <label htmlFor="first_name" className="block text-m font-medium leading-5 text-gray-700">
                            First name
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="first_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Jayne"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="last_name" className="block text-m font-medium leading-5 text-gray-700">
                            Last name
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="last_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Phillips"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="photo" className="block text-m leading-5 font-medium text-gray-700">
                                Photo
                            </label>
                            <div className="mt-2 flex items-center">
                                <span className="h-8 w-8 rounded-full bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                </span>
                                <span className="ml-5 rounded-md shadow-sm">
                                <button type="button" className="py-2 px-3 border border-gray-300 rounded-md text-m leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                                    Change
                                </button>
                                </span>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="preferred_name" className="block textsm font-medium leading-5 text-gray-700">
                            Nickname
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="preferred_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="not set"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                            <DropdownForm
                                label = 'Role'
                                items = {items_role}
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <DropdownForm
                                label = 'Status'
                                items = {items_status}
                            />
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="birthday" className="block text-m font-medium leading-5 text-gray-700">
                            Birthday
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="birthday" type="date" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="06 01 1991"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                            <DropdownForm
                                label = 'Language Preference'
                                items = {items}
                            />
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-m font-medium leading-5 text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="email" type="email" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="jayne.phillips61@gmail.com"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="number" className="block text-m font-medium leading-5 text-gray-700">
                            Contact Number
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="number" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="777 448 224"/>
                        </div>
                        </div>
                    </div>
                </div>  

                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Edit Institution Information
                    </h3>
                </div>

                <div className="h-full px-4 py-5 sm:px-6">   
                    <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                        <label htmlFor="school_name" className="block text-m font-medium leading-5 text-gray-700">
                            Institution
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="school_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Santa Clara High School"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="grade" className="block text-m font-medium leading-5 text-gray-700">
                            Grade
                        </label>
                        <div className="mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                            <input id="grade" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="11th"/>
                        </div>
                        </div>

                    </div>
                </div>  

                        <div className="p-4 w-full flex justify-end">
                            <div className="flex w-4/10">
                        <span className="inline-flex rounded-md shadow-sm">
                            <NavLink to={`/dashboard/profile`}>
                            <button type="button" className="py-2 px-4 border border-gray-300 rounded-md text-m leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                            Cancel
                            </button>
                            </NavLink>
                        </span>
                        <span className="ml-3 inline-flex rounded-md shadow-sm">
                            <NavLink to={`/dashboard/profile`}>
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                            Save
                            </button>
                            </NavLink>
                        </span>
                        </div>
                        </div>
                    
            </form>
            </div>

           
        </div>
    )

}

export default UserEdit;