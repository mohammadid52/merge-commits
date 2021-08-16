import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useLocation, useParams} from 'react-router';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {FaTrash} from 'react-icons/fa';
import API, {graphqlOperation} from '@aws-amplify/api';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import BreadCrums from '../../../../../../Atoms/BreadCrums';
import SectionTitle from '../../../../../../Atoms/SectionTitle';
import Buttons from '../../../../../../Atoms/Buttons';
import PageWrapper from '../../../../../../Atoms/PageWrapper';
import FormInput from '../../../../../../Atoms/Form/FormInput';
import TextArea from '../../../../../../Atoms/Form/TextArea';
import Selector from '../../../../../../Atoms/Form/Selector';
import MultipleSelector from '../../../../../../Atoms/Form/MultipleSelector';
import Tooltip from '../../../../../../Atoms/Tooltip';
import Loader from '../../../../../../Atoms/Loader';

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
import {fetchDesigners} from '../../../../../../../utilities/utils';
import { DeleteActionBtn } from '../../../../../../Atoms/DeleteActionBtn';

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
  const [loading, setIsLoading] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [editState, setEditState] = useState<{id: string; action?: string}>({
    id: '',
    action: '',
  });
  const [designerIds, setDesignerIds] = useState([]);
  const [designersList, setDesignersList] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [allLessonsList, setAllLessonsList] = useState([]);
  const [dropdownLessonsList, setDropdownLessonsList] = useState([]);
  const [selectedLessonsList, setSelectedLessonsList] = useState([]);
  const [savedLessonsList, setSavedLessonsList] = useState([]);
  const [lessonsIds, setLessonsIds] = useState([]);
  const [sequenceId, setSequenceId] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editLesson, setEditLesson] = useState({
    type: '',
    id: '',
  });
  const [warnModal, setWarnModal] = useState({
    show: false,
    lessonPlan: false,
    lessonEdit: false,
    message: EditSyllabusDict[userLanguage]['messages']['wantsave'],
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {},
  });
  const [selecetedLesson, setSelectedLesson] = useState({
    id: '',
    name: '',
    value: '',
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
    setSyllabusData({...syllabusData, [e.target.name]: e.target.value});
    if (!unsavedChanges) setUnsavedChanges(true);
    if (messages.show) setMessages({show: false, message: '', isError: false});
  };

  const fetchDesignersList = async () => {
    const designers: any = await fetchDesigners();
    setDesignersList(designers);
  };

  const fetchLessonsList = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listUniversalLessonsOptions, {
          filter: {institutionID: {eq: institutionId}},
        })
      );
      const savedData = result.data.listUniversalLessons;
      const sortedList = savedData?.items?.sort((a: any, b: any) =>
        a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
      );

      const updatedList = sortedList
        ?.filter((item: any) => (item.lessonPlan ? true : false))
        .map((item: {id: string; title: string; type: string}) => ({
          id: item.id,
          name: `${item.title} - ${item.type && getLessonType(item.type)}`,
          value: item.title,
        }));
      setAllLessonsList([...sortedList]);
      setDropdownLessonsList([...updatedList]);
    } catch {
      setMessages({
        show: true,
        message: EditSyllabusDict[userLanguage]['messages']['fetchlist'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const fetchSyllabusData = async () => {
    if (syllabusId) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalSyllabus, {
            id: syllabusId,
          })
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
        setLessonsIds(savedData.universalLessonsSeq || []);
        const associatedLessons = savedData.lessons?.items;
        await Promise.all(
          associatedLessons.map(async (lesson: any) => {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.listLessonRubricss, {
                filter: {
                  lessonID: {eq: lesson.lessonID},
                },
              })
            );
            lesson.measurements = result.data?.listLessonRubricss.items;
          })
        );
        const sortedLessonsList = [...savedData.lessons?.items]
          .map((t: any) => {
            let index = savedData.universalLessonsSeq.indexOf(t.id);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setSavedLessonsList(sortedLessonsList);
        setFetchingDetails(false);
      } catch (err) {
        console.log('err', err);
        setMessages({
          show: true,
          message: EditSyllabusDict[userLanguage]['messages']['fetcher'],
          isError: true,
        });
        setFetchingDetails(false);
      }
    } else {
      console.log('can not find unit id');
      history.push('/dashboard/manage-institutions');
    }
  };

  const updateListAndDropdown = async () => {
    // To update table list and dropdown as per selected items.
    const savedLessonIds = [...savedLessonsList];
    const lessonsDetails = [...allLessonsList];
    const filteredList = lessonsDetails.filter((item) =>
      savedLessonIds.some((lesson) => lesson.lessonID === item.id)
    );
    let updatedTableList = filteredList.map((item) => {
      let tableList;
      const selectedLesson = savedLessonIds.find((lesson) => lesson.lessonID === item.id);
      tableList = {
        ...item,
        status: selectedLesson?.status || '',
        uniqlessonId: selectedLesson?.id,
        measurements: selectedLesson?.measurements,
      };
      return tableList;
    });
    const filteredDropDownList = dropdownLessonsList.filter((item) =>
      updatedTableList.find((lesson) => lesson.id === item.id) ? false : true
    );

    updatedTableList = updatedTableList
      .map((t: any) => {
        let index = lessonsIds?.indexOf(t.uniqlessonId);
        return {...t, index};
      })
      .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

    setSelectedLessonsList(updatedTableList);
    setDropdownLessonsList(filteredDropDownList);
  };

  const updateLessonSequence = async (lessonsIDs: string[]) => {
    setLessonsIds(lessonsIDs);
    await API.graphql(
      graphqlOperation(customMutations.updateUniversalSyllabusLessonSequence, {
        input: {id: syllabusId, universalLessonsSeq: lessonsIDs},
      })
    );
  };

  useEffect(() => {
    if (savedLessonsList?.length && !lessonsIds.length) {
      const lessonSeq = savedLessonsList.map((item) => item.id);
      updateLessonSequence(lessonSeq);
    }
  }, [savedLessonsList]);

  useEffect(() => {
    if (Array.isArray(savedLessonsList) && savedLessonsList.length) {
      updateListAndDropdown();
    }
  }, [savedLessonsList, allLessonsList]);

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

  useEffect(() => {
    setFetchingDetails(true);
    Promise.all([fetchDesignersList(), fetchLessonsList()])
      .then(() => fetchSyllabusData())
      .catch((err) => console.log(err));
  }, []);

  const backtoPreviousStep = () => {
    history.goBack();
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

  const saveSyllabusDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setIsLoading(true);
        const languagesCode = syllabusData.languages.map((item) => item.value);
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
        await API.graphql(graphqlOperation(mutations.updateUniversalSyllabus, {input}));
        setMessages({
          show: true,
          message: EditSyllabusDict[userLanguage]['messages']['unitupdate'],
          isError: false,
        });
        setIsLoading(false);
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
    return true;
  };

  const createNewLesson = () => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: true,
        show: !warnModal.show,
        lessonEdit: false,
      });
      return;
    }
    history.push('/dashboard/lesson-builder/lesson/add');
  };

  const selectLesson = (value: string, name: string, id: string) => {
    setSelectedLesson({id, name, value});
  };

  const addNewLesson = async () => {
    try {
      setAddingLesson(true);
      const selectedLesson = allLessonsList.find(
        (item) => item.id === selecetedLesson.id
      );

      const lessonComponentPlan: any =
        selectedLesson?.lessonPlan &&
        selectedLesson.lessonPlan.map((item: any) => {
          return {
            disabled: false,
            open: selectedLesson.type !== 'lesson' ? true : false,
            active: selectedLesson.type !== 'lesson' ? true : false,
            stage: `checkpoint?id=${item.LessonComponentID}`,
            type: 'survey',
            displayMode: 'SELF',
          };
        });
      const input = {
        syllabusID: syllabusId,
        lessonID: selecetedLesson.id,
        displayData: {breakdownComponent: selectedLesson?.type},
        lessonPlan: lessonComponentPlan?.length > 0 ? lessonComponentPlan : [],
        status: 'Active',
      };

      const result: any = await API.graphql(
        graphqlOperation(mutations.createUniversalSyllabusLesson, {input})
      );
      const newLesson = result.data.createUniversalSyllabusLesson;

      if (!lessonsIds.length) {
        const associatedRooms: any = await API.graphql(
          graphqlOperation(customQueries.listRoomsByActiveSyllabusId, {
            filter: {activeSyllabus: {eq: syllabusId}},
          })
        );
        associatedRooms?.data.listRooms.items?.map(async (room: any) => {
          const updatedRoomResult: any = await API.graphql(
            graphqlOperation(mutations.updateRoom, {
              input: {id: room.id, activeLessons: [selecetedLesson.id]},
            })
          );
        });
        await updateLessonSequence([newLesson.id]);
      } else {
        await updateLessonSequence([...lessonsIds, newLesson.id]);
      }
      setSelectedLesson({id: '', name: '', value: ''});
      setSavedLessonsList([...savedLessonsList, newLesson]);
      setAddingLesson(false);
    } catch {
      setAddingLesson(false);
      setMessages({
        show: true,
        message: EditSyllabusDict[userLanguage]['messages']['updateerr'],
        isError: true,
        lessonError: true,
      });
    }
  };

  const onDelete = (item: any) => {
    const onDrop = async () => {
      setDeleting(true);
      const result: any = await API.graphql(
        graphqlOperation(mutations.deleteUniversalSyllabusLesson, {
          input: {id: item.uniqlessonId},
        })
      );
      await updateLessonSequence(
        lessonsIds.filter((lessonId) => lessonId !== item.uniqlessonId)
      );
      setSelectedLessonsList((list: any) =>
        list.filter((_item: any) => _item.id !== item.id)
      );
      setDeleting(false);
      closeLessonAction();
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to delete (${item.title})?`,
      action: onDrop,
    });
  };

  const onStatusChange = async (val: string, name: string, id: string, item?: any) => {
    try {
      setEditState({...editState, action: 'updating...'});
      if (val === 'Dropped') {
        const onDrop = async () => {
          closeLessonAction();
          const result: any = await API.graphql(
            graphqlOperation(mutations.deleteSyllabusLesson, {
              input: {id: item.uniqlessonId},
            })
          );
          setSelectedLessonsList((list: any) =>
            list.filter((_item: any) => _item.id !== item.id)
          );
        };
        setWarnModal2({
          show: true,
          message: `Are you sure you want to delete (${item.title})?`,
          action: onDrop,
        });
      } else {
        const input = {id: item.uniqlessonId, status: val};
        const result: any = await API.graphql(
          graphqlOperation(mutations.updateUniversalSyllabus, {input})
        );
        const newLesson = result.data.updateSyllabusLesson;
        updateStatusOnTable(newLesson.lessonID, newLesson.status);
      }
      setEditState({id: ''});
    } catch {
      setMessages({
        show: true,
        message: EditSyllabusDict[userLanguage]['messages']['updateerr'],
        isError: true,
        lessonError: true,
      });
      setEditState({id: '', action: ''});
    }
  };

  const updateStatusOnTable = (lessonId: string, status: string) => {
    let updatedList = [...selectedLessonsList];
    updatedList.find((item) => item.id === lessonId).status = status;
    setSelectedLessonsList(updatedList);
  };

  const closeLessonAction = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  const cancelEdit = () => {
    setEditState({id: '', action: ''});
  };

  const editCurrentLesson = (id: string) => {
    setEditState({id});
  };

  const cancelSaveAction = () => {
    history.push(
      `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`
    );
  };
  const saveAndGoback = async () => {
    history.goBack();
  };
  const saveAndCreateNew = async () => {
    const result: boolean = await saveSyllabusDetails();
    if (result) {
      history.push('/dashboard/lesson-builder/lesson/add');
    } else {
      toggleModal();
    }
  };

  const toggleModal = () => {
    setWarnModal({...warnModal, lessonPlan: false, show: false, lessonEdit: false});
  };

  const closeModal = () => {
    setWarnModal({...warnModal, show: false});
  };

  const onDragEnd = async (result: any) => {
    if (result.source.index !== result.destination.index) {
      const list: any = reorder(
        lessonsIds,
        result.source.index,
        result.destination.index
      );
      setLessonsIds(list);
      let lessonsList = selectedLessonsList
        .map((t: any) => {
          let index = list.indexOf(t.uniqlessonId);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      setSelectedLessonsList(lessonsList);
      updateLessonSequence(list);
      // Graphql mutation to update syllabus lesson seq
    }
  };

  const gotoLessonBuilder = (id: string, type: string) => {
    if (unsavedChanges) {
      setWarnModal({
        ...warnModal,
        lessonPlan: false,
        show: !warnModal.show,
        lessonEdit: true,
      });
      setEditLesson({type, id});
    } else {
      if (type === 'lesson') {
        history.push(`/dashboard/lesson-builder/lesson/edit?lessonId=${id}`);
      } else {
        history.push(`/dashboard/lesson-builder/lesson/edit?assessmentId=${id}`);
      }
    }
  };

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
      {/* ********************* SECTION HEADER starts ********************************* */}
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
          <Buttons
            btnClass="py-3 px-2"
            label={loading ? 'Saving...' : 'Save'}
            onClick={saveSyllabusDetails}
            disabled={loading ? true : false}
          />
        </div>
      </div>

      {/* ********************* SECTION HEADER ends ********************************* */}

      <PageWrapper>
        <div className="h-9/10 flex flex-col md:flex-row">
          <div className="w-full">
            <div className="bg-white shadow-5 sm:rounded-lg mb-4">
              {/* ********************* COMPONENT HEADING ********************************* */}
              <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  {EditSyllabusDict[userLanguage]['heading']}
                </h3>
              </div>

              {fetchingDetails ? (
                <>
                  {/* ********************* DATA LOADING LOADER ********************************* */}
                  <div className="h-100 flex justify-center items-center">
                    <div className="w-5/10">
                      <Loader />
                      <p className="mt-2 text-center">
                        Fetching syllabus details please wait...
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ********************* EDIT SYLLABUS FORM ********************************* */}
                  <div className="w-9/10 m-auto p-4">
                    {/* *************** NAME AND DESIGNERS ************ */}
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

                    {/* *************** LANGUAGES ************ */}
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

                    {/* *************** DESCRIPTION AND PURPOSE ************ */}
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

                    {/* *************** OJECTIVES AND METHODOLOGY ************ */}
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
                    {/* *************** POLICIES ************ */}
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

                    {/* *************** EDIT SYLLABUS FORM ERROR SECTION ************ */}
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
                </>
              )}
            </div>

            {/* *************** SYLLABUS LESSON SECTION ************ */}
            <div className="bg-white shadow-5 sm:rounded-lg mb-4">
              {/* *************** SECTION HEADER ************ */}
              <div className="px-4 py-5 flex items-center justify-between border-b-0 border-gray-200 sm:px-6">
                <div />
                <h3 className="text-lg text-center leading-6 font-medium text-gray-900">
                  {EditSyllabusDict[userLanguage]['lessonplan']}
                </h3>
                <div className="flex justify-end">
                  <Buttons
                    btnClass="py-3 px-10"
                    label={EditSyllabusDict[userLanguage]['createnew']}
                    onClick={createNewLesson}
                    disabled={loading ? true : false}
                  />
                </div>
              </div>
              {/* *************** ADD LESSON TO SYLLABUS SECTION ************ */}
              <div className="w-full m-auto p-4">
                <div className="my-12 w-6/10 m-auto flex items-center justify-center">
                  <div className="mr-4">
                    <Selector
                      selectedItem={selecetedLesson.value}
                      list={dropdownLessonsList}
                      placeholder={EditSyllabusDict[userLanguage]['selectlesson']}
                      onChange={selectLesson}
                    />
                  </div>
                  <div className="ml-4 w-auto">
                    <Buttons
                      btnClass="ml-4 py-1"
                      label={addingLesson ? 'Adding' : 'Add'}
                      onClick={addNewLesson}
                      disabled={!Boolean(selecetedLesson.value) || addingLesson}
                    />
                  </div>
                </div>
                {messages.show && messages.lessonError ? (
                  <div className="py-2 mb-4 m-auto text-center">
                    <p
                      className={`${
                        messages.isError ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {messages.message && messages.message}
                    </p>
                  </div>
                ) : null}

                {/* *************** LESSONS LIST ************ */}
                <div>
                  {selectedLessonsList && selectedLessonsList.length > 0 ? (
                    <div>
                      {/* *************** LESSONS TABLE HEADERS ************ */}
                      <div className="flex justify-between w-full  px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                        <div className="w-.5/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>{EditSyllabusDict[userLanguage]['no']}</span>
                        </div>
                        <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>{EditSyllabusDict[userLanguage]['name']}</span>
                        </div>
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>{EditSyllabusDict[userLanguage]['type']}</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>{EditSyllabusDict[userLanguage]['measurement']}</span>
                        </div>
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>{EditSyllabusDict[userLanguage]['action']}</span>
                        </div>
                      </div>

                      <div className="max-h-88 overflow-y-auto mb-10">
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided1, snapshot) => (
                              <div {...provided1.droppableProps} ref={provided1.innerRef}>
                                {selectedLessonsList.map((item, index) => {
                                  return (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}>
                                          <div
                                            key={index}
                                            className="flex justify-between w-full px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                                            <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                                              {index + 1}.
                                            </div>
                                            <div
                                              className="flex w-2/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal cursor-pointer"
                                              onClick={() =>
                                                gotoLessonBuilder(item.id, item.type)
                                              }>
                                              {item.title || '--'}
                                            </div>
                                            <div className="flex w-1/10 items-center px-8 py-3 text-left text-s text-gray-500 leading-4 font-medium whitespace-normal cursor-pointer">
                                              {item.type || '--'}
                                            </div>
                                            <div className="flex w-3/10 items-center px-8 py-3 text-left text-s leading-4 font-medium whitespace-normal text-gray-500">
                                              {item?.measurements?.length > 0
                                                ? item?.measurements?.map(
                                                    (rubric: any, index: number) =>
                                                      index ===
                                                      item?.measurements?.length - 1
                                                        ? rubric?.rubric?.name + '.'
                                                        : rubric?.rubric?.name + ', '
                                                  )
                                                : '-'}
                                            </div>
                                            {/* <div className="flex w-2.5/10 items-center px-8 py-3 text-center justify-center text-s text-gray-500 leading-4 font-medium ">
                                              {editState.id !== item.id ? (
                                                <span
                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium  w-auto ${
                                                    item.status === 'Inactive'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : item.status === 'Dropped'
                                                      ? 'bg-red-100 text-red-800'
                                                      : 'bg-green-100 text-green-800'
                                                  }`}>
                                                  {item.status}
                                                </span>
                                              ) : (
                                                <div className="text-gray-900">
                                                  <Selector
                                                    selectedItem={item.status}
                                                    placeholder="Select Status"
                                                    list={statusList}
                                                    onChange={(val, name, id) =>
                                                      onStatusChange(val, name, id, item)
                                                    }
                                                  />
                                                </div>
                                              )}
                                            </div>
                                             */}
                                            <span
                                              className={`w-1/10 flex items-center justify-center text-left px-8 py-3 cursor-pointer`}
                                              onClick={() => onDelete(item)}>
                                              <DeleteActionBtn
                                                handleClick={() => onDelete(item)}
                                              />
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided1.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                      {warnModal.show &&
                        (warnModal.lessonPlan ? (
                          <ModalPopUp
                            closeAction={() =>
                              history.push('/dashboard/lesson-builder/lesson/add')
                            }
                            saveAction={saveAndCreateNew}
                            saveLabel="SAVE"
                            message={warnModal.message}
                            loading={loading}
                            cancelLabel="DISCARD"
                          />
                        ) : (
                          <ModalPopUp
                            saveAction={saveAndGoback}
                            saveLabel="SAVE"
                            closeAction={closeModal}
                            cancelLabel="CANCEL"
                            loading={loading}
                            noButton="DISCARD"
                            noButtonAction={cancelSaveAction}
                            message={warnModal.message}
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center p-16 mt-4">
                      {EditSyllabusDict[userLanguage]['nolesson']}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {warnModal2.show && (
          <ModalPopUp
            closeAction={closeLessonAction}
            saveAction={warnModal2.action}
            saveLabel="Yes"
            message={warnModal2.message}
            loading={deleting}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default EditSyllabus;
