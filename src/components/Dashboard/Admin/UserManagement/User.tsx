import useUrlState from '@ahooksjs/use-url-state';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AddButton from '@components/Atoms/Buttons/AddButton';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import Table, {ITableProps} from '@components/Molecules/Table';
import UserProfileImage from '@components/Molecules/UserProfileImage';
import {uploadImageToS3} from 'graphql-functions/functions';
import {Tabs, TabsProps} from 'antd';
import {PersonStatus, Role} from 'API';
import Anthology from 'components/Dashboard/Anthology/Anthology';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import sortBy from 'lodash/sortBy';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {getUniqItems} from 'utilities/strings';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import Attendance from './Attendance';
import SurveyList from './SurveyList';
import UserEdit from './UserEdit';
import UserInformation from './UserInformation';

export interface UserInfo {
  authId: string;
  courses?: string | null;
  createdAt: string;
  email: string;

  classes: any;
  firstName: string;

  id: string;
  image?: string | null;
  institution?: string;
  language: string;
  lastName: string;
  preferredName?: string;
  role: Role | string;
  status: PersonStatus;
  inactiveStatusDate?: string;
  statusReason?: string;

  updatedAt: string;

  isZoiq?: boolean;
  onDemand?: boolean;
  rooms: any[];
}

export interface AnthologyContentInterface {
  type: string;
  subType: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
  feedbacks?: string[];
}

export interface AnthologyMapItem extends AnthologyContentInterface {
  studentDataID?: string;
  lessonProgress?: string;
  currentLocation?: string;
  status: string;
  syllabusLessonID: string;
  studentID: string;
  studentAuthID: string;
  updatedAt?: string;
}

interface IUserProps {
  instituteId?: string;
  shouldNavigate?: boolean;
  userId?: string;
  insideModalPopUp?: boolean;
  onSuccessCallback?: () => void;
}

const AssociatedClasses = ({list, handleClassRoomClick}: any) => {
  const dataList: any[] = map(list, (room, idx) => {
    const curriculum = room.curricula;
    const teacher: any = room.teacher;
    return {
      no: idx + 1,
      institution: room?.class?.institution?.name,
      onClick: () => handleClassRoomClick(room.id),
      classroom: (
        <div className="hover:underline cursor-pointer hover:theme-text">{room.name}</div>
      ),

      teacher: teacher
        ? `${teacher?.firstName || ''} ${teacher?.lastName || ''}`
        : 'Not Available',
      curriculum: curriculum
        ? `${curriculum?.items[0]?.curriculum?.name}${
            curriculum?.items[0]?.length > 1 ? '...' : ''
          }`
        : 'Not Available'
    };
  });
  const tableConfig: ITableProps = {
    headers: ['No', 'Institution', 'Classroom', 'Teacher', 'Curriculum'],
    dataList
  };

  return <Table {...tableConfig} />;
};

const User = (props: IUserProps) => {
  const {insideModalPopUp, onSuccessCallback, shouldNavigate} = props;

  const urlParam: any = useParams();

  const {theme, state, dispatch} = useGlobalContext();

  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState<any | null>(null);
  const [fileObj, setFileObj] = useState({});
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const getDashboardData = async (authId: string, email: string) => {
    try {
      const queryObj = {
        name: 'customQueries.getDashboardData',
        valueObj: {
          authId: authId,
          email: email
        }
      };
      const dashboardDataFetch = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );

      // @ts-ignore
      let arrayOfResponseObjects = await dashboardDataFetch?.data?.getPerson?.classes
        ?.items;

      arrayOfResponseObjects =
        arrayOfResponseObjects
          ?.filter((item: any) => item.class !== null)
          ?.map((item: any) => item?.class?.room) || [];
      dispatch({
        type: 'UPDATE_TEMP',
        payload: {roomData: arrayOfResponseObjects, authId}
      });

      return arrayOfResponseObjects;
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    }
  };

  const [questionData, setQuestionData] = useState<any[]>([]);

  const [urlState, setUrlState] = useUrlState(
    {id: '', t: 'p'},
    {navigateMode: 'replace'}
  );

  const userId = props.userId || urlParam?.userId;

  const [user, setUser] = useState<UserInfo>({
    id: '',
    authId: '',
    courses: null,
    createdAt: '',
    email: '',

    firstName: '',
    inactiveStatusDate: '',
    statusReason: '',

    image: null,
    institution: '',
    language: '',
    lastName: '',
    preferredName: '',
    classes: null,
    role: '',
    status: PersonStatus.ACTIVE,

    updatedAt: '',

    onDemand: false,
    isZoiq: false,
    rooms: []
  });

  useEffect(() => {
    if (state?.temp?.authId !== user.authId && user.authId && user.email) {
      getDashboardData(user.authId, user.email);
    }
  }, [user.authId, user.email]);

  const [imageUrl, setImageUrl] = useState('');

  const {t: tab} = urlState;

  const mediaRef = React.useRef<any>(null);

  // ~~~~~~~~~~~~ GET RESPONSES ~~~~~~~~~~~~ //

  const getQuestionData = async (checkpointIDs: any[], user: any) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item
        }
      };
    });
    const filter = {
      and: [
        {email: {eq: user.email}},
        {authID: {eq: user.authId}},
        {syllabusLessonID: {eq: '999999'}},
        {
          or: [...checkpointIDFilter]
        }
      ]
    };
    const results: any = await API.graphql(
      graphqlOperation(customQueries.listQuestionDatas, {filter: filter})
    );
    const questionData: any = results.data.listQuestionData?.items;
    setQuestionData(questionData);
  };

  // ##################################################################### //
  // ########################## GET CHECKPOINTS ########################## //
  // ##################################################################### //

  // ~~~~~~~~~~~~~~~ STORAGE ~~~~~~~~~~~~~~~ //

  const [demographicCheckpoints, setDemographicCheckpoints] = useState<any[]>([]);
  const [privateCheckpoints, setPrivateCheckpoints] = useState<any[]>([]);

  async function getUserProfile(id: string) {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUserProfile, {id: id})
      );
      const userData = result.data.userById.items.pop();

      dispatch({
        type: 'UPDATE_TEMP_USER',
        payload: {
          user: {
            id: userData.id,
            name: `${userData.firstName} ${userData.lastName}`
          }
        }
      });

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
        if (item?.room) {
          return [...roomAcc, item.room];
        } else {
          return roomAcc;
        }
      }, []);

      userData.rooms = studentRooms;

      const studentCurriculars: any =
        studentRooms.length > 0
          ? studentRooms.map((item: any) => item?.curricula?.items).flat(1)
          : [];

      const uniqCurriculars: any =
        studentCurriculars.length > 0
          ? getUniqItems(
              studentCurriculars.filter((d: any) => d !== null),
              'curriculumID'
            )
          : [];

      const studCurriCheckp: any =
        uniqCurriculars.length > 0
          ? uniqCurriculars
              .map((item: any) => item?.curriculum?.checkpoints?.items)
              .flat(1)
          : [];

      const studentCheckpoints: any =
        studCurriCheckp.length > 0
          ? studCurriCheckp.map((item: any) => item?.checkpoint)
          : [];

      let sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      sCheckpoints = sortBy(sCheckpoints, (item: any) => item.scope === 'private');

      /***********************
       *   DEMOGRAPHIC AND   *
       * PRIVATE CHECKPOINTS *
       ***********************/

      // ~~~~~~~~~~~~~~~~ UNIQUE ~~~~~~~~~~~~~~~ //
      const uniqCheckpoints: any = sCheckpoints ? getUniqItems(sCheckpoints, 'id') : [];
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);

      // ~~~~~~~~~~~~~~ SPLIT OUT ~~~~~~~~~~~~~~ //
      const demographicCheckpoints = uniqCheckpoints
        .filter((checkpoint: any) => checkpoint.scope !== 'private')
        .map((checkpoint: any) => {
          if (checkpoint?.questionSeq) {
            return {
              ...checkpoint,
              questions: {
                items: checkpoint.questionSeq.reduce((acc: any[], seqString: string) => {
                  let findQ = checkpoint.questions.items.find(
                    (item: any) => item.question.id === seqString
                  );
                  if (findQ) {
                    return [...acc, findQ];
                  } else {
                    return acc;
                  }
                }, [])
              }
            };
          } else {
            return checkpoint;
          }
        });
      const privateCheckpoints = uniqCheckpoints
        .filter((checkpoint: any) => checkpoint.scope === 'private')
        .map((checkpoint: any) => {
          if (checkpoint?.questionSeq) {
            return {
              ...checkpoint,
              questions: {
                items: checkpoint.questionSeq.reduce((acc: any[], seqString: string) => {
                  let findQ = checkpoint.questions.items.find(
                    (item: any) => item.question.id === seqString
                  );
                  if (findQ) {
                    return [...acc, findQ];
                  } else {
                    return acc;
                  }
                }, [])
              }
            };
          } else {
            return checkpoint;
          }
        });

      const personalInfo: any = {...userData};

      delete personalInfo.classes;

      setDemographicCheckpoints(demographicCheckpoints);
      setPrivateCheckpoints(privateCheckpoints);

      setStatus('done');
      setUser(() => {
        if (typeof userData === 'object') {
          return userData;
        }
        return user;
      });

      if (uniqCheckpointIDs?.length > 0) {
        getQuestionData(uniqCheckpointIDs, userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ##################################################################### //
  // ########################### PROFILE IMAGE ########################### //
  // ##################################################################### //

  useEffect(() => {
    async function getUrl() {
      if (user.image) {
        const imageUrl: any = await getImageFromS3(user.image);
        setImageUrl(imageUrl);
      }
    }
    getUrl();
  }, [user.image]);

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    const id = user.id;
    await uploadImageToS3(
      image ? image : fileObj,
      `user_profile_image_${id}`,
      'image/jpeg'
    );
    const imageUrl: any = await getImageFromS3(`user_profile_image_${id}`);
    setImageUrl(imageUrl);
    setUser({...user, image: `user_profile_image_${id}`});
    updateImageParam(`user_profile_image_${id}`);
    toggleCropper();
    setImageLoading(false);
  };

  async function updateImageParam(imageKey: string) {
    // TODO:
    // Need to check for update only required input values.

    const input = {
      id: user.id,
      authId: user.authId,
      image: imageKey,
      status: user.status,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language
    };

    try {
      await API.graphql(graphqlOperation(customMutations.updatePerson, {input: input}));
      setUser({
        ...user
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  useEffect(() => {
    if (userId) {
      getUserProfile(userId);
    }
  }, [userId]);

  const setTab = (value: string) => {
    setUrlState({t: value});
  };

  const handleClassRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsTimelineOpen(true);
  };

  const goToClassroom = () => {
    setSelectedRoomId('');
    setIsTimelineOpen(false);
  };

  const isTeacher =
    state.user.role === 'TR' ||
    state.user.role === 'FLW' ||
    state.user.role === 'ADM' ||
    state.user.role === 'SUP';

  const [isEditMode, setIsEditMode] = useState(false);

  const items: TabsProps['items'] = [
    {
      label: 'User Information',
      key: '1',
      children: (
        <div className={`border-0 border-lightest  rounded-xl p-4 mb-8`}>
          <div className="h-1/2 flex flex-col md:flex-row">
            <UserProfileImage
              imageUrl={imageUrl}
              image={user.image}
              mediaRef={mediaRef}
              setImage={(img: any, file: any) => {
                setUpImage(img);
                setFileObj(file);
              }}
              toggleCropper={toggleCropper}
              imageLoading={imageLoading}
              name={`${user.preferredName ? user.preferredName : user.firstName} ${
                user.lastName
              }`}
            />

            {isEditMode ? (
              <ErrorBoundary componentName="UserEdit">
                <UserEdit
                  // tab={stdCheckpoints.length > 0 ? tab : 'p'}
                  instituteId={props.instituteId}
                  tab={tab}
                  setTab={setTab}
                  onSuccessCallback={onSuccessCallback}
                  user={user}
                  shouldNavigate={shouldNavigate}
                  status={status}
                  setStatus={setStatus}
                  setIsEditMode={setIsEditMode}
                  getUserById={getUserProfile}
                  questionData={questionData}
                  checkpoints={
                    tab === 'demographics'
                      ? demographicCheckpoints
                      : tab === 'private'
                      ? privateCheckpoints
                      : []
                  }
                />
              </ErrorBoundary>
            ) : (
              <ErrorBoundary componentName="UserInformation">
                <UserInformation
                  // tab={stdCheckpoints.length > 0 ? tab : 'p'}
                  tab={tab}
                  setTab={setTab}
                  questionData={questionData}
                  checkpoints={
                    tab === 'demographics'
                      ? demographicCheckpoints
                      : tab === 'private'
                      ? privateCheckpoints
                      : []
                  }
                  user={user}
                  status={status}
                />
              </ErrorBoundary>
            )}
          </div>
        </div>
      )
    },
    {
      label: 'Coursework & Attendance',
      key: '2',
      disabled: user?.role === 'ADM' || user?.role === 'SUP',
      children: (
        <>
          {user?.classes?.items.length > 0 && user.role === 'ST' && (
            <div className={`mb-8`}>
              {isTimelineOpen ? (
                <Attendance
                  id={userId}
                  goToClassroom={goToClassroom}
                  selectedRoomId={selectedRoomId}
                  role={user.role}
                />
              ) : (
                <AssociatedClasses
                  setIsTimelineOpen={setIsTimelineOpen}
                  handleClassRoomClick={handleClassRoomClick}
                  list={user?.rooms}
                />
              )}
            </div>
          )}
          {(user.role === 'TR' || user.role === 'FLW') && (
            <Attendance
              id={userId}
              goToClassroom={goToClassroom}
              selectedRoomId={selectedRoomId}
              role={user.role}
            />
          )}
        </>
      )
    },
    {
      label: 'Notebook',
      key: '3',
      disabled: user.role !== 'ST',
      children: (
        <Anthology
          studentImage={user.image}
          isTeacher={isTeacher}
          studentID={user.id}
          studentAuthID={user.authId}
          studentName={user.firstName}
          studentEmail={user.email}
        />
      )
    },
    {
      label: 'Completed Surveys',
      key: '4',

      disabled: user.role !== 'ST',
      children: (
        <SurveyList
          insideModalPopUp={insideModalPopUp}
          studentAuthID={user.authId}
          studentEmail={user.email}
        />
      )
    }
  ];

  const getTabsData = () => {
    if (items && Boolean(user?.role)) {
      if (user?.role === 'TR' || user?.role === 'FLW') {
        return items.filter((tabObj: any) => tabObj.label !== 'Notebook');
      } else if (user?.role === 'ADM' || user?.role === 'SUP') {
        return items.filter((tabObj: any) => tabObj.label === 'User Information');
      } else {
        return items;
      }
    }
  };

  const [activeKey, setActiveKey] = useState('1');

  return (
    <>
      <PageLayout>
        <div style={insideModalPopUp ? {maxHeight: 'calc(100vh - 150px)'} : {}}>
          {/* <BreadCrums items={breadCrumsList} /> */}

          <Tabs
            items={getTabsData()}
            animated
            onChange={(key: string) => {
              setActiveKey(key);
            }}
            defaultActiveKey={activeKey}
            tabBarExtraContent={{
              right: (
                <AddButton
                  size="middle"
                  label={'Edit User'}
                  disabled={isEditMode || activeKey !== '1'}
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                />
              )
            }}
          />
        </div>
      </PageLayout>

      <ProfileCropModal
        open={showCropper}
        upImg={upImage || ''}
        saveCroppedImage={(img: string) => {
          saveCroppedImage(img);
        }}
        closeAction={toggleCropper}
      />
    </>
  );
};

export default User;
