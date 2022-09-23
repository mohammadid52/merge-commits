import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import Loader from '@components/Atoms/Loader';
import Tooltip from '@components/Atoms/Tooltip';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import {GlobalContext} from '@contexts/GlobalContext';
import * as customMutations from '@customGraphql/customMutations';
import useDictionary from '@customHooks/dictionary';
import DroppableMedia from '@molecules/DroppableMedia';
import {getImageFromS3} from '@utilities/services';
import {
  formatPhoneNumber,
  getInitialsFromString,
  initials,
  stringToHslColor,
} from '@utilities/strings';
import {getAsset} from 'assets';
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';
import {HiPencil} from 'react-icons/hi';
import {IoIosGlobe} from 'react-icons/io';
import NavBarRouter from '../NavBarRouter';

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
  const {institute} = instProps;

  const pathname = window.location.pathname;

  const [imageUrl, setImageUrl] = useState();
  const [upImage, setUpImage] = useState(null);
  const [fileObj, setFileObj] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  const [showCropper, setShowCropper] = useState(false);
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {Institute_info} = useDictionary(clientKey);
  const mediaRef = useRef(null);

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
        acl: 'public-read',
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
      <div className="h-9/10 flex px-0 2xl:px-4 flex-col">
        {/* Profile section */}
        <div className="flex-col lg:flex-row flex justify-center lg:justify-start w-full">
          <div
            className={`${
              pathname.includes('page-builder') ? 'hidden' : 'flex'
            } w-auto cursor-pointer lg:w-2/12 2xl:w-auto border-r-none lg:border-r-0 border-gray-200  flex-row lg:flex-col`}
            onClick={handleImageClick}>
            <div className="w-auto p-4 mr-2 2xl:mr-4 flex flex-col flex-shrink-0">
              {imageLoading ? (
                <div
                  className={`w-20 h-20 md:w-30 md:h-30 2xl:w-40 2xl:h-40 flex items-center rounded-full shadow-lg right-2 bottom-0 p-3`}>
                  <Loader />
                </div>
              ) : instProps?.institute?.image ? (
                imageUrl ? (
                  <div className="relative flex justify-center">
                    <DroppableMedia
                      mediaRef={mediaRef}
                      setImage={(img: any, file: any) => {
                        setUpImage(img);
                        setFileObj(file);
                      }}
                      toggleCropper={toggleCropper}>
                      <img
                        className={`profile w-20 h-20 md:w-30 md:h-30 2xl:w-40 2xl:h-40 rounded-full border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light`}
                        src={imageUrl}
                      />
                    </DroppableMedia>
                    {/* <div
                      className={`absolute w-8 h-8 2xl:w-12 2xl:h-12 rounded-full shadow-lg ${theme.backGroundLight[themeColor]} 2xl:right-2 right-2.5 bottom-0 p-1.5 2xl:p-3 cursor-pointer`}
                      onClick={handleImageClick}>
                      <AiOutlineCamera className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                    </div> */}
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
                  {/* <div
                    className={`absolute w-8 h-8 2xl:w-12 2xl:h-12 rounded-full shadow-lg ${theme.backGroundLight[themeColor]} right-2 bottom-0 p-3 cursor-pointer`}
                    onClick={handleImageClick}>
                    <AiOutlineCamera className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                  </div> */}
                </div>
              )}

              <div className="text-xl font-bold flex items-center justify-center text-gray-900 mt-4 w-auto 2xl:w-48">
                <p className="w-min">
                  {instProps?.institute?.name ? instProps?.institute?.name : ''}
                </p>
                <Tooltip key={'id'} text={'Edit Institution Details'} placement="top">
                  <span
                    className={`w-auto cursor-pointer hover:${theme.textColor[themeColor]}`}>
                    <HiPencil
                      className="w-6 h-6 pl-2"
                      // onClick={() => history.push(`${match.url}/edit?id=${id}`)}
                    />
                  </span>
                </Tooltip>
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
                {phone && (
                  <div className="flex mt-2 items-center">
                    <span className="w-auto mr-2">
                      <FiPhone className="w-4 h-4 text-gray-600" />
                    </span>
                    <span className="w-auto text-gray-600">
                      {phone ? formatPhoneNumber(phone) : '-'}
                    </span>
                  </div>
                )}
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

          <div className="flex flex-1 overflow-auto">
            <div className="bg-white border-l-0 border-gray-200 mb-4 flex-1">
              <div className="overflow-hidden h-full">
                {/* {renderElementBySelectedMenu()} */}
                <NavBarRouter
                  {...instProps}
                  updateCurricularList={updateCurricularList}
                  curricular={curricular}
                />
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
