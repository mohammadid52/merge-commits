import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import React, {useContext, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {getImageFromS3} from 'utilities/services';
import {statesList} from 'utilities/staticData';
import Buttons from 'atoms/Buttons';
import CheckBox from 'atoms/Form/CheckBox';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import DroppableMedia from 'molecules/DroppableMedia';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import InstitutionPopUp from './InstitutionPopUp';
import ServiceProviders from './Listing/ServiceProviders';
import {logError} from '@graphql/functions';
import useAuth from '@customHooks/useAuth';

interface InstitutionEditProps {
  institute: InstInfo;
  toggleUpdateState: () => void;
  updateServiceProviders: Function;
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
  isServiceProvider: boolean;
  serviceProviders: {
    items: {id: string; providerID: string; status: string; providerInstitution?: any}[];
  };
}

const InstitutionEdit = (instEditProps: InstitutionEditProps) => {
  const [editFormValues, setEditFormValues] = useState<InstInfo>(instEditProps.institute);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {InstitutionEditDict, BUTTONS: ButtonDict} = useDictionary(clientKey);
  const [showModal, setShowModal] = useState({
    warnModal: false,
    infoModal: false,
    modalMessage: ''
  });
  const [error, setError] = useState({
    show: true,
    errorMsg: ''
  });
  const [serverMessage, setServerMessage] = useState({
    message: '',
    isError: false
  });
  const history = useHistory();

  const institutionTypeList = [
    {
      id: 1,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['SCHOOL'],
      value: 'School'
    },
    {
      id: 2,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['AFTERSCHOOL'],
      value: 'After School'
    },
    {
      id: 3,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['DAYCAMP'],
      value: 'Day Camp'
    },
    {
      id: 4,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['SUMMERCAMP'],
      value: 'Summer Camp'
    },
    {
      id: 5,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['C3'],
      value: '501C3'
    }
  ];

  const handleEditFormChange = (e: React.FormEvent /* <HTMLFormElement> */) => {
    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;
    removeErrorMSg();
    setEditFormValues({...editFormValues, [name]: value});
  };

  const removeErrorMSg = () => {
    if (error.show) {
      setError({
        show: false,
        errorMsg: ''
      });
    }
  };

  const onTypeSelect = (str: string, name: string) => {
    removeErrorMSg();
    setEditFormValues({
      ...editFormValues,
      type: str
    });
  };

  const onStateSelect = (str: string, name: string) => {
    removeErrorMSg();
    setEditFormValues({
      ...editFormValues,
      state: str
    });
  };

  const [fileObj, setFileObj] = useState({});

  const handleEditFormSubmit = async () => {
    if (!editFormValues.name) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['namerequired']
      });
    } else if (!editFormValues.type) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['typerequired']
      });
    } else {
      removeErrorMSg();
      try {
        setSaving(true);
        const input = {
          id: editFormValues.id,
          name: editFormValues.name,
          type: editFormValues.type,
          website: editFormValues.website,
          address: editFormValues.address,
          addressLine2: editFormValues.addressLine2,
          city: editFormValues.city,
          state: editFormValues.state,
          zip: editFormValues.zip,
          image: editFormValues.image,
          phone: editFormValues.phone,
          isServiceProvider: editFormValues.isServiceProvider
        };

        await API.graphql(
          graphqlOperation(customMutations.updateInstitution, {input: input})
        );
        setSaving(false);
        instEditProps.toggleUpdateState();
        setServerMessage({
          isError: false,
          message: InstitutionEditDict[userLanguage]['messages']['saveMsg']
        });
        setTimeout(() => {
          setServerMessage({
            isError: false,
            message: ''
          });
        }, 2000);
        // history.goBack();
      } catch {
        setError({
          show: true,
          errorMsg: InstitutionEditDict[userLanguage]['messages']['unabletoupdate']
        });
      }
    }
  };

  const saveAsServicePro = () => {
    setEditFormValues({
      ...editFormValues,
      isServiceProvider: !editFormValues.isServiceProvider
    });
    togglePopUpModal();
  };
  const onServiceProviderChange = () => {
    if (!isServiceProvider) {
      setShowModal({
        warnModal: true,
        infoModal: false,
        modalMessage: `The service provider status allows other institutions 
                        access to the curricula and/or teachers of this institution.
                        Do you want to continue ?`
      });
    } else {
      setShowModal({
        warnModal: false,
        infoModal: true,
        modalMessage: `You can not remove institute from service providers role. 
                       Please contact ZOIQ for further help.`
      });
    }
  };

  const togglePopUpModal = () => {
    setShowModal({
      warnModal: false,
      infoModal: false,
      modalMessage: ''
    });
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const {authId, email} = useAuth();

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`instituteImages/institute_image_${id}`, file, {
        contentType: type,
        acl: 'public-read',
        ContentEncoding: 'base64'
      })
        .then((result) => {
          console.log('File successfully uploaded to s3', result);
          resolve(true);
        })
        .catch((err) => {
          setError({
            show: true,
            errorMsg: InstitutionEditDict[userLanguage]['messages']['uploderr']
          });
          logError(err, {authId: authId, email: email}, 'InstitutionEdit');
          console.error('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image ? image : fileObj, editFormValues.id, 'image/jpeg');
    const imageUrl: any = await getImageFromS3(
      `instituteImages/institute_image_${editFormValues.id}`
    );
    setImageUrl(imageUrl);
    setEditFormValues({
      ...editFormValues,
      image: `instituteImages/institute_image_${editFormValues.id}`
    });
    toggleCropper();
    setImageLoading(false);
  };

  const updateImagUrlToDb = async () => {
    try {
      const input = {
        id: editFormValues.id,
        image: editFormValues.image
      };
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updateInstitution, {input: input})
      );
      instEditProps.toggleUpdateState();
    } catch (error) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['imgeerr']
      });
    }
  };

  useEffect(() => {
    setEditFormValues(instEditProps.institute);
  }, [instEditProps.institute]);

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(instEditProps.institute.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [instEditProps.institute.image]);

  useEffect(() => {
    if (instEditProps.institute.image !== editFormValues.image) {
      updateImagUrlToDb();
    }
  }, [editFormValues.image]);

  const {
    id,
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
    serviceProviders
  } = editFormValues;

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

  return (
    <div className="h-9/10 flex flex-col md:flex-row">
      {/* Profile section */}
      <div className="w-auto p-4 mr-6 flex flex-col text-center items-center">
        {image ? (
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
        <p className="text-gray-600 my-4">Click circle to manage your avatar.</p>
      </div>

      <div className={`h-full w-full pt-2`}>
        {/* FORM submit tag */}
        <form>
          <div className={`h-full shadow-5 bg-white sm:rounded-lg mb-4`}>
            {/* TITLE */}
            <div className="w-full px-4 py-5 border-b-0 border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {InstitutionEditDict[userLanguage]['FORM']['TITLE']}
              </h3>
            </div>
            {/* FORM */}
            <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 px-4 py-5">
              <div className="sm:col-span-6 px-3 py-4">
                <div className="w-3/10">
                  <Selector
                    isRequired
                    selectedItem={type}
                    label={InstitutionEditDict[userLanguage]['FORM']['INSTITUTION_TYPE']}
                    placeholder={
                      InstitutionEditDict[userLanguage]['FORM']['INSTITUTION_TYPE']
                    }
                    list={institutionTypeList}
                    onChange={onTypeSelect}
                  />
                </div>
              </div>
              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={name}
                  onChange={handleEditFormChange}
                  id="name"
                  name="name"
                  label={InstitutionEditDict[userLanguage]['FORM']['NAME_INPUT_LABEL']}
                  placeHolder={
                    InstitutionEditDict[userLanguage]['FORM']['NAME_INPUT_PLACEHOLDER']
                  }
                  isRequired
                />
              </div>
              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={website}
                  onChange={handleEditFormChange}
                  id="website"
                  name="website"
                  label={
                    InstitutionEditDict[userLanguage]['FORM']['WEBSITE_INPUT_PLACEHOLDER']
                  }
                  placeHolder={
                    InstitutionEditDict[userLanguage]['FORM']['WEBSITE_INPUT_PLACEHOLDER']
                  }
                />
              </div>
              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={address}
                  id="address"
                  onChange={handleEditFormChange}
                  name="address"
                  label={InstitutionEditDict[userLanguage]['FORM']['ADDRESS_INPUT_LABEL']}
                />
              </div>

              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={addressLine2}
                  id="addressLine2"
                  onChange={handleEditFormChange}
                  name="addressLine2"
                  label={
                    InstitutionEditDict[userLanguage]['FORM']['ADDRESS2_INPUT_LABEL']
                  }
                />
              </div>

              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={city}
                  id="city"
                  onChange={handleEditFormChange}
                  name="city"
                  label={InstitutionEditDict[userLanguage]['FORM']['CITY_LABEL']}
                />
              </div>

              <div className="sm:col-span-3 px-3 py-2">
                <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                  {InstitutionEditDict[userLanguage]['FORM']['STATE_LABEL']}
                </label>
                <Selector
                  selectedItem={state}
                  placeholder="State"
                  list={statesList}
                  onChange={onStateSelect}
                />
              </div>

              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={zip}
                  id="zip"
                  onChange={handleEditFormChange}
                  name="zip"
                  label={InstitutionEditDict[userLanguage]['FORM']['ZIP_LABEL']}
                />
              </div>

              <div className="sm:col-span-3 px-3 py-2">
                <FormInput
                  value={phone}
                  id="phone"
                  onChange={handleEditFormChange}
                  name="phone"
                  label={InstitutionEditDict[userLanguage]['FORM']['PHONE_LABEL']}
                />
              </div>
              <div className="sm:col-span-3 px-3 py-2 flex items-center">
                <CheckBox
                  value={isServiceProvider}
                  onChange={onServiceProviderChange}
                  name="isServiceProvider"
                  label={
                    name
                      ? `${name} ${InstitutionEditDict[userLanguage]['FORM']['SERVICEPROVIDER_LABEL_WITH_NAME']}`
                      : InstitutionEditDict[userLanguage]['FORM'][
                          'SERVICEPROVIDER_LABEL_WITHOUT_NAME'
                        ]
                  }
                />
              </div>
            </div>
            {serverMessage.message && (
              <span className="text-sm text-green-600 text-center my-6 mx-3 w-full">
                {serverMessage.message}
              </span>
            )}
            <div className="px-4 w-full flex justify-end">
              <div className="flex justify-end w-auto pb-4">
                {/* <Buttons
                  label={InstitutionEditDict[userLanguage]['BUTTON']['CANCEL']}
                  btnClass="w-full px-6 py-4 mr-2"
                  onClick={history.goBack}
                  transparent
                /> */}
                <Buttons
                  label={
                    saving
                      ? ButtonDict[userLanguage]['SAVING']
                      : InstitutionEditDict[userLanguage]['BUTTON']['SAVE']
                  }
                  btnClass="w-full px-6 py-4 ml-2"
                  onClick={handleEditFormSubmit}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <div className="pt-8">
            <ServiceProviders
              serviceProviders={serviceProviders}
              instId={id}
              updateServiceProviders={instEditProps.updateServiceProviders}
              instName={name}
            />
          </div>

          {error.show ? (
            <span className="text-sm text-red-600 my-6 mx-3">{error.errorMsg}</span>
          ) : null}

          {/* Cancel-save buttons */}
          {/* <div className="px-4 w-full flex justify-end">
            <div className="flex w-4/10">
              <Buttons
                label={InstitutionEditDict[userLanguage]['BUTTON']['CANCEL']}
                btnClass="w-full px-6 py-4 mr-2"
                onClick={history.goBack}
                transparent
              />
              <Buttons
                label={InstitutionEditDict[userLanguage]['BUTTON']['SAVE']}
                btnClass="w-full px-6 py-4 ml-2"
                onClick={handleEditFormSubmit}
              />
            </div>
          </div> */}
        </form>

        {/* Image cropper */}
        {showCropper && (
          <ProfileCropModal
            upImg={upImage}
            saveCroppedImage={(img: string) => saveCroppedImage(img)}
            closeAction={toggleCropper}
          />
        )}
        {showModal.warnModal && (
          <InstitutionPopUp
            saveLabel="Save"
            saveAction={saveAsServicePro}
            closeAction={togglePopUpModal}
            message={showModal.modalMessage}
          />
        )}
        {showModal.infoModal && (
          <InstitutionPopUp
            onlyInfo
            saveLabel="OK"
            closeAction={togglePopUpModal}
            saveAction={togglePopUpModal}
            message={showModal.modalMessage}
          />
        )}
      </div>
    </div>
  );
};

export default InstitutionEdit;
