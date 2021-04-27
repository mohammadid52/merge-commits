import React, {useContext, useState} from 'react';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import {UserInfo} from './User';
import UserStatus from './UserStatus';
import UserRole from './UserRole';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserInfoProps {
  user: UserInfo;
  status: string;
  questionData: any;
  stdCheckpoints: any;
}

const UserInformation = (props: UserInfoProps) => {
  const {user, status, stdCheckpoints, questionData} = props;
  const {theme, userLanguage, clientKey, state} = useContext(GlobalContext);
  const {UserInformationDict, BreadcrumsTitles} = useDictionary(clientKey);

  const [tab, setTab] = useState('personal_information');

  let created = () => {
    let date = new Date(user.createdAt);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  };

  const getQuestionResponse = (checkpointID: string, questionID: string) => {
    const selectedCheckp: any = questionData.find(
      (item: any) => item.checkpointID === checkpointID
    );
    if (selectedCheckp) {
      const questionResponce: any = selectedCheckp.responseObject?.find(
        (item: any) => item.qid === questionID
      )?.response;
      return questionResponce ? questionResponce.join(',') : '--';
    }
  };

  if (status !== 'done') {
    return <LessonLoading />;
  }

  return (
    <div className="w-full md:px-2 pt-2">
      <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">
        <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <a
              onClick={() => setTab('personal_information')}
              key="personal_information"
              className={classNames(
                tab === 'personal_information'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700',
                'px-3 py-2 w-auto cursor-pointer font-medium text-sm rounded-md'
              )}>
              {UserInformationDict[userLanguage]['heading']}
            </a>
            {(state.user.role === 'FLW' ||
              state.user.role === 'TR' ||
              state.user.role === 'ADM') &&
              stdCheckpoints.length > 0 && (
                <a
                  onClick={() => setTab('personal_details')}
                  key="personal_details"
                  className={classNames(
                    tab === 'personal_details'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700',
                    'px-3 py-2 w-auto cursor-pointer font-medium text-sm rounded-md'
                  )}>
                  {UserInformationDict[userLanguage]['details']}
                </a>
              )}
          </nav>
          <h3 className="text-lg leading-6 font-medium text-gray-900"></h3>
        </div>

        {tab === 'personal_information' && (
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['fullname']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{`${user.firstName} ${user.lastName}`}</dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['nickname']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.preferredName ? user.preferredName : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['role']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserRole role={user.role} />
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['status']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserStatus status={user.status} />
                </dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Birthday
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.birthdate ? user.birthdate : 'not set'}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['email']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{`${user.email}`}</dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.phone}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  {UserInformationDict[userLanguage]['account']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{created()}</dd>
              </div>
            </dl>
          </div>
        )}
        {tab === 'personal_details' && (
          <div className="p-4">
            {(state.user.role === 'FLW' ||
              state.user.role === 'TR' ||
              state.user.role === 'ADM') && (
              <div>
                {stdCheckpoints?.length > 0 ? (
                  <>
                    {stdCheckpoints.map((checkpoint: any) => (
                      <div
                        key={checkpoint.id}
                        className="bg-white border-0 border-gray-200 overflow-hidden sm:rounded-lg mb-4">
                        <div className="px-4 py-2 border-b-0 border-gray-200 sm:px-6">
                          <h3 className="text-base leading-6 font-medium text-gray-900 uppercase">
                            {checkpoint.title}
                          </h3>
                        </div>
                        <div className="px-4 py-5 sm:px-6">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                            {checkpoint.questions?.items.map(
                              (item: any, index: number) => (
                                <div key={index} className="sm:col-span-1 p-2">
                                  <dt className="text-sm leading-5 font-medium text-gray-800">
                                    {/* {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['INSTITUTION']} */}
                                    {item.question.question}
                                  </dt>
                                  <dd className="mt-1 text-sm leading-5 text-gray-900">
                                    {getQuestionResponse(
                                      checkpoint.id,
                                      item.question.id
                                    ) || '--'}
                                    {/* {`${user.institution ? user.institution : 'Rose M. Avalos P-TECH Early College'}`} */}
                                  </dd>
                                </div>
                              )
                            )}
                          </dl>
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TODO: NEED TO CONFIRM FOR GIVING ACCESS TO ADMIN ON PROFILE BUILDER. */}
      {/* <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Institution Information
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Institution
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.institution ? user.institution : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-base leading-5 font-medium text-gray-500">
                  Grade
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.grade ? user.grade : 'not set'}`}
                </dd>
              </div>
            </dl>
          </div>
        </div> */}
    </div>
  );
};
export default UserInformation;
