import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import React, {useContext, useEffect, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory} from 'react-router-dom';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import * as customMutations from '../../../../customGraphql/customMutations';
import useDictionary from '../../../../customHooks/dictionary';
import {getImageFromS3} from '../../../../utilities/services';
import {statesList} from '../../../../utilities/staticData';
import Buttons from '../../../Atoms/Buttons';
import CheckBox from '../../../Atoms/Form/CheckBox';
import FormInput from '../../../Atoms/Form/FormInput';
import Selector from '../../../Atoms/Form/Selector';
import Loader from '../../../Atoms/Loader';
import ProfileCropModal from '../../Profile/ProfileCropModal';
import InstitutionPopUp from './InstitutionPopUp';

interface InstitutionEditProps {
  institute: InstInfo;
  toggleUpdateState: () => void;
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
}

const InstitutionEdit = (instEditPrps: InstitutionEditProps) => {
  const [editFormValues, setEditFormValues] = useState<InstInfo>(instEditPrps.institute);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {InstitutionEditDict} = useDictionary(clientKey);
  const [showModal, setShowModal] = useState({
    warnModal: false,
    infoModal: false,
    modalMessage: '',
  });
  const [error, setError] = useState({
    show: true,
    errorMsg: '',
  });
  const history = useHistory();

  const institutionTypeList = [
    {
      id: 1,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['SCHOOL'],
      value: 'School',
    },
    {
      id: 2,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['AFTERSCHOOL'],
      value: 'After School',
    },
    {
      id: 3,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['DAYCAMP'],
      value: 'Day Camp',
    },
    {
      id: 4,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['SUMMERCAMP'],
      value: 'Summer Camp',
    },
    {
      id: 5,
      name: InstitutionEditDict[userLanguage]['INSTITUTION_TYPE']['C3'],
      value: '501C3',
    },
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
        errorMsg: '',
      });
    }
  };

  const onTypeSelect = (str: string, name: string) => {
    removeErrorMSg();
    setEditFormValues({
      ...editFormValues,
      type: str,
    });
  };

  const onStateSelect = (str: string, name: string) => {
    removeErrorMSg();
    setEditFormValues({
      ...editFormValues,
      state: str,
    });
  };

  const handleEditFormSubmit = async () => {
    if (!editFormValues.name) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['namerequired'],
      });
    } else if (!editFormValues.type) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['typerequired'],
      });
    } else {
      removeErrorMSg();
      try {
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
          isServiceProvider: editFormValues.isServiceProvider,
        };

        await API.graphql(
          graphqlOperation(customMutations.updateInstitution, {input: input})
        );
        instEditPrps.toggleUpdateState();
        history.goBack();
      } catch {
        setError({
          show: true,
          errorMsg: InstitutionEditDict[userLanguage]['messages']['unabletoupdate'],
        });
      }
    }
  };

  const saveAsServicePro = () => {
    setEditFormValues({
      ...editFormValues,
      isServiceProvider: !editFormValues.isServiceProvider,
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
                        Do you want to continue ?`,
      });
    } else {
      setShowModal({
        warnModal: false,
        infoModal: true,
        modalMessage: `You can not remove institute from service providers role. 
                       Please contact ZOIQ for further help.`,
      });
    }
  };

  const togglePopUpModal = () => {
    setShowModal({
      warnModal: false,
      infoModal: false,
      modalMessage: '',
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
            errorMsg: InstitutionEditDict[userLanguage]['messages']['uploderr'],
          });
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    await uploadImageToS3(image, editFormValues.id, 'image/jpeg');
    const imageUrl: any = await getImageFromS3(
      `instituteImages/institute_image_${editFormValues.id}`
    );
    setImageUrl(imageUrl);
    setEditFormValues({
      ...editFormValues,
      image: `instituteImages/institute_image_${editFormValues.id}`,
    });
    toggleCropper();
    setImageLoading(false);
  };

  const updateImagUrlToDb = async () => {
    try {
      const input = {
        id: editFormValues.id,
        image: editFormValues.image,
      };
      const update: any = await API.graphql(
        graphqlOperation(customMutations.updateInstitution, {input: input})
      );
      instEditPrps.toggleUpdateState();
    } catch (error) {
      setError({
        show: true,
        errorMsg: InstitutionEditDict[userLanguage]['messages']['imgeerr'],
      });
    }
  };

  useEffect(() => {
    setEditFormValues(instEditPrps.institute);
  }, [instEditPrps.institute]);

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(instEditPrps.institute.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [instEditPrps.institute.image]);

  useEffect(() => {
    if (instEditPrps.institute.image !== editFormValues.image) {
      updateImagUrlToDb();
    }
  }, [editFormValues.image]);

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
  } = editFormValues;

  return (
    <div className="h-9/10 flex flex-col md:flex-row">
      {/* Profile section */}
      <div className="w-auto p-4 mr-6 flex flex-col text-center items-center">
        {image ? (
          <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mt-4">
            {!imageLoading ? (
              <label className="cursor-pointer flex justify-center">
                <img
                  className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full  border-0 flex flex-shrink-0 border-gray-400 shadow-elem-light`}
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
            className={`w-20 h-20 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full  border-0 border-gray-400 shadow-elem-light`}>
            {!imageLoading ? (
              <IconContext.Provider value={{size: '3rem', color: '#4a5568'}}>
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
                    InstitutionEditDict[userLanguage]['FORM']['SERVICEPROVIDER_LABEL']
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
