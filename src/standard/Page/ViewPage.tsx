import React from 'react';
//make sure you are importing from the correct folder
import Button from '../Button/Button';

const ViewPage: React.FC = () => {

    return (
        //add DELETE BUTTON if needed
        //change DATA
        //remove BACK BUTTON if needed 
        <div className="h-full w-full md:p-6">
            <div className="w-full flex justify-end mb-4">
                <span className="w-20 flex inline-flex rounded-md shadow-sm">
                    <button type="submit" className="
                    text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
                    inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out">
                        Back
                    </button>
                </span>
            </div>

            <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
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
                            John Doe
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-m leading-5 font-medium text-gray-500">
                            Nickname
                            </dt>
                            <dd className="mt-1 text-m leading-5 text-gray-900">
                            Johnny
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
                            01/01/1234
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-m leading-5 font-medium text-gray-500">
                            Language
                            </dt>
                            <dd className="mt-1 text-m leading-5 text-gray-900">
                            English
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-m leading-5 font-medium text-gray-500">
                            Email Address
                            </dt>
                            <dd className="mt-1 text-m leading-5 text-gray-900">
                            email@email.com
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="p-4 w-full flex justify-end">
                <div className="flex justify-end w-4/10">
                    <Button 
                    label = 'Edit'
                    />
                </div>
            </div>

    </div>
    )

}

export default ViewPage;