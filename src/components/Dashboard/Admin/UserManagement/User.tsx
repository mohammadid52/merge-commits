import React, {useEffect, useState, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import API, {graphqlOperation} from '@aws-amplify/api';
import {FaEdit} from 'react-icons/fa';
import {IoArrowUndoCircleOutline, IoSendSharp} from 'react-icons/io5';
import {Switch, Route, useRouteMatch, useHistory} from 'react-router-dom';
import Storage from '@aws-amplify/storage';
import useUrlState from '@ahooksjs/use-url-state';
import ReactHtmlParser from 'react-html-parser';

import * as customMutations from '../../../../customGraphql/customMutations';
import * as queries from '../../../../graphql/queries';
import * as mutations from '../../../../graphql/mutations';
import * as customQueries from '../../../../customGraphql/customQueries';

import {GlobalContext} from '../../../../contexts/GlobalContext';
import UserInformation from './UserInformation';
import UserEdit from './UserEdit';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import Buttons from '../../../Atoms/Buttons';
import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import {getImageFromS3} from '../../../../utilities/services';
import useDictionary from '../../../../customHooks/dictionary';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import Loader from '../../../Atoms/Loader';
import {getUniqItems, initials, stringToHslColor} from '../../../../utilities/strings';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import {BiMessageRoundedDots, BiMessageRoundedX} from 'react-icons/bi';
import {isEmpty} from 'lodash';
import {GrSend} from 'react-icons/gr';
import {MdAudiotrack, MdImage} from 'react-icons/md';
import {BsCameraVideo, BsCameraVideoFill} from 'react-icons/bs';
import { getAsset } from '../../../../assets';

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
  role: string;
  status: string;
  phone: string;
  updatedAt: string;
  birthdate?: string;
}

export interface AnthologyContentInterface {
  type: string;
  subType: string;
  title: string;
  subTitle: string;
  description: string;
  content: string;
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

const User = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const {theme, state, userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const tabs = [
    {name: 'User Information', current: true},
    {name: 'Associated Classrooms', current: false},
    {name: 'Notebook', current: false},
  ];

  const [curTab, setCurTab] = useState<string>(tabs[0].name);
  const [questionData, setQuestionData] = useState([]);
  const [stdCheckpoints, setStdCheckpoints] = useState([]);
  const [urlState, setUrlState] = useUrlState(
    {id: '', t: 'p'},
    {navigateMode: 'replace'}
  );

  const [user, setUser] = useState<UserInfo>({
    id: '',
    authId: '',
    courses: null,
    createdAt: '',
    email: '',
    externalId: null,
    firstName: '',
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
  });

  const [imageUrl, setImageUrl] = useState('');
  const location = useLocation();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);

  const {id, t: tab} = urlState;

  const {UserDict, BreadcrumsTitles} = useDictionary(clientKey);
  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['PEOPLE'],
      url: '/dashboard/manage-users',
      last: false,
    },
    {
      title: curTab,
      url: `${location.pathname}${location.search}`,
      last: true,
    },
  ];

  const getQuestionData = async (checkpointIDs: any[], user: any) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item,
        },
      };
    });
    const filter = {
      and: [
        {email: {eq: user.email}},
        {authID: {eq: user.authId}},
        {syllabusLessonID: {eq: '999999'}},
        {
          or: [...checkpointIDFilter],
        },
      ],
    };
    const results: any = await API.graphql(
      graphqlOperation(customQueries.listQuestionDatas, {filter: filter})
    );
    const questionData: any = results.data.listQuestionDatas?.items;
    setQuestionData(questionData);

    // questionData.forEach(async (item: any) => {
    //   await API.graphql(
    //     graphqlOperation(mutations.deleteQuestionData, {input: {id: item.id}})
    //   );
    // });
  };

  async function getUserById(id: string) {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.userById, {id: id})
      );
      const userData = result.data.userById.items.pop();

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentInstitutions: any = studentClasses?.map(
        (item: any) => item?.institution
      );
      const studentRooms: any = studentClasses
        ?.map((item: any) => item?.rooms?.items)
        ?.flat(1);
      const studentCurriculars: any = studentRooms
        .map((item: any) => item?.curricula?.items)
        .flat(1);
      const uniqCurriculars: any = getUniqItems(
        studentCurriculars.filter((d: any) => d !== null),
        'curriculumID'
      );
      const studCurriCheckp: any = uniqCurriculars
        .map((item: any) => item?.curriculum?.checkpoints?.items)
        .flat(1);
      const studentCheckpoints: any = studCurriCheckp.map(
        (item: any) => item?.checkpoint
      );

      let sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      sCheckpoints = sortBy(sCheckpoints, (item: any) => item.scope === 'private');

      const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);
      const personalInfo: any = {...userData};

      delete personalInfo.classes;

      setStdCheckpoints([...uniqCheckpoints]);

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

  const cropSelecetedImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setUpImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      toggleCropper();
    }
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`user_profile_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
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
    await uploadImageToS3(image, user.id, 'image/jpeg');
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
      language: user.language,
    };

    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setUser({
        ...user,
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  useEffect(() => {
    if (typeof id === 'string') {
      getUserById(id);
    }
  }, []);

  const [studentData, setStudentData] = useState<AnthologyMapItem[]>([]);
  const [loading, setLoading] = useState(false);

  // TOP Function to load student data
  const listStudentData = async () => {
    setLoading(true);
    try {
      const studentDataFetch: any = await API.graphql(
        graphqlOperation(queries.listStudentDatas, {
          filter: {studentAuthID: {eq: user.authId}},
        })
      );
      const response = await studentDataFetch;
      const arrayOfResponseObjects = response?.data?.listStudentDatas?.items;

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
                  updatedAt: contentObj.updatedAt,
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
        reducedAnthologyContent.filter((item: any) => item.type === 'journal')
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
      if (user.authId) {
        await listStudentData();
      }
    };
    initializeStudentData();
  }, [user.authId]);

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const disableProfileChange = user.role !== 'ST';

  const setTab = (value: string) => {
    setUrlState({t: value});
  };

  const AssociatedClasses = ({list}: any) => {
    return (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className=" overflow-hidden border-b-0 border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Classname
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Curriculum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item: any, idx: number) => {
                    const rooms = item?.class?.rooms.items;
                    const curriculum = rooms.length > 0 ? rooms[0].curricula : null;
                    const teacher = rooms.length > 0 ? rooms[0].teacher : null;
                    return (
                      <tr
                        key={`${item.class?.name}_${idx}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item?.class?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item?.class?.institution?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher
                            ? `${teacher?.firstName || ''} ${teacher?.lastName || ''}`
                            : 'Not Available'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

  const Tabs = () => {
    const tabsData = !isTeacher ? slice(tabs, 0, 2) : tabs;

    return (
      <div className="w-8/10 bg-white rounded-lg p-2">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            defaultValue={curTab}>
            {tabsData.map((tab) => (
              <option className="transition-all" key={tab.name}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex user__profile-tabs space-x-4" aria-label="Tabs">
            {tabsData.map((tab) => (
              <div
                key={tab.name}
                onClick={() => {
                  setCurTab(tab.name);
                }}
                className={`px-3 hover:bg-indigo-400 py-2 cursor-pointer font-medium tab text-sm rounded-md ${
                  tab.name === curTab ? 'active' : ''
                }`}>
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  function do_resize(textbox:any) {

    var maxrows=5; 
     var txt=textbox.value;
     var cols=textbox.cols;
   
    var arraytxt:any=txt.split('\n');
     var rows=arraytxt.length; 
   
    for (let i=0;i<arraytxt.length;i++) 
      // @ts-ignore
     rows+=parseInt(arraytxt[i].length/cols);
   
    if (rows>maxrows) textbox.rows=maxrows;
     else textbox.rows=rows;
    }

  const StudentData = ({item}: any) => {
    const [showComments, setShowComments] = useState(false);
    const activity: {
      comment: string;
      id: string;
      person: {
        name: string;
        image: string | null;
      };
      commentedAt: Date;
    }[] = [];
    const [commentDb, setCommentDb] = useState(activity);
    const [comment, setComment] = useState('');

    const onCommentSubmit = (e: any) => {
      // e.preventDefault();

      const name = state.user.firstName;

      const image = state.user.image;

      setCommentDb([
        ...commentDb,
        {comment, id: '1', person: {name, image}, commentedAt: new Date()},
      ]);
    };

    

    const actionStyles =
      'flex items-center justify-center ml-2 h-7 w-7 rounded cursor-pointer transition-all duration-150 hover:text-white hover:bg-indigo-400 text-gray-500 ';
    return (
      <div
        className={`w-full white_back pb-2 py-8 px-6 ${theme.elem.bg} ${theme.elem.shadow} mb-8`}>
        <h3 className="text-dark text-2xl font-medium mb-3">{item.title}</h3>
        {item.content && ReactHtmlParser(item.content)}
        {showComments && (
          <div className="comment-container">
            {commentDb &&
              commentDb.map(({comment, person, commentedAt, id}, eventIdx: number) => (
                <div key={id} className="relative">
                  <div className="text-sm text-gray-900 mt-4 flex items-center">
                    <div className="ml-2">
                      <h5 className="font-semibold">
                        {person.name}{' '}
                        <span className="text-xs text-gray-600 font-normal ml-1">
                          {commentedAt}
                        </span>
                      </h5>
                      <p>{comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            <div className="comment-box flex flex-col border-0 border-gray-200 h-auto rounded mt-4">
              <div style={{minHeight: '2.5rem'}} className="flex items-center border-b-0 border-gray-200">
                <textarea
                  onKeyUp={(e) => do_resize(e.target)}
                  style={{resize: 'none'}}
                  placeholder="Add Feedback"
                  className="comment-input text-sm w-9/10 m-2 mx-4 mt-3 text-gray-700"
                  rows={1}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="comment-actions h-10 flex items-center justify-between">
                <div className="left-action w-auto">
                  <div className="flex items-center justify-center">
                    <div
                      className={`${actionStyles}`}>
                      <MdAudiotrack className="" />
                    </div>
                    <div
                      className={`${actionStyles}`}>
                      <BsCameraVideoFill className="" />
                    </div>
                    <div
                      className={`${actionStyles} `}>
                      <MdImage className="" />
                    </div>
                  </div>
                </div>
                <div className="right-action w-auto p-2">
                <div
                      className={`flex items-center justify-center ml-2 h-7 w-7 rounded transition-all duration-150 ${comment.length ? 'bg-indigo-400 text-white cursor-pointer hover:bg-indigo-300' : 'cursor-default text-indigo-300'}`}>
                      <IoSendSharp className="" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-start">
          <div
            onClick={() => setShowComments(!showComments)}
            className="bg-indigo-500 text-white hover:bg-indigo-600 w-auto py-1 p-2 rounded-md transition-all duration-300 text-sm cursor-pointer mt-4 mb-2">
            {showComments ? 'Hide' : 'Show'} Feedbacks
          </div>
        </div>
      </div>
    );
  };

  const isTeacher = state.user.role === 'TR' || state.user.role === 'FLW';
  {
    return (
      <>
        <div className={`mx-auto max-w-256`}>
          <BreadCrums items={breadCrumsList} />
          <div className="flex justify-between items-center mb-4 py-4 w-auto">
            {/* <SectionTitle title={UserDict[userLanguage]['title']} /> */}

            <Tabs />

            <div className="flex justify-end w-auto">
              {/* @Mohammad TODO: Move this goback button upwards */}
              {/* <Buttons
                label="Go Back"
                btnClass="mr-4"
                onClick={history.goBack}
                Icon={IoArrowUndoCircleOutline}
              /> */}
              {currentPath !== 'edit' ? (
                <Buttons
                  btnClass="mr-4 px-6"
                  label="Edit"
                  onClick={() => {
                    setCurTab(tabs[0].name);
                    history.push(`${match.url}/edit${location.search}`);
                  }}
                  Icon={FaEdit}
                />
              ) : null}
            </div>
          </div>
          {curTab === 'User Information' && (
            <div
              className={`w-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
              <div className="h-1/2 flex flex-col md:flex-row">
                <div className="w-1/3 p-4 flex flex-col text-center items-center">
                  <div className="cursor-pointer">
                    {user.image ? (
                      <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                        {!imageLoading ? (
                          <>
                            <label className="cursor-pointer">
                              {imageUrl ? (
                                <img
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                  src={imageUrl}
                                />
                              ) : (
                                <div
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                />
                              )}

                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => cropSelecetedImage(e)}
                                onClick={(e: any) => (e.target.value = '')}
                                accept="image/*"
                                multiple={false}
                                disabled={disableProfileChange}
                              />
                            </label>
                          </>
                        ) : (
                          <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-lightI">
                            <Loader />
                          </div>
                        )}
                      </button>
                    ) : (
                      <label className={`flex justify-center items-center mx-auto`}>
                        {!imageLoading ? (
                          <div
                            className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
                            <div
                              className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                              style={{
                                /* stylelint-disable */
                                background: `${stringToHslColor(
                                  user.firstName + ' ' + user.lastName
                                )}`,
                                textShadow: '0.2rem 0.2rem 3px #423939b3',
                              }}>
                              {initials(
                                user.preferredName ? user.preferredName : user.firstName,
                                user.lastName
                              )}
                            </div>
                          </div>
                        ) : (
                          <Loader />
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => cropSelecetedImage(e)}
                          onClick={(e: any) => (e.target.value = '')}
                          accept="image/*"
                          disabled={disableProfileChange}
                          multiple={false}
                        />
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
                </div>
                <Switch>
                  <Route
                    path={`${match.url}/edit`}
                    render={() => (
                      <UserEdit
                        tab={stdCheckpoints.length > 0 ? tab : 'p'}
                        setTab={setTab}
                        user={user}
                        status={status}
                        setStatus={setStatus}
                        getUserById={getUserById}
                        questionData={questionData}
                        stdCheckpoints={stdCheckpoints}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/`}
                    render={() => (
                      <UserInformation
                        tab={stdCheckpoints.length > 0 ? tab : 'p'}
                        setTab={setTab}
                        questionData={questionData}
                        stdCheckpoints={stdCheckpoints}
                        user={user}
                        status={status}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          )}
          {curTab === 'Associated Classrooms' &&
            user?.classes?.items.length > 0 &&
            user.role === 'ST' && (
              <div
                className={`w-full white_back py-8 px-4 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
                <AssociatedClasses list={user?.classes?.items} />
              </div>
            )}

          {curTab === 'Notebook' &&
            (loading ? (
              <div className="py-20 white_back text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <Loader color="rgba(107, 114, 128, 1)" />
                  <p className="mt-2 text-center text-lg text-gray-500">
                    {'Loading Notebook Data'}
                  </p>
                </div>
              </div>
            ) : studentData && studentData.length > 0 ? (
              studentData.map((item: any) => <StudentData item={item} />)
            ) : (
              <div className="py-20 white_back text-center mx-auto flex justify-center items-center w-full h-48">
                <div className="">
                  <p className="mt-2 text-center text-lg text-gray-500">
                    {'No Notebook Data Found'}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => saveCroppedImage(img)}
            closeAction={toggleCropper}
          />
        )}
      </>
    );
  }
};

export default User;
