import React, {Fragment, useContext} from 'react';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {RiLock2Fill} from 'react-icons/ri';
import {NavLink, useRouteMatch} from 'react-router-dom';

import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getUserRoleString} from 'utilities/strings';
import Tooltip from 'atoms/Tooltip';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import {UserInfo} from './Profile';
interface UserInfoProps {
  user: UserInfo;
  status: string;
  stdCheckpoints: any[];
  questionData: any[];
}

const ProfileInfo = (props: UserInfoProps) => {
  const {user, status, stdCheckpoints, questionData} = props;
  const {userLanguage, clientKey} = useContext(GlobalContext);
  const {dashboardProfileDict} = useDictionary(clientKey);
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
    const selectedCheckp: any = questionData.find(
      (item) => item.checkpointID === checkpointID
    );
    if (selectedCheckp) {
      const questionResponce: any = selectedCheckp.responseObject?.find(
        (item: any) => item.qid === questionID
      )?.response;

      const stringedResponse = questionResponce ? questionResponce.toString() : '';

      if (stringedResponse.includes('Other')) {
        const splitAnswer = stringedResponse.split(' || '); // this will return ["Other", "answer"]
        const answer = splitAnswer[1];
        if (answer) return answer;
        else return 'Other';
      } else {
        return questionResponce ? questionResponce.join(',') : '--';
      }
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
            <h3 className="px-0 pr-0 pl-2 py-2 md:pl-0 md:py-5 text-lg leading-6 font-medium text-gray-900 uppercase">
              {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['TITLE']}{' '}
            </h3>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-2 grid-rows-2 gap-x-1 sm:gap-x-2 gap-y-4 sm:grid-cols-3">
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
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['NICKNAME']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.preferredName ? user.preferredName : '--'}`}
                </dd>
              </div>

              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['LANGUAGE']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">{language()}</dd>
              </div>
              <div className="col-span-2 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['EMAIL']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">{`${user.email}`}</dd>
              </div>

              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 font-medium text-gray-500">
                  {dashboardProfileDict[userLanguage]['PERSONAL_INFO']['ROLE']}
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">
                  {`${user.role ? getUserRoleString(user.role) : '--'}`}
                </dd>
              </div>
              {/* PASSWORD */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 flex items-center justify-start font-medium text-gray-500">
                  <NavLink
                    className="flex items-center justify-center w-auto"
                    to={`${match.url}/password`}>
                    <Tooltip text="edit password">
                      <div className="flex items-center justify-center">
                        <p className="w-auto mr-2">
                          {
                            dashboardProfileDict[userLanguage]['PERSONAL_INFO'][
                              'PASSWORD'
                            ]
                          }
                        </p>
                        <IconContext.Provider
                          value={{
                            className: 'w-auto',
                            size: '1rem',
                            color: 'rgba(160, 174, 192, 1)'
                          }}>
                          <RiLock2Fill />
                        </IconContext.Provider>
                      </div>
                    </Tooltip>
                  </NavLink>
                </dt>
                <dd className="mt-1 text-sm leading-5 text-gray-900">*******</dd>
              </div>
              {/* PASSCODE */}
              <div className="sm:col-span-1 p-2">
                <dt className="text-sm leading-5 flex items-center justify-start font-medium text-gray-500">
                  <NavLink
                    className="flex items-center justify-center w-auto"
                    to={`${match.url}/passcode`}>
                    <Tooltip text="edit password">
                      <div className="flex items-center justify-center">
                        <p className="w-auto mr-2">
                          {
                            dashboardProfileDict[userLanguage]['PERSONAL_INFO'][
                              'PASSCODE'
                            ]
                          }
                        </p>
                        <IconContext.Provider
                          value={{
                            className: 'w-auto',
                            size: '1rem',
                            color: 'rgba(160, 174, 192, 1)'
                          }}>
                          <RiLock2Fill />
                        </IconContext.Provider>
                      </div>
                    </Tooltip>
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900 uppercase">
                      {checkpoint.title}
                    </h3>
                  </div>
                  <div className="px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      {checkpoint.questions?.items.map((item: any, index: number) => (
                        <div key={index} className="sm:col-span-1 p-2">
                          <dt className="text-sm leading-5 font-medium text-gray-500">
                            {/* {dashboardProfileDict[userLanguage]['INSTITUTION_INFO']['INSTITUTION']} */}
                            {item.question.question}
                          </dt>
                          <dd className="mt-1 text-sm leading-5 text-gray-900">
                            {item.question.type !== 'link' ? (
                              getQuestionResponse(checkpoint.id, item.question.id) || '--'
                            ) : (
                              <a
                                className="text-blue-400 hover:text-blue-600 transition-all"
                                href={getQuestionResponse(
                                  checkpoint.id,
                                  item.question.id
                                )}>
                                {getQuestionResponse(checkpoint.id, item.question.id)}
                              </a>
                            )}
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
