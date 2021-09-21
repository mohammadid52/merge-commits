import React, {Fragment, useContext, useEffect, useState} from 'react';
import {FaChalkboardTeacher, FaGraduationCap, FaHandshake, FaHotel} from 'react-icons/fa';
import {HiPencil} from 'react-icons/hi';
import {IoPeople} from 'react-icons/io5';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import {getImageFromS3} from '../../../../utilities/services';
import {
  formatPhoneNumber,
  getHostNameFromUrl,
  getInitialsFromString,
  initials,
  stringToHslColor,
} from '../../../../utilities/strings';
import Tooltip from '../../../Atoms/Tooltip';
import Tabs, {ITabElements} from '@atoms/Tabs';
import UnderlinedTabs from '../../../Atoms/UnderlinedTabs';
import ClassList from './Listing/ClassList';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';
import ServiceProviders from './Listing/ServiceProviders';
import StaffBuilder from './Listing/StaffBuilder';
import GeneralInformation from './GeneralInformation';
import LessonsList from '@components/Dashboard/Admin/LessonsBuilder/LessonsList';
import Csv from '@components/Dashboard/Csv/Csv';

interface InstitutionInfoProps {
  institute?: InstInfo;
  updateServiceProviders: Function;
  tabProps?: any;
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
  const {institute, tabProps} = instProps;
  const match = useRouteMatch();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState();
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {Institute_info} = useDictionary(clientKey);

  const tabs: ITabElements[] = [
    {
      title: Institute_info[userLanguage]['TABS']['GENERAL_INFORMATION'],
      key: 'general_information',
      content: (
        <>
          <GeneralInformation instituteInfo={institute} />
          <ServiceProviders
            serviceProviders={institute.serviceProviders}
            instId={institute?.id}
            updateServiceProviders={instProps.updateServiceProviders}
            instName={institute?.name}
          />
        </>
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['STAFF'],
      key: 'staff',
      content: (
        <StaffBuilder
          serviceProviders={institute.serviceProviders}
          instituteId={instProps?.institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['CLASSES'],
      key: 'class',
      content: (
        <ClassList
          classes={institute?.classes}
          instId={institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['CURRICULAR'],
      key: 'curricular',
      content: (
        <CurriculumList
          curricular={instProps?.institute?.curricula}
          instId={institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['SERVICE_PROVIDER'],
      key: 'service_provider',
      content: (
        <ServiceProviders
          serviceProviders={institute.serviceProviders}
          instId={institute?.id}
          updateServiceProviders={instProps.updateServiceProviders}
          instName={institute?.name}
        />
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
      key: 'class_room',
      content: <RoomsList instId={institute?.id} instName={institute?.name} />,
    },
    {
      title: Institute_info[userLanguage]['TABS']['LESSONS'],
      key: 'lessons',
      content: (
        <div className="p-8">
          <LessonsList
            isInInstitution
            title={`${institute?.name} lessons`}
            instId={institute?.id}
          />
        </div>
      ),
    },
    {
      title: Institute_info[userLanguage]['TABS']['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      content: (
        <div className="p-8">
          <Csv />
        </div>
      ),
    },
  ];

  const updateTab = (tab: string) => {
    console.log(tab, 'inside updateTab');

    tabProps.setTabsData({...tabProps.tabsData, inst: tab});

    // if(tab === 'lessons'){
    //   history.push(`/dashboard/lesson-builder?institutionId=${institute?.id}&from=institution`)
    // }else{
    //   tabProps.setTabsData({...tabProps.tabsData, inst: tab});
    // }
  };

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(instProps?.institute.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [instProps?.institute.image]);

  const {
    id,
    name,
    image,
    type,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    website,
    isServiceProvider,
  } = instProps?.institute;
  const activeTabContent = tabs.find(({key}: any) => key === tabProps.tabsData.inst);

  return (
    <div>
      <div className="h-9/10 flex px-0 md:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col md:flex-row border-gray-200 border-b-0 flex justify-center md:justify-start">
          <div className="w-auto p-4 mr-2 2xl:mr-4 flex flex-col text-center flex-shrink-0">
            {image ? (
              imageUrl ? (
                <img
                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light`}
                  src={imageUrl}
                />
              ) : (
                <div
                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 bg-gray-400 shadow-elem-light`}
                />
              )
            ) : (
              <div
                className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex flex-shrink-0 justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
                <div
                  className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                  style={{
                    /*  stylelint-disable */
                    background: `${
                      name
                        ? stringToHslColor(
                            getInitialsFromString(name)[0] +
                              ' ' +
                              getInitialsFromString(name)[1]
                          )
                        : null
                    }`,
                    textShadow: '0.2rem 0.2rem 3px #423939b3',
                  }}>
                  {name &&
                    initials(
                      getInitialsFromString(name)[0],
                      getInitialsFromString(name)[1]
                    )}
                </div>
              </div>
            )}

            <div className="text-xl font-bold flex items-center text-gray-900 mt-4 w-48">
              <p>{name ? name : ''}</p>
              <Tooltip key={'id'} text={'Edit Institution Details'} placement="top">
                <span
                  className={`w-auto cursor-pointer hover:${theme.textColor[themeColor]}`}>
                  <HiPencil
                    className="w-6 h-6 pl-2"
                    onClick={() => history.push(`${match.url}/edit?id=${id}`)}
                  />
                </span>
              </Tooltip>
            </div>
          </div>

          <div className="">
            <div className="bg-white border-l-0 border-gray-200 mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 2xl:px-6">
                <Tabs
                  tabsData={tabs}
                  activeTab={tabProps.tabsData.inst}
                  updateTab={updateTab}
                />
                {/* <h3 className="text-lg flex items-center leading-6 font-medium text-gray-900">
                  {Institute_info[userLanguage]['TITLE']}
                  </h3> */}
              </div>
              <div className="overflow-hidden">{activeTabContent?.content}</div>
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
