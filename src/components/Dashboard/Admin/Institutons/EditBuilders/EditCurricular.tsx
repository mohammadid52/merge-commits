import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useLocation, useParams} from 'react-router-dom';
import {IoArrowUndoCircleOutline, IoImage} from 'react-icons/io5';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutation from 'graphql/mutations';
import * as queries from 'graphql/queries';
import ProfileCropModal from '../../../Profile/ProfileCropModal';

import {languageList} from 'utilities/staticData';
import SectionTitle from 'atoms/SectionTitle';
import PageWrapper from 'atoms/PageWrapper';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import Selector from 'atoms/Form/Selector';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import TextArea from 'atoms/Form/TextArea';
import {getImageFromS3} from 'utilities/services';
import useDictionary from 'customHooks/dictionary';
import {GlobalContext} from 'contexts/GlobalContext';
import {LessonEditDict} from 'dictionary/dictionary.iconoclast';
import ModalPopUp from 'molecules/ModalPopUp';
import {goBackBreadCrumb} from 'utilities/functions';
import DroppableMedia from 'molecules/DroppableMedia';

interface EditCurricularProps {
  closeAction: () => void;
  curricularDetails: any;
  postUpdateDetails: (data: any) => void;
}

const EditCurricular = (props: EditCurricularProps) => {
  const {closeAction, curricularDetails, postUpdateDetails} = props;
  const initialData = {
    id: '',
    name: '',
    description: '',
    summary: '',
    type: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    objectives: '',
    institute: {
      id: '',
      name: '',
      value: ''
    }
  };
  const history = useHistory();
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState(null);
  const [curricularData, setCurricularData] = useState(initialData);
  const [designerIds, setDesignerIds] = useState([]);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [previousName, setPreviousName] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState(null);
  const [fileObj, setFileObj] = useState({});

  const [error, setError] = useState({
    show: true,
    errorMsg: ''
  });

  const [saving, setSaving] = useState(false);

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const param: any = useParams();

  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const {BreadcrumsTitles, EditCurriculardict} = useDictionary(clientKey);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE']
  });

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false
    },
    {
      title: curricularData.institute?.name,
      url: `/dashboard/manage-institutions/institution/${param.institutionId}/staff`,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
      goBack: true,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['EDITCURRICULUM'],
      url: `/dashboard/manage-institutions/curricular/edit?id=${params.get('id')}`,
      last: true
    }
  ];

  const onModalSave = () => {
    toggleModal();
    history.goBack();
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    });
  };

  const goBack = () => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      goBackBreadCrumb(breadCrumsList, history);
    }
  };

  const onChange = (e: any) => {
    setCurricularData({
      ...curricularData,
      [e.target.name]: e.target.value
    });
    setUnsavedChanges(true);
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
  };
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = curricularData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setUnsavedChanges(true);

    setCurricularData({
      ...curricularData,
      languages: updatedList
    });
  };

  const selectInstitute = (val: string, name: string, id: string) => {
    setCurricularData({
      ...curricularData,
      institute: {
        id: id,
        name: name,
        value: val
      }
    });
    setUnsavedChanges(true);

    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
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
    setUnsavedChanges(true);

    setSelectedDesigners(updatedList);
  };

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listPersons, {
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
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['fetcherr'],
        isError: true
      });
    }
  };
  const saveCurriculum = async () => {
    const isValid = await validateForm();
    if (isValid) {
      setSaving(true);
      try {
        const languagesCode = curricularData.languages.map(
          (item: {value: string}) => item.value
        );
        const designers = selectedDesigners.map((item) => item.id);
        let input = {
          id: curricularData.id,
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          type: curricularData.type,
          summary: curricularData.summary,
          objectives: [curricularData.objectives],
          languages: languagesCode,
          designers: designers,
          image: curricularDetails.image
        };

        if (s3Image) {
          await uploadImageToS3(s3Image, curricularData.id, 'image/jpeg');
          input = {
            ...input,
            image: `instituteImages/curricular_image_${curricularData.id}`
          };
        }

        const newCurricular: any = await API.graphql(
          graphqlOperation(mutation.updateCurriculum, {input: input})
        );

        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['curricularchange'],
          isError: false
        });
        setSaving(false);
        setUnsavedChanges(false);
        postUpdateDetails(newCurricular?.data?.updateCurriculum);
      } catch {
        setSaving(false);
        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['updateerror'],
          isError: true
        });
      }
    }
  };

  const getInstitutionList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listInstitutions));
      const sortedList = list.data.listInstitutions?.items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      const InstituteList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name || ''}`,
        value: `${item.name || ''}`
      }));
      setInstitutionList(InstituteList);
    } catch {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['unablefetch'],
        isError: true
      });
    }
  };

  const checkUniqCurricularName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurricula, {
          filter: {
            institutionID: {eq: curricularData.institute.id},
            name: {eq: curricularData.name}
          }
        })
      );
      return list.data.listCurricula.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['processerr'],
        isError: true
      });
    }
  };

  const validateForm = async () => {
    if (curricularData.name.trim() === '') {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['namerequired'],
        isError: true
      });
      return false;
    } else if (curricularData.institute.id === '') {
      setMessages({
        show: true,
        message: EditCurriculardict[userLanguage]['messages']['selectinstitute'],
        isError: true
      });
      return false;
    } else if (
      curricularData.name.trim() !== '' &&
      previousName !== curricularData.name
    ) {
      const isUniq = await checkUniqCurricularName();
      if (!isUniq) {
        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['nameexist'],
          isError: true
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  // This function will be removed. Will get data from props.
  // will create parent for curricular view and this edit page.

  const fetchCurricularData = async () => {
    const currID = params.get('id');
    if (currID) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(queries.getCurriculum, {id: currID})
        );
        const savedData = result.data.getCurriculum;
        console.log(savedData, 'savedData');

        setCurricularData({
          ...curricularData,
          id: savedData.id,
          name: savedData.name,
          type: savedData.type,
          summary: savedData.summary,
          institute: {
            id: savedData.institution.id,
            name: savedData.institution.name,
            value: savedData.institution.name
          },
          description: savedData.description,
          objectives: savedData.objectives[0],
          languages: languageList.filter((item) =>
            savedData.languages.includes(item.value)
          )
        });
        // Load from response value
        const imageUrl: any = savedData.image
          ? await getImageFromS3(`instituteImages/curricular_image_${currID}`)
          : null;
        setImageUrl(imageUrl);

        if (savedData && savedData.designers && savedData.designers.length) {
          setDesignerIds([...savedData?.designers]);
        }
        setPreviousName(savedData.name);
      } catch (err) {
        console.log('err', err);
        setMessages({
          show: true,
          message: EditCurriculardict[userLanguage]['messages']['fetchinger'],
          isError: true
        });
      }
    } else {
      history.push('/dashboard/manage-institutions');
    }
  };

  useEffect(() => {
    // fetchCurricularData();
    getInstitutionList();
    fetchPersonsList();
  }, []);

  useEffect(() => {
    console.log(languageList, 'languageList');

    async function mapData() {
      setCurricularData({
        ...curricularData,
        id: curricularDetails.id,
        name: curricularDetails.name,
        type: curricularDetails.type,
        summary: curricularDetails.summary,
        institute: curricularDetails.institute,
        description: curricularDetails.description,
        objectives: curricularDetails.objectives[0],
        languages: curricularDetails.languages
      });
      // Load from response value
      const imageUrl: any = curricularDetails.image
        ? await getImageFromS3(`instituteImages/curricular_image_${curricularDetails.id}`)
        : null;
      setImageUrl(imageUrl);

      if (
        curricularDetails &&
        curricularDetails.designers &&
        curricularDetails.designers.length
      ) {
        setDesignerIds([...curricularDetails?.designers]);
      }
      setPreviousName(curricularDetails.name);
    }
    mapData();
  }, [curricularDetails]);

  useEffect(() => {
    if (designersList && Array.isArray(designersList) && designersList.length > 0) {
      const designers = [...designerIds].map((desID: string) => {
        const personData = designersList.find((per) => per.id === desID);
        const personObj = {
          id: personData?.id,
          name: personData?.name,
          value: personData?.name
        };
        return personObj;
      });
      setSelectedDesigners(designers);
    }
  }, [designersList, designerIds]);

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

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`instituteImages/curricular_image_${id}`, file, {
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
            errorMsg: 'Unable to upload image. Please try again later. '
          });
          console.log('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const mediaRef = React.useRef(null);
  const handleImage = () => mediaRef?.current?.click();

  // Temporary List
  //*******//
  const typeList = [
    {id: 0, name: 'In-School Programming'},
    {id: 1, name: 'After-School Programming'},
    {id: 2, name: 'Summer Intensives (2 week programming)'},
    {id: 3, name: "Writer's Retreat"}
  ];
  //*****//

  const {
    name,
    description,
    objectives,
    type,
    languages,
    summary,
    institute
  } = curricularData;
  return (
    <div className="min-w-256">
      {/* Section Header */}
      {/* <BreadCrums unsavedChanges={unsavedChanges} toggleModal={toggleModal} items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={EditCurriculardict[userLanguage]['TITLE']}
          subtitle={EditCurriculardict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div> */}

      {/* Body section */}
      {/* <PageWrapper> */}
      <div className="w-full m-auto">
        {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
          {EditCurriculardict[userLanguage]['HEADING']}
        </h3> */}
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
            <p className="text-sm text-gray-600 my-4">Click to edit curricular image</p>
          </div>
          <div className="h-6/10 md:flex-row">
            <div className="px-3 py-4">
              <FormInput
                value={name}
                id="curricularName"
                onChange={onChange}
                name="name"
                label={EditCurriculardict[userLanguage]['NAME']}
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
                {EditCurriculardict[userLanguage]['LANGUAGE']}
              </label>
              <MultipleSelector
                selectedItems={languages}
                placeholder={EditCurriculardict[userLanguage]['LANGUAGE']}
                list={languageList}
                onChange={selectLanguage}
              />
            </div>
            <div className="grid grid-cols-2">
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {EditCurriculardict[userLanguage]['DESIGNER']}
                </label>
                <MultipleSelector
                  selectedItems={selectedDesigners}
                  placeholder={EditCurriculardict[userLanguage]['DESIGNER']}
                  list={designersList}
                  onChange={selectDesigner}
                />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {EditCurriculardict[userLanguage]['TYPE']}
                </label>
                <Selector
                  placeholder={EditCurriculardict[userLanguage]['TYPE']}
                  list={typeList}
                  onChange={(str: any, name: string) => {
                    setCurricularData({...curricularData, type: name});
                  }}
                  selectedItem={type || EditCurriculardict[userLanguage]['TYPE']}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 py-4">
          <TextArea
            value={summary}
            id="summary"
            onChange={onChange}
            name="summary"
            label={EditCurriculardict[userLanguage]['SUMMARY']}
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="px-3 py-4">
            <TextArea
              value={description}
              id="description"
              onChange={onChange}
              name="description"
              label={EditCurriculardict[userLanguage]['DESCRIPTION']}
            />
          </div>
          <div className="px-3 py-4">
            <TextArea
              value={objectives}
              id="objectives"
              onChange={onChange}
              name="objectives"
              label={EditCurriculardict[userLanguage]['OBJECTIVE']}
            />
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
      <div className="flex my-4 justify-center">
        <Buttons
          btnClass="py-3 px-12 text-sm mr-4"
          label="Cancel"
          onClick={closeAction}
          transparent
        />
        <Buttons
          disabled={saving ? true : false}
          btnClass="py-3 px-12 text-sm ml-4"
          label={
            saving ? 'Saving...' : EditCurriculardict[userLanguage]['BUTTON']['SAVE']
          }
          onClick={saveCurriculum}
        />
      </div>
      {showCropper && (
        <ProfileCropModal
          upImg={upImage}
          locked
          customCropProps={{x: 25, y: 25, width: 480, height: 320}}
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      )}
      {warnModal.show && (
        <ModalPopUp
          closeAction={toggleModal}
          saveAction={onModalSave}
          saveLabel="Yes"
          message={warnModal.message}
        />
      )}
      {/* </PageWrapper> */}
    </div>
  );
};

export default EditCurricular;
