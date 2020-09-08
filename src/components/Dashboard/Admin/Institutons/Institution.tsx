import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../../../graphql/queries';
import ActionButton from '../Actions/ActionButton';

interface InstitutionProps {
  id: string;
}

const Institution: React.FC<InstitutionProps> = () => {
  const [institutionData, setInstitutionData] = useState([]);

  async function getInstitutionData() {
    try {
      const fetchInstitutionData: any = await API.graphql(
        graphqlOperation(queries.getInstitution, {id: 1})
      );
      if (!fetchInstitutionData) {
        throw new Error('fail!');
      } else {
        console.log('Log institution SINGLE: ', fetchInstitutionData);
        //setInstitutionData(fetchInstitutionData.data.listInstitutions.items);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h2>Single Institution</h2>
      <ActionButton label='Test fetch' func={getInstitutionData} />
    </>
  );
};

export default Institution;
