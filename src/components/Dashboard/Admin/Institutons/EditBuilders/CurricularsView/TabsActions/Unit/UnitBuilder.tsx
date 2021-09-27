import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router';
import API, {graphqlOperation} from '@aws-amplify/api';

import {GlobalContext} from '../../../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../../../customHooks/dictionary';
import {useQuery} from '../../../../../../../../customHooks/urlParam';
import * as customQueries from '../../../../../../../../customGraphql/customQueries';
import {languageList} from '../../../../../../../../utilities/staticData';

import BreadCrums from '../../../../../../../Atoms/BreadCrums';
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
}

interface IUIMessages {
  show: boolean;
  message: string;
  isError: boolean;
  lessonError?: boolean;
}

const UnitBuilder = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const urlParams: any = useParams();
  const {curricularId, institutionId} = urlParams;
  const params = useQuery(location.search);
  const step = params.get('step');
  const syllabusId = params.get('id');

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, SyllabusDict} = useDictionary(clientKey);
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

  const initialData = {
    id: '',
    name: '',
    description: '',
    methodology: '',
    policies: '',
    purpose: '',
    objectives: '',
    languages: [{id: '1', name: 'English', value: 'EN'}],
  };
  const [syllabusData, setSyllabusData] = useState<IUnitData>(initialData);
  const [curriculumData, setCurriculumData] = useState<any>({
    name: '',
    institution:{},
  });

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}&id=${syllabusId}`;
    history.push(redirectionUrl);
  };

  const postAddSyllabus = (syllabusId: string) => {
    const redirectionUrl = `${match.url}?step=lessons&id=${syllabusId}`;
    history.push(redirectionUrl);
  };

  useEffect(() => {
    fetchCurriculumBasicInfo()
    fetchSyllabusData();
  }, []);

  const fetchCurriculumBasicInfo = async() => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getCurriculumBasicInfo, {
          id: curricularId,
        })
      );
      const {name, institution} = result?.data.getCurriculum;
      setCurriculumData({
        name,
        institution,
      });
    } catch (error) {
      
    }
  }

  const fetchSyllabusData = async () => {
    if (syllabusId) {
      setFetchingDetails(true);
      try {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getUniversalSyllabus, {
            id: syllabusId,
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
    } else {
      console.log('can not find unit id');
      // history.push('/dashboard/manage-institutions');
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
      title: curriculumData.institution?.name || 'loading...',
      url: `/dashboard/manage-institutions/institution/${institutionId}`,
      last: false,
    },
    {
      title: curriculumData.name || 'loading...',
      url: `/dashboard/manage-institutions/${institutionId}/curricular?id=${curricularId}`,
      last: false,
    },
    {
      title: syllabusData?.name || BreadcrumsTitles[userLanguage]['UnitBuilder'],
      url: `/dashboard/manage-institutions/curricular/${curricularId}/syllabus/add`,
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
      title: 'Lesson Plan manager',
      description: 'Assign lessons to Unit',
      stepValue: 'lessons',
      disabled: !Boolean(syllabusId),
      isComplete: false,
      tooltipText: 'Add overview details in step 1 to continue',
    },
  ];
  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return (
          <UnitFormComponent
            syllabusDetails={syllabusData}
            postAddSyllabus={postAddSyllabus}
            onCancel={fetchSyllabusData}
          />
        );
      case 'lessons':
        return (
          <LessonPlanManager
            syllabusId={syllabusId}
            institutionId={institutionId}
            savedLessonsList={savedLessonsList}
            setSavedLessonsList={setSavedLessonsList}
            lessonsIds={lessonsIds}
            setLessonsIds={setLessonsIds}
          />
        );
    }
  };

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums
        items={breadCrumsList}
        // unsavedChanges={unsavedChanges}
        // toggleModal={toggleUnSaveModal}
      />
      <div className="flex justify-between">
        <SectionTitle title={SyllabusDict[userLanguage]['TITLE']} />
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
              currentStepComp(activeStep)
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default UnitBuilder;
