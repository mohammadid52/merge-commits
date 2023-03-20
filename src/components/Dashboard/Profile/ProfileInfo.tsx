import {Fragment} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {LockOutlined} from '@ant-design/icons';
import Buttons from '@components/Atoms/Buttons';
import {Descriptions} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getUserRoleString} from 'utilities/strings';
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
  const {userLanguage} = useGlobalContext();
  const {dashboardProfileDict} = useDictionary();

  const PersonalInfoDict = dashboardProfileDict[userLanguage]['PERSONAL_INFO'];

  const language = () => {
    if (user.language === 'EN') {
      return 'English';
    } else if (user.language === 'ES') {
      return 'Spanish';
    }
    return 'English';
  };

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

  const history = useHistory();
  const match = useRouteMatch();
  if (status !== 'done') {
    return <LessonLoading />;
  }

  {
    return (
      <div className="w-full md:px-4 pt-4">
        <div className="">
          <Descriptions
            extra={
              <div className="flex gap-4 items-center justify-center">
                <Buttons
                  tooltip="Change your password"
                  Icon={LockOutlined}
                  label={PersonalInfoDict['PASSWORD']}
                  size="small"
                  variant="dashed"
                  onClick={() => {
                    history.push(`${match.url}/password`);
                  }}
                />
                <Buttons
                  tooltip="Change your journal passcode"
                  onClick={() => {
                    history.push(`${match.url}/passcode`);
                  }}
                  Icon={LockOutlined}
                  label={PersonalInfoDict['PASSCODE']}
                  size="small"
                  variant="dashed"
                />
              </div>
            }
            title={PersonalInfoDict['TITLE']}>
            <Descriptions.Item label={PersonalInfoDict['FIRST_NAME']}>
              {user.firstName}
            </Descriptions.Item>
            <Descriptions.Item label={PersonalInfoDict['LAST_NAME']}>
              {user.lastName}
            </Descriptions.Item>
            <Descriptions.Item label={PersonalInfoDict['NICKNAME']}>
              {user?.preferredName || ''}
            </Descriptions.Item>
            <Descriptions.Item label={PersonalInfoDict['LANGUAGE']}>
              {language()}
            </Descriptions.Item>
            <Descriptions.Item label={PersonalInfoDict['ROLE']}>
              {getUserRoleString(user.role)}
            </Descriptions.Item>
            <Descriptions.Item span={2} label={PersonalInfoDict['EMAIL']}>
              {user.email}
            </Descriptions.Item>
          </Descriptions>
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
                      {checkpoint.questions?.items.map((item: any) => (
                        <div key={item.question.id} className="sm:col-span-1 p-2">
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
        ) : null}
      </div>
    );
  }
};

export default ProfileInfo;
