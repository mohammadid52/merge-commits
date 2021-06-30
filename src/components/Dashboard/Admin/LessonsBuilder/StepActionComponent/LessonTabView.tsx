import React, {useState, useEffect, useContext} from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';
import {FaQuestionCircle, FaUnity, FaEdit, FaChartLine} from 'react-icons/fa';
import {IoCardSharp, IoArrowUndoCircleOutline} from 'react-icons/io5';
import {graphqlOperation, API} from 'aws-amplify';

import Buttons from '../../../../Atoms/Buttons';
import BreadCrums from '../../../../Atoms/BreadCrums';
import Loader from '../../../../Atoms/Loader';
import SectionTitle from '../../../../Atoms/SectionTitle';
// import Tooltip from '../../../../Atoms/Tooltip';
import UnderlinedTabs from '../../../../Atoms/UnderlinedTabs';

import UnitLookup from './UnitLookup';
import LessonMeasurements from './LessonMeasurements';
import LessonSummaryForm from './LessonSummaryForm';
import LessonPlansList from './LessonPlansList';

import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import {useQuery} from '../../../../../customHooks/urlParam';
import * as customQueries from '../../../../../customGraphql/customQueries';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
import {languageList} from '../../../../../utilities/staticData';
import {useULBContext} from '../../../../../contexts/UniversalLessonBuilderContext';

interface ILessonTabViewProps {
  designersList: any[];
}

const LessonTabView = ({designersList}: ILessonTabViewProps) => {
  const match = useRouteMatch();
  const history = useHistory();
  const {
    setUniversalLessonDetails,
    universalLessonDetails,
    activeTab,
    setActiveTab,
  } = useULBContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [lessonData, setLessonData] = useState<any>();
  const [selectedDesigners, setSelectedDesigners] = useState([]);

  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {BreadcrumsTitles, BUTTONS, LessonBuilderDict, LessonEditDict} = useDictionary(
    clientKey
  );

  const params = useQuery(location.search);
  const lessonId = params.get('lessonId');
  const tab = params.get('tab');

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['LESSONS'],
      url: '/dashboard/lesson-builder',
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['LESSONPLANBUILDER'],
      url: `${match.url}?${lessonId ? `lessonId=${lessonId}}` : ``}`,
      last: true,
    },
  ];

  const fetchUniversalLessonDetails = async () => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(queries.getUniversalLesson, {
          id: lessonId,
        })
      );
      const savedData = result.data.getUniversalLesson;
      setUniversalLessonDetails(savedData);
      setLessonData(savedData);

      const designers = designersList.filter((item: any) =>
        savedData?.designers?.includes(item.id)
      );
      setSelectedDesigners(designers || []);
      setLoading(false);
    } catch {
      console.log('Error while fetching lesson data');
      history.push(`/dashboard/lesson-builder`);
    }
  };

  const checkValidUrl = async () => {
    if (!lessonId) {
      console.log('Invalid url');
      history.push(`/dashboard/lesson-builder`);
    } else {
      setLoading(true);
      fetchUniversalLessonDetails();
    }
  };

  useEffect(() => {
    checkValidUrl();
  }, []);

  useEffect(() => {
    if (tab) {
      setActiveTab(parseInt(tab));
    }
  }, [tab]);

  const handleEdit = () => {
    const redirectionUrl = `${match.url.replace('view', `edit?lessonId=${lessonId}`)}`;
    history.push(redirectionUrl);
  };

  const currentTabComp = (activeTab: string) => {
    switch (activeTab) {
      case '0':
        return (
          <LessonSummaryForm
            lessonId={lessonId}
            setFormData={setLessonData}
            formData={lessonData}
          />
        );
      case '1':
        return (
          <LessonPlansList
            lessonId={lessonId}
            universalLessonDetails={universalLessonDetails}
          />
        );
      case '2':
        return <LessonMeasurements lessonId={lessonId} />;
      case '3':
        return (
          <div>
            <UnitLookup
              lessonName={''}
              lessonId={lessonId}
              institution={lessonData.institution}
              lessonType={''}
              lessonPlans={''}
            />
            {/* <div className="flex mb-8 mt-4 justify-center">
              <Tooltip placement="top" text={LessonBuilderDict[userLanguage]['MESSAGES']['PUBLISH_DISABLED_INFO']}>
                <Buttons
                  btnClass="py-3 px-10"
                  label={BUTTONS[userLanguage]['PUBLISH']}
                  disabled={true}
                />
              </Tooltip>
            </div> */}
          </div>
        );
    }
  };

  const tabs = [
    {
      index: 0,
      title: 'Lesson Summary',
      icon: <IoCardSharp />,
      content: currentTabComp(`${activeTab}`),
    },
    {
      index: 1,
      title: 'Lesson Plan',
      icon: <FaQuestionCircle />,
      content: currentTabComp(`${activeTab}`),
      // disabled: formData.institution && formData.institution.id ? false : true,
    },
    {
      index: 2,
      title: 'Lesson Measurements',
      icon: <FaChartLine />,
      content: currentTabComp(`${activeTab}`),
      // disabled: formData.institution && formData.institution.id ? false : true,
    },
    {
      index: 3,
      title: 'Assign to Units',
      icon: <FaUnity />,
      content: currentTabComp(`${activeTab}`),
      // disabled: formData.institution && formData.institution.id ? false : true,
    },
  ];

  const updateTab = (tab: number) => {
    // setActiveTab(tab);
    history.push(`${match.url}?lessonId=${lessonId}&tab=${tab}`);
  };

  const {institution = {}, language = [], objectives = [], purpose = '', title = ''} =
    lessonData || {};

  return (
    <div className="w-full h-full">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={LessonEditDict[userLanguage]['TITLE']}
          subtitle={LessonEditDict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            label="Go back"
            btnClass="mr-4"
            onClick={history.goBack}
            Icon={IoArrowUndoCircleOutline}
          />
          <Buttons btnClass="mr-4 px-6" label="Edit" onClick={handleEdit} Icon={FaEdit} />
        </div>
      </div>
      <div className="flex px-4 flex-col">
        {/* Profile section */}
        <div className="flex-row border-gray-200 flex items-center justify-center">
          {/* General information section */}
          <div className="bg-white border-gray-200 shadow-5 overflow-hidden mb-4 sm:rounded-lg">
            <div className="px-4 py-5 border-b-0 border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {LessonBuilderDict[userLanguage]['INFORMATION_HEADING']}
              </h3>
            </div>

            {loading ? (
              <div className="h-24 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-2 divide-x-0 divide-gray-200 p-4">
                <div className="p-2 px-4">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['NAME']}:
                    </span>
                    <span className="w-auto">{title}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['OWNER']}:
                    </span>
                    <span className="w-auto">{institution ? institution.name : '-'}</span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['PURPOSE']}:
                    </span>
                    <span
                      className="w-7/10"
                      dangerouslySetInnerHTML={{__html: purpose}}
                    />
                  </p>
                </div>
                <div className="p-2 px-8">
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['DESIGNER']}:
                    </span>
                    <span className="w-auto">
                      {selectedDesigners.length
                        ? selectedDesigners.map((designer) => designer.name).join(', ')
                        : '-'}
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['LANGUAGE']}:
                    </span>
                    <span className="w-auto">
                      {language.length
                        ? languageList
                            .filter((lang) => language.includes(lang.value))
                            .map((l: any) => l.name)
                            .join(', ')
                        : '-'}
                    </span>
                  </p>
                  <p className="text-base leading-5 font-medium text-gray-500 my-3 flex">
                    <span className="text-gray-900 mr-2 w-3/10">
                      {' '}
                      {LessonBuilderDict[userLanguage]['OBJECTIVE']}:
                    </span>
                    <span
                      className="w-7/10"
                      dangerouslySetInnerHTML={{__html: objectives[0]}}
                    />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {true && (
          <div className="bg-white border-gray-200 shadow-5 overflow-hidden sm:rounded-lg  mb-4">
            <div className="">
              <UnderlinedTabs tabs={tabs} activeTab={activeTab} updateTab={updateTab} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabView;
