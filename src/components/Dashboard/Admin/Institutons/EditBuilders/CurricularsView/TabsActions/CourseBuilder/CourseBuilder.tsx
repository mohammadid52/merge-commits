import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';
import {BsArrowLeft} from 'react-icons/bs';

import {GlobalContext} from '@contexts/GlobalContext';
import useDictionary from '@customHooks/dictionary';
import {useQuery} from '@customHooks/urlParam';
import * as queries from '@graphql/queries';
import * as customQueries from '@customGraphql/customQueries';

import SectionTitle from '@atoms/SectionTitle';
import StepComponent, {IStepElementInterface} from '@atoms/StepComponent';
import Loader from '@atoms/Loader';

import CourseFormComponent from './CourseFormComponent';
import UnitManager from './UnitManager';
import UnitFormComponent from './CourseFormComponent';
import LearningObjective from './LearningObjective';
import CheckpointList from '../../TabsListing/CheckpointList';
import Buttons from '@components/Atoms/Buttons';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';

interface IUIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

interface ICourseBuilderProps {
  instId: string;
}

const CourseBuilder = ({instId}: ICourseBuilderProps) => {
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();

  const {courseId} = urlParams;
  const params = useQuery(location.search);
  const step = params.get('step');

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, CommonlyUsedDict, CourseBuilderDict} = useDictionary(
    clientKey
  );
  const [activeStep, setActiveStep] = useState('overview');
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [savedSyllabusList, setSavedSyllabusList] = useState([]);
  const [syllabusIds, setSyllabusIds] = useState([]);
  const [messages, setMessages] = useState<IUIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false,
  });
  const [courseData, setCourseData] = useState<any>({
    institution: {
      id: instId,
      name: '',
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

  useEffect(() => {
    getBasicInstitutionInfo();
  }, [instId]);

  const fetchCourseData = async () => {
    setFetchingDetails(true);
    if (courseId) {
      try {
        const [curriculumResult, curriculumUnits]: any = await Promise.all([
          await API.graphql(
            graphqlOperation(customQueries.getCurriculum, {id: courseId})
          ),
          await API.graphql(
            graphqlOperation(customQueries.listCurriculumUnitss, {
              filter: {curriculumId: {eq: courseId}},
            })
          ),
        ]);
        const savedData = curriculumResult.data.getCurriculum;
        const sortedSyllabusList = [...curriculumUnits?.data.listCurriculumUnitss?.items]
        .map((t: any) => {
          let index = savedData.universalSyllabusSeq.indexOf(t.unitId);
          return {...t, index};
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setCourseData(savedData);
        setSyllabusIds(savedData.universalSyllabusSeq || []);
        setSavedSyllabusList(sortedSyllabusList);
        setFetchingDetails(false);
      } catch {
        setMessages({
          show: true,
          message: CourseBuilderDict[userLanguage]['messages']['FETCH_COURSE_ERR'],
          isError: true,
        });
        setFetchingDetails(false);
      }
    }
  };

  const getBasicInstitutionInfo = async () => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.getInstitutionBasicInfo, {
        id: instId,
      })
    );
    setCourseData((prevData: any) => ({
      ...prevData,
      institution: {
        ...prevData.institution,
        name: result?.data?.getInstitution.name,
      },
    }));
  };

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
          <UnitManager
            courseId={courseId}
            institutionId={instId}
            savedSyllabusList={savedSyllabusList}
            setSavedSyllabusList={setSavedSyllabusList}
            syllabusIds={syllabusIds}
            setSyllabusIds={setSyllabusIds}
          />
        );
      case 'learning_objectives':
        return <LearningObjective curricularId={courseId} institutionId={instId} />;
      case 'demographics':
        return <CheckpointList curricularId={courseId} institutionId={instId} />;
    }
  };

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      {/* <BreadCrums
        items={breadCrumsList}
        // unsavedChanges={unsavedChanges}
        // toggleModal={toggleUnSaveModal}
      /> */}
      <div className="px-8 py-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {courseData?.name}
        </h3>
        <div
          className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() =>
            history.push(`/dashboard/manage-institutions/institution/${instId}/courses`)
          }>
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK_TO_LIST']}</div>
        </div>
        {/* <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={() => null}
            Icon={IoArrowUndoCircleOutline}
          />
        </div> */}
      </div>

      {/* Body */}
      {/* <PageWrapper> */}
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
                <p className="mt-2 text-center">Fetching course details please wait...</p>
              </div>
            </div>
          ) : (
            <div className="border-0 border-gray-200 border-t-none py-8">
              {currentStepComp(activeStep)}
            </div>
          )}
        </div>
      </div>
      {/* </PageWrapper> */}
    </div>
  );
};

export default CourseBuilder;
