import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import React, {useContext, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customMutations from '../../../../customGraphql/customMutations';
import useDictionary from '../../../../customHooks/dictionary';
import {statesList} from '../../../../utilities/staticData';
import BreadCrums from '../../../Atoms/BreadCrums';
import Buttons from '../../../Atoms/Buttons';
import CheckBox from '../../../Atoms/Form/CheckBox';
import FormInput from '../../../Atoms/Form/FormInput';
import Selector from '../../../Atoms/Form/Selector';
import Loader from '../../../Atoms/Loader';
import PageWrapper from '../../../Atoms/PageWrapper';
import SectionTitle from '../../../Atoms/SectionTitle';
import DroppableMedia from '../../../Molecules/DroppableMedia';
import ProfileCropModal from '../../Profile/ProfileCropModal';

const InstitutionAdd = () => {
  const history = useHistory();
  const initialState = {
    id: '',
    name: '',
    type: '',
    website: '',
    isServiceProvider: false,
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    image: '',
  };
  const [instituteData, setInstituteData] = useState(initialState);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState(null);
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {InstitutionAddDict, BreadcrumsTitles} = useDictionary(clientKey);
  const [error, setError] = useState({
    show: true,
    errorMsg: '',
  });

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['ADD_INSTITUTION'],
      url: `/dashboard/manage-institutions/add`,
      last: true,
    },
  ];
  const institutionTypeList = [
    {
      id: 1,
      name: InstitutionAddDict[userLanguage]['INSTITUTION_TYPE']['SCHOOL'],
      value: 'School',
    },
    {
      id: 2,
      name: InstitutionAddDict[userLanguage]['INSTITUTION_TYPE']['AFTERSCHOOL'],
      value: 'After School',
    },
    {
      id: 3,
      name: InstitutionAddDict[userLanguage]['INSTITUTION_TYPE']['DAYCAMP'],
      value: 'Day Camp',
    },
    {
      id: 4,
      name: InstitutionAddDict[userLanguage]['INSTITUTION_TYPE']['SUMMERCAMP'],
      value: 'Summer Camp',
    },
    {
      id: 5,
      name: InstitutionAddDict[userLanguage]['INSTITUTION_TYPE']['C3'],
      value: '501C3',
    },
  ];

  const removeErrorMSg = () => {
    if (error.show) {
      setError({
        show: false,
        errorMsg: '',
      });
    }
  };

  const formValidator = () => {
    if (!instituteData.name) {
      setError({
        show: true,
        errorMsg: InstitutionAddDict[userLanguage]['messages']['namerequired'],
      });
    }
  };

  const onInputChange = (e: any) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      [e.target.name]: e.target.value,
    });
  };

  const onTypeSelect = (str: string, name: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      type: str,
    });
  };
  const onStateSelect = (str: string, name: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      state: str,
    });
  };

  const handdleCheckBox = () => {
    setInstituteData({
      ...instituteData,
      isServiceProvider: !instituteData.isServiceProvider,
    });
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
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
          setError({
            show: true,
            errorMsg: InstitutionAddDict[userLanguage]['messages']['uploaderr'],
          });
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const deletUserProfile = async () => {
    setInstituteData({...instituteData, image: ''});
    setImageUrl(null);
  };

  const [fileObj, setFileObj] = useState({});

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    setS3Image(image ? image : fileObj);
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
    setImageUrl(imageUrl);
    setInstituteData({
      ...instituteData,
      image: `instituteImages/institute_image_${instituteData.id}`,
    });
    toggleCropper();
    setImageLoading(false);
  };

  const addNewInstitution = async () => {
    if (!instituteData.name) {
      setError({
        show: true,
        errorMsg: InstitutionAddDict[userLanguage]['messages']['namerequired'],
      });
    } else {
      removeErrorMSg();
      try {
        if (s3Image) {
          await uploadImageToS3(s3Image, instituteData.id, 'image/jpeg');
        }
        const newInstitute = await API.graphql(
          graphqlOperation(customMutations.createInstitution, {input: instituteData})
        );
        history.push(`institution?id=${instituteData.id}`);
      } catch {
        setError({
          show: true,
          errorMsg: InstitutionAddDict[userLanguage]['messages']['adderr'],
        });
      }
    }
  };
  useEffect(() => {
    setInstituteData({
      ...instituteData,
      id: uuidv4(),
    });
  }, []);

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

  const {
    name,
    type,
    website,
    image,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    isServiceProvider,
  } = instituteData;

  return (
    <div className="w-full h-full p-4">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={InstitutionAddDict[userLanguage]['TITLE']}
          subtitle={InstitutionAddDict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          {/* Profile section */}
          <div className="w-auto p-4 mr-6 flex flex-col text-center items-center">
            {imageUrl ? (
              <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mt-4">
                {!imageLoading ? (
                  <label className="cursor-pointer flex justify-center">
                    <DroppableMedia
                      mediaRef={mediaRef}
                      setImage={(img: any, file: any) => {
                        setUpImage(img);
                        setFileObj(file);
                      }}
                      toggleCropper={toggleCropper}>
                      <img
                        onClick={handleImage}
                        className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light`}
                        src={imageUrl}
                      />
                    </DroppableMedia>
                  </label>
                ) : (
                  <div className="w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-lightI">
                    <Loader />
                  </div>
                )}
              </button>
            ) : (
              <DroppableMedia
                mediaRef={mediaRef}
                setImage={(img: any, file: any) => {
                  setUpImage(img);
                  setFileObj(file);
                }}
                toggleCropper={toggleCropper}>
                <label
                  onClick={handleImage}
                  className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
                  {!imageLoading ? (
                    <IconContext.Provider value={{size: '3rem', color: '#4a5568'}}>
                      <FaPlus />
                    </IconContext.Provider>
                  ) : (
                    <Loader />
                  )}
                </label>
              </DroppableMedia>
            )}
            <p className="text-gray-600 my-4">
              {InstitutionAddDict[userLanguage]['INFOA']}
            </p>
          </div>

          <div className={`h-full w-full pt-2`}>
            {/* FORM submit tag */}
            <form>
              <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>
                {/* TITLE */}
                <div className="w-full px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {InstitutionAddDict[userLanguage]['FORM']['TITLE']}
                  </h3>
                </div>
                {/* FORM */}
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 px-4 py-5">
                  <div className="sm:col-span-6 px-3 py-4">
                    <div className="w-3/10">
                      <Selector
                        selectedItem={type}
                        label={
                          InstitutionAddDict[userLanguage]['FORM']['INSTITUTION_TYPE']
                        }
                        placeholder={
                          InstitutionAddDict[userLanguage]['FORM']['INSTITUTION_TYPE']
                        }
                        list={institutionTypeList}
                        onChange={onTypeSelect}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={name}
                      onChange={onInputChange}
                      id="name"
                      name="name"
                      label={InstitutionAddDict[userLanguage]['FORM']['NAME_INPUT_LABEL']}
                      placeHolder={
                        InstitutionAddDict[userLanguage]['FORM']['NAME_INPUT_PLACEHOLDER']
                      }
                      isRequired
                    />
                  </div>
                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={website}
                      onChange={onInputChange}
                      id="website"
                      name="website"
                      label={
                        InstitutionAddDict[userLanguage]['FORM']['WEBSITE_INPUT_LABEL']
                      }
                      placeHolder={
                        InstitutionAddDict[userLanguage]['FORM'][
                          'WEBSITE_INPUT_PLACEHOLDER'
                        ]
                      }
                    />
                  </div>
                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={address}
                      id="address"
                      onChange={onInputChange}
                      name="address"
                      label={
                        InstitutionAddDict[userLanguage]['FORM']['ADDRESS_INPUT_LABEL']
                      }
                    />
                  </div>

                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={addressLine2}
                      id="addressLine2"
                      onChange={onInputChange}
                      name="addressLine2"
                      label={
                        InstitutionAddDict[userLanguage]['FORM']['ADDRESS2_INPUT_LABEL']
                      }
                    />
                  </div>

                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={city}
                      id="city"
                      onChange={onInputChange}
                      name="city"
                      label={InstitutionAddDict[userLanguage]['FORM']['CITY_LABEL']}
                    />
                  </div>

                  <div className="sm:col-span-3 px-3 py-2">
                    <label className="block text-xs font-semibold mb-1  leading-5 text-gray-700">
                      {InstitutionAddDict[userLanguage]['FORM']['STATE_LABEL']}
                    </label>
                    <Selector
                      selectedItem={state}
                      placeholder={InstitutionAddDict[userLanguage]['FORM']['state']}
                      list={statesList}
                      onChange={onStateSelect}
                    />
                  </div>

                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={zip}
                      id="zip"
                      onChange={onInputChange}
                      name="zip"
                      label={InstitutionAddDict[userLanguage]['FORM']['ZIP_LABEL']}
                    />
                  </div>

                  <div className="sm:col-span-3 px-3 py-2">
                    <FormInput
                      value={phone}
                      id="phone"
                      onChange={onInputChange}
                      name="phone"
                      label={InstitutionAddDict[userLanguage]['FORM']['PHONE_LABEL']}
                    />
                  </div>
                  <div className="sm:col-span-3 px-3 py-2 flex items-center">
                    <CheckBox
                      value={isServiceProvider}
                      onChange={handdleCheckBox}
                      name="isServiceProvider"
                      label={
                        InstitutionAddDict[userLanguage]['FORM']['SERVICEPROVIDER_LABEL']
                      }
                    />
                  </div>
                </div>
              </div>

              {error.show ? (
                <span className="text-sm text-red-600 my-6 mx-3">{error.errorMsg}</span>
              ) : null}

              {/* Cancel-save buttons */}
              <div className="px-4 w-full flex justify-end">
                <div className="flex w-4/10">
                  <Buttons
                    label={InstitutionAddDict[userLanguage]['BUTTON']['CANCEL']}
                    btnClass="w-full px-6 py-4 mr-2"
                    onClick={history.goBack}
                    transparent
                  />
                  <Buttons
                    label={InstitutionAddDict[userLanguage]['BUTTON']['SAVE']}
                    btnClass="w-full px-6 py-4 ml-2"
                    onClick={addNewInstitution}
                  />
                </div>
              </div>
            </form>

            {/* Image cropper */}
            {showCropper && (
              <ProfileCropModal
                upImg={upImage}
                saveCroppedImage={(img: string) => saveCroppedImage(img)}
                closeAction={toggleCropper}
              />
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default InstitutionAdd;
