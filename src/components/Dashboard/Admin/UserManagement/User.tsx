import useUrlState from '@ahooksjs/use-url-state';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import {PersonStatus, Role} from 'API';
import {getAsset} from 'assets';
import Buttons from 'atoms/Buttons';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import Anthology from 'components/Dashboard/Anthology/Anthology';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import * as queries from 'graphql/queries';
import sortBy from 'lodash/sortBy';
import DroppableMedia from 'molecules/DroppableMedia';
import React, {useContext, useEffect, useState} from 'react';
import {BsArrowLeft} from 'react-icons/bs';
import {FaEdit} from 'react-icons/fa';
import {IoIosTime} from 'react-icons/io';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {getUniqItems, initials, stringToHslColor} from 'utilities/strings';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
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
  status: PersonStatus | string;
  inactiveStatusDate?: string;
  statusReason?: string;
  phone: string;
  updatedAt: string;
  birthdate?: string;
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

const User = (props: IUserProps) => {
  const {insideModalPopUp, onSuccessCallback, shouldNavigate} = props;
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const params = useQuery(location.search);
  const urlParam: any = useParams();

  const {theme, state, userLanguage, dispatch, clientKey} = useContext(GlobalContext);

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
    status: '',
    phone: '',
    updatedAt: '',
    birthdate: null,
    onDemand: false,
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

  // const breadCrumsList = [
  //   {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
  //   {
  //     title: BreadcrumsTitles[userLanguage]['PEOPLE'],
  //     url: '/dashboard/manage-users',
  //     last: false,
  //   },
  //   {
  //     title: [
  //       user.preferredName ? user.preferredName : user.firstName,
  //       user.lastName,
  //     ].join(' '),
  //     url: `${location.pathname}${location.search}`,
  //     last: true,
  //   },
  // ];

  // ##################################################################### //
  // ######################### PROFILE QUESTIONS ######################### //
  // ##################################################################### //

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

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`user_profile_image_${id}`, file, {
        contentType: type,
        acl: 'public-read',
        ContentEncoding: 'base64'
      })
        .then((result) => {
          resolve(true);
        })
        .catch((err) => {
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image ? image : fileObj, user.id, 'image/jpeg');
    const imageUrl: any = await getImageFromS3(`user_profile_image_${user.id}`);
    setImageUrl(imageUrl);
    setUser({...user, image: `user_profile_image_${user.id}`});
    updateImageParam(`user_profile_image_${user.id}`);
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

  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [loading, setLoading] = useState(false);

  // TOP Function to load student data
  const listStudentData = async () => {
    setLoading(true);
    try {
      const studentDataFetch: any = await API.graphql(
        graphqlOperation(queries.listStudentData, {
          filter: {studentAuthID: {eq: user.authId}}
        })
      );
      const response = await studentDataFetch;
      const arrayOfResponseObjects = response?.data?.listStudentData?.items;

      const reducedAnthologyContent = arrayOfResponseObjects.reduce(
        (acc: AnthologyMapItem[], contentObj: any) => {
          if (contentObj.anthologyContent) {
            const mapIdToItem = contentObj.anthologyContent.map(
              (contentMapItem: AnthologyContentInterface) => {
                return {
                  ...contentMapItem,
                  status: contentObj.status,
                  syllabusLessonID: contentObj.syllabusLessonID,
                  studentID: contentObj.studentID,
                  studentAuthID: contentObj.studentAuthID,
                  studentDataID: contentObj.id,
                  updatedAt: contentObj.updatedAt
                };
              }
            );
            return [...acc, ...mapIdToItem];
          } else {
            return acc;
          }
        },
        []
      );

      setStudentData(
        reducedAnthologyContent.filter(
          (item: any) => item.content !== '' && item.title !== ''
        )
      );
    } catch (e) {
      console.error('Anthology student data fetch error: ', e);
    } finally {
      setLoading(false);
    }
  };

  // Useeffect to load student data and process it
  useEffect(() => {
    const initializeStudentData = async () => {
      await listStudentData();
    };
    if (!isTeacher && !isAdmin && user.authId) {
      initializeStudentData();
    }
  }, [user.authId]);

  if (status !== 'done') {
    return insideModalPopUp ? (
      <div className={`pl-0 lg:pl-12 w-256`} style={{height: 'calc(100vh - 150px)'}}>
        <Loader />
      </div>
    ) : (
      <LessonLoading />
    );
  }

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

  const AssociatedClasses = ({list}: any) => {
    return (
      <div className="flex flex-col">
        <div className="flex justify-end mb-4">
          <Buttons
            label={'Timeline'}
            onClick={() => setIsTimelineOpen(true)}
            btnClass="mr-4"
            Icon={IoIosTime}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className=" overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Classroom
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-auto text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Curriculum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((room: any, idx: number) => {
                    const curriculum = room.curricula;
                    const teacher = room.teacher;
                    return (
                      <tr
                        key={`${room.id}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {room?.class?.institution?.name}
                        </td>
                        <td
                          className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500 font-bold cursor-pointer"
                          onClick={() => handleClassRoomClick(room.id)}>
                          {room.name}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {teacher
                            ? `${teacher?.firstName || ''} ${teacher?.lastName || ''}`
                            : 'Not Available'}
                        </td>
                        <td className="px-6 py-4 w-auto whitespace-nowrap text-sm text-gray-500">
                          {curriculum
                            ? `${curriculum?.items[0]?.curriculum?.name}${
                                curriculum?.items[0]?.length > 1 ? '...' : ''
                              }`
                            : 'Not Available'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const statusDate = (dateValue: string) => {
    const date = new Date(dateValue);
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  };

  const isTeacher =
    state.user.role === 'TR' ||
    state.user.role === 'FLW' ||
    state.user.role === 'ADM' ||
    state.user.role === 'SUP';
  {
    return (
      <>
        <div
          className={`pl-0 lg:pl-12 ${insideModalPopUp ? 'min-w-256' : ''}`}
          style={insideModalPopUp ? {maxHeight: 'calc(100vh - 150px)'} : {}}>
          {/* <BreadCrums items={breadCrumsList} /> */}
          {params.get('from') && (
            <div
              className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={history.goBack}>
              <span className="w-auto mr-2">
                <BsArrowLeft />
              </span>
              <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK']}</div>
            </div>
            // <div className="flex justify-end mb-4">
            //   <Buttons
            //     label="Go Back"
            //     btnClass="mr-4"
            //     onClick={history.goBack}
            //     Icon={IoArrowUndoCircleOutline}
            //   />
            // </div>
          )}
          <div className="flex justify-between items-center mb-4 py-4 w-auto">
            {/* <SectionTitle title={UserDict[userLanguage]['title']} /> */}

            <UserTabs
              tabs={tabs}
              currentTab={curTab}
              viewedUser={user}
              setCurrentTab={setCurTab}
              isTeacher={isTeacher}
              isAdmin={isAdmin}
              theme={theme}
            />

            {currentPath !== 'edit' && onUserInformationTab && (
              <div className="flex justify-end w-auto">
                <Buttons
                  dataCy="edit-user-button"
                  btnClass="mr-4 px-6"
                  label="Edit"
                  onClick={() => {
                    setCurTab(tabs[0].name);
                    history.push(`${match.url}/edit${location.search}`);
                  }}
                  Icon={FaEdit}
                />
              </div>
            )}
          </div>
          <AnimatedContainer className="h-full" show={onUserInformationTab}>
            {onUserInformationTab && (
              <div
                className={`w-full overflow-hidden white_back px-2 lg:px-8 py-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                <div className="h-1/2 flex flex-col md:flex-row">
                  <div className="w-1/4 p-4 flex flex-col text-center items-center">
                    <div className="cursor-pointer">
                      {user.image ? (
                        <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                          {!imageLoading ? (
                            <>
                              <label className="cursor-pointer">
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
                              </label>
                            </>
                          ) : (
                            <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light">
                              <Loader />
                            </div>
                          )}
                        </button>
                      ) : (
                        <label className={`flex justify-center items-center mx-auto`}>
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
                                className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
                                <div
                                  className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                                  style={{
                                    /* stylelint-disable */
                                    background: `${stringToHslColor(
                                      user.preferredName
                                        ? user.preferredName
                                        : user.firstName + ' ' + user.lastName
                                    )}`,
                                    textShadow: '0.2rem 0.2rem 3px #423939b3'
                                  }}>
                                  {initials(
                                    user.preferredName
                                      ? user.preferredName
                                      : user.firstName,
                                    user.lastName
                                  )}
                                </div>
                              </div>
                            </DroppableMedia>
                          ) : (
                            <Loader />
                          )}
                        </label>
                      )}
                    </div>
                    <div className={`text-lg md:text-3xl font-bold  text-gray-900 mt-4`}>
                      {`${user.preferredName ? user.preferredName : user.firstName} ${
                        user.lastName
                      }`}
                      <p className="text-md md:text-lg">{`${
                        user.institution ? user.institution : ''
                      }`}</p>
                    </div>
                    {user.inactiveStatusDate && (
                      <div className="sm:col-span-3 p-2 mt-18">
                        <Selector
                          selectedItem={statusDate(user.inactiveStatusDate)}
                          onChange={() => {}}
                          disabled
                          arrowHidden={true}
                          placeholder={'Status'}
                          label={'Status Date'}
                          labelTextClass={'text-sm text-justify'}
                          btnClass={'cursor-not-allowed'}
                          additionalClass={`w-auto md:w-52 lg:w-48 cursor-not-allowed`}
                        />
                      </div>
                    )}
                  </div>
                  <Switch>
                    <Route
                      path={`${match.url}/edit`}
                      render={() => (
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
                      )}
                    />
                    <Route
                      path={`${match.url}/`}
                      render={() => (
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
                      )}
                    />
                  </Switch>
                </div>
              </div>
            )}
          </AnimatedContainer>
          <AnimatedContainer show={onCATab}>
            {onCATab && user?.classes?.items.length > 0 && user.role === 'ST' && (
              <div
                className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                {isTimelineOpen ? (
                  <Attendance
                    id={userId}
                    goToClassroom={goToClassroom}
                    selectedRoomId={selectedRoomId}
                    role={user.role}
                  />
                ) : (
                  <AssociatedClasses list={user?.rooms} />
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
              <SurveyList studentAuthID={user.authId} studentEmail={user.email} />
            )}
          </AnimatedContainer>

          {/* {curTab === 'Timeline' && (
            <div
              className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
              <Attendance id={id} goToClassroom={() => switchMainTab(tabs[1].name)} />
            </div>
          )} */}
        </div>
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
