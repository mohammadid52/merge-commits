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
        const institutionList = fetchInstitutionData.data.listInstitutions.items;

        // Extract contact info from the object of contacts.
        const updatedList = institutionList.map((inst: any) => ({
          ...inst,
          contactName: inst.contact?.name,
          contactEmail: inst.contact?.email,
          contactPhone: inst.contact?.phone
        })).map((item: any) => {
          delete item.contact;
          return item;
        });

        setInstitutionsList(updatedList);
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
          <CSVLink
            data={institutionsList}
            headers={headers}
            filename={"Institutions_list.csv"}
          >Institutions</CSVLink>
        </button>
      </div>
    </div>
  );
};

export default ExportToCsv;

// Header part or columns in csv table.

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Phone', key: 'phone' },
  { label: 'Website', key: 'website' },
  { label: 'Contact Name', key: 'contactName' },
  { label: 'Contact Email', key: 'contactEmail' },
  { label: 'Contact Phone', key: 'contactPhone' },
  { label: 'Address Line 1', key: 'address' },
  { label: 'Address Line 2', key: 'addressLine2' },
  { label: 'City', key: 'city' },
  { label: 'District name', key: 'district' },
  { label: 'State', key: 'state' },
  { label: 'Zip', key: 'zip' },
  { label: 'Image', key: 'image' },
  { label: 'Type', key: 'type' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Updated At', key: 'updatedAt' },
];
