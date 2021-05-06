import React, {useContext, useState} from 'react';

import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import {UserInfo} from './User';
import UserStatus from './UserStatus';
import UserRole from './UserRole';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {IoLockClosed} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {isNaN} from 'lodash';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserInfoProps {
  user: UserInfo;
  status: string;
  questionData: any;
  stdCheckpoints: any;
  tab: string;
  setTab: Function;
}

const UserInformation = (props: UserInfoProps) => {
  const {user, status, stdCheckpoints, questionData, tab, setTab} = props;
  const {theme, userLanguage, clientKey, state} = useContext(GlobalContext);
  const {UserInformationDict, BreadcrumsTitles} = useDictionary(clientKey);

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

  const checkpointID =
    tab !== 'p' && stdCheckpoints.length > 0 && stdCheckpoints[parseInt(tab || '1')].id;

  const getCurrentTabQuestions = () => {
    if (checkpointID) {
      const questions = stdCheckpoints.filter((item: any) => item.id === checkpointID)[0];
      return questions?.questions?.items ? questions?.questions?.items : [];
    } else return [];
  };

  return (
    <div className="w-full md:px-2 pt-2">
      <div className="bg-white border-l-0 border-gray-200 overflow-hidden mb-4">
        <div className="border-b-0 border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <a
              onClick={() => setTab('p')}
              key="personal_information"
              className={classNames(
                tab === 'p'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent  cursor-pointer text-gray-500 hover:text-gray-700 hover:border-gray-200',
                'whitespace-nowrap justify-center flex py-4 px-1 border-b-2 font-medium text-sm'
              )}>
              {UserInformationDict[userLanguage]['heading']}
            </a>
            {(state.user.role === 'FLW' ||
              state.user.role === 'TR' ||
              state.user.role === 'ADM') &&
              stdCheckpoints.length > 0 &&
              stdCheckpoints.map((checkpoint: any, index: number) => {
                return (
                  <a
                    onClick={() => setTab(index)}
                    key={checkpoint.id}
                    className={classNames(
                      parseInt(tab, 10) === index
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                      'whitespace-nowrap flex justify-center cursor-pointer py-4 px-1 border-b-2 font-medium text-sm'
                    )}>
                    {checkpoint.title}
                    {checkpoint.scope === 'private' && (
                      <IconContext.Provider
                        value={{
                          size: '0.8rem',
                          className: classNames(
                            parseInt(tab, 10) === index
                              ? 'text-indigo-500'
                              : 'text-gray-400 group-hover:text-gray-500',
                            'ml-2 h-5 w-5'
                          ),
                        }}>
                        <IoLockClosed />
                      </IconContext.Provider>
                    )}
                  </a>
                );
              })}
          </nav>
          <h3 className="text-lg leading-6 font-medium text-gray-900"></h3>
        </div>

        {tab === 'p' && (
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['fullname']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{`${user.firstName} ${user.lastName}`}</dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['nickname']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.preferredName ? user.preferredName : 'not set'}`}
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['role']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserRole role={user.role} />
                </dd>
              </div>
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['status']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  <UserStatus status={user.status} />
                </dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  Birthday
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.birthdate ? user.birthdate : 'not set'}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['email']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{`${user.email}`}</dd>
              </div>
              {/* <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  Contact Number
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">
                  {`${user.phone}`}
                </dd>
              </div> */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-regular text-gray-600">
                  {UserInformationDict[userLanguage]['account']}
                </dt>
                <dd className="mt-2 text-base leading-5 text-gray-900">{created()}</dd>
              </div>
            </dl>
          </div>
        )}

        {tab !== 'p' && (
          <div style={{minHeight: 200}} className="px-4 py-5 sm:px-6">
            {getCurrentTabQuestions().map((item: any) => {
              return (
                <div className="sm:col-span-1 p-2">
                  <dt className="text-sm leading-5 font-regular text-gray-600">
                    {item.question.question}
                  </dt>
                  <dd className="mt-2 text-base leading-5 text-gray-900">
                    {getQuestionResponse(checkpointID, item.question.id) || '--'}
                  </dd>
                </div>
              );
            })}
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
