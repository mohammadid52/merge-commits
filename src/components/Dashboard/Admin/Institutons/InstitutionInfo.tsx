import React, {useState, useEffect, Fragment, useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {FaGraduationCap, FaChalkboardTeacher, FaHotel, FaHandshake} from 'react-icons/fa';

import {
  initials,
  stringToHslColor,
  formatPhoneNumber,
  getHostNameFromUrl,
  getInitialsFromString,
} from '../../../../utilities/strings';
import UnderlinedTabs from '../../../Atoms/UnderlinedTabs';
import {IoPeople} from 'react-icons/io5';
import {HiPencil} from 'react-icons/hi';
import {getImageFromS3} from '../../../../utilities/services';
import ClassList from './Listing/ClassList';
import StaffBuilder from './Listing/StaffBuilder';
import ServiceProviders from './Listing/ServiceProviders';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import Tooltip from '../../../Atoms/Tooltip';
import {getAsset} from '../../../../assets';

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
  const {Institute_info, BreadcrumsTitles} = useDictionary(clientKey);

  const tabs = [
    {
      index: 0,
      title: Institute_info[userLanguage]['TABS']['STAFF'],
      icon: <IoPeople />,
      active: true,
      content: (
        <StaffBuilder
          serviceProviders={institute.serviceProviders}
          instituteId={instProps?.institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      index: 1,
      title: Institute_info[userLanguage]['TABS']['CLASSES'],
      icon: <FaChalkboardTeacher />,
      active: false,
      content: (
        <ClassList
          classes={institute?.classes}
          instId={institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      index: 2,
      title: Institute_info[userLanguage]['TABS']['CURRICULAR'],
      icon: <FaGraduationCap />,
      active: false,
      content: (
        <CurriculumList
          curricular={instProps?.institute?.curricula}
          instId={institute?.id}
          instName={institute?.name}
        />
      ),
    },
    {
      index: 3,
      title: Institute_info[userLanguage]['TABS']['SERVICE_PROVIDER'],
      icon: <FaHandshake />,
      active: false,
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
      index: 4,
      title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
      icon: <FaHotel />,
      active: false,
      content: <RoomsList instId={institute?.id} instName={institute?.name} />,
    },
  ];

  const updateTab = (tab: number) => {
    tabProps.setTabsData({...tabProps.tabsData, inst: tab});
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
  return (
    <div>
      <div className="h-9/10 flex px-0 md:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col md:flex-row border-gray-200 border-b-0 flex items-center justify-center">
          <div className="w-auto p-4 mr-4 flex flex-col text-center items-center flex-shrink-0">
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

            <div className="text-xl font-bold  text-gray-900 mt-4 w-48">
              <p>{name ? name : ''}</p>
            </div>
          </div>

          {/* General information section */}
          <div className="">
            <div className="bg-white border-l-0 border-gray-200 mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                <h3 className="text-lg flex items-center leading-6 font-medium text-gray-900">
                  {Institute_info[userLanguage]['TITLE']}
                  <Tooltip key={'id'} text={'Edit Institution Details'} placement="top">
                    <span
                      className={`w-auto cursor-pointer hover:${theme.textColor[themeColor]}`}>
                      <HiPencil
                        className="w-6 h-6 pl-2"
                        onClick={() => history.push(`${match.url}/edit?id=${id}`)}
                      />
                    </span>
                  </Tooltip>
                </h3>
              </div>
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x-0 md:divide-gray-200 p-4">
                  <div className="p-2 px-4">
                    <p className="text-base leading-5 font-regular text-gray-800 my-3 flex">
                      <span className="text-gray-900 text-sm mr-2 w-3/10">
                        {' '}
                        {Institute_info[userLanguage]['ADDRESS']}:
                      </span>
                      <span className="w-auto">
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
                        {city && city + ', '} {state && state} <br />
                        {zip && zip}
                      </span>
                    </p>
                    <p className="text-base leading-5 font-regular text-gray-800 my-3 flex">
                      <span className="text-gray-900 text-sm mr-2 w-3/10">
                        {' '}
                        {Institute_info[userLanguage]['CONTACT']}:
                      </span>
                      <span className="w-auto">
                        {phone ? formatPhoneNumber(phone) : '--'}
                      </span>
                    </p>
                  </div>
                  <div className="p-2 px-4 md:px-8">
                    <p className="text-base leading-5 font-regular text-gray-800 my-3 flex">
                      <span className="text-gray-900 text-sm mr-2 w-3/10">
                        {' '}
                        {Institute_info[userLanguage]['INSTITUTION_TYPE']}:
                      </span>
                      <span className="w-auto">{type ? type : '--'}</span>
                    </p>
                    <p className="text-base leading-5 font-regular text-gray-800 my-3 flex">
                      <span className="text-gray-900 text-sm mr-2 w-3/10">
                        {' '}
                        {Institute_info[userLanguage]['WEBSITE']}:
                      </span>
                      {website ? (
                        <span className="w-auto hover:text-blue-700">
                          <a href={website} target="_blank">
                            {getHostNameFromUrl(website)}
                          </a>
                        </span>
                      ) : (
                        '--'
                      )}
                    </p>
                    <p className="text-base leading-5 font-regular text-gray-800 my-3 flex">
                      <span className="text-gray-900 text-sm mr-2 w-3/10">
                        {' '}
                        {Institute_info[userLanguage]['SERVICE_PROVIDER']}:
                      </span>
                      <span className="w-auto">{isServiceProvider ? 'YES' : 'NO'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {instProps?.institute?.id && (
          <div className="overflow-hidden sm:rounded-lg">
            <div className="">
              <UnderlinedTabs
                tabs={tabs}
                activeTab={tabProps.tabsData.inst}
                updateTab={updateTab}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstitutionInfo;
