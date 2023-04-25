import {LockOutlined} from '@ant-design/icons';
import DemographicsInfo from '@components/Dashboard/Demographics/DemographicsInfo';
import useAuth from '@customHooks/useAuth';
import {fallbackValue, getLanguageString, getUserRoleString} from '@utilities/strings';
import {Card, Descriptions, Tabs, TabsProps} from 'antd';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import axios from 'axios';
import useDictionary from 'customHooks/dictionary';
import {} from 'graphql/queries';
import {useEffect, useState} from 'react';
import {FiAlertCircle} from 'react-icons/fi';
import {useRouteMatch} from 'react-router-dom';
import {requestResetPassword} from 'utilities/urls';
import {UserInfo} from './User';
import {Status} from './UserStatus';
import moment from 'moment';

const fetchQuery = async (authId: string, query: string, filterKey: string) => {
  try {
    const res: any = await API.graphql(
      // @ts-ignore
      graphqlOperation(queries[query], {
        filter: {
          [filterKey]: {
            eq: authId
          }
        }
      })
    );

    return res?.data?.[query]?.items || [];
  } catch (error) {
    console.error(error);
  }
};

const statusDate = (dateValue: string) => {
  const date = new Date(dateValue);
  return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
};
interface UserInfoProps {
  user: UserInfo;

  questionData: any;
  checkpoints: any;

  isProfile?: boolean;
}

const UserInformation = ({user, checkpoints, questionData, isProfile}: UserInfoProps) => {
  const {UserInformationDict, dashboardProfileDict, userLanguage} = useDictionary();
  const [loading, setLoading] = useState(false);
  const [resetPasswordServerResponse, setResetPasswordServerResponse] = useState({
    show: false,
    message: ''
  });
  const created = () => {
    if (user.createdAt === undefined) return 'n/a';
    return moment(user.createdAt).format('MM/DD/YYYY');
  };
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

  const {authId: authId_auth} = useAuth();

  const dict = UserInformationDict[userLanguage];
  const PersonalInfoDict = dashboardProfileDict[userLanguage]['PERSONAL_INFO'];
  const isStudent = user.role === 'ST';

  const hideDeleteBtn = user.authId === authId_auth;

  // first check if the user is connected in any other tables
  // if yes, then show the warning message
  // if no, then show the delete button

  // figure out what tables are attached to the user
  // look for these tables
  // 1. Staff (don't look if its a student)
  // 2. Room (look only if teacher or fellow)
  // 3. ClassroomGroupStudents (don't look if its a not student)
  // 4. RoomCoTeachers (look only if teacher or fellow)
  // 5. ClassStudent (don't look if its not a student)

  // theses are the tables that might be connected to the user

  const checkAllTables = async () => {
    try {
      if (isStudent) {
        const classGroupItems = await fetchQuery(
          user.authId,
          'listClassroomGroupStudents',
          'studentAuthId'
        );
        const classStudentsItems = await fetchQuery(
          user.authId,
          'listClassStudents',
          'studentAuthID'
        );
        return [classGroupItems, classStudentsItems];
      } else {
        const roomItems = await fetchQuery(user.authId, 'listRooms', 'teacherAuthID');
        const roomCoTeachersItems = await fetchQuery(
          user.authId,
          'listRoomCoTeachers',
          'teacherAuthID'
        );
        return [roomItems, roomCoTeachersItems];
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const checkIfUserIsConnected = async () => {
    try {
      const allTables = await checkAllTables();

      // filter empty arrays or null
      const filteredTables = allTables?.filter(
        (item) => Boolean(item) && item?.length > 0
      );

      if (filteredTables && filteredTables.length > 0) {
        setCanDeleteUser(false);
      } else {
        setCanDeleteUser(true);
      }
    } catch (error) {
      console.error(error);
      setCanDeleteUser(false);
    }
  };

  const [canDeleteUser, setCanDeleteUser] = useState(false);

  useEffect(() => {
    if (user && user?.authId) {
      // checkIfUserIsConnected();
    }
  }, [user]);

  const match = useRouteMatch();

  const actionsForProfile = (
    <div className="flex gap-4 items-center justify-center">
      <Buttons
        tooltip="Change your password"
        Icon={LockOutlined}
        label={PersonalInfoDict['PASSWORD']}
        size="small"
        variant="dashed"
        url={`${match.url}/password`}
      />

      {isStudent && (
        <Buttons
          tooltip="Change your journal passcode"
          url={`${match.url}/passcode`}
          Icon={LockOutlined}
          label={PersonalInfoDict['PASSCODE']}
          size="small"
          variant="dashed"
        />
      )}
    </div>
  );

  const actionsForUser = (
    <div className="flex gap-4 items-center justify-center">
      <Buttons
        dataCy="reset-password-button"
        label={dict[loading ? 'RESETTING_PASSWORD' : 'RESET_PASSWORD']}
        variant="dashed"
        size="small"
        onClick={resetPassword}
        disabled={loading}
      />
      {/* {!hideDeleteBtn && (
<Buttons
dataCy="reset-password-button"
label={dict['DELETE_USER']}
redBtn
tooltip={
  !canDeleteUser
    ? `${user.firstName} is currently contributing to other services `
    : ''
}
size="small"
variant="dashed"
onClick={() => {}}
disabled={!canDeleteUser}
/>
)} */}
    </div>
  );

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: dict['heading'],
      children: (
        <Card>
          <Descriptions
            extra={isProfile ? actionsForProfile : actionsForUser}
            title={'User Information'}>
            <Descriptions.Item label={dict['fullname']}>
              {fallbackValue(`${user?.firstName} ${user?.lastName}`)}
            </Descriptions.Item>

            <Descriptions.Item label={dict['nickname']}>
              {fallbackValue(user?.preferredName)}
            </Descriptions.Item>
            <Descriptions.Item label={dict['role']}>
              {fallbackValue(getUserRoleString(user?.role))}
            </Descriptions.Item>

            <Descriptions.Item span={2} label={dict['email']}>
              {fallbackValue(user.email)}
            </Descriptions.Item>
            <Descriptions.Item label={PersonalInfoDict['LANGUAGE']}>
              {fallbackValue(getLanguageString(user.language))}
            </Descriptions.Item>
            <Descriptions.Item label={dict['ondemand']}>
              {user?.onDemand ? 'Yes' : 'No'}
            </Descriptions.Item>
            <Descriptions.Item label={dict['account']}>{created()}</Descriptions.Item>
            <Descriptions.Item label={dict['status']}>
              <Status useDefault status={user.status} />{' '}
              {Boolean(user.inactiveStatusDate) && (
                <span
                  className="text-xs"
                  title={`Status changed to inactive on ${statusDate(
                    user?.inactiveStatusDate || ''
                  )}`}>
                  ({statusDate(user?.inactiveStatusDate || '')})
                </span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )
    },

    {
      disabled: !isStudent,

      key: '2',
      label: dict['demographics'],
      children: <DemographicsInfo checkpoints={checkpoints} questionData={questionData} />
    }
  ];

  return (
    <div className="w-full">
      <Tabs animated tabPosition="right" defaultActiveKey="1" items={items} />
      <Modal
        open={resetPasswordServerResponse.show}
        showHeader={false}
        showFooter={false}
        closeAction={onAlertClose}>
        <div className="py-8 px-16">
          <div className="mx-auto flex items-center justify-center rounded-full">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          <div className="mt-4">{resetPasswordServerResponse.message}</div>
          <div className="flex justify-center mt-4">
            <Buttons label={'Ok'} onClick={onAlertClose} />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default UserInformation;
