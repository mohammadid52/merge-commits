import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';

import {useGlobalContext} from 'contexts/GlobalContext';
import {getUniversalSyllabus} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {languageList} from 'utilities/staticData';

import Loader from 'atoms/Loader';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';

import useAuth from '@customHooks/useAuth';
import {RoomStatus} from 'API';
import PageLayout from 'layout/PageLayout';
import LessonPlanManager from './LessonPlanManager';
import UnitFormComponent from './UnitFormComponent';

interface IUnitData {
  id: string;
  institutionID?: string;
  name: string;
  description: string;
  status: RoomStatus;
  methodology: string;
  policies: string;
  purpose: string;
  secondary: string;
  priorities: string;
  objectives: string;
  languages: {id?: string; label: string; value: string}[];
  lessonHistory: any;
}

interface IUIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const UnitBuilder = ({instId, curricular}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const params = useQuery(location.search);
  const step = params.get('step');
  const {unitId}: any = useParams();

  const {userLanguage} = useGlobalContext();
  const {SyllabusDict} = useDictionary();
  const [activeStep, setActiveStep] = useState('overview');
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [savedLessonsList, setSavedLessonsList] = useState<any[]>([]);
  const [lessonsIds, setLessonsIds] = useState<any[]>([]);
  const [_, setMessages] = useState<IUIMessages>({
    show: false,
    message: '',
    isError: false,
    lessonError: false
  });

  const initialData: IUnitData = {
    id: '',
    name: '',
    description: '',
    methodology: '',
    policies: '',
    priorities: '',
    secondary: '',

    purpose: '',
    status: RoomStatus.ACTIVE,
    objectives: '',
    languages: [{id: '1', label: 'English', value: 'EN'}],
    lessonHistory: undefined
  };

  const {isSuperAdmin} = useAuth();

  const [syllabusData, setSyllabusData] = useState<IUnitData>(initialData);

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}`;
    history.push(redirectionUrl);
  };

  const postAddSyllabus = (syllabusId: string) => {
    const redirectionUrl = `/dashboard/manage-institutions/institution/${instId}/units/${syllabusId}/edit?step=lessons`;
    history.push(redirectionUrl);
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [unitId]);

  const fetchSyllabusData = async () => {
    if (unitId) {
      setFetchingDetails(true);
      try {
        const result: any = await API.graphql(
          graphqlOperation(getUniversalSyllabus, {
            id: unitId
          })
        );
        const savedData = result.data.getUniversalSyllabus;

        setSyllabusData({
          ...syllabusData,
          institutionID: savedData.institutionID,
          id: savedData.id,
          name: savedData.name,
          languages: languageList.filter((item) =>
            savedData.languages.includes(item.value)
          ),
          description: savedData.description,
          objectives: savedData.objectives,
          purpose: savedData.pupose,
          methodology: savedData.methodology,
          policies: savedData.policies,
          lessonHistory: savedData.lessonHistory,
          secondary: savedData.secondary || '',
          priorities: savedData.priorities,
          status: savedData.status || RoomStatus.ACTIVE
        });
        setLessonsIds(savedData.universalLessonsSeq || []);

        const sortedLessonsList = [...savedData.lessons?.items]

          .map((t: any) => {
            let index = savedData.universalLessonsSeq.indexOf(t.id);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

        setSavedLessonsList(sortedLessonsList);
        setFetchingDetails(false);
      } catch (err) {
        console.error('err', err);
        setMessages({
          show: true,
          message: SyllabusDict[userLanguage]['MESSAGES']['fetcher'],
          isError: true
        });
        setFetchingDetails(false);
      }
    }
  };

  const steps: IStepElementInterface[] = [
    {
      title: 'General Information',
      description: 'Capture core details of your Unit',
      stepValue: 'overview'
    },
    {
      title: 'Lesson Plan manager',
      description: 'Assign lessons to Unit',
      stepValue: 'lessons',
      disabled: !Boolean(unitId)
    }
  ];
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <UnitFormComponent
            instId={instId}
            syllabusDetails={syllabusData}
            postAddSyllabus={postAddSyllabus}
            curricular={curricular}
            setSyllabusDataParent={setSyllabusData}
            onCancel={() => {
              history.push(
                isSuperAdmin
                  ? `/dashboard/manage-institutions/units`
                  : `/dashboard/manage-institutions/institution/${instId}/units`
              );
            }}
          />
        );
      case 'lessons':
        return (
          <LessonPlanManager
            syllabusId={unitId}
            syllabusDetails={syllabusData}
            institutionId={instId || syllabusData?.institutionID}
            savedLessonsList={savedLessonsList}
            setSavedLessonsList={setSavedLessonsList}
            lessonsIds={lessonsIds}
            setLessonsIds={setLessonsIds}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout title={syllabusData?.name || SyllabusDict[userLanguage].ADD_UNIT}>
      <div className="w-full m-auto">
        <StepComponent
          steps={steps}
          activeStep={activeStep}
          handleTabSwitch={handleTabSwitch}
        />
        <div className="grid grid-cols-1 divide-x-0 divide-light  mb-8">
          {fetchingDetails ? (
            <div className="h-100 flex justify-center items-center">
              <Loader animation withText="Fetching syllabus details please wait..." />
            </div>
          ) : (
            <div className="">{currentStepComp(activeStep)}</div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UnitBuilder;
