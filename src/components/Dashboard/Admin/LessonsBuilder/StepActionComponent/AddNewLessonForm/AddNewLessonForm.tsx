import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Storage from '@aws-amplify/storage';
import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import * as customMutations from '../../../../../../customGraphql/customMutations';
import useDictionary from '../../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../../customHooks/urlParam';
import * as mutations from '../../../../../../graphql/mutations';
import {
  languageList,
  lessonTypeList,
  periodOptions,
  targetAudienceForIconoclast,
} from '../../../../../../utilities/staticData';
import Buttons from '../../../../../Atoms/Buttons';
import FormInput from '../../../../../Atoms/Form/FormInput';
import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import Selector from '../../../../../Atoms/Form/Selector';
import RichTextEditor from '../../../../../Atoms/RichTextEditor';
import ProfileCropModal from '../../../../Profile/ProfileCropModal';
import {InitialData, InputValueObject} from '../../LessonBuilder';
import LessonCard from './LessonCard';
import MaterialsCard from './MaterialsCard';

interface AddNewLessonFormProps {
  formData: InitialData;
  designerListLoading: boolean;
  designersList: InputValueObject[];
  selectedDesigners: InputValueObject[];
  changeLessonType: (type: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<InitialData>>;
  setSelectedDesigners: (designer: InputValueObject[]) => void;
  postLessonCreation: (lessonId: string, action?: string) => void;
  allMeasurement: {id: number; name: string; value: string; topic?: string}[];
  lessonId: string;
  institutionList: any[];
  setUnsavedChanges: Function;
  fetchStaffByInstitution: (institutionID: string) => void;
}

const Card = ({
  cardTitle,
  className,
  children,
}: {
  cardTitle: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${className} w-auto min-h-56 min-w-56 customShadow p-4 bg-white rounded-lg`}>
      <div className="px-3 mb-2">
        <h4 className="half-border relative  w-auto  text-lg font-medium tracking-wide ">
          {cardTitle}
        </h4>
      </div>

      {children}
    </div>
  );
};

const AddNewLessonForm = (props: AddNewLessonFormProps) => {
  const {
    fetchStaffByInstitution,
    formData,
    designerListLoading,
    designersList,
    selectedDesigners,
    setSelectedDesigners,

    setUnsavedChanges,
    setFormData,
    postLessonCreation,

    lessonId,
    institutionList,
  } = props;

  const {clientKey, userLanguage} = useContext(GlobalContext);

  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const params = useQuery(location.search);
  const refName = params.get('refName');

  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    institution: '',
    image: '',
    studentSummary: '',
    imageCaption: '',
    isError: true,
  });
  const [showCropper, setShowCropper] = useState(false);
  const [imageData, setImageData] = useState(null);

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
    setFormData((prevData: InitialData) => ({
      ...prevData,
      [field]: {
        id: id,
        name: name,
        value: val,
      },
    }));
    setUnsavedChanges(true);

    setValidation({
      ...validation,
      [field]: '',
    });
    if (field === 'institution') {
      fetchStaffByInstitution(id);
    }
  };

  const onSelectTargetAudience = (val: string, name: string, id: string) => {
    setFormData((prevData: InitialData) => ({
      ...prevData,
      targetAudience: name,
    }));
  };

  const totalEstTime =
    Math.ceil(
      formData.lessonPlan.reduce(
        (total: number, obj: any) => Number(obj.estTime) + total,
        0
      ) / 5
    ) * 5;

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

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };
  const [fileObj, setFileObj] = useState({});

  const saveCroppedImage = async (image: string) => {
    toggleCropper();
    setImageData(image ? image : fileObj);
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
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
    if (!formData.imageCaption?.trim().length) {
      isValid = false;
      msgs.imageCaption =
        AddNewLessonFormDict[userLanguage]['VALIDATION']['IMAGE_CAPTION'];
    } else {
      msgs.imageCaption = '';
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
            studentMaterials: formData.studentMaterials,
            objectives: [formData.objectiveHtml],
            notes: formData.notesHtml,
            language: formData.languages.map((item) => item.value),
            institutionID: formData.institution?.id,
            targetAudience: formData.targetAudience || null,
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
            studentMaterials: formData.studentMaterials,
            cardCaption: formData.imageCaption,
            duration: Number(formData.duration),
            targetAudience: formData.targetAudience || null,
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
              imageCaption: '',
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
            imageCaption: '',
            languages: '',
            studentSummary: '',
          });
        }
      }
    }
  };

  const inputRef = React.useRef();

  useEffect(() => {
    if (refName && refName === 'name') {
      if (inputRef && inputRef?.current) {
        // @ts-ignore
        inputRef?.current?.focus();
      }
    }
  }, [refName, inputRef]);

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
    targetAudience,
  } = formData;

  return (
    <div className="shadow-5 overflow-hidden mb-4 bg-gray-200">
      {/* <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {AddNewLessonFormDict[userLanguage]['TITLE']}
        </h3>
      </div> */}

      <div className="">
        <div className="h-9/10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <Card cardTitle={'Lesson Details'}>
            <div className="px-3">
              <div className="px-0 py-4">
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  {AddNewLessonFormDict[userLanguage]['NAME']}{' '}
                  <span className="text-red-500"> * </span>
                </label>
                <FormInput
                  value={name}
                  inputRef={inputRef}
                  id="name"
                  onChange={onInputChange}
                  name="name"
                />
                {validation.name && (
                  <p className="text-red-600 text-sm">{validation.name}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className="px-0 py-4">
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
                <div className="px-0 py-4">
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
              <div className="grid grid-cols-2 gap-x-4">
                <div className="px-0 py-4">
                  <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                    {AddNewLessonFormDict[userLanguage]['TARGET_AUDIENCE']}{' '}
                  </label>
                  <Selector
                    selectedItem={targetAudience}
                    placeholder={
                      AddNewLessonFormDict[userLanguage]['SELECT_TARGET_AUDIENCE']
                    }
                    list={targetAudienceForIconoclast}
                    onChange={onSelectTargetAudience}
                  />
                </div>
                <div className="px-0 py-4">
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
              <div className="py-4 col-span-2">
                <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                  {AddNewLessonFormDict[userLanguage]['SELECTDESIGNER']}
                </label>
                <MultipleSelector
                  selectedItems={selectedDesigners}
                  placeholder={AddNewLessonFormDict[userLanguage]['DESIGNER']}
                  list={designersList}
                  onChange={selectDesigner}
                  noOptionMessage={
                    designerListLoading
                      ? AddNewLessonFormDict[userLanguage]['MESSAGES']['LOADING']
                      : AddNewLessonFormDict[userLanguage]['MESSAGES']['NODESIGNEROPTION']
                  }
                />
              </div>
            </div>
          </Card>
          <Card cardTitle="Lesson Objectives">
            <div className="max-h-96 px-4 py-6">
              <RichTextEditor
                maxHeight={'max-h-96'}
                initialValue={objectiveHtml}
                onChange={(htmlContent, plainText) =>
                  setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')
                }
                wrapperClass={'lesson'}
              />
            </div>
          </Card>
          <Card cardTitle="Materials">
            <MaterialsCard
              purposeHtml={purposeHtml}
              studentMaterials={formData.studentMaterials}
              setEditorContent={setEditorContent}
            />
          </Card>
          <Card cardTitle="Reminder & Notes">
            <div className="max-h-96 px-4 py-6">
              <RichTextEditor
                initialValue={notesHtml}
                onChange={(htmlContent, plainText) =>
                  setEditorContent(htmlContent, plainText, 'notesHtml', 'notes')
                }
                wrapperClass={'lesson'}
              />
            </div>
          </Card>
          <Card cardTitle="Lesson Card" className="col-span-2">
            <div className="p-4">
              <LessonCard
                cardCaption={formData.imageCaption}
                studentSummary={studentSummary}
                onInputChange={onInputChange}
                imageCaption={imageCaption}
                setImage={setImageData}
                validation={validation}
                setFileObj={setFileObj}
                imagePreviewUrl={imagePreviewUrl}
                totalEstTime={totalEstTime}
                toggleCropper={toggleCropper}
                lessonType={formData.type.value}
              />
            </div>
          </Card>
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
          cardLayout
          customCropProps={{x: 25, y: 25, width: 384, height: 180}}
          locked={false}
          imageClassName={`w-full h-48 md:h-auto sm:w-2.5/10 } rounded-tl rounded-bl shadow`}
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}
    </div>
  );
};

export default AddNewLessonForm;
