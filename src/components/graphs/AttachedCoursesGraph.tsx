import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listRoomsForGraphs} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {RoomStatus} from 'API';
import {Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';

const AttachedCoursesGraph = () => {
  const {zoiqFilter} = useGlobalContext();
  // get list of courses

  const fetchAllRooms = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listRoomsForGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            status: {
              eq: RoomStatus.ACTIVE
            }
          },
          zoiqFilter
        )
      })
    );

    return res.data.listRooms.items;
  };

  const {
    data: roomsList,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['rooms-list-graph'],
    queryFn: fetchAllRooms
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting rooms and courses...." />
      </div>
    );
  }

  if (roomsList && roomsList?.length > 0) {
    //  map curriculum in room to get the number of courses

    // This code takes the "roomsList" array and maps each room to its curriculum item.
    // It then filters out any items that are undefined or null using the "Boolean" method.

    const curriculumList = roomsList
      .map((room) => {
        return room?.curricula?.items[0].curriculum;
      })
      .filter(Boolean);

    // The next portion of the code initializes an empty array called "groupedCurriculm". It then uses the
    // reduce() method on the "curriculumList" array to count how many curricula there are for each unique name.
    // The result is then pushed into the "groupedCurriculum" array as an object with the count property.

    const groupedCurriculm: any[] = curriculumList.reduce((acc: any[], cur) => {
      const count = cur?.count || 1;
      const curIndex = acc.findIndex((_cur) => _cur.name === cur.name);
      if (curIndex > -1) {
        acc[curIndex].count += count;
      } else {
        acc.push({...cur, count: 1});
      }
      return acc;
    }, []);

    const data = groupedCurriculm.map((cur) => ({
      label: cur?.name,
      value: cur.count
    }));

    const pieGraphConfig = useGraphConfig<PieConfig>({
      data,
      legendTitle: 'Courses'
    });
    // get the highest count with label

    // const highestCount = data.reduce((acc, course) => {
    //   return acc.value > course.value ? acc : course;
    // });

    return (
      <div className="">
        <Pie {...pieGraphConfig} />

        {/* <Report
          description={
            <>
              Based on the analysis of courses attached to rooms, it was found that{' '}
              <strong>{highestCount.label}</strong> is connected to{' '}
              <strong>{highestCount.value}</strong> rooms, which is the highest number of
              course connected to a different rooms. Meanwhile{' '}
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
        /> */}
      </div>
    );
  }

  return <Empty description="No courses found with attached rooms" />;
};

export default AttachedCoursesGraph;
