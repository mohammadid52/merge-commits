import React, {useState, useEffect, Fragment, useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';
import {IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp} from 'react-icons/io5';
import {FaRegEye, FaQuestionCircle, FaUnity} from 'react-icons/fa';
import findIndex from 'lodash/findIndex';
import * as customMutations from '../../../../customGraphql/customMutations';
import * as mutations from '../../../../graphql/mutations';
import * as customQueries from '../../../../customGraphql/customQueries';

import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import WizardScroller from '../../../Atoms/WizardScroller';

import GeneralInformation from './StepActionComponent/GeneralInformation';
import AssessmentInstuctions from './StepActionComponent/AssessmentInstuctions';
import CheckpointBuilder from './StepActionComponent/CheckpointBuilder';
import PreviewForm from './StepActionComponent/PreviewForm';
import UnitLookup from './StepActionComponent/UnitLookup';

import {InitialData} from './LessonBuilder';
import {languageList} from '../../../../utilities/staticData';
import ModalPopUp from '../../../Molecules/ModalPopUp';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import useDictionary from '../../../../customHooks/dictionary';
import {AddNewCheckPointDict} from '../../../../dictionary/dictionary.iconoclast';
import {isEmpty} from 'lodash';

interface LessonEditProps {
  designersList: any[];
}
export interface InstructionInitialState {
  introductionTitle: string;
  instructionsTitle: string;
  summaryTitle: string;
  introduction: string;
  instructions: string;
  summary: string;
}
export interface LessonPlansProps {
  type: string;
  LessonComponentID: string;
  sequence: number;
  stage: string;
}
export interface SavedLessonDetailsProps {
  lessonPlans: LessonPlansProps[] | null;
  lessonInstructions: InstructionInitialState | null;
}
const LessonEdit = (props: LessonEditProps) => {
  const {designersList} = props;
  const history = useHistory();
  const match = useRouteMatch();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const lessonId = params.get('lessonId');
  const assessmentId = params.get('assessmentId');
  const lessonType = !lessonId && assessmentId ? 'assessment' : 'lesson';

  const initialData = {
    name: '',
    type: {id: '', name: '', value: ''},
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    institution: {id: '', name: '', value: ''},
    languages: [{id: '1', name: 'English', value: 'EN'}],
    language: [''],
  };
  const instructionInitialState = {
    introductionTitle: '',
    instructionsTitle: '',
    summaryTitle: '',
    introduction: '',
    instructions: '',
    summary: '',
  };
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState,
  });
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  // const [activeStep, setActiveStep] = useState('Assign Unit');
  const [activeStep, setActiveStep] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, LessonEditDict} = useDictionary(clientKey);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE'],
  });
  const [warnModal2, setWarnModal2] = useState({
    stepOnHold: '',
    show: false,
    message: '',
  });

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSONPLANBUILDER'],
      url: `${match.url}?${
        lessonId ? `lessonId=${lessonId}}` : `assessmentId=${assessmentId}`
      }`,
      last: true,
    },
  ];
  const assessmentScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    {name: 'Instructions', icon: <IoDocumentText />},
    {name: 'Builder', icon: <FaQuestionCircle />},
    {name: 'Assign Unit', icon: <FaUnity />},
    {name: 'Preview Details', icon: <FaRegEye />},
  ];
  const lessonScrollerStep = [
    {name: 'Overview', icon: <IoCardSharp />},
    // { name: "Assign Unit", icon: <FaUnity /> },
    {name: 'Preview Details', icon: <FaRegEye />},
  ];

  const typeList: any = [
    {id: '1', name: 'Lesson', value: 'lesson'},
    {id: '2', name: 'Assessment', value: 'assessment'},
    {id: '3', name: 'Survey', value: 'survey'},
  ];

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
        };
      });
      setMeasurementList(filteredList);
    } catch {
      console.log('Error while fetching lesson data');
    }
  };

  const fetchLessonDetails = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getLesson, {
          id: lessonId || assessmentId,
        })
      );
      const savedData = result.data.getLesson;

      setFormData({
        ...formData,
        name: savedData.title,
        type:
          savedData.type && typeList.find((item: any) => item.value === savedData.type),
        purposeHtml: savedData?.purpose ? savedData.purpose : '<p></p>',
        objectiveHtml: savedData.objectives ? savedData.objectives[0] : '<p></p>',
        languages: savedData.language.map((it: any) =>
          languageList.find((it2: any) => it2.value === it)
        ),
        institution: {
          id: savedData?.institution?.id,
          name: savedData?.institution?.name,
          value: savedData?.institution?.name,
        },
      });
      setSavedLessonDetails({
        ...savedLessonDetails,
        lessonPlans: savedData.lessonPlan?.sort(
          (a: any, b: any) => a?.sequence - b?.sequence
        ),
        lessonInstructions: {
          introductionTitle: savedData.introductionTitle,
          instructionsTitle: savedData.instructionsTitle,
          summaryTitle: savedData.summaryTitle,
          introduction: savedData.introduction,
          instructions: savedData.instructions,
          summary: savedData.summary,
        },
      });
      const designers = designersList.filter((item: any) =>
        savedData?.designers?.includes(item.id)
      );
      setSelectedDesigners(designers);
      setLoading(false);
    } catch {
      console.log('Error while fetching lesson data');
      history.push(`/dashboard/lesson-builder`);
    }
  };

  const checkValidUrl = async () => {
    if ((!lessonId && !assessmentId) || (lessonId && assessmentId)) {
      console.log('Invalid url');
      history.push(`/dashboard/lesson-builder`);
    } else {
      setLoading(true);
      fetchLessonDetails();
      fetchMeasurementList();
    }
  };

  const updateInstructions = (obj: InstructionInitialState) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonInstructions: obj,
    });
  };
  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan,
    });
  };

  useEffect(() => {
    checkValidUrl();
  }, []);

  const [isCheckpUnsaved, setIsCheckpUnsaved] = useState<boolean>(false);
  const [unSavedCheckPData, setUnsavedCheckPData] = useState<any>({title: ''});

  const [checkpQuestions, setCheckpQuestions] = useState<any>([]);
  const [selDesigners, setSelDesigners] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [savingUnsavedCP, setSavingUnsavedCP] = useState(false);

  const hasUnsavedCheckpoint = (
    val: boolean,
    data: any,
    checkpQuestions: any,
    selDesigners: any[]
  ) => {
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
          lessonID: lessonId || assessmentId,
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
                id: lessonId || assessmentId,
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
      console.log('clicked on cancel button');

      setWarnModal2({
        ...warnModal2,
        show: false,
      });
    } else {
      // clicked on no button
      console.log('clicked on no button');

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
      case 'Overview':
        return (
          <GeneralInformation
            setUnsavedChanges={setUnsavedChanges}
            formData={formData}
            setFormData={setFormData}
            designersList={designersList}
            selectedDesigners={selectedDesigners}
            setSelectedDesigners={setSelectedDesigners}
            lessonId={lessonId || assessmentId}
            allMeasurement={measurementList}
            lessonMeasurements={selectedMeasurement}
            setLessonMeasurements={setSelectedMeasurement}
          />
        );
      case 'Instructions':
        return (
          <AssessmentInstuctions
            lessonId={lessonId || assessmentId}
            savedInstructions={savedLessonDetails?.lessonInstructions}
            updateParentState={updateInstructions}
            lessonType={formData.type?.value}
            lessonName={formData.name}
            setUnsavedChanges={setUnsavedChanges}
          />
        );
      case 'Builder':
        return (
          <CheckpointBuilder
            lessonPlans={savedLessonDetails.lessonPlans}
            updateLessonPlan={updateLessonPlan}
            designersList={designersList}
            lessonID={lessonId || assessmentId}
            setUnsavedChanges={setUnsavedChanges}
            activeStep={activeStep}
            lessonName={formData.name}
            lessonType={formData.type?.value}
            hasUnsavedCheckpoint={(
              val: boolean,
              data: any,
              data2: any,
              selectedDesigners: any[]
            ) => hasUnsavedCheckpoint(val, data, data2, selectedDesigners)}
          />
        );
      case 'Preview Details':
        return (
          <PreviewForm
            lessonName={formData.name}
            enablePublish
            lessonID={lessonId || assessmentId}
            lessonPlans={savedLessonDetails.lessonPlans || []}
            lessonType={formData.type?.value}
          />
        );
      case 'Assign Unit':
        return (
          <UnitLookup
            lessonName={formData.name}
            lessonId={lessonId || assessmentId}
            institution={formData.institution}
            lessonType={formData.type?.value}
            lessonPlans={savedLessonDetails.lessonPlans}
          />
        );
      // default:
      //   return <GeneralInformation
      //     formData={formData}
      //     setFormData={setFormData}
      //     designersList={designersList}
      //     selectedDesigners={selectedDesigners}
      //     setSelectedDesigners={setSelectedDesigners}
      //     lessonId={lessonId || assessmentId}
      //   />;
    }
  };

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        unsavedChanges={unsavedChanges}
        toggleModal={toggleModal}
        items={breadCrumsList}
      />
      <div className="flex justify-between">
        <SectionTitle
          title={LessonEditDict[userLanguage]['TITLE']}
          subtitle={LessonEditDict[userLanguage]['SUBTITLE']}
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
          <div className="grid grid-cols-5 divide-x-0 divide-gray-400 p-4">
            <div className="sm:col-span-1">
              <WizardScroller
                stepsList={
                  lessonType === 'lesson' ? lessonScrollerStep : assessmentScrollerStep
                }
                activeStep={activeStep}
                setActiveStep={(step) => {
                  if (isCheckpUnsaved && showModal && step !== 'Builder') {
                    setWarnModal2({
                      ...warnModal2,
                      stepOnHold: step,
                      show: true,
                      message: 'You have unsaved checkpoint. Do you want to save it?',
                    });
                  } else {
                    setActiveStep(step);
                    setHistoryList([...historyList, step]);
                  }
                }}
              />
            </div>
            <div className="sm:col-span-4">
              {loading ? (
                <p className="h-100 flex justify-center items-center">
                  Fetching lesson details pleas wait...
                </p>
              ) : (
                <Fragment>
                  <div className="mx-6">{currentStepComp(activeStep)}</div>
                </Fragment>
              )}
            </div>
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
        {warnModal2.show && showModal && (
          <ModalPopUp
            noButton="No"
            noButtonAction={() => onCheckpointModalClose(false)}
            closeAction={onCheckpointModalClose}
            saveAction={saveNewCheckPoint}
            saveLabel="Yes"
            cancelLabel="Cancel"
            message={warnModal2.message}
            loading={savingUnsavedCP}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default LessonEdit;
