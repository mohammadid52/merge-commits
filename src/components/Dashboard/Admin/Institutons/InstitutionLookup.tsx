import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../../graphql/queries';
import InstitutionSearch from './InstitutionSearch';
import Actions from '../Actions/Actions';
import InstitutionRow from './InstitutionRow';

const InstitutionLookup: React.FC = () => {
  const [institutionData, setInstitutionData] = useState([]);

  async function getInstitutionsData() {
    try {
      const fetchInstitutionData: any = await API.graphql(
        graphqlOperation(queries.listInstitutions)
      );
      if (!fetchInstitutionData) {
        throw new Error('fail!');
      } else {
        console.log('Log institutions BEFORE: ', fetchInstitutionData);
        setInstitutionData(fetchInstitutionData.data.listInstitutions.items);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionsData();
  }, []);

  return (
    <div className={`w-full h-full`}>
      <div
        className={`py-4 px-8 white_back w-full h-auto rounded-lg shadow-elem-light`}
      >
        <div className='mb-2 font-bold text-lg'>Look up institutions by:</div>
        <div className='grid grid-cols-1 row-gap-4 col-gap-4 sm:grid-cols-4'>
          <InstitutionSearch name='name' id='name' />
          <InstitutionSearch name='email' id='email' />
          <InstitutionSearch name='phone' id='phone' />
          <InstitutionSearch name='city' id='city' />
        </div>
        <div className={`mt-4 w-full flex justify-end`}>
          <div
            className='w-32 cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' /* onClick={handleSubmit} */
          >
            Submit
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='-my-2 py-2'>
          <div className='white_back py-4 px-8 mt-8 align-middle rounded-lg border-b border-gray-200'>
            <div className='h-8/10 px-4'>
              <div className='w-full flex justify-between border-b border-gray-200 '>
                <div className='w-`3.5`/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span>Name</span>
                </div>
                <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>State</span>
                </div>
                <div className='w-3/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>Address</span>
                </div>
                <div className='w-2/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                  <span className='w-auto'>Website</span>
                </div>
                <div className='w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'></div>
              </div>
              {typeof institutionData !== 'undefined'
                ? institutionData.map((instituteObject, i) => (
                    <InstitutionRow
                      key={`instituteRow${i}`}
                      id={instituteObject.id}
                      state={instituteObject.state}
                      address={instituteObject.address}
                      website={instituteObject.website}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionLookup;
