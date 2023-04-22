import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listPersonWithRoomsAndInstitutionForGraph} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {Person, PersonStatus, Role} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {getGroupedData} from './StudentsByDemographicsGraph';

const StudentsByInstitutionGraph = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchAllPerson = async () => {
    let resp: any = await API.graphql(
      graphqlOperation(listPersonWithRoomsAndInstitutionForGraph, {
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
    queryKey: ['students-by-institution'],
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
    const institutions = students
      .map((student) => {
        const inst = student?.classes?.items?.[0]?.class?.institution;

        if (inst && inst.name) {
          return {
            authId: student.authId,
            value: inst.name
          };
        }
        return {
          authId: student.authId,
          value: 'Other'
        };
      })
      .filter(Boolean);

    const data = getGroupedData(institutions);

    const pieGraphConfig = useGraphConfig<PieConfig>({
      data,
      legendTitle: 'Institutions',
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

export default StudentsByInstitutionGraph;
