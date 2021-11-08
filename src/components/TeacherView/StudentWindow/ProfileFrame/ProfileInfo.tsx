import React, {useContext} from 'react';

import Buttons from '@atoms/Buttons';
import Modal from '@components/Atoms/Modal';
import {FiAlertCircle} from 'react-icons/fi';
import Status from '@components/Atoms/Status';
import UserRole from '@components/Dashboard/Admin/UserManagement/UserRole';
import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {FaEdit} from 'react-icons/fa';

interface IProfileFrameInfo {
  user: any;
  created: () => string;
  loading: boolean;
  resetPasswordServerResponse: {
    show: boolean;
    message: string;
  };
  resetPassword: () => Promise<void>;
  onAlertClose: () => void;
  setIsEditing: any;
}

const ProfileFrameInfo = ({
  user,
  created,
  loading,
  resetPasswordServerResponse,
  resetPassword,
  onAlertClose,
  setIsEditing,
}: IProfileFrameInfo) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const {theme, userLanguage, clientKey} = useContext(GlobalContext);
  // ~~~~~~~~~~~~~~ DICTIONARY ~~~~~~~~~~~~~ //
  const {dashboardProfileDict} = useDictionary(clientKey);
  const {UserInformationDict} = useDictionary(clientKey);

  return (
    <div className="m-auto p-2 bg-white shadow-5 rounded z-50">
      {/* USER INFO FIRST TAB */}

      <div className="bg-white overflow-hidden sm:rounded-lg">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['fullname']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">{`${
              user && user.firstName
            } ${user && user.lastName}`}</dd>
          </div>
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['nickname']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">
              {`${user && user.preferredName ? user && user.preferredName : 'not set'}`}
            </dd>
          </div>
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['role']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">
              <UserRole role={user && user.role} />
            </dd>
          </div>
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['status']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">
              <Status status={user && user.status} />
            </dd>
          </div>
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['email']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">{`${
              user && user.email
            }`}</dd>
          </div>

          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['account']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">{created()}</dd>
          </div>
          {/*----ON DEMAND TOGGLE----*/}
          <div className="sm:col-span-1 p-2">
            <dt className="text-sm leading-5 font-regular text-gray-600">
              {UserInformationDict[userLanguage]['ondemand']}
            </dt>
            <dd className="mt-2 text-base leading-5 text-gray-900">
              <Status status={user?.onDemand ? 'YES' : 'NO'} />
            </dd>
          </div>
          <div className="sm:col-span-1 p-2 flex items-centers">
            <Buttons
              label={
                loading
                  ? UserInformationDict[userLanguage]['RESETTING_PASSWORD']
                  : UserInformationDict[userLanguage]['RESET_PASSWORD']
              }
              onClick={resetPassword}
              disabled={loading}
            />
          </div>
        </dl>
      </div>

      {resetPasswordServerResponse.show && (
        <Modal showHeader={false} showFooter={false} closeAction={onAlertClose}>
          <div className="py-8 px-16">
            <div className="mx-auto flex items-center justify-center rounded-full">
              <FiAlertCircle className="w-8 h-8" />
            </div>
            <div className="mt-4">{resetPasswordServerResponse.message}</div>
            <div className="flex justify-center mt-4">
              <Buttons
                btnClass={'abc'}
                label={'Ok'}
                labelClass={'leading-6'}
                onClick={onAlertClose}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ProfileFrameInfo;
