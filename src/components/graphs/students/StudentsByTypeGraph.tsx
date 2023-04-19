import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listPersons} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {Person, PersonStatus, Role} from 'API';
import {Typography} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';

const StudentsByTypeGraph = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchAllPerson = async () => {
    let resp: any = await API.graphql(
      graphqlOperation(listPersons, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            role: {
              eq: Role.ST
            },
            status: {
              eq: PersonStatus.ACTIVE
            }
          },
          zoiqFilter
        )
      })
    );
    const users = resp?.data?.listPeople?.items;
    return users;
  };

  const {
    data: students,
    isLoading,
    isFetched
  } = useQuery<Person[]>({
    queryKey: ['students-by-type'],
    queryFn: fetchAllPerson
  });

  if (isLoading) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting students..." />
      </div>
    );
  }

  if (isFetched && students && students?.length > 0) {
    const classroomStudents = students.filter((student) => !Boolean(student.onDemand));

    const onDemandStudents = students.filter((student) => Boolean(student.onDemand));

    const data = [
      {
        label: 'Classroom Students',
        value: classroomStudents.length
      },
      {
        label: 'On Demand Students',
        value: onDemandStudents.length
      }
    ];

    const pieGraphConfig = useGraphConfig<PieConfig>({
      data,
      legendTitle: 'Students',
      statisticsTitle: 'Total Students'
    });

    return (
      <div className="">
        <Pie {...pieGraphConfig} />
      </div>
    );
  }
  return null;
};

export default StudentsByTypeGraph;
