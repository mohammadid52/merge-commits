import API, {graphqlOperation} from '@aws-amplify/api';
// import {BsFillInfoCircleFill} from 'react-icons/bs';
import SignOutButton from '@components/Auth/SignOut';
import InstitutionsHome from '@components/Dashboard/Admin/Institutons/InstitutionsHome';
import useNotifications from '@customHooks/notifications';
import {Menu, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import {getImageFromS3Static} from '@utilities/services';
import {getUserRoleString, stringToHslColor} from '@utilities/strings';
import {getAsset} from 'assets';
import QuestionBank from 'components/Dashboard/Admin/Questions/QuestionBank';
import Csv from 'components/Dashboard/Csv/Csv';
import Home from 'components/Dashboard/Home/Home';
import HomeForTeachers from 'components/Dashboard/Home/HomeForTeachers';
import LessonPlanHome from 'components/Dashboard/LessonPlanner/LessonPlanHome';
import HeaderMegaMenu from 'components/Dashboard/Menu/HeaderMegaMenu';
import NoticeboardAdmin from 'components/Dashboard/NoticeboardAdmin/NoticeboardAdmin';
import ErrorBoundary from 'components/Error/ErrorBoundary';
import ComponentLoading from 'components/Lesson/Loading/ComponentLoading';
import Noticebar from 'components/Noticebar/Noticebar';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
import moment, {Moment} from 'moment';
import React, {Fragment, lazy, Suspense, useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {FiUser} from 'react-icons/fi';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {getLocalStorageData, setLocalStorageData} from 'utilities/localStorage';
import {frequencyMapping} from 'utilities/staticData';
import EmojiFeedback from 'components/General/EmojiFeedback';
const Classroom = lazy(() => import('./Classroom/Classroom'));
const Community = lazy(() => import('components/Community/Community'));
const Anthology = lazy(() => import('./Anthology/Anthology'));
const Profile = lazy(() => import('./Profile/Profile'));
const Registration = lazy(() => import('./Admin/UserManagement/Registration'));
const UserManagement = lazy(() => import('./Admin/UserManagement/UserManagement'));

type userObject = {
  [key: string]: any;
};

export interface ICompletedLessons {
  lessonID: string;
  time: string;
}

export interface DashboardProps {
  classRoomActiveSyllabus?: string;
  loading?: boolean;
  isTeacher?: boolean;
  updateAuthState?: Function;
  currentPageData?: any[];
  setCurrentPageData?: React.Dispatch<any>;
  currentPage?: string;
  setCurrentPage?: React.Dispatch<React.SetStateAction<string>>;
  activeRoom?: string;
  setActiveRoom?: React.Dispatch<React.SetStateAction<string>>;
  activeRoomInfo?: any;
  setActiveRoomInfo?: React.Dispatch<React.SetStateAction<any>>;
  activeRoomName?: string;
  setActiveRoomName?: React.Dispatch<React.SetStateAction<string>>;
  visibleLessonGroup?: string;
  setVisibleLessonGroup?: React.Dispatch<React.SetStateAction<string>>;
  handleSyllabusActivation?: (syllabusID: string) => void;
  lessonLoading?: boolean;
  setLessonLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  syllabusLoading?: boolean;
  setSyllabusLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  handleRoomSelection?: Function;
  completedLessons?: ICompletedLessons[];
  curriculumName?: string;
  institutionId?: string;
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const Dashboard = (props: DashboardProps) => {
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const dispatch = gContext.dispatch;
  const stateUser = gContext.state.user;
  const theme = gContext.theme;
  const clientKey = gContext.clientKey;

  const {updateAuthState} = props;
  const themeColor = getAsset(clientKey, 'themeClassName');
  const match = useRouteMatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);

  const getRoomData = getLocalStorageData('room_info');
  const {notifications} = useNotifications('global');

  const [openWalkThroughModal, setOpenWalkThroughModal] = useState(false);
  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();
  const [activeRoomName, setActiveRoomName] = useState<string>('');

  useEffect(() => {
    if (state.currentPage === 'homepage') {
      dispatch({
        type: 'RESET_ROOMDATA',
      });
    }
  }, [state.currentPage]);

  // ##################################################################### //
  // ############################ USER LOADING ########################### //
  // ##################################################################### //
  const [userData, setUserData] = useState({
    role: '',
    image: '',
  });
  const isTeacher = state.user.role === 'FLW' || state.user.role === 'TR';

  const setUser = (user: userObject) => {
    setUserData({
      role: user.role,
      image: user.image,
    });
    let firstName = user.preferredName ? user.preferredName : user.firstName;
    dispatch({
      type: 'SET_USER',
      payload: {
        id: user.id,
        firstName: firstName,
        lastName: user.lastName,
        language: user.language,
        onBoardSurvey: user.onBoardSurvey ? user.onBoardSurvey : false,
        role: user.role,
        image: user.image,
        onDemand: user?.onDemand,
      },
    });

    setCookie(
      'auth',
      {...cookies.auth, role: user.role, firstName: firstName, id: user.id},
      {path: '/'}
    );
  };

  async function getUser() {
    const userEmail = state.user?.email ? state.user?.email : cookies.auth?.email;
    const userAuthId = state.user?.authId ? state.user?.authId : cookies.auth?.authId;
    try {
      const queryObj = {
        name: 'queries.getPerson',
        valueObj: {email: userEmail, authId: userAuthId},
      };

      const user: any = await API.graphql(
        graphqlOperation(queries.getPerson, queryObj.valueObj)
      );
      setUser(user.data.getPerson);
    } catch (error) {
      if (!userEmail && !userAuthId) {
        removeCookie('auth', {path: '/'});
        dispatch({type: 'CLEANUP'});
        sessionStorage.removeItem('accessToken');
        updateAuthState(false);
      }
      console.error('Dashboard - getUser(): ', error);
    }
  }

  useEffect(() => {
    if (!state.user.firstName) {
      getUser();
    } else {
      setUserData({
        role: state.user?.role,
        image: state.user?.image,
      });
    }
  }, [state.user.role]);

  // ~~~~ DISABLE ROOM LOADING FOR ADMIN ~~~ //

  useEffect(() => {
    const userRole = state.user.role;
    if (userRole === 'SUP' || userRole === 'ADM') {
      setRoomsLoading(true);
    }
    setLocalStorageData('last_page', 'dashboard');
  }, []);

  // ##################################################################### //
  // ########################### LOADING STATUS ########################## //
  // ##################################################################### //

  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(false);
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);

  // ##################################################################### //
  // ############################# HOME DATA ############################# //
  // ##################################################################### //

  // Fetching results
  const [homeDataForTeachers, setHomeDataForTeachers] = useState([]);
  const [homeData, setHomeData] = useState<{class: any}[]>();
  const [classList, setClassList] = useState<any[]>();
  const [curriculumIds, setCurriculumIds] = useState<string>('');

  /******************************************
   * 1.1 PROCESS STUDENT ROOM FETCHING      *
   ******************************************/

  const getDashboardData = async (authId: string, email: string) => {
    try {
      const queryObj = {
        name: 'customQueries.getDashboardData',
        valueObj: {
          authId: authId,
          email: email,
        },
      };
      const dashboardDataFetch = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );

      // @ts-ignore
      let arrayOfResponseObjects = await dashboardDataFetch?.data.getPerson.classes.items;

      arrayOfResponseObjects = arrayOfResponseObjects.filter(
        (item: any) => item.class !== null
      );

      setHomeData(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashbaordData -> ', e);
    } finally {
      // need to do some cleanup
    }
  };

  const getDashboardDataForTeachers = async (teacherAuthID: string) => {
    try {
      const dashboardDataFetch: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}},
        })
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}},
        })
      );
      const response = await dashboardDataFetch;
      let arrayOfResponseObjects = [
        ...response?.data?.listRooms?.items,
        ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeacherss?.items?.map(
          (item: any) => ({
            ...item,
            ...item.room,
            teacher: item.room?.teacher,
          })
        ),
      ];
      arrayOfResponseObjects = arrayOfResponseObjects.map((item: any) => {
        return {class: {rooms: {items: arrayOfResponseObjects}}};
      });
      // console.log('dashboard data teachers - ', arrayOfResponseObjects);

      setHomeDataForTeachers(arrayOfResponseObjects);
    } catch (e) {
      console.error('getDashboardDataForTeachers -> ', e);
    } finally {
      // need to do some cleanup
    }
  };
  useEffect(() => {
    const authId = state.user.authId;
    const email = state.user.email;
    if (state.user.role === 'ST') {
      getDashboardData(authId, email);
    }
    if (isTeacher) {
      getDashboardDataForTeachers(authId);
    }
  }, [state.user.role, isTeacher]);

  /******************************************
   * 1.2 REDUCE ROOMS FROM CLASSLIST ARRAY  *
   ******************************************/

  const getClassList =
    homeData && homeData.length > 0
      ? homeData.reduce((acc: any[], dataObj: any) => {
          return [
            ...acc,
            {
              name: dataObj?.class?.name,
              room: dataObj?.class?.room,
              students: dataObj?.class?.students,
            },
          ];
        }, [])
      : [];

  useEffect(() => {
    if (homeData?.length && getClassList.length) {
      setClassList(getClassList);
    }
  }, [homeData]);

  const getRoomsFromClassList = () => {
    let rooms: any = [];
    classList && classList.length
      ? classList.forEach((classObj) =>
          classObj.room ? rooms.push(classObj.room) : null
        )
      : null;
    return rooms;
  };

  useEffect(() => {
    const studentRoomsList = getRoomsFromClassList();
    console.log('studentRoomsList - ', studentRoomsList);
    setLocalStorageData('room_list', studentRoomsList);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'rooms',
        data: studentRoomsList,
      },
    });
  }, [classList]);

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  /***********************************************
   *    THIS FUNCTION CAN ACTUALLY BE REMOVED    *
   * IT'S ACTUALLY RETURNING THE SAME (BUT LESS) *
   *    DATA AS GETDASHBOARDDATAFORTEACHERS()    *
   *    AND ESSENTIALLY USING THE SAME QUERY     *
   ***********************************************/

  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const queryObj = {
        name: 'customQueries.listRooms',
        valueObj: {filter: {teacherAuthID: {eq: teacherAuthID}}},
      };

      const classIdFromRoomsFetch: any = await API.graphql(
        graphqlOperation(customQueries.listRooms, queryObj.valueObj)
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: teacherAuthID}},
        })
      );
      //@ts-ignore
      const arrayOfResponseObjects = [
        ...classIdFromRoomsFetch?.data?.listRooms?.items,
        ...assignedRoomsAsCoTeacher?.data?.listRoomCoTeacherss?.items?.map(
          (item: any) => ({
            ...item,
            ...item.room,
            teacher: item.room?.teacher,
          })
        ),
      ];

      setLocalStorageData('room_list', arrayOfResponseObjects);

      dispatch({
        type: 'UPDATE_ROOM',
        payload: {
          property: 'rooms',
          data: arrayOfResponseObjects,
        },
      });
    } catch (e) {
      console.error('Classes Fetch ERR: ', e);
    }
  };

  useEffect(() => {
    if (state.user.role === 'FLW' || state.user.role === 'TR') {
      const teacherAuthID = state.user.authId;
      listRoomTeacher(teacherAuthID);
    }
  }, [state.user.role]);

  /**********************************
   * 3. LIST CURRICULUMS BY ROOM ID *
   **********************************/
  const listRoomCurriculums = async () => {
    console.log('listRoomCurriculums - ', '');
    if (state.roomData.rooms.length > 0) {
      try {
        const queryObj = {
          name: 'customQueries.listRoomCurriculums',
          valueObj: {
            roomID: {eq: state.activeRoom},
          },
        };

        // const roomCurriculumsFetch = await handleFetchAndCache(queryObj);
        const roomCurriculumsFetch = await API.graphql(
          graphqlOperation(queries.listRoomCurriculums, {
            filter: {
              roomID: {eq: state.activeRoom},
            },
          })
        );
        const response = await roomCurriculumsFetch;
        // @ts-ignore
        const arrayOfResponseObjects = response?.data?.listRoomCurriculums?.items;

        if (arrayOfResponseObjects.length > 0) {
          setCurriculumIds(arrayOfResponseObjects[0]?.curriculumID);
        }
      } catch (e) {
        console.error('RoomCurriculums fetch ERR: ', e);
      } finally {
        // console.log('curriciulum ids - ', curriculumIds);
      }
    }
  };

  useEffect(() => {
    if (state.activeRoom && state.activeRoom !== '') {
      listRoomCurriculums();
    }
  }, [state.activeRoom]);

  // Save info of selected room to cookie
  useEffect(() => {
    const getRoomFromState = state.roomData.rooms.find(
      (room: any) => room.id === state.activeRoom
    );
    if (getRoomFromState) {
      setLocalStorageData('room_info', getRoomFromState);
      setActiveRoomInfo(getRoomFromState);
    }
  }, [state.activeRoom]);

  // ##################################################################### //
  // ######################### SCHEDULE AND TIMES ######################## //
  // ##################################################################### //

  const calculateAvailableStartEndDate = (
    date: Moment,
    frequency: any,
    step: number,
    duration: number,
    scheduleDates: Date[],
    scheduleData: any
  ) => {
    if (frequency === 'M/W/F' && ![1, 3, 5].includes(moment(date).day())) {
      date = moment(new Date(moment(date).add(2, frequency).toDate()));
    }
    if (frequency === 'Tu/Th' && ![2, 4].includes(moment(date).day())) {
      date = moment(new Date(moment(date).add(2, frequency).toDate()));
    }
    let iteration: number = 1,
      startDate,
      estEndDate,
      i = 0;
    while (iteration <= Math.ceil(duration)) {
      const isOccupied = scheduleDates?.find(
        (ele) =>
          new Date(new Date(ele).toDateString()).getTime() ===
          new Date(moment(date).add(i, frequency).toDate()).getTime()
      );
      // console.log(
      //   isOccupied,
      //   'isOccupied',
      //   iteration,
      //   moment(date).add(i, frequency).day()
      // );
      if (
        !isOccupied &&
        (scheduleData.frequency !== 'M/W/F' ||
          (scheduleData.frequency === 'M/W/F' &&
            [1, 3, 5].includes(moment(date).add(i, frequency).day()))) &&
        (scheduleData.frequency !== 'Tu/Th' ||
          (scheduleData.frequency === 'Tu/Th' &&
            [2, 4].includes(moment(date).add(i, frequency).day())))
      ) {
        // console.log('inside finalization if');

        if (iteration === 1) {
          startDate = new Date(moment(date).add(i, frequency).toDate());
          // console.log(startDate, moment(startDate).day(), 'startDate inside if+++++++++');
        }
        if (iteration === duration) {
          estEndDate = new Date(moment(date).add(i, frequency).toDate());
        }
        iteration++;
      }
      i += step;
    }
    return {startDate, estEndDate: estEndDate || startDate};
  };

  const calculateSchedule = (syllabusList: any, scheduleData: any) => {
    const {startDate, frequency, lessonImpactLog = []} = scheduleData;
    let count: number = 0,
      lastOccupiedDate: any = startDate,
      scheduleDates = lessonImpactLog
        ?.filter((log: any) => log.adjustment === 'Push')
        .map((log: any) => log.impactDate);

    return syllabusList.map((syllabus: any) => ({
      ...syllabus,
      startDate: lastOccupiedDate,
      lessons: {
        ...syllabus.lessons,
        items: syllabus.lessons.items.map((item: any) => {
          if (count !== 0 && 1 - count < item.lesson.duration) {
            lastOccupiedDate = moment(lastOccupiedDate).add(
              frequencyMapping[frequency].step,
              frequencyMapping[frequency].unit
            );
            count = 0;
          }
          count += item.lesson.duration;

          const {startDate, estEndDate}: any = calculateAvailableStartEndDate(
            moment(lastOccupiedDate),
            frequencyMapping[frequency].unit,
            frequencyMapping[frequency].step,
            item.lesson.duration,
            scheduleDates,
            scheduleData
          );
          // console.log(
          //   startDate,
          //   estEndDate,
          //   'startDate, estEndDate inside calculate schedule'
          // );

          item.startDate = startDate;
          item.estEndDate = estEndDate;
          lastOccupiedDate = Number.isInteger(count)
            ? moment(item.estEndDate).add(
                frequencyMapping[scheduleData.frequency].step,
                frequencyMapping[scheduleData.frequency].unit
              )
            : item.estEndDate;
          count = count >= 1 ? 0 : count;
          return item;
        }),
      },
    }));
  };

  /********************
   * 5. LIST SYLLABUS *
   ********************/

  const reorderSyllabus = (syllabusArray: any[], sequenceArray: any[]) => {
    let getSyllabusInSequence =
      sequenceArray && sequenceArray.length > 0
        ? sequenceArray?.reduce((acc: any[], syllabusID: string) => {
            return [
              ...acc,
              syllabusArray.find((syllabus: any) => syllabus.unitId === syllabusID),
            ];
          }, [])
        : syllabusArray;

    // console.log('syllabusArray ', syllabusArray);
    // console.log('getSyllabusInSequence ', getSyllabusInSequence);

    let mapSyllabusToSequence =
      sequenceArray && sequenceArray.length > 0
        ? getSyllabusInSequence
            ?.map((syllabus: any) => ({
              ...syllabus,
              ...syllabus.unit,
              lessons: {
                ...syllabus.unit.lessons,
                items:
                  syllabus?.unit.lessons?.items?.length > 0
                    ? syllabus.unit.lessons.items
                        .map((t: any) => {
                          let index = syllabus?.universalLessonsSeq?.indexOf(t.id);
                          return {...t, index};
                        })
                        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1))
                    : [],
              },
            }))
            .map(({unit, ...rest}: any) => rest)
        : getSyllabusInSequence;

    return mapSyllabusToSequence;
  };

  const listSyllabus = async () => {
    setSyllabusLoading(true);

    try {
      // ~~~~~~~~~~~~~~ CURRICULUM ~~~~~~~~~~~~~ //
      let getCurriculum = await API.graphql(
        graphqlOperation(customQueries.getCurriculumForClasses, {id: curriculumIds})
      );
      // @ts-ignore
      let response = await getCurriculum.data.getCurriculum;

      let syllabi = response.universalSyllabus.items;
      let sequence = response.universalSyllabusSeq;

      let mappedResponseObjects = reorderSyllabus(syllabi, sequence);

      console.log('listSyllabus - ', mappedResponseObjects);

      //TODO: combine these dispatches
      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          syllabus: mappedResponseObjects,
          curriculum: {name: response.name},
        },
      });

      // ~~~~~~~~~~~~~~~ SCHEDULE ~~~~~~~~~~~~~~ //
      // let scheduleDetails: any = await API.graphql(
      //   graphqlOperation(customQueries.getScheduleDetails, {id: activeRoomInfo.id})
      // );
      // scheduleDetails = scheduleDetails?.data?.getRoom;

      // if (
      //   scheduleDetails &&
      //   scheduleDetails.startDate &&
      //   scheduleDetails.endDate &&
      //   scheduleDetails.frequency
      // ) {
      //   const modifiedData = calculateSchedule(mappedResponseObjects, scheduleDetails);
      // }
    } catch (e) {
      console.error('Curriculum ids ERR: ', e);
      setSyllabusLoading(false);
    } finally {
      setSyllabusLoading(false);
    }
  };

  const initSchedule = async (syllabusArray: any[]) => {
    if (syllabusArray) {
      try {
        let scheduleDetails: any = await API.graphql(
          graphqlOperation(customQueries.getScheduleDetails, {id: activeRoomInfo.id})
        );
        scheduleDetails = scheduleDetails?.data?.getRoom;

        if (
          scheduleDetails &&
          scheduleDetails.startDate &&
          scheduleDetails.endDate &&
          scheduleDetails.frequency
        ) {
          const modifiedData = calculateSchedule(syllabusArray, scheduleDetails);
        }
      } catch (e) {
        console.error('error with initSchedule() ', e);
      }
    }
  };

  useEffect(() => {
    const getSyllabusAndSchedule = async () => {
      await listSyllabus();
      await initSchedule(state.roomData.syllabus);
    };
    if (curriculumIds !== '' && state.activeRoom) {
      getSyllabusAndSchedule();
    }
  }, [state.activeRoom, curriculumIds]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - LESSONS                         *
   ******************************************/

  const listSyllabusLessons = async (syllabusID: string) => {
    setLessonLoading(true);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'lessons',
        data: [],
      },
    });

    /**
     * IF there are any syllabus active, do a fetch for lessons
     */

    try {
      const syllabusLessonFetch = await API.graphql(
        graphqlOperation(customQueries.getUniversalSyllabus, {
          id: syllabusID,
        })
      );
      //@ts-ignore
      const response = await syllabusLessonFetch.data.getUniversalSyllabus;
      const lessons = response?.lessons.items
        .map((t: any) => {
          let index = response?.universalLessonsSeq?.indexOf(t.id);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      dispatch({
        type: 'UPDATE_ROOM_MULTI',
        payload: {
          activeSyllabus: response,
          lessons: lessons,
        },
      });
    } catch (e) {
      console.error('syllabus lessons: ', e);
    } finally {
      setLessonLoading(false);
    }
  };

  // ~~~~~~~~ TRIGGER LESSON LOADING ~~~~~~~ //
  useEffect(() => {
    if (activeRoomInfo?.activeSyllabus) {
      listSyllabusLessons(activeRoomInfo.activeSyllabus);
    }
  }, [activeRoomInfo]);

  // ##################################################################### //
  // ######################## NAVIGATION AND STATE ####################### //
  // ##################################################################### //
  const [currentPage, setCurrentPage] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('open');

  const handleRoomSelection = (
    id: string,
    name: string,
    i: number,
    route = 'classroom'
  ) => {
    const getRoomSyllabus = state.roomData.rooms.find(
      (roomObj: any) => roomObj.id === id
    );
    if (
      (state.activeRoom !== id && state.currentPage !== 'lesson-planner') ||
      (state.activeRoom !== id && state.currentPage !== 'classroom')
    ) {
      setActiveRoomName(name);
      dispatch({
        type: 'UPDATE_ACTIVEROOM',
        payload: {roomID: id, syllabusID: getRoomSyllabus?.activeSyllabus},
      });

      history.push(`/dashboard/${route}/${id}`);
    }
  };

  const handleLink = () => {
    history.push('/dashboard/home');
    dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'homepage'}});
  };

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase();
    let lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };

  const HomeSwitch = () =>
    isTeacher ? (
      <HomeForTeachers
        homeData={homeDataForTeachers}
        isTeacher={isTeacher}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
      />
    ) : (
      <Home
        homeData={homeData}
        classList={classList}
        activeRoomInfo={activeRoomInfo}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
      />
    );

  const DropDownMenu = () => {
    const {theme} = useContext(GlobalContext);
    return (
      <Menu as="div" className="relative inline-block text-left w-auto">
        {({open}) => (
          <>
            <div>
              <Menu.Button
                className={`${
                  open ? 'bg-indigo-300 text-indigo-700' : ''
                } hover:bg-gray-400 hover:text-gray-700 inline-flex justify-center w-full px-4 py-2 text-sm font-medium ${
                  theme === 'iconoclastIndigo' ? 'iconoclastIndigo' : 'curateBlue'
                } rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition duration-150 ease-in-out transform hover:scale-105 text-gray-700`}>
                <div className="w-auto inline-flex items-center">
                  <div className="w-12 h-12">
                    {state.user.image ? (
                      <img
                        className="inline-block rounded-full border-2 border-gray-400"
                        style={{width: 48, height: 48}}
                        src={getImageFromS3Static(state.user.image)}
                        alt=""
                      />
                    ) : (
                      <div
                        style={{
                          /* stylelint-disable */
                          background: `${
                            state.user.firstName
                              ? stringToHslColor(
                                  state.user.firstName + ' ' + state.user.lastName
                                )
                              : '#272730'
                          }`,
                          textShadow: '0.1rem 0.1rem 2px #423939b3',
                        }}
                        className="rounded flex justify-center items-center text-xs text-white h-full font-sans">
                        {`${initials(state.user.firstName, state.user.lastName)}`}
                      </div>
                    )}
                  </div>

                  {/* <span>{[state.user.firstName, state.user.lastName].join(' ')}</span> */}
                  <ChevronDownIcon
                    className="w-8 h-8 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                    aria-hidden="true"
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-1 w-52 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none cursor-pointer z-max">
                <div className="px-1 py-1 shadow-lg">
                  <Menu.Item key={'role'}>
                    <div className="p-4 border-b-0 border-gray-400">
                      <span>
                        {[state.user.firstName, state.user.lastName].join(' ')} (
                        {getUserRoleString(state.user.role)})
                      </span>
                    </div>
                  </Menu.Item>
                  <Menu.Item key={'profile'}>
                    <div
                      onClick={() => history.push('/dashboard/profile')}
                      className="flex-shrink-0 flex border-t p-4 hover:bg-indigo-200 rounded-md">
                      <div className="flex-shrink-0 group block">
                        <div className="flex items-center">
                          <IconContext.Provider
                            value={{
                              size: '24px',
                              className: 'w-auto mr-1',
                            }}>
                            <FiUser className="cursor-pointer" />
                          </IconContext.Provider>
                          <p className="text-sm ml-2 font-medium">Edit Profile</p>
                        </div>
                      </div>
                    </div>
                  </Menu.Item>
                  <Menu.Item key={'logout'}>
                    <SignOutButton updateAuthState={updateAuthState} />
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  };

  return (
    <>
      <div className="w-full bg-white">
        <div className="flex justify-between items-center">
          <div className="w-auto mx-5">
            <img
              onClick={stateUser.role === 'ST' ? () => handleLink() : () => {}}
              className="h-12 w-auto cursor-pointer"
              src={getAsset(clientKey, 'loading_logo')}
              alt="Workflow"
            />
          </div>
          <HeaderMegaMenu />
          <DropDownMenu />
        </div>
      </div>
      <div className="relative h-screen flex overflow-hidden container_background">
        {state.user.role === 'ST' && <EmojiFeedback />}
        {/* <ResizablePanels> */}
        {/* <SideMenu
          // setActiveRoomSyllabus={setActiveRoomSyllabus}
          setLessonLoading={setLessonLoading}
          setSyllabusLoading={setSyllabusLoading}
          setActiveRoomName={setActiveRoomName}
          updateAuthState={updateAuthState}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          role={userData.role}
          handleRoomSelection={handleRoomSelection}
        /> */}

        <div className="h-full overflow-y-auto">
          {/*<FloatingSideMenu />*/}
          <Noticebar notifications={notifications} />
          {/* <div className="absolute z-100 w-6 right-1 top-0.5">
            <span
              className="w-auto cursor-pointer"
              onClick={() => setOpenWalkThroughModal(true)}>
              <BsFillInfoCircleFill
                className={`h-5 w-5 ${theme.textColor[themeColor]}`}
              />
            </span>
          </div> */}
          <Suspense
            fallback={
              <div className="min-h-screen w-full flex flex-col justify-center items-center">
                <ComponentLoading />
              </div>
            }>
            <Switch>
              <Route
                path={`${match.url}`}
                exact
                render={() => {
                  if (userData && userData.role !== '') {
                    if (userData.role === 'FLW' || userData.role === 'TR') {
                      return <Redirect to={`${match.url}/home`} />;
                    } else if (userData.role === 'ST') {
                      return <Redirect to={`${match.url}/home`} />;
                    } else {
                      return !state.user.associateInstitute?.length ||
                        state.user.associateInstitute?.length > 1 ? (
                        <Redirect to={`${match.url}/manage-institutions`} />
                      ) : (
                        <Redirect
                          to={`${match.url}/manage-institutions/institution/${state.user.associateInstitute[0].institution.id}/staff`}
                        />
                      );
                    }
                  } else
                    return (
                      <div className="min-h-screen w-full flex flex-col justify-center items-center">
                        <ComponentLoading />
                      </div>
                    );
                }}
              />

              <Route
                exact
                path={`${match.url}/home`}
                render={() => (
                  <ErrorBoundary fallback={<h1>Oops with the Dashboard</h1>}>
                    <HomeSwitch />
                  </ErrorBoundary>
                )}
              />

              <Route
                exact
                path={`${match.url}/community`}
                render={() => (
                  <ErrorBoundary fallback={<h1>Community Page is not working</h1>}>
                    <Community role={userData.role} />
                  </ErrorBoundary>
                )}
              />

              {(userData.role === 'SUP' ||
                userData.role === 'ADM' ||
                userData.role === 'TR' ||
                userData.role === 'FLW' ||
                userData.role === 'BLD') && (
                <Route exact path={`${match.url}/csv`} render={() => <Csv />} />
              )}

              <Route
                exact
                path={`${match.url}/classroom/:roomId`}
                render={() => (
                  <ErrorBoundary fallback={<h1>Oops with the Classroom</h1>}>
                    <Classroom
                      classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                      isTeacher={isTeacher}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      activeRoomInfo={activeRoomInfo}
                      setActiveRoomInfo={setActiveRoomInfo}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      handleRoomSelection={handleRoomSelection}
                      syllabusLoading={syllabusLoading}
                    />
                  </ErrorBoundary>
                )}
              />

              <Route
                path={`${match.url}/anthology`}
                render={() => (
                  <Anthology
                    studentAuthID={stateUser?.authId}
                    studentID={stateUser?.id}
                    studentEmail={stateUser?.email}
                    studentName={stateUser?.name}
                  />
                )}
              />

              <Route
                path={`${match.url}/noticeboard`}
                render={() => <NoticeboardAdmin setCurrentPage={setCurrentPage} />}
              />

              {/* <Route
                path={`${match.url}/manage-users`}
                render={() => <UserManagement />}
              /> */}

              <Route path={`${match.url}/registration`} render={() => <Registration />} />

              <Route
                path={`${match.url}/profile`}
                render={() => <Profile updateAuthState={updateAuthState} />}
              />

              <Route
                path={`${match.url}/lesson-planner/:roomId`}
                render={() => (
                  <ErrorBoundary fallback={<h1>Oops with the Lesson-Planner</h1>}>
                    <LessonPlanHome
                      classRoomActiveSyllabus={activeRoomInfo?.activeSyllabus}
                      handleRoomSelection={handleRoomSelection}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      activeRoomInfo={activeRoomInfo}
                      setActiveRoomInfo={setActiveRoomInfo}
                      activeRoomName={activeRoomName}
                      setActiveRoomName={setActiveRoomName}
                      visibleLessonGroup={visibleLessonGroup}
                      setVisibleLessonGroup={setVisibleLessonGroup}
                      lessonLoading={lessonLoading}
                      setLessonLoading={setLessonLoading}
                      syllabusLoading={syllabusLoading}
                      setSyllabusLoading={setSyllabusLoading}
                    />
                  </ErrorBoundary>
                )}
              />

              <Route
                path={`${match.url}/manage-institutions`}
                render={() => <InstitutionsHome setCurrentPage={setCurrentPage} />}
              />

              <Route
                path={`${match.url}/question-bank`}
                render={() => <QuestionBank />}
              />

              {/* <UniversalLessonBuilderProvider>
                <Route
                  path={`${match.url}/lesson-builder`}
                  render={() => <LessonsBuilderHome />}
                />

                <Route
                  path={`${match.url}/universal-lesson-builder`}
                  render={() => <UniversalLessonBuilder />}
                />
              </UniversalLessonBuilderProvider> */}
            </Switch>
          </Suspense>
          {/* <InformationalWalkThrough
            open={openWalkThroughModal}
            onCancel={() => setOpenWalkThroughModal(false)}
          /> */}
        </div>
        {/* </ResizablePanels> */}
      </div>
      <div className="w-full flex justify-center items-center bg-gray-900">
        {/* <DropDownMenu /> */}

        {/* <NavLink to="/dashboard"> */}
        {/* <img
          className="h-16 px-4 py-2"
          src={getAsset(clientKey, 'main_logo')}
          alt="Logo"
        /> */}
        {/* </NavLink> */}
      </div>
    </>
  );
};

export default Dashboard;
