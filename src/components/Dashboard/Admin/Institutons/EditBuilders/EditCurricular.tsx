import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {Storage} from '@aws-amplify/storage';
import React, {useEffect, useState} from 'react';
import {IoImage} from 'react-icons/io5';
import {useHistory} from 'react-router-dom';

import * as customQueries from 'customGraphql/customQueries';
import * as mutation from 'graphql/mutations';
import ProfileCropModal from '../../../Profile/ProfileCropModal';

import {useGlobalContext} from '@contexts/GlobalContext';
import {checkUniqCurricularName} from '@graphql/functions';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import TextArea from 'atoms/Form/TextArea';
import useDictionary from 'customHooks/dictionary';
import {LessonEditDict} from 'dictionary/dictionary.iconoclast';
import DroppableMedia from 'molecules/DroppableMedia';
import ModalPopUp from 'molecules/ModalPopUp';
import {getImageFromS3} from 'utilities/services';
import {languageList} from 'utilities/staticData';

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

  const [curricularData, setCurricularData] = useState(initialData);
  const [designerIds, setDesignerIds] = useState<any[]>([]);
  const [designersList, setDesignersList] = useState<any[]>([]);
  const [selectedDesigners, setSelectedDesigners] = useState<any[]>([]);
  const [previousName, setPreviousName] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState<any | null>(null);
  const [_1, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState<any | null>(null);
  const [fileObj, setFileObj] = useState({});

  const [_2, setError] = useState({
    show: true,
    errorMsg: ''
  });

  const [saving, setSaving] = useState(false);

  const {userLanguage} = useGlobalContext();
  const {EditCurriculardict} = useDictionary();

  const [_, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE']
  });

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
      const isUniq = await checkUniqCurricularName(
        curricularData.institute.id,
        curricularData.name
      );
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

  useEffect(() => {
    fetchPersonsList();
  }, []);

  useEffect(() => {
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
        contentEncoding: 'base64'
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
          console.error('Error in uploading file to s3', err);
          reject(err);
        });
    });
  };

  const mediaRef = React.useRef<any>(null);
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

  const {name, description, objectives, type, languages, summary} = curricularData;
  return (
    <div className="min-w-256">
      <div className="w-full m-auto">
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
                  onChange={(_: any, name: string) => {
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
            {messages.message ? messages.message : ''}
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
          upImg={upImage || ''}
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
