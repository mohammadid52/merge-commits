import {Storage} from '@aws-amplify/storage';
import React, {useEffect, useState} from 'react';
import NavBarRouter from '../NavBarRouter';
import InstitutionProfile from './InstitutionProfile';

interface InstitutionInfoProps {
  institute?: InstInfo;
  loading: boolean;
  updateServiceProviders: Function;
  tabProps?: any;
  toggleUpdateState?: () => void;
  postInfoUpdate?: (data: any) => void;
}
interface InstInfo {
  id: string;
  name: string;
  type: string;
  website: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  phone: string;
  classes: {items: {name?: string; id: string}[]};
  curricula: {items: {name?: string; id: string}[]};
  isServiceProvider: boolean;
  serviceProviders?: {
    items: {id: string; providerID: string; status: string; providerInstitution?: any}[];
  };
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const {institute} = instProps;

  // ~~~~~~~~~~~ CURRICULAR LIST ~~~~~~~~~~~ //
  const [curricular, setCurricular] = useState<any>({});
  useEffect(() => {
    if (instProps?.institute?.curricula) {
      setCurricular(instProps?.institute?.curricula);
    }
  }, [instProps?.institute?.curricula]);

  const updateCurricularList = (itemObj: any) => {
    setCurricular({
      ...curricular,
      items: curricular.items.filter(
        (curriculumObj: any) => curriculumObj.id !== itemObj.id
      )
    });
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div>
      <div className="h-9/10 flex px-0 2xl:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col lg:flex-row flex justify-center lg:justify-start w-full">
          <InstitutionProfile institute={institute} />

          <div className="flex flex-1 overflow-auto">
            <div className="bg-white border-l-0 border-gray-200 mb-4 flex-1">
              <div className="overflow-hidden h-full">
                {/* {renderElementBySelectedMenu()} */}
                <NavBarRouter
                  {...instProps}
                  updateCurricularList={updateCurricularList}
                  curricular={curricular}
                />
              </div>
            </div>
          </div>
        </div>

        {/* {instProps?.institute?.id && (
          <div className="overflow-hidden sm:rounded-lg">
            <div className="">
              <UnderlinedTabs
                tabs={tabs}
                activeTab={tabProps.tabsData.inst}
                updateTab={updateTab}
              />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default InstitutionInfo;
