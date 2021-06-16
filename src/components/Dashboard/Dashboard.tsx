import React, {lazy, Suspense, useContext, useEffect, useState} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {GlobalContext} from '../../contexts/GlobalContext';
import {Redirect, Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';

import {getArrayOfUniqueValueByProperty} from '../../utilities/arrays';
import {createFilterToFetchSpecificItemsOnly} from '../../utilities/strings';
import SideMenu from './Menu/SideMenu';
import {useCookies} from 'react-cookie';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../customGraphql/customQueries';
import LessonPlanHome from './LessonPlanner/LessonPlanHome';
import InstitutionsHome from './Admin/Institutons/InstitutionsHome';
import QuestionBank from './Admin/Questions/QuestionBank';
import LessonsBuilderHome from './Admin/LessonsBuilder/LessonsBuilderHome';
import ComponentLoading from '../Lesson/Loading/ComponentLoading';
import NoticeboardAdmin from './NoticeboardAdmin/NoticeboardAdmin';
import Noticebar from '../Noticebar/Noticebar';
import Home from './Home/Home';
import HomeForTeachers from './Home/HomeForTeachers';
import {handleFetchAndCache} from '../../utilities/sessionData';
import FloatingSideMenu from './FloatingSideMenu/FloatingSideMenu';
import ErrorBoundary from '../Error/ErrorBoundary';
import Csv from './Csv/Csv';
import {useParams} from 'react-router';
import UniversalLessonBuilder from '../Lesson/UniversalLessonBuilder/UniversalLessonBuilder';
import {UniversalLessonBuilderProvider} from '../../contexts/UniversalLessonBuilderContext';
import Modal from '../Atoms/Modal';
import Tooltip from '../Atoms/Tooltip';
// const happyEmoji = require('')

// import ClassroomControl from './ClassroomControl/ClassroomControl';
// const DashboardHome = lazy(() => import('./DashboardHome/DashboardHome'))
const Classroom = lazy(() => import('./Classroom/Classroom'));
const Anthology = lazy(() => import('./Anthology/Anthology'));
const Profile = lazy(() => import('./Profile/Profile'));
const Registration = lazy(() => import('./Admin/UserManagement/Registration'));
const UserManagement = lazy(() => import('./Admin/UserManagement/UserManagement'));

type userObject = {
  [key: string]: any;
};

export interface DashboardProps {
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
  justLoggedIn?: boolean;
}

export interface ClassroomControlProps extends DashboardProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const emojiList = [
  {
    emoji: '😠',
    link: 'angry',
    id: '0',
    name: 'Angry',
  },
  {
    emoji: '😞',
    link: 'sad',
    id: '1',
    name: 'Sad',
  },
  {
    emoji: '😐',
    link: 'neutral',
    id: '1',
    name: 'Neutral',
  },

  {
    emoji: '🙂',
    link: 'happy',
    id: '3',
    name: 'Happy',
  },
  {
    emoji: '🤩',
    link: 'excited',
    id: '3',
    name: 'Excited',
  },
];
const EmojiFeedback = ({
  justLoggedIn,
  greetQuestion,
  onSave,
}: {
  justLoggedIn: boolean;
  onSave: (response: string) => void;
  greetQuestion: {question: string};
}) => {
  const onSubmit = () => {
    setShowGreetings(false);
    onSave(selectedEmoji.emoji);
  };

  const [selectedEmoji, setSelectedEmoji] = useState({id: '', emoji: '', name: ''});
  const [showGreetings, setShowGreetings] = useState(justLoggedIn);
  // const [range, setRange] = useState(5);
  // const showRangeSlider = selectedEmoji.name !== '';
  const DEFAULT_QUESTION = 'How are you feeling today?'; // Fallback question
  const showContinueButton = selectedEmoji.name !== '';
  return (
    showGreetings && (
      <Modal
        intenseOpacity
        closeAction={() => setShowGreetings(false)}
        closeOnBackdrop
        showHeader={false}
        showHeaderBorder={false}
        showFooter={false}>
        <div
          style={{minHeight: '10rem'}}
          className={` flex relative items-center min-w-132 justify-center flex-col`}>
          <p className="w-auto mb-6 text-2xl font-semibold">
            {greetQuestion?.question || DEFAULT_QUESTION}
          </p>
          <div className="grid grid-cols-5">
            {emojiList.map(
              ({
                name,
                emoji,
                id,
                link,
              }: {
                link: string;
                emoji: string;
                name: string;
                id: string;
              }) => (
                <Tooltip key={id} text={name} placement="bottom">
                  {link ? (
                    <div
                      onClick={() => setSelectedEmoji({emoji, id, name})}
                      className={`mx-3 w-auto cursor-pointer transition-all duration-300 flex items-center justify-center feedback-emoji ${
                        selectedEmoji.id === id ? 'selected' : ''
                      }`}>
                      <img
                        src={`/media/src/assets/images/emojis/${link}.gif`}
                        alt={name}
                        className="h-20 w-20"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelectedEmoji({emoji, id, name})}
                      className={`mx-3 w-auto cursor-pointer transition-all duration-300 flex items-center justify-center text-5xl feedback-emoji ${
                        selectedEmoji.id === id ? 'selected' : ''
                      }`}>
                      {emoji}
                    </div>
                  )}
                </Tooltip>
              )
            )}
          </div>
          {/* <div className={`emotion_range  ${showRangeSlider ? 'show mt-4 p-2' : ''} `}>
            <p
              className={`${
                showRangeSlider ? 'mb-1' : 'hidden'
              }  w-auto text-dark font-medium`}>
              How much {selectedEmoji.name} you are:
            </p>
            {showRangeSlider && (
              <div className="border-0 p-2 border-gray-200 rounded-md flex items-center justify-center">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={range}
                  onChange={(e) => setRange(e.target.valueAsNumber)}
                  className="slider"
                  id="myRange"
                />
                <label className="w-7 h-7 text-gray-400 ml-4">{range}</label>
              </div>
            )}
          </div>
          {showRangeSlider && (
            <div className={`mt-2 flex items-center justify-between`}>
              <p
                onClick={() => setShowGreetings(false)}
                className={`w-auto cursor-pointer text-sm px-1 py-0.5 text-gray-400 hover:text-${getThemeColor()}-500 transition-all  duration-150`}>
                skip for now
              </p>
              {showRangeSlider ? (
                <p
                  onClick={onSave}
                  className={`w-auto cursor-pointer text-sm px-2 py-0.5 text-white bg-${getThemeColor()}-500 hover:bg-${getThemeColor()}-700 transition-all rounded-md  duration-150`}>
                  save
                </p>
              ) : (
                <div className="w-auto" />
              )}
            </div>
          )} */}

          <div
            style={{bottom: '-1.7rem'}}
            className="flex items-center justify-center absolute right-0 left-0">
            <button
              onClick={() => onSubmit()}
              style={{background: '#333333'}}
              className={`h-8 w-24 rounded text-white  p-1 py-0.5 mt-2 transition-all continue_btn ${
                showContinueButton ? 'show' : 'hide'
              }`}>
              Submit
            </button>
          </div>
        </div>
      </Modal>
    )
  );
};

const Dashboard = (props: DashboardProps) => {
  const {updateAuthState, justLoggedIn} = props;
  const match = useRouteMatch();
  const history = useHistory();
  const [cookies, setCookie, removeCookie] = useCookies(['auth']);
  const [homeDataForTeachers, setHomeDataForTeachers] = useState([]);

  const [userData, setUserData] = useState({
    role: '',
    image: '',
  });
  const {state, dispatch} = useContext(GlobalContext);
  // For controlling loading transitions
  const [lessonLoading, setLessonLoading] = useState<boolean>(false);
  const [syllabusLoading, setSyllabusLoading] = useState<boolean>(false);

  // Page switching
  const [currentPage, setCurrentPage] = useState<string>('');
  const [visibleLessonGroup, setVisibleLessonGroup] = useState<string>('today');
  // const [activeRoom, setActiveRoom] = useState<string>('');
  const [activeRoomInfo, setActiveRoomInfo] = useState<any>();
  const [activeRoomName, setActiveRoomName] = useState<string>('');
  const [activeRoomSyllabus, setActiveRoomSyllabus] = useState<string>('');
  const thereAreSideWidgets: boolean = state.roomData.widgets.some(
    (widget: any) => widget.placement === 'sidebar'
  );
  // TODO: Add @thereAreSideWidgets boolean to not show side widget bar if the length is 0;

  // Fetching results
  const [homeData, setHomeData] = useState<{class: any}[]>();
  const [classList, setClassList] = useState<any[]>();

  //updateQuestion

  const [greetQuestion, setGreetQuestion] = useState({question: ''});
  const DEFAULT_CHECKPOINT_ID: string = '5372952f-ad80-4677-985a-e798c89d6bb7';
  const DEFAULT_QUESTION_ID: string = '6867fd8e-2457-409c-ba34-f2ffabdf7385'; // THIS IS STATIC -- @key5: Change this

  const getGreetQuestion = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.getQuestion, {
          id: DEFAULT_QUESTION_ID,
        })
      );
      console.log(result.data.getQuestion);

      setGreetQuestion(result.data.getQuestion);
    } catch (error) {
      console.error(error);
    }
  };

  const updateGreetQuestion = async (response: any) => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(mutations.updateQuestionData, {
          input: {
            id: DEFAULT_CHECKPOINT_ID,
            responseObject: [{qid: DEFAULT_QUESTION_ID, response}],
          },
        })
      );
      setGreetQuestion(result.data.getQuestion);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (justLoggedIn) {
      // getGreetQuestion();
    }
  }, [justLoggedIn]);

  const [classIds, setClassIds] = useState<string[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [curriculumIds, setCurriculumIds] = useState<string[]>([]);
  const [syllabusLessonSequence, setSyllabusLessonSequence] = useState<string[]>(['']);
  // Menu state
  const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);

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
      },
    });

    setCookie(
      'auth',
      {...cookies.auth, role: user.role, firstName: firstName, id: user.id},
      {path: '/'}
    );
  };

  const handleRoomSelection = (
    id: string,
    name: string,
    i: number,
    route = 'classroom'
  ) => {
    if (
      (state.activeRoom !== id && state.currentPage !== 'lesson-planner') ||
      (state.activeRoom !== id && state.currentPage !== 'classroom')
    ) {
      setActiveRoomName(name);
      dispatch({type: 'UPDATE_ACTIVEROOM', payload: {data: id}});
      setSyllabusLoading(true);
      setLessonLoading(true);
      setActiveRoomSyllabus(state.roomData.rooms[i].activeSyllabus);
      history.push(`/dashboard/${route}/${id}`);
    }
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

  /**
   * INIT ADMIN NOT LOADING ANYTHING
   */
  useEffect(() => {
    const userRole = state.user.role;
    if (userRole === 'ADM') {
      setRoomsLoading(true);
    }
  }, []);

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
      // const dashboardDataFetch = await handleFetchAndCache(queryObj);
      const dashboardDataFetch = await API.graphql(
        graphqlOperation(customQueries.getDashboardData, queryObj.valueObj)
      );
      const response = await dashboardDataFetch;

      // @ts-ignore
      let arrayOfResponseObjects = await response?.data.getPerson.classes.items;

      console.log('all student classes - ', arrayOfResponseObjects);

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

      const response = await dashboardDataFetch;
      let arrayOfResponseObjects = response?.data?.listRooms?.items;
      arrayOfResponseObjects = arrayOfResponseObjects.map((item: any) => {
        return {class: {rooms: {items: arrayOfResponseObjects}}};
      });

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
              rooms: dataObj?.class?.rooms,
              students: dataObj?.class?.students,
            },
          ];
        }, [])
      : [];

  useEffect(() => {
    if (homeData && homeData.length > 0 && getClassList.length > 0) {
      setClassList(getClassList);
    }
  }, [homeData]);

  const getRoomsFromClassList =
    classList && classList.length > 0
      ? classList.reduce((acc: any[], classObj: any) => {
          if (classObj.rooms.items.length > 0) {
            return [...acc, classObj.rooms.items[0]];
          } else {
            return acc;
          }
        }, [])
      : [];

  useEffect(() => {
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'rooms',
        data: getRoomsFromClassList,
      },
    });
  }, [classList]);

  /******************************************
   * 2.1 LIST TEACHER ROOMS                 *
   ******************************************/
  const listRoomTeacher = async (teacherAuthID: string) => {
    try {
      const queryObj = {
        name: 'customQueries.listRooms',
        valueObj: {filter: {teacherAuthID: {eq: teacherAuthID}}},
      };

      // const classIdFromRoomsFetch = await handleFetchAndCache(queryObj);
      const classIdFromRoomsFetch = await API.graphql(
        graphqlOperation(customQueries.listRooms, queryObj.valueObj)
      );
      const response = await classIdFromRoomsFetch;
      //@ts-ignore
      const arrayOfResponseObjects = response?.data?.listRooms?.items;

      setRooms(arrayOfResponseObjects);
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

  /******************************************
   * 3.1 LIST ALL WIDGETS FOR ROOM          *
   ******************************************/
  useEffect(() => {
    const listRoomWidgets = async () => {
      setWidgetLoading(true);
      //
      try {
        const queryObj = {
          name: 'queries.listNoticeboardWidgets',
          valueObj: {filter: {roomID: {eq: state.activeRoom}}},
        };

        const noticeboardWidgetsFetch = await handleFetchAndCache(queryObj);
        const response = await noticeboardWidgetsFetch;
        const arrayOfResponseObjects = response?.data?.listNoticeboardWidgets?.items;

        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'widgets',
            data: arrayOfResponseObjects,
          },
        });
      } catch (e) {
        console.error('listNoticeboardWidgetsFetch: -> ', e);
      } finally {
        setWidgetLoading(false);
      }
    };
    if (state.activeRoom && widgetLoading === false) {
      listRoomWidgets();
    }
  }, [state.activeRoom]);

  /**
   * 4. LIST ALL CURRICULUMS ASSOCIATED WITH ROOM of ID
   */
  useEffect(() => {
    const listRoomCurriculums = async () => {
      if (state.roomData.rooms.length > 0) {
        try {
          const queryObj = {
            name: 'customQueries.listRoomCurriculums',
            valueObj: {
              roomID: {eq: state.activeRoom},
            },
          };

          /***************************************************
           *                                                 *
           * DISABLED handleFetchAndCache()                  *
           * TO TROUBLESHOOT LESSONS NOT LOADING             *
           * ON SYLLABUS-ACTIVATION SWTICH                   *
           *                                                 *
           ***************************************************/
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
          console.log('roomCurriculums list - ', arrayOfResponseObjects);
          const arrayOfCurriculumIds = getArrayOfUniqueValueByProperty(
            arrayOfResponseObjects,
            'curriculumID'
          );

          setCurriculumIds(arrayOfCurriculumIds);
        } catch (e) {
          console.error('RoomCurriculums fetch ERR: ', e);
        }
      }
    };
    listRoomCurriculums();
  }, [state.activeRoom]);

  // Save info of selected room to cookie
  useEffect(() => {
    const getRoomFromState = state.roomData.rooms.filter(
      (room: any) => room.id === state.activeRoom
    );
    if (getRoomFromState.length === 1) {
      setCookie('room_info', getRoomFromState[0]);
      setActiveRoomInfo(getRoomFromState[0]);
    } else {
      setCookie('room_info', {});
    }
  }, [state.activeRoom]);

  /**
   * 5. LIST AVAILABLE SYLLABUS and GET SEQUENCE TO SORT SYLLABI
   */
  useEffect(() => {
    const listSyllabus = async () => {
      if (curriculumIds.length > 0) {
        try {
          const queryObj = {
            name: 'queries.getCSequences',
            valueObj: {
              id: `s_${curriculumIds[0]}`,
            },
          };

          const queryObj2 = {
            name: 'customQueries.listSyllabuss',
            valueObj: {
              filter: {
                ...createFilterToFetchSpecificItemsOnly(curriculumIds, 'curriculumID'),
              },
            },
          };

          /***************************************************
           *                                                 *
           * DISABLED handleFetchAndCache()                  *
           * TO TROUBLESHOOT LESSONS NOT LOADING             *
           * ON SYLLABUS-ACTIVATION SWTICH                   *
           *                                                 *
           ***************************************************/
          // const syllabusCSequenceFetch = await handleFetchAndCache(queryObj);
          const syllabusCSequenceFetch = await API.graphql(
            graphqlOperation(queries.getCSequences, queryObj.valueObj)
          );
          // const syllabusMultiFetch = await handleFetchAndCache(queryObj2);
          const syllabusMultiFetch = await API.graphql(
            graphqlOperation(customQueries.listSyllabuss, queryObj2.valueObj)
          );

          const responseRoomSyllabusSequence = await syllabusCSequenceFetch;
          const responseRoomSyllabus = await syllabusMultiFetch;
          console.log('available syllabus -', responseRoomSyllabus);

          const arrayOfRoomSyllabusSequence =
            //@ts-ignore
            responseRoomSyllabusSequence?.data.getCSequences?.sequence;
          //@ts-ignore
          const arrayOfRoomSyllabus = responseRoomSyllabus?.data?.listSyllabuss?.items;

          // IF A SEQUENCE WAS RETURNED, REORDER, ELSE DO NOT REORDER
          const roomSyllabusReordered = arrayOfRoomSyllabusSequence
            ? arrayOfRoomSyllabusSequence.reduce(
                (acc: any[], syllabusID: string, idx: number) => {
                  const matchedSyllabus = arrayOfRoomSyllabus.find(
                    (responseObj: any) => responseObj.id === syllabusID
                  );
                  if (matchedSyllabus) {
                    return [...acc, matchedSyllabus];
                  } else {
                    return acc;
                  }
                },
                []
              )
            : arrayOfRoomSyllabus;

          const mappedResponseObjects = roomSyllabusReordered.map(
            (responseObject: any, idx: number) => {
              if (activeRoomSyllabus === responseObject.id) {
                return {...responseObject, active: true};
              } else {
                return {...responseObject, active: false};
              }
            }
          );

          dispatch({
            type: 'UPDATE_ROOM',
            payload: {
              property: 'syllabus',
              data: mappedResponseObjects,
            },
          });

          setSyllabusLoading(false);
          setLessonLoading(false);
        } catch (e) {
          console.error('Curriculum ids ERR: ', e);
        }
      }
    };

    listSyllabus();
  }, [curriculumIds]);

  /******************************************
   * 6.1 LIST ALL THE SYLLABUS LESSON       *
   *      - SEQUENCES                       *
   *      - LESSONS                         *
   ******************************************/

  const getSyllabusLessonCSequence = async (syllabusID: string) => {
    try {
      const queryObj = {
        name: 'queries.getCSequences',
        valueObj: {id: `lesson_${syllabusID}`},
      };

      // const syllabusLessonCSequenceFetch = handleFetchAndCache(queryObj);
      const syllabusLessonCSequenceFetch = await API.graphql(
        graphqlOperation(queries.getCSequences, queryObj.valueObj)
      );
      const response = await syllabusLessonCSequenceFetch;
      //@ts-ignore
      const arrayOfResponseObjects = response?.data.getCSequences?.sequence;
      setSyllabusLessonSequence(arrayOfResponseObjects);
    } catch (e) {
      console.error('getSyllabusLessonCSequence -> ', e);
    }
  };

  const listSyllabusLessons = async (
    lessonPlannerSyllabus: any,
    classRoomActiveSyllabus: any
  ) => {
    setLessonLoading(true);
    dispatch({
      type: 'UPDATE_ROOM',
      payload: {
        property: 'lessons',
        data: [],
      },
    });
    /**
     * getActiveSyllabus explanation:
     *  IF we're on the lesson-planner page, that means the teacher has the ability to activate
     *  a syllabus
     *    SO the first filter will return an array with max length 1 if any syllabus for that room are active
     *    BUT it will return array with length 0 if no syllabus for that room are active
     *  IF we're on the classroom page, multiple syllabus will not be loaded
     *    SO the room objects in room array should contain an activeSyllabus property
     *    THEREFORE if there is an active syllabus, this filter will return a string OR []
     *  FINALLY if there are no active syllabus anywhere, return empty array
     */

    const getActiveSyllabus =
      state.currentPage === 'lesson-planner'
        ? lessonPlannerSyllabus
        : classRoomActiveSyllabus;
    /**
     * IF there are any syllabus active, do a fetch for lessons
     */
    if (getActiveSyllabus.length > 0) {
      try {
        const queryObj = {
          name: 'customQueries.listSyllabusLessons',
          valueObj: {
            syllabusID: getActiveSyllabus[0].id,
          },
        };

        // const syllabusLessonFetch = await handleFetchAndCache(queryObj);
        const syllabusLessonFetch = await API.graphql(
          graphqlOperation(customQueries.listSyllabusLessons, queryObj.valueObj)
        );
        const response = await syllabusLessonFetch;
        //@ts-ignore
        const arrayOfResponseObjects = response?.data?.listSyllabusLessons?.items;
        // SOMETHING TO REFACTOR
        const syllabusLessonsReordered = syllabusLessonSequence.reduce(
          (acc: any[], syllabusLessonID: string, idx: number) => {
            const matchedLesson = arrayOfResponseObjects.find(
              (responseObj: any) => responseObj.id === syllabusLessonID
            );
            if (matchedLesson) {
              return [...acc, matchedLesson];
            } else {
              return acc;
            }
          },
          []
        );

        dispatch({
          type: 'UPDATE_ROOM',
          payload: {
            property: 'lessons',
            // data: syllabusLessonsReordered,
            data: arrayOfResponseObjects,
          },
        });
      } catch (e) {
        console.error('syllabus lessons: ', e);
      } finally {
        setLessonLoading(false);
      }
    }
  };

  const lessonPlannerSyllabus =
    state.roomData.syllabus.length > 0
      ? state.roomData.syllabus.filter((syllabusObject: any) => {
          if (syllabusObject.hasOwnProperty('active') && syllabusObject.active) {
            return syllabusObject;
          }
        })
      : [];

  const classRoomActiveSyllabus = state.roomData.rooms
    .filter((room: any) => room.id === state.activeRoom)
    .map((room: any) => {
      return {id: room.activeSyllabus};
    });

  useEffect(() => {
    const getSyllabusLessonsAndCSequence = async () => {
      await getSyllabusLessonCSequence(classRoomActiveSyllabus[0].id);
    };

    if (
      state.roomData.syllabus &&
      state.roomData.syllabus.length > 0 &&
      classRoomActiveSyllabus[0]
    ) {
      console.log('different active syllabus --', classRoomActiveSyllabus[0].id);
      getSyllabusLessonsAndCSequence();
    }
  }, [state.roomData.syllabus]);

  useEffect(() => {
    if (syllabusLessonSequence && syllabusLessonSequence.length > 0) {
      listSyllabusLessons(lessonPlannerSyllabus, classRoomActiveSyllabus);
    } else {
      setLessonLoading(false);
    }
  }, [syllabusLessonSequence]);

  const HomeSwitch = () =>
    isTeacher ? (
      <HomeForTeachers
        homeData={homeDataForTeachers}
        isTeacher={isTeacher}
        handleRoomSelection={handleRoomSelection}
      />
    ) : (
      <Home
        homeData={homeData}
        classList={classList}
        setActiveRoomInfo={setActiveRoomInfo}
        handleRoomSelection={handleRoomSelection}
      />
    );

  return (
    <div className="relative h-screen flex overflow-hidden container_background">
      {/* {state.user.role === 'ST' && (
        <EmojiFeedback
          greetQuestion={greetQuestion}
          justLoggedIn={justLoggedIn}
          onSave={(response: string) => updateGreetQuestion(response)}
        />
      )} */}
      {/* <ResizablePanels> */}
      <SideMenu
        setActiveRoomSyllabus={setActiveRoomSyllabus}
        setLessonLoading={setLessonLoading}
        setSyllabusLoading={setSyllabusLoading}
        setActiveRoomName={setActiveRoomName}
        updateAuthState={updateAuthState}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        role={userData.role}
        handleRoomSelection={handleRoomSelection}
      />

      <div className="h-full overflow-y-auto">
        {/*<FloatingSideMenu />*/}
        <Noticebar inputContext={'global'} />
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
                  } else return <Redirect to={`${match.url}/manage-institutions`} />;
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

            {(userData.role === 'ADM' ||
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
                    isTeacher={isTeacher}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activeRoomInfo={activeRoomInfo}
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

            <Route path={`${match.url}/anthology`} render={() => <Anthology />} />

            <Route
              path={`${match.url}/noticeboard`}
              render={() => <NoticeboardAdmin setCurrentPage={setCurrentPage} />}
            />

            <Route path={`${match.url}/manage-users`} render={() => <UserManagement />} />

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
                    handleRoomSelection={handleRoomSelection}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activeRoomInfo={activeRoomInfo}
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

            <Route path={`${match.url}/question-bank`} render={() => <QuestionBank />} />

            <Route
              path={`${match.url}/lesson-builder`}
              render={() => <LessonsBuilderHome />}
            />

            <Route
              path={`${match.url}/universal-lesson-builder`}
              render={() => (
                <UniversalLessonBuilderProvider>
                  <UniversalLessonBuilder />
                </UniversalLessonBuilderProvider>
              )}
            />
          </Switch>
        </Suspense>
      </div>
      {/* </ResizablePanels> */}
    </div>
  );
};

export default Dashboard;
