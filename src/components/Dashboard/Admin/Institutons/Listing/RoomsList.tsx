import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Filters, {SortType} from '@components/Atoms/Filters';
import Highlighted from '@components/Atoms/Highlighted';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Table, {ITableProps} from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {useQueries} from '@tanstack/react-query';
import {withZoiqFilter} from '@utilities/functions';
import {getLocalStorageData} from '@utilities/localStorage';
import {ModelRoomFilterInput} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';
import {map, orderBy} from 'lodash';
import InsitutionSelector from '../../InsitutionSelector';
import {Status} from '../../UserManagement/UserStatus';
import PageLayout from 'layout/PageLayout';

// as of 9:15 am 30th march 2023. load time of this page is 5.67 seconds
// my goal is to bring it down to 3-4 seconds by 31st march 2023
// update: Success - 3.5 seconds

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId = ''} = props;
  const {
    state: {
      user: {associateInstitute}
    },
    zoiqFilter,

    userLanguage
  } = useGlobalContext();

  const history = useHistory();
  const {InstitueRomms} = useDictionary();

  const [roomList, setRoomList] = useState<any[]>([]);
  const [totalNum, setTotalNum] = useState(0);

  const [loading, setLoading] = useState(true);

  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const [messages] = useState({
    show: false,
    message: InstitueRomms[userLanguage]['messages']['nothaveclass'],
    isError: false
  });
  const createNewRoom = () => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/room-creation`
        : `/dashboard/manage-institutions/institution/${instId}/room-creation`
    );
  };

  const roomData = getLocalStorageData('room_info');
  const editCurrentRoom = (id: string, instId: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/room-edit/${id}`
        : `/dashboard/manage-institutions/institution/${
            instId || roomData.institutionID
          }/room-edit/${id}`
    );
  };

  const {authId, isFellow, isTeacher, isSuperAdmin, isAdmin, isBuilder} = useAuth();

  const filter: ModelRoomFilterInput =
    isFellow || isTeacher
      ? {
          teacherAuthID: {eq: authId}
        }
      : {};

  const fetchRooms = async () => {
    const assignedRoomsAsTeachers: any = await API.graphql(
      graphqlOperation(customQueries.listRoomsDashboard, {
        filter: withZoiqFilter(filter, zoiqFilter)
      })
    );
    const teachersList = assignedRoomsAsTeachers?.data?.listRooms?.items;
    return teachersList;
  };

  const fetchRoomCoTeachers = async () => {
    const assignedRoomsAsCoTeacher: any = await API.graphql(
      graphqlOperation(queries.listRoomCoTeachers, {
        filter: filter
      })
    );

    return assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items || [];
  };

  const [response1, response2] = useQueries({
    queries: [
      {
        queryKey: ['rooms'],
        queryFn: fetchRooms,

        enabled: instId === associateInstitute[0]?.institution?.id
      },
      {
        queryKey: ['roomsCoteachers'],
        queryFn: fetchRoomCoTeachers,

        enabled:
          instId === associateInstitute[0]?.institution?.id && (isFellow || isTeacher)
      }
    ]
  });

  const handleAfterFetch = () => {
    const updatedCoTeachersList: any[] =
      response2?.data
        ?.map((coTeacher: any) => {
          if (coTeacher) {
            const {room, teacher} = coTeacher;
            return {
              ...coTeacher,
              name: room?.name || '',
              status: teacher?.status || '',
              isCoteacher: true
            };
          }
        })
        .filter(Boolean) || [];

    if (
      (response1 && response1.isSuccess && response1?.data.length > 0) ||
      (response2 &&
        response2.isSuccess &&
        response2.data &&
        updatedCoTeachersList.length > 0)
    ) {
      const merged = [...response1?.data, ...updatedCoTeachersList].filter(Boolean);

      const updatedMerge = merged
        ?.map((room: any) => {
          if (room) {
            return {
              ...room,
              institutionId: room.institution?.id,
              institutionName: room.institution?.name
            };
          }
        })
        .filter(Boolean);

      const totalListPages = Math.floor(merged.length / pageCount);

      setTotalPages(
        totalListPages * pageCount === merged.length ? totalListPages : totalListPages + 1
      );

      setTotalNum(merged.length);

      setFirstPage(true);
      setLastPage(!(merged.length > pageCount));

      setRoomList(updatedMerge);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      (response1.isFetched && response1.isSuccess) ||
      (response2.isFetched && response2.isSuccess)
    ) {
      handleAfterFetch();
    }
  }, [
    response1.isFetched,
    response1.isSuccess,
    response2.isFetched,
    response2.isSuccess
  ]);

  const instituteChange = (value: string) => {
    setSelectedInstitution({value});
    updateRoomList(value);
    setFilters(null);
  };

  const {
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    searchAndFilter,
    setSearchInput
  } = useSearch([...roomList], ['name', 'institutionName']);

  const {
    pageCount,
    setFirstPage,
    setLastPage,
    setTotalPages,
    currentList,
    allAsProps,
    resetPagination,
    getIndex
  } = usePagination(roomList, loading ? 0 : totalNum);

  const [filteredList, setFilteredList] = useState([...roomList]);

  useEffect(() => {
    if (!loading && roomList.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [loading, roomList?.length]);

  const updateRoomList = (institutionId: string) => {
    const filteredByInstitution = filterBySearchQuery(institutionId, ['institutionId']);

    if (Boolean(filteredByInstitution)) {
      setFilteredList(filteredByInstitution);
      setSearchInput({...searchInput, isActive: true});
    } else {
      removeSearchAction();
    }
  };

  const searchRoom = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction();
    }
  };

  const [filters, setFilters] = useState<SortType | null>(null);

  const finalList = orderBy(
    searchInput.isActive ? filteredList : currentList,
    ['name', 'institutionName'],
    ['asc']
  );

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = roomList.filter((_d: any) => filterName === _d.status);
      setFilteredList(filtered);
      setFilters(filterName);
      setSelectedInstitution({});
    }
  };

  const match = useRouteMatch();

  const dataList = map(finalList, (item, index) => ({
    markRed: !Boolean(item?.activeSyllabus),
    no: getIndex(index),
    onClick: () => editCurrentRoom(item.id, item.institutionID),
    classroomName: (
      <div
        onClick={() => editCurrentRoom(item.id, item.institutionID)}
        className="w-auto  cursor-pointer">
        <Highlighted text={item?.name} highlight={searchInput.value} />
      </div>
    ),
    institutionName: (
      <div
        onClick={(e) => {
          e.stopPropagation();
          isSuperAdmin &&
            history.push(
              `/dashboard/manage-institutions/institution/${item.institution?.id}/edit?back=${match.url}`
            );
        }}>
        <Highlighted text={item?.institutionName} highlight={searchInput.value} />
      </div>
    ),
    teacher: `${item?.teacher?.firstName || ''} ${item?.teacher?.lastName || ''}`,
    course: (
      <div
        className="w-auto"
        onClick={() =>
          !item?.isCoteacher && editCurrentRoom(item.id, item.institutionID)
        }>
        {item?.curricula?.items
          ?.map((d: any) => {
            return d?.curriculum?.name;
          })
          .join(',') || '-'}
      </div>
    ),
    status: <Status useDefault status={item.status} />
  }));

  const tableConfig: ITableProps = {
    headers: [
      InstitueRomms[userLanguage]['NO'],
      InstitueRomms[userLanguage]['CLASSROOMS_NAME'],

      InstitueRomms[userLanguage]['INSTITUTION_NAME'],
      InstitueRomms[userLanguage]['TEACHER'],
      InstitueRomms[userLanguage]['CURRICULUM'],
      InstitueRomms[userLanguage]['STATUS']
    ],
    dataList,
    config: {
      dataList: {
        loading: loading,

        pagination: {
          showPagination: true,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  return (
    <PageLayout
      extra={
        <div className={`w-auto flex gap-x-4 justify-end items-center`}>
          {(isSuperAdmin || isAdmin || isBuilder) && (
            <InsitutionSelector
              selectedInstitution={selectedInstitution?.label}
              onChange={instituteChange}
            />
          )}
          <SearchInput
            dataCy="classroom-search-input"
            value={searchInput.value}
            onChange={setSearch}
            disabled={loading}
            onKeyDown={searchRoom}
            closeAction={() => {
              removeSearchAction();
            }}
          />

          {(!isSuperAdmin || !isAdmin || !isBuilder) && (
            <AddButton
              label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
              onClick={createNewRoom}
            />
          )}
        </div>
      }
      title={InstitueRomms[userLanguage]['TITLE']}>
      <div className="w-full">
        <Filters
          loading={loading}
          resetPagination={resetPagination}
          list={roomList}
          updateFilter={updateFilter}
          filters={filters}
          showingCount={{
            currentPage: allAsProps.currentPage,
            lastPage: allAsProps.lastPage,
            totalResults: allAsProps.totalResults,
            pageCount: allAsProps.pageCount
          }}
        />

        <Table {...tableConfig} />

        {messages.isError && (
          <p className={`text-center p-16 ${messages.isError ? 'text-red-600' : ''}`}>
            {messages.message}
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default RoomsList;
