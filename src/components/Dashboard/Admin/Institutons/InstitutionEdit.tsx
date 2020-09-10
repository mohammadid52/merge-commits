import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';

import { API, graphqlOperation } from 'aws-amplify';
import * as customMutations from '../../../../customGraphql/customMutations';
import { useHistory } from 'react-router-dom';
import { InstitutionInfo } from './Institution';

/**
 * InstitutionEdit
 * Component responsible for the edit form of institutions
 * Will update the database with new info about the institution
 */
const InstitutionEdit: React.FC<InstitutionInfo> = (
  instEditProps: InstitutionInfo
) => {
  const { theme } = useContext(GlobalContext);

  return (
    <div className={`h-full w-full md:px-2 pt-2`}>
      {/* FORM submit tag */}
      <form>
        <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>
          <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 px-4 py-5'>
            {/* TITLE */}
            <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Edit Information
              </h3>
            </div>
            {/* FORM */}
            <div className='sm:col-span-3'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Institute Name
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='name'
                  type='text'
                  defaultValue={instEditProps.name}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='website'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Website
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='website'
                  type='text'
                  defaultValue={instEditProps.website}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='contactPerson'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Contact Person
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='contactPerson'
                  type='text'
                  defaultValue={instEditProps.contact.name}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-5 text-gray-700'>
                E-mail
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='email'
                  type='text'
                  defaultValue={instEditProps.contact.email}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='phone'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Phone
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='phone'
                  type='text'
                  defaultValue={instEditProps.phone}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='address'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Address
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='address'
                  type='text'
                  defaultValue={instEditProps.address}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='city'
                className='block text-sm font-medium leading-5 text-gray-700'>
                City
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='city'
                  type='text'
                  defaultValue={instEditProps.city}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='state'
                className='block text-sm font-medium leading-5 text-gray-700'>
                State
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='state'
                  type='text'
                  defaultValue={instEditProps.state}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='zipcode'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Zipcode
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  id='zipcode'
                  type='text'
                  defaultValue={instEditProps.zip}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionEdit;
