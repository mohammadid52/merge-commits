import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {listPersonLessonsDataForGraph} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';

const SurveyCompletedGraph = () => {
  const listPersonLessonsData = async () => {
    try {
      const res: any = await API.graphql(
        graphqlOperation(listPersonLessonsDataForGraph, {
          limit: SEARCH_LIMIT,
          filter: {
            lessonType: {eq: 'survey'},
            isCompleted: {eq: true}
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
    queryKey: ['surveys-list-graph'],
    queryFn: listPersonLessonsData
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting students...." />
      </div>
    );
  }

  if (surveys && surveys?.length > 0) {
    // group survey names and count
    // if the survey name is the same, add the count
    // if the survey name is different, create a new object
    const groupedSurveys: any[] = surveys.reduce((acc: any[], survey) => {
      const surveyName = survey?.lesson?.title;
      //   @ts-ignore
      const surveyCount = survey?.lesson?.count || 1;
      const surveyIndex = acc.findIndex((survey) => survey?.lesson?.title === surveyName);
      if (surveyIndex > -1) {
        acc[surveyIndex].lesson.count += surveyCount;
      } else {
        acc.push({...survey, lesson: {...survey?.lesson, count: 1}});
      }
      return acc;
    }, []);

    const data = groupedSurveys.map((survey) => ({
      label: survey?.lesson?.title,
      value: survey?.lesson?.count
    }));

    const pieGraphConfig = useGraphConfig<PieConfig>({
      data,
      legendTitle: 'Surveys'
    });

    // get the highest count with label

    const highestCount = data.reduce((acc, survey) => {
      return acc.value > survey.value ? acc : survey;
    });

    return (
      <div className="">
        <Pie {...pieGraphConfig} />
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
  return <Empty description="No surveys found" />;
};

export default SurveyCompletedGraph;
