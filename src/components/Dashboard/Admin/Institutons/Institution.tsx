import React, { useState, useEffect, useContext } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import * as queries from '../../../../graphql/queries';
import * as customQueries from '../../../../customGraphql/customQueries'
import InstitutionInfo from './InstitutionInfo';
import InstitutionEdit from './InstitutionEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import PageWrapper from '../../../Atoms/PageWrapper';
import useDictionary from '../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../contexts/GlobalContext';

interface InstitutionProps {
  tabProps?: any
}

export interface InstitutionInfo {
  id: string;
  name: string;
  institutionTypeId?: string;
  institutionType?: null;
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
  serviceProviders?: { items: { id: string, providerID: string, status: string, providerInstitution?: any }[] }
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */
const Institution = (props: InstitutionProps) => {
  const [institutionData, setInstitutionData] = useState({
    id: '',
    name: '',
    institutionTypeId: '',
    institutionType: null,
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
    serviceProviders: { items: [{ id: '', providerID: '', status }] },
    curricula: { items: [{ name: '', id: '' }] },

  });
  const [isNewUpdate, setISNewUpdate] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, "");
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const urlQueryParams = queryString.parse(location.search);
  const [tabsData, setTabsData] = useState({ inst: 0, instCurr: 0 });
  const { clientKey,userLanguage} = useContext(GlobalContext);
  const {  BreadcrumsTitles } = useDictionary(clientKey);

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'], url: '/dashboard/manage-institutions', last: false },
    { title: BreadcrumsTitles[userLanguage]['INSTITUTION_INFO'], url: `${location.pathname}${location.search}`, last: true }
  ];


  const toggleUpdateState = () => {
    setISNewUpdate(!isNewUpdate);
  }
  async function getInstitutionData() {
    try {
      if (urlQueryParams.id) {
        const fetchInstitutionData: any = await API.graphql(
          /**
           * Below query will get the 'id' parameter from the url
           * DO NOT change the ' urlQueryParams.id ' unless you also change the url
           * in ' InstitutionRow.tsx '
           */
          graphqlOperation(customQueries.GetInstitutionDetails, { id: urlQueryParams.id })
        );
        if (!fetchInstitutionData) {
          throw new Error('getInstitutionData() fetch : fail!');
        } else {
          setInstitutionData(fetchInstitutionData.data.getInstitution);
        }
      } else {
        history.push('/dashboard/manage-institutions')
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionData();
  }, []);


  const updateServiceProviders = (item: any) => {
    const instData = institutionData
    instData.serviceProviders.items.push(item)
    setInstitutionData(instData);
  }

  useEffect(() => {
    if (isNewUpdate) {
      getInstitutionData();
    }
  }, [isNewUpdate]);

  return (
    <div className={`w-full h-full`}>

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Institute Information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
          {currentPath !== 'edit' ? (
            <Buttons btnClass="mr-4 px-6" label="Edit" onClick={() => history.push(`${match.url}/edit?id=${urlQueryParams.id}`)} Icon={FaEdit} />
          ) : null
          }
        </div>
      </div>
      <PageWrapper>
        <Switch>
          <Route
            path={`${match.url}/edit`}
            render={() => (
              <InstitutionEdit institute={institutionData} toggleUpdateState={toggleUpdateState} />
            )}
          />
          <Route
            path={`${match.url}/`}
            render={() => (
              <InstitutionInfo institute={institutionData} updateServiceProviders={updateServiceProviders} tabProps={props.tabProps} />
            )}
          />
        </Switch>
      </PageWrapper>
    </div>
  );
};

export default Institution;
