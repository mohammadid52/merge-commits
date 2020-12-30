import React from 'react';
///make sure you're importing from correct folders
import FormDrop from './FormDropdown';
import FormInput from './FormInput';

const Form = () => {

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
        ///change the WIDTH or PADDING if needed
        <div className="h-full w-full bg-white shadow my-4 sm:rounded-lg">
          <form>
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Information
                </h3>
            </div>

            <div className="h-full px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6">
                    <FormInput
                    label = 'First Name'
                    value = 'Jayne'
                    id = 'first_name'
                    type = 'text'
                    />

                    <FormInput
                    label = 'Last Name'
                    value = 'Phillips'
                    id = 'last_name'
                    type = 'text'
                    />

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

                    <FormInput
                    label = 'Something'
                    value = 'Some'
                    id = 'some'
                    type = 'text'
                    />

                    <div className="sm:col-span-3">
                        <FormDrop
                            label = 'Role'
                            items = {items_role}
                            multiSelect
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <FormDrop
                            label = 'Status'
                            items = {items_status}
                            multiSelect
                        />
                    </div>

                    <FormInput
                        label = 'Birthday'
                        value = '01/01/1234'
                        id = 'birthdate'
                        type = 'date'
                    />

                    <div className="sm:col-span-3">
                        <FormDrop
                            label = 'Language Preference'
                            items = {items}
                            multiSelect
                        />
                    </div>

                    <FormInput
                        label = 'Email'
                        value = 'email@email.com'
                        id = 'email'
                        type = 'email'
                    />

                    <FormInput
                    label = 'Contact Number'
                    value = '123934587'
                    id = 'phone'
                    type = 'text'
                    />

                </div>
            </div>         
        </form>

    </div>
    );

}

export default Form;