import DashboardContainer from '@components/Dashboard/DashboardContainer';
import {Card, Col, Row} from 'antd';
import {general, graphs} from 'assets';
import PageLayout from 'layout/PageLayout';
import {useState} from 'react';
import {NavLink, useRouteMatch} from 'react-router-dom';
import GraphRouter from 'router/GraphRouter';

const listOfGraphs = [
  {
    title: 'Active Students',
    description: 'Active and Inactive students',
    image: graphs.pie,
    link: '/students'
  },
  {
    title: 'Surveys',
    description: 'Number of surveys completed',
    image: graphs.pie,
    link: '/surveys'
  },
  {
    title: 'Courses',
    description: 'Courses attached to classrooms',
    image: graphs.pie,
    link: '/courses'
  },
  {
    title: 'Writing Exercises',
    description: 'Number of writing exercises',
    image: graphs.pie,
    link: '/writing-exercises'
  },
  {
    title: 'Institutions',
    description: 'Institutions by type',
    image: graphs.map,
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

  return (
    <DashboardContainer
      showTitleBanner={false}
      bannerImg={general.dashboardUrl}
      bannerTitle="Dashboard">
      <PageLayout title="Graphs" hideInstProfile>
        <Row gutter={[16, 24]}>
          {listOfGraphs.map((graph) => (
            <Col key={graph.title} className="gutter-row" span={6}>
              <NavLink
                to={`${match.url}${graph.link}`}
                onClick={() => onSelectGraph(graph.title)}>
                <Card
                  hoverable
                  cover={
                    <div className="px-4 pt-1 min-h-[10rem] w-[10rem] flex items-center justify-center">
                      <img height={'100%'} width={'100%'} alt="graph" src={graph.image} />
                    </div>
                  }>
                  <Card.Meta title={graph.title} description={graph.description} />
                </Card>
              </NavLink>
            </Col>
          ))}
        </Row>

        {selectedGraph && <GraphRouter />}
      </PageLayout>
    </DashboardContainer>
  );
};

export default GraphIndex;
