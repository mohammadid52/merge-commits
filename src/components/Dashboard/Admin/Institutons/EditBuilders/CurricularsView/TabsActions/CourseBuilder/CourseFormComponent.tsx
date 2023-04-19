import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import UploadImageBtn from '@components/Atoms/Buttons/UploadImageBtn';
import {AttachedRooms} from '@components/Dashboard/Admin/Institutons/Listing/CurriculumList';
import ModalPopUp from '@components/Molecules/ModalPopUp';
import useAuth from '@customHooks/useAuth';
import {ClassroomType, RoomStatus} from 'API';
import {CourseSchema} from 'Schema';
import {Divider, Popconfirm, Space, message} from 'antd';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import ProfileCropModal from 'components/Dashboard/Profile/ProfileCropModal';
import {useGlobalContext} from 'contexts/GlobalContext';
import {createCurriculum} from 'customGraphql/customMutations';
import {listPersons, listRoomCurriculums} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useFormik} from 'formik';
import {
  checkUniqCurricularName,
  logError,
  uploadImageToS3
} from 'graphql-functions/functions';
import {deleteCurriculum, updateCurriculum} from 'graphql/mutations';
import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {getImageFromS3} from 'utilities/services';
import {languageList, typeList} from 'utilities/staticData';

export const RoomStatusList = [
  {
    label: RoomStatus.ACTIVE,
    id: 1,
    value: RoomStatus.ACTIVE
  },

  {
    label: RoomStatus.INACTIVE,
    id: 3,
    value: RoomStatus.INACTIVE
  },
  {
    label: RoomStatus.TRAINING,
    id: 4,
    value: RoomStatus.TRAINING
  }
];
interface CourseBuilderProps {
  courseId: string;
  courseData: any;
  savedSyllabusList?: any[];

  setCourseData: React.Dispatch<React.SetStateAction<any>>;
}

interface ICourseForm {
  name: string;
  description: string;
  summary: string;
  objectives: string;
  type?: string;
  languages: {id?: string; label: string; value: string}[];
  instituteId: string;
  status: RoomStatus;
}
const CourseFormComponent = ({
  courseId,
  courseData,
  setCourseData,
  savedSyllabusList = []
}: CourseBuilderProps) => {
  const initialData: ICourseForm = {
    name: '',
    description: '',
    objectives: '',
    status: RoomStatus.ACTIVE,
    summary: '',
    type: '',
    languages: [{id: '1', label: 'English', value: 'EN'}],
    instituteId: ''
  };
  const history = useHistory();

  const match = useRouteMatch();

  const [designersList, setDesignersList] = useState<any[]>([]);
  const [selectedDesigners, setSelectedDesigners] = useState<any[]>([]);

  const [fileObj, setFileObj] = useState({});

  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState<any | null>(null);
  const [_, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState<any | null>(null);

  const [loading, setIsLoading] = useState(false);
  const {userLanguage} = useGlobalContext();
  const {CurricularBuilderdict, UserEditDict} = useDictionary();

  const [messageApi, contextHolder] = message.useMessage();
  const {values, handleChange, errors, setFieldValue, handleSubmit} =
    useFormik<ICourseForm>({
      validationSchema: CourseSchema,
      validateOnBlur: false,
      initialValues: {
        name: courseData.name || '',
        languages:
          languageList.filter((item) => courseData?.languages?.includes(item?.value)) ||
          initialData.languages,

        status: RoomStatus.ACTIVE,
        type: courseData.type || ClassroomType.ONLINE,
        summary: courseData.summary || '',
        description: courseData.description || '',
        objectives: courseData.objectives || '',
        instituteId: courseData.institution.id
      },

      async onSubmit(values, formikHelpers) {
        setIsLoading(true);
        try {
          const curricularData = values;
          const isUniq =
            curricularData.name.trim() !== '' && courseData.name !== curricularData.name
              ? await checkUniqCurricularName(
                  curricularData.instituteId,
                  curricularData.name
                )
              : true;
          if (curricularData.instituteId) {
            if (isUniq) {
              const languagesCode = curricularData.languages.map(
                (item: {value: string}) => item.value
              );
              const designers = selectedDesigners.map((item) => item.id);
              let input: any = {
                name: curricularData.name,
                institutionID: curricularData.instituteId,
                description: curricularData.description,
                type: curricularData.type,
                summary: curricularData.summary,
                objectives: [curricularData.objectives],
                languages: languagesCode,
                designers,
                image: null as any,
                status: curricularData.status
              };
              if (courseId) {
                input.id = courseId;
                input.image = courseData.image;
                if (s3Image) {
                  const key = `instituteImages/curricular_image_${courseId}`;
                  await uploadImageToS3(s3Image, key, 'image/jpeg');
                  input = {
                    ...input,
                    image: `instituteImages/curricular_image_${courseId}`
                  };
                }

                const response: any = await API.graphql(
                  graphqlOperation(updateCurriculum, {input})
                );
                const data = response.data.updateCurriculum;
                history.push(
                  `${match.url}?step=unit_manager&institutionId=${curricularData.instituteId}`
                );
                setCourseData({...data});
              } else {
                const response: any = await API.graphql(
                  graphqlOperation(createCurriculum, {input: input})
                );
                const newCourse: any = response?.data?.createCurriculum;

                if (s3Image) {
                  const key = `instituteImages/curricular_image_${newCourse.id}`;
                  await uploadImageToS3(s3Image, key, 'image/jpeg');

                  await API.graphql(
                    graphqlOperation(updateCurriculum, {
                      input: {
                        id: newCourse.id,
                        image: key
                      }
                    })
                  );
                }
                history.push(
                  `${match.url}/${newCourse.id}?step=unit_manager&institutionId=${curricularData.instituteId}`
                );
              }
              messageApi.success(
                CurricularBuilderdict[userLanguage]['messages']['success']['save']
              );
              formikHelpers.resetForm();
            }
          } else {
            messageApi.error(
              CurricularBuilderdict[userLanguage]['messages']['validation']['institute']
            );
          }

          messageApi.error('Course name must be unique');
        } catch (error) {
          messageApi.error(
            CurricularBuilderdict[userLanguage]['messages']['error']['save']
          );
        } finally {
          setIsLoading(false);
        }
      }
    });

  // Temporary List

  //*****//

  const selectDesigner = (_: string[], option: any[]) => {
    setSelectedDesigners(option);
  };

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(listPersons, {
          filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]}
        })
      );
      const savedData = result.data.listPeople;
      const updatedList = savedData?.items.map(
        (item: {id: string; firstName: string; lastName: string}) => ({
          id: item?.id,
          name: `${item?.firstName || ''} ${item.lastName || ''}`,
          value: `${item?.firstName || ''} ${item.lastName || ''}`
        })
      );
      setDesignersList(updatedList);
    } catch {
      messageApi.error(
        CurricularBuilderdict[userLanguage]['messages']['error']['designerlist']
      );
    }
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: any) => {
    setImageLoading(true);
    toggleCropper();
    setS3Image(image ? image : fileObj);
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
    setImageUrl(imageUrl);
    toggleCropper();
    setImageLoading(false);
  };

  const updateImageUrl = async () => {
    const imageUrl: any = courseData.image
      ? await getImageFromS3(`instituteImages/curricular_image_${courseId}`)
      : null;
    setImageUrl(imageUrl);
  };

  useEffect(() => {
    fetchPersonsList();
    updateImageUrl();
  }, []);

  useEffect(() => {
    if (
      courseData?.designers !== null &&
      designersList?.length &&
      courseData?.designers?.length
    ) {
      const designers = [...courseData.designers]
        .map((desID: string) => {
          const personData = designersList.find((per) => per.id === desID);
          if (personData) {
            const personObj = {
              id: personData?.id,
              name: personData?.name,
              value: personData?.name
            };
            return personObj;
          }
          return null;
        })
        .filter(Boolean);

      setSelectedDesigners(designers.filter(Boolean));
    } else {
      setSelectedDesigners([]);
    }
  }, [designersList, courseData.designers]);

  const mediaRef = React.useRef<any>(null);
  const handleImage = () => mediaRef?.current?.click();

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: 'message',
    onSaveAction: () => {}
  });

  const closeModal = () => {
    setWarnModal({show: false, message: '', onSaveAction: () => {}});
  };

  const selectStatus = (name: RoomStatus) => {
    setFieldValue('status', name);
    closeModal();
  };

  const beforeStatusChange = (name: RoomStatus) => {
    if (name !== values.status) {
      if (name === RoomStatus.INACTIVE) {
        setWarnModal({
          show: true,
          message:
            'By setting this student to inactive, students will no longer see any courses when they log in (they will continue to have access to their notebooks). Do you wish to continue?',
          onSaveAction: () => selectStatus(name)
        });
      } else {
        selectStatus(name);
      }
    }
  };

  const [courseDeletable, setCourseDeletable] = useState(false);

  const onDeleteCourse = async () => {
    try {
      await API.graphql(
        graphqlOperation(deleteCurriculum, {
          input: {id: courseId}
        })
      );
    } catch (error) {
      messageApi.error('Error deleting course. Please try again later.');
    }
  };

  const {authId, email} = useAuth();

  // check if deletable or not
  // check connected units to this course

  const [informationForDeletable, setInformationForDeletable] = useState('');

  const checkDeletable = async () => {
    try {
      const attachedClassrooms: any = await API.graphql(
        graphqlOperation(listRoomCurriculums, {
          filter: {
            curriculumID: {
              eq: courseId
            }
          }
        })
      );

      const savedClassroomList = attachedClassrooms.data.listRoomCurricula.items;

      if (savedSyllabusList?.length > 0 || savedClassroomList?.length > 0) {
        setCourseDeletable(false);

        if (savedSyllabusList.length > 0) {
          setInformationForDeletable(
            `This course has ${savedSyllabusList.length} syllabus attached to it.`
          );
        }
        if (savedClassroomList.length > 0) {
          const nameOfListOfClassrooms = savedClassroomList.map(
            (item: any) => item?.curriculum?.name
          );
          setInformationForDeletable(
            `This course has ${savedClassroomList.length} classrooms attached to it.
            List of classrooms: ${nameOfListOfClassrooms.join(',')}
            `
          );
        }
      } else {
        setCourseDeletable(true);
      }
    } catch (error) {
      logError(
        error,
        {
          authId,
          email
        },
        'CurricularBuilder @checkDeletable'
      );
    }
  };

  useEffect(() => {
    checkDeletable();
  }, []);

  const {
    name,
    description,
    objectives,
    languages,
    type = ClassroomType.ONLINE,

    status = RoomStatus.ACTIVE,
    summary
  } = values;

  const {instId} = useAuth();
  const goBackUrl = `/dashboard/manage-institutions/institution/${instId}/courses`;

  return (
    <form onSubmit={handleSubmit} className="">
      {contextHolder}
      <div className="m-auto">
        <div className="flex flex-col">
          <div className="  grid gap-8 grid-cols-2 lg:grid-cols-3 py-4">
            <UploadImageBtn
              className=""
              label="Curriculum Image"
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

            <div className="">
              <FormInput
                dataCy="curricular-name-input"
                value={name}
                error={errors.name}
                id="curricularName"
                onChange={handleChange}
                name="name"
                label={CurricularBuilderdict[userLanguage]['NAME']}
                isRequired
              />
            </div>

            <div className="">
              <MultipleSelector
                label={CurricularBuilderdict[userLanguage]['LANGUAGE']}
                selectedItems={languages}
                placeholder={CurricularBuilderdict[userLanguage]['LANGUAGE']}
                list={languageList}
                onChange={(_, languages: any) => setFieldValue('languages', languages)}
              />
            </div>

            <div className="">
              <MultipleSelector
                label={CurricularBuilderdict[userLanguage]['DESIGNER']}
                selectedItems={selectedDesigners}
                placeholder={CurricularBuilderdict[userLanguage]['DESIGNER']}
                list={designersList}
                onChange={selectDesigner}
              />
            </div>
            <div className="">
              <Selector
                label={UserEditDict[userLanguage]['status']}
                placeholder={UserEditDict[userLanguage]['status']}
                list={RoomStatusList}
                // @ts-ignore
                onChange={(name: RoomStatus) => {
                  beforeStatusChange(name);
                }}
                selectedItem={status || UserEditDict[userLanguage]['status']}
              />
            </div>
            <div className=" ">
              <Selector
                label={CurricularBuilderdict[userLanguage]['TYPE']}
                placeholder={CurricularBuilderdict[userLanguage]['TYPE']}
                list={typeList}
                onChange={(name: string) => {
                  setFieldValue('type', name);
                }}
                selectedItem={type || CurricularBuilderdict[userLanguage]['TYPE']}
              />
            </div>

            <div className="">
              <FormInput
                textarea
                rows={6}
                value={summary}
                id="summary"
                onChange={handleChange}
                name="summary"
                label={CurricularBuilderdict[userLanguage]['SUMMARY']}
              />
            </div>

            <div className="">
              <FormInput
                textarea
                value={description}
                rows={6}
                id="description"
                onChange={handleChange}
                name="description"
                label={CurricularBuilderdict[userLanguage]['DESCRIPTION']}
              />
            </div>
            <div className="">
              <FormInput
                textarea
                rows={6}
                value={objectives}
                id="objectives"
                onChange={handleChange}
                name="objectives"
                label={CurricularBuilderdict[userLanguage]['OBJECT']}
              />
            </div>
          </div>
        </div>
      </div>

      {courseId && (
        <>
          <div className="max-w-56">
            <AttachedRooms
              header={<h4 className="text-lg font-bold">Attached Rooms</h4>}
              curriculumID={courseId}
            />
          </div>
          <Divider />
        </>
      )}

      <ModalPopUp
        open={warnModal.show}
        closeAction={closeModal}
        saveAction={warnModal.onSaveAction}
        saveLabel="Yes"
        message={warnModal.message}
      />

      <div className="flex justify-between">
        <div className="">
          <Popconfirm
            onConfirm={() => {
              onDeleteCourse();
            }}
            okText="Yes"
            cancelText="No"
            okType="danger"
            title="Are you sure you want to delete this course?">
            <Buttons
              tooltip={
                courseDeletable
                  ? ''
                  : informationForDeletable ||
                    'Cannot delete course with attached units or the course is live'
              }
              disabled={!courseDeletable}
              label="Delete course"
              redBtn
            />
          </Popconfirm>
        </div>
        <Space>
          <Buttons label={'Cancel'} transparent url={goBackUrl} disabled={loading} />
          <Buttons
            label={
              CurricularBuilderdict[userLanguage]['BUTTON'][loading ? 'SAVING' : 'SAVE']
            }
            type="submit"
            disabled={loading}
          />
        </Space>
      </div>

      {/* Image cropper */}

      {showCropper && (
        <ProfileCropModal
          open={showCropper}
          upImg={upImage || ''}
          customCropProps={{x: 25, y: 25, width: 480, height: 320}}
          locked
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}

      {/* </PageWrapper> */}
    </form>
  );
};

export default CourseFormComponent;
