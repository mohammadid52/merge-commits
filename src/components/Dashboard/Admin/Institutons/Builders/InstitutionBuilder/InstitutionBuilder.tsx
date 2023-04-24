import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import {RoomStatus} from 'API';
import {Empty} from 'antd';
import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import PageLayout from 'layout/PageLayout';
import StaffBuilder from '../../Listing/StaffBuilder';
import InstitutionFormComponent from './InstitutionFormComponent';
import ServiceProviderList from './ServiceProviderList';

interface InstitutionBuilderProps {
  institutionId?: string;
  institute?: any;
  loading?: boolean;
  postInfoUpdate?: (data: any) => void;
  toggleUpdateState?: () => void;
  updateServiceProviders?: Function;
  inside?: boolean;
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
  postInfoUpdate,
  inside
}: InstitutionBuilderProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const params = useQuery(location.search);

  const step = params.get('step');

  const {InstitutionBuilderDict, userLanguage} = useDictionary();
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
    status: RoomStatus.ACTIVE,
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
      title: 'Service Providers',
      subTitle: 'institutions where you provide a service',
      stepValue: 'service_providers',
      disabled: Boolean(!institutionInfo.isServiceProvider),
      hide: Boolean(inside)
    },

    {
      title: 'Staff',
      description: "institution's staff",
      stepValue: 'staff',
      hide: Boolean(inside),
      disabled: Boolean(!institutionInfo.id)
    }
  ].filter((step) => !step.hide);

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

  // const updateServiceProviders = (item: any) => {
  //   setInstitutionInfo((prevData: any) => ({
  //     ...prevData,
  //     serviceProviders: {
  //       ...prevData.serviceProviders,
  //       items: [...(prevData.serviceProviders.items || []), item]
  //     }
  //   }));
  // };

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <InstitutionFormComponent
            institutionInfo={institutionInfo}
            postMutation={postMutation}
          />
        );

      case 'service_providers':
        return <ServiceProviderList postMutation={postInfoUpdate} id={institute?.id} />;

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
