import React, { useState, useEffect, useContext } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import * as queries from '../../../../graphql/queries';
import InstitutionInfo from './InstitutionInfo';
import InstitutionEdit from './InstitutionEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import PageWrapper from '../../../Atoms/PageWrapper';


export interface InstitutionInfo {
  id: string;
  name: string;
  institutionTypeId?: string;
  institutionType?: null;
  district?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  contact?: { name: string; email: string; phone: string };
  website?: string;
  phone?: string;
  type?: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  addressLine2?: any;
  isServiceProvider?: boolean;
  classes?: { items: { name?: string, id: string }[] }
  curricula?: { items: { name?: string, id: string }[] }
  serviceProviders?: { items: { id: string, providerID: string }[] }
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */
const Institution: React.FC = () => {
  const [institutionData, setInstitutionData] = useState({
    id: '',
    name: '',
    institutionTypeId: '',
    institutionType: null,
    district: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    contact: { name: '', email: '', phone: '' },
    website: '',
    type: null,
    image: '',
    createdAt: '',
    updatedAt: '',
    addressLine2: '',
    phone: '',
    isServiceProvider: false,
    classes: { items: [{ name: '', id: '' }] },
    serviceProviders: { items: [{ id: '', providerID: '' }] },
    curricula: { items: [{ name: '', id: '' }] }

  });
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const urlQueryParams = queryString.parse(location.search);
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Institution Management', url: '/dashboard/manage-institutions', last: false },
    { title: 'Institute Info', url: `${location.pathname}${location.search}`, last: true }
  ];

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
    <div className={`w-full h-full mt-4`}>

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Institute Information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
          {currentPath !== 'edit' ? (
            <Buttons btnClass="mr-4" onClick={() => history.push(`${match.url}/edit?id=${urlQueryParams.id}`)} Icon={FaEdit} />
          ) : null
          }
        </div>
      </div>
      <PageWrapper>
        <Switch>
          <Route
            path={`${match.url}/edit`}
            render={() => (
              <InstitutionEdit institute={institutionData} />
            )}
          />
          <Route
            path={`${match.url}/`}
            render={() => (
              <InstitutionInfo institute={institutionData} />
            )}
          />
        </Switch>
      </PageWrapper>
    </div>
  );
};

export default Institution;