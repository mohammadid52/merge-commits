import React, { useContext, useState, useEffect, Fragment } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { RiLock2Fill } from 'react-icons/ri';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { Switch, useHistory, Route, useRouteMatch, Link, NavLink } from 'react-router-dom';

import * as queries from '../../../graphql/queries';
import { GlobalContext } from '../../../contexts/GlobalContext';
import ProfileInfo from './ProfileInfo';
import AboutMe from './AboutMe';
import ChangePassword from './ChangePassword';
import ProfileVault from './ProfileVault';
import ProfileEdit from './ProfileEdit';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import * as customMutations from '../../../customGraphql/customMutations';
import * as customQueries from '../../../customGraphql/customQueries';
import ToolTip from '../../General/ToolTip/ToolTip';
import ProfileCropModal from './ProfileCropModal';
import { getImageFromS3 } from '../../../utilities/services';
import BreadCrums from '../../Atoms/BreadCrums';
import SectionTitle from '../../Atoms/SectionTitle';
import Buttons from '../../Atoms/Buttons';
import Loader from '../../Atoms/Loader';
import useDictionary from '../../../customHooks/dictionary';
import { getUniqItems, createFilterToFetchSpecificItemsOnly } from '../../../utilities/strings';
import { getAsset } from '../../../assets';

export interface UserInfo {
  authId: string;
  courses?: string;
  createdAt: string;
  email: string;
  externalId?: string;
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

interface ProfilePageProps {
  updateAuthState?: Function;
}

const Profile = (props: ProfilePageProps) => {
  const { updateAuthState } = props;
  const [person, setPerson] = useState<UserInfo>({
    id: '',
    authId: '',
    courses: '',
    createdAt: '',
    email: '',
    externalId: '',
    firstName: '',
    grade: null,
    image: null,
    institution: null,
    language: '',
    lastName: '',
    preferredName: null,
    role: '',
    status: '',
    phone: '',
    updatedAt: '',
    birthdate: null,
  });
  const { state, theme, userLanguage, clientKey, dispatch } = useContext(GlobalContext);
  const { dashboardProfileDict, BreadcrumsTitles } = useDictionary(clientKey);
  const match = useRouteMatch();
  const history = useHistory();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const [status, setStatus] = useState('');
  const [select, setSelect] = useState('Profile');
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [stdCheckpoints, setStdCheckpoints] = useState([]);
  const [questionData, setQuestionData] = useState([]);

  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['PROFILE'], url: '/dashboard/profile', last: true },
  ];

  /**
   * Profile component structure needs to be reform to reduce unnecessary API calls.
   *
   *
   */

  // TODO:
  // Set type for file instead of any
  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`profile_image_${id}`, file, {
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

  const deletImageFromS3 = (key: string) => {
    // Remove image from bucket

    return new Promise((resolve, reject) => {
      Storage.remove(key)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('Error in deleting file from s3', err);
          reject(err);
        });
    });
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

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image, person.id, 'image/jpeg');
    const imageUrl: any = await getImageFromS3(`profile_image_${person.id}`);
    setImageUrl(imageUrl);
    setPerson({ ...person, image: `profile_image_${person.id}` });
    updateImageParam(`profile_image_${person.id}`);
    toggleCropper();
    dispatch({
      type: 'SET_USER',
      payload: {
        id: state.user.id,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        language: state.user.language,
        onBoardSurvey: state.user.onBoardSurvey ? state.user.onBoardSurvey : false,
        role: state.user.role,
        image: `profile_image_${person.id}`,
      },
    });
    setImageLoading(false);
  };

  async function updateImageParam(imageKey: string) {
    // TODO:
    // Need to check for update only required input values.

    const input = {
      id: person.id,
      image: imageKey,
      authId: person.authId,
      grade: person.grade,
      language: person.language,
      lastName: person.lastName,
      preferredName: person.preferredName,
      role: person.role,
      status: person.status,
      phone: person.phone,
      birthdate: person.birthdate,
      email: person.email,
      firstName: person.firstName,
    };
    try {
      const update: any = await API.graphql(graphqlOperation(customMutations.updatePerson, { input: input }));
      setPerson({
        ...person,
        ...update.data.updatePerson,
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  const deletUserProfile = async () => {
    await deletImageFromS3(`profile_image_${person.id}`);
    await removeImageUrlFromDb();
  };

  const removeImageUrlFromDb = async () => {
    const input = {
      id: person.id,
      image: '',
      authId: person.authId,
      grade: person.grade,
      language: person.language,
      lastName: person.lastName,
      preferredName: person.preferredName,
      role: person.role,
      status: person.status,
      phone: person.phone,
      birthdate: person.birthdate,
      email: person.email,
      firstName: person.firstName,
    };
    try {
      const update: any = await API.graphql(graphqlOperation(customMutations.updatePerson, { input: input }));
      setPerson({
        ...person,
        ...update.data.updatePerson,
      });
    } catch (error) {
      console.error('Error Deleting image on graphql', error);
    }
  };
  const getQuestionData = async (checkpointIDs: any[]) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item,
        },
      };
    });
    const filter = {
      and: [
        { email: { eq: state.user.email } },
        { authID: { eq: state.user.authId } },
        { syllabusLessonID: { eq: '999999' } },
        {
          or: [...checkpointIDFilter],
        },
      ],
    };
    const results: any = await API.graphql(graphqlOperation(customQueries.listQuestionDatas, { filter: filter }));
    const questionData: any = results.data.listQuestionDatas?.items;
    setQuestionData(questionData);
    console.log(questionData, 'questionData');
  };

  async function getUser() {
    try {
      const results: any = await API.graphql(
        graphqlOperation(customQueries.getPersonData, { email: state.user.email, authId: state.user.authId })
      );

      const userData: any = results.data.getPerson;
      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentInstitutions: any = studentClasses?.map((item: any) => item?.institution);
      const studentRooms: any = studentClasses?.map((item: any) => item?.rooms?.items)?.flat(1);
      const studentCurriculars: any = studentRooms.map((item: any) => item?.curricula?.items).flat(1);
      const uniqCurriculars: any = getUniqItems(
        studentCurriculars.filter((d: any) => d !== null),
        'curriculumID'
      );
      const studCurriCheckp: any = uniqCurriculars.map((item: any) => item?.curriculum?.checkpoints?.items).flat(1);
      const studentCheckpoints: any = studCurriCheckp.map((item: any) => item?.checkpoint);

      const sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item) sCheckpoints.push(item);
      });

      const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');
      const uniqCheckpointIDs: any = uniqCheckpoints.map((item: any) => item?.id);
      const personalInfo: any = { ...userData };
      delete personalInfo.classes;
      if (uniqCheckpointIDs?.length > 0) {
        getQuestionData(uniqCheckpointIDs);
      }
      setStdCheckpoints([...uniqCheckpoints]);
      setPerson(personalInfo);
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    async function getUrl() {
      if (person?.image) {
        const imageUrl: any = await getImageFromS3(person.image);
        setImageUrl(imageUrl);
      }
    }
    getUrl();
  }, [person.image]);

  const profileBanner1 = getAsset(clientKey, 'dashboardBanner1');
  const themeColor = getAsset(clientKey, 'themeClassName');

  if (status !== 'done') {
    return <LessonLoading />;
  }
  {
    return (
      <>
        {/* Hero Section */}
        {/* TODO: Replace hardcoded banner with Hero Banner Component */}
        {/* TODO: Add fade__animation class and paste it in the component.*/}

        <div className="relative">
          <div className="absolute inset-0 w-full h-60">
            <div className=" bg-black bg-opacity-60 z-0 w-full h-full absolute" />
            <img className="object-cover w-full h-full bg-center bg-no-repeat bg-contain" src={profileBanner1} alt="" />
          </div>
          <div className="relative h-full flex items-center justify-center flex-col max-w-7xl">
            <h1
              style={{ fontSize: '6rem' }}
              className="z-100 fade__animation flex align-center self-auto items-center justify-center h-60 text-9xl font-extrabold tracking-tight text-center text-white sm:text-9xl	lg:text-9xl">
              Profile
            </h1>
          </div>
        </div>
        {/* Header */}
        {person && (
          <div
            className={`${theme.section} relative -mt-6 mb-4 px-6 py-4 m-auto ${theme.backGround[themeColor]} text-white rounded`}>
            <h2 className={`text-base text-center font-normal`}>
              <span className="font-semibold">{person.preferredName ? person.preferredName : person.firstName}</span>,
              update your avatar, personal information & profile questions here.
            </h2>
          </div>
        )}
        <div className={`main_container p-0 mx-auto max-w-256`}>
          {/* <BreadCrums items={breadCrumsList} />  */}
          <div className="flex justify-between">
            <SectionTitle
              title={dashboardProfileDict[userLanguage]['TITLE']}
              subtitle={dashboardProfileDict[userLanguage]['SUBTITLE']}
            />
            <div className="flex justify-end py-4 mb-4 w-5/10">
              <Buttons label="Go Back" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
              {currentPath !== 'edit' && currentPath !== 'password' ? (
                <Buttons btnClass="ml-6" label="Edit" onClick={() => history.push(`${match.url}/edit`)} Icon={FaEdit} />
              ) : null}
            </div>
          </div>
          <div
            className={`w-full m-auto max-w-256 p-4 white_back mb-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
            <div className="h-9/10 flex flex-col md:flex-row">
              <div className="w-auto p-4 flex flex-col text-center items-center px-8">
                <div className="relative">
                  {person.image ? (
                    <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                      {!imageLoading ? (
                        <Fragment>
                          <label className="cursor-pointer">
                            <img
                              className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                              src={imageUrl}
                            />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => cropSelecetedImage(e)}
                              onClick={(e: any) => (e.target.value = '')}
                              accept="image/*"
                              multiple={false}
                            />
                          </label>
                        </Fragment>
                      ) : (
                        <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-lightI">
                          <Loader />
                        </div>
                      )}
                      {/* <span className="hidden group-focus:flex justify-around mt-6">
                          <label className="w-8 cursor-pointer">
                            <IconContext.Provider value={{ size: '1.6rem', color: '#B22222' }}>
                              <FaEdit />
                            </IconContext.Provider>
                            <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} onClick={(e: any) => e.target.value = ''} accept="image/*" multiple={false} />
                          </label>
                          <span className="w-8 cursor-pointer" onClick={deletUserProfile}>
                            <IconContext.Provider value={{ size: '1.6rem', color: '#fa0000' }}>
                              <FaTrashAlt />
                            </IconContext.Provider>
                          </span>
                        </span> */}
                    </button>
                  ) : (
                    <label
                      className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light mx-auto`}>
                      {!imageLoading ? (
                        <IconContext.Provider value={{ size: '3rem', color: '#4a5568' }}>
                          <FaPlus />
                        </IconContext.Provider>
                      ) : (
                        <Loader />
                      )}
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => cropSelecetedImage(e)}
                        onClick={(e: any) => (e.target.value = '')}
                        accept="image/*"
                        multiple={false}
                      />
                    </label>
                  )}
                </div>
                <p className="text-gray-600 my-2">{dashboardProfileDict[userLanguage]['PROFILE_INSTRUCTON']} </p>
                <div className={`text-lg md:text-xl font-bold font-open text-gray-900 mt-4 w-52`}>
                  {`${person.preferredName ? person.preferredName : person.firstName} ${person.lastName}`}
                  <p className="text-md md:text-lg">{person.institution}</p>
                </div>
              </div>

              <div className="relative w-full">
                {/* TODO : Need to convert this into tabs instead of buttons. 
                    Currently we have only single tab so hiding this.
                */}

                {/* <div className="w-9/10 md:w-6/10 h-8 pl-6 flex justify-between">
                  <div onClick={() => setSelect('Profile')} className={` ${select === 'Profile' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}`}>
                      My Profile
                    </NavLink>
                  </div>

                  <div onClick={() => setSelect('AboutMe')} className={` ${select === 'AboutMe' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}/about`}>
                      About Me
                    </NavLink>
                  </div>

                  <div onClick={() => setSelect('Vault')} className={` ${select === 'Vault' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}/vault`}>
                      Vault
                    </NavLink>
                  </div>

                </div> */}

                {/* <div className="absolute w-auto" style={{ right: '0', top: '0' }}>
                  <NavLink to={`/dashboard`}>
                    <button type="submit" className="inline-flex justify-center py-2 px-4  border-0 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
                      Go Back
                      <span className="w-8 pl-3 h-4 flex items-center">
                        <IconContext.Provider value={{ size: '2rem', color: '#ffffff' }}>
                          <IoArrowUndoCircleOutline />
                        </IconContext.Provider>
                      </span>
                      <ToolTip
                        position='bottom'
                        header=''
                        display='none'
                        content='Return to Classroom'
                        id={'goBack'}
                        cursor
                        width='w-24 px-1 flex justify-center items-center'
                        fontSize='text-xs'
                      />
                    </button>
                  </NavLink>
                </div> */}

                <Switch>
                  <Route
                    exact
                    path={`${match.url}/`}
                    render={() => (
                      <ProfileInfo
                        user={person}
                        status={status}
                        stdCheckpoints={stdCheckpoints}
                        questionData={questionData}
                      />
                    )}
                  />
                  <Route path={`${match.url}/about`} render={() => <AboutMe />} />
                  <Route
                    path={`${match.url}/edit`}
                    render={() => (
                      <ProfileEdit
                        user={person}
                        status={status}
                        setStatus={setStatus}
                        getUser={getUser}
                        stdCheckpoints={stdCheckpoints}
                        questionData={questionData}
                      />
                    )}
                  />
                  <Route path={`${match.url}/vault`} render={() => <ProfileVault />} />
                  <Route
                    path={`${match.url}/password`}
                    render={() => <ChangePassword updateAuthState={updateAuthState} />}
                  />
                </Switch>
                {showCropper && (
                  <ProfileCropModal
                    upImg={upImage}
                    saveCroppedImage={(img: string) => saveCroppedImage(img)}
                    closeAction={toggleCropper}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Profile;
