import {Fragment} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {LockOutlined} from '@ant-design/icons';
import Buttons from '@components/Atoms/Buttons';
import {Card, Descriptions, Tabs, TabsProps} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getUserRoleString} from 'utilities/strings';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import {UserInfo} from './Profile';
import useAuth from '@customHooks/useAuth';
import DemographicsInfo from '../Demographics/DemographicsInfo';
interface UserInfoProps {
  user: UserInfo;
  status: string;
  stdCheckpoints: any[];
  questionData: any[];
}

const ProfileInfo = (props: UserInfoProps) => {
  const {user, status, stdCheckpoints, questionData} = props;
  const {userLanguage} = useGlobalContext();
  const {dashboardProfileDict, UserInformationDict} = useDictionary();

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

  const {isStudent} = useAuth();

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const dict = UserInformationDict[userLanguage];

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: dict['heading'],
      children: (
        <Card>
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

                {isStudent && (
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
                )}
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
        </Card>
      )
    },

    {
      disabled: !isStudent,
      key: '2',
      label: dict['demographics'],
      children: (
        <DemographicsInfo checkpoints={stdCheckpoints} questionData={questionData} />
      )
    }
  ];

  {
    return (
      <div className="w-full md:px-4 pt-4">
        <Tabs animated defaultActiveKey="1" items={items} />
      </div>
    );
  }
};

export default ProfileInfo;
