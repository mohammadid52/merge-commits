import DashboardContainer from '@components/Dashboard/DashboardContainer';
import InstitutionCalendar from '@components/graphs/institutions/InstitutionCalendar';
import InstitutionStatusGraph from '@components/graphs/institutions/InstitutionStatusGraph';
import StudentsByDemographicsGraph from '@components/graphs/students/StudentsByDemographicsGraph';
import useAuth from '@customHooks/useAuth';
import {Card, Tabs, TabsProps} from 'antd';
import {general} from 'assets';
import AttachedCoursesGraph from 'components/graphs/AttachedCoursesGraph';
import CompletedIncompletedGraph from 'components/graphs/CompletedIncompletedGraph';
import SurveyCompletedGraph from 'components/graphs/SurveyCompletedGraph';
import WritingExerciseGraph from 'components/graphs/WritingExerciseGraph';
import InstitutionLocationGraph from 'components/graphs/institutions/InstitutionLocationGraph';
import StudentsByInstitutionGraph from 'components/graphs/students/StudentsByInstitutionGraph';
import StudentsByStatusGraph from 'components/graphs/students/StudentsByStatusGraph';
import StudentsByTypeGraph from 'components/graphs/students/StudentsByTypeGraph';
import PageLayout from 'layout/PageLayout';
import {Redirect} from 'react-router-dom';

const RowWrapper = ({items}: {items: {title: string; component: React.ReactNode}[]}) => {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 ">
      {items.map((graph) => (
        <div key={graph.title}>
          <Card type="inner" title={graph.title}>
            {graph.component}
          </Card>
        </div>
      ))}
    </div>
  );
};

const listOfGraphs = [
  {
    title: 'Students by Status',
    key: 'students',

    component: <StudentsByStatusGraph />
  },
  {
    title: 'Students by Institution',
    key: 'students',

    component: <StudentsByInstitutionGraph />
  },
  {
    title: 'Students by Type',
    key: 'students',

    component: <StudentsByTypeGraph />
  },
  {
    title: 'Students by Demographics',
    key: 'students',

    component: <StudentsByDemographicsGraph />
  },
  {
    title: 'Completed Surveys By Students',
    key: 'surveys',

    component: <SurveyCompletedGraph />
  },
  {
    title: 'Survey Status',
    key: 'surveys',

    component: <CompletedIncompletedGraph />
  },
  {
    title: 'Courses',
    key: 'courses',

    component: <AttachedCoursesGraph />
  },
  {
    title: 'Writing Exercises',
    key: 'writing-exercises',

    component: <WritingExerciseGraph />
  },
  {
    title: 'Institution Locations',
    key: 'institutions',

    component: <InstitutionLocationGraph />
  },
  {
    title: 'Institution Status',
    key: 'institutions',

    component: <InstitutionStatusGraph />
  },
  {
    title: 'Calendar',
    key: 'schedule',

    component: <InstitutionCalendar />
  }
];

const GraphIndex = () => {
  const {isBuilder, isAdmin, user} = useAuth();

  if (!isBuilder && !isAdmin && user.id !== '') return <Redirect to="/dashboard/home" />;

  const listOfCategories: TabsProps['items'] = [
    {
      label: 'Students',
      key: 'students',
      children: (
        <RowWrapper items={listOfGraphs.filter((graph) => graph.key === 'students')} />
      )
    },
    {
      label: 'Lesson/Surveys',
      key: 'surveys',
      children: (
        <RowWrapper items={listOfGraphs.filter((graph) => graph.key === 'surveys')} />
      )
    },
    {
      label: 'Courses',
      key: 'courses',
      children: (
        <RowWrapper items={listOfGraphs.filter((graph) => graph.key === 'courses')} />
      )
    },
    {
      label: 'Writing Exercises',
      key: 'writing-exercises',
      children: (
        <RowWrapper
          items={listOfGraphs.filter((graph) => graph.key === 'writing-exercises')}
        />
      )
    },
    {
      label: 'Institutions',
      key: 'institutions',
      children: (
        <RowWrapper
          items={listOfGraphs.filter((graph) => graph.key === 'institutions')}
        />
      )
    }
    // {
    //   label: 'Schedule',
    //   key: 'schedule',
    //   children: (
    //     <RowWrapper items={listOfGraphs.filter((graph) => graph.key === 'schedule')} />
    //   )
    // }
  ];

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={general.dashboardUrl}
      bannerTitle="Dashboard">
      <PageLayout title="Graph & Schedules" hideInstProfile hideGoBack>
        <Tabs items={listOfCategories} />
      </PageLayout>
    </DashboardContainer>
  );
};

export default GraphIndex;
