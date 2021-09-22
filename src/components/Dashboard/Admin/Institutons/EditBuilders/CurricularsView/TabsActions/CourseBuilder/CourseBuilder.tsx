import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import * as queries from '@graphql/queries';
import * as customQueries from '@customGraphql/customQueries';
import {languageList} from '@utilities/staticData';
import {getImageFromS3} from '@utilities/services';

import BreadCrums from '@atoms/BreadCrums';
import PageWrapper from '@atoms/PageWrapper';
import SectionTitle from '@atoms/SectionTitle';
import StepComponent, {IStepElementInterface} from '@atoms/StepComponent';
import Loader from '@atoms/Loader';

import CourseFormComponent from './CourseFormComponent';
import LessonPlanManager from './UnitManager';
import UnitFormComponent from './CourseFormComponent';
import LearningObjective from './LearningObjective';
import CheckpointList from '../../TabsListing/CheckpointList';

interface IUIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const CourseBuilder = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();
  console.log(urlParams, 'urlParams');

  const {courseId, institutionId} = urlParams;
  const params = useQuery(location.search);
  const step = params.get('step');

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, CourseBuilderdict} = useDictionary(clientKey);
  const [activeStep, setActiveStep] = useState('overview');
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [savedLessonsList, setSavedLessonsList] = useState([]);
  const [lessonsIds, setLessonsIds] = useState([]);
  const [messages, setMessages] = useState<IUIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false,
  });
  const [courseData, setCourseData] = useState<any>({
    institution: {
      id: institutionId,
    },
  });

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}&id=${courseId}`;
    history.push(redirectionUrl);
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    if (courseId) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(queries.getCurriculum, {id: courseId})
        );
        const savedData = result.data.getCurriculum;
        console.log(savedData, 'savedData');

        setCourseData(savedData);
        // Load from response value
        // const imageUrl: any = savedData.image
        //   ? await getImageFromS3(`instituteImages/curricular_image_${currID}`)
        //   : null;
        // setImageUrl(imageUrl);

        // if (savedData && savedData.designers && savedData.designers.length) {
        //   setDesignerIds([...savedData?.designers]);
        // }
        // setPreviousName(savedData.name);
      } catch {
        setMessages({
          show: true,
          message: CourseBuilderdict[userLanguage]['messages']['FETCH_COURSE_ERR'],
          isError: true,
        });
      }
    }
  };

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: courseData?.institution?.name || 'loading...',
      url: `/dashboard/manage-institutions/institution?id=${institutionId}`,
      last: false,
    },
    {
      title: courseData?.name || BreadcrumsTitles[userLanguage]['COURSE_BUILDER'],
      url: `/dashboard/manage-institutions/curricular/${courseId}/syllabus/add`,
      last: true,
    },
  ];
  const steps: IStepElementInterface[] = [
    {
      title: 'General Information',
      description: 'Capture core details of your Unit',
      stepValue: 'overview',
      isComplete: true,
    },
    {
      title: 'Unit manager',
      description: 'Assign units to course',
      stepValue: 'unit_manager',
      disabled: !Boolean(courseId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
    {
      title: 'Learning Objectives',
      description: '',
      stepValue: 'learning_objectives',
      disabled: !Boolean(courseId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
    {
      title: 'Demographics & information(Optional)',
      description: '',
      stepValue: 'demographics',
      disabled: !Boolean(courseId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
  ];
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return <CourseFormComponent courseId={courseId} courseData={courseData} />;
      case 'unit_manager':
        return (
          <LessonPlanManager
            courseId={courseId}
            institutionId={institutionId}
            savedLessonsList={savedLessonsList}
            setSavedLessonsList={setSavedLessonsList}
            lessonsIds={lessonsIds}
            setLessonsIds={setLessonsIds}
          />
        );
      case 'learning_objectives':
        return (
          <LearningObjective curricularId={courseId} institutionId={institutionId} />
        );
      case 'unit_manager':
        return (
          <LessonPlanManager
            courseId={courseId}
            institutionId={institutionId}
            savedLessonsList={savedLessonsList}
            setSavedLessonsList={setSavedLessonsList}
            lessonsIds={lessonsIds}
            setLessonsIds={setLessonsIds}
          />
        );
      case 'demographics':
        return <CheckpointList curricularId={courseId} institutionId={institutionId} />;
    }
  };

  console.log(courseData, 'courseData*********');

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        items={breadCrumsList}
        // unsavedChanges={unsavedChanges}
        // toggleModal={toggleUnSaveModal}
      />
      <div className="flex justify-between">
        <SectionTitle title={'Course Builder'} />
        {/* <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={gobackToLessonsList}
            Icon={IoArrowUndoCircleOutline}
          />
        </div> */}
      </div>

      {/* Body */}
      <PageWrapper>
        <div className="w-full m-auto">
          <StepComponent
            steps={steps}
            activeStep={activeStep}
            handleTabSwitch={handleTabSwitch}
          />
          <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8">
            {fetchingDetails ? (
              <div className="h-100 flex justify-center items-center">
                <div className="w-5/10">
                  <Loader />
                  <p className="mt-2 text-center">
                    Fetching syllabus details please wait...
                  </p>
                </div>
              </div>
            ) : (
              <div className="border-0 border-gray-200 border-t-none py-8">
                {currentStepComp(activeStep)}
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default CourseBuilder;
