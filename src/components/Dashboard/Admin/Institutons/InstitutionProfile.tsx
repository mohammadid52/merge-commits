import Loader from '@components/Atoms/Loader';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import DroppableMedia from '@components/Molecules/DroppableMedia';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {uploadImageToS3} from '@graphql/functions';
import {getImageFromS3} from '@utilities/services';
import * as customMutations from 'customGraphql/customMutations';
import {formatPhoneNumber} from '@utilities/strings';
import React, {useEffect, useRef, useState} from 'react';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';
import {HiPencil} from 'react-icons/hi';
import {IoIosGlobe} from 'react-icons/io';
import useAuth from '@customHooks/useAuth';

const InstitutionProfile = ({institute}: {institute: any}) => {
  // Add image handler

  const [imageUrl, setImageUrl] = useState();
  const [upImage, setUpImage] = useState(null);
  const [fileObj, setFileObj] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  const [showCropper, setShowCropper] = useState(false);
  const {userLanguage} = useGlobalContext();

  const {Institute_info} = useDictionary();
  const mediaRef = useRef(null);

  useEffect(() => {
    getUrl();
  }, [institute?.image]);

  async function getUrl() {
    const imageUrl: any = await getImageFromS3(institute?.image);
    setImageUrl(imageUrl);
  }

  const isPageBuilder = window.location.pathname.includes('page-builder');

  const {
    address = '',
    addressLine2 = '',
    city = '',
    state = '',
    zip = '',
    phone = '',
    website = '',
    isServiceProvider = false
  } = institute;

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const {authId, email} = useAuth();
  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();

    const key = `instituteImages/institute_image_${institute?.id}`;
    await uploadImageToS3(image ? image : fileObj, key, 'image/jpeg', {
      auth: {authId, email}
    });
    const input = {
      id: institute?.id,
      image: key
    };
    await API.graphql(
      graphqlOperation(customMutations.updateInstitution, {input: input})
    );
    await getUrl();
    toggleCropper();
    setImageLoading(false);
  };

  const handleImageClick = () => mediaRef?.current?.click();

  const imageClass =
    'profile w-10 h-10 md:w-16 md:h-16 2xl:w-20 2xl:h-20 rounded-full border-0 flex flex-shrink-0 border-gray-400 customShadow cursor-pointer';

  return (
    <>
      {showCropper && (
        <ProfileCropModal
          upImg={upImage}
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}
      <div
        className={`${
          isPageBuilder ? 'hidden' : 'flex'
        } w-auto  lg:w-2/12 2xl:w-auto border-r-none lg:border-r-0 border-gray-200  flex-row lg:flex-col`}
        onClick={() => {}}>
        <div className="w-auto p-4 mr-2 2xl:mr-4 flex flex-col flex-shrink-0">
          {imageLoading ? (
            <div
              className={`w-10 h-10 md:w-16 md:h-16 2xl:w-20 2xl:h-20 flex items-center rounded-full shadow-lg right-2 bottom-0 p-3`}>
              <Loader className="text-gray-400" />
            </div>
          ) : institute?.image ? (
            imageUrl ? (
              <div className="relative flex  justify-center">
                <DroppableMedia
                  mediaRef={mediaRef}
                  setImage={(img: any, file: any) => {
                    setUpImage(img);
                    setFileObj(file);
                  }}
                  toggleCropper={toggleCropper}>
                  <img
                    onClick={handleImageClick}
                    className={`${imageClass}`}
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
              <div className={`${imageClass}`} />
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
                <div onClick={handleImageClick} className={`${imageClass}`}></div>
              </DroppableMedia>
              {/* <div
            className={`absolute w-8 h-8 2xl:w-12 2xl:h-12 rounded-full shadow-lg ${theme.backGroundLight[themeColor]} right-2 bottom-0 p-3 cursor-pointer`}
            onClick={handleImageClick}>
            <AiOutlineCamera className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
          </div> */}
            </div>
          )}

          <div className="text-base mt-2 flex font-medium">
            <p className="">{institute?.name || ''}</p>
            {/* <Tooltip key={'id'} text={'Edit Institution Details'} placement="top"> */}
            <span className={`w-auto cursor-pointer`}>
              <HiPencil
                className="w-6 h-6 pl-2"
                // onClick={() => history.push(`${match.url}/edit?id=${id}`)}
              />
            </span>
            {/* </Tooltip> */}
          </div>
        </div>
        {institute?.id && (
          <div className="my-5 px-4 mr-2 flex lg:items-center items-start justify-center lg:block 2xl:mr-4">
            <div className="flex ">
              <span className="w-auto mr-2 mt-0.5">
                <BsEnvelope className="w-4 h-4 text-gray-600" />
              </span>
              <span className="w-auto text-gray-600">
                {address && (
                  <>
                    {address + ', '} <br />
                  </>
                )}
                {addressLine2 && (
                  <>
                    {addressLine2 + ', '} <br />
                  </>
                )}
                {[city, state].filter(Boolean).join(', ')}
                {city && state && <br />}
                {zip && zip}
                {!(address || addressLine2 || city || state || zip) ? '-' : ''}
              </span>
            </div>
            {phone && (
              <div className="flex items-center">
                <span className="w-auto mr-2">
                  <FiPhone className="w-4 h-4 text-gray-600" />
                </span>
                <span className="w-auto text-gray-600">
                  {phone ? formatPhoneNumber(phone) : '-'}
                </span>
              </div>
            )}
            <div className="flex items-center">
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

            <a
              href={website}
              target="_blank"
              className={`flex hover:underline  text-gray-600 items-center hover:iconoclast:text-500 hover:curate:text-500`}>
              <span className="w-auto mr-2">
                <IoIosGlobe className="w-4 h-4 " />
              </span>
              <span className="w-auto">
                {website ? Institute_info[userLanguage]['WEBSITE'] : '-'}
              </span>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default InstitutionProfile;
