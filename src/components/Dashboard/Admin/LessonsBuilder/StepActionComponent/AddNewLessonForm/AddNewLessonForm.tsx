import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {RoomStatus} from 'API';
import {Card, message} from 'antd';
import Buttons from 'atoms/Buttons';
import RichTextEditor from 'atoms/RichTextEditor';
import {useGlobalContext} from 'contexts/GlobalContext';
import {updateUniversalLesson} from 'customGraphql/customMutations';
import useDictionary from 'customHooks/dictionary';
import {uploadImageToS3} from 'graphql-functions/functions';
import {createUniversalLesson} from 'graphql/mutations';
import React, {useState} from 'react';
import ProfileCropModal from '../../../../Profile/ProfileCropModal';
import {InitialData, InputValueObject} from '../../LessonBuilder';
import LessonCard from './LessonCard';
import LessonDetails from './LessonDetails';
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

  setUnsavedChanges: Function;
  fetchStaffByInstitution: (institutionID: string) => void;
  lessonPlanAttachment?: any;
}

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
    lessonPlanAttachment
  } = props;

  const {userLanguage} = useGlobalContext();

  const {AddNewLessonFormDict} = useDictionary();

  const [validation, setValidation] = useState({
    name: '',
    type: '',
    languages: '',
    message: '',
    institution: '',
    image: '',
    studentSummary: '',
    imageCaption: '',
    isError: true
  });
  const [showCropper, setShowCropper] = useState(false);
  const [imageData, setImageData] = useState<any>(null);

  const onInputChange = (e: any) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setUnsavedChanges(true);
    setValidation({
      ...validation,
      [name === 'imageCaption' ? 'image' : name]: ''
    });
  };

  const onSelectOption = (val: string, name: string, id: string, field: string) => {
    setFormData((prevData: InitialData) => ({
      ...prevData,
      [field]: {
        id: id,
        name: name,
        value: val
      }
    }));
    setUnsavedChanges(true);

    setValidation({
      ...validation,
      [field]: ''
    });
    if (field === 'institution') {
      fetchStaffByInstitution(id);
    }
  };

  const onSelectTargetAudience = (name: string) => {
    setFormData((prevData: InitialData) => ({
      ...prevData,
      targetAudience: name
    }));
  };

  const lessonPlan = formData.lessonPlan || [];

  const totalEstTime =
    Math.ceil(
      lessonPlan.reduce((total: number, obj: any) => Number(obj.estTime) + total, 0) / 5
    ) * 5;

  const selectLanguage = (_: string[], option: any) => {
    setFormData({...formData, languages: option});
    setValidation({
      ...validation,
      languages: ''
    });
    setUnsavedChanges(true);
  };

  const selectDesigner = (_: string[], option: any[]) => {
    setSelectedDesigners(option);
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
      [field]: text
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
    // @ts-ignore
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
    setFormData({
      ...formData,
      imagePreviewUrl: imageUrl
    });

    toggleCropper();
  };

  const onDurationSelect = (name: string) => {
    setFormData({
      ...formData,
      duration: name
    });
  };

  const [messageApi, contextHolder] = message.useMessage();

  const validateForm = () => {
    let isValid = true;
    const msgs = validation;

    if (!formData.name?.trim().length) {
      isValid = false;
      msgs.name = AddNewLessonFormDict[userLanguage]['VALIDATION']['NAME'];
      messageApi.error(AddNewLessonFormDict[userLanguage]['VALIDATION']['NAME']);
    } else {
      msgs.name = '';
    }
    if (!formData.type?.value.trim().length) {
      isValid = false;
      msgs.type = AddNewLessonFormDict[userLanguage]['VALIDATION']['TYPE'];
      messageApi.error(AddNewLessonFormDict[userLanguage]['VALIDATION']['TYPE']);
    } else {
      msgs.type = '';
    }
    if (!formData.institution?.value.trim().length) {
      isValid = false;
      msgs.institution = AddNewLessonFormDict[userLanguage]['VALIDATION']['INSTITUTE'];
      messageApi.error(AddNewLessonFormDict[userLanguage]['VALIDATION']['INSTITUTE']);
    } else {
      msgs.institution = '';
    }
    if (!formData.languages?.length) {
      isValid = false;
      msgs.languages = AddNewLessonFormDict[userLanguage]['VALIDATION']['LANGUAGE'];
      messageApi.error(AddNewLessonFormDict[userLanguage]['VALIDATION']['LANGUAGE']);
    } else {
      msgs.languages = '';
    }
    if (!formData.studentSummary?.trim().length) {
      isValid = false;
      msgs.studentSummary =
        AddNewLessonFormDict[userLanguage]['VALIDATION']['STUDENT_SUMMARY'];
      messageApi.error(
        AddNewLessonFormDict[userLanguage]['VALIDATION']['STUDENT_SUMMARY']
      );
    } else {
      msgs.studentSummary = '';
    }
    if (!formData.imageCaption?.trim().length) {
      isValid = false;
      msgs.imageCaption =
        AddNewLessonFormDict[userLanguage]['VALIDATION']['IMAGE_CAPTION'];
      messageApi.error(AddNewLessonFormDict[userLanguage]['VALIDATION']['IMAGE_CAPTION']);
    } else {
      msgs.imageCaption = '';
    }

    // TODO: Add validation for repeating lesson names.
    setValidation({...msgs});
    return isValid;
  };

  // DataBase Related

  const [creatingLessons, setCreatingLessons] = useState(false); // loader for saving new lessons

  const updateStatus = (name: RoomStatus) => {
    setFormData({...formData, status: name});
  };

  const createNewLesson = async () => {
    const isValid = validateForm();

    if (isValid) {
      setCreatingLessons(true);
      let fileName = formData.imageUrl;
      if (imageData) {
        fileName = `ULB/lesson_image_${Date.now()}`;
        await uploadImageToS3(imageData, `${fileName}`, 'image/jpeg');
      }
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
        status: formData?.status || RoomStatus.ACTIVE
      };

      // Creating New Lesson
      if (!lessonId) {
        try {
          const result: any = await API.graphql(
            graphqlOperation(createUniversalLesson, {input})
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
          delete input.lessonPlan;
          const results: any = await API.graphql(
            graphqlOperation(updateUniversalLesson, {
              input: {
                id: lessonId,
                ...input
              }
            })
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
              studentSummary: ''
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
            studentSummary: ''
          });
        }
      }
    }
  };

  const {
    name,
    type,
    duration = '1',
    languages = [],
    purposeHtml,
    status = RoomStatus.ACTIVE,
    objectiveHtml,
    notesHtml,
    imageCaption,
    imagePreviewUrl = '',
    studentSummary = '',
    targetAudience
  } = formData;

  const [showUploadModal, setShowUploadModal] = useState(false);

  const onUploadModalClose = () => {
    setShowUploadModal(false);
  };

  return (
    <div className="">
      {contextHolder}
      {/* <div className="px-4 py-5 border-b-0 border-lightest sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-darkest">
          {AddNewLessonFormDict[userLanguage]['TITLE']}
        </h3>
      </div> */}

      <div className="mt-4">
        <div className=" lg:grid lg:grid-cols-2 gap-6 ">
          <Card
            title={'Lesson Details'}
            type="inner"
            extra={
              <Buttons
                label={`${lessonPlanAttachment ? '' : 'Upload'} lesson plan`}
                size="small"
                variant="default"
                onClick={() => setShowUploadModal(true)}
              />
            }>
            <LessonDetails
              lessonPlanAttachment={lessonPlanAttachment}
              onClose={onUploadModalClose}
              showUploadModal={showUploadModal}
              name={name}
              onInputChange={onInputChange}
              lessonId={lessonId}
              targetAudience={targetAudience}
              updateStatus={updateStatus}
              type={type}
              duration={duration}
              status={status}
              selectedDesigners={selectedDesigners}
              languages={languages}
              designerListLoading={designerListLoading}
              onDurationSelect={onDurationSelect}
              onSelectOption={onSelectOption}
              onSelectTargetAudience={onSelectTargetAudience}
              selectLanguage={selectLanguage}
              designersList={designersList}
              selectDesigner={selectDesigner}
              validation={validation}
            />
          </Card>
          <Card type="inner" title="Lesson Objectives">
            <RichTextEditor
              maxHeight={'max-h-96'}
              initialValue={objectiveHtml}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'objectiveHtml', 'objective')
              }
              wrapperClass={'lesson'}
            />
          </Card>
          <Card type="inner" title="Materials">
            <MaterialsCard
              purposeHtml={purposeHtml}
              studentMaterials={formData.studentMaterials}
              setEditorContent={setEditorContent}
            />
          </Card>
          <Card type="inner" title="Reminder & Notes">
            <RichTextEditor
              initialValue={notesHtml || ''}
              onChange={(htmlContent, plainText) =>
                setEditorContent(htmlContent, plainText, 'notesHtml', 'notes')
              }
              wrapperClass={'lesson'}
            />
          </Card>
          <Card type="inner" title="Lesson Card" className="col-span-2">
            <LessonCard
              cardCaption={formData?.imageCaption || ''}
              studentSummary={studentSummary}
              onInputChange={onInputChange}
              imageCaption={imageCaption || ''}
              setImage={setImageData}
              validation={validation}
              setFileObj={setFileObj}
              imagePreviewUrl={imagePreviewUrl}
              totalEstTime={totalEstTime}
              toggleCropper={toggleCropper}
              lessonType={formData.type.value}
            />
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
          open={showCropper}
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
