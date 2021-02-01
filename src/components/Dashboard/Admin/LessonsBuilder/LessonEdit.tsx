import React, { useState, useEffect, Fragment } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import API, { graphqlOperation } from '@aws-amplify/api';
import { IoArrowUndoCircleOutline, IoDocumentText, IoCardSharp } from 'react-icons/io5';
import { FaRegEye, FaQuestionCircle } from 'react-icons/fa';
import { RiQuestionAnswerLine } from 'react-icons/ri';

import * as customQueries from '../../../../customGraphql/customQueries';

import Buttons from '../../../Atoms/Buttons';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import WizardScroller from '../../../Atoms/WizardScroller';

import GeneralInformation from './StepActionComponent/GeneralInformation';
import AssessmentInstuctions from './StepActionComponent/AssessmentInstuctions';
import QuestionBuilder from './StepActionComponent/QuestionBuilder';
import PreviewForm from './StepActionComponent/PreviewForm';
import PreviousQuestions from './StepActionComponent/PreviousQuestions';
import { InitialData } from './LessonBuilder';
import { languageList } from '../../../../utilities/staticData'

interface LessonEditProps {
  designersList: any[]
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
    languages: [{ id: '1', name: "English", value: 'EN' }]
  }

  const [formData, setFormData] = useState<InitialData>(initialData);
  const [selectedDesigners, setSelectedDesigners] = useState([]);
  const [activeStep, setActiveStep] = useState('General Information');
  const [loading, setLoading] = useState(false);

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Lessons', url: '/dashborad/lesson-builder', last: false },
    {
      title: 'Lesson Builder',
      url: `${match.url}?${lessonId ? `lessonId=${lessonId}}` : `assessmentId=${assessmentId}`}`,
      last: true
    },
  ]
  const assessmentScrollerStep = [
    { name: "General Information", icon: <IoCardSharp /> },
    { name: "Instructions", icon: <IoDocumentText /> },
    { name: "Question Builder", icon: <FaQuestionCircle /> },
    { name: "Previously Used Questions", icon: <RiQuestionAnswerLine /> },
    { name: "Preview Details", icon: <FaRegEye /> }
  ];
  const lessonScrollerStep = [
    { name: "General Information", icon: <IoCardSharp /> },
    { name: "Preview Details", icon: <FaRegEye /> }
  ];

  const typeList: any = [
    { id: '1', name: 'Lesson', value: 'lesson' },
    { id: '2', name: 'Assessment', value: 'assessment' },
    { id: '3', name: 'Survey', value: 'survey' }
  ];
  const goBack = () => {
    history.push('/dashboard/lesson-builder')
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
        languages: savedData.language ? languageList.filter((item: any) => savedData.language.includes(item.value)) : []
      });
      const designers = designersList.filter((item: any) => savedData?.designers?.includes(item.id));
      setSelectedDesigners(designers)
      setLoading(false);
    } catch{
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
    }
  }

  useEffect(() => {
    checkValidUrl();
  }, [])

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'General Information':
        return <GeneralInformation
          formData={formData}
          setFormData={setFormData}
          designersList={designersList}
          selectedDesigners={selectedDesigners}
          setSelectedDesigners={setSelectedDesigners}
          lessonId={lessonId || assessmentId}
        />;
      case 'Instructions':
        return <AssessmentInstuctions />;
      case 'Question Builder':
        return <QuestionBuilder setActiveStep={setActiveStep} />;
      case 'Previously Used Questions':
        return <PreviousQuestions />;
      case 'Preview Details':
        return <PreviewForm />;
      default:
      // return <GeneralInformation />;
    }
  }

  return (
    <div className="w-full h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="LESSON BUILDER" subtitle="Build lessons, surveys or assessments from here." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">LESSON BUILDER</h3>
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
      </PageWrapper>
    </div>
  )
}

export default LessonEdit