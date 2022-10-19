import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import {uploadImageToS3} from 'graphql/functions';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {FaEdit, FaPlus} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {getImageFromS3} from 'utilities/services';
import {getUniqItems} from 'utilities/strings';
import Buttons from 'atoms/Buttons';
import Loader from 'atoms/Loader';
import SectionTitle from 'atoms/SectionTitle';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import DroppableMedia from 'molecules/DroppableMedia';
import AboutMe from './AboutMe';
import ChangePasscode from './ChangePasscode';
import ChangePassword from './ChangePassword';
import ProfileCropModal from './ProfileCropModal';
import ProfileEdit from './ProfileEdit';
import ProfileInfo from './ProfileInfo';
import ProfileVault from './ProfileVault';

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
  const {updateAuthState} = props;
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
    birthdate: null
  });

  const {state, theme, userLanguage, clientKey, dispatch} = useContext(GlobalContext);
  const {dashboardProfileDict, BreadcrumsTitles} = useDictionary(clientKey);
  const match = useRouteMatch();
  const history = useHistory();
  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const [status, setStatus] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [upImage, setUpImage] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const [stdCheckpoints, setStdCheckpoints] = useState([]);
  const [questionData, setQuestionData] = useState([]);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['PROFILE'],
      url: '/dashboard/profile',
      last: true
    }
  ];

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };
  const [fileObj, setFileObj] = useState<any>({});

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    const ID = `profile_image_${person.id}`;
    await uploadImageToS3(image ? image : fileObj, ID, fileObj?.type || 'image/jpeg');
    const imageUrl: any = await getImageFromS3(ID);

    setImageUrl(imageUrl);
    setPerson({...person, image: ID});
    updateImageParam(ID);
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
        image: ID,
        onDemand: state.user?.onDemand
      }
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
      firstName: person.firstName
    };
    try {
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updatePerson, {input: input})
      );
      setPerson({
        ...person,
        ...update.data.updatePerson
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  const getQuestionData = async (checkpointIDs: any[]) => {
    const checkpointIDFilter: any = checkpointIDs.map((item: any) => {
      return {
        checkpointID: {
          eq: item
        }
      };
    });
    const filter = {
      and: [
        {email: {eq: state.user.email}},
        {authID: {eq: state.user.authId}},
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

  async function getUser() {
    try {
      const results: any = await API.graphql(
        graphqlOperation(customQueries.getPersonData, {
          email: state.user.email,
          authId: state.user.authId
        })
      );

      const userData: any = results.data.getPerson;

      let studentClasses: any = userData.classes?.items.map((item: any) => item?.class);
      studentClasses = studentClasses.filter((d: any) => d !== null);

      const studentRooms: any = studentClasses?.reduce((roomAcc: any[], item: any) => {
        if (item?.room) {
          return [...roomAcc, item.room];
        } else {
          return roomAcc;
        }
      }, []);

      const studentCurriculars: any = studentRooms
        .map((item: any) => item?.curricula?.items)
        .flat(1);

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

      const sCheckpoints: any[] = [];

      studentCheckpoints.forEach((item: any) => {
        if (item && item.scope !== 'private') sCheckpoints.push(item);
      });

      const uniqCheckpoints: any = getUniqItems(sCheckpoints, 'id');

      // console.log('uniqCheckpoints - ', uniqCheckpoints);

      const sortedCheckpointQ = uniqCheckpoints.map((checkpointObj: any) => {
        return {
          ...checkpointObj,
          questions: {
            items: checkpointObj.questionSeq
              ? checkpointObj.questionSeq.map((idStr: string) => {
                  let found = checkpointObj.questions.items.find(
                    (questionItem: any) => questionItem.question.id === idStr
                  );
                  return checkpointObj.questions.items.find(
                    (questionItem: any) => questionItem.question.id === idStr
                  );
                })
              : checkpointObj.questions.items
          }
        };
      });
      // console.log('sorted ', sortedCheckpointQ);

      const uniqCheckpointIDs: any = sortedCheckpointQ.map((item: any) => item?.id);
      const personalInfo: any = {...userData};
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

  const mediaRef = React.useRef(null);

  if (status !== 'done') {
    return <LessonLoading />;
  } else {
    return (
      <div className="relative">
        <BreadcrumbsWithBanner
          items={breadCrumsList}
          bannerImage={profileBanner1}
          title={'Profile'}
        />

        <div className={`main_container p-0 mx-auto max-w-256 px-5`}>
          {/* <BreadCrums items={breadCrumsList} /> */}
          <div className="flex justify-between flex-col md:flex-row mt-5">
            <SectionTitle
              title={dashboardProfileDict[userLanguage]['TITLE']}
              subtitle={dashboardProfileDict[userLanguage]['SUBTITLE']}
            />

            {currentPath !== 'edit' && currentPath !== 'password' ? (
              <div className="flex justify-end py-2 2xl:py-4 mb-2 2xl:mb-4 w-full md:w-3/5 lg:w-5/10">
                <Buttons
                  dataCy="edit-profile-button"
                  btnClass="ml-6"
                  label="Edit"
                  onClick={() => history.push(`${match.url}/edit`)}
                  Icon={FaEdit}
                />
              </div>
            ) : null}
          </div>
          <div
            className={`w-full m-auto max-w-256 p-2 md:p-4 white_back mb-2 md:mb-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>
            <div className="h-9/10 flex flex-col lg:flex-row">
              <div className="w-auto p-2 md:p-4 flex flex-col text-center items-center px-8">
                <div className="relative">
                  {person.image ? (
                    <button className="group hover:opacity-80 focus:outline-none focus:opacity-95">
                      {!imageLoading ? (
                        <Fragment>
                          <label className="cursor-pointer">
                            <DroppableMedia
                              setImage={(img: any, file: any) => {
                                setUpImage(img);
                                setFileObj(file);
                              }}
                              toggleCropper={toggleCropper}
                              mediaRef={mediaRef}>
                              {imageUrl ? (
                                <img
                                  data-cy="profile-image"
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                  src={imageUrl}
                                />
                              ) : (
                                <div
                                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light mx-auto`}
                                />
                              )}
                            </DroppableMedia>
                          </label>
                        </Fragment>
                      ) : (
                        <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-lightI">
                          <Loader />
                        </div>
                      )}
                    </button>
                  ) : (
                    <label
                      className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light mx-auto`}>
                      {!imageLoading ? (
                        <IconContext.Provider value={{size: '3rem', color: '#4a5568'}}>
                          <FaPlus />
                        </IconContext.Provider>
                      ) : (
                        <Loader />
                      )}
                      <DroppableMedia
                        mediaRef={mediaRef}
                        setImage={(img: any, file: any) => {
                          setUpImage(img);
                          setFileObj(file);
                        }}
                        toggleCropper={toggleCropper}>
                        <div />
                      </DroppableMedia>
                    </label>
                  )}
                </div>
                <p className="text-gray-600 my-2">
                  {dashboardProfileDict[userLanguage]['PROFILE_INSTRUCTON']}{' '}
                </p>
                <div
                  className={`text-sm md:text-xl font-bold text-gray-900 mt-2 md:mt-4 w-52`}>
                  {`${person.preferredName ? person.preferredName : person.firstName} ${
                    person.lastName
                  }`}
                  <p className="text-md md:text-lg">{person.institution}</p>
                </div>
              </div>

              <div className="relative w-full">
                {/* TODO : Need to convert this into tabs instead of buttons. 
                    Currently we have only single tab so hiding this.
                */}

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
                  <Route
                    path={`${match.url}/passcode`}
                    render={() => <ChangePasscode />}
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
      </div>
    );
  }
};

export default Profile;
