import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { LessonPlansProps } from '../../Dashboard/Admin/LessonsBuilder/LessonEdit';
import { InitialData } from '../../Dashboard/Admin/LessonsBuilder/StepActionComponent/CheckPointSteps/AddNewCheckPoint';
import BuilderWrapper from './views/BuilderWrapper';
import { UniversalLesson, UniversalLessonPage } from '../../../interfaces/UniversalLessonInterfaces';
import { exampleUniversalLesson } from './example_data/exampleUniversalLessonData';

interface UniversalLessonBuilderProps {
  designersList?: { id: string; name: string; value: string }[];
  lessonID?: string;
  lessonPlans?: LessonPlansProps[] | null;
  updateLessonPlan?: (plan: LessonPlansProps[]) => void;
  setUnsavedChanges?: (val: boolean) => void;
  activeStep?: string;
  lessonName?: string;
  lessonType?: string;
}

const initialUniversalLessonData: UniversalLesson = {
  id: '',
  summary: '',
  designers: [''],
  teachers: [''],
  categories: [''],
  universalLessonPlan: [],
  universalLessonPages: [],
};

const initialUniversalLessonPage: UniversalLessonPage = {
  id: '',
  title: '',
  description: '',
  class: '',
  pageContent: [],
};

const UniversalLessonBuilder = (props: UniversalLessonBuilderProps) => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    designersList,
    lessonID,
    lessonPlans,
    updateLessonPlan,
    setUnsavedChanges,
    activeStep,
    lessonName,
    lessonType,
  } = props;
  const [universalBuilderStep, setUniversalBuilderStep] = useState('BuilderWrapper');

  //  INITIALIZE CURRENT PAGE LOCATION
  useEffect(() => {
    if (state.user.role === 'TR' || state.user.role === 'FLW') {
      dispatch({ type: 'UPDATE_CURRENTPAGE', payload: { data: 'universal-lesson-builder' } });
    }
  }, [state.user.role]);

  //  WHICH COMPONENT DO WE RETURN?
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'BuilderWrapper':
        return (
          <BuilderWrapper
            universalLessonDetails={universalLessonDetails}
            universalBuilderStep={universalBuilderStep}
            setUniversalBuilderStep={setUniversalBuilderStep}
            selectedPageDetails={selectedPageDetails}
            setSelectedPageDetails={setSelectedPageDetails}
          />
        );
      default:
        return <h1>Current Universal Builder step is invalid</h1>;
    }
  };

  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(initialUniversalLessonData);
  const [selectedPageDetails, setSelectedPageDetails] = useState<UniversalLessonPage>(initialUniversalLessonPage);
  /**********************************************
   * FUNCTIONALITY AND DATA FETCHES WILL
   * BE DONE BELOW THIS AREA
   *
   * setUniversalLessonDetails will be updated
   * here
   **********************************************/

  // in this area ^
  useEffect(() => {
    setUniversalLessonDetails(exampleUniversalLesson);
  }, []);

  /**********************************************
   *
   **********************************************/

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
    <div className="bg-white shadow-5 overflow-hidden sm:rounded-lg mb-4">{currentStepComp(universalBuilderStep)}</div>
  );
};

export default UniversalLessonBuilder;
