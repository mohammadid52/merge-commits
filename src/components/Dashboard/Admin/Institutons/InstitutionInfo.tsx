import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';
import {IoIosGlobe} from 'react-icons/io';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {AiOutlineCamera} from 'react-icons/ai';
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom';
import Storage from '@aws-amplify/storage';
import API, {graphqlOperation} from '@aws-amplify/api';

import {getAsset} from '../../../../assets';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import * as customMutations from '@customGraphql/customMutations';
import {getImageFromS3} from '../../../../utilities/services';
import {
  formatPhoneNumber,
  getHostNameFromUrl,
  getInitialsFromString,
  initials,
  stringToHslColor,
} from '../../../../utilities/strings';
import Tooltip from '../../../Atoms/Tooltip';
import Tabs, {ITabElements} from '@atoms/Tabs';
import DroppableMedia from '@molecules/DroppableMedia';
import ClassList from './Listing/ClassList';
import CurriculumList from './Listing/CurriculumList';
import RoomsList from './Listing/RoomsList';
import ServiceProviders from './Listing/ServiceProviders';
import StaffBuilder from './Listing/StaffBuilder';
import GeneralInformation from './GeneralInformation';
import LessonsList from '@components/Dashboard/Admin/LessonsBuilder/LessonsList';
import Csv from '@components/Dashboard/Csv/Csv';
import Registration from '@components/Dashboard/Admin/UserManagement/Registration';
import UserLookup from '../UserManagement/UserLookup';
import CourseBuilder from './EditBuilders/CurricularsView/TabsActions/CourseBuilder/CourseBuilder';
import InstitutionBuilder from './Builders/InstitutionBuilder/InstitutionBuilder';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import Loader from '@components/Atoms/Loader';
import ClassBuilder from './Builders/ClassBuilder';
import EditClass from './EditBuilders/EditClass';
import ClassRoomBuilder from './EditBuilders/ClassRoom/ClassRoomBuilder';

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

  const headerMenusForInstitution = [
    {
      title: 'Institution Manager',
      key: 'institution',
      type: 'dropdown',
      children: [
        {
          title: Institute_info[userLanguage]['TABS']['GENERAL_INFORMATION'],
          key: 'general_information',
          redirectionUrl: `${match.url}/edit`,
          active: location.pathname.indexOf('/edit') > -1,
        },
        {
          title: Institute_info[userLanguage]['TABS']['STAFF'],
          key: 'staff',
          redirectionUrl: `${match.url}/staff`,
          active: location.pathname.indexOf('staff') > -1,
        },
        user.role !== 'BLD'
          ? {
              title: 'User registry',
              key: 'user_registry',
              redirectionUrl: `/dashboard/register`,
              active: location.pathname.indexOf('register') > -1,
            }
          : null,
        user.role !== 'BLD'
          ? {
              title: 'Register New User',
              key: 'register',
              redirectionUrl: `/dashboard/manage-users`,
              active: location.pathname.indexOf('manage-users') > -1,
            }
          : null,
      ].filter(Boolean),
    },
    {
      title: 'Course Manager',
      key: 'course',
      type: 'dropdown',
      children: [
        {
          title: 'Courses',
          key: 'course',
          redirectionUrl: `${match.url}/courses`,
          active: location.pathname.indexOf('course') > -1,
        },
        {
          title: 'Units',
          key: 'unit',
        },
        {
          title: Institute_info[userLanguage]['TABS']['LESSONS'],
          key: 'lessons',
        },
        {
          title: 'Game Changers ',
        },
      ],
    },
    {
      title: 'Class Manager',
      key: 'class',
      type: 'dropdown',
      children: [
        {
          title: Institute_info[userLanguage]['TABS']['CLASSES'],
          key: 'class',
          redirectionUrl: `${match.url}/class`,
          active: location.pathname.indexOf('class') > -1,
        },
        {
          title: Institute_info[userLanguage]['TABS']['CLASSROOMS'],
          key: 'class_room',
          redirectionUrl: `${match.url}/class-rooms`,
          active: location.pathname.indexOf('room') > -1,
        },
      ],
    },
    {
      title: 'Community Manager',
      key: 'community',
      type: 'dropdown',
      children: [
        {
          title: 'New Person Spotlight',
        },
        {
          title: 'Announcements & Events',
        },
        {
          title: 'Front Page',
        },
      ],
    },
    {
      title: Institute_info[userLanguage]['TABS']['RESEARCH_AND_ANALYTICS'],
      key: 'research_and_analytics',
      redirectionUrl: `${match.url}/research-and-analytics`,
    },
  ];

  const updateTab = ({key, redirectionUrl}: any) => {
    tabProps.setTabsData({...tabProps.tabsData, inst: key});
    if (redirectionUrl) {
      history.push(redirectionUrl);
    }

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
  }, [instProps?.institute.image]);

  async function getUrl() {
    const imageUrl: any = await getImageFromS3(instProps?.institute.image);
    setImageUrl(imageUrl);
  }

  const renderElementBySelectedMenu = () => {
    switch (tabProps.tabsData.inst) {
      case 'service_provider':
        return (
          <ServiceProviders
            serviceProviders={institute.serviceProviders}
            instId={institute?.id}
            updateServiceProviders={instProps.updateServiceProviders}
            instName={institute?.name}
          />
        );
      case 'staff':
        return (
          <StaffBuilder
            serviceProviders={institute.serviceProviders}
            instituteId={instProps?.institute?.id}
            instName={institute?.name}
          />
        );
      case 'user_registry':
        return <UserLookup isInInstitute />;
      case 'register':
        return <Registration isInInstitute />;
      case 'course':
        return (
          <CurriculumList
            curricular={instProps?.institute?.curricula}
            instId={institute?.id}
            instName={institute?.name}
          />
        );
      case 'lessons':
        return (
          <div className="p-8">
            <LessonsList
              isInInstitution
              title={`${institute?.name} lessons`}
              instId={institute?.id}
            />
          </div>
        );
      case 'class':
        return (
          <ClassList
            classes={institute?.classes}
            instId={institute?.id}
            instName={institute?.name}
          />
        );
      case 'class_room':
        return <RoomsList instId={institute?.id} instName={institute?.name} />;
      case 'research_and_analytics':
        return (
          <div className="p-8">
            <Csv institutionId={institute?.id} />
          </div>
        );
      default:
        break;
    }
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image ? image : fileObj, institute.id, 'image/jpeg');
    const input = {
      id: institute.id,
      image: `instituteImages/institute_image_${institute.id}`,
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
    id,
    name,
    image,
    type,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    website,
    isServiceProvider,
  } = instProps?.institute;

  return (
    <div>
      <div className="h-9/10 flex px-0 md:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col md:flex-row border-gray-200 border-b-0 flex justify-center md:justify-start">
          <div className="w-auto">
            <div className="w-auto p-4 mr-2 2xl:mr-4 flex flex-col text-center flex-shrink-0">
              {imageLoading ? (
                <div
                  className={`w-20 h-20 md:w-40 md:h-40 flex items-center rounded-full shadow-lg right-2 bottom-0 p-3`}>
                  <Loader />
                </div>
              ) : image ? (
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
                            name
                              ? stringToHslColor(
                                  getInitialsFromString(name)[0] +
                                    ' ' +
                                    getInitialsFromString(name)[1]
                                )
                              : null
                          }`,
                          textShadow: '0.2rem 0.2rem 3px #423939b3',
                        }}>
                        {name &&
                          initials(
                            getInitialsFromString(name)[0],
                            getInitialsFromString(name)[1]
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
                <p>{name ? name : ''}</p>
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
            {institute.id && (
              <div className="mt-5 px-4 mr-2 2xl:mr-4">
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

          <div className="">
            <div className="bg-white border-l-0 border-gray-200 mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 2xl:px-6">
                <Tabs
                  tabsData={headerMenusForInstitution}
                  activeTab={tabProps.tabsData.inst}
                  updateTab={updateTab}
                  tabWithNumbers
                />
                {/* <h3 className="text-lg flex items-center leading-6 font-medium text-gray-900">
                  {Institute_info[userLanguage]['TITLE']}
                  </h3> */}
              </div>
              <div className="overflow-hidden min-h-80">
                {/* {renderElementBySelectedMenu()} */}
                <Switch>
                  <Route
                    path={`${match.url}/edit`}
                    exact
                    render={() => (
                      <InstitutionBuilder
                        institute={instProps.institute}
                        loading={instProps.loading}
                        postInfoUpdate={instProps.postInfoUpdate}
                        updateServiceProviders={instProps.updateServiceProviders}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )}
                  />
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
                  <Route
                    path={`${match.url}/class-creation`}
                    exact
                    render={() => (
                      <ClassBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Create new class
                  />
                  <Route
                    path={`${match.url}/class-edit/:classId`}
                    exact
                    render={() => (
                      <EditClass
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Edit current class
                  />
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
                    render={() => (
                      <ClassRoomBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Create new room
                  />
                  <Route
                    path={`${match.url}/room-edit/:roomId`}
                    render={() => (
                      <ClassRoomBuilder
                        instId={institute?.id}
                        toggleUpdateState={instProps.toggleUpdateState}
                      />
                    )} // Edit current room.
                  />
                  <Route
                    path={`${match.url}/courses`}
                    exact
                    render={() => (
                      <CurriculumList
                        curricular={instProps?.institute?.curricula}
                        instId={institute?.id}
                        instName={institute?.name}
                      />
                    )}
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
                    path={`${match.url}/course-builder`}
                    exact
                    render={() => <CourseBuilder instId={institute?.id} />} // Create new course
                  />
                  <Route
                    path={`${match.url}/course-builder/:courseId`}
                    render={() => <CourseBuilder instId={institute?.id} />} // Create new course
                  />
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
