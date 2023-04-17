import DashboardContainer from '@components/Dashboard/DashboardContainer';
import useAuth from '@customHooks/useAuth';
import {Card, Col, Row} from 'antd';
import {general, graphs} from 'assets';
import PageLayout from 'layout/PageLayout';
import {Redirect} from 'react-router-dom';
import AttachedCoursesGraph from './AttachedCoursesGraph';
import InstitutionLocationGraph from './InstitutionLocationGraph';
import StudentActiveGraph from './StudentActiveGraph';
import SurveyCompletedGraph from './SurveyCompletedGraph';
import WritingExerciseGraph from './WritingExerciseGraph';
import CompletedIncompletedSurveysGraph from './CompletedIncompletedSurveysGraph';

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
  // {
  //   title: 'Completed vs In Progress Surveys/Lessons',
  //   description: 'shows the stacked graph of completed vs in progress surveys/lessons',
  //   image: graphs.map,
  //   component: <CompletedIncompletedSurveysGraph />,
  //   link: '/completed-incompleted-surveys'
  // }
];

const GraphIndex = () => {
  const {isBuilder, isAdmin, user} = useAuth();

  if (!isBuilder && !isAdmin && user.id !== '') return <Redirect to="/dashboard/home" />;

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={general.dashboardUrl}
      bannerTitle="Dashboard">
      <PageLayout title="Graphs" hideInstProfile hideGoBack>
        <Row gutter={[16, 24]}>
          {listOfGraphs.map((graph) => (
            <Col
              key={graph.title}
              className="gutter-row"
              span={graph.link === '/institutions' ? 24 : 12}>
              <Card type="inner" title={graph.title}>
                {graph.component}
              </Card>
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

        {/* {selectedGraph && <GraphRouter />} */}
      </PageLayout>
    </DashboardContainer>
  );
};

export default GraphIndex;
