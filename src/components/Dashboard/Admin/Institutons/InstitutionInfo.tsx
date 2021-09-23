import React, {Fragment, useContext, useEffect, useState} from 'react';
import {HiPencil} from 'react-icons/hi';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';
import {IoIosGlobe} from 'react-icons/io';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
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
import Registration from '@components/Dashboard/Admin/UserManagement/Registration';

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

  const headerMenusForInstitution = [
    {
      title: 'Institution Manager',
      key: 'institution',
      type: 'dropdown',
      children: [
        {
          title: Institute_info[userLanguage]['TABS']['STAFF'],
          key: 'staff',
        },
        {
          title: 'Register',
          key: 'register',
        },
        {
          title: Institute_info[userLanguage]['TABS']['SERVICE_PROVIDER'],
          key: 'service_provider',
        },
      ],
    },
    {
      title: 'Course Manager',
      key: 'course',
      type: 'dropdown',
      children: [
        {
          title: 'Courses',
          key: 'course',
        },
        {
          title: 'Units',
          key: 'unit',
        },
        {
          title: Institute_info[userLanguage]['TABS']['LESSONS'],
          key: 'lessons',
        },
        {
          title: 'Game Changers ',
        },
      ],
    },
    {
      title: 'Class Manager',
      key: 'class',
      type: 'dropdown',
      children: [
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
          title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
          key: 'class_room',
          content: <RoomsList instId={institute?.id} instName={institute?.name} />,
        },
      ],
    },
    {
      title: 'Community Manager',
      key: 'community',
      type: 'dropdown',
      children: [
        {
          title: 'New Person Spotlight',
        },
        {
          title: 'Announcements & Events',
        },
        {
          title: 'Front Page',
        },
      ],
    },
    {
      title: Institute_info[userLanguage]['TABS']['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      content: (
        <div className="p-8">
          <Csv institutionId={institute?.id} />
        </div>
      ),
    },
  ];

  const updateTab = (tab: string) => {
    tabProps.setTabsData({...tabProps.tabsData, inst: tab});

    // if (tab === 'register') {
    //   history.push(`/dashboard/registration`);
    // } else if (tab === 'unit') {
    //   // history.push(`/dashboard/manage-institutions/${institute?.id}/curricular/${curricularId}/syllabus/add`)
    // } else {
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

  const renderElementBySelectedMenu = () => {
    switch (tabProps.tabsData.inst) {
      case 'service_provider':
        return (
          <ServiceProviders
            serviceProviders={institute.serviceProviders}
            instId={institute?.id}
            updateServiceProviders={instProps.updateServiceProviders}
            instName={institute?.name}
          />
        );
      case 'staff':
        return (
          <StaffBuilder
            serviceProviders={institute.serviceProviders}
            instituteId={instProps?.institute?.id}
            instName={institute?.name}
          />
        );
      case 'register':
        return <Registration isInInstitute />;
      case 'course':
        return (
          <CurriculumList
            curricular={instProps?.institute?.curricula}
            instId={institute?.id}
            instName={institute?.name}
          />
        );
      case 'lessons':
        return (
          <div className="p-8">
            <LessonsList
              isInInstitution
              title={`${institute?.name} lessons`}
              instId={institute?.id}
            />
          </div>
        );
      case 'class':
        return (
          <ClassList
            classes={institute?.classes}
            instId={institute?.id}
            instName={institute?.name}
          />
        );
      case 'class_room':
        return <RoomsList instId={institute?.id} instName={institute?.name} />;
      case 'research_and_analytics':
        return (
          <div className="p-8">
            <Csv institutionId={institute?.id} />
          </div>
        );
      default:
        break;
    }
  };

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
  return (
    <div>
      <div className="h-9/10 flex px-0 md:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col md:flex-row border-gray-200 border-b-0 flex justify-center md:justify-start">
          <div className="w-auto">
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
            <div className="mt-5">
              <div className="flex mt-2">
                <span className="w-auto mr-2 mt-0.5">
                  <BsEnvelope className="w-4 h-4 text-gray-500" />
                </span>
                <span className="w-auto text-gray-500">
                  {address && (
                    <Fragment>
                      {address + ', '} <br />
                    </Fragment>
                  )}
                  {addressLine2 && (
                    <Fragment>
                      {addressLine2 + ', '} <br />
                    </Fragment>
                  )}
                  {[city, state].filter(Boolean).join(', ')}
                  {city && state && <br />}
                  {zip && zip}
                </span>
              </div>
              <div className="flex mt-2 items-center">
                <span className="w-auto mr-2">
                  <FiPhone className="w-4 h-4 text-gray-500" />
                </span>
                <span className="w-auto text-gray-500">{phone ? formatPhoneNumber(phone) : '-'}</span>
              </div>
              <div className="flex mt-2 items-center">
                <span className="w-auto mr-2">
                  {isServiceProvider ? (
                    <BiCheckboxChecked className="w-4 h-4 text-gray-500" />
                  ) : (
                    <BiCheckbox className="w-4 h-4 text-gray-500" />
                  )}
                </span>
                <span className="w-auto text-gray-500">
                  {Institute_info[userLanguage]['SERVICE_PROVIDER']}
                </span>
              </div>
              <div className="flex mt-2 items-center">
                <span className="w-auto mr-2">
                  <IoIosGlobe className="w-4 h-4 text-gray-500" />
                </span>
                <span className="w-auto text-gray-500">
                  {website ? (
                    <a href={website} target="_blank" className={`hover:${theme.textColor[themeColor]}`}>
                      {Institute_info[userLanguage]['WEBSITE']}
                    </a>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="">
            <div className="bg-white border-l-0 border-gray-200 mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 2xl:px-6">
                <Tabs
                  tabsData={headerMenusForInstitution}
                  activeTab={tabProps.tabsData.inst}
                  updateTab={updateTab}
                  tabWithNumbers
                />
                {/* <h3 className="text-lg flex items-center leading-6 font-medium text-gray-900">
                  {Institute_info[userLanguage]['TITLE']}
                  </h3> */}
              </div>
              <div className="overflow-hidden min-h-80">{renderElementBySelectedMenu()}</div>
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
