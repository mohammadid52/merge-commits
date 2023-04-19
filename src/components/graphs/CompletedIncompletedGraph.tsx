import {Column, ColumnConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {listPersonLessonsDataForGraph} from '@customGraphql/customQueries';
import {useQuery} from '@tanstack/react-query';
import {Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';

const CompletedIncompletedGraph = () => {
  const listPersonLessonsData = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(listPersonLessonsDataForGraph, {
          limit: SEARCH_LIMIT,
          filter: {
            lessonType: {eq: 'survey'}
          }
        })
      );
      return res.data.listPersonLessonsData.items;
    } catch (error) {
      console.error(error);
    }
  };

  const {
    data: surveys,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['lessons-surveys-completed-graph'],
    queryFn: listPersonLessonsData
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting lessons and surveys...." />
      </div>
    );
  }

  if (surveys && surveys?.length > 0) {
    const groupedSurveys = surveys.reduce((acc: any[], survey) => {
      const surveyName = survey?.lesson?.title;

      const isCompleted = Boolean(survey?.isCompleted);

      const surveyIndex = acc.findIndex((survey) => survey?.lesson?.title === surveyName);

      if (surveyIndex > -1) {
        // already exists.
        // check if completed or not

        // if completed, add to completed count

        if (isCompleted) {
          acc[surveyIndex].lesson.completed += 1;
        } else {
          acc[surveyIndex].lesson.incompleted += 1;
        }
      } else {
        // does not exist
        // check if completed or not

        // if completed, add to completed count

        if (isCompleted) {
          acc.push({
            ...survey,
            lesson: {...survey?.lesson, completed: 1, incompleted: 0}
          });
        } else {
          acc.push({
            ...survey,
            lesson: {...survey?.lesson, completed: 0, incompleted: 1}
          });
        }
      }
      return acc;
    }, []);

    const lessons = groupedSurveys.map((survey) => survey?.lesson);

    // now group the lessons with count of completed and incompleted surveys
    const data = lessons
      .map((lesson) => {
        return [
          {
            label: lesson.title,
            value: lesson.completed,
            type: 'Completed'
          },
          {
            label: lesson.title,
            value: lesson.incompleted,
            type: 'In Progress'
          }
        ];
      })
      .flat();

    // const pieGraphConfig = useGraphConfig<PieConfig>({
    //   data,
    //   legendTitle: 'Lessons/Surveys'
    // });

    const config: ColumnConfig = {
      data,
      isStack: true,
      xField: 'label',
      yField: 'value',
      seriesField: 'type',
      color: ['#5AD8A6', '#5B8FF9'],
      label: {
        position: 'middle',

        layout: [
          {
            type: 'interval-adjust-position'
          },
          {
            type: 'interval-hide-overlap'
          },
          {
            type: 'adjust-color'
          }
        ]
      }
    };

    return (
      <div className="">
        <Column {...config} />

        {/* <Report
          description={
            <>
              After analyzing the completed surveys, it is evident that{' '}
              <strong>{highestCount.label}</strong>. had the highest overall completed
              surveys, with <strong>{highestCount.value}</strong> total completed survey.
              Meanwhile,{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: data
                    .filter((d) => d.label !== highestCount.label)
                    .map(
                      (d) =>
                        ` <strong>${d.label}</strong> had <strong>${d.value}</strong> completed surveys. `
                    )
                    .toString()
                }}></span>
            </>
          }
        /> */}
      </div>
    );
  }
  return <Empty description="No data found" />;
};

export default CompletedIncompletedGraph;
