import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import ActionButton from '../Actions/ActionButton';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { useHistory } from 'react-router-dom';
import { InstitutionInfo } from './Institution';
//import InstitutionInfo from './InstitutionInfo';

interface InstitutionEditProps {
  institute: InstitutionInfo;
}

const InstitutionEdit: React.FC<InstitutionEditProps> = (
  instEditPrps: InstitutionEditProps
) => {
  const [editFormValues, setEditFormValues] = useState<InstitutionInfo>(instEditPrps.institute);
  const history = useHistory();

  async function updateInstitutionDB():Promise<void> {
    const updatedInfo = {

    }
  }

  const handleEditFormChange = (e: React.FormEvent /* <HTMLFormElement> */) => {
    const id = (e.target as HTMLInputElement).id;
    const value = (e.target as HTMLInputElement).value;

    setEditFormValues(() => ({ ...editFormValues, [id]: value }));
  };

  /**
   * Function to trigger updateInstitutionDB()
   * @param e - Submit form button event
   */
  const handleEditFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('test form submit');
  };

  return (
    <div className={`h-full w-full pt-2`}>

      {/* FORM submit tag */}
      <form onSubmit={handleEditFormSubmit}>
        <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>

          {/* TITLE */}
          <div className='w-full px-4 py-5 border-b border-gray-200 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Edit Information
            </h3>
          </div>
          {/* FORM */}
          {/* <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 px-4 py-5'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Institute Name
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  onChange={handleEditFormChange}
                  id='name'
                  type='text'
                  defaultValue={editFormValues.name}
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
                  onChange={handleEditFormChange}
                  id='website'
                  type='text'
                  defaultValue={editFormValues.website}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>
            <div className='sm:col-span-3'>
              <label
                htmlFor='contactName'
                className='block text-sm font-medium leading-5 text-gray-700'>
                Contact Person
              </label>
              <div className='mt-1 border border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm'>
                <input
                  readOnly
                  id='contactName'
                  type='text'
                  defaultValue='n/a'
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
                  readOnly
                  id='email'
                  type='text'
                  defaultValue='n/a'
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
                  readOnly
                  id='phone'
                  type='text'
                  defaultValue='n/a'
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
                  onChange={handleEditFormChange}
                  id='address'
                  type='text'
                  defaultValue={editFormValues.address}
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
                  onChange={handleEditFormChange}
                  id='city'
                  type='text'
                  defaultValue={editFormValues.city}
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
                  onChange={handleEditFormChange}
                  id='state'
                  type='text'
                  defaultValue={editFormValues.state}
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
                  onChange={handleEditFormChange}
                  id='zipcode'
                  type='text'
                  defaultValue={editFormValues.zip}
                  className='form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5'
                />
              </div>
            </div>
          </div> */}
        </div>
        {/* Cancel/save buttons */}
        <div className='px-4 w-full flex justify-end'>
          <div className='flex w-4/10'>
            <ActionButton
              func={history.goBack}
              label='Cancel'
              compClass='py-2 px-4 border border-gray-300 rounded-md text-m leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out'
            />
            <ActionButton
              type='submit'
              label='Save'
              compClass='inline-flex justify-center py-2 px-4 ml-3 border border-transparent text-m leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out'
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstitutionEdit;
