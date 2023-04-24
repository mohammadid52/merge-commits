import DashboardContainer from '@components/Dashboard/DashboardContainer';
import useAuth from '@customHooks/useAuth';
import {Card, Col, Row, Tabs, TabsProps} from 'antd';
import {general} from 'assets';
import PageLayout from 'layout/PageLayout';
import {Redirect} from 'react-router-dom';
// const AttachedCoursesGraph = lazy(() => import('components/graphs/AttachedCoursesGraph'));
import AttachedCoursesGraph from 'components/graphs/AttachedCoursesGraph';
import InstitutionLocationGraph from 'components/graphs/institutions/InstitutionLocationGraph';

// const StudentsByStatusGraph = lazy(
//   () => import('components/graphs/students/StudentsByStatusGraph')
// );
import StudentsByStatusGraph from 'components/graphs/students/StudentsByStatusGraph';
// const SurveyCompletedGraph = lazy(() => import('components/graphs/SurveyCompletedGraph'));
import SurveyCompletedGraph from 'components/graphs/SurveyCompletedGraph';
// const WritingExerciseGraph = lazy(() => import('components/graphs/WritingExerciseGraph'));
import WritingExerciseGraph from 'components/graphs/WritingExerciseGraph';
// const StudentsByInstitutionGraph = lazy(
//   () => import('components/graphs/students/StudentsByInstitutionGraph')
// );
import StudentsByInstitutionGraph from 'components/graphs/students/StudentsByInstitutionGraph';
// const StudentsByTypeGraph = lazy(
//   () => import('components/graphs/students/StudentsByTypeGraph')
// );
import StudentsByDemographicsGraph from '@components/graphs/students/StudentsByDemographicsGraph';
import StudentsByTypeGraph from 'components/graphs/students/StudentsByTypeGraph';
// const CompletedIncompletedGraph = lazy(
//   () => import('components/graphs/CompletedIncompletedGraph')
// );
import CompletedIncompletedGraph from 'components/graphs/CompletedIncompletedGraph';
// const InstitutionStatusGraph = lazy(
//   () => import('@components/graphs/institutions/InstitutionStatusGraph')
// );
import InstitutionStatusGraph from '@components/graphs/institutions/InstitutionStatusGraph';
// const InstitutionCalendar = lazy(
//   () => import('@components/graphs/institutions/InstitutionCalendar')
// );

import InstitutionCalendar from '@components/graphs/institutions/InstitutionCalendar';

const RowWrapper = ({items}: {items: {title: string; component: React.ReactNode}[]}) => {
  return (
    <Row gutter={[16, 24]}>
      {items.map((graph) => (
        <Col key={graph.title} className="gutter-row" span={12}>
          <Card type="inner" title={graph.title}>
            {graph.component}
          </Card>
        </Col>
      ))}
    </Row>
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
    key: 'institutions',

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
  ];

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={general.dashboardUrl}
      bannerTitle="Dashboard">
      <PageLayout title="Graph" hideInstProfile hideGoBack>
        <Tabs items={listOfCategories} />
      </PageLayout>
    </DashboardContainer>
  );
};

export default GraphIndex;
