import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import Status from 'atoms/Status';
import axios from 'axios';
import {classNames} from 'components/Lesson/UniversalLessonBuilder/UI/FormElements/TextInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import LessonLoading from 'lesson/Loading/ComponentLoading';
import React, {Fragment, useState} from 'react';
import {FiAlertCircle} from 'react-icons/fi';
import {IoLockClosed} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {requestResetPassword} from 'utilities/urls';
import {UserInfo} from './User';
import UserRole from './UserRole';

const statusDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
};
interface UserInfoProps {
  user: UserInfo;
  status: string;
  questionData: any;
  checkpoints: any;
  tab: string;
  setTab: Function;
}

const UserInformation = ({
  user,
  status,
  checkpoints,
  questionData,
  tab,
  setTab
}: UserInfoProps) => {
  const {theme, userLanguage, clientKey} = useGlobalContext();
  const {UserInformationDict} = useDictionary();
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });

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
      if (questionResponce) {
        const stringedResponse = questionResponce.toString();

        if (stringedResponse.includes('Other')) {
          const splitAnswer = stringedResponse.split(' || '); // this will return ["Other", "answer"]
          const answer = splitAnswer[1];
          if (answer) return answer;
          else return 'Other';
        } else {
          return questionResponce ? questionResponce.join(',') : '--';
        }
      }
    }
  };

  const themeColor = getAsset(clientKey, 'themeClassName');
  const getColor = (condition: boolean) => ({
    borderColor: condition ? `${theme.iconColor[themeColor]}` : 'transparent',
    color: condition ? `${theme.iconColor[themeColor]}` : '#6B7280'
  });

  const resetPassword = async () => {
    try {
      setLoading(true);
      await axios.post(requestResetPassword, {email: user.email});
      setResetPasswordServerResponse({
        show: true,
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_SUCCESS']
      });
      setLoading(false);
    } catch (err) {
      console.log('error', err);
      setResetPasswordServerResponse({
        show: true,
        message: UserInformationDict[userLanguage]['MESSAGE']['RESET_PASSWORD_FAILURE']
      });
      setLoading(false);
    }
  };
  const onAlertClose = () => {
    setResetPasswordServerResponse({
      show: false,
      message: ''
    });
  };

  if (status !== 'done') {
    return <LessonLoading />;
  } else {
    return (
      <div className="w-3/4 md:px-2 pt-2">
        <div className="mb-4">
          {/* TABS */}
          <div className="border-b-0 border-gray-200">
            <nav
              className="-mb-px flex space-x-8 overflow-x-auto custom-scrollbar"
              aria-label="Tabs">
              <a
                onClick={() => setTab('p')}
                key="personal_information"
                style={{...getColor(tab === 'p')}}
                className={classNames(
                  'cursor-pointer text-gray-500  hover:text-gray-700 hover:border-gray-200',
                  'whitespace-nowrap justify-center flex py-4 px-1 border-b-2 font-medium text-sm ml-2'
                )}>
                {UserInformationDict[userLanguage]['heading']}
              </a>
              {user?.role === 'ST' && (
                <>
                  <a
                    onClick={() => setTab('demographics')}
                    key="demographics"
                    style={{...getColor(tab === 'demographics')}}
                    className={classNames(
                      'cursor-pointer text-gray-500  hover:text-gray-700 hover:border-gray-200',
                      'whitespace-nowrap justify-center flex py-4 px-1 border-b-2 font-medium text-sm ml-2'
                    )}>
                    {UserInformationDict[userLanguage]['demographics']}
                  </a>
                  <a
                    onClick={() => setTab('private')}
                    key="private"
                    style={{...getColor(tab === 'private')}}
                    className={classNames(
                      'cursor-pointer text-gray-500  hover:text-gray-700 hover:border-gray-200',
                      'whitespace-nowrap justify-center flex py-4 px-1 border-b-2 font-medium text-sm ml-2'
                    )}>
                    {UserInformationDict[userLanguage]['private']}
                    <IconContext.Provider
                      value={{
                        size: '0.8rem',
                        className: classNames(
                          'group-hover:text-gray-500',
                          'ml-2 h-5 w-5'
                        ),
                        color: getColor(tab === 'private').color
                      }}>
                      <IoLockClosed />
                    </IconContext.Provider>
                  </a>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* USER INFO FIRST TAB */}
        {tab === 'p' && (
          <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg">
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
                    <Status status={user.status} />{' '}
                    {Boolean(user.inactiveStatusDate) && (
                      <span
                        className="text-xs"
                        title={`Status changed to inactive on ${statusDate(
                          user.inactiveStatusDate
                        )}`}>
                        {statusDate(user.inactiveStatusDate)}
                      </span>
                    )}
                  </dd>
                </div>

                <div className="sm:col-span-1 p-2">
                  <dt className="text-sm leading-5 font-regular text-gray-600">
                    {UserInformationDict[userLanguage]['email']}
                  </dt>
                  <dd className="mt-2 text-base leading-5 text-gray-900">{`${user.email}`}</dd>
                </div>

                <div className="sm:col-span-1 p-2">
                  <dt className="text-sm leading-5 font-regular text-gray-600">
                    {UserInformationDict[userLanguage]['account']}
                  </dt>
                  <dd className="mt-2 text-base leading-5 text-gray-900">{created()}</dd>
                </div>
                {/*----ON DEMAND TOGGLE----*/}
                {user.role === 'ST' && (
                  <div className="sm:col-span-1 p-2">
                    <dt className="text-sm leading-5 font-regular text-gray-600">
                      {UserInformationDict[userLanguage]['ondemand']}
                    </dt>
                    <dd
                      data-cy="self-paced-text"
                      className="mt-2 text-base leading-5 text-gray-900">
                      <Status status={user?.onDemand ? 'YES' : 'NO'} />
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-1 p-2 flex items-centers">
                  <Buttons
                    dataCy="reset-password-button"
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
          </div>
        )}

        {/* CHECKPOINTS AND DEMOGRAPHIC QUESTIONS */}
        {tab !== 'p' && checkpoints.length > 0 && (
          <Fragment>
            {checkpoints.map((checkpoint: any) => (
              <Fragment key={`checkpoint_${checkpoint.id}`}>
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
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Fragment>
            ))}
          </Fragment>
        )}
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
  }
};
export default UserInformation;
