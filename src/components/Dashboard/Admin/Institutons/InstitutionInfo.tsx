import React, { useState, useEffect, Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaHotel, FaHandshake } from 'react-icons/fa';

import { initials, stringToHslColor, formatPhoneNumber, getHostNameFromUrl, getInitialsFromString } from '../../../../utilities/strings';
import UnderlinedTabs from '../../../Atoms/UnderlinedTabs';
import { IoPeople } from 'react-icons/io5';
import { getImageFromS3 } from '../../../../utilities/services';
import ClassList from './Listing/ClassList';
import StaffBuilder from './Listing/StaffBuilder';
import ServiceProviders from './Listing/ServiceProviders';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';

interface InstitutionInfoProps {
  institute?: InstInfo;
  updateServiceProviders: Function
}
interface InstInfo {
  id: string
  name: string
  type: string
  website: string
  address: string
  addressLine2: string
  city: string
  state: string
  zip: string
  image: string
  phone: string
  classes: { items: { name?: string, id: string }[] }
  curricula: { items: { name?: string, id: string }[] }
  isServiceProvider: boolean
  serviceProviders: { items: { id: string, providerID: string }[] }
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const { institute } = instProps;
  const match = useRouteMatch();
  const [imageUrl, setImageUrl] = useState();

  const tabs = [
    { index: 0, title: 'Service Providers', icon: <FaHandshake />, active: false, content: <ServiceProviders serviceProviders={institute.serviceProviders} instId={institute?.id} updateServiceProviders={instProps.updateServiceProviders}/> },
    { index: 1, title: 'Staff', icon: <IoPeople />, active: true, content: <StaffBuilder serviceProviders={institute.serviceProviders} instituteId={instProps?.institute?.id} /> },
    { index: 2, title: 'Classes', icon: <FaChalkboardTeacher />, active: false, content: <ClassList classes={instProps?.institute?.classes} /> },
    { index: 3, title: 'Curricular', icon: <FaGraduationCap />, active: false, content: <CurriculumList curricular={instProps?.institute?.curricula} /> },
    { index: 4, title: 'Rooms', icon: <FaHotel />, active: false, content: <RoomsList instId={institute?.id} /> }
  ]

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(instProps?.institute.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [instProps?.institute.image]);

  const { name, image, type, address, addressLine2, city, state, zip, phone, website, isServiceProvider } = instProps?.institute
  return (
    <div>
      <div className="h-9/10 flex flex-col md:flex-row">

        {/* Profile section */}
        <div className="w-2/10 p-4 mr-4 flex flex-col text-center items-center">

          {image ?
            <img
              className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full border flex flex-shrink-0 border-gray-400 shadow-elem-light`}
              src={imageUrl}
            /> : <div className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex flex-shrink-0 justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
              <div className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                style={{ background: `${name ? (stringToHslColor(getInitialsFromString(name)[0] + ' ' + getInitialsFromString(name)[1])) : null}`, textShadow: '0.2rem 0.2rem 3px #423939b3' }}>
                {name && (
                  initials(getInitialsFromString(name)[0], getInitialsFromString(name)[1])
                )}
              </div>
            </div>}

          <div className="text-xl font-bold font-open text-gray-900 mt-4">
            <p>
              {name ? name : ''}
            </p>
          </div>
        </div>

        {/* General information section */}
        <div className='w-full'>
          <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>

            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                General Information
              </h3>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-400 p-4">
              <div className="p-8">
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Address:</span>
                  <span className="w-auto">
                    {address && (<Fragment>{address + ', '} <br /></Fragment>)}
                    {addressLine2 && (<Fragment>{addressLine2 + ', '} <br /></Fragment>)}
                    {city && (city + ', ')} {state && state} <br />
                    {zip && zip}
                  </span>
                </p>
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Contact No:</span>
                  <span className="w-auto">{phone ? formatPhoneNumber(phone) : '--'}</span>
                </p>
              </div>
              <div className="p-8">
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Institution Type:</span>
                  <span className="w-auto">{type ? type : '--'}</span>
                </p>
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Website:</span>
                  <span className="w-auto">{website ? getHostNameFromUrl(website) : '--'}</span>
                </p>
                <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                  <span className="text-gray-900 mr-2 w-3/10">Service Provider:</span>
                  <span className="w-auto">{isServiceProvider ? 'YES' : 'NO'}</span>
                </p>
              </div>
            </div>
          </div>
          {
            instProps?.institute?.id &&
            <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg'>
              <div className='px-4 py-5 sm:px-6'>
                <UnderlinedTabs tabs={tabs} />
              </div>
            </div>
          }
        </div>

      </div>
    </div >
  );
};

export default InstitutionInfo;
