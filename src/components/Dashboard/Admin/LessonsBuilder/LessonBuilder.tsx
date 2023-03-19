import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import useAuth from '@customHooks/useAuth';
import {logError} from '@graphql/functions';
import {RoomStatus, UpdateUniversalLessonInput} from 'API';
import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {useGlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import * as mutations from 'graphql/mutations';
import {LessonPlansProps, SavedLessonDetailsProps} from 'interfaces/LessonInterfaces';
import {uniqBy} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {useEffect, useState} from 'react';
import {FaQuestionCircle, FaRegEye} from 'react-icons/fa';
import {IoCardSharp, IoDocumentText} from 'react-icons/io5';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {getImageFromS3Static} from 'utilities/services';
import {languageList, lessonTypeList} from 'utilities/staticData';
import UnitList from '../Institutons/EditBuilders/CurricularsView/TabsActions/Unit/UnitList';
import AddNewLessonForm from './StepActionComponent/AddNewLessonForm/AddNewLessonForm';
import LearningEvidence from './StepActionComponent/LearningEvidence/LearningEvidence';
import LessonActivities from './StepActionComponent/LessonActivities';

export interface InitialData {
  name: string;
  id: string;
  type: InputValueObject;
  duration: string;
  purpose: string;
  purposeHtml: string;
  studentMaterials: string;
  objective: string;
  objectiveHtml: string;
  status: RoomStatus;
  notes?: string;
  notesHtml?: string;
  languages: {label: string; value: string}[];
  institution?: InputValueObject;
  language: string[];
  imageCaption?: string;
  imageUrl?: string;
  imagePreviewUrl?: string;
  studentSummary?: string;
  lessonPlan?: any[];
  targetAudience?: string;
}
export interface InputValueObject {
  id: string;
  label: string;
  value: string;
}
interface LessonBuilderProps {
  designersList: any[];
  institutionList: any[];
  instId: string;
}

const LessonBuilder = (props: LessonBuilderProps) => {
  const {institutionList, instId} = props;
  const history = useHistory();
  const match = useRouteMatch();
  const params = useQuery(location.search);
  const step = params.get('step');
  const lessonIdFromUrl = (useParams() as any).lessonId;
  const {userLanguage, scanLessonAndFindComplicatedWord} = useGlobalContext();
  const {setUniversalLessonDetails, universalLessonDetails} = useULBContext();
  const {AddNewLessonFormDict, LessonBuilderDict} = useDictionary();

  const initialData = {
    name: '',
    status: RoomStatus.ACTIVE,
    id: '',
    type: {id: '', label: 'Lesson', value: ''},
    duration: '1',
    purpose: '',
    purposeHtml: '<p></p>',
    studentMaterials: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    notes: '',
    notesHtml: '<p></p>',
    languages: [{label: 'English', value: 'EN'}],
    institution: {id: instId, label: '', value: instId},
    language: [''],
    imageUrl: '',
    imageCaption: '',
    studentSummary: '',
    lessonPlan: [{}],
    targetAudience: 'All'
  };
  const instructionInitialState = {
    introductionTitle: '',
    instructionsTitle: '',
    summaryTitle: '',
    introduction: '',
    instructions: '',
    summary: ''
  };

  const assessmentScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    {name: 'Instructions', icon: <IoDocumentText />, isDisabled: true},
    {name: 'Builder', icon: <FaQuestionCircle />, isDisabled: true},
    {name: 'Preview Details', icon: <FaRegEye />, isDisabled: true}
  ];
  const lessonScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    {name: 'Preview Details', icon: <FaRegEye />, isDisabled: true}
  ];

  const [designersList, setDesignersList] = useState<any[]>([]);
  const [designerListLoading, setDesignersListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<InitialData>(initialData);

  const [selectedMeasurements, setSelectedMeasurements] = useState<any[]>([]);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState
  });
  const [selectedDesigners, setSelectedDesigners] = useState<any[]>([]);
  const [curriculumList, setCurriculumList] = useState<any[]>([]);

  const [addedSyllabus, setAddedSyllabus] = useState<any[]>([]);
  const [lessonId, setLessonId] = useState('');
  const [activeStep, setActiveStep] = useState('overview');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonBuilderDict[userLanguage]['MESSAGES']['UNSAVE'],
    url: ''
  });
  const [serverMessage, setServerMessage] = useState({
    isError: false,
    message: ''
  });

  const fetchStaffByInstitution = async (institutionID: string) => {
    setDesignersList([]);
    try {
      setDesignersListLoading(true);
      const staffList: any = await API.graphql(
        graphqlOperation(customQueries.getStaffsForInstitution, {
          filter: {institutionID: {eq: institutionID}}
        })
      );
      const listStaffs = staffList.data.listStaff?.items || [];
      const updatedList = listStaffs
        ?.map((item: any) => {
          if (Boolean(item?.staffMember)) {
            return {
              id: item?.id,
              label: `${item?.staffMember?.firstName || ''} ${
                item?.staffMember.lastName || ''
              }`,
              value: `${item?.staffMember?.firstName || ''} ${
                item?.staffMember.lastName || ''
              }`
            };
          }
          return null;
        })
        .filter(Boolean);

      setDesignersList(uniqBy(updatedList, 'label'));
      setDesignersListLoading(false);
    } catch (error) {
      setDesignersListLoading(false);
    }
  };

  const changeLessonType = (type: string) => {
    if (type === 'lesson') {
      setLessonBuilderSteps(lessonScrollerStep);
    } else {
      setLessonBuilderSteps(assessmentScrollerStep);
    }
  };
  const [warnModal2, setWarnModal2] = useState({
    stepOnHold: '',
    show: false,
    message: ''
  });

  const [unSavedCheckPData, setUnsavedCheckPData] = useState<any>({});
  const [checkpQuestions, setCheckpQuestions] = useState<any>([]);

  const [savingUnsavedCP, setSavingUnsavedCP] = useState(false);

  const getInstitutionByID = async (id: string) => {
    try {
      const inst: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {id})
      );
      return inst.data.getInstitution;
    } catch (error) {
      console.error('@getInstitutionByID: ', error);
    }
  };

  const getRubricsData = (rubrics: string[]) => {
    return rubrics.map((id) => {
      return {
        rubricID: id,
        checked: true
      };
    });
  };

  const fetchUniversalLessonDetails = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId
        })
      );
      const savedData = result.data.getUniversalLesson;

      const updatedLessonPlan = scanLessonAndFindComplicatedWord(savedData.lessonPlan);
      setUniversalLessonDetails({
        ...savedData,
        lessonPlan: updatedLessonPlan
      });

      if (savedData.institutionID) {
        const institution = await getInstitutionByID(savedData.institutionID);

        setSelectedMeasurements(getRubricsData?.(savedData?.rubrics || []));
        setFormData({
          ...formData,
          ...savedData,
          id: savedData.id,
          lessonPlan: [...savedData.lessonPlan],
          imageCaption: savedData.cardCaption,

          imageUrl: savedData.cardImage,
          imagePreviewUrl: savedData.cardImage
            ? getImageFromS3Static(savedData.cardImage)
            : '',
          name: savedData?.title || '--',
          type:
            savedData.type &&
            lessonTypeList.find((item: any) => item.value === savedData.type),
          purposeHtml: savedData?.purpose ? savedData.purpose : '',
          notesHtml: savedData?.notes ? savedData.notes : '',
          studentMaterials: savedData?.studentMaterials ? savedData.studentMaterials : '',
          objectiveHtml: savedData.objectives ? savedData.objectives[0] : '',
          languages: savedData.language.map((it: any) =>
            languageList.find((it2: any) => it2.value === it)
          ),
          status: savedData?.status || RoomStatus.ACTIVE,
          studentSummary: savedData.summary,
          institution: {
            id: institution?.id,
            name: institution?.name,
            value: institution?.name
          }
        });
        fetchStaffByInstitution(savedData.institutionID);
      }
      const designers = designersList.filter((item: any) =>
        savedData?.designers?.includes(item.id)
      );
      setSelectedDesigners(designers);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      console.log('Error while fetching lesson data');
      history.push(`/dashboard/manage-institutions/institution/${instId}/lessons`);
    }
  };

  const fetchUniversalSyllabus = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listUniversalSyllabusLessons, {
        filter: {
          lessonID: {eq: lessonId}
        }
      })
    );
    const assignedSyllabus = result?.data?.listUniversalSyllabusLessons.items;
    fetchCurriculum(assignedSyllabus);
    setAddedSyllabus(assignedSyllabus);
  };

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      fetchUniversalLessonDetails();
      fetchUniversalSyllabus();
    } else {
      setUniversalLessonDetails({
        id: '',
        summary: '',
        designers: [''],
        teachers: [''],
        categories: [''],
        lessonPlan: []
      });
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonIdFromUrl) {
      setLessonId(lessonIdFromUrl);
    }
  }, [lessonIdFromUrl]);

  useEffect(() => {
    if (instId && !lessonId) {
      fetchStaffByInstitution(instId);
    }
  }, [instId, lessonId]);

  const addCheckpointQuestions = async (
    quesId: string,
    checkpointID: string,
    required: boolean
  ) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: required ? required : false
      };
      await API.graphql(
        graphqlOperation(customMutations.createCheckpointQuestions, {
          input: input
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const selDesigners: any[] = [];

  const saveNewCheckPoint = async () => {
    setSavingUnsavedCP(true);
    try {
      const input = {
        stage: 'checkpoint',
        type: 'checkpoint',
        label: unSavedCheckPData.label,
        title: unSavedCheckPData?.title || '--',
        subtitle: unSavedCheckPData.subtitle,
        instructionsTitle: unSavedCheckPData.instructionsTitle,
        instructions: unSavedCheckPData.instructionHtml,
        purpose: unSavedCheckPData.purposeHtml,
        objectives: unSavedCheckPData.objectiveHtml,
        designers: selDesigners.map((item: any) => item.id),
        language: unSavedCheckPData.language.value,
        estTime: unSavedCheckPData.estTime ? parseInt(unSavedCheckPData.estTime) : 0
      };
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createCheckpoint, {input: input})
      );
      const newCheckpoint = results?.data?.createCheckpoint;
      if (newCheckpoint) {
        let lessonCheckpointInput = {
          lessonID: lessonId,
          checkpointID: newCheckpoint.id,
          position: 0
        };
        let lessonPlansInput = !savedLessonDetails.lessonPlans?.length
          ? [
              {
                type: 'checkpoint',
                LessonComponentID: newCheckpoint.id,
                sequence: 0,
                stage: 'checkpoint'
              }
            ]
          : [
              ...savedLessonDetails.lessonPlans,
              {
                type: 'checkpoint',
                LessonComponentID: newCheckpoint.id,
                sequence: savedLessonDetails.lessonPlans.length,
                stage: 'checkpoint'
              }
            ];
        let [_, lesson]: any = await Promise.all([
          await API.graphql(
            graphqlOperation(customMutations.createLessonCheckpoint, {
              input: lessonCheckpointInput
            })
          ),
          await API.graphql(
            graphqlOperation(customMutations.updateLesson, {
              input: {
                id: lessonId,
                lessonPlan: lessonPlansInput
              }
            })
          )
        ]);
        Promise.all(
          checkpQuestions.map(async (item: any) =>
            addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
          )
        );
        let checkpQuestionsIds = checkpQuestions.map((item: any) => item.id);
        await API.graphql(
          graphqlOperation(mutations.createCSequences, {
            input: {
              id: `Ch_Ques_${newCheckpoint.id}`,
              sequence: checkpQuestionsIds
            }
          })
        );

        const newLessonPlans = lesson?.data?.updateLesson?.lessonPlan;
        updateLessonPlan(newLessonPlans);
      }
      onCheckpointModalClose(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSavingUnsavedCP(false);
    }
  };

  const onCheckpointModalClose = (cancel: boolean = true) => {
    if (cancel) {
      // clicked on cancel button

      setWarnModal2({
        ...warnModal2,
        show: false
      });
    } else {
      // clicked on no button

      setActiveStep(warnModal2.stepOnHold);

      setWarnModal2({
        stepOnHold: '',
        show: false,
        message: ''
      });

      setUnsavedChanges(false);
      setUnsavedCheckPData({});
      setCheckpQuestions([]);
    }
  };

  const fetchCurriculum = async (_: any = addedSyllabus) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculaForLesson, {
          filter: {
            institutionID: {eq: formData?.institution?.id}
          }
        })
      );

      const curriculums = list?.data?.listCurricula?.items || [];

      setCurriculumList(curriculums);

      const institutionRooms: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionsForCurricula)
      );

      const curriculumIds: any[] = [];

      institutionRooms?.data?.listInstitutions?.items.forEach((item: any) => {
        item?.rooms?.items?.forEach((item2: any) => {
          item2?.curricula?.items?.forEach((item3: any) => {
            curriculumIds.push({
              teacher: item2?.teacher,
              institutionId: item?.id,
              institutionName: item?.name,
              curriculumId: item3?.curriculum?.id,
              curriculumName: item3?.curriculum?.name,
              roomName: item2.name,
              roomId: item2.id
            });
          });
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?lessonId=${lessonId}&step=${step}`;
    setServerMessage({
      isError: false,
      message: ''
    });
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        message: 'Do you want to save changes before going?',
        url: redirectionUrl
      });
    } else {
      setUnsavedChanges(false);
      history.push(redirectionUrl);
    }
  };

  const {authId, email} = useAuth();

  const updateMeasurementList = async (rubrics: any[]) => {
    try {
      setUpdating(true);

      setUnsavedChanges(false);
      setUpdating(false);
      setSelectedMeasurements(rubrics);

      const input: UpdateUniversalLessonInput = {
        id: formData.id,
        rubrics: rubrics.map((d) => d?.rubricID).filter(Boolean)
      };

      await API.graphql(
        graphqlOperation(customMutations.updateUniversalLesson, {
          input: input
        })
      );
    } catch (error) {
      logError(error, {authId, email}, 'LessonBuilder @updateMeasurementList');
      console.error(
        '🚀 ~ file: LessonBuilder.tsx ~ line 561 ~ updateMeasurementList ~ error',
        error
      );
      setUpdating(false);
      setServerMessage({
        isError: true,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATEERR']
      });
    }
  };

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <AddNewLessonForm
            lessonId={lessonId}
            lessonPlanAttachment={universalLessonDetails?.lessonPlanAttachment}
            changeLessonType={changeLessonType}
            formData={formData}
            setFormData={setFormData}
            designerListLoading={designerListLoading}
            designersList={designersList}
            selectedDesigners={selectedDesigners}
            setSelectedDesigners={setSelectedDesigners}
            postLessonCreation={postLessonCreation}
            allMeasurement={[]}
            institutionList={institutionList}
            setUnsavedChanges={setUnsavedChanges}
            fetchStaffByInstitution={fetchStaffByInstitution}
          />
        );
      case 'activities':
        return (
          <LessonActivities
            loading={loading}
            lessonId={lessonId}
            lessonName={formData?.name}
            universalLessonDetails={universalLessonDetails}
          />
        );
      case 'courses':
        return (
          <UnitList
            curricular={curriculumList}
            instId={formData?.institution?.id}
            instName={formData?.institution?.label}
            addedSyllabus={addedSyllabus}
            isFromLesson
            setAddedSyllabus={setAddedSyllabus}
          />
        );
      case 'learning-evidence':
        return (
          <LearningEvidence
            fetchLessonRubrics={fetchLessonRubrics}
            institutionId={formData?.institution?.id || ''}
            lessonId={lessonId}
            selectedMeasurements={selectedMeasurements}
            setSelectedMeasurements={setSelectedMeasurements}
            setUnsavedChanges={setUnsavedChanges}
            serverMessage={serverMessage}
            updating={updating}
            updateMeasurementList={updateMeasurementList}
          />
        );

      default:
        return null;
    }
  };

  const saveBeforeLeave = async () => {
    if (activeStep === 'learning-evidence') {
      await updateMeasurementList(selectedMeasurements);
      setServerMessage({
        isError: false,
        message: ''
      });
      discardChanges();
    } else {
      setWarnModal({
        ...warnModal,
        show: !warnModal.show
      });
    }
  };

  const discardChanges = () => {
    history.push(warnModal.url);
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    });
    setUnsavedChanges(false);
  };

  const fetchLessonRubrics = async () => {
    // do something
  };

  const postLessonCreation = (lessonId: string, action?: string) => {
    const currentSteps = [...lessonBuilderSteps];
    const updatedState = currentSteps.map((item) => ({
      ...item,
      isDisabled: false
    }));
    setLessonBuilderSteps(updatedState);
    setLessonId(lessonId);
    if (action === 'add') {
      const redirectionUrl = `${match.url}?lessonId=${lessonId}&step=activities`;
      history.push(redirectionUrl);
    }
  };

  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan
    });
  };
  useEffect(() => {
    if (formData.type?.id) {
      changeLessonType(formData.type?.value);
    }
  }, [formData.type?.id]);

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  const steps: IStepElementInterface[] = [
    {
      title: LessonBuilderDict[userLanguage]['OVEVIEW_TITLE'],
      description: LessonBuilderDict[userLanguage]['OVERVIEW_DESCRIPTION'],
      stepValue: 'overview'
    },
    {
      title: LessonBuilderDict[userLanguage]['ACTIVITY_TITLE'],
      description: LessonBuilderDict[userLanguage]['ACTIVITY_DESCRIPTION'],
      stepValue: 'activities',

      disabled: !Boolean(lessonId)
    },
    {
      title: LessonBuilderDict[userLanguage]['UNIT_MANAGER_TITLE'],
      description: LessonBuilderDict[userLanguage]['UNIT_MANAGER_DESCRIPTION'],
      stepValue: 'courses',

      disabled: !(universalLessonDetails && universalLessonDetails.lessonPlan?.length)
    },
    {
      title:
        LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
          'LEARNING_OBJECTIVE'
        ],
      description: LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_DESCRIPTION'],
      stepValue: 'learning-evidence',

      disabled: !(Boolean(selectedMeasurements?.length) || Boolean(addedSyllabus.length))
    }
  ];

  return (
    <div className="w-full h-full">
      <h3 className="text-lg leading-6 uppercase text-gray-600 w-auto px-8 pb-8">
        {LessonBuilderDict[userLanguage]['TITLE']}
      </h3>
      <div className="w-full m-auto">
        <StepComponent
          steps={steps}
          activeStep={activeStep}
          handleTabSwitch={handleTabSwitch}
        />

        <div className="grid mt-4 grid-cols-1 divide-x-0 divide-gray-400 px-2 xl:px-8">
          {loading ? (
            <div className="h-100 flex justify-center items-center">
              <div className="w-5/10">
                <Loader
                  className="text-gray-500"
                  animation
                  withText="Fetching lesson details please wait..."
                />
              </div>
            </div>
          ) : (
            <div className="">{currentStepComp(activeStep)}</div>
          )}
        </div>
      </div>

      <ModalPopUp
        open={warnModal.show}
        closeAction={discardChanges}
        saveAction={saveBeforeLeave}
        saveLabel="Yes"
        message={warnModal.message}
        loading={updating}
      />

      <ModalPopUp
        open={warnModal2.show}
        noButton="No"
        noButtonAction={() => onCheckpointModalClose(false)}
        closeAction={onCheckpointModalClose}
        saveAction={saveNewCheckPoint}
        saveLabel="Yes"
        cancelLabel="Cancel"
        message={warnModal2.message}
        loading={savingUnsavedCP}
        saveTooltip={`Save this checkpoint go to ${warnModal2.stepOnHold}`}
        noTooltip={`Just go to ${warnModal2.stepOnHold} and don't save anything`}
        cancelTooltip={'Continue Editing'}
      />

      <ModalPopUp
        open={warnModal2.show && warnModal2.message.includes('required fields')}
        closeAction={() => {
          setActiveStep(warnModal2.stepOnHold);

          setWarnModal2({show: false, message: '', stepOnHold: ''});
        }}
        saveAction={() => setWarnModal2({show: false, message: '', stepOnHold: ''})}
        saveLabel="Sure"
        saveTooltip="Fill up required fields"
        cancelTooltip={`Just go to ${warnModal2.stepOnHold}`}
        cancelLabel="Discard"
        message={warnModal2.message}
      />

      {/* </PageWrapper> */}
    </div>
  );
};

export default LessonBuilder;
