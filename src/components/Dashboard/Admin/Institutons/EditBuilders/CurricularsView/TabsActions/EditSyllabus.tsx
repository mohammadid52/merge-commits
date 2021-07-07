import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useLocation, useParams} from 'react-router';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import API, {graphqlOperation} from '@aws-amplify/api';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import find from 'lodash/find';

import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';
import Selector from '../../../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import {languageList, statusList} from '../../../../../../../utilities/staticData';
import {reorder, getLessonType} from '../../../../../../../utilities/strings';

// TODO: Check wether mutations and queries are needed for fetching all the data or not.
import * as mutations from '../../../../../../../graphql/mutations';
import * as queries from '../../../../../../../graphql/queries';
import * as customQueries from '../../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../../customGraphql/customMutations';
import {getAsset} from '../../../../../../../assets';
import {GlobalContext} from '../../../../../../../contexts/GlobalContext';
import ModalPopUp from '../../../../../../Molecules/ModalPopUp';
import useDictionary from '../../../../../../../customHooks/dictionary';
import Tooltip from '../../../../../../Atoms/Tooltip';
import findIndex from 'lodash/findIndex';

interface EditSyllabusProps {}
interface InitialData {
  name: string;
  description: string;
  methodology: string;
  policies: string;
  purpose: string;
  objectives: string;
  languages: {id: string; name: string; value: string}[];
}

interface UIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const EditSyllabus = (props: EditSyllabusProps) => {
  const {} = props;
  const history = useHistory();
  const location = useLocation();

  const {clientKey, theme, userLanguage} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {EditSyllabusDict, BreadcrumsTitles} = useDictionary(clientKey);

  const initialData = {
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
  };
  const [syllabusData, setSyllabusData] = useState<InitialData>(initialData);
  const [loading, setLoading] = useState(false);

  const [designerIds, setDesignerIds] = useState([]);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: EditSyllabusDict[userLanguage]['messages']['wantsave'],
  });
  const [messages, setMessages] = useState<UIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false,
  });

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const urlParams: any = useParams();

  const syllabusId = params.get('id');
  const curricularId = urlParams.curricularId;
  const institutionId = urlParams.institutionId;

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_INFO'],
      url: `/dashboard/manage-institutions/institution?id=${institutionId}`,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['CURRICULUMBUILDER'],
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`,
      last: false,
    },

    {
      title: BreadcrumsTitles[userLanguage]['UnitBuilder'],
      url: `/dashboard/manage-institutions/${institutionId}/curricular/${curricularId}/syllabus/edit?id=${syllabusId}`,
      last: true,
    },
  ];


  const onInputChange = (e: any) => {
    setSyllabusData({
      ...syllabusData,
      [e.target.name]: e.target.value,
    });
    if (!unsavedChanges) {
      setUnsavedChanges(true);
    }
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false,
      });
    }
  };
  const selectLanguage = (id: string, name: string, value: string) => {
    let updatedList;
    const currentLanguages = syllabusData.languages;
    const selectedItem = currentLanguages.find((item) => item.id === id);
    if (!selectedItem) {
      updatedList = [...currentLanguages, {id, name, value}];
    } else {
      updatedList = currentLanguages.filter((item) => item.id !== id);
    }
    setSyllabusData({
      ...syllabusData,
      languages: updatedList,
    });
    if (!unsavedChanges) {
      setUnsavedChanges(true);
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
    setSelectedDesigners(updatedList);
    if (!unsavedChanges) {
      setUnsavedChanges(true);
    }
  };


  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const languagesCode = syllabusData.languages.map(
          (item: {value: string}) => item.value
        );
        const designers = selectedDesigners.map((item) => item.id);
        const input = {
          id: syllabusId,
          name: syllabusData.name,
          curriculumID: curricularId,
          description: syllabusData.description,
          methodology: syllabusData.methodology,
          policies: syllabusData.policies,
          pupose: syllabusData.purpose,
          objectives: syllabusData.objectives,
          languages: languagesCode,
          designers: designers,
        };
        const newSyllabus = await API.graphql(
          graphqlOperation(mutations.updateSyllabus, {input: input})
        );
        setMessages({
          show: true,
          message: EditSyllabusDict[userLanguage]['messages']['unitupdate'],
          isError: false,
        });
        setSyllabusData(initialData);
        setLoading(false);
        return true;
      } catch {
        setMessages({
          show: true,
          message: EditSyllabusDict[userLanguage]['messages']['unableupdate'],
          isError: true,
        });
        return false;
      }
    }
  };
  const validateForm = async () => {
    if (syllabusData.name.trim() === '') {
      setMessages({
        show: true,
        message: EditSyllabusDict[userLanguage]['messages']['namerequired'],
        isError: true,
      });
      return false;
    }
    //  TODO: Need to confirm that syllabus name should be uniq or not?

    // else if (syllabusData.name.trim() !== '') {
    //   const isUniq = await checkUniqSyllabusName()
    //   if (!isUniq) {
    //     setMessages({
    //       show: true,
    //       message: 'This syllabus name is already exist, please add another name.',
    //       isError: true
    //     })
    //     return false;
    //   } else {
    //     return true
    //   }
    // }
    else {
      return true;
    }
  };

  const fetchSyllabusData = async () => {
    if (syllabusId) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(queries.getUniversalSyllabus, {id: syllabusId})
        );
        const savedData = result.data.getUniversalSyllabus;
        setSyllabusData({
          ...syllabusData,
          name: savedData.name,
          languages: languageList.filter((item) =>
            savedData.languages.includes(item.value)
          ),
          description: savedData.description,
          objectives: savedData.objectives,
          purpose: savedData.pupose,
          methodology: savedData.methodology,
          policies: savedData.policies,
        });
        if (savedData.designers) {
          setDesignerIds([...savedData?.designers]);
        }
      } catch (err) {
        console.log('err', err);
        setMessages({
          show: true,
          message: EditSyllabusDict[userLanguage]['messages']['fetcher'],
          isError: true,
        });
      }
    } else {
      console.log('can not find unit id');
      history.push('/dashboard/manage-institutions');
    }
  };

  const fetchPersonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: {or: [{role: {eq: 'TR'}}, {role: {eq: 'BLD'}}]},
          limit: 300
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
        message: EditSyllabusDict[userLanguage]['messages']['fetchdesign'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const backtoPreviousStep = () => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        show: true,
        lessonEdit: true,
      });
    } else {
      history.goBack();
    }
  };

  useEffect(() => {
    Promise.all([fetchPersonsList()])
      .then(() => fetchSyllabusData())
      .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    if (designersList && designersList.length > 0) {
      const designers = [...designerIds].map((desID: string) => {
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
  }, [designersList, designerIds]);

  const {
    name,
    languages,
    description,
    purpose,
    objectives,
    methodology,
    policies,
  } = syllabusData;

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        items={breadCrumsList}
        unsavedChanges={unsavedChanges}
        toggleModal={() => {
          setWarnModal({
            ...warnModal,
            show: !warnModal.show,
          });
        }}
      />
      <div className="flex justify-between">
        <SectionTitle
          title={EditSyllabusDict[userLanguage]['title']}
          subtitle={EditSyllabusDict[userLanguage]['subtitle']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go Back"
            btnClass="mr-4"
            onClick={backtoPreviousStep}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className="bg-white shadow-5 sm:rounded-lg mb-4">
              <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  {EditSyllabusDict[userLanguage]['heading']}
                </h3>
              </div>
              <div className="w-9/10 m-auto p-4">
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <FormInput
                      value={name}
                      id="name"
                      onChange={onInputChange}
                      name="name"
                      label={EditSyllabusDict[userLanguage]['unitname']}
                      isRequired
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      {EditSyllabusDict[userLanguage]['designer']}
                    </label>
                    <MultipleSelector
                      selectedItems={selectedDesigners}
                      placeholder={EditSyllabusDict[userLanguage]['pdesigner']}
                      list={designersList}
                      onChange={selectDesigner}
                    />
                  </div>
                </div>
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                      {EditSyllabusDict[userLanguage]['selectlang']}
                    </label>
                    <MultipleSelector
                      selectedItems={languages}
                      placeholder={EditSyllabusDict[userLanguage]['language']}
                      list={languageList}
                      onChange={selectLanguage}
                    />
                  </div>
                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea
                      value={description}
                      rows={5}
                      id="description"
                      onChange={onInputChange}
                      name="description"
                      label={EditSyllabusDict[userLanguage]['desc']}
                    />
                  </div>
                  <div>
                    <TextArea
                      value={purpose}
                      rows={5}
                      id="purpose"
                      onChange={onInputChange}
                      name="purpose"
                      label={EditSyllabusDict[userLanguage]['purpose']}
                    />
                  </div>
                </div>

                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea
                      value={objectives}
                      rows={5}
                      id="objectives"
                      onChange={onInputChange}
                      name="objectives"
                      label={EditSyllabusDict[userLanguage]['objective']}
                    />
                  </div>
                  <div>
                    <TextArea
                      value={methodology}
                      rows={5}
                      id="methodology"
                      onChange={onInputChange}
                      name="methodology"
                      label={EditSyllabusDict[userLanguage]['methodology']}
                    />
                  </div>
                </div>
                <div className="px-3 py-4 grid gap-x-6 grid-cols-2">
                  <div>
                    <TextArea
                      value={policies}
                      rows={5}
                      id="policies"
                      onChange={onInputChange}
                      name="policies"
                      label={EditSyllabusDict[userLanguage]['policy']}
                    />
                  </div>
                </div>
                {messages.show && !messages.lessonError ? (
                  <div className="py-2 m-auto text-center">
                    <p
                      className={`${
                        messages.isError ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {messages.message && messages.message}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default EditSyllabus;
