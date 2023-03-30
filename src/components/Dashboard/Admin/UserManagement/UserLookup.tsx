import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {AiOutlineUsergroupAdd} from 'react-icons/ai';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {useGlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';

import Filters from '@components/Atoms/Filters';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import UserLookupAction from '@components/MicroComponents/UserLookupAction';
import UserLookupLocation from '@components/MicroComponents/UserLookupLocation';
import UserLookupName from '@components/MicroComponents/UserLookupName';
import Table, {ITableProps} from '@components/Molecules/Table';
import useDictionary from '@customHooks/dictionary';
import usePagination from '@customHooks/usePagination';
import useSearch from '@customHooks/useSearch';
import {withZoiqFilter} from '@utilities/functions';
import {PersonStatus} from 'API';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import {map, orderBy, uniqBy} from 'lodash';
import moment from 'moment';
import {createFilterToFetchSpecificItemsOnly, getUserRoleString} from 'utilities/strings';
import UserLocation from './UserLocation';
import UserRole from './UserRole';
import UserStatus from './UserStatus';

export const sortByName = (data: any[]) => {
  return data.sort((a: any, b: any) => {
    if (a._sortName < b._sortName) {
      return -1;
    }
    if (a._sortName > b._sortName) {
      return 1;
    }
    return 0;
  });
};

export const addName = (data: any[]) => {
  return data.map((item: any) => ({
    ...item,
    name: `${item?.firstName} ${item?.lastName}`,
    _sortName: `${item?.firstName?.toLowerCase()} `
  }));
};

const UserLookup = ({isInInstitute, instituteId, isStudentRoster}: any) => {
  const {state, userLanguage, zoiqFilter} = useGlobalContext();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const {UserLookupDict, BreadcrumsTitles} = useDictionary();

  // Below changes are for fetching entire list on client side.
  const [totalUserList, setTotalUserList] = useState<any[]>([]);

  const [totalUserNum, setTotalUserNum] = useState(0);

  const {
    currentList,
    setCurrentList,
    allAsProps,
    setTotalPages,
    resetPagination,
    currentPage,
    getIndex
  } = usePagination(totalUserList || [], loading ? 0 : totalUserList.length);

  // ...End.

  const breadCrumsList = [
    {
      title: BreadcrumsTitles[userLanguage]['HOME'],
      href: '/dashboard',
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['PEOPLE'],
      href: '/dashboard/manage-users',
      last: true
    }
  ];

  const handleLink = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${instituteId}/register-user`
    );
  };

  useEffect(() => {
    if (!loading && currentList?.length > 0) {
      const query = checkSearchQueryFromUrl();

      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setFilteredList(items);
        }
      }
    }
  }, [loading, currentList?.length]);

  const searchUserFromList = () => {
    const searched = searchAndFilter(searchInput.value);

    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      _removeSearchAction();
    }
  };

  const _removeSearchAction = () => {
    resetPagination();
    removeSearchAction();
  };

  const {
    filterBySearchQuery,
    searchInput,
    setSearchInput,
    checkSearchQueryFromUrl,
    removeSearchAction,
    setSearch,
    searchAndFilter
  } = useSearch(totalUserList, ['name', 'email'], 'firstName');

  const getStudentsList = (data: any) => {
    let list: any[] = [];
    let uniqIds: string[] = [];
    data &&
      data.length > 0 &&
      data[0]?.class?.rooms?.items.forEach((item: any) => {
        item?.class?.students?.items.forEach((student: any) => {
          if (!uniqIds.includes(student.student.authId)) {
            list.push(student.student.authId);
            uniqIds.push(student.student.authId);
          }
        });
      });

    return list;
  };

  const getCoTeacherList = (data: any) => {
    let coTeachersList: any[] = [];
    let uniqIds: string[] = [];
    data &&
      data.length > 0 &&
      data.forEach((item: any) => {
        if (item?.class?.rooms?.items[0].coTeachers.items.length > 0) {
          item?.class?.rooms?.items[0].coTeachers.items.forEach((_item: any) => {
            if (!uniqIds.includes(_item.teacher.email)) {
              coTeachersList.push(_item.teacher);
              uniqIds.push(_item.teacher.email);
            }
          });
        }
      });

    return coTeachersList;
  };

  const getTeacherList = (data: any) => {
    return data && data.length > 0
      ? data.reduce((acc: any[], dataObj: any) => {
          const teacherObj = dataObj?.class?.rooms?.items[0]?.teacher;
          const teacherIsPresent = acc?.find(
            (teacher: any) =>
              teacher?.firstName === teacherObj?.firstName &&
              teacher?.lastName === teacherObj?.lastName
          );
          if (teacherIsPresent) {
            return acc;
          } else {
            return [...acc, teacherObj];
          }
        }, [])
      : [];
  };

  const fetchAllPerson = async (filter?: any) => {
    let resp: any = await API.graphql(
      graphqlOperation(queries.listPeople, {
        limit: SEARCH_LIMIT,

        filter: withZoiqFilter(filter, zoiqFilter)
      })
    );
    const users = resp?.data?.listPeople?.items;
    return users;
  };

  const fetchAllUsersList = async () => {
    const isTeacher = state.user.role === 'TR' || state.user.role === 'FLW';
    const isBuilder = state.user.role === 'BLD';
    const isAdmin = state.user.role === 'ADM';
    const teacherAuthID = state.user.authId;

    let authIds: any[] = [];
    try {
      setLoading(true);

      if (isTeacher || isBuilder || isAdmin) {
        let promises = [
          API.graphql(
            graphqlOperation(customQueries.listStaffWithBasicInfo, {
              filter: {
                ...createFilterToFetchSpecificItemsOnly(
                  state.user.associateInstitute.map((item: any) => item.institution.id),
                  'institutionID'
                )
              }
            })
          )
        ];

        if (isTeacher) {
          promises.push(
            API.graphql(
              graphqlOperation(customQueries.getTeacherLookUp, {
                filter: withZoiqFilter({teacherAuthID: {eq: teacherAuthID}}, zoiqFilter)
              })
            )
          );
        }

        const [staffData, dashboardData] = await Promise.all<any>([...promises]);

        authIds = staffData.data?.listStaff.items
          .map((staff: any) => staff && staff.staffAuthID)
          .filter(Boolean);

        if (isTeacher) {
          try {
            let arrayOfResponseObjects = dashboardData?.data?.listRooms?.items;
            arrayOfResponseObjects = arrayOfResponseObjects.map(() => {
              return {class: {rooms: {items: arrayOfResponseObjects}}};
            });

            const students = getStudentsList(arrayOfResponseObjects);
            const teachers = getTeacherList(arrayOfResponseObjects);
            const coTeachers = getCoTeacherList(arrayOfResponseObjects);

            authIds = authIds.concat(students);
            authIds = authIds.concat(teachers.map((d: any) => d.authId));
            authIds = authIds.concat(coTeachers.map((d: any) => d.authId));
          } catch (e) {
            console.error('getDashboardDataForTeachers -> ', e);
          } finally {
            // do somthing s
          }
        }
      }

      const authIdFilter = createFilterToFetchSpecificItemsOnly(authIds, 'authId');

      if ((authIdFilter.or.length && (isTeacher || isBuilder || isAdmin)) || !isTeacher) {
        let users: any;
        let response: any;

        let dynamicFilter =
          isTeacher || isBuilder
            ? {
                or: [{role: {eq: 'ST'}}, {role: {eq: 'TR'}}, ...authIdFilter.or]
              }
            : {};

        users = await fetchAllPerson(dynamicFilter);
        response = users;
        const usersList = response;

        const totalListPages = Math.floor(usersList.length / totalUserNum);
        if (totalListPages * totalUserNum === usersList.length) {
          setTotalPages(totalListPages);
        } else {
          setTotalPages(totalListPages + 1);
        }

        setTotalUserList(orderBy(addName(usersList), ['_sortName'], ['asc']));
        setTotalUserNum(usersList.length);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [classList, setClassList] = useState<any[]>([]);

  const fetchStudentList = async () => {
    setLoading(true);

    try {
      const [response, assignedRoomsAsCoTeacher] = await Promise.all<any>([
        API.graphql(
          graphqlOperation(customQueries.getDashboardDataForTeachers, {
            filter: withZoiqFilter({teacherAuthID: {eq: state.user.authId}}, zoiqFilter)
          })
        ),
        API.graphql(
          graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
            filter: {teacherAuthID: {eq: state.user.authId}}
          })
        )
      ]);
      let students1: any[] = [];
      let students2: any[] = [];

      let classes: any[] = [];

      response?.data?.listRooms?.items.forEach((item: any) => {
        classes.push(item.class);
        item?.class?.students?.items.forEach((student: any) => {
          // filter by role
          if (student?.student?.role === 'ST') {
            students1.push({...student.student, classId: item.classID});
          }
        });
      });

      assignedRoomsAsCoTeacher?.data?.listRoomCoTeachers?.items.forEach((item: any) => {
        classes.push(item.room.class);
        item?.room?.class?.students?.items.forEach((student: any) => {
          if (student?.student?.role === 'ST') {
            students2.push({
              ...student.student,
              classId: item.room.classID
            });
          }
        });
      });

      let ids: any[] = [];

      const concated = [...students1, ...students2].filter((item: any) => {
        if (ids.includes(item.authId)) {
          return false;
        } else {
          if (item.role === 'ST' && item.status !== PersonStatus.INACTIVE) {
            ids.push(item.authId);
            return true;
          } else {
            return false;
          }
        }
      });

      const uniqClasses = orderBy(uniqBy(classes, 'id'), ['name'], ['asc']);

      // sort this list by name

      setClassList(uniqClasses);

      setTotalUserList(orderBy(addName(concated), ['_sortName'], ['asc']));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStudentRoster) {
      fetchStudentList();
    } else {
      fetchAllUsersList();
    }
  }, [isStudentRoster]);

  const getClassListForSelector = () => {
    return classList.map((item: any, idx) => {
      return {
        id: idx,
        value: item.id,
        label: item.name
      };
    });
  };

  const [selectedClass, setSelectedClass] = useState<any>(null);

  const fetchClassStudents = async (classId: string) => {
    try {
      setLoading(true);
      const classStudents: any = await API.graphql(
        graphqlOperation(customQueries.listClassUserLookup, {
          limit: SEARCH_LIMIT,
          filter: {classID: {eq: classId}}
        })
      );

      const resp = classStudents.data.listClassStudents?.items;

      const students = resp.map((item: any) => item.student);
      const userList = sortByName(addName(students));
      setCurrentList(userList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedClassValue = (name: string) => {
    if (selectedClass === null || selectedClass?.value !== name) {
      setSelectedClass({
        ...selectedClass,
        value: name,
        name: name
      });

      removeSearchAction();
      fetchClassStudents(name).then(() => {});
    }
  };

  const headerForStudentRoster = () => {
    return loading
      ? '...'
      : selectedClass !== null
      ? currentList?.length
      : totalUserList?.length;
  };

  const goToClassroom = () => {
    if (selectedClass !== null) {
      history.push(`/dashboard/lesson-planner/${selectedClass.value}`);
    }
  };

  const [filters, setFilters] = useState<any>();

  const [filteredList, setFilteredList] = useState<any[]>([]);

  const finalList = searchInput.isActive ? filteredList : currentList;

  const dict = UserLookupDict[userLanguage];

  const match = useRouteMatch();

  const handleUserLink = (id: string) => {
    const {user} = state;

    if (isStudentRoster) {
      history.push(
        `/dashboard/manage-institutions/institution/${user.associateInstitute[0].institution.id}/manage-users/${id}?from=dashboard`
      );
    } else {
      const url = match.url.endsWith('/') ? match.url : match.url + '/';
      history.push(`${url}${id}`);
    }
  };

  const dataList = map(finalList, (item, idx) => ({
    no: getIndex(idx),
    onClick: () => handleUserLink(item.id),
    name: <UserLookupName searchTerm={searchInput.value} item={item} />,
    flow: <UserLocation role={item.role} onDemand={item?.onDemand} />,
    role: <UserRole role={item.role ? item.role : '--'} />,
    status: (
      <div className="w-auto flex justify-center flex-col">
        <UserStatus status={item.status ? item.status : '--'} />
        {item.status === PersonStatus.INACTIVE && item.inactiveStatusDate !== null && (
          <span className=" text-gray-600 pt-1 text-xs text-left -ml-4">
            Since {moment(item.inactiveStatusDate).format('ll')}
          </span>
        )}
      </div>
    ),
    location: <UserLookupLocation item={item} idx={idx} />,
    actions: state.user.role !== 'ST' && state.user.role !== 'BLD' && (
      <UserLookupAction item={item} />
    )
  }));

  const tableConfig: ITableProps = {
    headers: [
      'no',
      dict['name'],
      dict['flow'],
      dict['role'],
      dict['status'],
      dict['location'],
      state.user.role !== 'ST' && state.user.role !== 'BLD' && dict['action']
    ] as string[],
    dataList,
    config: {
      dataList: {
        loading,

        pagination: {
          showPagination: !searchInput.isActive && selectedClass === null,
          config: {
            allAsProps
          }
        }
      }
    }
  };

  const updateFilter = (filterName: any) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = totalUserList.filter(
        (_d: any) => filterName.toLowerCase() === getUserRoleString(_d.role).toLowerCase()
      );
      setFilteredList(filtered);
      setFilters(filterName);
    }
  };

  return (
    <div className="mb-2">
      {/* Header Section */}
      {!isInInstitute && <BreadCrums items={breadCrumsList} />}
      <div className="">
        <SectionTitleV3
          fontSize="xl"
          fontStyle="semibold"
          extraContainerClass="px-4"
          extraClass="leading-6 text-gray-900 uppercase"
          borderBottom
          shadowOff
          title={
            !isInInstitute
              ? UserLookupDict[userLanguage]['title']
              : isStudentRoster
              ? `Your Students (${headerForStudentRoster()})`
              : 'User List'
          }
          subtitle={isInInstitute ? null : UserLookupDict[userLanguage]['subtitle']}
          withButton={
            <div
              className={
                isStudentRoster
                  ? 'flex justify-end mb-4 gap-4 items-center w-auto'
                  : 'flex justify-end mb-4 gap-4 w-auto'
              }>
              {isStudentRoster && (
                <div className="w-auto relative flex mr-2 min-w-64">
                  <Selector
                    placeholder={'Select a class'}
                    list={getClassListForSelector()}
                    selectedItem={selectedClass?.name}
                    onChange={setSelectedClassValue}
                    disabled={loading}
                  />

                  {selectedClass !== null && (
                    <span
                      onClick={goToClassroom}
                      style={{bottom: '-1.5rem'}}
                      className="absolute text-center theme-text text-sm capitalize hover:theme-text:600 hover:underline cursor-pointer">
                      Go to classroom
                    </span>
                  )}
                </div>
              )}

              <SearchInput
                value={searchInput.value}
                onChange={setSearch}
                disabled={loading}
                onKeyDown={searchUserFromList}
                closeAction={_removeSearchAction}
              />

              {state.user.role !== 'SUP' && (
                <Buttons
                  label={UserLookupDict[userLanguage]['button']['add']}
                  onClick={handleLink}
                  Icon={AiOutlineUsergroupAdd}
                />
              )}
            </div>
          }
        />
      </div>

      {/* List / Table */}
      <div className="flex flex-col px-4 bg-white">
        <Filters
          loading={loading}
          list={currentList}
          resetPagination={resetPagination}
          updateFilter={updateFilter}
          filters={filters}
          customFilters={['ADMIN', 'BUILDER', 'FELLOW', 'STUDENT']}
          showingCount={{
            currentPage,
            lastPage: allAsProps.lastPage,
            totalResults: allAsProps.totalResults,
            pageCount: allAsProps.pageCount
          }}
        />

        <div className="">
          <div
            className={`${
              isInInstitute ? '' : 'white_back border-b-0 border-gray-200 py-4 mt-2'
            }`}>
            <Table {...tableConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookup;
