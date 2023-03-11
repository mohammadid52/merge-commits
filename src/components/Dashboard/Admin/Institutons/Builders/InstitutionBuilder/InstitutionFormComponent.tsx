import { GraphQLAPI as API, graphqlOperation } from "@aws-amplify/api-graphql";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import * as customMutations from "customGraphql/customMutations";
import useDictionary from "customHooks/dictionary";
import { statesList } from "utilities/staticData";

import UploadImageBtn from "@components/Atoms/Buttons/UploadImageBtn";
import { uploadImageToS3 } from "@graphql/functions";
import Buttons from "atoms/Buttons";
import CheckBox from "atoms/Form/CheckBox";
import FormInput from "atoms/Form/FormInput";
import Selector from "atoms/Form/Selector";
import ProfileCropModal from "components/Dashboard/Profile/ProfileCropModal";
import { getImageFromS3 } from "utilities/services";
import { useGlobalContext } from "@contexts/GlobalContext";

const InstitutionFormComponent = ({ institutionInfo, postMutation }: any) => {
  const history = useHistory();
  const initialState: any = {
    id: null,
    name: "",
    type: "",
    website: "",
    isServiceProvider: false,
    isZoiq: false,
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    image: "",
    serviceProviders: {
      items: [],
    },
  };
  const [instituteData, setInstituteData] = useState(initialState);
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState<string | null>(null);
  const [_, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [s3Image, setS3Image] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { checkIfAdmin, userLanguage } = useGlobalContext();
  const { InstitutionBuilderDict, BUTTONS: ButtonDict } = useDictionary();
  const [error, setError] = useState({
    show: true,
    errorMsg: "",
  });
  const [serverMessage, setServerMessage] = useState({
    message: "",
    isError: false,
  });

  const institutionTypeList = [
    {
      id: 1,
      name: InstitutionBuilderDict[userLanguage]["INSTITUTION_TYPE"]["SCHOOL"],
      value: "School",
    },
    {
      id: 2,
      name: InstitutionBuilderDict[userLanguage]["INSTITUTION_TYPE"][
        "AFTERSCHOOL"
      ],
      value: "After School",
    },
    {
      id: 3,
      name: InstitutionBuilderDict[userLanguage]["INSTITUTION_TYPE"]["DAYCAMP"],
      value: "Day Camp",
    },
    {
      id: 4,
      name: InstitutionBuilderDict[userLanguage]["INSTITUTION_TYPE"][
        "SUMMERCAMP"
      ],
      value: "Summer Camp",
    },
    {
      id: 5,
      name: InstitutionBuilderDict[userLanguage]["INSTITUTION_TYPE"]["C3"],
      value: "501C3",
    },
  ];

  const removeErrorMSg = () => {
    if (error.show) {
      setError({
        show: false,
        errorMsg: "",
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

  const onTypeSelect = (str: string) => {
    removeErrorMSg();
    setInstituteData({
      ...instituteData,
      type: str,
    });
  };
  const onStateSelect = (str: string) => {
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

  // const uploadImageToS3 = async (file: any, id: string, type: string) => {
  //   // Upload file to s3 bucket

  //   return new Promise((resolve, reject) => {
  //     Storage.put(`instituteImages/institute_image_${id}`, file, {
  //       contentType: type,
  //       acl: 'public-read',
  //       ContentEncoding: 'base64'
  //     })
  //       .then((result) => {
  //         console.log('File successfully uploaded to s3', result);
  //         resolve(true);
  //       })
  //       .catch((err) => {
  //         setError({
  //           show: true,
  //           errorMsg: InstitutionBuilderDict[userLanguage]['messages']['uploaderr']
  //         });
  //         console.error('Error in uploading file to s3', err);
  //         reject(err);
  //       });
  //   });
  // };

  const [fileObj, setFileObj] = useState({});

  const saveCroppedImage = async (image: string) => {
    toggleCropper();
    setS3Image(image ? image : fileObj);
    // @ts-ignore
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
        errorMsg:
          InstitutionBuilderDict[userLanguage]["messages"]["namerequired"],
      });
    } else {
      removeErrorMSg();
      try {
        setSaving(true);
        if (s3Image) {
          await uploadImageToS3(
            s3Image,
            `instituteImages/institute_image_${instituteData.id || uuidv4()}`,
            "image/jpeg"
          );
        }
        let payload: any = {
          name: instituteData.name,
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
          isServiceProvider: instituteData.isServiceProvider,
        };
        if (instituteData.id) {
          payload = {
            ...payload,
            id: instituteData.id,
          };
          const result: any = await API.graphql(
            graphqlOperation(customMutations.updateInstitution, {
              input: payload,
            })
          );
          postMutation(result.data?.updateInstitution);
        } else {
          await API.graphql(
            graphqlOperation(customMutations.createInstitution, {
              input: payload,
            })
          );
        }

        setSaving(false);
        setServerMessage({
          isError: false,
          message: InstitutionBuilderDict[userLanguage]["messages"]["saveMsg"],
        });
        setTimeout(() => {
          setServerMessage({
            isError: false,
            message: "",
          });
        }, 2000);

        history.goBack();

        // history.push(`institution?id=${instituteData.id}`);
      } catch {
        setError({
          show: true,
          errorMsg: InstitutionBuilderDict[userLanguage]["messages"]["adderr"],
        });
      }
    }
  };
  useEffect(() => {
    if (institutionInfo?.id) {
      setInstituteData({
        ...institutionInfo,
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
    isServiceProvider,
  } = instituteData;

  return (
    <div className="w-full h-full p-4">
      {/* Section Header */}
      {/* Body */}
      <div className="h-9/10 flex flex-col md:flex-row">
        <div className={`h-full w-full pt-2`}>
          {/* FORM submit tag */}
          <form>
            <div className={`h-full bg-white mb-4`}>
              {/* FORM */}
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 px-4 py-5">
                <div className="sm:col-span-3 px-3 py-2">
                  <div className="">
                    <Selector
                      selectedItem={type}
                      label={
                        InstitutionBuilderDict[userLanguage]["FORM"][
                          "INSTITUTION_TYPE"
                        ]
                      }
                      placeholder={
                        InstitutionBuilderDict[userLanguage]["FORM"][
                          "INSTITUTION_TYPE"
                        ]
                      }
                      list={institutionTypeList}
                      onChange={onTypeSelect}
                    />
                  </div>
                </div>
                <UploadImageBtn
                  className="sm:col-span-3 px-3 py-2"
                  label="Insitution Image"
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
                <div className="sm:col-span-3 px-3 py-2">
                  <FormInput
                    value={name}
                    onChange={onInputChange}
                    id="name"
                    name="name"
                    label={
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "NAME_INPUT_LABEL"
                      ]
                    }
                    placeHolder={
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "NAME_INPUT_PLACEHOLDER"
                      ]
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
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "WEBSITE_INPUT_LABEL"
                      ]
                    }
                    placeHolder={
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "WEBSITE_INPUT_PLACEHOLDER"
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
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "ADDRESS_INPUT_LABEL"
                      ]
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
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "ADDRESS2_INPUT_LABEL"
                      ]
                    }
                  />
                </div>

                <div className="sm:col-span-3 px-3 py-2">
                  <FormInput
                    value={city}
                    id="city"
                    onChange={onInputChange}
                    name="city"
                    label={
                      InstitutionBuilderDict[userLanguage]["FORM"]["CITY_LABEL"]
                    }
                  />
                </div>

                <div className="sm:col-span-3 px-3 py-2">
                  <label className="block text-xs font-semibold mb-1  leading-5 text-gray-700">
                    {
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "STATE_LABEL"
                      ]
                    }
                  </label>
                  <Selector
                    selectedItem={state}
                    placeholder={
                      InstitutionBuilderDict[userLanguage]["FORM"]["state"]
                    }
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
                    label={
                      InstitutionBuilderDict[userLanguage]["FORM"]["ZIP_LABEL"]
                    }
                  />
                </div>

                <div className="sm:col-span-3 px-3 py-2">
                  <FormInput
                    value={phone}
                    id="phone"
                    onChange={onInputChange}
                    name="phone"
                    label={
                      InstitutionBuilderDict[userLanguage]["FORM"][
                        "PHONE_LABEL"
                      ]
                    }
                  />
                </div>
                <div className="col-span-6 lg:col-span-3 px-3 py-2 flex items-center">
                  <CheckBox
                    value={isServiceProvider}
                    onChange={handdleCheckBox}
                    name="isServiceProvider"
                    label={
                      name
                        ? `${name} ${InstitutionBuilderDict[userLanguage]["FORM"]["SERVICEPROVIDER_LABEL_WITH_NAME"]}`
                        : InstitutionBuilderDict[userLanguage]["FORM"][
                            "SERVICEPROVIDER_LABEL_WITHOUT_NAME"
                          ]
                    }
                  />
                </div>
                {checkIfAdmin() && (
                  <div className="col-span-6 lg:col-span-3 px-3 py-2 flex items-center">
                    <CheckBox
                      name="isZoiq"
                      dataCy="isZoiq"
                      label={"ZOIQ"}
                      className="group:hover:bg-gray-500"
                      value={instituteData.isZoiq}
                      onChange={(e) => {
                        setInstituteData({
                          ...instituteData,
                          isZoiq: e.target.checked,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
              {serverMessage.message && (
                <span className="text-sm text-green-600 text-center my-6 mx-3 w-full">
                  {serverMessage.message}
                </span>
              )}
              <div className="px-4 w-full flex justify-end">
                <div className="flex justify-end w-auto pb-4">
                  <Buttons
                    label={
                      InstitutionBuilderDict[userLanguage]["BUTTON"]["CANCEL"]
                    }
                    btnClass="w-full px-6 py-4 mr-2"
                    onClick={history.goBack}
                    transparent
                  />
                  <Buttons
                    label={
                      saving
                        ? ButtonDict[userLanguage]["SAVING"]
                        : InstitutionBuilderDict[userLanguage]["BUTTON"]["SAVE"]
                    }
                    btnClass="w-full px-6 py-4 ml-2"
                    onClick={addNewInstitution}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {error.show ? (
              <span className="text-sm text-red-600 my-6 mx-3">
                {error.errorMsg}
              </span>
            ) : null}
          </form>

          {/* Image cropper */}
          {showCropper && (
            <ProfileCropModal
              upImg={upImage || ""}
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
