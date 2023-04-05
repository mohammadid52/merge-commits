import Loader from '@components/Atoms/Loader';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import DroppableMedia from '@components/Molecules/DroppableMedia';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import useAuth from '@customHooks/useAuth';
import {getImageFromS3} from '@utilities/services';
import {formatPhoneNumber} from '@utilities/strings';
import {API, graphqlOperation} from 'aws-amplify';
import {updateInstitution} from 'customGraphql/customMutations';
import {uploadImageToS3} from 'graphql-functions/functions';
import {isEmpty} from 'lodash';
import {useEffect, useRef, useState} from 'react';
import {BiCheckbox, BiCheckboxChecked} from 'react-icons/bi';
import {BsEnvelope} from 'react-icons/bs';
import {FiPhone} from 'react-icons/fi';

const InstitutionProfile = ({institute}: {institute: any}) => {
  // Add image handler

  const [imageUrl, setImageUrl] = useState();
  const [upImage, setUpImage] = useState<any | null>(null);
  const [fileObj, setFileObj] = useState({});
  const [imageLoading, setImageLoading] = useState(false);

  const [showCropper, setShowCropper] = useState(false);
  const {userLanguage} = useGlobalContext();

  const {Institute_info} = useDictionary();
  const mediaRef = useRef<any>(null);

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
    await API.graphql(graphqlOperation(updateInstitution, {input: input}));
    await getUrl();
    toggleCropper();
    setImageLoading(false);
  };

  const handleImageClick = () => mediaRef?.current?.click();

  const imageClass =
    'profile w-10 h-10 hover:theme-border rounded-full border-0 flex flex-shrink-0 border-light  customShadow cursor-pointer';

  return (
    <>
      {showCropper && (
        <ProfileCropModal
          open={showCropper}
          upImg={upImage || ''}
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}

      <div
        className={`${
          isPageBuilder ? 'hidden' : 'hidden xl:flex justify-between w-auto '
        }`}
        onClick={() => {}}>
        {isEmpty(institute.name) && (
          <div className="w-full animate-pulse mt-2 flex justify-between">
            <div className="h-6 bg-light  rounded w-5/10 mb-2 mr-2"></div>
            <div className="h-6 bg-light  rounded w-5/10 mb-2 ml-2"></div>
          </div>
        )}

        {!isEmpty(institute.name) && (
          <>
            <div className=" text-medium  w-auto mr-2 flex lg:items-center items-start justify-center 2xl:mr-4">
              <div className="flex w-auto ">
                <span className="w-auto mr-2 mt-0.5">
                  <BsEnvelope className="w-4 h-4" />
                </span>
                <span className="w-auto">
                  {address && <>{address + ', '}</>}
                  {addressLine2 && <>{addressLine2 + ', '}</>}
                  {[city, state].filter(Boolean).join(', ')}
                  {zip && <>{', ' + zip}</>}
                  {!(address || addressLine2 || city || state || zip) ? '-' : ''}
                </span>
              </div>
              {phone && (
                <div className="flex  w-auto items-center">
                  <span className="w-auto mr-2">
                    <FiPhone className="w-4 h-4" />
                  </span>
                  <span className="w-auto">{phone ? formatPhoneNumber(phone) : '-'}</span>
                </div>
              )}
              <span className="mx-4 w-auto">|</span>
              <div className="flex w-auto  items-center">
                <span className="w-auto mr-2">
                  {isServiceProvider ? (
                    <BiCheckboxChecked className="w-4 h-4" />
                  ) : (
                    <BiCheckbox className="w-4 h-4" />
                  )}
                </span>
                <span className="w-auto">
                  {Institute_info[userLanguage]['SERVICE_PROVIDER']}
                </span>
              </div>
            </div>
            <div className="flex items-center w-auto">
              {imageLoading ? (
                <div
                  className={`w-10 h-10  flex items-center rounded-full shadow-lg right-2 bottom-0 p-3`}>
                  <Loader />
                </div>
              ) : institute?.image ? (
                imageUrl ? (
                  <div className="relative flex  justify-center w-auto mr-2">
                    <DroppableMedia
                      mediaRef={mediaRef}
                      className="w-10 h-10 "
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
                </div>
              )}

              <p className="w-auto text-medium">{institute?.name || '--'}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InstitutionProfile;
