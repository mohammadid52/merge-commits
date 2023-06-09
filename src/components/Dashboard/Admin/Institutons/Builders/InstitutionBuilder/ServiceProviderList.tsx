import Modal from '@components/Atoms/Modal';
import {Status} from '@components/Dashboard/Admin/UserManagement/UserStatus';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import InstituteName from '@components/MicroComponents/InstituteName';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useGlobalContext} from '@contexts/GlobalContext';
import {listInstitutionsForGraphs} from '@customGraphql/customQueries';

import Buttons from '@components/Atoms/Buttons';
import Filters, {SortType} from '@components/Atoms/Filters';
import useDictionary from '@customHooks/dictionary';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {useQuery} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {getHostNameFromUrl} from '@utilities/strings';
import {Institution, RoomStatus} from 'API';
import {List, Tooltip} from 'antd';
import {API, graphqlOperation} from 'aws-amplify';
import PageLayout from 'layout/PageLayout';
import {map, orderBy} from 'lodash';
import {useState} from 'react';
import InstitutionFormComponent from './InstitutionFormComponent';
import useAuth from '@customHooks/useAuth';

interface ServiceProviderListProps {
  id: string;
  postMutation?: (data: any) => void;
}

const ServiceProviderList = ({id}: ServiceProviderListProps) => {
  const {InstitutionDict, userLanguage} = useDictionary();
  const {isAdmin} = useAuth();
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
    refetch,
    isLoading
  } = useQuery<Institution[]>({
    queryKey: [`institution-list-${id}`],
    queryFn: fetchInstitutionLocation
  });

  const dictionary = InstitutionDict[userLanguage]['TABLE'];

  const [institutionModal, setInstitutionModal] = useState(false);
  const [institutionForModal, setInstitutionForModal] = useState<any>({});
  const [filteredList, setFilteredList] = useState<Institution[]>([]);

  const onInstitutionClick = (institute: any) => {
    setInstitutionModal(true);
    setInstitutionForModal(institute);
  };

  const {searchInput, setSearchInput} = useSearch(institutionList || [], ['name']);
  const {getIndex, allAsProps, resetPagination, currentList} = usePagination(
    institutionList || [],
    institutionList?.length || 0
  );

  const [filters, setFilters] = useState<SortType | null>(null);

  const finalList = orderBy(
    searchInput.isActive ? filteredList : currentList,
    ['name', 'institutionName'],
    ['asc']
  );

  const dataList = map(finalList, (institution, idx) => ({
    markRed: Boolean(institution?.isZoiq),
    onClick: () => isAdmin && institution && onInstitutionClick(institution),
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
    website: institution?.website ? (
      <Buttons
        label={getHostNameFromUrl(institution.website)}
        variant="link"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          window.open(institution?.website, '_blank');
        }}
      />
    ) : (
      '--'
    ),
    // contactNo: institution?.phone ? formatPhoneNumber(institution.phone) : '--',
    status: <Status useDefault status={institution?.status || RoomStatus.ACTIVE} />,
    rooms: (
      <List
        size="small"
        className="table-list"
        dataSource={institution?.rooms?.items?.filter(
          (d: any) => d.status === RoomStatus.ACTIVE
        )}
        renderItem={(room: any, index: number) => (
          <Tooltip key={room.id} title={`Go to ${room.name}`} placement="left">
            <a
              href={`/dashboard/manage-institutions/institution/${room?.institutionID}/room-edit/${room.id}`}
              onMouseUp={(e) => {
                e.stopPropagation();
              }}>
              <List.Item className="cursor-pointer hover:underline hover:theme-text:400">
                {index + 1}. {room.name}
              </List.Item>
            </a>
          </Tooltip>
        )}
      />
    )
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

      'Rooms',
      'Status'
      // dictionary['ACTION']
    ],
    dataList,
    config: {
      dataList: {
        loading: isLoading,
        pagination: {
          showPagination: !searchInput.isActive,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);

      setFilteredList([]);
    } else {
      if (institutionList) {
        setSearchInput({...searchInput, isActive: true});

        const filtered = institutionList.filter((_d: any) => filterName === _d.status);

        setFilteredList(filtered);
        setFilters(filterName);
      }
    }
  };

  const closeAction = () => {
    setInstitutionModal(false);
    setInstitutionForModal({});
  };

  return (
    <PageLayout type="inner" title={InstitutionDict[userLanguage]['TITLE']}>
      {isAdmin && (
        <Modal
          width={1000}
          closeOnBackdrop
          closeAction={closeAction}
          title="Institution Details"
          open={institutionModal}>
          <InstitutionFormComponent
            institutionInfo={institutionForModal}
            onCancel={closeAction}
            postMutation={(data: any) => {
              refetch();
              setInstitutionForModal({});
              setFilters(null);
              setInstitutionModal(false);
            }}
          />
        </Modal>
      )}
      <Filters
        loading={isLoading}
        list={institutionList}
        resetPagination={resetPagination}
        updateFilter={updateFilter}
        filters={filters}
      />
      <Table {...tableConfig} />
    </PageLayout>
  );
};

export default ServiceProviderList;
