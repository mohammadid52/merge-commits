import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import {IoImage} from 'react-icons/io5';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import Buttons from '../../../../Atoms/Buttons';

import {languageList, lessonTypeList} from '../../../../../utilities/staticData';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import * as customMutations from '../../../../../customGraphql/customMutations';

import {InitialData, InputValueObject} from '../LessonBuilder';
import ProfileCropModal from '../../../Profile/ProfileCropModal';

interface AddNewLessonFormProps {
  formData: InitialData;
  designersList: InputValueObject[];
  selectedDesigners: InputValueObject[];
  changeLessonType: (type: string) => void;
  setFormData: (data: InitialData) => void;
  setSelectedDesigners: (designer: InputValueObject[]) => void;
  postLessonCreation: (lessonId: string) => void;
  allMeasurement: {id: number; name: string; value: string; topic?: string}[];
  lessonMeasurements: any[];
  setLessonMeasurements: (obj: any[]) => void;
  lessonId: string;
  institutionList: any[];
  setUnsavedChanges: Function;
}

const AddNewLessonForm = (props: AddNewLessonFormProps) => {
  const {
    formData,
    designersList,
    selectedDesigners,
    setSelectedDesigners,
    changeLessonType,
    setUnsavedChanges,
    setFormData,
    postLessonCreation,
    allMeasurement,
    lessonMeasurements,
    setLessonMeasurements,
    lessonId,
    institutionList,
  } = props;

  const [selectedMeasu, setSelectedMeasu] = useState({id: '', name: '', value: ''});
  const [measurementList, setMeasurementList] = useState(allMeasurement);
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    institution: '',
    image: '',
    isError: true,
  });
  const [showCropper, setShowCropper] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const onInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setUnsavedChanges(true);
    if (validation.name) {
      setValidation({
        ...validation,
        name: '',
      });
    }
  };

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setFormData({
      ...formData,
      [field]: {
        id: id,
        name: name,
        value: val,
      },
    });
    setUnsavedChanges(true);
    if (validation.type || validation.languages) {
      setValidation({
        ...validation,
        type: '',
        languages: '',
        institution: '',
      });
    }
  };
  const selectMeasurement = (val: string, name: string, id: string) => {
    setSelectedMeasu({id, name, value: val});
  };

  const addNewMeasurement = () => {
    setLessonMeasurements([
      ...lessonMeasurements,
      {
        id: selectedMeasu.id,
        measurement: selectedMeasu.name,
        topic:
          allMeasurement.find((item) => item.id.toString() === selectedMeasu.id)?.topic ||
          '',
      },
    ]);
    setSelectedMeasu({id: '', name: '', value: ''});
  };

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = formData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setFormData({
      ...formData,
      languages: updatedList,
    });
    setUnsavedChanges(true);
  };

  const selectDesigner = (id: string, name: string, value: string) => {
    let updatedList;
    const currentDesigners = selectedDesigners;
    const selectedItem = currentDesigners.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentDesigners, {id, name, value}];
    } else {
      updatedList = currentDesigners.filter((item) => item.id !== id);
    }
    setSelectedDesigners(updatedList);
  };

  const setEditorContent = (
    html: string,
    text: string,
    fieldHtml: string,
    field: string
  ) => {
    setFormData({
      ...formData,
      [fieldHtml]: html,
      [field]: text,
    });
    setUnsavedChanges(true);
  };

    const cropSelecetedImage = async (e: any) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = function () {
          setImageData(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        toggleCropper();
      }
    };

    const toggleCropper = () => {
      setShowCropper(!showCropper);
    };

    const saveCroppedImage = async (image: string) => {
      toggleCropper();
      setImageData(image);
      const imageUrl = URL.createObjectURL(image);
      setImagePreviewUrl(imageUrl);
      toggleCropper();
    };

    const uploadImageToS3 = async (file: any, fileName: string, type: string) => {
      // Upload file to s3 bucket

      return new Promise((resolve, reject) => {
        Storage.put(`ULB/lesson_image_${fileName}`, file, {
          contentType: type,
          ContentEncoding: 'base64',
        })
          .then((result: any) => {
            console.log('File successfully uploaded to s3', result);
            resolve(true);
          })
          .catch((err: any) => {
            setValidation((prevValidation) => ({
              ...prevValidation,
              isError: true,
              image: 'Unable to upload image. Please try again later. ',
            }));
            console.log('Error in uploading file to s3', err);
            reject(err);
          });
      });
    };

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;
    if (!formData.name?.trim().length) {
      isValid = false;
      msgs.name = AddNewLessonFormDict[userLanguage]['VALIDATION']['NAME'];
    } else {
      msgs.name = '';
    }
    if (!formData.type?.value.trim().length) {
      isValid = false;
      msgs.type = AddNewLessonFormDict[userLanguage]['VALIDATION']['TYPE'];
    } else {
      msgs.type = '';
    }
    if (!formData.institution?.value.trim().length) {
      isValid = false;
      msgs.institution = AddNewLessonFormDict[userLanguage]['VALIDATION']['INSTITUTE'];
    } else {
      msgs.institution = '';
    }
    if (!formData.languages?.length) {
      isValid = false;
      msgs.languages = AddNewLessonFormDict[userLanguage]['VALIDATION']['LANGUAGE'];
    } else {
      msgs.languages = '';
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({...msgs});
    return isValid;
  };

  const saveFormData = async () => {
    if (!lessonId) {
      const isValid = validateForm();
      if (isValid) {
        try {
          setLoading(true);
          let input = {
            title: formData.name,
            type: formData.type?.value,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            language: formData.languages.map((item) => item.value),
            designers: selectedDesigners.map((item) => item.id),
            institutionID: formData.institution?.id,
            artistID: '0',
            doFirstID: '0',
            warmUpId: '0',
            coreLessonId: '0',
            activityId: '0',
            assessmentID: '0',
            // image: ''
            // assessmentID: formData.type?.value === 'lesson' ? "0" : uuidv4(),
          };
          // if (imageData) {
          //   const fileName = `${Date.now()}`;
          //   await uploadImageToS3(imageData, fileName, 'image/jpeg');
          //   input = {
          //     ...input,
          //     image: `ULB/lesson_image_${fileName}`,
          //   };
          // }
          const results: any = await API.graphql(
            graphqlOperation(customMutations.createLesson, {input: input})
          );
          const lessonsData = results?.data?.createLesson;
          postLessonCreation(lessonsData?.id);
          // if (lessonsData?.id) {
          //   let rubrics = Promise.all(
          //     lessonMeasurements.map(async (item: any) =>
          //       saveMeasurements(lessonsData?.id, item.id)
          //     )
          //   );
          //   setLoading(false);
          //   postLessonCreation(lessonsData?.id);
          //   setUnsavedChanges(false);

          //   setValidation({
          //     name: '',
          //     type: '',
          //     institution: '',
          //     languages: '',
          //     message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVE'],
          //     isError: false,
          //   });
          // }
        } catch {
          setValidation({
            name: '',
            type: '',
            institution: '',
            languages: '',
            message: AddNewLessonFormDict[userLanguage]['MESSAGES']['SAVEERR'],
            image:'',
            isError: true,
          });
          setLoading(false);
        }
      }
    } else {
      const isValid = validateForm();
      if (isValid) {
        try {
          setLoading(true);
          const input = {
            id: lessonId,
            title: formData.name,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            designers: selectedDesigners.map((item) => item.id),
            language: formData.languages.map((item) => item.value),
          };
          const results: any = await API.graphql(
            graphqlOperation(customMutations.updateLesson, {input: input})
          );
          const lessonsData = results?.data?.updateLesson;

          setLoading(false);
          setUnsavedChanges(false);

          if (lessonsData) {
            // postLessonCreation(lessonsData?.id);
            setValidation({
              name: '',
              type: '',
              message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATE'],
              isError: false,
              image: '',
              institution: '',
              languages: '',
            });
          }
        } catch {
          setValidation({
            name: '',
            type: '',
            message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
            isError: true,
            institution: '',
            image: '',
            languages: '',
          });
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (allMeasurement?.length > 0) {
      const measurementID = lessonMeasurements?.map((meas) => meas.id);
      const measurementList = allMeasurement.filter(
        (item) => !measurementID.includes(item.id)
      );
      setMeasurementList(measurementList);
    }
  }, [lessonMeasurements, allMeasurement]);

  const {
    name,
    type,
    languages,
    purposeHtml,
    objectiveHtml,
    institution,
    imageCaption,
  } = formData;

  return (
    <div className="bg-white shadow-5 overflow-hidden mb-4">
      <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {AddNewLessonFormDict[userLanguage]['TITLE']}
        </h3>
      </div>

      <div className="p-4">
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-auto p-4 mr-6 flex flex-col text-center items-center">
            <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mt-4">
              <label className="cursor-pointer flex justify-center">
                {imagePreviewUrl ? (
                  <img
                    className={`profile  w-120 h-80 md:w-120 md:h-80 border flex flex-shrink-0 border-gray-400`}
                    src={imagePreviewUrl}
                  />
                ) : (
                  <div
                    className={`profile justify-center lign-center items-center content-center w-80 h-80 md:w-80 md:h-80 bg-gray-100 border flex-shrink-0 flex border-gray-400`}>
                    <IoImage className="fill-current text-gray-80" size={32} />
                  </div>
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
            </button>
            <p className="text-gray-600 my-4">Click to add lesson image</p>

            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1 text-left">
                {AddNewLessonFormDict[userLanguage]['IMAGE_CAPTION']}{' '}
                <span className="text-red-500"> * </span>
              </label>
              <FormInput
                value={imageCaption}
                id="imageCaption"
                onChange={onInputChange}
                name="imageCaption"
              />
              {validation.name && (
                <p className="text-red-600 text-sm">{validation.name}</p>
              )}
            </div>
          </div>
          <div className="h-9/10 md:flex-row">
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
                <span className="text-red-500"> * </span>
              </label>
              <FormInput value={name} id="name" onChange={onInputChange} name="name" />
              {validation.name && (
                <p className="text-red-600 text-sm">{validation.name}</p>
              )}
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewLessonFormDict[userLanguage]['SELECTTYPE']}{' '}
                <span className="text-red-500"> * </span>
              </label>
              <Selector
                disabled={lessonId !== ''}
                selectedItem={type.name}
                placeholder={AddNewLessonFormDict[userLanguage]['TYPE']}
                list={lessonTypeList}
                onChange={(val, name, id) => onSelectOption(val, name, id, 'type')}
              />
              {validation.type && (
                <p className="text-red-600 text-sm">{validation.type}</p>
              )}
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewLessonFormDict[userLanguage]['SELECTINSTITUTION']}{' '}
                <span className="text-red-500"> * </span>
              </label>
              <Selector
                disabled={lessonId !== ''}
                selectedItem={institution.name}
                placeholder={AddNewLessonFormDict[userLanguage]['INSTITUTION']}
                list={institutionList}
                onChange={(val, name, id) => onSelectOption(val, name, id, 'institution')}
              />
              {validation.institution && (
                <p className="text-red-600 text-sm">{validation.institution}</p>
              )}
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewLessonFormDict[userLanguage]['SELECTLANG']}
                <span className="text-red-500"> * </span>
              </label>
              <MultipleSelector
                // disabled={lessonId !== ''}
                selectedItems={languages}
                placeholder={AddNewLessonFormDict[userLanguage]['LANGUAGE']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                {AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
              </label>
              <MultipleSelector
                selectedItems={selectedDesigners}
                placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
                list={designersList}
                onChange={selectDesigner}
              />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                {AddNewLessonFormDict[userLanguage]['PURPOSE']}
              </label>
              <RichTextEditor
                initialValue={purposeHtml}
                onChange={(htmlContent, plainText) =>
                  setEditorContent(htmlContent, plainText, 'purposeHtml', 'purpose')
                }
              />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                {AddNewLessonFormDict[userLanguage]['OBJECTIVE']}
              </label>
              <RichTextEditor
                initialValue={objectiveHtml}
                onChange={(htmlContent, plainText) =>
                  setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')
                }
              />
            </div>
          </div>
        </div>
        {validation.message && (
          <div className="py-2 m-auto mt-2 text-center">
            <p className={`${validation.isError ? 'text-red-600' : 'text-green-600'}`}>
              {validation.message}
            </p>
          </div>
        )}
        <div className="flex mb-8 mt-4 justify-center">
          <Buttons
            btnClass="py-3 px-10"
            label={
              loading
                ? AddNewLessonFormDict[userLanguage]['SAVING']
                : AddNewLessonFormDict[userLanguage]['SAVE']
            }
            onClick={saveFormData}
            disabled={loading}
          />
        </div>
      </div>
      {/* Image cropper */}
      {showCropper && (
        <ProfileCropModal
          upImg={imageData}
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}
    </div>
  );
};

export default AddNewLessonForm;
