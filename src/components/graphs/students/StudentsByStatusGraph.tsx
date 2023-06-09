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

const StudentsByStatusGraph = () => {
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
              ne: PersonStatus.TRAINING
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
    queryKey: ['students-by-status'],
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
    const activeStudents = students.filter(
      (student) => student.status === PersonStatus.ACTIVE
    );

    const inactiveStudents = students.filter(
      (student) => student.status === PersonStatus.INACTIVE
    );

    const data = [
      {
        label: 'Active Students',
        value: activeStudents.length
      },
      {
        label: 'Inactive Students',
        value: inactiveStudents.length
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

        {/* <Report
          description={
            <>
              Out of the total <strong>{students.length}</strong> students in the school,
              around <strong>{activeStudents.length}</strong> are <strong>active</strong>,
              while <strong>{inactiveStudents.length}</strong> students fall under the
              category of <strong>inactive</strong> students
            </>
          }
        /> */}
      </div>
    );
  }
  return null;
};

export default StudentsByStatusGraph;
