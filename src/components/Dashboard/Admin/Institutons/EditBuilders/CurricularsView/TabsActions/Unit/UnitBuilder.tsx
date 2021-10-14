import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../../../../customHooks/urlParam';
import * as customQueries from '../../../../../../../../customGraphql/customQueries';
import {languageList} from '../../../../../../../../utilities/staticData';

import PageWrapper from '../../../../../../../Atoms/PageWrapper';
import SectionTitle from '../../../../../../../Atoms/SectionTitle';
import StepComponent, {
  IStepElementInterface,
} from '../../../../../../../Atoms/StepComponent';
import Loader from '../../../../../../../Atoms/Loader';

import LessonPlanManager from './LessonPlanManager';
import UnitFormComponent from './UnitFormComponent';

interface IUnitData {
  id: string;
  name: string;
  description: string;
  methodology: string;
  policies: string;
  purpose: string;
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

const UnitBuilder = ({instId}: any) => {
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();
  const params = useQuery(location.search);
  const step = params.get('step');
  const {unitId}: any = useParams();

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {SyllabusDict} = useDictionary(clientKey);
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

  const initialData: IUnitData = {
    id: '',
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
    lessonHistory: undefined,
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
  }, []);

  const fetchSyllabusData = async () => {
    if (unitId) {
      setFetchingDetails(true);
      try {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalSyllabus, {
            id: unitId,
          })
        );
        const savedData = result.data.getUniversalSyllabus;
        setSyllabusData({
          ...syllabusData,
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
        });
        setLessonsIds(savedData.universalLessonsSeq || []);
        const associatedLessons = savedData.lessons?.items;
        await Promise.all(
          associatedLessons.map(async (lesson: any) => {
            const result: any = await API.graphql(
              graphqlOperation(customQueries.listLessonRubricss, {
                filter: {
                  lessonID: {eq: lesson.lessonID},
                },
              })
            );
            lesson.measurements = result.data?.listLessonRubricss.items;
          })
        );
        const sortedLessonsList = [...savedData.lessons?.items]
          .map((t: any) => {
            let index = savedData.universalLessonsSeq.indexOf(t.id);
            return {...t, index};
          })
          .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));
        setSavedLessonsList(sortedLessonsList);
        setFetchingDetails(false);
      } catch (err) {
        console.log('err', err);
        setMessages({
          show: true,
          message: SyllabusDict[userLanguage]['MESSAGES']['fetcher'],
          isError: true,
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
      isComplete: true,
    },
    {
      title: 'Lesson Plan manager',
      description: 'Assign lessons to Unit',
      stepValue: 'lessons',
      disabled: !Boolean(unitId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
  ];
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <UnitFormComponent
            instId={instId}
            syllabusDetails={syllabusData}
            postAddSyllabus={postAddSyllabus}
            onCancel={fetchSyllabusData}
          />
        );
      case 'lessons':
        return (
          <LessonPlanManager
            syllabusId={unitId}
            syllabusDetails={syllabusData}
            institutionId={instId}
            savedLessonsList={savedLessonsList}
            setSavedLessonsList={setSavedLessonsList}
            lessonsIds={lessonsIds}
            setLessonsIds={setLessonsIds}
          />
        );
    }
  };

  return (
    <div className="w-full h-full p-4">
      {/* Section Header */}
      {/* <div className="flex justify-between">
        <SectionTitle title={SyllabusDict[userLanguage]['TITLE']} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={gobackToLessonsList}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div> */}

      {/* Body */}
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
            currentStepComp(activeStep)
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitBuilder;