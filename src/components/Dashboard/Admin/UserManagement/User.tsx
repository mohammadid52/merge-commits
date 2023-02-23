import useUrlState from '@ahooksjs/use-url-state';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import AddButton from '@components/Atoms/Buttons/AddButton';
import Placeholder from '@components/Atoms/Placeholder';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import Table from '@components/Molecules/Table';
import {uploadImageToS3} from '@graphql/functions';
import {PersonStatus, Role} from 'API';
import Loader from 'atoms/Loader';
import Anthology from 'components/Dashboard/Anthology/Anthology';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {map} from 'lodash';
import sortBy from 'lodash/sortBy';
import DroppableMedia from 'molecules/DroppableMedia';
import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {getUniqItems} from 'utilities/strings';
import AnimatedContainer from '../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useTabs} from '../../../Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import Attendance from './Attendance';
import SurveyList from './SurveyList';
import UserTabs from './User/UserTabs';
import UserEdit from './UserEdit';
import UserInformation from './UserInformation';

export interface UserInfo {
  authId: string;
  courses?: string;
  createdAt: string;
  email: string;
  externalId?: string;
  classes: any;
  firstName: string;
  grade?: string;
  id: string;
  image?: string;
  institution?: string;
  language: string;
  lastName: string;
  preferredName?: string;
  role: Role | string;
  status: PersonStatus;
  inactiveStatusDate?: string;
  statusReason?: string;
  phone: string;
  updatedAt: string;
  birthdate?: string;
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
    const teacher = room.teacher;
    return {
      no: idx + 1,
      institution: room?.class?.institution?.name,
      classroom: (
        <div
          onClick={() => handleClassRoomClick(room.id)}
          className="hover:underline cursor-pointer hover:theme-text">
          {room.name}
        </div>
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
  const tableConfig = {
    headers: ['No', 'Institution', 'Classroom', 'Teacher', 'Curriculum'],
    dataList,
    config: {
      isLastAction: true,
      isFirstIndex: true,

      dataList: {
        emptyText: 'No associated coursework and attendance',
        customWidth: {
          no: 'w-12',
          classroom: 'w-72',
          curriculum: 'w-72'
        },
        maxHeight: 'max-h-196'
      }
    }
  };

  return <Table {...tableConfig} />;
};

const User = (props: IUserProps) => {
  const {insideModalPopUp, onSuccessCallback, shouldNavigate} = props;
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const params = useQuery(location.search);
  const urlParam: any = useParams();

  const {theme, state, userLanguage, dispatch, clientKey} = useGlobalContext();

  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState(null);
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

      // mapData(arrayOfResponseObjects);
      return arrayOfResponseObjects;
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    }
  };

  const [questionData, setQuestionData] = useState([]);

  const [urlState, setUrlState] = useUrlState(
    {id: '', t: 'p'},
    {navigateMode: 'replace'}
  );

  const userId = props.userId || urlParam?.userId;
  console.log('🚀 ~ file: User.tsx:197 ~ User ~ userId', userId);

  const [user, setUser] = useState<UserInfo>({
    id: '',
    authId: '',
    courses: null,
    createdAt: '',
    email: '',
    externalId: null,
    firstName: '',
    inactiveStatusDate: '',
    statusReason: '',
    grade: null,
    image: null,
    institution: null,
    language: '',
    lastName: '',
    preferredName: null,
    classes: null,
    role: '',
    status: PersonStatus.ACTIVE,
    phone: '',
    updatedAt: '',
    birthdate: null,
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
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const {id, t: tab} = urlState;

  const {CommonlyUsedDict} = useDictionary(clientKey);

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

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

  const [demographicCheckpoints, setDemographicCheckpoints] = useState([]);
  const [privateCheckpoints, setPrivateCheckpoints] = useState([]);

  async function getUserProfile(id: string) {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUserProfile, {id: id})
      );
      const userData = result.data.userById.items.pop();

      dispatch({
        type: 'UPDATE_TEMP_USER',
        payload: {
          user: {id: userData.id, name: `${userData.firstName} ${userData.lastName}`}
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

      // console.log('studentCurriculars', studentCurriculars);

      const uniqCurriculars: any =
        studentCurriculars.length > 0
          ? getUniqItems(
              studentCurriculars.filter((d: any) => d !== null),
              'curriculumID'
            )
          : [];
      // console.log('uniqCurriculars', uniqCurriculars);

      const studCurriCheckp: any =
        uniqCurriculars.length > 0
          ? uniqCurriculars
              .map((item: any) => item?.curriculum?.checkpoints?.items)
              .flat(1)
          : [];

      // console.log('studCurriCheckp', studCurriCheckp);

      const studentCheckpoints: any =
        studCurriCheckp.length > 0
          ? studCurriCheckp.map((item: any) => item?.checkpoint)
          : [];

      // console.log('studentCheckpoints', studentCheckpoints);

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

  let tabs = [
    {name: 'User Information', current: true},
    {name: 'Coursework & Attendance', current: false},
    user.role === 'ST' && {name: 'Notebook', current: false},
    user.role === 'ST' && {name: 'Completed Surveys', current: false}
  ];
  tabs = tabs.filter(Boolean);

  const {curTab, setCurTab, helpers} = useTabs(tabs);

  const [onUserInformationTab, onCATab, onNotebookTab, onSurveyTab] = helpers;

  // ##################################################################### //
  // ########################### PROFILE IMAGE ########################### //
  // ##################################################################### //

  const isAdmin = state.user.role === 'ADM' || state.user.role === 'SUP';

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(user.image);
      setImageUrl(imageUrl);
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
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
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

  const [isEditMode, setIsEditMode] = useState(false);

  const isTeacher =
    state.user.role === 'TR' ||
    state.user.role === 'FLW' ||
    state.user.role === 'ADM' ||
    state.user.role === 'SUP';
  {
    return (
      <>
        <>
          <div
            className={`px-4 `}
            style={insideModalPopUp ? {maxHeight: 'calc(100vh - 150px)'} : {}}>
            {/* <BreadCrums items={breadCrumsList} /> */}

            <SectionTitleV3
              title="User Lookup"
              bgColor={insideModalPopUp ? 'bg-gray-200' : 'bg-white'}
              fontSize="xl"
              backButton
              fontStyle="semibold"
              extraClass="leading-6 text-gray-900"
              borderBottom
              shadowOff
              withButton={
                <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
                  <AddButton
                    label={'Edit User'}
                    disabled={isEditMode}
                    onClick={() => {
                      setIsEditMode(true);
                      setCurTab(tabs[0].name);
                      // history.push(`${match.url}/edit${location.search}`);
                    }}
                  />
                </div>
              }
            />

            <div className="flex justify-between items-center mb-4 py-4 w-auto">
              <UserTabs
                tabs={tabs}
                currentTab={curTab}
                viewedUser={user}
                setCurrentTab={setCurTab}
                isTeacher={isTeacher}
                isAdmin={isAdmin}
                theme={theme}
              />
            </div>
            <div className="mb-4">
              <AnimatedContainer className="h-full" show={onUserInformationTab}>
                {onUserInformationTab && (
                  <div className={`border-0 border-gray-300 rounded-xl p-4 mb-8`}>
                    <div className="h-1/2 flex flex-col md:flex-row">
                      <div className="w-1/4 p-4 flex flex-col text-center items-center">
                        <div className="cursor-pointer">
                          {user.image ? (
                            <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                              {!imageLoading ? (
                                <>
                                  <div className="cursor-pointer">
                                    <DroppableMedia
                                      mediaRef={mediaRef}
                                      setImage={(img: any, file: any) => {
                                        setUpImage(img);
                                        setFileObj(file);
                                      }}
                                      toggleCropper={toggleCropper}>
                                      {imageUrl ? (
                                        <img
                                          className={`profile w-20 h-20 md:w-30 md:h-30 lg:w-40 lg:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                          src={imageUrl}
                                        />
                                      ) : (
                                        <div
                                          className={`profile w-20 h-20 md:w-30 md:h-30 lg:w-40 lg:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                        />
                                      )}
                                    </DroppableMedia>
                                  </div>
                                </>
                              ) : (
                                <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light">
                                  <Loader />
                                </div>
                              )}
                            </button>
                          ) : (
                            <div className={`flex justify-center items-center mx-auto`}>
                              {!imageLoading ? (
                                <DroppableMedia
                                  mediaRef={mediaRef}
                                  setImage={(img: any, file: any) => {
                                    setUpImage(img);
                                    setFileObj(file);
                                  }}
                                  toggleCropper={toggleCropper}>
                                  <div
                                    onClick={handleImage}
                                    className="w-20 h-20 md:w-40 md:h-40">
                                    <Placeholder
                                      textSize="text-5xl"
                                      firstName={user.firstName}
                                      lastName={user.lastName}
                                      size="w-20 h-20 md:w-40 md:h-40"
                                    />
                                  </div>
                                </DroppableMedia>
                              ) : (
                                <Loader />
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-lg md:text-3xl font-bold  text-gray-900 mt-4`}>
                          {`${user.preferredName ? user.preferredName : user.firstName} ${
                            user.lastName
                          }`}
                          <p className="text-md md:text-lg">{`${
                            user.institution ? user.institution : ''
                          }`}</p>
                        </div>
                      </div>

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
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onCATab}>
                {onCATab && (
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
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onNotebookTab}>
                {onNotebookTab && (
                  <Anthology
                    isTeacher={isTeacher}
                    studentID={user.id}
                    studentAuthID={user.authId}
                    studentName={user.firstName}
                    studentEmail={user.email}
                  />
                )}
              </AnimatedContainer>
              <AnimatedContainer show={onSurveyTab}>
                {onSurveyTab && (
                  <SurveyList
                    insideModalPopUp={insideModalPopUp}
                    studentAuthID={user.authId}
                    studentEmail={user.email}
                  />
                )}
              </AnimatedContainer>
            </div>
          </div>
        </>
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => {
              saveCroppedImage(img);
            }}
            closeAction={toggleCropper}
          />
        )}
      </>
    );
  }
};

export default User;
