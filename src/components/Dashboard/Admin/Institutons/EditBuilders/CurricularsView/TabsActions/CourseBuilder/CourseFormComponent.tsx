import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Storage from '@aws-amplify/storage';
import React, {useContext, useEffect, useState} from 'react';
import {IoImage} from 'react-icons/io5';
import {useHistory, useLocation, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from '@contexts/GlobalContext';
import * as customMutations from '@customGraphql/customMutations';
import * as customQueries from '@customGraphql/customQueries';
import useDictionary from '@customHooks/dictionary';
import * as mutation from '@graphql/mutations';
import * as queries from '@graphql/queries';
import {languageList} from '@utilities/staticData';
import Buttons from '@atoms/Buttons';
import FormInput from '@atoms/Form/FormInput';
import MultipleSelector from '@atoms/Form/MultipleSelector';
import Selector from '@atoms/Form/Selector';
import TextArea from '@atoms/Form/TextArea';
import DroppableMedia from '@molecules/DroppableMedia';
import ProfileCropModal from '@components/Dashboard/Profile/ProfileCropModal';
import {getImageFromS3} from '@utilities/services';

interface CourseBuilderProps {
  courseId: string;
  courseData: any;
}

interface ICourseForm {
  name: string;
  description: string;
  summary: string;
  objectives: string;
  type?: string;
  languages: {id: string; name: string; value: string}[];
  institute: {
    id: string;
  };
}
const CourseFormComponent = ({courseId, courseData}: CourseBuilderProps) => {
  const initialData: ICourseForm = {
    name: '',
    description: '',
    objectives: '',
    summary: '',
    type: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    institute: {
      id: '',
    },
  };
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const [institutionList, setInstitutionList] = useState(null);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [curricularData, setCurricularData] = useState<ICourseForm>(initialData);
  const [fileObj, setFileObj] = useState({});

  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState(null);
  const [error, setError] = useState({
    show: true,
    errorMsg: '',
  });
  const [loading, setIsLoading] = useState(false);
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {CurricularBuilderdict, BreadcrumsTitles} = useDictionary(clientKey);
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false,
  });
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const onChange = (e: any) => {
    setCurricularData({
      ...curricularData,
      [e.target.name]: e.target.value,
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false,
      });
    }
  };

  // Temporary List
  //*******//
  const typeList = [
    {id: 0, name: 'In-School Programming'},
    {id: 1, name: 'After-School Programming'},
    {id: 2, name: 'Summer Intensives (2 week programming)'},
    {id: 3, name: "Writer's Retreat"},
  ];
  //*****//

  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = curricularData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setCurricularData({
      ...curricularData,
      languages: updatedList,
    });
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

  const saveCourse = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = curricularData.languages.map(
          (item: {value: string}) => item.value
        );
        const designers = selectedDesigners.map((item) => item.id);
        let input: any = {
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          type: curricularData.type,
          summary: curricularData.summary,
          objectives: [curricularData.objectives],
          languages: languagesCode,
          designers,
          image: null as any,
        };
        if (courseId) {
          input.id = courseId;
          input.image = courseData.image;
          if (s3Image) {
            await uploadImageToS3(s3Image, courseId, 'image/jpeg');
            input = {
              ...input,
              image: `instituteImages/curricular_image_${courseId}`,
            };
          }
          console.log(input, 'inputinput');

          await API.graphql(graphqlOperation(mutation.updateCurriculum, {input}));
          history.push(
            `${match.url}?step=unit_manager&institutionId=${curricularData.institute.id}`
          );
        } else {
          const response: any = await API.graphql(
            graphqlOperation(customMutations.createCurriculum, {input: input})
          );
          const newCourse: any = response?.data?.createCurriculum;

          if (s3Image) {
            await uploadImageToS3(s3Image, newCourse.id, 'image/jpeg');
            await API.graphql(
              graphqlOperation(mutation.updateCurriculum, {
                input: {
                  id: newCourse.id,
                  image: `instituteImages/curricular_image_${newCourse.id}`,
                },
              })
            );
          }
          history.push(
            `${match.url}/${newCourse.id}?step=unit_manager&institutionId=${curricularData.institute.id}`
          );
        }
        // const response: any = await API.graphql(
        //   graphqlOperation(customMutations.createCurriculum, {input: input})
        // );
        // const newCurricular: any = response?.data?.createCurriculum;

        // if (s3Image) {
        //   await uploadImageToS3(s3Image, newCurricular.id, 'image/jpeg');
        //   await API.graphql(
        //     graphqlOperation(mutation.updateCurriculum, {
        //       input: {
        //         id: newCurricular.id,
        //         image: `instituteImages/curricular_image_${newCurricular.id}`,
        //       },
        //     })
        //   );
        // }
        // setMessages({
        //   show: true,
        //   message: CurricularBuilderdict[userLanguage]['messages']['success']['save'],
        //   isError: false,
        // });
        // setCurricularData(initialData);
        // setIsLoading(false);
        // if (newCurricular?.id) {
        //   history.push(
        //     `/dashboard/manage-institutions/${curricularData.institute.id}/curricular/${newCurricular.id}/syllabus/add`
        //   );
        // }
      } catch (error) {
        console.log(error, 'inside catch');
        setMessages({
          show: true,
          message: CurricularBuilderdict[userLanguage]['messages']['error']['save'],
          isError: true,
        });
      }
    }
  };

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listPersons, {
          filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]},
        })
      );
      const savedData = result.data.listPersons;
      const updatedList = savedData?.items.map(
        (item: {id: string; firstName: string; lastName: string}) => ({
          id: item?.id,
          name: `${item?.firstName || ''} ${item.lastName || ''}`,
          value: `${item?.firstName || ''} ${item.lastName || ''}`,
        })
      );
      setDesignersList(updatedList);
    } catch {
      setMessages({
        show: true,
        message: CurricularBuilderdict[userLanguage]['messages']['error']['designerlist'],
        isError: true,
      });
    }
  };

  const checkUniqCurricularName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurriculums, {
          filter: {
            institutionID: {eq: curricularData.institute.id},
            name: {eq: curricularData.name},
          },
        })
      );
      return list.data.listCurriculums.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: CurricularBuilderdict[userLanguage]['messages']['error']['process'],
        isError: true,
      });
    }
  };

  const validateForm = async () => {
    if (curricularData.name.trim() === '') {
      setMessages({
        show: true,
        message: CurricularBuilderdict[userLanguage]['messages']['validation']['name'],
        isError: true,
      });
      return false;
    } else if (curricularData.institute.id === '') {
      setMessages({
        show: true,
        message:
          CurricularBuilderdict[userLanguage]['messages']['validation']['institute'],
        isError: true,
      });
      return false;
    } else if (
      curricularData.name.trim() !== '' &&
      courseData.name !== curricularData.name
    ) {
      const isUniq = await checkUniqCurricularName();
      if (!isUniq) {
        setMessages({
          show: true,
          message:
            CurricularBuilderdict[userLanguage]['messages']['validation']['curricular'],
          isError: true,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const toggleCropper = () => {
    setShowCropper(!showCropper);
  };

  const saveCroppedImage = async (image: string) => {
    setImageLoading(true);
    toggleCropper();
    setS3Image(image ? image : fileObj);
    const imageUrl = URL.createObjectURL(image ? image : fileObj);
    setImageUrl(imageUrl);
    toggleCropper();
    setImageLoading(false);
  };

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`instituteImages/curricular_image_${id}`, file, {
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
            errorMsg: 'Unable to upload image. Please try again later. ',
          });
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  useEffect(() => {
    fetchPersonsList();
  }, []);

  useEffect(() => {
    if (designersList?.length && courseData.designers?.length) {
      const designers = [...courseData.designers].map((desID: string) => {
        const personData = designersList.find((per) => per.id === desID);
        const personObj = {
          id: personData?.id,
          name: personData?.name,
          value: personData?.name,
        };
        return personObj;
      });
      setSelectedDesigners(designers);
    }
  }, [designersList, courseData.designers]);

  useEffect(() => {
    async function setFormData() {
      if (courseData.id) {
        setCurricularData({
          name: courseData.name,
          type: courseData.type,
          summary: courseData.summary,
          description: courseData.description,
          objectives: courseData.objectives[0],
          institute: {
            id: courseData.institution.id,
          },
          languages: languageList.filter((item) =>
            courseData.languages.includes(item.value)
          ),
        });
      } else {
        setCurricularData((prevData) => ({
          ...prevData,
          institute: {
            id: courseData.institution.id,
          },
        }));
      }
      const imageUrl: any = courseData.image
        ? await getImageFromS3(`instituteImages/curricular_image_${courseId}`)
        : null;
      setImageUrl(imageUrl);
    }
    setFormData();
  }, [courseData]);

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

  const {
    name,
    description,
    objectives,
    languages,
    type,
    institute,
    summary,
  } = curricularData;
  return (
    <div className="">
      <div className="w-9/10 m-auto">
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-auto p-4 mr-6 flex flex-col text-center items-center">
            <button className="group hover:opacity-80 focus:outline-none focus:opacity-95 flex flex-col items-center mt-4">
              <label className="cursor-pointer flex justify-center">
                <DroppableMedia
                  mediaRef={mediaRef}
                  setImage={(img: any, file: any) => {
                    setUpImage(img);
                    setFileObj(file);
                  }}
                  toggleCropper={toggleCropper}>
                  {imageUrl ? (
                    <img
                      onClick={handleImage}
                      className={`profile  w-120 h-80 md:w-120 md:h-80 border flex flex-shrink-0 border-gray-400`}
                      src={imageUrl}
                    />
                  ) : (
                    <div
                      onClick={handleImage}
                      className={`profile justify-center align-center items-center content-center w-80 h-80 md:w-80 md:h-80 bg-gray-100 border flex-shrink-0 flex border-gray-400`}>
                      <IoImage className="fill-current text-gray-80" size={32} />
                    </div>
                  )}
                </DroppableMedia>
              </label>
            </button>
            <p className="text-gray-600 my-4">Click to add curricular image</p>
          </div>
          <div className="h-9/10 md:flex-row">
            <div className="px-3 py-4">
              <FormInput
                value={name}
                id="curricularName"
                onChange={onChange}
                name="name"
                label={CurricularBuilderdict[userLanguage]['NAME']}
                isRequired
              />
            </div>

            {/*
             **
             * Hide institution drop down since all the things are tied to the
             * Institute, will add this later if need to add builders saperately.
             */}
            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div> */}

            <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                {CurricularBuilderdict[userLanguage]['LANGUAGE']}
              </label>
              <MultipleSelector
                selectedItems={languages}
                placeholder={CurricularBuilderdict[userLanguage]['LANGUAGE']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>

            <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                {CurricularBuilderdict[userLanguage]['DESIGNER']}
              </label>
              <MultipleSelector
                selectedItems={selectedDesigners}
                placeholder={CurricularBuilderdict[userLanguage]['DESIGNER']}
                list={designersList}
                onChange={selectDesigner}
              />
            </div>
            <div className="px-3 py-4">
              <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                {CurricularBuilderdict[userLanguage]['TYPE']}
              </label>
              <Selector
                placeholder={CurricularBuilderdict[userLanguage]['TYPE']}
                list={typeList}
                onChange={(str: any, name: string) => {
                  setCurricularData({...curricularData, type: name});
                }}
                selectedItem={type || CurricularBuilderdict[userLanguage]['TYPE']}
              />
            </div>
            <div className="px-3 py-4">
              <TextArea
                value={summary}
                id="summary"
                onChange={onChange}
                name="summary"
                label={CurricularBuilderdict[userLanguage]['SUMMARY']}
              />
            </div>

            <div className="px-3 py-4">
              <TextArea
                value={description}
                id="description"
                onChange={onChange}
                name="description"
                label={CurricularBuilderdict[userLanguage]['DESCRIPTION']}
              />
            </div>
            <div className="px-3 py-4">
              <TextArea
                value={objectives}
                id="objectives"
                onChange={onChange}
                name="objectives"
                label={CurricularBuilderdict[userLanguage]['OBJECT']}
              />
            </div>
          </div>
        </div>
      </div>
      {messages.show ? (
        <div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
            {messages.message && messages.message}
          </p>
        </div>
      ) : null}
      <div className="flex my-8 justify-center">
        <Buttons
          btnClass="py-3 px-12 text-sm"
          label={
            loading
              ? CurricularBuilderdict[userLanguage]['BUTTON']['SAVING']
              : CurricularBuilderdict[userLanguage]['BUTTON']['SAVE']
          }
          onClick={saveCourse}
          disabled={loading ? true : false}
        />
      </div>
      {/* Image cropper */}
      {showCropper && (
        <ProfileCropModal
          upImg={upImage}
          customCropProps={{x: 25, y: 25, width: 480, height: 320}}
          locked
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}
      {/* </PageWrapper> */}
    </div>
  );
};

export default CourseFormComponent;
