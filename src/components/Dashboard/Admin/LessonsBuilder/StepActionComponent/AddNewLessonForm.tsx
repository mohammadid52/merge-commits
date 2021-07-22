import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import {IoCamera} from 'react-icons/io5';

import Selector from '../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../../Atoms/Form/FormInput';
import RichTextEditor from '../../../../Atoms/RichTextEditor';
import Buttons from '../../../../Atoms/Buttons';
import TextArea from '../../../../Atoms/Form/TextArea';

import {languageList, lessonTypeList} from '../../../../../utilities/staticData';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as mutations from '../../../../../graphql/mutations';

import {InitialData, InputValueObject} from '../LessonBuilder';
import ProfileCropModal from '../../../Profile/ProfileCropModal';
import {getAsset} from '../../../../../assets';

interface AddNewLessonFormProps {
  formData: InitialData;
  designersList: InputValueObject[];
  selectedDesigners: InputValueObject[];
  changeLessonType: (type: string) => void;
  setFormData: (data: InitialData) => void;
  setSelectedDesigners: (designer: InputValueObject[]) => void;
  postLessonCreation: (lessonId: string, action?: string) => void;
  allMeasurement: {id: number; name: string; value: string; topic?: string}[];
  lessonMeasurements: any[];
  setLessonMeasurements: (obj: any[]) => void;
  lessonId: string;
  institutionList: any[];
  setUnsavedChanges: Function;
}

const periodOptions = [
  {id: 1, name: '1'},
  {id: 2, name: '2'},
  {id: 3, name: '3'},
  {id: 4, name: '4'},
  {id: 5, name: '5'},
];

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
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    institution: '',
    image: '',
    studentSummary: '',
    isError: true,
  });
  const [showCropper, setShowCropper] = useState(false);
  const [imageData, setImageData] = useState(null);
  // const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState(null);
  const [fileObject, setFileObject] = useState<any>({});
  const onInputChange = (e: any) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setUnsavedChanges(true);
    setValidation({
      ...validation,
      [name === 'imageCaption' ? 'image' : name]: '',
    });
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

    setValidation({
      ...validation,
      [field]: '',
    });
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
    setValidation({
      ...validation,
      languages: '',
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

      setFileObject(file);
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
    setFormData({
      ...formData,
      imagePreviewUrl: imageUrl,
    });
    // setImagePreviewUrl(imageUrl);
    toggleCropper();
  };

  const onDurationSelect = (_: any, name: string) => {
    setFormData({
      ...formData,
      duration: name,
    });
  };

  const uploadImageToS3 = async (file: any, fileName: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`${fileName}`, file, {
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
    if (!formData.studentSummary?.trim().length) {
      isValid = false;
      msgs.studentSummary =
        AddNewLessonFormDict[userLanguage]['VALIDATION']['STUDENT_SUMMARY'];
    } else {
      msgs.studentSummary = '';
    }
    // TODO: Add validation for repeating lesson names.
    setValidation({...msgs});
    return isValid;
  };

  // DataBase Related

  const [creatingLessons, setCreatingLessons] = useState(false); // loader for saving new lessons

  const createNewLesson = async () => {
    const isValid = validateForm();
    if (isValid) {
      setCreatingLessons(true);
      let fileName = formData.imageUrl;
      if (imageData) {
        fileName = `ULB/lesson_image_${Date.now()}`;
        await uploadImageToS3(imageData, `${fileName}`, 'image/jpeg');
      }
      // Creating New Lesson
      if (!lessonId) {
        try {
          const input: any = {
            type: formData.type.value,
            title: formData.name,
            designers: selectedDesigners.map((item) => item.id),
            lessonPlan: [],
            summary: formData.studentSummary,
            cardImage: fileName,
            cardCaption: formData.imageCaption,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            notes: formData.notesHtml,
            language: formData.languages.map((item) => item.value),
            institutionID: formData.institution?.id,
            // adding defaults to prevent errors
            duration: Number(formData.duration),
            resources: '',
            darkMode: true,
            label: '',
          };

          const result: any = await API.graphql(
            graphqlOperation(mutations.createUniversalLesson, {input})
          );
          const newLesson = result.data.createUniversalLesson;
          postLessonCreation(newLesson?.id, 'add');
        } catch (error) {
          console.error(error.message);
        } finally {
          setCreatingLessons(false);
        }
      } else {
        // Updating existing Lesson
        try {
          setLoading(true);
          const input = {
            id: lessonId,
            type: formData.type.value,
            title: formData.name,
            institutionID: formData.institution.id,
            purpose: formData.purposeHtml,
            objectives: [formData.objectiveHtml],
            language: formData.languages.map((item) => item.value),
            designers: selectedDesigners.map((item) => item.id),
            summary: formData.studentSummary,
            cardImage: fileName,
            darkMode: true,
            cardCaption: formData.imageCaption,
          };
          const results: any = await API.graphql(
            graphqlOperation(customMutations.updateUniversalLesson, {input: input})
          );
          const lessonsData = results?.data?.updateUniversalLesson;
          setCreatingLessons(false);
          setUnsavedChanges(false);
          if (lessonsData) {
            setValidation({
              name: '',
              type: '',
              message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATE'],
              isError: false,
              image: '',
              institution: '',
              languages: '',
              studentSummary: '',
            });
            postLessonCreation(lessonsData?.id, 'update');
          }
        } catch (error) {
          console.error(error);
          setValidation({
            name: '',
            type: '',
            message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
            isError: true,
            institution: '',
            image: '',
            languages: '',
            studentSummary: '',
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
    duration = '1',
    languages,
    purposeHtml,
    objectiveHtml,
    notesHtml,
    institution,
    imageCaption,
    imagePreviewUrl = '',
    studentSummary = '',
  } = formData;

  return (
    <div className="bg-white shadow-5 overflow-hidden mb-4">
      {/* <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {AddNewLessonFormDict[userLanguage]['TITLE']}
        </h3>
      </div> */}

      <div className="">
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="h-9/10 md:flex-row">
            <div className="border-b-0 border-gray-200 mt-10">
              <div className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`}>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Lesson Details
                </h3>
              </div>
              <div className="p-4">
                <div className="px-3 py-4">
                  <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                    {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
                    <span className="text-red-500"> * </span>
                  </label>
                  <FormInput
                    value={name}
                    id="name"
                    onChange={onInputChange}
                    name="name"
                  />
                  {validation.name && (
                    <p className="text-red-600 text-sm">{validation.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-2">
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
                      {AddNewLessonFormDict[userLanguage]['DURATION']}{' '}
                    </label>
                    <Selector
                      selectedItem={duration.toString() || ''}
                      placeholder={AddNewLessonFormDict[userLanguage]['DURATION']}
                      list={periodOptions}
                      onChange={onDurationSelect}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2">
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
                    <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                      {AddNewLessonFormDict[userLanguage]['SELECTINSTITUTION']}{' '}
                      <span className="text-red-500"> * </span>
                    </label>
                    <Selector
                      disabled={lessonId !== ''}
                      selectedItem={institution.name}
                      placeholder={AddNewLessonFormDict[userLanguage]['INSTITUTION']}
                      list={institutionList}
                      onChange={(val, name, id) =>
                        onSelectOption(val, name, id, 'institution')
                      }
                    />
                    {validation.institution && (
                      <p className="text-red-600 text-sm">{validation.institution}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                </div>
              </div>
            </div>
            <div className="border-b-0 border-gray-200 mt-10">
              <div className="grid grid-cols-2">
                <div>
                  <div className="pr-4">
                    <div
                      className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {AddNewLessonFormDict[userLanguage]['OBJECTIVE']}
                      </h3>
                    </div>
                  </div>
                  <div className="py-4 pl-4">
                    <div className="px-3 py-4">
                      {/* <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                      {AddNewLessonFormDict[userLanguage]['OBJECTIVE']}
                    </label> */}
                      <RichTextEditor
                        initialValue={objectiveHtml}
                        onChange={(htmlContent, plainText) =>
                          setEditorContent(
                            htmlContent,
                            plainText,
                            'objectiveHtml',
                            'objective'
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="pl-4">
                    <div
                      className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {AddNewLessonFormDict[userLanguage]['MATERIALS']}
                      </h3>
                    </div>
                  </div>
                  <div className="py-4 pr-4">
                    <div className="px-3 py-4">
                      {/* <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                      {AddNewLessonFormDict[userLanguage]['PURPOSE']}
                    </label> */}
                      <RichTextEditor
                        initialValue={purposeHtml}
                        onChange={(htmlContent, plainText) =>
                          setEditorContent(
                            htmlContent,
                            plainText,
                            'purposeHtml',
                            'purpose'
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <div className="grid grid-cols-2">
                <div>
                  <div className="pr-4">
                    <div
                      className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {AddNewLessonFormDict[userLanguage]['REMINDERANDNOTES']}
                      </h3>
                    </div>
                  </div>
                  <div className="pl-4 py-4">
                    <div className="px-3 py-4">
                      <RichTextEditor
                        initialValue={notesHtml}
                        onChange={(htmlContent, plainText) =>
                          setEditorContent(htmlContent, plainText, 'notesHtml', 'notes')
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 pl-4">
                    <div
                      className={`border-b-0 pb-2 pl-2 ${theme.borderColor[themeColor]}`}>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Lesson Card
                      </h3>
                    </div>
                  </div>
                  <div className="px-3 py-5">
                    <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mb-4">
                      <label className="cursor-pointer flex justify-center">
                        {imagePreviewUrl ? (
                          <img
                            className={`profile w-50 h-60 md:w-50 md:h-60 border flex flex-shrink-0 border-gray-400`}
                            src={imagePreviewUrl}
                          />
                        ) : (
                          <div
                            className={`profile justify-center align-center items-center content-center w-50 h-60 md:w-50 md:h-60 bg-gray-100 border flex-shrink-0 flex border-gray-400`}>
                            <IoCamera className="fill-current text-gray-80" size={32} />
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
                  </div>
                  <div className="col-span-2">
                    <div className="pr-8 pt-5">
                      <label className="block text-m font-medium leading-5 text-gray-700 mb-1 text-left">
                        {AddNewLessonFormDict[userLanguage]['IMAGE_CAPTION']}{' '}
                        <span className="text-red-500"> * </span>
                      </label>
                      <FormInput
                        value={imageCaption}
                        id="imageCaption"
                        onChange={onInputChange}
                        name="imageCaption"
                        maxLength={15}
                      />
                      {validation.name && (
                        <p className="text-red-600 text-sm">{validation.name}</p>
                      )}
                      <div className="text-right text-gray-400">
                        {imageCaption.length} of 15
                      </div>
                    </div>
                    {/* </div> */}
                    {/* <div className="col-span-3"> */}
                    <div className="pr-8 pt-1">
                      <label className="block text-m font-medium leading-5 text-gray-700 mb-3">
                        {AddNewLessonFormDict[userLanguage]['SUMMARY']}
                        <span className="text-red-500"> *</span>
                      </label>
                      <TextArea
                        rows={5}
                        id="studentSummary"
                        value={studentSummary}
                        onChange={onInputChange}
                        name="studentSummary"
                        maxLength={500}
                        showCharacterUsage
                        error={validation.studentSummary}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
              creatingLessons
                ? AddNewLessonFormDict[userLanguage]['SAVING']
                : AddNewLessonFormDict[userLanguage]['SAVE']
            }
            // onClick={saveFormData}
            onClick={createNewLesson}
            disabled={creatingLessons}
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
