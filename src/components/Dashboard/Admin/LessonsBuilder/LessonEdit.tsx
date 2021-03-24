import React, { useState, useEffect, Fragment } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp } from 'react-icons/io5';
import { FaRegEye, FaQuestionCircle, FaUnity } from 'react-icons/fa';

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

import { InitialData } from './LessonBuilder';
import { languageList } from '../../../../utilities/staticData'
import ModalPopUp from '../../../Molecules/ModalPopUp';

interface LessonEditProps {
  designersList: any[]
}
export interface InstructionInitialState {
  introductionTitle: string,
  instructionsTitle: string,
  summaryTitle: string,
  introduction: string,
  instructions: string,
  summary: string
}
export interface LessonPlansProps {
  type: string,
  LessonComponentID: string,
  sequence: number,
  stage: string
}
export interface SavedLessonDetailsProps {
  lessonPlans: LessonPlansProps[] | null
  lessonInstructions: InstructionInitialState | null
}
const LessonEdit = (props: LessonEditProps) => {
  const { designersList } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const lessonId = params.get('lessonId');
  const assessmentId = params.get('assessmentId');
  const lessonType = (!lessonId && assessmentId) ? 'assessment' : 'lesson';

  const initialData = {
    name: '',
    type: { id: '', name: '', value: '' },
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
    institution: { id: '', name: '', value: '' },
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }
  const instructionInitialState = {
    introductionTitle: '',
    instructionsTitle: '',
    summaryTitle: '',
    introduction: '',
    instructions: '',
    summary: ''
  }
  const [formData, setFormData] = useState<InitialData>(initialData);
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState
  });
  const [measurementList, setMeasurementList] = useState([]);
  const [selectedMeasurement, setSelectedMeasurement] = useState([]);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  // const [activeStep, setActiveStep] = useState('Assign Unit');
  const [activeStep, setActiveStep] = useState('Overview');
  const [loading, setLoading] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: "You have unsaved changes, do you still want to continue?"
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Lessons', url: '/dashboard/lesson-builder', last: false },
    {
      title: 'Lesson Plan Builder',
      url: `${match.url}?${lessonId ? `lessonId=${lessonId}}` : `assessmentId=${assessmentId}`}`,
      last: true
    },
  ]
  const assessmentScrollerStep = [
    { name: "Overview", icon: <IoCardSharp /> },
    { name: "Instructions", icon: <IoDocumentText /> },
    { name: "Builder", icon: <FaQuestionCircle /> },
    { name: "Assign Unit", icon: <FaUnity /> },
    { name: "Preview Details", icon: <FaRegEye /> },
  ];
  const lessonScrollerStep = [
    { name: "Overview", icon: <IoCardSharp /> },
    // { name: "Assign Unit", icon: <FaUnity /> },
    { name: "Preview Details", icon: <FaRegEye /> },
  ];

  const typeList: any = [
    { id: '1', name: 'Lesson', value: 'lesson' },
    { id: '2', name: 'Assessment', value: 'assessment' },
    { id: '3', name: 'Survey', value: 'survey' }
  ];
  const goBack = () => {
    history.push('/dashboard/lesson-builder')
  }

  const gobackToLessonsList = () => {
    if (activeStep === 'Builder' && unsavedChanges) {
      toggleModal();
    } else {
      history.goBack();
    }
  }

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    });
  }

  const fetchMeasurementList = async () => {
    try {
      let list: any = await API.graphql(graphqlOperation(customQueries.listRubrics));
      list = list.data.listRubrics?.items || []
      const measuList = list.sort((a: any, b: any) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
      const filteredList = measuList.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          value: item.name
        }
      })
      setMeasurementList(filteredList);
    } catch {
      console.log("Error while fetching lesson data");
    }
  }

  const fetchLessonDetails = async () => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.getLesson, {
        id: lessonId || assessmentId
      }))
      const savedData = result.data.getLesson;
      setFormData({
        ...formData,
        name: savedData.title,
        type: savedData.type && typeList.find((item: any) => item.value === savedData.type),
        purposeHtml: savedData?.purpose ? savedData.purpose : '<p></p>',
        objectiveHtml: savedData.objectives ? savedData.objectives[0] : '<p></p>',
        languages: savedData.language ? languageList.filter((item: any) => savedData.language.includes(item.value)) : [],
        institution: { id: savedData?.institution?.id, name: savedData?.institution?.name, value: savedData?.institution?.name }
      });
      setSavedLessonDetails({
        ...savedLessonDetails,
        lessonPlans: savedData.lessonPlan?.sort((a: any, b: any) => a?.sequence - b?.sequence),
        lessonInstructions: {
          introductionTitle: savedData.introductionTitle,
          instructionsTitle: savedData.instructionsTitle,
          summaryTitle: savedData.summaryTitle,
          introduction: savedData.introduction,
          instructions: savedData.instructions,
          summary: savedData.summary
        }
      })
      const designers = designersList.filter((item: any) => savedData?.designers?.includes(item.id));
      setSelectedDesigners(designers)
      setLoading(false);
    } catch {
      console.log("Error while fetching lesson data");
      history.push(`/dashboard/lesson-builder`)
    }
  }

  const checkValidUrl = async () => {
    if ((!lessonId && !assessmentId) || (lessonId && assessmentId)) {
      console.log('Invalid url')
      history.push(`/dashboard/lesson-builder`)
    } else {
      setLoading(true)
      fetchLessonDetails();
      fetchMeasurementList();
    }
  }

  const updateInstructions = (obj: InstructionInitialState) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonInstructions: obj
    })
  }
  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan
    })
  }

  useEffect(() => {
    checkValidUrl();
  }, [])

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'Overview':
        return <GeneralInformation
          formData={formData}
          setFormData={setFormData}
          designersList={designersList}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          lessonId={lessonId || assessmentId}
          allMeasurement={measurementList}
          lessonMeasurements={selectedMeasurement}
          setLessonMeasurements={setSelectedMeasurement}
        />;
      case 'Instructions':
        return <AssessmentInstuctions
          lessonId={lessonId || assessmentId}
          savedInstructions={savedLessonDetails?.lessonInstructions}
          updateParentState={updateInstructions}
          lessonType={formData.type?.value}
          lessonName={formData.name}
        />;
      case 'Builder':
        return <CheckpointBuilder
          lessonPlans={savedLessonDetails.lessonPlans}
          updateLessonPlan={updateLessonPlan}
          designersList={designersList}
          lessonID={lessonId || assessmentId}
          setUnsavedChanges={setUnsavedChanges}
          activeStep={activeStep}
          lessonName={formData.name}
          lessonType={formData.type?.value}
        />;
      case 'Preview Details':
        return <PreviewForm
          lessonName={formData.name}
          enablePublish
          lessonID={lessonId || assessmentId}
          lessonPlans={savedLessonDetails.lessonPlans}
          lessonType={formData.type?.value}
        />;
      case 'Assign Unit':
        return <UnitLookup
          lessonName={formData.name}
          lessonId={lessonId || assessmentId}
          institution={formData.institution}
          lessonType={formData.type?.value}
          lessonPlans={savedLessonDetails.lessonPlans}
          />;
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
  }

  return (
    <div className="w-full h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="LESSON PLAN BUILDER" subtitle="Build lessons, surveys or assessments here." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={gobackToLessonsList} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3> */}
          <div className="grid grid-cols-5 divide-x divide-gray-400 p-4">
            <div className="sm:col-span-1">
              <WizardScroller stepsList={lessonType === 'lesson' ? lessonScrollerStep : assessmentScrollerStep} activeStep={activeStep} setActiveStep={(step) => setActiveStep(step)} />
            </div>
            <div className="sm:col-span-4">
              {loading ? (
                <p className="h-100 flex justify-center items-center">Fetching lesson details pleas wait...</p>
              ) : (
                  <Fragment>
                    <div className="mx-6">
                      {currentStepComp(activeStep)}
                    </div>
                  </Fragment>
                )}
            </div>
          </div>
        </div>
        {warnModal.show && <ModalPopUp closeAction={toggleModal} saveAction={history.goBack} saveLabel='Yes' message={warnModal.message} />}
      </PageWrapper>
    </div>
  )
}

export default LessonEdit