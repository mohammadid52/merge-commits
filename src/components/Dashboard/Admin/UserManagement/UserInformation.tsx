import {
  Tabs3,
  useTabs
} from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import useAuth from '@customHooks/useAuth';
import {Card, Descriptions, Empty} from 'antd';
import Buttons from 'atoms/Buttons';
import Modal from 'atoms/Modal';
import {API, graphqlOperation} from 'aws-amplify';
import axios from 'axios';
import useDictionary from 'customHooks/dictionary';
import LessonLoading from 'lesson/Loading/ComponentLoading';
import {Fragment, useEffect, useState} from 'react';
import {FiAlertCircle} from 'react-icons/fi';
import {requestResetPassword} from 'utilities/urls';
import {UserInfo} from './User';
import UserRole from './UserRole';
import {Status} from './UserStatus';
import * as queries from 'graphql/queries';

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
  status: string;
  questionData: any;
  checkpoints: any;
  tab: string;
  setTab: Function;
}

const UserInformation = ({user, status, checkpoints, questionData}: UserInfoProps) => {
  const {UserInformationDict, userLanguage} = useDictionary();
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

  const isStudent = user.role === 'ST';

  const tabsData = [
    {
      name: dict['heading'],
      current: true
    },
    isStudent && {
      name: dict['demographics'],
      current: false
    }
    // isStudent && {
    //   name: dict['private'],
    //   current: false
    // }
  ].filter(Boolean) as any[];

  const {curTab, setCurTab, helpers} = useTabs(tabsData);

  const [onPersonal, onDemographics] = helpers;

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

  if (status !== 'done') {
    return <LessonLoading />;
  } else {
    return (
      <div className="w-3/4 md:px-2 pt-2">
        <Tabs3 tabs={tabsData} curTab={curTab} setCurTab={setCurTab} />

        {/* USER INFO FIRST TAB */}
        {onPersonal && (
          <Card>
            <Descriptions
              extra={
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
              }
              title={'User Information'}>
              <Descriptions.Item label={dict['fullname']}>
                {user.firstName} {user.lastName}
              </Descriptions.Item>

              <Descriptions.Item label={dict['nickname']}>
                {user?.preferredName || ''}
              </Descriptions.Item>
              <Descriptions.Item label={dict['role']}>
                <UserRole role={user.role} />
              </Descriptions.Item>

              <Descriptions.Item span={2} label={dict['email']}>
                {user.email}
              </Descriptions.Item>
              <Descriptions.Item label={dict['ondemand']}>
                <Status status={user?.onDemand ? 'YES' : 'NO'} />
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
        )}

        {/* CHECKPOINTS AND DEMOGRAPHIC QUESTIONS */}
        {onDemographics &&
          (checkpoints.length > 0 ? (
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
                        {checkpoint.questions?.items.map((item: any) => (
                          <div key={item.question.id} className="sm:col-span-1 p-2">
                            <dt className="text-sm leading-5 font-medium text-gray-500">
                              {item.question.question}
                            </dt>
                            <dd className="mt-1 text-sm leading-5 text-gray-900">
                              {item.question.type !== 'link' ? (
                                getQuestionResponse(checkpoint.id, item.question.id) ||
                                '--'
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
          ) : (
            <Empty description={'No demographics data'} />
          ))}

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
  }
};
export default UserInformation;
