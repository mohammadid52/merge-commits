import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import ErrorBoundary from '@components/Error/ErrorBoundary';
import UserProfileImage from '@components/Molecules/UserProfileImage';
import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import {Language, PersonStatus, Role, UserPageState} from 'API';
import {getAsset} from 'assets';
import BreadcrumbsWithBanner from 'atoms/BreadcrumbsWithBanner';
import Buttons from 'atoms/Buttons';
import {updatePerson} from 'customGraphql/customMutations';
import {getPersonData, listQuestionDatas} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {
  getQuestionData,
  updatePageState,
  uploadImageToS3
} from 'graphql-functions/functions';
import PageLayout from 'layout/PageLayout';
import React, {lazy, useEffect, useState} from 'react';
import {FaEdit} from 'react-icons/fa';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {getUniqItems} from 'utilities/strings';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import {UserInfo} from '../Admin/UserManagement/User';
import UserInformation from '../Admin/UserManagement/UserInformation';

const AboutMe = lazy(() => import('dashboard/Profile/AboutMe'));
const ChangePasscode = lazy(() => import('dashboard/Profile/ChangePasscode'));
const ChangePassword = lazy(() => import('dashboard/Profile/ChangePassword'));
const ProfileCropModal = lazy(() => import('dashboard/Profile/ProfileCropModal'));
const ProfileEdit = lazy(() => import('dashboard/Profile/ProfileEdit'));

const Profile = () => {
  const [person, setPerson] = useState<UserInfo>({
    id: '',
    authId: '',
    createdAt: '',
    email: '',
    firstName: '',
    classes: null,
    rooms: [],
    image: '',
    language: Language.EN,
    lastName: '',
    preferredName: '',
    role: Role.ST,
    status: PersonStatus.ACTIVE,
    updatedAt: ''
  });

  const {state, userLanguage, clientKey, dispatch} = useGlobalContext();
  const {dashboardProfileDict, BreadcrumsTitles} = useDictionary();
  const match = useRouteMatch();

  const pathName = location.pathname.replace(/\/$/, '');
  const currentPath = pathName.substring(pathName.lastIndexOf('/') + 1);
  const [status, setStatus] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [upImage, setUpImage] = useState<any | null>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [stdCheckpoints, setStdCheckpoints] = useState<any[]>([]);
  const [questionData, setQuestionData] = useState<any[]>([]);

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['PROFILE'],
      href: '/dashboard/profile',
      last: true
    }
  ];

  const {authId, email, isStudent, setUser} = useAuth();
  useEffect(() => {
    if (isStudent) {
      updatePageState(
        UserPageState.DASHBOARD,
        {
          authId,
          email,
          pageState: state.user.pageState
        },
        () => {
          dispatch({
            type: 'UPDATE_PAGE_STATE',
            payload: {
              lastPageStateUpdate: new Date().toISOString(),
              pageState: UserPageState.DASHBOARD
            }
          });
        }
      );
    }
  }, [isStudent]);

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };
  const [fileObj, setFileObj] = useState<any>({});

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    const ID = `profile_image_${person.id}`;
    await uploadImageToS3(image ? image : fileObj, ID, fileObj?.type || 'image/jpeg', {
      auth: {authId, email}
    });
    const imageUrl: any = await getImageFromS3(ID);

    setImageUrl(imageUrl);
    setPerson({...person, image: ID});
    updateImageParam(ID);
    toggleCropper();
    setUser(state.user);

    setImageLoading(false);
  };

  async function updateImageParam(imageKey: string) {
    // TODO:
    // Need to check for update only required input values.

    const input = {
      id: person.id,
      image: imageKey,
      authId: person.authId,

      language: person.language,
      lastName: person.lastName,
      preferredName: person.preferredName,
      role: person.role,
      status: person.status,

      email: person.email,
      firstName: person.firstName
    };
    try {
      const update: any = await API.graphql(
        graphqlOperation(updatePerson, {input: input})
      );
      setPerson({
        ...person,
        ...update.data.updatePerson
      });
    } catch (error) {
      console.error('Error updating image on graphql', error);
    }
  }

  async function getUser() {
    try {
      const results: any = await API.graphql(
        graphqlOperation(getPersonData, {
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

      const sortedCheckpointQ = uniqCheckpoints.map((checkpointObj: any) => {
        return {
          ...checkpointObj,
          questions: {
            items: checkpointObj.questionSeq
              ? checkpointObj.questionSeq.map((idStr: string) => {
                  return checkpointObj.questions.items.find(
                    (questionItem: any) => questionItem.question.id === idStr
                  );
                })
              : checkpointObj.questions.items
          }
        };
      });

      const uniqCheckpointIDs: any = sortedCheckpointQ.map((item: any) => item?.id);
      const personalInfo: any = {...userData};
      delete personalInfo.classes;
      if (uniqCheckpointIDs?.length > 0) {
        const questionData = await getQuestionData(
          state.user.email,
          state.user.authId,
          uniqCheckpointIDs
        );
        setQuestionData(questionData);
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

  const mediaRef = React.useRef<any>(null);

  // check if url has staff keyword

  if (status !== 'done') {
    return <LessonLoading />;
  } else {
    return (
      <ErrorBoundary componentName="Profile">
        <div className="relative">
          <BreadcrumbsWithBanner
            items={breadCrumsList}
            bannerImage={profileBanner1}
            title={'Profile'}
          />
          <PageLayout
            hideInstProfile
            extra={
              currentPath !== 'edit' &&
              currentPath !== 'password' && (
                <div className="w-auto">
                  <Buttons
                    dataCy="edit-profile-button"
                    label="Edit"
                    url={`${match.url}/edit`}
                    Icon={FaEdit}
                    tooltip="Edit Profile"
                  />
                </div>
              )
            }
            title={dashboardProfileDict[userLanguage]['TITLE']}>
            {/* <BreadCrums items={breadCrumsList} /> */}

            <div className={``}>
              <div className=" flex flex-col lg:flex-row">
                <UserProfileImage
                  imageUrl={imageUrl}
                  image={person.image}
                  mediaRef={mediaRef}
                  setImage={(img: any, file: any) => {
                    setUpImage(img);
                    setFileObj(file);
                  }}
                  toggleCropper={toggleCropper}
                  imageLoading={imageLoading}
                  name={`${
                    person.preferredName ? person.preferredName : person.firstName
                  } ${person.lastName}`}
                />

                <div className="relative w-full">
                  <Switch>
                    <Route
                      exact
                      path={`${match.url}/`}
                      render={() => (
                        <ErrorBoundary componentName="ProfileInfo">
                          <UserInformation
                            user={person}
                            isProfile
                            checkpoints={stdCheckpoints}
                            questionData={questionData}
                          />
                        </ErrorBoundary>
                      )}
                    />
                    <Route path={`${match.url}/about`} render={() => <AboutMe />} />
                    <Route
                      path={`${match.url}/edit`}
                      render={() => (
                        <ErrorBoundary componentName="ProfileEdit">
                          <ProfileEdit
                            user={person}
                            status={status}
                            setStatus={setStatus}
                            getUser={getUser}
                            stdCheckpoints={stdCheckpoints}
                            questionData={questionData}
                          />
                        </ErrorBoundary>
                      )}
                    />

                    <Route
                      path={`${match.url}/password`}
                      render={() => (
                        <ErrorBoundary componentName="ChangePassword">
                          <ChangePassword />
                        </ErrorBoundary>
                      )}
                    />
                    <Route
                      path={`${match.url}/passcode`}
                      render={() => (
                        <ErrorBoundary componentName="ChangePassword">
                          <ChangePasscode />
                        </ErrorBoundary>
                      )}
                    />
                  </Switch>

                  {showCropper && (
                    <ProfileCropModal
                      open={showCropper}
                      upImg={upImage || ''}
                      saveCroppedImage={(img: string) => saveCroppedImage(img)}
                      closeAction={toggleCropper}
                    />
                  )}
                </div>
              </div>
            </div>
          </PageLayout>
        </div>
      </ErrorBoundary>
    );
  }
};

export default Profile;
