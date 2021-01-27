import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api'

import Buttons from '../../../Atoms/Buttons';
import Selector from '../../../Atoms/Form/Selector';
import MultipleSelector from '../../../Atoms/Form/MultipleSelector';
import FormInput from '../../../Atoms/Form/FormInput';
import BreadCrums from '../../../Atoms/BreadCrums';
import SectionTitle from '../../../Atoms/SectionTitle';
import PageWrapper from '../../../Atoms/PageWrapper';
import WizardScroller from '../../../Atoms/WizardScroller';

const LessonEdit = () => {

  const urlParams: any = useParams()
  const lessonId = urlParams.lessonId;
  const assessmentId = urlParams.assessmentId
  const history = useHistory();
  const [activeStep, setActivetep] = useState('General Information')
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Lesson Builder', url: '/dashborad/lesson-builder', last: false },
    {
      title: 'Edit Lesson ',
      url: `/dashborad/lesson-builder/lesson/edit?${lessonId ? `lessonId=${lessonId}}` : `assessmentId=${assessmentId}`}`,
      last: true
    },
  ]
  const scrollerStep = ["General Information", "Instructions", "Question Builder", "Preview Details"];

  useEffect(() => {

  }, [])

  return (
    <div className="w-full h-full">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="EDIT LESSON" subtitle="Edit lessons, surveys or assessments." />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">EDIT INFORMATION</h3>
          <div className="grid grid-cols-4 divide-x divide-gray-400 p-4">

            <div className="sm:col-span-1">
              <WizardScroller stepsList={scrollerStep} activeStep={activeStep} setActiveStep={(step) => setActivetep(step)} />
            </div>
            <div className="sm:col-span-3">
              <p className="h-100 flex justify-center items-center">Work In Progress...</p>
            </div>

          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

export default LessonEdit
