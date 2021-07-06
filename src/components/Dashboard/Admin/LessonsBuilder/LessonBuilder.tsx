import React, {useState, useEffect, useContext} from 'react';
import API, {graphqlOperation} from '@aws-amplify/api';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp} from 'react-icons/io5';
import {FaRegEye, FaQuestionCircle} from 'react-icons/fa';

import * as customMutations from '../../../../customGraphql/customMutations';
import * as mutations from '../../../../graphql/mutations';
import * as queries from '../../../../graphql/queries';
import * as customQueries from '../../../../customGraphql/customQueries';

import ModalPopUp from '../../../Molecules/ModalPopUp';
import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import Loader from '../../../Atoms/Loader';
import StepComponent, { IStepElementInterface } from '../../../Atoms/StepComponent';
import WizardScroller from '../../../Atoms/WizardScroller';

import AddNewLessonForm from './StepActionComponent/AddNewLessonForm';
import AssessmentInstuctions from './StepActionComponent/AssessmentInstuctions';
import CheckpointBuilder from './StepActionComponent/CheckpointBuilder';
import PreviewForm from './StepActionComponent/PreviewForm';
import {
  InstructionInitialState,
  SavedLessonDetailsProps,
  LessonPlansProps,
} from './LessonEdit';
import useDictionary from '../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {languageList, lessonTypeList} from '../../../../utilities/staticData';
import {useQuery} from '../../../../customHooks/urlParam';

export interface InitialData {
  name: string;
  type: InputValueObject;
  duration: string;
  purpose: string;
  purposeHtml: string;
  objective: string;
  objectiveHtml: string;
  languages: {id: string; name: string; value: string}[];
  institution?: InputValueObject;
  language: string[];
  imageCaption?: string;
  imageUrl?: string;
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
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, BUTTONS, LessonBuilderDict} = useDictionary(clientKey);
  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSONPLANBUILDER'],
      url: `${match.url}`,
      last: true,
    },
  ];

  const initialData = {
    name: '',
    type: {id: '', name: '', value: ''},
    duration: '1',
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
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
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState([]);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState,
  });
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [lessonId, setLessonId] = useState(params.get('lessonId') || '');
  const [activeStep, setActiveStep] = useState('overview');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonBuilderDict[userLanguage]['MESSAGES']['UNSAVE'],
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
        graphqlOperation(queries.getUniversalLesson, {
          id: lessonId,
        })
      );
      const savedData = result.data.getUniversalLesson;

      if (savedData.institutionID) {
        const institution = await getInstitutionByID(savedData.institutionID);

        setFormData({
          ...formData,
          ...savedData,
          imageCaption: savedData.cardCaption,
          imageUrl: savedData.cardUrl,
          name: savedData.title,
          type:
            savedData.type &&
            lessonTypeList.find((item: any) => item.value === savedData.type),
          purposeHtml: savedData?.purpose ? savedData.purpose : '',
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
    }
  }, []);

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
            lessonMeasurements={selectedMeasurement}
            setLessonMeasurements={setSelectedMeasurement}
            institutionList={institutionList}
            setUnsavedChanges={setUnsavedChanges}
          />
        );
      case 'Instructions':
        return (
          <AssessmentInstuctions
            lessonId={lessonId}
            setUnsavedChanges={setUnsavedChanges}
            savedInstructions={savedLessonDetails?.lessonInstructions}
            updateParentState={(obj) => onInstructionSaved(obj)}
            lessonType={formData.type?.value}
            lessonName={formData.name}
          />
        );
      case 'Builder':
        return (
          <CheckpointBuilder
            lessonPlans={savedLessonDetails?.lessonPlans}
            designersList={designersList}
            lessonID={lessonId}
            updateLessonPlan={updateLessonPlan}
            setUnsavedChanges={setUnsavedChanges}
            activeStep={activeStep}
            lessonName={formData.name}
            lessonType={formData.type?.value}
            hasUnsavedCheckpoint={(
              val: boolean,
              isIndividualEmpty: boolean,
              data: any,
              data2: any,
              selectedDesigners: any[]
            ) =>
              hasUnsavedCheckpoint(val, isIndividualEmpty, data, data2, selectedDesigners)
            }
          />
        );
      case 'Preview Details':
        return (
          <PreviewForm
            lessonName={formData.name}
            lessonID={lessonId}
            lessonPlans={savedLessonDetails.lessonPlans || []}
            lessonType={formData.type?.value}
          />
        );
      // default:
      //   return <AddNewLessonForm
      //     changeLessonType={changeLessonType}
      //     formData={formData}
      //     setFormData={setFormData}
      //     designersList={designersList}
      //     selectedDesigners={selectedDesigners}
      //     setSelectedDesigners={setSelectedDesigners}
      //     postLessonCreation={postLessonCreation}
      //   />;
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
      goBack();
    }
  };

  const onModalSave = () => {
    goBack();
    toggleModal();
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
  };
  const fetchMeasurementList = async () => {
    try {
      let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics));
      list = list.data.listRubrics?.items || [];
      const measuList = list.sort((a: any, b: any) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );
      const filteredList = measuList.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.name,
          topic: item?.topic?.name,
        };
      });
      setMeasurementList(filteredList);
    } catch {
      console.log('Error while fetching lesson data');
    }
  };

  const postLessonCreation = (lessonId: string) => {
    const currentSteps = [...lessonBuilderSteps];
    const updatedState = currentSteps.map((item) => ({...item, isDisabled: false}));
    setLessonBuilderSteps(updatedState);
    setLessonId(lessonId);
    const redirectionUrl = `${match.url.replace('add', `view?lessonId=${lessonId}`)}`;
    history.push(redirectionUrl);
    if (formData.type?.id === '1') {
      setActiveStep('Preview Details');
    } else {
      setActiveStep('Instructions');
    }
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

  // useEffect(() => {
  //   fetchMeasurementList();
  // }, []);

  const steps: IStepElementInterface[] = [
    {
      title: 'Overview',
      step: 'overview',
      icon: <IoCardSharp />,
      isComplete: true,
    },
    {
      title: 'Activities',
      step: 'activities',
      icon: <FaQuestionCircle />,
      disabled: true,
      isComplete: false,
    },
    {
      title: 'Courses',
      step: 'courses',
      icon: <FaQuestionCircle />,
      disabled: true,
      isComplete: false,
    },
    {
      title: 'Learning Evidence',
      step: 'learning-evidence',
      icon: <FaQuestionCircle />,
      disabled: true,
      isComplete: false,
    },
  ];

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        items={breadCrumsList}
        unsavedChanges={unsavedChanges}
        toggleModal={toggleModal}
      />
      <div className="flex justify-between">
        <SectionTitle
          title={LessonBuilderDict[userLanguage]['TITLE']}
          subtitle={LessonBuilderDict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={gobackToLessonsList}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3> */}
          <StepComponent steps={steps} activeStep={activeStep} />

          <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8">
            <div className="">{currentStepComp(activeStep)}</div>
            {/* <div className="sm:col-span-1"> */}
            {/* <WizardScroller
                stepsList={lessonBuilderSteps}
                activeStep={activeStep}
                setActiveStep={(step) => {
                  if (individualFieldEmpty) {
                    setWarnModal2({
                      stepOnHold: step,
                      show: true,
                      message: 'Please fill all required fields to save this checkpoint',
                    });
                  } else if (isCheckpUnsaved && showModal && step !== 'Builder') {
                    setIndividualFieldEmpty(false);
                    setWarnModal2({
                      ...warnModal2,
                      stepOnHold: step,
                      show: true,
                      message: 'You have unsaved checkpoint. Do you want to save it?',
                    });
                  } else {
                    setIndividualFieldEmpty(false);

                    setActiveStep(step);
                    setHistoryList([...historyList, step]);
                  }
                }}
              /> */}
            {/* </div> */}
            {/* <div>
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
                  lessonMeasurements={selectedMeasurement}
                  setLessonMeasurements={setSelectedMeasurement}
                  institutionList={institutionList}
                  setUnsavedChanges={setUnsavedChanges}
                />
              )}
            </div> */}
          </div>
        </div>
        {warnModal.show && (
          <ModalPopUp
            closeAction={toggleModal}
            saveAction={onModalSave}
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
