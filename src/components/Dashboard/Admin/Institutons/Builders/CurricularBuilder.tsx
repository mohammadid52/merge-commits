import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useAuth from '@customHooks/useAuth';
import {
  checkUniqCurricularName,
  getInstitutionList,
  uploadImageToS3
} from 'graphql-functions/functions';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import TextArea from 'atoms/Form/TextArea';
import PageWrapper from 'atoms/PageWrapper';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as mutation from 'graphql/mutations';
import DroppableMedia from 'molecules/DroppableMedia';
import React, {useEffect, useState} from 'react';
import {IoImage} from 'react-icons/io5';
import {useHistory, useLocation} from 'react-router-dom';
import {languageList, schooltypeList} from 'utilities/staticData';
import ProfileCropModal from 'components/Dashboard/Profile/ProfileCropModal';

interface InitialData {
  id: string;
  name: string;
  description: string;
  summary: string;
  objectives: string;
  type?: string;
  languages: {id: string; name: string; value: string}[];
  institute: {
    id: string;
    name: string;
    value: string;
  };
}
const CurricularBuilder = () => {
  const initialData = {
    id: '',
    name: '',
    description: '',
    objectives: '',
    summary: '',
    type: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    institute: {
      id: '',
      name: '',
      value: ''
    }
  };
  const history = useHistory();
  const location = useLocation();
  const [institutionList, setInstitutionList] = useState<any[] | null>(null);
  const [designersList, setDesignersList] = useState<any[]>([]);
  const [selectedDesigners, setSelectedDesigners] = useState<any[]>([]);
  const [curricularData, setCurricularData] = useState<InitialData>(initialData);
  const [fileObj, setFileObj] = useState({});

  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState<null | string>(null);
  const [_, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [s3Image, setS3Image] = useState<any | null>(null);

  const [loading, setIsLoading] = useState(false);
  const {userLanguage} = useGlobalContext();
  const {CurricularBuilderdict, BreadcrumsTitles} = useDictionary();
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      href: '/dashboard/manage-institutions',
      last: false
    },
    {title: curricularData.institute?.name, goBack: true, last: false},
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULARBUILDER'],
      href: `/dashboard/manage-institutions/institution/curricular-creation?id=${params.get(
        'id'
      )}`,
      last: true
    }
  ];

  const onChange = (e: any) => {
    setCurricularData({
      ...curricularData,
      [e.target.name]: e.target.value
    });
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
  };

  // Temporary List
  //*******//

  //*****//

  const selectLanguage = (_: string[], option: any) => {
    setCurricularData({
      ...curricularData,
      languages: option
    });
  };
  const selectDesigner = (_: string[], option: any) => {
    setSelectedDesigners(option);
  };

  const saveCurriculum = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = curricularData.languages.map(
          (item: {value: string}) => item.value
        );
        const designers = selectedDesigners.map((item) => item.id);
        const input = {
          name: curricularData.name,
          institutionID: curricularData.institute.id,
          description: curricularData.description,
          type: curricularData.type,
          summary: curricularData.summary,
          objectives: [curricularData.objectives],
          languages: languagesCode,
          designers,
          image: null as any
        };

        const response: any = await API.graphql(
          graphqlOperation(customMutations.createCurriculum, {input: input})
        );
        const newCurricular: any = response?.data?.createCurriculum;

        if (s3Image) {
          await _uploadImageToS3(s3Image, newCurricular.id, 'image/jpeg');
          await API.graphql(
            graphqlOperation(mutation.updateCurriculum, {
              input: {
                id: newCurricular.id,
                image: `instituteImages/curricular_image_${newCurricular.id}`
              }
            })
          );
        }

        setMessages({
          show: true,
          message: CurricularBuilderdict[userLanguage]['messages']['success']['save'],
          isError: false
        });
        setCurricularData(initialData);
        setIsLoading(false);
        if (newCurricular?.id) {
          history.push(
            `/dashboard/manage-institutions/${curricularData.institute.id}/curricular/${newCurricular.id}/syllabus/add`
          );
        }
      } catch {
        setMessages({
          show: true,
          message: CurricularBuilderdict[userLanguage]['messages']['error']['save'],
          isError: true
        });
      }
    }
  };

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getStaffsForInstitution, {
          filter: {institutionID: {eq: params.get('id')}}
        })
      );
      const savedData = result.data.listStaff;
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
        message: CurricularBuilderdict[userLanguage]['messages']['error']['designerlist'],
        isError: true
      });
    }
  };

  const validateForm = async () => {
    if (curricularData.name.trim() === '') {
      setMessages({
        show: true,
        message: CurricularBuilderdict[userLanguage]['messages']['validation']['name'],
        isError: true
      });
      return false;
    } else if (curricularData.institute.id === '') {
      setMessages({
        show: true,
        message:
          CurricularBuilderdict[userLanguage]['messages']['validation']['institute'],
        isError: true
      });
      return false;
    } else if (curricularData.name.trim() !== '') {
      const isUniq = await checkUniqCurricularName(
        curricularData.institute.id,
        curricularData.name
      );
      if (!isUniq) {
        setMessages({
          show: true,
          message:
            CurricularBuilderdict[userLanguage]['messages']['validation']['curricular'],
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

  const {authId, email} = useAuth();

  const _uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket
    const key = `instituteImages/curricular_image_${id}`;
    await uploadImageToS3(file, key, type, {auth: {authId, email}});
  };

  const loadInstitution = async () => {
    try {
      const res = await getInstitutionList(authId, email);
      if (res && res.length > 0) {
        setInstitutionList(res);
      }
    } catch (error) {
      setMessages({
        show: true,
        message: CurricularBuilderdict[userLanguage]['messages']['error']['fetch'],
        isError: true
      });
    }
  };

  useEffect(() => {
    const instId = params.get('id');
    if (instId) {
      setCurricularData({
        ...curricularData,
        institute: {
          ...institute,
          id: instId,
          name: '',
          value: ''
        }
      });
      loadInstitution();
      fetchPersonsList();
    } else {
      history.push('/dashboard/manage-institutions');
    }
  }, []);

  useEffect(() => {
    if (curricularData.institute.id) {
      const instName =
        institutionList &&
        institutionList.find(
          (item: {id: string}) => item.id === curricularData.institute.id
        ).name;
      if (instName) {
        setCurricularData({
          ...curricularData,
          institute: {
            ...institute,
            id: curricularData.institute.id,
            name: instName,
            value: instName
          }
        });
      } else {
        setMessages({
          show: true,
          message: CurricularBuilderdict[userLanguage]['messages']['error']['invalid'],
          isError: true
        });
      }
    }
  }, [institutionList]);

  const mediaRef = React.useRef<any>(null);
  const handleImage = () => mediaRef?.current?.click();

  const {name, description, objectives, languages, type, institute, summary} =
    curricularData;
  return (
    <div className="">
      {/* Section Header */}
      {/* @ts-ignore */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitleV3
          title={CurricularBuilderdict[userLanguage]['TITLE']}
          subtitle={CurricularBuilderdict[userLanguage]['SUBTITLE']}
        />
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-9/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-darkest   text-center pb-8 ">
            {CurricularBuilderdict[userLanguage]['HEADING']}
          </h3>
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
                        className={`profile  w-120 h-80 md:w-120 md:h-80 border flex flex-shrink-0 border-light `}
                        src={imageUrl}
                      />
                    ) : (
                      <div
                        onClick={handleImage}
                        className={`profile justify-center align-center items-center content-center w-80 h-80 md:w-80 md:h-80 bg-lightest  border flex-shrink-0 flex border-light `}>
                        <IoImage className="fill-current text-gray-80" size={32} />
                      </div>
                    )}
                  </DroppableMedia>
                </label>
              </button>
              <p className="text-medium  my-4">Click to add curricular image</p>
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

              <div className="px-3 py-4">
                <MultipleSelector
                  label={CurricularBuilderdict[userLanguage]['LANGUAGE']}
                  selectedItems={languages}
                  placeholder={CurricularBuilderdict[userLanguage]['LANGUAGE']}
                  list={languageList}
                  onChange={selectLanguage}
                />
              </div>

              <div className="px-3 py-4">
                <MultipleSelector
                  label={CurricularBuilderdict[userLanguage]['DESIGNER']}
                  selectedItems={selectedDesigners}
                  placeholder={CurricularBuilderdict[userLanguage]['DESIGNER']}
                  list={designersList}
                  onChange={selectDesigner}
                />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-dark   mb-1">
                  {CurricularBuilderdict[userLanguage]['TYPE']}
                </label>
                <Selector
                  placeholder={CurricularBuilderdict[userLanguage]['TYPE']}
                  list={schooltypeList}
                  onChange={(value: string) => {
                    setCurricularData({...curricularData, type: value});
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
              {messages?.message ? messages.message : ''}
            </p>
          </div>
        ) : null}
        <div className="flex my-8 justify-center">
          <Buttons
            label={
              CurricularBuilderdict[userLanguage]['BUTTON'][loading ? 'SAVING' : 'SAVE']
            }
            onClick={saveCurriculum}
            disabled={loading ? true : false}
          />
        </div>
        {/* Image cropper */}

        <ProfileCropModal
          open={showCropper}
          upImg={upImage || ''}
          customCropProps={{x: 25, y: 25, width: 480, height: 320}}
          locked
          saveCroppedImage={(img: string) => saveCroppedImage(img)}
          closeAction={toggleCropper}
        />
      </PageWrapper>
    </div>
  );
};

export default CurricularBuilder;
