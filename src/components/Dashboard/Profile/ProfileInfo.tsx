import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit } from 'react-icons/fa';
import { NavLink, useRouteMatch } from 'react-router-dom';

import Dropdown from './Dropdown';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { UserInfo } from './Profile';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import ToolTip from '../../General/ToolTip/ToolTip'
import useDictionary from '../../../customHooks/dictionary';
import { getUserRoleString } from '../../../utilities/strings';
interface UserInfoProps {
  user: UserInfo
  status: string
}

const ProfileInfo = (props: UserInfoProps) => {
  const { user, status } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { dashboardProfileDict } = useDictionary(clientKey);
  const match = useRouteMatch();

  const language = () => {
    if (user.language === 'EN') {
      return 'English'
    } else if (user.language === 'ES') {
      return 'Spanish'
    }
  }

  // let changeToUsFormat = (actualDate: string) => {
  //   let date = new Date(actualDate);
  //   return (
  //     (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
  //   )
  // }

  if (status !== 'done') {
    return (
      <LessonLoading />
    )
  }

  {

    return (
      <div className="w-full md:px-4 pt-4">
        <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
          <div className="flex justify-between border-b border-gray-200 sm:px-6">
            <h3 className="px-4 py-5 text-lg leading-6 font-medium text-gray-900">
              {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['TITLE']}
            </h3>
            {/* <div className="py-2 flex">
              <Dropdown />
            </div> */}
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['FIRST_NAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.firstName}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['LAST_NAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.lastName}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['NICKNAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.preferredName ? user.preferredName : '--'}`}
                </dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['BIRTHDAY']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.birthdate ? changeToUsFormat(user.birthdate) : 'not set'}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['LANGUAGE']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {language()}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['EMAIL']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.email}`}
                </dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['CONTACT']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.phone ? user.phone : '--'}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['ROLE']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.role ? getUserRoleString(user.role) : '--'}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['TITLE']}
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 col-gap-4 row-gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['INSTITUTION']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.institution ? user.institution : 'Rose M. Avalos P-TECH Early College'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['GRADE']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.grade ? user.grade : 'not set'}`}
                </dd>
              </div>
            </dl>
          </div>
        </div> */}
      </div>
    )
  }
}

export default ProfileInfo;