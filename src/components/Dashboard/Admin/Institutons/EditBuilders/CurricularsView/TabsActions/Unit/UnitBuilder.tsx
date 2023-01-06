import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';

import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import * as customQueries from 'customGraphql/customQueries';
import {languageList} from 'utilities/staticData';

import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import Loader from 'atoms/Loader';

import LessonPlanManager from './LessonPlanManager';
import UnitFormComponent from './UnitFormComponent';
import {BsArrowLeft} from 'react-icons/bs';
import {RoomStatus} from 'API';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';

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
  languages: {id: string; name: string; value: string}[];
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

  const {
    clientKey,
    state: {
      user: {isSuperAdmin}
    },
    userLanguage
  } = useContext(GlobalContext);
  const {CommonlyUsedDict, SyllabusDict} = useDictionary(clientKey);
  const [activeStep, setActiveStep] = useState('overview');
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [savedLessonsList, setSavedLessonsList] = useState([]);
  const [lessonsIds, setLessonsIds] = useState([]);
  const [messages, setMessages] = useState<IUIMessages>({
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
    languages: [{id: '1', name: 'English', value: 'EN'}],
    lessonHistory: undefined
  };
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
          graphqlOperation(customQueries.getUniversalSyllabus, {
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
          .filter((_d) => _d.status?.toLowerCase() === savedData?.status?.toLowerCase())
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
      stepValue: 'overview',
      isComplete: true
    },
    {
      title: 'Lesson Plan manager',
      description: 'Assign lessons to Unit',
      stepValue: 'lessons',
      disabled: !Boolean(unitId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue'
    }
  ];
  // const currentStepComp = (currentStep: string) => {
  //   switch (currentStep) {
  //     case 'overview':
  //       return (
  //         <AnimatedContainer show={currentStep === 'overview'}>
  //           {currentStep === 'overview' && (
  //             <UnitFormComponent
  //               instId={instId}
  //               syllabusDetails={syllabusData}
  //               postAddSyllabus={postAddSyllabus}
  //               onCancel={fetchSyllabusData}
  //             />
  //           )}
  //         </AnimatedContainer>
  //       );
  //     case 'lessons':
  //       return (
  //         <AnimatedContainer show={currentStep === 'lessons'}>
  //           {currentStep === 'lessons' && (
  //             <LessonPlanManager
  //               syllabusId={unitId}
  //               syllabusDetails={syllabusData}
  //               institutionId={instId || syllabusData?.institutionID}
  //               savedLessonsList={savedLessonsList}
  //               setSavedLessonsList={setSavedLessonsList}
  //               lessonsIds={lessonsIds}
  //               setLessonsIds={setLessonsIds}
  //             />
  //           )}
  //         </AnimatedContainer>
  //       );
  //   }
  // };

  return (
    <div className="w-full h-full p-4">
      {/* Section Header */}

      <div className="px-8 pb-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {!fetchingDetails &&
            (syllabusData?.name || SyllabusDict[userLanguage].ADD_UNIT)}
        </h3>
        <div
          className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() =>
            history.push(
              isSuperAdmin
                ? `/dashboard/manage-institutions/units`
                : `/dashboard/manage-institutions/institution/${instId}/units`
            )
          }>
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK_TO_LIST']}</div>
        </div>
      </div>
      {/* Body */}
      <div className="w-full m-auto">
        <StepComponent
          steps={steps}
          activeStep={activeStep}
          handleTabSwitch={handleTabSwitch}
        />
        <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8 mb-8">
          {fetchingDetails ? (
            <div className="h-100 flex justify-center items-center">
              <div className="w-5/10">
                <Loader animation withText="Fetching syllabus details please wait..." />
              </div>
            </div>
          ) : (
            <div className="">
              <AnimatedContainer
                animationType="translateY"
                show={activeStep === 'overview'}>
                {activeStep === 'overview' && (
                  <UnitFormComponent
                    instId={instId}
                    syllabusDetails={syllabusData}
                    postAddSyllabus={postAddSyllabus}
                    curricular={curricular}
                    setSyllabusDataParent={setSyllabusData}
                    onCancel={fetchSyllabusData}
                  />
                )}
              </AnimatedContainer>
              <AnimatedContainer
                animationType="translateY"
                show={activeStep === 'lessons'}>
                {activeStep === 'lessons' && (
                  <LessonPlanManager
                    syllabusId={unitId}
                    syllabusDetails={syllabusData}
                    institutionId={instId || syllabusData?.institutionID}
                    savedLessonsList={savedLessonsList}
                    setSavedLessonsList={setSavedLessonsList}
                    lessonsIds={lessonsIds}
                    setLessonsIds={setLessonsIds}
                  />
                )}
              </AnimatedContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitBuilder;
