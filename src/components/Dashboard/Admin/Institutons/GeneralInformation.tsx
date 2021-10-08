import React, {Fragment, useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {formatPhoneNumber, getHostNameFromUrl} from '@utilities/strings';

interface IGeneralInformationProps {
  instituteInfo: any;
}

const GeneralInformation = ({instituteInfo}: IGeneralInformationProps) => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {Institute_info} = useDictionary(clientKey);
  const {
    type,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    website,
    isServiceProvider,
  } = instituteInfo;

  return (
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
          <span className="w-auto">{phone ? formatPhoneNumber(phone) : '--'}</span>
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
  );
};

export default GeneralInformation;
