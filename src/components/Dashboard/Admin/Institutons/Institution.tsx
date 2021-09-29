import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import {useHistory} from 'react-router-dom';
import {Switch, Route, useParams, useRouteMatch} from 'react-router-dom';

import * as customQueries from '@customGraphql/customQueries';
import useDictionary from '@customHooks/dictionary';
import {GlobalContext} from '@contexts/GlobalContext';

import BreadCrums from '@atoms/BreadCrums';
import SectionTitle from '@atoms/SectionTitle';
import PageWrapper from '@atoms/PageWrapper';

import {getAsset} from '../../../../assets';

import InstitutionInfo from './InstitutionInfo';
import HeroBanner from '@components/Header/HeroBanner';
import BreadcrumbsWithBanner from '@components/Atoms/BreadcrumbsWithBanner';

interface InstitutionProps {
  tabProps?: any;
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
  contact?: {name: string; email: string; phone: string};
  website?: string;
  phone?: string;
  type?: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
  addressLine2?: any;
  isServiceProvider?: boolean;
  classes?: {items: {name?: string; id: string}[]};
  curricula?: {items: {name?: string; id: string}[]};
  serviceProviders?: {
    items: {id: string; providerID: string; status: string; providerInstitution?: any}[];
  };
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */
const Institution = (props: InstitutionProps) => {
  const {institutionId}: any = useParams();
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [institutionData, setInstitutionData] = useState({
    id: institutionId,
    name: '',
    institutionTypeId: '',
    institutionType: null,
    address: '',
    city: '',
    state: '',
    zip: '',
    contact: {name: '', email: '', phone: ''},
    website: '',
    type: null,
    image: '',
    createdAt: '',
    updatedAt: '',
    addressLine2: '',
    phone: '',
    isServiceProvider: false,
    classes: {items: [{name: '', id: ''}]},
    serviceProviders: {items: [{id: '', providerID: '', status}]},
    curricula: {items: [{name: '', id: ''}]},
  });
  const [isNewUpdate, setISNewUpdate] = useState(false);
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const urlQueryParams = queryString.parse(location.search);
  const [tabsData, setTabsData] = useState({inst: 0, instCurr: 0});
  const {clientKey,theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {BreadcrumsTitles} = useDictionary(clientKey);
  const bannerImage = getAsset(clientKey, 'dashboardBanner1');

  const breadCrumbsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: institutionData.name,
      url:
        currentPath !== 'edit'
          ? `${location.pathname}${location.search}`
          : `/dashboard/manage-institutions/institution/${institutionId}/staff`,
      last: currentPath !== 'edit',
    },
    currentPath === 'edit'
      ? {
          title: BreadcrumsTitles[userLanguage]['INSTITUTION_GENERAL_INFO'],
          url: `${location.pathname}${location.search}`,
          last: true,
        }
      : null,
  ].filter(Boolean);

  const toggleUpdateState = () => {
    setISNewUpdate(prevNewUpdate => !prevNewUpdate);
  };

  const postInfoUpdate = (data: any) => {
    setInstitutionData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  async function getInstitutionData() {
    try {
      if (institutionId) {
        setFetchingDetails(true);
        const fetchInstitutionData: any = await API.graphql(
          /**
           * Below query will get the 'id' parameter from the url
           * DO NOT change the ' institutionId ' unless you also change the url
           * in ' InstitutionRow.tsx '
           */
          graphqlOperation(customQueries.GetInstitutionDetails, {id: institutionId})
        );
        if (!fetchInstitutionData) {
          throw new Error('getInstitutionData() fetch : fail!');
        } else {
          setInstitutionData(fetchInstitutionData.data.getInstitution);
        }
        setFetchingDetails(false);
        setISNewUpdate(false);
      } else {
        // history.push('/dashboard/manage-institutions');
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionData();
  }, []);

  useEffect(() => {
    const {tab} = urlQueryParams;
    props.tabProps.setTabsData({...props.tabProps.tabsData, inst: tab || 'staff'});
  }, [urlQueryParams.tab]);

  const updateServiceProviders = (item: any) => {
    const instData = institutionData;
    instData.serviceProviders.items.push(item);
    setInstitutionData(instData);
  };

  useEffect(() => {
    if (isNewUpdate) {
      getInstitutionData();
    }
  }, [isNewUpdate]);

  return (
    <div className={`w-full h-full`}>
      <div className="relative">
        <HeroBanner imgUrl={bannerImage} title={`${institutionData.name} Dashboard`} />
        <div className={`absolute ${theme.backGround[themeColor]} bottom-0 z-1000`}>
          <BreadcrumbsWithBanner items={breadCrumbsList} />
        </div>
      </div>
      <div className="px-2 py-8 md:p-8">
      {/* Section Header */}
      {/* <BreadCrums items={breadCrumbsList} /> */}
      {/* <div className="flex justify-between">
        <SectionTitle title={`${institutionData.name} Dashboard`} />
      </div> */}
      <PageWrapper wrapClass="overflow-x-auto">
        <Switch>
          {/* <Route
            path={`${match.url}/edit`}
            exact
            render={() => (
              <InstitutionBuilder
                institute={institutionData}
                loading={fetchingDetails}
                toggleUpdateState={toggleUpdateState}
                updateServiceProviders={updateServiceProviders}
              />
            )}
          /> */}
          <Route
            path={`${match.url}/`}
            render={() => (
              <InstitutionInfo
                institute={institutionData}
                loading={fetchingDetails}
                postInfoUpdate={postInfoUpdate}
                tabProps={props.tabProps}
                toggleUpdateState={toggleUpdateState}
                updateServiceProviders={updateServiceProviders}
              />
            )}
          />
        </Switch>
      </PageWrapper>
    </div></div>
  );
};

export default Institution;
