import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import Loader from '@components/Atoms/Loader';
import Registration from '@components/Dashboard/Admin/UserManagement/Registration';
import Csv from '@components/Dashboard/Csv/Csv';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import {UniversalLessonBuilderProvider} from '@contexts/UniversalLessonBuilderContext';
import * as customMutations from '@customGraphql/customMutations';
import DroppableMedia from '@molecules/DroppableMedia';
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {AiOutlineCamera} from 'react-icons/ai';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';
import {IoIosGlobe} from 'react-icons/io';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import {getImageFromS3} from '../../../../utilities/services';
import {
  formatPhoneNumber,
  getInitialsFromString,
  initials,
  stringToHslColor,
} from '../../../../utilities/strings';
import LessonsBuilderHome from '../LessonsBuilder/LessonsBuilderHome';
import User from '../UserManagement/User';
import UserLookup from '../UserManagement/UserLookup';
import InstitutionBuilder from './Builders/InstitutionBuilder/InstitutionBuilder';
import ClassRoomBuilder from './EditBuilders/ClassRoom/ClassRoomBuilder';
import CourseBuilder from './EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import UnitBuilder from './EditBuilders/CurricularsView/TabsActions/Unit/UnitBuilder';
import UnitList from './EditBuilders/CurricularsView/TabsActions/Unit/UnitList';
import ClassList from './Listing/ClassList';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';
import StaffBuilder from './Listing/StaffBuilder';
import Students from './Students';
import {useParams} from 'react-router';
import {useQuery} from '@customHooks/urlParam';

interface InstitutionInfoProps {
  institute?: InstInfo;
  loading: boolean;
  updateServiceProviders: Function;
  tabProps?: any;
  toggleUpdateState?: () => void;
  postInfoUpdate?: (data: any) => void;
}
interface InstInfo {
  id: string;
  name: string;
  type: string;
  website: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  image: string;
  phone: string;
  classes: {items: {name?: string; id: string}[]};
  curricula: {items: {name?: string; id: string}[]};
  isServiceProvider: boolean;
  serviceProviders?: {
    items: {id: string; providerID: string; status: string; providerInstitution?: any}[];
  };
}

const InstitutionInfo = (instProps: InstitutionInfoProps) => {
  const {institute, tabProps} = instProps;

  const match = useRouteMatch();

  const pathname = window.location.pathname;
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState();
  const [upImage, setUpImage] = useState(null);
  const [fileObj, setFileObj] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [s3Image, setS3Image] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const {
    theme,
    clientKey,
    userLanguage,
    state: {user},
  } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {Institute_info} = useDictionary(clientKey);
  const mediaRef = useRef(null);

  // const headerMenusForInstitution = [
  //   {
  //     title: Institute_info[userLanguage]['TABS']['INSTITUTION_MANAGER'],
  //     key: 'institution',
  //     type: 'dropdown',
  //     children: [
  //       {
  //         title: Institute_info[userLanguage]['TABS']['GENERAL_INFORMATION'],
  //         key: 'general_information',
  //         redirectionUrl: `${match.url}/edit`,
  //         active: location.pathname.indexOf('/edit') > -1,
  //       },
  //       {
  //         title: Institute_info[userLanguage]['TABS']['STAFF'],
  //         key: 'staff',
  //         redirectionUrl: `${match.url}/staff`,
  //         active: location.pathname.indexOf('staff') > -1,
  //       },
  //       {
  //         title: 'User registry',
  //         key: 'user_registry',
  //         redirectionUrl: `${match.url}/person`,
  //         active: location.pathname.indexOf('register') > -1,
  //       },
  //       {
  //         title: 'Register New User',
  //         key: 'register',
  //         redirectionUrl: `${match.url}/register-user`,
  //         active: location.pathname.indexOf('register-user') > -1,
  //       },
  //     ].filter(Boolean),
  //   },
  //   {
  //     title: Institute_info[userLanguage]['TABS']['COURSE_MANAGER'],
  //     key: 'course',
  //     type: 'dropdown',
  //     children: [
  //       {
  //         title: 'Courses',
  //         key: 'course',
  //         redirectionUrl: `${match.url}/courses`,
  //         active: location.pathname.indexOf('course') > -1,
  //       },
  //       {
  //         title: 'Units',
  //         key: 'unit',
  //         redirectionUrl: `${match.url}/units`,
  //         active: location.pathname.indexOf('units') > -1,
  //       },
  //       {
  //         title: Institute_info[userLanguage]['TABS']['LESSONS'],
  //         key: 'lessons',
  //         redirectionUrl: `${match.url}/lessons`,
  //         active: location.pathname.indexOf('lessons') > -1,
  //       },
  //       {
  //         title: 'Game Changers ',
  //       },
  //     ],
  //   },
  //   {
  //     title: Institute_info[userLanguage]['TABS']['CLASS_MANAGER'],
  //     key: 'class',
  //     type: 'dropdown',
  //     children: [
  //       {
  //         title: Institute_info[userLanguage]['TABS']['CLASSES'],
  //         key: 'class',
  //         redirectionUrl: `${match.url}/class`,
  //         active: location.pathname.indexOf('class') > -1,
  //       },
  //       {
  //         title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
  //         key: 'class_room',
  //         redirectionUrl: `${match.url}/class-rooms`,
  //         active: location.pathname.indexOf('room') > -1,
  //       },
  //       (user.role === 'FLW' || user.role === 'TR') && {
  //         title: Institute_info[userLanguage]['TABS']['STUDENT_ROASTER'],
  //         key: 'roaster',
  //         redirectionUrl: `${match.url}/class-rooms`,
  //         active: location.pathname.indexOf('room') > -1,
  //       },
  //     ].filter(Boolean),
  //   },
  //   {
  //     title: Institute_info[userLanguage]['TABS']['COMMUNITY_MANAGER'],
  //     key: 'community',
  //     type: 'dropdown',
  //     children: [
  //       {
  //         title: 'New Person Spotlight',
  //       },
  //       {
  //         title: 'Announcements & Events',
  //       },
  //       {
  //         title: 'Front Page',
  //       },
  //     ],
  //   },
  //   {
  //     title: Institute_info[userLanguage]['TABS']['RESEARCH_AND_ANALYTICS'],
  //     key: 'research_and_analytics',
  //     redirectionUrl: `${match.url}/research-and-analytics`,
  //   },
  // ];

  const updateTab = ({key, redirectionUrl}: any) => {
    // tabProps.setTabsData({...tabProps.tabsData, inst: key});
    // if (redirectionUrl) {
    //   history.push(redirectionUrl);
    // }
    // if (tab === 'user_registry') {
    //   history.push(`/dashboard/manage-users`);
    // } else if (tab === 'unit') {
    //   // history.push(`/dashboard/manage-institutions/${institute?.id}/curricular/${curricularId}/syllabus/add`)
    // } else {
    //   tabProps.setTabsData({...tabProps.tabsData, inst: tab});
    // }
  };

  useEffect(() => {
    getUrl();
  }, [instProps?.institute?.image]);

  async function getUrl() {
    const imageUrl: any = await getImageFromS3(instProps?.institute?.image);
    setImageUrl(imageUrl);
  }

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image ? image : fileObj, institute?.id, 'image/jpeg');
    const input = {
      id: institute?.id,
      image: `instituteImages/institute_image_${institute?.id}`,
    };
    await API.graphql(
      graphqlOperation(customMutations.updateInstitution, {input: input})
    );
    await getUrl();
    toggleCropper();
    setImageLoading(false);
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`instituteImages/institute_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
      })
        .then((result) => {
          console.log('File successfully uploaded to s3', result);
          resolve(true);
        })
        .catch((err) => {
          // setError({
          //   show: true,
          //   errorMsg: InstitutionBuilderDict[userLanguage]['messages']['uploaderr'],
          // });
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const handleImageClick = () => mediaRef?.current?.click();

  const {
    address = '',
    addressLine2 = '',
    city = '',
    state = '',
    zip = '',
    phone = '',
    website = '',
    isServiceProvider = false,
  } = instProps?.institute;

  // ~~~~~~~~~~~ CURRICULAR LIST ~~~~~~~~~~~ //
  const [curricular, setCurricular] = useState<any>({});
  useEffect(() => {
    if (instProps?.institute?.curricula) {
      setCurricular(instProps?.institute?.curricula);
    }
  }, [instProps?.institute?.curricula]);

  const updateCurricularList = (itemObj: any) => {
    setCurricular({
      ...curricular,
      items: curricular.items.filter(
        (curriculumObj: any) => curriculumObj.id !== itemObj.id
      ),
    });
  };

  // ##################################################################### //
  // ############################### OUTPUT ############################## //
  // ##################################################################### //

  return (
    <div>
      <div className="h-9/10 flex px-0 md:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col md:flex-row flex justify-center md:justify-start">
          <div
            hidden={pathname.includes('page-builder')}
            className="w-auto border-r-0 border-gray-200">
            <div className="w-auto p-4 mr-2 2xl:mr-4 flex flex-col text-center flex-shrink-0">
              {imageLoading ? (
                <div
                  className={`w-20 h-20 md:w-40 md:h-40 flex items-center rounded-full shadow-lg right-2 bottom-0 p-3`}>
                  <Loader />
                </div>
              ) : instProps?.institute?.image ? (
                imageUrl ? (
                  <div className="relative">
                    <DroppableMedia
                      mediaRef={mediaRef}
                      setImage={(img: any, file: any) => {
                        setUpImage(img);
                        setFileObj(file);
                      }}
                      toggleCropper={toggleCropper}>
                      <img
                        className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light`}
                        src={imageUrl}
                      />
                    </DroppableMedia>
                    <div
                      className={`absolute w-12 h-12 rounded-full shadow-lg ${theme.backGroundLight[themeColor]} right-2 bottom-0 p-3 cursor-pointer`}
                      onClick={handleImageClick}>
                      <AiOutlineCamera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full border-0 flex flex-shrink-0 border-gray-400 bg-gray-400 shadow-elem-light`}
                  />
                )
              ) : (
                <div className="relative">
                  <DroppableMedia
                    mediaRef={mediaRef}
                    setImage={(img: any, file: any) => {
                      setUpImage(img);
                      setFileObj(file);
                    }}
                    toggleCropper={toggleCropper}>
                    <div
                      className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex flex-shrink-0 justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light cursor-pointer`}>
                      <div
                        className="h-full w-full flex justify-center items-center text-5xl text-extrabold text-white rounded-full"
                        style={{
                          /*  stylelint-disable */
                          background: `${
                            instProps?.institute?.name
                              ? stringToHslColor(
                                  getInitialsFromString(instProps?.institute?.name)[0] +
                                    ' ' +
                                    getInitialsFromString(instProps?.institute?.name)[1]
                                )
                              : null
                          }`,
                          textShadow: '0.2rem 0.2rem 3px #423939b3',
                        }}>
                        {instProps?.institute?.name &&
                          initials(
                            getInitialsFromString(instProps?.institute?.name)[0],
                            getInitialsFromString(instProps?.institute?.name)[1]
                          )}
                      </div>
                    </div>
                  </DroppableMedia>
                  <div
                    className={`absolute w-12 h-12 rounded-full shadow-lg ${theme.backGroundLight[themeColor]} right-2 bottom-0 p-3 cursor-pointer`}
                    onClick={handleImageClick}>
                    <AiOutlineCamera className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}

              <div className="text-xl font-bold flex items-center text-gray-900 mt-4 w-48">
                <p>{instProps?.institute?.name ? instProps?.institute?.name : ''}</p>
                {/* <Tooltip key={'id'} text={'Edit Institution Details'} placement="top">
                  <span
                    className={`w-auto cursor-pointer hover:${theme.textColor[themeColor]}`}>
                    <HiPencil
                      className="w-6 h-6 pl-2"
                      onClick={() => history.push(`${match.url}/edit?id=${id}`)}
                    />
                  </span>
                </Tooltip> */}
              </div>
            </div>
            {institute?.id && (
              <div className="my-5 px-4 mr-2 2xl:mr-4">
                <div className="flex mt-2">
                  <span className="w-auto mr-2 mt-0.5">
                    <BsEnvelope className="w-4 h-4 text-gray-600" />
                  </span>
                  <span className="w-auto text-gray-600">
                    {address && (
                      <Fragment>
                        {address + ', '} <br />
                      </Fragment>
                    )}
                    {addressLine2 && (
                      <Fragment>
                        {addressLine2 + ', '} <br />
                      </Fragment>
                    )}
                    {[city, state].filter(Boolean).join(', ')}
                    {city && state && <br />}
                    {zip && zip}
                    {!(address || addressLine2 || city || state || zip) ? '-' : ''}
                  </span>
                </div>
                <div className="flex mt-2 items-center">
                  <span className="w-auto mr-2">
                    <FiPhone className="w-4 h-4 text-gray-600" />
                  </span>
                  <span className="w-auto text-gray-600">
                    {phone ? formatPhoneNumber(phone) : '-'}
                  </span>
                </div>
                <div className="flex mt-2 items-center">
                  <span className="w-auto mr-2">
                    {isServiceProvider ? (
                      <BiCheckboxChecked className="w-4 h-4 text-gray-600" />
                    ) : (
                      <BiCheckbox className="w-4 h-4 text-gray-600" />
                    )}
                  </span>
                  <span className="w-auto text-gray-600">
                    {Institute_info[userLanguage]['SERVICE_PROVIDER']}
                  </span>
                </div>
                <div className="flex mt-2 items-center">
                  <span className="w-auto mr-2">
                    <IoIosGlobe className="w-4 h-4 text-gray-600" />
                  </span>
                  <span className="w-auto text-gray-600">
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        className={`hover:${theme.textColor[themeColor]}`}>
                        {Institute_info[userLanguage]['WEBSITE']}
                      </a>
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex">
            <div className="bg-white border-l-0 border-gray-200 mb-4 flex-1">
              <div className="overflow-hidden h-full">
                {/* {renderElementBySelectedMenu()} */}
                <Switch>
                  <Route
                    path={`${match.url}/class`}
                    exact
                    render={() => (
                      <ClassList
                        classes={institute?.classes}
                        instId={institute?.id}
                        instName={institute?.name}
                      />
                    )}
                  />
                  {/* <Route
                    path={`${match.url}/class-creation`}
                    exact
                    render={() => (
                      <ClassBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Create new class
                  /> */}
                  {/* <Route
                    path={`${match.url}/class-edit/:classId`}
                    exact
                    render={() => (
                      <EditClass
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Edit current class
                  /> */}
                  <Route
                    path={`${match.url}/class-rooms`}
                    exact
                    render={() => (
                      <RoomsList instId={institute?.id} instName={institute?.name} />
                    )}
                  />
                  <Route
                    path={`${match.url}/room-creation`}
                    exact
                    render={() => <ClassRoomBuilder instId={institute?.id} />} // Create new room
                  />
                  <Route
                    path={`${match.url}/room-edit/:roomId`}
                    render={() => <ClassRoomBuilder instId={institute?.id} />} // Edit current room.
                  />
                  <Route
                    path={`${match.url}/register-user`}
                    render={() => <Registration isInInstitute instId={institute?.id} />} // Register new user to roo,
                  />
                  <Route
                    path={`${match.url}/students`}
                    exact
                    render={() => <Students instId={institute?.id} />}
                  />
                  <Route
                    path={`${match.url}/courses`}
                    exact
                    render={() => (
                      <CurriculumList
                        updateCurricularList={updateCurricularList}
                        curricular={curricular && curricular}
                        instId={institute?.id}
                        instName={institute?.name}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/units`}
                    exact
                    render={() => (
                      <UnitList instId={institute?.id} instName={institute?.name} />
                    )}
                  />
                  <Route
                    exact
                    path={`${match.url}/units/add`}
                    render={() => <UnitBuilder instId={institute?.id} />}
                  />
                  <Route
                    exact
                    path={`${match.url}/units/:unitId/edit`}
                    render={() => <UnitBuilder instId={institute?.id} />}
                  />
                  <Route
                    path={`${match.url}/research-and-analytics`}
                    exact
                    render={() => <Csv institutionId={institute?.id} />}
                  />
                  <Route
                    path={`${match.url}/staff`}
                    exact
                    render={() => (
                      <StaffBuilder
                        serviceProviders={institute.serviceProviders}
                        instituteId={instProps?.institute?.id}
                        instName={institute?.name}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/edit`}
                    exact
                    render={() => (
                      <InstitutionBuilder
                        institutionId={institute?.id}
                        institute={instProps.institute}
                        loading={instProps.loading}
                        postInfoUpdate={instProps.postInfoUpdate}
                        updateServiceProviders={instProps.updateServiceProviders}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/manage-users`}
                    exact
                    render={() => (
                      <UserLookup instituteId={instProps?.institute?.id} isInInstitute />
                    )}
                  />
                  <Route
                    path={`${match.url}/manage-users/:userId`}
                    render={() => <User instituteId={instProps?.institute?.id} />}
                  />
                  <Route
                    path={`${match.url}/course-builder`}
                    exact
                    render={() => <CourseBuilder instId={institute?.id} />} // Create new course
                  />
                  <Route
                    path={`${match.url}/course-builder/:courseId`}
                    render={() => <CourseBuilder instId={institute?.id} />} // Edit course
                  />
                  <UniversalLessonBuilderProvider>
                    <Route
                      path={`${match.url}/lessons`}
                      render={() => <LessonsBuilderHome instId={institute?.id} />}
                    />
                  </UniversalLessonBuilderProvider>
                </Switch>
              </div>
            </div>
          </div>
        </div>
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => saveCroppedImage(img)}
            closeAction={toggleCropper}
          />
        )}
        {/* {instProps?.institute?.id && (
          <div className="overflow-hidden sm:rounded-lg">
            <div className="">
              <UnderlinedTabs
                tabs={tabs}
                activeTab={tabProps.tabsData.inst}
                updateTab={updateTab}
              />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default InstitutionInfo;
