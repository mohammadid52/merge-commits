import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import ActionButton from '../Actions/ActionButton';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as customMutations from '../../../../customGraphql/customMutations';
import { useHistory } from 'react-router-dom';
import { initials, stringToHslColor } from '../../../../utilities/strings';
import { InstitutionInfo } from './Institution';
import FormInput from '../../../Atoms/Form/FormInput';
//import InstitutionInfo from './InstitutionInfo';

interface InstitutionEditProps {
  institute: InstitutionInfo;
}

/**
 * InstitutionEdit
 * Component responsible for the edit form of institutions
 * Will update the database with new info about the institution
 */
const InstitutionEdit: React.FC<InstitutionEditProps> = (
  instEditPrps: InstitutionEditProps
) => {
  const [editFormValues, setEditFormValues] = useState<InstitutionInfo>(instEditPrps.institute);
  const history = useHistory();

  /**
   * Push updated institute data
   * to the database
   */
  async function updateInstitutionDB(): Promise<void> {
    const updatedInfo = {

    }
  }

  /**
   * Function to update state institution data
   * on form change
   * @param e - form change event
   */
  const handleEditFormChange = (e: React.FormEvent /* <HTMLFormElement> */) => {
    const id = (e.target as HTMLInputElement).id;
    const value = (e.target as HTMLInputElement).value;

    console.log('Inst Edit form: ', { [id]: value });

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

    <div className="h-9/10 flex flex-col md:flex-row">

      {/* Profile section */}
      <div className="w-auto p-4 flex flex-col text-center items-center">
        <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
          <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full" style={{ background: `${stringToHslColor('I' + ' ' + 'N')}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
            {initials('IN', 'NI')}
          </div>
        </div>
      </div>


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
            <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-6 px-4 py-5'>
              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='name' name='name' label="Institution Name" placeHolder="i.e. Iconoclast artist" />
              </div>
              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="Website" placeHolder="i.e. Iconoclastartist.com" />
              </div>
              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="Address line 1" />
              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="Address line 2" />

              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="City" />

              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="District" />

              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="State" />

              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="Zip" />

              </div>

              <div className='sm:col-span-3 px-2 py-4'>
                <FormInput id='website' name='website' label="Phone" />

              </div>
            </div>
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

    </div>
  );
};

export default InstitutionEdit;
