import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { LessonPlansProps } from '../../Dashboard/Admin/LessonsBuilder/LessonEdit';
import { InitialData } from '../../Dashboard/Admin/LessonsBuilder/StepActionComponent/CheckPointSteps/AddNewCheckPoint';
import BuilderWrapper from './views/BuilderWrapper';
import {
  PagePart,
  PartContent,
  UniversalLesson,
  UniversalLessonPage,
} from '../../../interfaces/UniversalLessonInterfaces';
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

/*******************************************
 * INITIAL VALUES                          *
 *******************************************/
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

const initialUniversalLessonPagePart: PagePart = {
  id: '',
  partType: 'default',
  class: '',
  partContent: [],
};

const initialUniversalLessonPagePartContent: PartContent = {
  id: '',
  type: '',
  value: [],
};

/*******************************************
 * THE BUILDER PARENT                      *
 *******************************************/
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
            mode={`building`}
            universalLessonDetails={universalLessonDetails}
            universalBuilderStep={universalBuilderStep}
            setUniversalBuilderStep={setUniversalBuilderStep}
            selectedPageDetails={selectedPageDetails}
            setSelectedPageDetails={setSelectedPageDetails}
            selectedPagePartDetails={selectedPagePartDetails}
            setSelectedPagePartDetails={setSelectedPagePartDetails}
            selectedPartContentDetails={selectedPartContentDetails}
            setSelectedPartContentDetails={setSelectedPartContentDetails}
            initialUniversalLessonPagePartContent={initialUniversalLessonPagePartContent}
          />
        );
      default:
        return <h1>Current Universal Builder step is invalid</h1>;
    }
  };

  //  CORE DATA MANAGEMENT
  const [universalLessonDetails, setUniversalLessonDetails] = useState<UniversalLesson>(initialUniversalLessonData);
  const [selectedPageDetails, setSelectedPageDetails] = useState<UniversalLessonPage>(initialUniversalLessonPage);
  const [selectedPagePartDetails, setSelectedPagePartDetails] = useState<PagePart>(initialUniversalLessonPagePart);
  const [selectedPartContentDetails, setSelectedPartContentDetails] = useState<PartContent>(
    initialUniversalLessonPagePartContent
  );
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
    <div id={`universalLessonBuilder`} className="flex bg-white shadow-5 sm:rounded-lg mb-4">
      {currentStepComp(universalBuilderStep)}
    </div>
  );
};

export default UniversalLessonBuilder;
