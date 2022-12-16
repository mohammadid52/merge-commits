import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {FaQuestionCircle, FaRegEye} from 'react-icons/fa';
import {IoCardSharp, IoDocumentText} from 'react-icons/io5';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';
import {GlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import * as mutations from 'graphql/mutations';
import {LessonPlansProps, SavedLessonDetailsProps} from 'interfaces/LessonInterfaces';
import {getImageFromS3Static} from 'utilities/services';
import {languageList, lessonTypeList} from 'utilities/staticData';
import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import ModalPopUp from 'molecules/ModalPopUp';
import AddNewLessonForm from './StepActionComponent/AddNewLessonForm/AddNewLessonForm';
import LearningEvidence from './StepActionComponent/LearningEvidence/LearningEvidence';
import LessonActivities from './StepActionComponent/LessonActivities';
import LessonCourse from './StepActionComponent/LessonCourse/LessonCourse';
import {logError} from '@graphql/functions';
import useAuth from '@customHooks/useAuth';
import {UpdateUniversalLessonInput} from 'API';

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
  notes?: string;
  notesHtml?: string;
  languages: {id: string; name: string; value: string}[];
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
  name: string;
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
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {setUniversalLessonDetails, universalLessonDetails} = useULBContext();
  const {AddNewLessonFormDict, LessonBuilderDict} = useDictionary(clientKey);

  const initialData = {
    name: '',
    id: '',
    type: {id: '', name: '', value: ''},
    duration: '1',
    purpose: '',
    purposeHtml: '<p></p>',
    studentMaterials: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    notes: '',
    notesHtml: '<p></p>',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    institution: {id: instId, name: '', value: instId},
    language: [''],
    imageUrl: '',
    imageCaption: '',
    studentSummary: '',
    lessonPlan: [{}],
    targetAudience: ''
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

  const [designersList, setDesignersList] = useState([]);
  const [designerListLoading, setDesignersListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState([]);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState
  });
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [curriculumList, setCurriculumList] = useState([]);
  const [selectedCurriculumList, setSelectedCurriculumList] = useState([]);
  const [addedSyllabus, setAddedSyllabus] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [activeStep, setActiveStep] = useState('overview');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);
  const [institutionData, setInstitutionData] = useState<any>(null);
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
      const listStaffs = staffList.data.listStaff;
      const updatedList = listStaffs?.items.map((item: any) => ({
        id: item?.id,
        name: `${item?.staffMember?.firstName || ''} ${item?.staffMember.lastName || ''}`,
        value: `${item?.staffMember?.firstName || ''} ${item?.staffMember.lastName || ''}`
      }));
      setDesignersList(updatedList);
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
  const [selDesigners, setSelDesigners] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [savingUnsavedCP, setSavingUnsavedCP] = useState(false);
  const [individualFieldEmpty, setIndividualFieldEmpty] = useState(false);
  const [institutionCollection, setInstitutionCollection] = useState([]);

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
      setUniversalLessonDetails(savedData);

      if (savedData.institutionID) {
        const institution = await getInstitutionByID(savedData.institutionID);

        setInstitutionData(institution);
        setSelectedMeasurements(getRubricsData(savedData?.rubrics || []));
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
          name: savedData.title,
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
        let [lessonCheckpoint, lesson]: any = await Promise.all([
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
        let questions = Promise.all(
          checkpQuestions.map(async (item: any) =>
            addCheckpointQuestions(item.id, newCheckpoint.id, item.required)
          )
        );
        let checkpQuestionsIds = checkpQuestions.map((item: any) => item.id);
        let seqItem: any = await API.graphql(
          graphqlOperation(mutations.createCSequences, {
            input: {id: `Ch_Ques_${newCheckpoint.id}`, sequence: checkpQuestionsIds}
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
      setShowModal(false);
      setUnsavedChanges(false);
      setUnsavedCheckPData({});
      setCheckpQuestions([]);
    }
  };

  const fetchCurriculum = async (assignedSyllabus: any = addedSyllabus) => {
    try {
      setCurriculumLoading(true);
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurricula, {
          filter: {
            institutionID: {eq: formData?.institution?.id}
          }
        })
      );
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

      setInstitutionCollection(curriculumIds);

      const curriculums = list.data?.listCurriculums?.items;
      setCurriculumList(curriculums);
      let selectedCurriculums: any = [];
      curriculums.map((curriculum: any) => {
        const addedSyllabusIds = assignedSyllabus.map((item: any) => item.syllabusID);
        const assignedSyllabi = curriculum.universalSyllabus?.items.find(
          (syllabus: any) => addedSyllabusIds.includes(syllabus.unitId)
        );
        const isCourseAdded = Boolean(assignedSyllabi);
        if (isCourseAdded) {
          selectedCurriculums.push({
            ...curriculum,
            assignedSyllabi,
            // : assignedSyllabi.map((syllabus: any) => syllabus.name),
            assignedSyllabusId: assignedSyllabi.map((syllabus: any) => syllabus.unitId)
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
  const updateMeasurementList = async (rubrics: any[] | null) => {
    try {
      setUpdating(true);

      setServerMessage({
        isError: false,
        message: AddNewLessonFormDict[userLanguage]['MESSAGES']['MEASUREMENTADDSUCCESS']
      });

      setUnsavedChanges(false);
      setUpdating(false);
      setSelectedMeasurements(rubrics);

      const input: UpdateUniversalLessonInput = {
        id: formData.id,
        rubrics: rubrics.map((d) => d?.rubricID).filter(Boolean)
      };

      await API.graphql(
        graphqlOperation(customMutations.updateUniversalLesson, {input: input})
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
            allMeasurement={measurementList}
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
          <LessonCourse
            institutionCollection={institutionCollection}
            curriculumList={curriculumList}
            fetchCurriculum={fetchCurriculum}
            institution={formData?.institution}
            lessonId={lessonId}
            lessonName={formData?.name}
            lessonPlans={universalLessonDetails?.lessonPlan}
            lessonType={formData.type?.value}
            loading={curriculumLoading || updating}
            selectedCurriculums={selectedCurriculumList}
            addedSyllabus={addedSyllabus}
            setAddedSyllabus={setAddedSyllabus}
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
    try {
      // const result: any = await API.graphql(
      //   graphqlOperation(customQueries.listLessonRubricss, {
      //     filter: {
      //       lessonID: {eq: lessonId},
      //     },
      //   })
      // );
      // const rubricList = result.data?.listLessonRubricss.items.map((rubric: any) => ({
      //   ...rubric,
      //   checked: true,
      // }));
      // setSelectedMeasurements(rubricList);
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
      stepValue: 'overview',
      icon: <IoCardSharp />,
      isComplete: true
    },
    {
      title: LessonBuilderDict[userLanguage]['ACTIVITY_TITLE'],
      description: LessonBuilderDict[userLanguage]['ACTIVITY_DESCRIPTION'],
      stepValue: 'activities',
      icon: <FaQuestionCircle />,
      disabled: !Boolean(lessonId),
      isComplete: false,
      tooltipText: LessonBuilderDict[userLanguage]['ACTIVITY_TOOLTIP']
    },
    {
      title: LessonBuilderDict[userLanguage]['UNIT_MANAGER_TITLE'],
      description: LessonBuilderDict[userLanguage]['UNIT_MANAGER_DESCRIPTION'],
      stepValue: 'courses',
      icon: <FaQuestionCircle />,
      disabled: !(universalLessonDetails && universalLessonDetails.lessonPlan?.length),
      isComplete: false,
      tooltipText: LessonBuilderDict[userLanguage]['UNIT_MANAGER_TOOLTIP']
    },
    {
      title:
        LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_COLUMNS'][
          'LEARNING_OBJECTIVE'
        ],
      description: LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_DESCRIPTION'],
      stepValue: 'learning-evidence',
      icon: <FaQuestionCircle />,
      disabled: !(Boolean(selectedMeasurements?.length) || Boolean(addedSyllabus.length)),
      isComplete: false,
      tooltipText: LessonBuilderDict[userLanguage]['LEARNING_EVIDENCE_TOOLTIP']
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

        <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-2 xl:px-8">
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
            // <div>
            //   <AnimatedContainer show={activeStep === 'overview'} {...animationProps}>
            //     {activeStep === 'overview' && (
            //       <AddNewLessonForm
            //         lessonId={lessonId}
            //         changeLessonType={changeLessonType}
            //         formData={formData}
            //         setFormData={setFormData}
            //         designerListLoading={designerListLoading}
            //         designersList={designersList}
            //         selectedDesigners={selectedDesigners}
            //         setSelectedDesigners={setSelectedDesigners}
            //         postLessonCreation={postLessonCreation}
            //         allMeasurement={measurementList}
            //         institutionList={institutionList}
            //         setUnsavedChanges={setUnsavedChanges}
            //         fetchStaffByInstitution={fetchStaffByInstitution}
            //       />
            //     )}
            //   </AnimatedContainer>
            //   <AnimatedContainer show={activeStep === 'activities'} {...animationProps}>
            //     {activeStep === 'activities' && (
            //       <LessonActivities
            //         loading={loading}
            //         lessonId={lessonId}
            //         lessonName={formData?.name}
            //         universalLessonDetails={universalLessonDetails}
            //       />
            //     )}
            //   </AnimatedContainer>
            //   <AnimatedContainer show={activeStep === 'courses'} {...animationProps}>
            //     {activeStep === 'courses' && (
            //       <LessonCourse
            //         institutionCollection={institutionCollection}
            //         curriculumList={curriculumList}
            //         fetchCurriculum={fetchCurriculum}
            //         institution={formData?.institution}
            //         lessonId={lessonId}
            //         lessonPlans={universalLessonDetails?.lessonPlan}
            //         lessonType={formData.type?.value}
            //         loading={curriculumLoading}
            //         selectedCurriculums={selectedCurriculumList}
            //       />
            //     )}
            //   </AnimatedContainer>
            //   <AnimatedContainer
            //     show={activeStep === 'learning-evidence'}
            //     {...animationProps}>
            //     {activeStep === 'learning-evidence' && (
            //       <LearningEvidence
            //         fetchLessonRubrics={fetchLessonRubrics}
            //         institutionId={formData?.institution?.id}
            //         lessonId={lessonId}
            //         selectedMeasurements={selectedMeasurements}
            //         setSelectedMeasurements={setSelectedMeasurements}
            //         setUnsavedChanges={setUnsavedChanges}
            //         serverMessage={serverMessage}
            //         updating={updating}
            //         updateMeasurementList={updateMeasurementList}
            //       />
            //     )}
            //   </AnimatedContainer>
            // </div>
          )}
        </div>
      </div>
      {warnModal.show && (
        <ModalPopUp
          closeAction={discardChanges}
          saveAction={saveBeforeLeave}
          saveLabel="Yes"
          message={warnModal.message}
          loading={updating}
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
      {/* </PageWrapper> */}
    </div>
  );
};

export default LessonBuilder;
