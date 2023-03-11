import { useEffect, useState } from "react";
import NavBarRouter from "../NavBarRouter";
import InstitutionProfile from "./InstitutionProfile";

interface InstitutionInfoProps {
  institute?: InstInfo;
  loading: boolean;
  updateServiceProviders: Function;
  tabProps?: any;
  toggleUpdateState?: () => void;
  postInfoUpdate?: (data: any) => void;
}
export interface InstInfo {
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
  classes: { items: { name?: string; id: string }[] };
  curricula: { items: { name?: string; id: string }[] };
  isServiceProvider: boolean;
  serviceProviders?: {
    items: {
      id: string;
      providerID: string;
      status: string;
      providerInstitution?: any;
    }[];
  };
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const { institute } = instProps;

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
      ),
    });
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div>
      <div className="">
        {/* Profile section */}
        <div className="flex-col flex justify-center lg:justify-start w-full">
          <div className="flex flex-1 overflow-x-hidden mb-8">
            <div className="">
              <div className="">
                {/* {renderElementBySelectedMenu()} */}
                <NavBarRouter
                  {...instProps}
                  updateCurricularList={updateCurricularList}
                  curricular={curricular}
                />
              </div>
            </div>
          </div>

          <InstitutionProfile institute={institute} />
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
