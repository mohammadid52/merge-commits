import React, {useContext, useEffect, useState} from 'react';
import {FaFileAlt, FaFileMedical, FaThList} from 'react-icons/fa';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory, useRouteMatch} from 'react-router-dom';

import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import UnderlinedTabs from 'atoms/UnderlinedTabs';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {API, graphqlOperation} from 'aws-amplify';
import {GlobalContext} from 'contexts/GlobalContext';
import {useULBContext} from 'contexts/UniversalLessonBuilderContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {UniversalLesson} from 'interfaces/UniversalLessonInterfaces';
import ExistingPageView from './ExistingPageView';
import LessonPlanForm from './LessonPlanForm';
import TemplateView from './TemplateView';

export interface ILessonPlan {
  addNewPageHandler: (content: any) => void;
  lessonId: string;
  universalLessonDetails: UniversalLesson;
}

const LessonPlan = () => {
  const match = useRouteMatch();
  const history = useHistory();

  // this is nested tab state holder
  const [activeTab, setActiveTab] = useState<number>(0);

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, LessonBuilderDict} = useDictionary(clientKey);
  const {
    addNewPageHandler,
    universalLessonDetails,
    setUniversalLessonDetails
  } = useULBContext();

  const params = useQuery(location.search);
  // const lessonId = params.get('lessonId');
  const route: any = useRouteMatch();

  const lessonId = route.params.lessonId;

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSONPLANBUILDER'],
      url: `${match.url}?${lessonId ? `lessonId=${lessonId}}` : ``}`,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['ADD_NEW_LESSON_PLAN'],
      url: `${match.url}/lesson/add/lesson-plan?lessonId=${lessonId}`,
      last: true
    }
  ];

  const fetchUniversalLessonDetails = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getUniversalLesson, {
          id: lessonId
        })
      );
      const savedData = result.data.getUniversalLesson;
      setUniversalLessonDetails(savedData);
    } catch {
      console.log('Error while fetching lesson data');
      history.push(`/dashboard/lesson-builder`);
    }
  };

  const checkValidUrl = async () => {
    if (!lessonId) {
      console.log('@LessonPlan: Invalid url');
      history.push(`/dashboard/lesson-builder`);
    }
  };

  useEffect(() => {
    checkValidUrl();

    fetchUniversalLessonDetails();
  }, []);

  const currentTabComp = (activeTab: string) => {
    switch (activeTab) {
      case '0':
        return <LessonPlanForm />;
      case '1':
        return (
          <ExistingPageView
            addNewPageHandler={addNewPageHandler}
            lessonId={lessonId}
            universalLessonDetails={universalLessonDetails}
          />
        );
      case '2':
        return <TemplateView />;
    }
  };

  const tabs = [
    {
      index: 0,
      title: 'New plan from scratch',
      icon: <FaFileMedical />,
      content: currentTabComp(`${activeTab}`)
    },
    {
      index: 1,
      title: 'Use Existing Page',
      icon: <FaThList />,
      content: currentTabComp(`${activeTab}`)
    },
    {
      index: 2,
      title: 'Page from Template',
      icon: <FaFileAlt />,
      content: currentTabComp(`${activeTab}`)
    }
  ];

  const updateTab = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitleV3
          title={LessonBuilderDict[userLanguage]['TITLE']}
          subtitle={LessonBuilderDict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div>
      </div>
      <div className="flex px-4 flex-col">
        <div className="bg-white border-gray-200 shadow-5 sm:rounded-lg  mb-4">
          <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {LessonBuilderDict[userLanguage]['LESSON_PLAN_FORM'].HEADING}
            </h3>
          </div>
          <div className="">
            <UnderlinedTabs tabs={tabs} activeTab={activeTab} updateTab={updateTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlan;
