import React, {useContext} from 'react';

import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import {FiAlertCircle} from 'react-icons/fi';
import Status from 'atoms/Status';
import UserRole from 'components/Dashboard/Admin/UserManagement/UserRole';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {NavLink} from 'react-router-dom';
import DropdownForm from 'components/Dashboard/Profile/DropdownForm';

interface IProfileFrameInfo {
  user: any;
  loading: boolean;
  onChange: (e: any) => void;
  handleChangeLanguage: (lang: {name: string; code: string}) => void;
  gobackToPreviousStep: any;
  saveProfileInformation: any;
  language: any[];
}

const ProfileFrameEdit = ({
  user,
  loading,
  onChange,
  handleChangeLanguage,
  gobackToPreviousStep,
  saveProfileInformation,
  language
}: IProfileFrameInfo) => {
  // ~~~~~~~~~~~~~~~ CONTEXT ~~~~~~~~~~~~~~~ //
  const {theme, userLanguage, clientKey} = useContext(GlobalContext);
  // ~~~~~~~~~~~~~~ DICTIONARY ~~~~~~~~~~~~~ //
  const {dashboardProfileDict} = useDictionary(clientKey);
  const {UserInformationDict} = useDictionary(clientKey);

  return (
    <div className="m-auto p-2 bg-white rounded z-50">
      {/* <div className="flex justify-end py-2 mb-2 w-full">
        <h3 className="text-sm md:text-lg leading-6 font-medium text-gray-900 uppercase">
          {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['TITLE']}
        </h3>
      </div> */}
      {/* SAVE */}
      <form>
        <div className="h-full">
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 text-gray-900">
            <>
              <div className="sm:col-span-3 p-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-5 text-gray-700">
                  {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['FIRST_NAME']}
                </label>
                <div className="mt-1 border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                  <input
                    id="firstName"
                    onChange={onChange}
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    defaultValue={user && user.firstName}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 p-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-5 text-gray-700">
                  {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LAST_NAME']}
                </label>
                <div className="mt-1 border-0 border-gray-300 py-2 px-3 rounded-md shadow-sm">
                  <input
                    id="lastName"
                    onChange={onChange}
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    defaultValue={user && user.lastName}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 p-2">
                <label
                  htmlFor="preferredName"
                  className="block text-sm font-medium leading-5 text-gray-700">
                  {dashboardProfileDict[userLanguage]['EDIT_PROFILE']['NICKNAME']}
                </label>
                <div className="border-0 border-gray-300 py-2 px-3 mt-1 rounded-md shadow-sm">
                  <input
                    id="preferredName"
                    onChange={onChange}
                    className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    defaultValue={user && user.preferredName}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 p-2">
                <DropdownForm
                  handleChangeLanguage={handleChangeLanguage}
                  userLanguage={user && user.language}
                  label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['LANGUAGE']}
                  items={language}
                />
              </div>
            </>
          </div>
        </div>
        <div className="flex justify-center">
          <Buttons
            btnClass="py-1 px-4 text-xs mr-2"
            label={dashboardProfileDict[userLanguage]['EDIT_PROFILE']['CANCEL']}
            onClick={gobackToPreviousStep}
            transparent
          />
          <Buttons
            btnClass="py-1 px-8 text-xs ml-2"
            label={
              loading
                ? 'Updating...'
                : dashboardProfileDict[userLanguage]['EDIT_PROFILE']['SAVE']
            }
            onClick={saveProfileInformation}
            disabled={loading ? true : false}
          />
        </div>
      </form>
    </div>
  );
};
export default ProfileFrameEdit;
