import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {IoDocumentText, IoCardSharp} from 'react-icons/io5';
import {FaRegEye, FaQuestionCircle} from 'react-icons/fa';

import * as customMutations from '../../../../customGraphql/customMutations';
import * as mutations from '../../../../graphql/mutations';
import * as customQueries from '../../../../customGraphql/customQueries';

import ModalPopUp from '../../../Molecules/ModalPopUp';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import Loader from '../../../Atoms/Loader';
import StepComponent, {IStepElementInterface} from '../../../Atoms/StepComponent';

import AddNewLessonForm from './StepActionComponent/AddNewLessonForm';
import LessonActivities from './StepActionComponent/LessonActivities';
import LessonCourse from './StepActionComponent/LessonCourse/LessonCourse';
import LearningEvidence from './StepActionComponent/LearningEvidence/LearningEvidence';
import {
  InstructionInitialState,
  SavedLessonDetailsProps,
  LessonPlansProps,
} from './LessonEdit';
import useDictionary from '../../../../customHooks/dictionary';
import {useQuery} from '../../../../customHooks/urlParam';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {languageList, lessonTypeList} from '../../../../utilities/staticData';
import {getImageFromS3Static} from '../../../../utilities/services';

export interface InitialData {
  name: string;
  type: InputValueObject;
  duration: string;
  purpose: string;
  purposeHtml: string;
  objective: string;
  objectiveHtml: string;
  notes?: string;
  notesHtml?: string;
  languages: {id: string; name: string; value: string}[];
  institution?: InputValueObject;
  language: string[];
  imageCaption?: string;
  imageUrl?: string;
  imagePreviewUrl?: string;
  studentSummary?: string;
}
export interface InputValueObject {
  id: string;
  name: string;
  value: string;
}
interface LessonBuilderProps {
  designersList: any[];
  institutionList: any[];
}

const LessonBuilder = (props: LessonBuilderProps) => {
  const {designersList, institutionList} = props;
  const history = useHistory();
  const match = useRouteMatch();
  const params = useQuery(location.search);
  const step = params.get('step');
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {setUniversalLessonDetails, universalLessonDetails} = useULBContext();
  const {AddNewLessonFormDict} = useDictionary(clientKey);
  const {BreadcrumsTitles, BUTTONS, LessonBuilderDict} = useDictionary(clientKey);

  const initialData = {
    name: '',
    type: {id: '', name: '', value: ''},
    duration: '1',
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    notes: '',
    notesHtml: '<p></p>',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    institution: {id: '', name: '', value: ''},
    language: [''],
    imageUrl: '',
    imageCaption: '',
    studentSummary: '',
  };
  const instructionInitialState = {
    introductionTitle: '',
    instructionsTitle: '',
    summaryTitle: '',
    introduction: '',
    instructions: '',
    summary: '',
  };

  const assessmentScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    {name: 'Instructions', icon: <IoDocumentText />, isDisabled: true},
    {name: 'Builder', icon: <FaQuestionCircle />, isDisabled: true},
    {name: 'Preview Details', icon: <FaRegEye />, isDisabled: true},
  ];
  const lessonScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    {name: 'Preview Details', icon: <FaRegEye />, isDisabled: true},
  ];

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState,
  });
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [curriculumList, setCurriculumList] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  const [lessonId, setLessonId] = useState(params.get('lessonId') || '');
  const [activeStep, setActiveStep] = useState('overview');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonBuilderDict[userLanguage]['MESSAGES']['UNSAVE'],
    url: '',
  });
  const [serverMessage, setServerMessage] = useState({
    isError: false,
    message: '',
  });

  const [checkpointSaveModal, setCheckpointSaveModal] = useState({
    show: false,
    stepOnHold: '',
    message: '',
  });

  const savedCheckpointModal = () => {
    setActiveStep(checkpointSaveModal.stepOnHold);
    closeCheckpointModal();
    setUnsavedChanges(false);
  };
  const closeCheckpointModal = () => {
    setCheckpointSaveModal({
      ...checkpointSaveModal,
      stepOnHold: '',
      message: '',
      show: false,
    });
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
    message: '',
  });
  const [isCheckpUnsaved, setIsCheckpUnsaved] = useState<boolean>(false);
  const [unSavedCheckPData, setUnsavedCheckPData] = useState<any>({});
  const [checkpQuestions, setCheckpQuestions] = useState<any>([]);
  const [selDesigners, setSelDesigners] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [savingUnsavedCP, setSavingUnsavedCP] = useState(false);
  const [individualFieldEmpty, setIndividualFieldEmpty] = useState(false);

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

  const fetchUniversalLessonDetails = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId,
        })
      );
      const savedData = result.data.getUniversalLesson;
      setUniversalLessonDetails(savedData);

      if (savedData.institutionID) {
        const institution = await getInstitutionByID(savedData.institutionID);
        setSelectedMeasurements(savedData.rubrics);
        setFormData({
          ...formData,
          ...savedData,
          imageCaption: savedData.cardCaption,
          imageUrl: savedData.cardImage,
          imagePreviewUrl: savedData.cardImage
            ? getImageFromS3Static(savedData.cardImage)
            : '',
          name: savedData.title,
          type:
            savedData.type &&
            lessonTypeList.find((item: any) => item.value === savedData.type),
          purposeHtml: savedData?.purpose ? savedData.purpose : '',
          notesHtml: savedData?.notes ? savedData.notes : '',
          objectiveHtml: savedData.objectives ? savedData.objectives[0] : '',
          languages: savedData.language.map((it: any) =>
            languageList.find((it2: any) => it2.value === it)
          ),
          studentSummary: savedData.summary,
          institution: {
            id: institution?.id,
            name: institution?.name,
            value: institution?.name,
          },
        });
      }

      const designers = designersList.filter((item: any) =>
        savedData?.designers?.includes(item.id)
      );
      setSelectedDesigners(designers);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      console.log('Error while fetching lesson data');
      history.push(`/dashboard/lesson-builder`);
    }
  };

  // old query
  // const result: any = await API.graphql(
  //   graphqlOperation(customQueries.getLesson, {
  //     id: lessonId,
  //   })
  // );

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      fetchUniversalLessonDetails();
    } else {
      setUniversalLessonDetails({
        id: '',
        summary: '',
        designers: [''],
        teachers: [''],
        categories: [''],
        lessonPlan: [],
      });
    }
  }, []);

  useEffect(() => {
    fetchCurriculum();
  }, [formData?.institution]);

  const hasUnsavedCheckpoint = (
    val: boolean,
    isIndividualEmpty: boolean,
    data: any,
    checkpQuestions: any,
    selDesigners: any[]
  ) => {
    if (isIndividualEmpty) {
      setIndividualFieldEmpty(true);
    } else {
      setIndividualFieldEmpty(false);
    }
    if (val !== isCheckpUnsaved) {
      setIsCheckpUnsaved(val);
      setUnsavedCheckPData(data);
      if (data.title && val) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
      setCheckpQuestions(checkpQuestions);
      setSelDesigners(selDesigners);
    }
  };
  const addCheckpointQuestions = async (
    quesId: string,
    checkpointID: string,
    required: boolean
  ) => {
    try {
      const input = {
        checkpointID: checkpointID,
        questionID: quesId,
        required: required ? required : false,
      };
      const questions: any = await API.graphql(
        graphqlOperation(customMutations.createCheckpointQuestions, {input: input})
      );
    } catch {
      // setValidation({
      //   title: '',
      //   label: '',
      //   estTime: '',
      //   message: AddNewCheckPointDict[userLanguage]['MESSAGES']['UNABLESAVE'],
      //   isError: true,
      // });
    }
  };

  const saveNewCheckPoint = async () => {
    setSavingUnsavedCP(true);
    try {
      const input = {
        stage: 'checkpoint',
        type: 'checkpoint',
        label: unSavedCheckPData.label,
        title: unSavedCheckPData.title,
        subtitle: unSavedCheckPData.subtitle,
        instructionsTitle: unSavedCheckPData.instructionsTitle,
        instructions: unSavedCheckPData.instructionHtml,
        purpose: unSavedCheckPData.purposeHtml,
        objectives: unSavedCheckPData.objectiveHtml,
        designers: selDesigners.map((item: any) => item.id),
        language: unSavedCheckPData.language.value,
        estTime: unSavedCheckPData.estTime ? parseInt(unSavedCheckPData.estTime) : 0,
      };
      const results: any = await API.graphql(
        graphqlOperation(customMutations.createCheckpoint, {input: input})
      );
      const newCheckpoint = results?.data?.createCheckpoint;
      if (newCheckpoint) {
        let lessonCheckpointInput = {
          lessonID: lessonId,
          checkpointID: newCheckpoint.id,
          position: 0,
        };
        let lessonPlansInput = !savedLessonDetails.lessonPlans?.length
          ? [
              {
                type: 'checkpoint',
                LessonComponentID: newCheckpoint.id,
                sequence: 0,
                stage: 'checkpoint',
              },
            ]
          : [
              ...savedLessonDetails.lessonPlans,
              {
                type: 'checkpoint',
                LessonComponentID: newCheckpoint.id,
                sequence: savedLessonDetails.lessonPlans.length,
                stage: 'checkpoint',
              },
            ];
        let [lessonCheckpoint, lesson]: any = await Promise.all([
          await API.graphql(
            graphqlOperation(customMutations.createLessonCheckpoint, {
              input: lessonCheckpointInput,
            })
          ),
          await API.graphql(
            graphqlOperation(customMutations.updateLesson, {
              input: {
                id: lessonId,
                lessonPlan: lessonPlansInput,
              },
            })
          ),
        ]);
        let questions = Promise.all(
          checkpQuestions.map(async (item: any) =>
            addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
          )
        );
        let checkpQuestionsIds = checkpQuestions.map((item: any) => item.id);
        let seqItem: any = await API.graphql(
          graphqlOperation(mutations.createCSequences, {
            input: {id: `Ch_Ques_${newCheckpoint.id}`, sequence: checkpQuestionsIds},
          })
        );

        const newLessonPlans = lesson?.data?.updateLesson?.lessonPlan;
        updateLessonPlan(newLessonPlans);
      } else {
      }
      onCheckpointModalClose(false);
      setShowModal(false);
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
        show: false,
      });
    } else {
      // clicked on no button

      setActiveStep(warnModal2.stepOnHold);
      setHistoryList([...historyList, warnModal2.stepOnHold]);
      setWarnModal2({
        stepOnHold: '',
        show: false,
        message: '',
      });
      setShowModal(false);
      setUnsavedChanges(false);
      setUnsavedCheckPData({});
      setCheckpQuestions([]);
    }
  };

  const fetchCurriculum = async () => {
    try {
      setCurriculumLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listCurriculumsForLessons, {
          filter: {
            institutionID: {eq: formData?.institution?.id},
          },
        })
      );
      const curriculums = list.data?.listCurriculums?.items;
      setCurriculumList(curriculums);
      let selectedCurriculums: any = [];
      curriculums.map((curriculum: any) => {
        const assignedSyllabi = curriculum.universalSyllabus?.items.filter(
          (syllabus: any) =>
            syllabus.lessons?.items.filter((lesson: any) => lesson.lessonID === lessonId)
              .length
        );
        const isCourseAdded = Boolean(assignedSyllabi.length);
        if (isCourseAdded) {
          selectedCurriculums.push({
            ...curriculum,
            assignedSyllabi,
            // : assignedSyllabi.map((syllabus: any) => syllabus.name),
            assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.id),
          });
        }
      });
      setSelectedCurriculumList(selectedCurriculums);
      setCurriculumLoading(false);
    } catch (error) {
      setCurriculumLoading(false);
    }
  };

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?lessonId=${lessonId}&step=${step}`;
    setServerMessage({
      isError: false,
      message: ''
    })
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        message: 'Do you want to save changes before going?',
        url: redirectionUrl,
      });
    } else {
      history.push(redirectionUrl);
    }
  };
  const updateMeasurementList = async (rubrics: string[] | null) => {
    try {
      setUpdating(true);
      const newRubrics = rubrics.filter((rubric: any) => !rubric.id);
      if (newRubrics?.length) {
        await API.graphql(
          graphqlOperation(mutations.batchAddLessonRubrics, {
            lessonRubrics: newRubrics.map((rubric: any) => ({
              lessonID: lessonId,
              rubricID: rubric.rubricID,
            })),
          })
        );
      }
      const rubricsToBeRemoved = rubrics.filter(
        (rubric: any) => rubric.id && !rubric.checked
      );
      if (rubricsToBeRemoved?.length) {
        await API.graphql(
          graphqlOperation(mutations.batchDeleteLessonRubrics, {
            lessonRubrics: rubricsToBeRemoved.map((rubric: any) => ({
              id: rubric.id,
            })),
          })
        );
      }
      setServerMessage({
        isError: false,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['MEASUREMENTADDSUCCESS'],
      });
      setUnsavedChanges(false);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      setServerMessage({
        isError: true,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['UPDATEERR'],
      });
    }
  };

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <AddNewLessonForm
            lessonId={lessonId}
            changeLessonType={changeLessonType}
            formData={formData}
            setFormData={setFormData}
            designersList={designersList}
            selectedDesigners={selectedDesigners}
            setSelectedDesigners={setSelectedDesigners}
            postLessonCreation={postLessonCreation}
            allMeasurement={measurementList}
            institutionList={institutionList}
            setUnsavedChanges={setUnsavedChanges}
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
          <LessonCourse
            curriculumList={curriculumList}
            fetchCurriculum={fetchCurriculum}
            institution={formData?.institution}
            lessonId={lessonId}
            lessonPlans={universalLessonDetails?.lessonPlan}
            lessonType={formData.type?.value}
            loading={curriculumLoading}
            selectedCurriculums={selectedCurriculumList}
          />
        );
      case 'learning-evidence':
        return (
          <LearningEvidence
            fetchLessonRubrics={fetchLessonRubrics}
            institutionId={formData?.institution?.id}
            lessonId={lessonId}
            selectedMeasurements={selectedMeasurements}
            setSelectedMeasurements={setSelectedMeasurements}
            setUnsavedChanges={setUnsavedChanges}
            serverMessage={serverMessage}
            updating={updating}
            updateMeasurementList={updateMeasurementList}
          />
        );
    }
  };

  const [historyList, setHistoryList] = useState(['Overview']);

  const goBack = () => {
    const currentStepIdx = historyList.indexOf(activeStep);
    if (currentStepIdx < 0) {
      setHistoryList(['Overview']);
    } else if (historyList.length === 1) {
      history.goBack();
    } else {
      const prevStep: string = historyList[currentStepIdx - 1];
      setActiveStep(prevStep);
      historyList.pop();
      setHistoryList([...historyList]);
    }
  };

  const gobackToLessonsList = () => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      history.push('/dashboard/lesson-builder');
    }
  };

  const onModalSave = () => {
    goBack();
    toggleModal();
  };

  const saveBeforeLeave = async () => {
    if (activeStep === 'learning-evidence') {
      await updateMeasurementList(selectedMeasurements);
      setServerMessage({
        isError: false,
        message: '',
      });
      discardChanges();
    }
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
  };

  const toggleUnSaveModal = (url?: string) => {
    setWarnModal({
      ...warnModal,
      message: 'Do you want to save changes before going?',
      show: !warnModal.show,
      url,
    });
  };

  const discardChanges = () => {
    history.push(warnModal.url);
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
    setUnsavedChanges(false);
  };

  const fetchLessonRubrics = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listLessonRubricss, {
          filter: {
            lessonID: {eq: lessonId},
          },
        })
      );
      const rubricList = result.data?.listLessonRubricss.items.map((rubric: any) => ({
        ...rubric,
        checked: true,
      }));
      console.log(rubricList, 'rubricList+++++++++++');

      setSelectedMeasurements(rubricList);
    } catch (error) {}
  };

  const postLessonCreation = (lessonId: string, action?: string) => {
    const currentSteps = [...lessonBuilderSteps];
    const updatedState = currentSteps.map((item) => ({...item, isDisabled: false}));
    setLessonBuilderSteps(updatedState);
    setLessonId(lessonId);
    if (action === 'add') {
      const redirectionUrl = `${match.url}?lessonId=${lessonId}&step=activities`;
      history.push(redirectionUrl);
    }
    // if (formData.type?.id === '1') {
    //   setActiveStep('Preview Details');
    // } else {
    //   setActiveStep('Instructions');
    // }
  };

  const onInstructionSaved = (obj: InstructionInitialState) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonInstructions: obj,
    });
    setActiveStep('Builder');
  };

  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan,
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

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false,
    },
    {
      title: loading ? 'Loading...' : formData?.name,
      url: `${match.url}`,
      last: true,
    },
  ];

  const steps: IStepElementInterface[] = [
    {
      title: 'Overview',
      description: 'Capture core details of your lesson',
      stepValue: 'overview',
      icon: <IoCardSharp />,
      isComplete: true,
    },
    {
      title: 'Activities',
      description: 'Create class and home work here',
      stepValue: 'activities',
      icon: <FaQuestionCircle />,
      disabled: !Boolean(lessonId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
    {
      title: 'Courses',
      description: 'Assign lessons to courses',
      stepValue: 'courses',
      icon: <FaQuestionCircle />,
      disabled: !(universalLessonDetails && universalLessonDetails.lessonPlan?.length),
      isComplete: false,
      tooltipText: 'Create lesson activities in step 2 to continue',
    },
    {
      title: 'Learning Evidence',
      description: 'Link measurements to activities',
      stepValue: 'learning-evidence',
      icon: <FaQuestionCircle />,
      disabled: !(
        Boolean(selectedMeasurements?.length) || Boolean(selectedCurriculumList.length)
      ),
      isComplete: false,
      tooltipText: 'Assign your lesson to courses in step 3 to continue',
    },
  ];

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        items={breadCrumsList}
        unsavedChanges={unsavedChanges}
        toggleModal={toggleUnSaveModal}
      />
      <div className="flex justify-between">
        <SectionTitle
          title={LessonBuilderDict[userLanguage]['TITLE']}
          subtitle={LessonBuilderDict[userLanguage]['SUBTITLE']}
        />
        {/* <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={gobackToLessonsList}
            Icon={IoArrowUndoCircleOutline}
          />
        </div> */}
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3> */}
          <StepComponent
            steps={steps}
            activeStep={activeStep}
            handleTabSwitch={handleTabSwitch}
          />

          <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8">
            {loading ? (
              <div className="h-100 flex justify-center items-center">
                <div className="w-5/10">
                  <Loader />
                  <p className="mt-2 text-center">
                    Fetching lesson details please wait...
                  </p>
                </div>
              </div>
            ) : (
              <div className="">{currentStepComp(activeStep)}</div>
            )}
          </div>
        </div>
        {warnModal.show && (
          <ModalPopUp
            closeAction={discardChanges}
            saveAction={saveBeforeLeave}
            saveLabel="Yes"
            message={warnModal.message}
          />
        )}
        {warnModal2.show && (
          <ModalPopUp
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
        )}
        {warnModal2.show && warnModal2.message.includes('required fields') && (
          <ModalPopUp
            closeAction={() => {
              setActiveStep(warnModal2.stepOnHold);
              setHistoryList([...historyList, warnModal2.stepOnHold]);
              setWarnModal2({show: false, message: '', stepOnHold: ''});
              setIndividualFieldEmpty(false);
            }}
            saveAction={() => setWarnModal2({show: false, message: '', stepOnHold: ''})}
            saveLabel="Sure"
            saveTooltip="Fill up required fields"
            cancelTooltip={`Just go to ${warnModal2.stepOnHold}`}
            cancelLabel="Discard"
            message={warnModal2.message}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default LessonBuilder;
