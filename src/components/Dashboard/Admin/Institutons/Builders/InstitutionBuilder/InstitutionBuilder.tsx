import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import PageLayout from 'layout/PageLayout';
import InstitutionFormComponent from './InstitutionFormComponent';
import ServiceVendors from './ServiceVendors';
import StaffBuilder from '../../Listing/StaffBuilder';
import {Empty} from 'antd';

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

  const {
    state: {user},

    userLanguage
  } = useGlobalContext();

  const {InstitutionBuilderDict} = useDictionary();
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
    },
    {
      title: 'Staff',
      description: '',
      stepValue: 'staff',
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
      case 'staff':
        return institutionId ? (
          <StaffBuilder inner instituteId={institutionId} />
        ) : (
          <Empty description="Instution Id is not available" />
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout
      title={
        institute?.id ? 'Edit Institution' : InstitutionBuilderDict[userLanguage]['TITLE']
      }>
      <div className={`w-full h-full `}>
        <div className="w-full m-auto">
          <StepComponent
            steps={steps}
            activeStep={activeStep}
            handleTabSwitch={handleTabSwitch}
          />
          <div className={`grid grid-cols-1 divide-x-0 divide-light mt-4 lg:mt-0`}>
            {loading ? (
              <div className="h-100 flex justify-center items-center">
                <Loader withText="Fetching institution details please wait..." />
              </div>
            ) : (
              <div className="border-0 lg:border-t-none border-light">
                {currentStepComp(activeStep)}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default InstitutionBuilder;
