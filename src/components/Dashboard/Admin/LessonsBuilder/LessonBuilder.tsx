import React, { useState, useEffect, Fragment } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp } from 'react-icons/io5';
import { FaRegEye, FaQuestionCircle } from 'react-icons/fa';

import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import WizardScroller from '../../../Atoms/WizardScroller';

import AddNewLessonForm from './StepActionComponent/AddNewLessonForm';
import AssessmentInstuctions from './StepActionComponent/AssessmentInstuctions';
import CheckpointBuilder from './StepActionComponent/CheckpointBuilder';
import PreviewForm from './StepActionComponent/PreviewForm';
import { InstructionInitialState, SavedLessonDetailsProps, LessonPlansProps } from './LessonEdit';

export interface InitialData {
  name: string
  type: InputValueObject,
  purpose: string,
  purposeHtml: string,
  objective: string,
  objectiveHtml: string,
  languages: { id: string, name: string, value: string }[]
}
export interface InputValueObject {
  id: string,
  name: string,
  value: string
}
interface LessonBuilderProps {
  designersList: any[]
}

const LessonBuilder = (props: LessonBuilderProps) => {
  const { designersList } = props;
  const history = useHistory();
  const match = useRouteMatch();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Lessons', url: '/dashborad/lesson-builder', last: false },
    { title: 'Lesson Builder', url: `${match.url}`, last: true },
  ]

  const initialData = {
    name: '',
    type: { id: '', name: '', value: '' },
    purpose: '',
    purposeHtml: '<p></p>',
    objective: '',
    objectiveHtml: '<p></p>',
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

  const assessmentScrollerStep = [
    { name: "General Information", icon: <IoCardSharp /> },
    { name: "Instructions", icon: <IoDocumentText />, isDisabled: true },
    { name: "Builder", icon: <FaQuestionCircle />, isDisabled: true },
    { name: "Preview Details", icon: <FaRegEye />, isDisabled: true }
  ];
  const lessonScrollerStep = [
    { name: "General Information", icon: <IoCardSharp /> },
    { name: "Preview Details", icon: <FaRegEye />, isDisabled: true }
  ];

  const [formData, setFormData] = useState<InitialData>(initialData);
  // const [instructionData, setInstructionData] = useState<InstructionInitialState>(instructionInitialState)
  // const [savedLessonDetails,setSavedLessonDetails] = useState<>()
  const [savedLessonDetails, setSavedLessonDetails] = useState<SavedLessonDetailsProps>({
    lessonPlans: null,
    lessonInstructions: instructionInitialState
  })
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [lessonId, setLessonId] = useState('');
  const [activeStep, setActiveStep] = useState('General Information');
  const [lessonBuilderSteps, setLessonBuilderSteps] = useState(lessonScrollerStep);
  const changeLessonType = (type: string) => {
    if (type === 'lesson') {
      setLessonBuilderSteps(lessonScrollerStep);
    } else {
      setLessonBuilderSteps(assessmentScrollerStep);
    }
  }

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'General Information':
        return <AddNewLessonForm
          changeLessonType={changeLessonType}
          formData={formData}
          setFormData={setFormData}
          designersList={designersList}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          postLessonCreation={postLessonCreation}
        />;
      case 'Instructions':
        return <AssessmentInstuctions
          lessonId={lessonId}
          savedInstructions={savedLessonDetails?.lessonInstructions}
          updateParentState={(obj) => onInstructionSaved(obj)}
          lessonType={formData.type?.value}
        />;
      case 'Builder':
        return <CheckpointBuilder lessonPlans={savedLessonDetails?.lessonPlans} designersList={designersList} lessonID={lessonId} updateLessonPlan={updateLessonPlan} />;
      case 'Preview Details':
        return <PreviewForm />;
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
  }

  const postLessonCreation = (lessonId: string) => {
    const currentSteps = [...lessonBuilderSteps];
    const updatedState = currentSteps.map(item => ({ ...item, isDisabled: false }));
    setLessonBuilderSteps(updatedState);
    setLessonId(lessonId);
    if (formData.type?.id === '1') {
      setActiveStep('Preview Details');
    } else {
      setActiveStep('Instructions');
    }
  }

  const onInstructionSaved = (obj: InstructionInitialState) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonInstructions: obj
    })
    setActiveStep('Builder')
  }

  const updateLessonPlan = (lessonPlan: LessonPlansProps[]) => {
    setSavedLessonDetails({
      ...savedLessonDetails,
      lessonPlans: lessonPlan
    })
  }
  useEffect(() => {
    if (formData.type?.id) {
      changeLessonType(formData.type?.value)
    }
  }, [formData.type?.id])

  return (
    <div className="w-full h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="LESSON BUILDER" subtitle="Build lessons, surveys or assessments from here." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>

        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3> */}
          <div className="grid grid-cols-5 divide-x divide-gray-400 p-4">
            <div className="sm:col-span-1">
              <WizardScroller stepsList={lessonBuilderSteps} activeStep={activeStep} setActiveStep={(step) => setActiveStep(step)} />
            </div>
            <div className="sm:col-span-4">
              <Fragment>
                <div className="mx-6">
                  {currentStepComp(activeStep)}
                </div>
              </Fragment>
            </div>

          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default LessonBuilder
