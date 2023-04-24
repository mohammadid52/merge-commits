import Loader from '@components/Atoms/Loader';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import InstituteName from '@components/MicroComponents/InstituteName';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForGraphs} from '@customGraphql/customQueries';

import useDictionary from '@customHooks/dictionary';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {formatPhoneNumber, getHostNameFromUrl} from '@utilities/strings';
import {Institution} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import {useHistory, useRouteMatch} from 'react-router-dom';

interface ServiceProviderListProps {
  id: string;
}

const ServiceProviderList = ({id}: ServiceProviderListProps) => {
  const {InstitutionDict, userLanguage} = useDictionary();

  const {zoiqFilter} = useGlobalContext();

  const fetchInstitutionLocation = async () => {
    const res: any = await API.graphql(
      graphqlOperation(listInstitutionsForGraphs, {
        limit: SEARCH_LIMIT,
        filter: withZoiqFilter(
          {
            id: {
              ne: id
            }
          },
          zoiqFilter
        )
      })
    );
    return res.data.listInstitutions.items;
  };

  const {
    data: institutionList,

    isFetched
  } = useQuery<Institution[]>({
    queryKey: [`institution-list-${id}`],
    queryFn: fetchInstitutionLocation
  });

  const dictionary = InstitutionDict[userLanguage]['TABLE'];
  const match = useRouteMatch();
  const history = useHistory();

  const handleInstitutionView = (id: string) => {
    history.push(`${match.url}/institution/${id}/edit`);
  };

  if (isFetched && institutionList && institutionList.length > 0) {
    const {searchInput} = useSearch(institutionList, ['name']);

    const {getIndex, allAsProps} = usePagination(
      institutionList || [],
      institutionList.length || 0
    );

    const dataList = map(institutionList, (institution, idx) => ({
      markRed: Boolean(institution?.isZoiq),
      onClick: () => institution && handleInstitutionView(institution?.id),
      no: getIndex(idx),
      instituteName: (
        <InstituteName
          searchTerm={searchInput.value}
          name={institution?.name || ''}
          image={institution?.image || ''}
          id={institution?.id || ''}
        />
      ),
      name: institution?.name,
      type: institution?.type || '--',
      website: institution?.website ? getHostNameFromUrl(institution.website) : '--',
      contactNo: institution?.phone ? formatPhoneNumber(institution.phone) : '--'
      // actions: (
      //   <CommonActionsBtns
      //     button1Label="Edit"
      //     button1Action={() => hand∏leInstitutionView(institution.id)}
      //   />
      // )
    }));

    const tableConfig: ITableProps = {
      headers: [
        'No',
        dictionary['NAME'],
        dictionary['TYPE'],
        dictionary['WEBSITE'],
        dictionary['CONTACT']
        // dictionary['ACTION']
      ],
      dataList,
      config: {
        dataList: {
          pagination: {
            showPagination: !searchInput.isActive,
            config: {
              allAsProps
            }
          }
        }
      }
    };

    return (
      <PageLayout type="inner" title={InstitutionDict[userLanguage]['TITLE']}>
        <Table {...tableConfig} />
      </PageLayout>
    );
  }
  return null;
};

export default ServiceProviderList;
