import DashboardContainer from '@components/Dashboard/DashboardContainer';
import useAuth from '@customHooks/useAuth';
import {Card, Col, Row, Tabs, TabsProps} from 'antd';
import {general} from 'assets';
import PageLayout from 'layout/PageLayout';
import {Redirect} from 'react-router-dom';
import AttachedCoursesGraph from './AttachedCoursesGraph';
import InstitutionLocationGraph from './InstitutionLocationGraph';
import StudentsByStatusGraph from './students/StudentsByStatusGraph';
import SurveyCompletedGraph from './SurveyCompletedGraph';
import WritingExerciseGraph from './WritingExerciseGraph';
import StudentsByInstitutionGraph from './students/StudentsByInstitutionGraph';
import StudentsByTypeGraph from './students/StudentsByTypeGraph';
import StudentsByDemographicsGraph from './students/StudentsByDemographicsGraph';
import CompletedIncompletedGraph from './CompletedIncompletedGraph';

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
    title: 'Active Students by Institution',
    key: 'students',

    component: <StudentsByInstitutionGraph />
  },
  {
    title: 'Active Students by Type',
    key: 'students',

    component: <StudentsByTypeGraph />
  },
  {
    title: 'Active Students by Demographics',
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
    title: 'Institutions',
    key: 'institutions',

    component: <InstitutionLocationGraph />
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
