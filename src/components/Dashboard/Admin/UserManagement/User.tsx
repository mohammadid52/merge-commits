import React, {useEffect, useState, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import API, {graphqlOperation} from '@aws-amplify/api';
import {FaEdit} from 'react-icons/fa';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {Switch, Route, useRouteMatch, useHistory} from 'react-router-dom';
import Storage from '@aws-amplify/storage';
import useUrlState from '@ahooksjs/use-url-state';

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
import {sortBy} from 'lodash';
import SectionTitleV3 from '../../../Atoms/SectionTitleV3';

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

const User = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const {theme, userLanguage, clientKey} = useContext(GlobalContext);
  const [status, setStatus] = useState('');
  const [upImage, setUpImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
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
      title: BreadcrumsTitles[userLanguage]['UserInfo'],
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

  if (status !== 'done') {
    return <LessonLoading />;
  }

  const disableProfileChange = user.role !== 'ST';

  const setTab = (value: string) => {
    setUrlState({t: value});
  };

  const TeacherImage = ({teacher}: any) => {
    const [teacherImgUrl, setTeacherImgUrl] = useState(null);
    useEffect(() => {
      async function getUrl() {
        if (teacher.image) {
          const imageUrl: any = await getImageFromS3(teacher.image);
          setTeacherImgUrl(imageUrl);
        }
      }
      getUrl();
    }, [teacher.image]);
    return teacher.image ? (
      <img
        className={`profile w-8 h-8 md:w-8 md:h-8 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mr-4`}
        src={teacherImgUrl}
      />
    ) : (
      <div
        className={`w-8 h-8 md:w-8 md:h-8 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light mr-4`}>
        <div
          className="h-full w-full flex justify-center items-center text-sm text-extrabold text-white rounded-full"
          style={{
            /* stylelint-disable */
            background: `${stringToHslColor(user.firstName + ' ' + user.lastName)}`,
            // textShadow: '0.2rem 0.2rem 3px #423939b3',
          }}>
          {initials(
            user.preferredName ? user.preferredName : user.firstName,
            user.lastName
          )}
        </div>
      </div>
    );
  };

  {
    return (
      <>
        <div className={``}>
          <BreadCrums items={breadCrumsList} />
          <div className="flex justify-between">
            <SectionTitle title={UserDict[userLanguage]['title']} />

            <div className="flex justify-end py-4 mb-4 w-5/10">
              <Buttons
                label="Go Back"
                btnClass="mr-4"
                onClick={history.goBack}
                Icon={IoArrowUndoCircleOutline}
              />
              {currentPath !== 'edit' ? (
                <Buttons
                  btnClass="mr-4 px-6"
                  label="Edit"
                  onClick={() => history.push(`${match.url}/edit${location.search}`)}
                  Icon={FaEdit}
                />
              ) : null}
            </div>
          </div>
          <div
            className={`w-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow} mb-8`}>
            <div className="h-9/10 flex flex-col md:flex-row">
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
          {user?.classes?.items.length > 0 && user.role === 'ST' && (
            <div>
              <SectionTitleV3 title={'Associated Classrooms'} />

              <div
                className={`grid grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-x-4 pb-8 ${theme.elem.text} mb-8`}>
                {user?.classes?.items.map((item: any, index: number) => {
                  const rooms = item?.class?.rooms.items;

                  const curriculum = rooms.length > 0 ? rooms[0].curricula : null;
                  const teacher = rooms.length > 0 ? rooms[0].teacher : null;
                  return (
                    <div
                      className="my-2 white_back flex flex-col items-center justify-center min-w-64 min-h-32"
                      key={item.class.id + '__' + index}>
                      <div className="flex items-center justify-center p-4 px-6">
                        <p className="text-gray-400 text-md font-medium mt-2">
                          Classname:
                        </p>{' '}
                        <p className="text-dark text-md font-medium mt-2">
                          {item?.class?.name}
                        </p>
                      </div>
                      <div style={{height: '1px'}} className="bg-gray-200" />
                      <div className="flex items-center justify-center px-6 p-4">
                        <p className="text-gray-400 text-md font-medium mt-2">
                          Institution:
                        </p>{' '}
                        <p className="text-dark text-md font-medium mt-2">
                          {item?.class?.institution?.name}
                        </p>
                      </div>

                      <div style={{height: '1px'}} className="bg-gray-200" />
                      <div className="flex items-center justify-center px-6 p-4">
                        <p className="text-gray-400 text-md font-medium mt-2">Teacher:</p>{' '}
                        <div className="text-dark text-md flex items-center font-medium mt-2">
                          {teacher ? <TeacherImage teacher={teacher} /> : null}
                          {teacher
                            ? `${teacher?.firstName || ''} ${teacher?.lastName || ''}`
                            : 'Not Available'}
                        </div>
                      </div>

                      <div style={{height: '1px'}} className="bg-gray-200" />
                      <div className="flex items-center justify-center px-6 p-4">
                        <p className="text-gray-400 text-md font-medium mt-2">
                          Curriculum:
                        </p>{' '}
                        <p className="text-dark text-md font-medium mt-2">
                          {curriculum
                            ? `${curriculum?.items[0]?.curriculum?.name}${
                                curriculum?.items[0]?.length > 1 ? '...' : ''
                              }`
                            : 'Not Available'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
