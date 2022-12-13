import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from 'react-router';

import Highlighted from '@components/Atoms/Highlighted';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import {getLocalStorageData} from '@utilities/localStorage';
import {ModelRoomFilterInput} from 'API';
import AddButton from 'atoms/Buttons/AddButton';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import Loader from 'atoms/Loader';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import * as queries from 'graphql/queries';
import {Status} from '../../UserManagement/UserStatus';
import {orderBy} from 'lodash';
import Buttons from '@components/Atoms/Buttons';

type SortType = 'ACTIVE' | 'TRAINING' | 'INACTIVE';

const Room = ({
  i,
  editCurrentRoom,
  item,
  searchInput
}: {
  i: number;
  searchInput?: string;
  editCurrentRoom?: (id: string, instId: string) => void;
  item?: any;
}) => {
  const {isSuperAdmin, isAdmin, isBuilder} = useAuth();
  const match = useRouteMatch();
  const history = useHistory();

  const commonClass = 'text-sm leading-4 font-medium whitespace-normal break-normal';

  return (
    <tr
      title="click to view/edit details"
      style={{cursor: 'pointer !important'}}
      className={`cursor-pointer hover:bg-gray-200
`}>
      <td className={''}>{i + 1}.</td>
      <td
        onClick={() => editCurrentRoom(item.id, item.institutionID)}
        className={`${commonClass}`}>
        <Highlighted text={item.name} highlight={searchInput} />
      </td>
      {(isSuperAdmin || isAdmin || isBuilder) && (
        <td
          className={commonClass}
          onClick={(e) => {
            e.stopPropagation();
            isSuperAdmin &&
              history.push(
                `/dashboard/manage-institutions/institution/${item.institution?.id}/edit?back=${match.url}`
              );
          }}>
          <Highlighted text={item.institutionName} highlight={searchInput} />
        </td>
      )}

      <td className={`${commonClass} text-gray-500`}>
        {item.teacher?.firstName || ''} {item.teacher?.lastName || ''}
      </td>

      {/* <td className=commonClass>
        {coTeachers.length > 0 ? (
          <Popover setShow={setShowPopover} content={content} show={showPopover}>
            See co teachers
          </Popover>
        ) : (
          '-'
        )}
      </td> */}

      <td
        onClick={() => !item?.isCoteacher && editCurrentRoom(item.id, item.institutionID)}
        className={`${commonClass} text-gray-500`}>
        {item?.curricula?.items
          ?.map((d: any) => {
            return d?.curriculum?.name;
          })
          .join(',') || '-'}
      </td>
      <td className={`${commonClass} text-gray-500`}>
        {/* <div className="w-auto md:w-32 lg:w-28">
    </div> */}

        <Status
          className={
            item.status?.toLowerCase() === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }>
          {item.status ? item.status : 'ACTIVE'}
        </Status>
      </td>
      {/* <td
    className={`text-indigo-600 text-s leading-4 font-medium whitespace-normal break-normal h-6 flex px-4 items-center cursor-pointer text-left py-2 ${theme.textColor[themeColor]}`}
    onClick={() => editCurrentRoom(item.id, item.institutionID)}>
    {InstitueRomms[userLanguage]['EDIT']}
  </td> */}
    </tr>
  );
};
interface RoomListProps {
  instId: string;
  instName: string;
}

const RoomsList = (props: RoomListProps) => {
  const {instId} = props;
  const {
    clientKey,
    state: {
      user: {isSuperAdmin, isAdmin, isBuilder, associateInstitute}
    },

    userLanguage
  } = useContext(GlobalContext);

  const history = useHistory();
  const {InstitueRomms} = useDictionary(clientKey);

  const [roomList, setRoomList] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [institutionList, setInstitutionList] = useState<any>([]);
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

  const fetchStaffOptions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listStaffOptions)
      );
      setStaffList(
        list.data.listStaff.items
          ?.filter(
            ({staffMember}: any) =>
              staffMember?.role === 'TR' || staffMember?.role === 'FLW'
          )
          .map(({staffMember, staffAuthID}: any) => ({
            id: staffAuthID,
            name: [staffMember?.firstName, staffMember?.lastName]
              .filter(Boolean)
              .join(' ')
          }))
          .sort((a: any, b: any) =>
            a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
          )
      );
    } catch (error) {}
  };

  const fetchInstitutions = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutionOptions)
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

  const {authId, isFellow, isTeacher} = useAuth();

  const fetchRoomList = async () => {
    try {
      const filter: ModelRoomFilterInput =
        isFellow || isTeacher
          ? {
              teacherAuthID: {eq: authId}
            }
          : {};
      const assignedRoomsAsTeachers: any = await API.graphql(
        graphqlOperation(customQueries.listRoomsDashboard, {filter: filter})
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

      setRoomList(updatedMerge);
      setAllRooms(updatedMerge);
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
      fetchStaffOptions();
    }
  }, [instId]);

  useEffect(() => {
    if (isSuperAdmin || isAdmin || isBuilder) {
      fetchInstitutions();
      fetchRoomList();
      fetchStaffOptions();
    }
  }, [isSuperAdmin]);

  const instituteChange = (_: string, name: string, value: string) => {
    setSelectedInstitution({name, id: value});
    updateRoomList(value);
  };

  const {
    searchInput,
    setSearch,
    checkSearchQueryFromUrl,
    filterBySearchQuery,
    removeSearchAction,
    searchAndFilter,
    setSearchInput,
    findRelatedSearch
  } = useSearch([...roomList], ['name', 'institutionName']);

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

  const [filters, setFilters] = useState<SortType>();

  const finalList = orderBy(
    searchInput.isActive ? filteredList : roomList,
    ['name', 'institutionName'],
    ['asc']
  );

  const onInstitutionSelectionRemove = () => {
    setSelectedInstitution({});
    setSearchInput({...searchInput, isActive: false});
    history.push(
      `/dashboard/manage-institutions/institution/${associateInstitute[0].institution.id}/class-rooms`
    );
    // onSearch(searchInput, '', '');
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

  return (
    <div className="flex m-auto justify-center p-4 pt-0 pl-md-12">
      <div className="">
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
                  closeAction={removeSearchAction}
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

        <div className="flex items-center justify-end">
          <div className="flex gap-x-4 mb-4 mt-2 items-center">
            <Buttons
              onClick={() => updateFilter('ACTIVE')}
              transparent={filters !== 'ACTIVE'}
              label={'Active'}
            />
            <Buttons
              onClick={() => updateFilter('INACTIVE')}
              transparent={filters !== 'INACTIVE'}
              label={'Inactive'}
            />
            <Buttons
              onClick={() => updateFilter('TRAINING')}
              transparent={filters !== 'TRAINING'}
              label={'Training'}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center mx-auto flex justify-center items-center w-full h-48">
            <div className="w-5/10">
              <Loader animation />
              <p className="mt-2 text-center text-lg text-gray-500">
                {InstitueRomms[userLanguage]['LOADING']}
              </p>
            </div>
          </div>
        ) : finalList.length ? (
          <div
            style={{maxHeight: '57vh'}}
            className="table-custom-responsive overflow-y-auto">
            <table className="border-collapse table-auto w-full table-hover table-striped">
              <thead className="thead-light">
                <tr>
                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['NO']}
                  </th>

                  <th
                    className={`bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}>
                    {InstitueRomms[userLanguage]['CLASSROOMS_NAME']}
                  </th>
                  {(isSuperAdmin || isAdmin || isBuilder) && (
                    <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      {InstitueRomms[userLanguage]['INSTITUTION_NAME']}
                    </th>
                  )}

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['TEACHER']}
                  </th>
                  {/* <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['CO_TEACHER']}
                  </th> */}

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['CURRICULUM']}
                  </th>

                  <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['STATUS']}
                  </th>

                  {/* <th className="bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {InstitueRomms[userLanguage]['ACTION']}
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {finalList.map((item: any, i: number) => {
                  return (
                    <Room
                      searchInput={searchInput.value}
                      item={item}
                      i={i}
                      key={i}
                      editCurrentRoom={editCurrentRoom}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Fragment>
            {(!isSuperAdmin || !isAdmin || !isBuilder) && (
              <div className="flex justify-center mt-8">
                <AddButton
                  className="mx-4"
                  label={InstitueRomms[userLanguage]['BUTTON']['ADD']}
                  onClick={createNewRoom}
                />
              </div>
            )}

            {messages.isError && (
              <p className={`text-center p-16 ${messages.isError ? 'text-red-600' : ''}`}>
                {messages.message}
              </p>
            )}
            <div className="text-center mt-4">
              <p className="text-gray-500">
                {searchInput.isActive && !searchInput.typing
                  ? ''
                  : searchInput.isActive && searchInput.typing
                  ? `Hit enter to search for ${searchInput.value}`
                  : ''}
                {searchInput.isActive && !searchInput.typing && (
                  <span>
                    No classroom found - <b>{searchInput.value}</b>.
                    {findRelatedSearch(searchInput.value).name && (
                      <span>
                        Try searching for "
                        <span
                          className="hover:underline theme-text cursor-pointer"
                          onClick={() => {
                            setSearch(findRelatedSearch(searchInput.value).name);
                          }}>
                          {findRelatedSearch(searchInput.value).name}
                        </span>
                        "
                      </span>
                    )}
                  </span>
                )}
              </p>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
