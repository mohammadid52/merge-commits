import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Filters, {SortType} from '@components/Atoms/Filters';
import Highlighted from '@components/Atoms/Highlighted';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import Table from '@components/Molecules/Table';
import useAuth from '@customHooks/useAuth';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {withZoiqFilter} from '@utilities/functions';
import {getLocalStorageData} from '@utilities/localStorage';
import {ModelRoomFilterInput} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';
import {map, orderBy} from 'lodash';
import {Status} from '../../UserManagement/UserStatus';

interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId} = props;
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

  const [institutionList, setInstitutionList] = useState<any[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});

  const [messages, setMessages] = useState({
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

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions, {
          filter: withZoiqFilter({})
        })
      );
      setInstitutionList(
        list.data?.listInstitutions?.items?.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const {authId, isFellow, isTeacher, isSuperAdmin, isAdmin, isBuilder} = useAuth();

  const fetchRoomList = async () => {
    try {
      const filter: ModelRoomFilterInput =
        isFellow || isTeacher
          ? {
              teacherAuthID: {eq: authId}
            }
          : {};

      const assignedRoomsAsTeachers: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsDashboard, {
          filter: withZoiqFilter(filter, zoiqFilter)
        })
      );

      let assignedRoomsAsCoTeacher: any;

      if (isFellow || isTeacher) {
        assignedRoomsAsCoTeacher = await API.graphql(
          graphqlOperation(queries.listRoomCoTeachers, {
            filter: filter
          })
        );
      }

      const teachersList = assignedRoomsAsTeachers?.data?.listRooms?.items;
      const coTeachersList =
        isFellow || isTeacher
          ? assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items || []
          : [];

      // cause co teachers list return different data structure
      const updatedCoTeachersList = coTeachersList.map((coTeacher: any) => {
        const {room, teacher} = coTeacher;
        return {
          ...coTeacher,
          name: room?.name || '',
          status: teacher?.status || '',
          isCoteacher: true
        };
      });

      const merged = [...teachersList, ...updatedCoTeachersList];

      const updatedMerge = merged.map((room: any) => {
        return {
          ...room,
          institutionId: room.institution?.id,
          institutionName: room.institution?.name
        };
      });

      const totalListPages = Math.floor(merged.length / pageCount);

      setTotalPages(
        totalListPages * pageCount === merged.length ? totalListPages : totalListPages + 1
      );

      setTotalNum(merged.length);

      setFirstPage(true);
      setLastPage(!(merged.length > pageCount));

      setRoomList(updatedMerge);

      setLoading(false);
    } catch (e) {
      console.error(e);
      setMessages({
        show: true,
        message: InstitueRomms[userLanguage]['messages']['fetcherr'],
        isError: true
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instId === associateInstitute[0]?.institution?.id) {
      fetchRoomList();
    }
  }, [instId]);

  useEffect(() => {
    if (isSuperAdmin || isAdmin || isBuilder) {
      fetchInstitutions();
      fetchRoomList();
    }
  }, [isSuperAdmin]);

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
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
  }, [loading]);

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

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    removeSearchAction();
  };

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
        <Highlighted text={item.name} highlight={searchInput.value} />
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
        <Highlighted text={item.institutionName} highlight={searchInput.value} />
      </div>
    ),
    teacher: `${item.teacher?.firstName || ''} ${item.teacher?.lastName || ''}`,
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

  const tableConfig = {
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
      dark: false,

      headers: {textColor: 'text-white'},
      dataList: {
        loading,
        emptyText:
          searchInput.isActive && !searchInput.typing
            ? 'no data'
            : searchInput.isActive && searchInput.typing
            ? `Hit enter to search for ${searchInput.value}`
            : '',
        pagination: {
          showPagination: true,
          config: {
            allAsProps
          }
        },
        customWidth: {
          no: 'w-12'
        },
        maxHeight: '--',
        pattern: 'striped',
        patternConfig: {
          firstColor: 'bg-gray-100',
          secondColor: 'bg-gray-200'
        }
      }
    }
  };

  return (
    <div className="flex m-auto justify-center p-4 pt-0">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-center">
          <SectionTitleV3
            title={InstitueRomms[userLanguage]['TITLE']}
            fontSize="xl"
            fontStyle="semibold"
            extraClass="leading-6 text-gray-900"
            borderBottom
            shadowOff
            withButton={
              <div className={`w-auto flex gap-x-4 justify-end items-center flex-wrap`}>
                {(isSuperAdmin || isAdmin || isBuilder) && (
                  <Selector
                    dataCy="classroom-institution"
                    placeholder={InstitueRomms[userLanguage]['SELECT_INSTITUTION']}
                    list={institutionList}
                    selectedItem={selectedInstitution?.name}
                    onChange={instituteChange}
                    arrowHidden={true}
                    additionalClass={`w-60 ${
                      isSuperAdmin || isAdmin || isBuilder ? 'mr-4' : ''
                    }`}
                    isClearable
                    onClear={onInstitutionSelectionRemove}
                  />
                )}
                <SearchInput
                  dataCy="classroom-search-input"
                  value={searchInput.value}
                  onChange={setSearch}
                  isActive={searchInput.isActive}
                  disabled={loading}
                  onKeyDown={searchRoom}
                  closeAction={() => {
                    removeSearchAction();
                  }}
                  // style={`mr-4 w-auto md:w-40 lg:w-48 mb-8`}
                />
                {/* <Selector
                placeholder={InstitueRomms[userLanguage]['SELECT_STAFF']}
                list={staffList}
                selectedItem={selectedStaff?.name}
                onChange={handleStaffChange}
                arrowHidden={true}
                additionalClass={`w-auto md:w-52 lg:w-48 ${
                  isSuperAdmin || isAdmin || isBuilder ? 'mr-4' : ''
                }`}
                isClearable
                onClear={onStaffSelectionRemove}
              /> */}
                {/* </div> */}
                {(!isSuperAdmin || !isAdmin || !isBuilder) && (
                  <AddButton
                    label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                    onClick={createNewRoom}
                  />
                )}
              </div>
            }
          />
        </div>

        <Filters
          loading={loading}
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
    </div>
  );
};

export default RoomsList;
