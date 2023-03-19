import {useEffect, useState} from 'react';
import {BsArrowLeft} from 'react-icons/bs';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory, useRouteMatch} from 'react-router';

import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import PageWrapper from 'atoms/PageWrapper';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import InstitutionFormComponent from './InstitutionFormComponent';
import ServiceVendors from './ServiceVendors';

interface InstitutionBuilderProps {
  institutionId?: string;
  institute?: any;
  loading?: boolean;
  postInfoUpdate?: (data: any) => void;
  toggleUpdateState?: () => void;
  updateServiceProviders?: Function;
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

const InstitutionBuilder = ({
  institutionId,
  institute,
  loading,
  postInfoUpdate
}: InstitutionBuilderProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const params = useQuery(location.search);
  const step = params.get('step');
  const back = params.get('back');

  const {
    clientKey,
    state: {user},

    userLanguage
  } = useGlobalContext();

  const bannerImage = getAsset(clientKey, 'dashboardBanner1');
  const {BreadcrumsTitles, CommonlyUsedDict, InstitutionBuilderDict} = useDictionary();
  const [activeStep, setActiveStep] = useState('overview');
  const [institutionInfo, setInstitutionInfo] = useState({
    id: institutionId || '',
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
    isZoiq: false,
    isServiceProvider: false,
    classes: {items: [{name: '', id: ''}]},
    serviceProviders: {items: [{id: '', providerID: '', status}]},
    curricula: {items: [{name: '', id: ''}]}
  });

  const breadCrumbsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      href: '/dashboard/manage-institutions',
      last: false
    },
    {
      title: institutionInfo.name || BreadcrumsTitles[userLanguage]['ADD_INSTITUTION'],
      href: `/dashboard/manage-institutions/add`,
      last: true
    }
  ];
  const steps: IStepElementInterface[] = [
    {
      title: 'General Information',
      subTitle: 'Capture core details of your institution',
      stepValue: 'overview'
    },
    {
      title: 'Service Vendors (Optional)',
      description: '',
      stepValue: 'service_vendors',
      disabled: !Boolean(institutionInfo.id)
    }
  ];

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}&id=${institutionInfo.id}`;
    history.push(redirectionUrl);
  };

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  useEffect(() => {
    // For checking Authorized user is trying to access add institution or not
    if (user.role !== 'SUP' && !institutionId) {
      history.push('/dashboard');
    }
  }, [institutionId]);

  useEffect(() => {
    if (institute?.id) {
      setInstitutionInfo(institute);
    }
  }, [institute]);

  const postMutation = (data: any) => {
    setInstitutionInfo((prevData) => ({
      ...prevData,
      ...data
    }));
    postInfoUpdate?.(data);
  };

  const updateServiceProviders = (item: any) => {
    setInstitutionInfo((prevData: any) => ({
      ...prevData,
      serviceProviders: {
        ...prevData.serviceProviders,
        items: [...(prevData.serviceProviders.items || []), item]
      }
    }));
  };

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <InstitutionFormComponent
            institutionInfo={institutionInfo}
            postMutation={postMutation}
          />
        );
      case 'service_vendors':
        return (
          <ServiceVendors
            serviceProviders={institutionInfo.serviceProviders}
            instId={institutionInfo.id}
            updateServiceProviders={updateServiceProviders}
            instName={'name'}
          />
        );

      default:
        return null;
    }
  };

  const isEditPage = location.pathname.indexOf('edit') > -1;

  return (
    <div className={`w-full h-full ${isEditPage ? '' : 'pt-0'} px-0`}>
      {back && (
        <div
          className="px-8 flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => history.push(back)}>
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK']}</div>
        </div>
      )}
      {isEditPage ? (
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize py-4 px-12">
          {InstitutionBuilderDict[userLanguage]['GENERAL_INFORMATION']}
        </h3>
      ) : (
        <BreadcrumbsWithBanner
          items={breadCrumbsList}
          bannerImage={bannerImage}
          title={InstitutionBuilderDict[userLanguage]['TITLE']}
        />
      )}
      {/* <div className={'flex justify-between px-8'}>
        <SectionTitle
          title={
            isEditPage
              ? InstitutionBuilderDict[userLanguage]['GENERAL_INFORMATION']
              : InstitutionBuilderDict[userLanguage]['TITLE']
          }
          // subtitle={InstitutionBuilderDict[userLanguage]['SUBTITLE']}
        />
      </div> */}
      {!isEditPage && (
        <div className="flex justify-end py-4 mb-4 w-full">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={() => null}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      )}
      <div className="px-4">
        <PageWrapper defaultClass={isEditPage ? 'px-0 -mt-8' : 'px-4 white_back'}>
          <div className="w-full m-auto">
            <StepComponent
              steps={steps}
              activeStep={activeStep}
              handleTabSwitch={handleTabSwitch}
            />
            <div
              className={`grid grid-cols-1 divide-x-0 divide-gray-400 px-2 lg:px-8 mt-4 lg:mt-0`}>
              {loading ? (
                <div className="h-100 flex justify-center items-center">
                  <div className="w-5/10">
                    <Loader />
                    <p className="mt-2 text-center">
                      Fetching institution details please wait...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-0 lg:border-t-none border-gray-200">
                  {currentStepComp(activeStep)}
                </div>
              )}
            </div>
          </div>
        </PageWrapper>
      </div>
    </div>
  );
};

export default InstitutionBuilder;
