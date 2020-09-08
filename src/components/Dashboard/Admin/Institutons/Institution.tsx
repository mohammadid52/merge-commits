import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { API, graphqlOperation } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import * as queries from '../../../../graphql/queries';
import queryString from 'query-string';
import ActionButton from '../Actions/ActionButton';
import InfoSide from '../Info/InfoSide';
import InstitutionInfo from './InstitutionInfo';

interface InstitutionInfoIntf {
  id: string;
  name: string;
  institutionTypeId: string;
  institutionType: null;
  district: null;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: null;
  contact: {};
  website: string;
  type: null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const Institution: React.FC = () => {
  const [institutionData, setInstitutionData] = useState<InstitutionInfoIntf>({
    id: '',
    name: '',
    institutionTypeId: '',
    institutionType: null,
    district: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: null,
    contact: {},
    website: '',
    type: null,
    image: '',
    createdAt: '',
    updatedAt: '',
  });
  const { theme } = useContext(GlobalContext);
  const location = useLocation();
  const urlQueryParams = queryString.parse(location.search);

  async function getInstitutionData() {
    try {
      const fetchInstitutionData: any = await API.graphql(
        /**
         * Below query will get the 'id' parameter from the url
         * DO NOT change the ' urlQueryParams.id ' unless you also change the url
         * in ' InstitutionRow.tsx '
         */
        graphqlOperation(queries.getInstitution, { id: urlQueryParams.id })
      );
      if (!fetchInstitutionData) {
        throw new Error('getInstitutionData() fetch : fail!');
      } else {
        setInstitutionData(fetchInstitutionData.data.getInstitution);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionData();
  }, []);

  return (
    <div className={`w-9/10 h-full`}>
      {/* <p>{JSON.stringify(institutionData)}</p> */}
      {/* <ActionButton label='Test fetch' func={getInstitutionData} /> */}

      <div
        className={`w-full h-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}
      >
        <div className='h-9/10 flex flex-col md:flex-row'>
          <InfoSide belowImg={institutionData.name} />
          <InstitutionInfo />
        </div>
      </div>
    </div>
  );
};

export default Institution;
