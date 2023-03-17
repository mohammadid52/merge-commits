import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import * as customMutations from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {statesList} from 'utilities/staticData';

import UploadImageBtn from '@components/Atoms/Buttons/UploadImageBtn';
import {uploadImageToS3} from '@graphql/functions';
import Buttons from 'atoms/Buttons';
import CheckBox from 'atoms/Form/CheckBox';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import ProfileCropModal from 'components/Dashboard/Profile/ProfileCropModal';
import {getImageFromS3} from 'utilities/services';
import {useGlobalContext} from '@contexts/GlobalContext';

const InstitutionFormComponent = ({institutionInfo, postMutation}: any) => {
  const history = useHistory();
  const initialState: any = {
    id: null,
    label: '',
    type: '',
    website: '',
    isServiceProvider: false,
    isZoiq: false,
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    image: '',
    serviceProviders: {
      items: []
    }
  };
  const [instituteData, setInstituteData] = useState(initialState);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState<string | null>(null);
  const [_, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const {checkIfAdmin, userLanguage} = useGlobalContext();
  const {InstitutionBuilderDict, BUTTONS: ButtonDict} = useDictionary();
  const [error, setError] = useState({
    show: true,
    errorMsg: ''
  });
  const [serverMessage, setServerMessage] = useState({
    message: '',
    isError: false
  });

  const institutionTypeList = [
    {
      id: 1,
      label: InstitutionBuilderDict[userLanguage]['INSTITUTION_TYPE']['SCHOOL'],
      value: 'School'
    },
    {
      id: 2,
      label: InstitutionBuilderDict[userLanguage]['INSTITUTION_TYPE']['AFTERSCHOOL'],
      value: 'After School'
    },
    {
      id: 3,
      label: InstitutionBuilderDict[userLanguage]['INSTITUTION_TYPE']['DAYCAMP'],
      value: 'Day Camp'
    },
    {
      id: 4,
      label: InstitutionBuilderDict[userLanguage]['INSTITUTION_TYPE']['SUMMERCAMP'],
      value: 'Summer Camp'
    },
    {
      id: 5,
      label: InstitutionBuilderDict[userLanguage]['INSTITUTION_TYPE']['C3'],
      value: '501C3'
    }
  ];

  const removeErrorMSg = () => {
    if (error.show) {
      setError({
        show: false,
        errorMsg: ''
      });
    }
  };

  const onInputChange = (e: any) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      [e.target.name]: e.target.value
    });
  };

  const onTypeSelect = (str: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      type: str
    });
  };
  const onStateSelect = (str: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      state: str
    });
  };

  const handdleCheckBox = () => {
    setInstituteData({
      ...instituteData,
      isServiceProvider: !instituteData.isServiceProvider
    });
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const [fileObj, setFileObj] = useState({});

  const saveCroppedImage = async (image: string) => {
    toggleCropper();
    setS3Image(image ? image : fileObj);
    // @ts-ignore
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
    setImageUrl(imageUrl);
    setInstituteData({
      ...instituteData,
      image: `instituteImages/institute_image_${instituteData.id}`
    });
    toggleCropper();
    setImageLoading(false);
  };

  const addNewInstitution = async () => {
    if (!instituteData.name) {
      setError({
        show: true,
        errorMsg: InstitutionBuilderDict[userLanguage]['messages']['namerequired']
      });
    } else {
      removeErrorMSg();
      try {
        setSaving(true);
        if (s3Image) {
          await uploadImageToS3(
            s3Image,
            `instituteImages/institute_image_${instituteData.id || uuidv4()}`,
            'image/jpeg'
          );
        }
        let payload: any = {
          label: instituteData.name,
          type: instituteData.type,
          website: instituteData.website,
          address: instituteData.address,
          addressLine2: instituteData.addressLine2,
          city: instituteData.city,
          state: instituteData.state,
          zip: instituteData.zip,
          image: instituteData.image,
          isZoiq: instituteData.isZoiq,
          phone: instituteData.phone,
          isServiceProvider: instituteData.isServiceProvider
        };
        if (instituteData.id) {
          payload = {
            ...payload,
            id: instituteData.id
          };
          const result: any = await API.graphql(
            graphqlOperation(customMutations.updateInstitution, {
              input: payload
            })
          );
          postMutation(result.data?.updateInstitution);
        } else {
          await API.graphql(
            graphqlOperation(customMutations.createInstitution, {
              input: payload
            })
          );
        }

        setSaving(false);
        setServerMessage({
          isError: false,
          message: InstitutionBuilderDict[userLanguage]['messages']['saveMsg']
        });
        setTimeout(() => {
          setServerMessage({
            isError: false,
            message: ''
          });
        }, 2000);

        history.goBack();
      } catch {
        setError({
          show: true,
          errorMsg: InstitutionBuilderDict[userLanguage]['messages']['adderr']
        });
      }
    }
  };
  useEffect(() => {
    if (institutionInfo?.id) {
      setInstituteData({
        ...institutionInfo
      });
    }
  }, [institutionInfo]);

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(institutionInfo.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [institutionInfo.image]);

  const mediaRef = React.useRef<any>(null);
  const handleImage = () => mediaRef?.current?.click();

  const {
    name,
    type,
    website,
    address,
    addressLine2,
    city,
    state,
    zip,
    phone,
    isServiceProvider
  } = instituteData;

  const formDict = InstitutionBuilderDict[userLanguage]['FORM'];

  return (
    <div className="">
      {/* Section Header */}
      {/* Body */}
      <div className="h-9/10 flex flex-col md:flex-row">
        <div className={`h-full w-full pt-2`}>
          {/* FORM submit tag */}
          <form>
            <div className={`h-full bg-white mb-4`}>
              {/* FORM */}
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3 px-4 py-5">
                <Selector
                  selectedItem={type}
                  label={formDict['INSTITUTION_TYPE']}
                  placeholder={formDict['INSTITUTION_TYPE']}
                  list={institutionTypeList}
                  width="100%"
                  onChange={onTypeSelect}
                />

                <UploadImageBtn
                  label="Insitution Image"
                  className="w-full"
                  handleImage={handleImage}
                  mediaRef={mediaRef}
                  setImageLoading={setImageLoading}
                  imageUrl={imageUrl}
                  setImage={(img: any, file: any) => {
                    setUpImage(img);
                    setFileObj(file);
                  }}
                  toggleCropper={toggleCropper}
                />

                <FormInput
                  value={name}
                  onChange={onInputChange}
                  id="name"
                  name="name"
                  label={formDict['NAME_INPUT_LABEL']}
                  placeHolder={formDict['NAME_INPUT_PLACEHOLDER']}
                  isRequired
                />

                <FormInput
                  value={website}
                  onChange={onInputChange}
                  id="website"
                  name="website"
                  label={formDict['WEBSITE_INPUT_LABEL']}
                  placeHolder={formDict['WEBSITE_INPUT_PLACEHOLDER']}
                />

                <FormInput
                  value={address}
                  id="address"
                  onChange={onInputChange}
                  name="address"
                  label={formDict['ADDRESS_INPUT_LABEL']}
                />

                <FormInput
                  value={addressLine2}
                  id="addressLine2"
                  onChange={onInputChange}
                  name="addressLine2"
                  label={formDict['ADDRESS2_INPUT_LABEL']}
                />

                <FormInput
                  value={city}
                  id="city"
                  onChange={onInputChange}
                  name="city"
                  label={formDict['CITY_LABEL']}
                />

                <Selector
                  selectedItem={state}
                  placeholder={formDict['state']}
                  list={statesList}
                  width="100%"
                  label={formDict['STATE_LABEL']}
                  onChange={onStateSelect}
                />

                <FormInput
                  value={zip}
                  id="zip"
                  onChange={onInputChange}
                  name="zip"
                  label={formDict['ZIP_LABEL']}
                />

                <FormInput
                  value={phone}
                  id="phone"
                  onChange={onInputChange}
                  name="phone"
                  label={formDict['PHONE_LABEL']}
                />

                <div className="col-span-2"></div>
                <CheckBox
                  value={isServiceProvider}
                  onChange={handdleCheckBox}
                  name="isServiceProvider"
                  label={
                    name
                      ? `${name} ${formDict['SERVICEPROVIDER_LABEL_WITH_NAME']}`
                      : formDict['SERVICEPROVIDER_LABEL_WITHOUT_NAME']
                  }
                />
                {checkIfAdmin() && (
                  <CheckBox
                    name="isZoiq"
                    dataCy="isZoiq"
                    label={'ZOIQ'}
                    className="group:hover:bg-gray-500"
                    value={instituteData.isZoiq}
                    onChange={(e) => {
                      setInstituteData({
                        ...instituteData,
                        isZoiq: e.target.checked
                      });
                    }}
                  />
                )}
              </div>
              {serverMessage.message && (
                <span className="text-sm text-green-600 text-center my-6 mx-3 w-full">
                  {serverMessage.message}
                </span>
              )}

              <div className="flex justify-end gap-4 w-auto pb-4">
                <Buttons
                  label={InstitutionBuilderDict[userLanguage]['BUTTON']['CANCEL']}
                  onClick={history.goBack}
                  transparent
                />
                <Buttons
                  label={
                    saving
                      ? ButtonDict[userLanguage]['SAVING']
                      : InstitutionBuilderDict[userLanguage]['BUTTON']['SAVE']
                  }
                  onClick={addNewInstitution}
                  disabled={saving}
                />
              </div>
            </div>

            {error.show ? (
              <span className="text-sm text-red-600 my-6 mx-3">{error.errorMsg}</span>
            ) : null}
          </form>

          {/* Image cropper */}
          {showCropper && (
            <ProfileCropModal
              upImg={upImage || ''}
              saveCroppedImage={(img: string) => saveCroppedImage(img)}
              closeAction={toggleCropper}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionFormComponent;
