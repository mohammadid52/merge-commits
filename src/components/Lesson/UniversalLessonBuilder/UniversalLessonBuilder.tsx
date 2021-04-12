import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { LessonPlansProps } from '../../Dashboard/Admin/LessonsBuilder/LessonEdit';
import { InitialData } from '../../Dashboard/Admin/LessonsBuilder/StepActionComponent/CheckPointSteps/AddNewCheckPoint';
import BuilderWrapper from './views/BuilderWrapper';

interface UniversalLessonBuilderProps {
  designersList?: { id: string, name: string, value: string }[]
  lessonID?: string
  lessonPlans?: LessonPlansProps[] | null
  updateLessonPlan?: (plan: LessonPlansProps[]) => void
  setUnsavedChanges?: (val: boolean) => void
  activeStep?: string
  lessonName?: string
  lessonType?: string
}

const UniversalLessonBuilder = (props: UniversalLessonBuilderProps) => {
  const {state, dispatch} = useContext(GlobalContext)
  const { designersList, lessonID, lessonPlans, updateLessonPlan, setUnsavedChanges, activeStep, lessonName, lessonType } = props;


  const initialUniversalLessonData = {

  };

  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');
  const [universalLessonDetails, setUniversalLessonDetails] = useState(initialUniversalLessonData);

  //  STORE FOR TEMPLATES, TODO: SHOULD BE FETCHED IN THE FUTURE
  const [universalBuilderTemplates, setUniversalBuilderTemplates] = useState([{},{},{},{},{},{},{}])

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(()=>{
    if(state.user.role === 'TR'|| state.user.role === 'FLW'){
      dispatch({type: 'UPDATE_CURRENTPAGE', payload: {data: 'universal-lesson-builder'}})
    }
  },[state.user.role])

  //  WHICH COMPONENT DO WE RETURN?
  const currentStepComp = (currentStep: string) => {
    switch(currentStep){
      case 'BuilderWrapper':
        return (
        <BuilderWrapper
          universalBuilderStep={universalBuilderStep}
          setUniversalBuilderStep={setUniversalBuilderStep}
          universalBuilderTemplates={universalBuilderTemplates}/>);
      default:
        return <h1>Current Universal Builder step is invalid</h1>
    }
  }


  /****************************************
   * FUNCTIONALITY AND DATA FETCHES WILL
   * BE DONE BELOW THIS AREA
   ****************************************/

    // in this area ^

  /****************************************
   *
   ****************************************/


  return (
      /**
       *
       *  Pages:
       *    1. lesson overview page
       *    2. create new & edit page (similar)
       *    3. add a page part dialog
       *    4. apply a template dialog
       *    5. builder body
       *
       */
    <div className='bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4'>
      {currentStepComp(universalBuilderStep)}
    </div>
  )
}

export default UniversalLessonBuilder;