import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  getCurriculum,
  listCurriculumUnitss,
  getInstitutionBasicInfo
} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import PageLayout from 'layout/PageLayout';
import {useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import CheckpointList from '../../TabsListing/CheckpointList';
import CourseFormComponent from './CourseFormComponent';
import LearningObjective from './LearningObjective';
import UnitManager from './UnitManager';

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

  const {userLanguage} = useGlobalContext();
  const {CourseBuilderDict} = useDictionary();

  const [activeStep, setActiveStep] = useState('overview');
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [savedSyllabusList, setSavedSyllabusList] = useState<any[]>([]);
  const [syllabusIds, setSyllabusIds] = useState<any[]>([]);
  const [_, setMessages] = useState<IUIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false
  });
  const [courseData, setCourseData] = useState<any>({
    institution: {
      id: instId,
      name: ''
    }
  });

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}`;
    history.push(redirectionUrl);
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (courseData?.institution?.id) {
      getBasicInstitutionInfo(courseData?.institution?.id);
    }
  }, [courseData?.institution?.id]);

  const fetchCourseData = async () => {
    if (courseId) {
      setFetchingDetails(true);
      try {
        const [curriculumResult, curriculumUnits]: any = await Promise.all([
          await API.graphql(graphqlOperation(getCurriculum, {id: courseId})),
          await API.graphql(
            graphqlOperation(listCurriculumUnitss, {
              filter: {curriculumId: {eq: courseId}}
            })
          )
        ]);
        const savedData = curriculumResult.data.getCurriculum;

        const sortedSyllabusList = [
          ...curriculumUnits?.data.listCurriculumUnits?.items
        ].filter((d) => d.unit !== null);

        const updatedSeq = savedData.universalSyllabusSeq.filter((id: any) => {
          return Boolean(
            sortedSyllabusList.find((d) => d.unit !== null && id === d.unitId)
          );
        });

        const mapped = sortedSyllabusList
          .map((t: any) => {
            let index = updatedSeq.indexOf(t.unitId);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setCourseData(savedData);
        setSyllabusIds(updatedSeq || []);

        setSavedSyllabusList(mapped);
        setFetchingDetails(false);
      } catch {
        setMessages({
          show: true,
          message:
            CourseBuilderDict[userLanguage]['MESSAGES']['ERROR']['FETCH_COURSE_ERR'],
          isError: true
        });
        setFetchingDetails(false);
      }
    }
  };

  const getBasicInstitutionInfo = async (instituteId: any) => {
    const result: any = await API.graphql(
      graphqlOperation(getInstitutionBasicInfo, {
        id: instituteId
      })
    );
    setCourseData((prevData: any) => ({
      ...prevData,
      institution: {
        ...prevData.institution,
        name: result?.data?.getInstitution.name
      }
    }));
  };

  const steps: IStepElementInterface[] = [
    {
      title: 'General Information',
      description: 'Capture core details of your Unit',
      stepValue: 'overview'
    },
    {
      title: 'Unit manager',
      description: 'Assign units to course',
      stepValue: 'unit_manager',
      disabled: !Boolean(courseId)
    },
    {
      title: 'Learning Objectives',
      description: '',
      stepValue: 'learning_objectives',
      disabled: !Boolean(courseId)
    },
    {
      title: 'Demographics & information(Optional)',
      description: '',
      stepValue: 'demographics',
      disabled: !Boolean(courseId)
    }
  ];
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <CourseFormComponent
            setCourseData={setCourseData}
            savedSyllabusList={savedSyllabusList}
            courseId={courseId}
            courseData={courseData}
          />
        );
      case 'unit_manager':
        return (
          <UnitManager
            courseId={courseId}
            courseData={courseData}
            institutionId={courseData?.institution?.id}
            savedSyllabusList={savedSyllabusList}
            setSavedSyllabusList={setSavedSyllabusList}
            syllabusIds={syllabusIds}
            setSyllabusIds={setSyllabusIds}
          />
        );
      case 'learning_objectives':
        return (
          <LearningObjective
            status={courseData.status}
            curricularId={courseId}
            institutionId={instId}
          />
        );
      case 'demographics':
        return (
          <CheckpointList
            status={courseData.status}
            curricularId={courseId}
            institutionId={instId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout title={courseData?.name}>
      <div className="w-full m-auto">
        <StepComponent
          steps={steps}
          activeStep={activeStep}
          handleTabSwitch={handleTabSwitch}
        />
        <div className="grid grid-cols-1 divide-x-0 divide-light mt-4">
          {fetchingDetails ? (
            <div className="h-100 flex justify-center items-center">
              <Loader animation withText="Fetching course details please wait..." />
            </div>
          ) : (
            <div className="">{currentStepComp(activeStep)}</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CourseBuilder;
