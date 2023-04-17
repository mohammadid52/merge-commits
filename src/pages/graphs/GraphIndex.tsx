import DashboardContainer from '@components/Dashboard/DashboardContainer';
import useAuth from '@customHooks/useAuth';
import {Col, Row, theme} from 'antd';
import {general, graphs} from 'assets';
import PageLayout from 'layout/PageLayout';
import {useState} from 'react';
import {Redirect, useRouteMatch} from 'react-router-dom';
import GraphRouter from 'router/GraphRouter';
import AttachedCoursesGraph from './AttachedCoursesGraph';
import InstitutionLocationGraph from './InstitutionLocationGraph';
import StudentActiveGraph from './StudentActiveGraph';
import SurveyCompletedGraph from './SurveyCompletedGraph';
import WritingExerciseGraph from './WritingExerciseGraph';

const listOfGraphs = [
  {
    title: 'Active Students',
    description: 'Active and Inactive students',
    image: graphs.pie,
    link: '/students',
    component: <StudentActiveGraph />
  },
  {
    title: 'Surveys',
    description: 'Number of surveys completed',
    image: graphs.pie,
    link: '/surveys',
    component: <SurveyCompletedGraph />
  },
  {
    title: 'Courses',
    description: 'Courses attached to classrooms',
    image: graphs.pie,
    link: '/courses',
    component: <AttachedCoursesGraph />
  },
  {
    title: 'Writing Exercises',
    description: 'Number of writing exercises',
    image: graphs.pie,
    link: '/writing-exercises',
    component: <WritingExerciseGraph />
  },
  {
    title: 'Institutions',
    description: 'Institutions locations',
    image: graphs.map,
    component: <InstitutionLocationGraph />,
    link: '/institutions'
  }
];

const GraphIndex = () => {
  const match = useRouteMatch();

  const [selectedGraph, setSelectedGraph] = useState<null | string>(null);

  const onSelectGraph = (title: string) => {
    // scroll to graph-container id on click
    setSelectedGraph(title);

    setTimeout(() => {
      const graphContainer = document.getElementById('graph-container');

      if (graphContainer) {
        graphContainer.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }, 500);
  };

  const {isBuilder, isAdmin, user} = useAuth();

  if (!isBuilder && !isAdmin && user.id !== '') return <Redirect to="/dashboard/home" />;

  const {token} = theme.useToken();

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={general.dashboardUrl}
      bannerTitle="Dashboard">
      <PageLayout title="Graphs" hideInstProfile>
        <Row gutter={[16, 24]}>
          {listOfGraphs.map((graph) => (
            <Col
              key={graph.title}
              className="gutter-row"
              span={graph.link === '/institutions' ? 24 : 12}>
              {graph.component}
              {/* <NavLink
                to={`${match.url}${graph.link}`}
                onClick={() => onSelectGraph(graph.title)}>
                <Card
                  hoverable
                  style={{
                    borderColor:
                      selectedGraph === graph.title
                        ? token.colorPrimary
                        : token.colorBorder
                  }}
                  cover={
                    <div className="px-4 pt-1 min-h-[10rem] w-[10rem] flex items-center justify-center">
                      <img height={'100%'} width={'100%'} alt="graph" src={graph.image} />
                    </div>
                  }>
                  <Card.Meta title={graph.title} description={graph.description} />
                </Card>
              </NavLink> */}
            </Col>
          ))}
        </Row>

        {selectedGraph && <GraphRouter />}
      </PageLayout>
    </DashboardContainer>
  );
};

export default GraphIndex;
