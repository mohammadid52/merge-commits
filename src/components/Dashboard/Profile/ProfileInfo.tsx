import React, { Fragment, useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { FaEdit } from 'react-icons/fa';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { RiLock2Fill } from 'react-icons/ri';
import { BsLockFill } from 'react-icons/bs';

import Dropdown from './Dropdown';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { UserInfo } from './Profile';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import ToolTip from '../../General/ToolTip/ToolTip';
import useDictionary from '../../../customHooks/dictionary';
import { getUserRoleString } from '../../../utilities/strings';
interface UserInfoProps {
  user: UserInfo;
  status: string;
  stdCheckpoints: any[];
  questionData: any[];
}

const ProfileInfo = (props: UserInfoProps) => {
  const { user, status, stdCheckpoints, questionData } = props;
  const { userLanguage, clientKey } = useContext(GlobalContext);
  const { dashboardProfileDict } = useDictionary(clientKey);
  const match = useRouteMatch();

  const language = () => {
    if (user.language === 'EN') {
      return 'English';
    } else if (user.language === 'ES') {
      return 'Spanish';
    }
  };

  // let changeToUsFormat = (actualDate: string) => {
  //   let date = new Date(actualDate);
  //   return (
  //     (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
  //   )
  // }
  const getQuestionResponse = (checkpointID: string, questionID: string) => {
    const selectedCheckp: any = questionData.find((item) => item.checkpointID === checkpointID);
    if (selectedCheckp) {
      const questionResponce: any = selectedCheckp.responseObject?.find((item: any) => item.qid === questionID)
        ?.response;
      return questionResponce ? questionResponce.join(',') : '--';
    }
  };

  if (status !== 'done') {
    return <LessonLoading />;
  }

  {
    return (
      <div className="w-full md:px-4 pt-4">
        <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
          <div className="border-b-0 border-gray-200 sm:px-6">
            <h3 className="px-0 pr-0 py-5 text-lg leading-6 font-medium text-gray-900 uppercase">
              {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['TITLE']}{' '}
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 grid-rows-2 gap-x-2 gap-y-4 sm:grid-cols-3">
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['FIRST_NAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">{`${user.firstName}`}</dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['LAST_NAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">{`${user.lastName}`}</dd>
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
                <dd className="mt-1 text-sm leading-5 text-gray-900">{language()}</dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['EMAIL']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">{`${user.email}`}</dd>
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
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 flex items-center justify-start font-medium text-gray-500">
                  {/* {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['ROLE']} */}

                  <NavLink className="flex items-center justify-center w-auto" to={`${match.url}/password`}>
                    <p className="w-auto mr-2">Password</p>
                    <IconContext.Provider
                      value={{ className: 'w-auto', size: '1rem', color: 'rgba(160, 174, 192, 1)' }}>
                      <RiLock2Fill />
                    </IconContext.Provider>
                  </NavLink>
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">*******</dd>
              </div>
            </dl>
          </div>
        </div>

        {stdCheckpoints?.length > 0 ? (
          <Fragment>
            {stdCheckpoints.map((checkpoint: any) => (
              <Fragment key={checkpoint.id}>
                <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
                  <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 uppercase">{checkpoint.title}</h3>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      {checkpoint.questions?.items.map((item: any) => (
                        <div className="sm:col-span-1 p-2">
                          <dt className="text-sm leading-5 font-medium text-gray-500">
                            {/* {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['INSTITUTION']} */}
                            {item.question.question}
                          </dt>
                          <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {getQuestionResponse(checkpoint.id, item.question.id) || '--'}
                            {/* {`${user.institution ? user.institution : 'Rose M. Avalos P-TECH Early College'}`} */}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Fragment>
            ))}
          </Fragment>
        ) : null}
      </div>
    );
  }
};

export default ProfileInfo;
