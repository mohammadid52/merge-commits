import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { API, graphqlOperation } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import * as queries from '../../../../graphql/queries';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import ActionButton from '../Actions/ActionButton';
/* import Button from '../../../../standard/Button/Button'; */
import InfoSide from '../Info/InfoSide';
import InstitutionInfo from './InstitutionInfo';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

export interface InstitutionInfo{
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
  contact: { name: string; email: string };
  website: string;
  type: null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */
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
    contact: { name: '', email: '' },
    website: '',
    type: null,
    image: '',
    createdAt: '',
    updatedAt: '',
  });
  const { theme } = useContext(GlobalContext);
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
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
        <div className='h-9/10 flex flex-row flex-end'>
          <InfoSide subtitle={institutionData.name} />

          <div className='w-full md:px-2 pt-2 flex flex-col'>
            {/* <Button label='Back' /> */}
            <div className='mb-4 w-full flex justify-end'>
              <ActionButton
                func={history.goBack}
                label='Back'
                compClass='w-20 text-white bg-indigo-600 hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700
          inline-flex justify-center py-2 px-4 border border-transparent text-m leading-5 font-medium rounded-md focus:outline-none transition duration-150 ease-in-out'
              />
            </div>

            <Switch>
              <Route 
                    path={`${match.url}/edit`}
                    render={() => (
                        <h1>Hello</h1>
                    )} 
                />
              <Route
                path={`${match.url}/`}
                render={() => (
                  <InstitutionInfo
                    id={institutionData.id}
                    /* name={institutionData.name} */
                    website={institutionData.website}
                    contactPerson={institutionData.contact.name}
                    email={institutionData.contact.email}
                    phone={institutionData.phone}
                    state={institutionData.state}
                    address={institutionData.address}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Institution;
