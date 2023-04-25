import {Pie, PieConfig} from '@ant-design/plots';
import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForGraphs} from '@customGraphql/customQueries';
import useGraphConfig from '@customHooks/useGraphConfig';
import useTheme from '@customHooks/useTheme';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {Institution, RoomStatus} from 'API';
import {Empty} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';

const Graph = ({insitutionList}: {insitutionList: Institution[]}) => {
  const activeInstitutions = insitutionList.filter(
    (institution) => institution.status === RoomStatus.ACTIVE
  );
  const inactiveInstitutions = insitutionList.filter(
    (institution) => institution.status === RoomStatus.INACTIVE
  );

  const data = [
    {
      label: 'Active Institutions',
      value: activeInstitutions.length
    },
    {
      label: 'Inactive Institutions',
      value: inactiveInstitutions.length
    }
  ];

  const {colors} = useTheme();
  const pieGraphConfig = useGraphConfig<PieConfig>({
    data,
    legendTitle: 'Institution Status',
    statisticsTitle: 'Total Institutions',
    colors: [colors.primary, colors.secondary]
  });
  return <Pie {...pieGraphConfig} />;
};

const InstitutionStatusGraph = () => {
  const {zoiqFilter} = useGlobalContext();

  const fetchInstitutionLocation = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listInstitutionsForGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter({}, zoiqFilter)
      })
    );
    return res.data.listInstitutions.items;
  };

  const {
    data: insitutionList,
    isLoading,
    isFetched
  } = useQuery<any[]>({
    queryKey: ['institution-list-by-status-graph'],
    queryFn: fetchInstitutionLocation
  });

  if (isLoading && !isFetched) {
    return (
      <div className="min-h-56 flex items-center justify-center">
        <Loader withText="Getting institutions...." />
      </div>
    );
  }

  //  filter data by status
  if (insitutionList && insitutionList?.length > 0) {
    return <Graph insitutionList={insitutionList} />;
  }
  return <Empty description="No institutions found" />;
};

export default InstitutionStatusGraph;
