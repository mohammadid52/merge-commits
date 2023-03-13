import ErrorBoundary from '@components/Error/ErrorBoundary';
import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {InstInfo} from '@interfaces/InstitutionInterface';
import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import PageWrapper from 'atoms/PageWrapper';
import {API, graphqlOperation} from 'aws-amplify';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import queryString from 'query-string';
import {lazy, useEffect, useState} from 'react';
import {Route, Switch, useLocation, useParams, useRouteMatch} from 'react-router-dom';
const InstitutionInfo = lazy(() => import('dashboard/Admin/Institutons/InstitutionInfo'));

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
    items: {
      id: string;
      providerID: string;
      status: string;
      providerInstitution?: any;
    }[];
  };
}

/**
 * Institution parent component
 * Responsible for fetching institution data and populating the component
 * with data from the API
 */

interface IInstitution extends InstInfo {
  institutionTypeId: string;
  institutionType?: string | null;
  contact: any;
  createdAt?: string;
  updatedAt?: string;
  isZoiq?: boolean;
}

const Institution = (props: InstitutionProps) => {
  const {institutionId}: any = useParams();
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [institutionData, setInstitutionData] = useState<IInstitution>({
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
    type: '',
    image: '',
    createdAt: '',
    updatedAt: '',
    addressLine2: '',
    phone: '',
    isServiceProvider: false,
    isZoiq: false,
    classes: {items: [{name: '', id: ''}]},
    serviceProviders: {items: [{id: '', providerID: '', status}]},
    curricula: {items: [{name: '', id: ''}]}
  });

  const [isNewUpdate, setISNewUpdate] = useState(false);

  const match = useRouteMatch();
  const location = useLocation();

  const urlQueryParams = queryString.parse(location.search);
  const {clientKey} = useGlobalContext();

  const bannerImage = getAsset(clientKey, 'dashboardBanner1');

  const toggleUpdateState = () => {
    setISNewUpdate((prevNewUpdate) => !prevNewUpdate);
  };

  const postInfoUpdate = (data: any) => {
    setInstitutionData((prevData) => ({
      ...prevData,
      ...data
    }));
  };

  const {authId, email} = useAuth();

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
          graphqlOperation(customQueries.GetInstitutionDetails, {
            id: institutionId
          })
        );
        if (!fetchInstitutionData) {
          throw new Error('getInstitutionData() fetch : fail!');
        } else {
          setInstitutionData({...fetchInstitutionData.data.getInstitution});
        }
        setFetchingDetails(false);
        setISNewUpdate(false);
      } else {
        // history.push('/dashboard/manage-institutions');
      }
    } catch (error) {
      logError(error, {authId: authId, email: email}, 'Institution');
      console.error(error);
    }
  }

  useEffect(() => {
    getInstitutionData();
  }, [institutionId]);

  useEffect(() => {
    const {tab} = urlQueryParams;
    props.tabProps.setTabsData({
      ...props.tabProps.tabsData,
      inst: tab || 'staff'
    });
  }, [urlQueryParams.tab]);

  const updateServiceProviders = (item: any) => {
    const instData = institutionData;
    instData?.serviceProviders?.items.push(item);
    setInstitutionData(instData);
  };

  useEffect(() => {
    if (isNewUpdate) {
      getInstitutionData();
    }
  }, [isNewUpdate]);

  return (
    <div className={`w-full h-full`}>
      <BreadcrumbsWithBanner
        bannerImage={bannerImage}
        institutionData={institutionData}
        institutionId={institutionId}
        forInstitution
      />
      <div className="px-2 py-8 md:px-4 lg:p-8">
        <PageWrapper>
          <Switch>
            <Route
              path={`${match.url}/`}
              render={() => (
                <ErrorBoundary componentName="InstitutionInfo">
                  <InstitutionInfo
                    institute={institutionData}
                    loading={fetchingDetails}
                    postInfoUpdate={postInfoUpdate}
                    tabProps={props.tabProps}
                    toggleUpdateState={toggleUpdateState}
                    updateServiceProviders={updateServiceProviders}
                  />
                </ErrorBoundary>
              )}
            />
          </Switch>
        </PageWrapper>
      </div>
    </div>
  );
};

export default Institution;
