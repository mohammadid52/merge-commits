import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import API, { graphqlOperation } from '@aws-amplify/api';
import * as queries from '../../../../graphql/queries';


/**
 * This component represents the feature for extracting institutions list into csv files.
 * which lists all the available institutions
 */

const ExportToCsv: React.FC = () => {
  const [institutionsList, setInstitutionsList] = useState([]);

  // This will fetch all the institutions list data.
  const getInstitutionsList = async () => {
    try {
      const fetchInstitutionData: any = await API.graphql(
        graphqlOperation(queries.listInstitutions)
      );
      if (!fetchInstitutionData) {
        throw new Error('fail!');
      } else {
        console.log('Log institutions BEFORE: ', fetchInstitutionData);
        setInstitutionsList(fetchInstitutionData.data.listInstitutions.items);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionsList();
  }, []);

  return (
    <div className="w-full h-1/2 md:h-full flex items-center justify-center mt-5">
      <div className={`h-full w-1/3 main_container`}>
        <button type="submit" className=" mt-5 inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
          <CSVLink data={dummyCsvData} >Institutions</CSVLink>  {/* dummyCsvData will be replaced with institutionsList */}
        </button>
      </div>
    </div>
  );
};

export default ExportToCsv;



const dummyCsvData = [
  {
    name: 'Institude name',
    district: 'District name',
    address: 'Amizara park, street byc, NY.',
    city: 'NY',
    state: 'GUJ',
    zip: '363002',
    phone: '1234567890',
    website: 'data.exim@yopmail.com',
    image: 'url(`Image.url`)',
    createdAt: '20-12-2020',
    updatedAt: '30-11-2020'
  },
  {
    name: 'Institude name',
    district: 'District name',
    address: 'Amizara park, street byc, NY.',
    city: 'NY',
    state: 'GUJ',
    zip: '363002',
    phone: '1234567890',
    website: 'data.exim@yopmail.com',
    image: 'url(`Image.url`)',
    createdAt: '20-12-2020',
    updatedAt: '30-11-2020'
  },
  {
    name: 'Institude name',
    district: 'District name',
    address: 'Amizara park, street byc, NY.',
    city: 'NY',
    state: 'GUJ',
    zip: '363002',
    phone: '1234567890',
    website: 'data.exim@yopmail.com',
    image: 'url(`Image.url`)',
    createdAt: '20-12-2020',
    updatedAt: '30-11-2020'
  },
];