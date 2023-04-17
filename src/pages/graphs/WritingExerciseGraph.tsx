import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import Report from '@components/Graphs/Report';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {listUniversalLessonWritingExcercises} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import React from 'react';

const WritingExerciseGraph = () => {
  const listWritingExercises = async () => {
    const _allUniversalClassData: any = await API.graphql(
      graphqlOperation(listUniversalLessonWritingExcercises, {
        limit: SEARCH_LIMIT,
        filter: {
          hasExerciseData: {
            eq: true
          }
        }
      })
    );
    return _allUniversalClassData.data.listUniversalLessonWritingExcercises.items;
  };

  const {
    data: writingExcercises,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['universal-lesson-writing-exercise'],
    queryFn: listWritingExercises
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting writing excercises...." />
      </div>
    );
  }

  if (writingExcercises && writingExcercises?.length > 0) {
    // group writing exercises array by studentEmail and count the number of writing exercises
    console.log(writingExcercises);

    const grouped: any[] = writingExcercises.reduce((acc: any[], we) => {
      const name = we?.lesson.title;
      //   @ts-ignore
      const weCount = we?.count || 1;
      const weIndex = acc.findIndex((we) => we.lesson.title === name);
      if (weIndex > -1) {
        acc[weIndex].count += weCount;
      } else {
        acc.push({...we, count: 1});
      }
      return acc;
    }, []);

    const data = grouped.map((we) => ({
      label: we?.lesson.title,
      value: we?.count
    }));

    const pieGraphConfig = useGraphConfig<PieConfig>({
      data,
      legendTitle: 'Lessons'
    });

    const highestCount = data.reduce((acc, we) => {
      return acc.value > we.value ? acc : we;
    });

    return (
      <div className="">
        <Pie {...pieGraphConfig} />
        <Report
          description={
            <>
              After calculating all the metrics, it was found that{' '}
              <strong>{highestCount.label}</strong> has{' '}
              <strong>{highestCount.value}</strong> number of writing exercises, which is
              the highest number of writing exercises. Also{' '}
              <span
                dangerouslySetInnerHTML={{
                  __html: data
                    .filter((d) => d.label !== highestCount.label)
                    .map(
                      (d) =>
                        ` <strong>${d.label}</strong> is attached to <strong>${d.value}</strong> rooms. `
                    )
                    .toString()
                }}></span>
            </>
          }
        />
      </div>
    );
  }

  return <Empty description="No writing exercises" />;
};

export default WritingExerciseGraph;
