import React, { useContext } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { useState } from "react";
import { GlobalContext } from '../../../contexts/GlobalContext';


const ProfileEdit: React.FC = () => {

    const match = useRouteMatch();

    return (
        <div className="overflow-scroll">

            <form>
                <div>

                    <div>
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Profile
                            </h3>
                            <p className="mt-1 text-sm leading-5 text-gray-500">
                            This information will be displayed publicly so be careful what you share.
                            </p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="photo" className="block text-sm leading-5 font-medium text-gray-700">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center">
                                    <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    </span>
                                    <span className="ml-5 rounded-md shadow-sm">
                                    <button type="button" className="py-2 px-3 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                                        Change
                                    </button>
                                    </span>
                                </div>
                            </div>
                        
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-8">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Personal Information
                        </h3>
                    </div>

                    <div className="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                        <label htmlFor="first_name" className="block text-sm font-medium leading-5 text-gray-700">
                            First name
                        </label>
                        <div className="mt-1 rounded-md shadow-sm">
                            <input id="first_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="last_name" className="block text-sm font-medium leading-5 text-gray-700">
                            Last name
                        </label>
                        <div className="mt-1 rounded-md shadow-sm">
                            <input id="last_name" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        </div>
                        </div>

                        <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1 rounded-md shadow-sm">
                            <input id="email" type="email" className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium leading-5 text-gray-700">
                            Country / Region
                        </label>
                        <div className="mt-1 rounded-md shadow-sm">
                            <select id="country" className="form-select block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                            </select>
                        </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-5">
                            <div className="flex justify-end">
                            <span className="inline-flex rounded-md shadow-sm">
                                <button type="button" className="py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                                Cancel
                                </button>
                            </span>
                            <span className="ml-3 inline-flex rounded-md shadow-sm">
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                Save
                                </button>
                            </span>
                            </div>
                        </div>

                    </div>

                    </div>

                </div>
            </form>



            <NavLink to={`/dashboard/profile`}>
                <button>Save</button>
            </NavLink>
        </div>
    )

}

export default ProfileEdit;