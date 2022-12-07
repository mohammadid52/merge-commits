import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineUsergroupAdd
} from 'react-icons/ai';
import {IconContext} from 'react-icons/lib/esm/iconContext';
import {useHistory, useParams} from 'react-router-dom';

import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import * as customQueries from 'customGraphql/customQueries';
import * as queries from 'graphql/queries';

// import LessonLoading from '../../../Lesson/Loading/ComponentLoading';
import useGraphqlQuery from '@customHooks/useGraphqlQuery';
import useSearch from '@customHooks/useSearch';
import {ListPersonLocationsQueryVariables, PersonLocation, PersonStatus} from 'API';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import SearchInput from 'atoms/Form/SearchInput';
import Selector from 'atoms/Form/Selector';
import PageCountSelector from 'atoms/PageCountSelector';
import Pagination from 'atoms/Pagination';
import SectionTitle from 'atoms/SectionTitle';
import useDictionary from 'customHooks/dictionary';
import {createFilterToFetchSpecificItemsOnly} from 'utilities/strings';
import List from './List';
import UserListLoader from './UserListLoader';
import {useQuery} from '@customHooks/urlParam';

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

export const addName = (data: any[]) =>
  data.map((item: any) => ({
    ...item,
    name: `${item?.firstName} ${item?.lastName}`,
    _sortName: `${item?.firstName?.toLowerCase()} `
  }));

const UserLookup = ({isInInstitute, instituteId, isStudentRoster}: any) => {
  const {state, theme, dispatch, userLanguage, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const history = useHistory();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const {UserLookupDict, paginationPage, BreadcrumsTitles} = useDictionary(clientKey);

  const [sortingType, setSortingType] = useState({
    value: '',
    name: '',
    asc: true
  });

  // Below changes are for fetching entire list on client side.
  const [totalUserList, setTotalUserList] = useState([]);
  const [totalUserNum, setTotalUserNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // ...End.

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['PEOPLE'],
      url: '/dashboard/manage-users',
      last: true
    }
  ];

  const sortByList = [
    {id: 1, name: 'Name', value: 'lastName'},
    {id: 2, name: 'Role', value: 'role'},
    {id: 4, name: 'Status', value: 'status'}
  ];

  const goNextPage = () => {
    const pageHigherLimit = totalPages - 1;
    if (firstPage) {
      setFirstPage(false);
    }
    if (currentPage < pageHigherLimit - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === pageHigherLimit - 1) {
      setCurrentPage(currentPage + 1);
      setLastPage(true);
    }
  };

  const goPrevPage = () => {
    if (lastPage) {
      setLastPage(false);
    }
    if (currentPage > 0) setCurrentPage(currentPage - 1);
    else {
      setFirstPage(true);
    }
  };

  const handleLink = () => {
    history.push(
      `/dashboard/manage-institutions/institution/${instituteId}/register-user`
    );
  };

  // add this function to useEffect
  useEffect(() => {
    if (!loading && userList.length > 0) {
      const query = checkSearchQueryFromUrl();
      if (query) {
        const items = filterBySearchQuery(query);
        if (Boolean(items)) {
          setUserList(items);
        }
      }
    }
  }, [loading]);

  const searchUserFromList = () => {
    const searched = searchAndFilter(searchInput.value);

    if (Boolean(searched)) {
      setUserList(searched);
    } else {
      _removeSearchAction();
    }
  };

  useEffect(() => {
    if (state?.temp?.user?.id)
      dispatch({
        type: 'UPDATE_TEMP_USER',
        payload: {user: null}
      });
  }, [state?.temp?.user]);

  const setSortingValue = (str: string, name: string) => {
    setSortingType({
      ...sortingType,
      value: str,
      name: name
    });
  };

  const backToInitials = () => {
    setCurrentPage(0);
    currenPageUsers();
    setFirstPage(true);
    if (totalPages === 1) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  };
  const toggleSortDimention = () => {
    setSortingType({
      ...sortingType,
      asc: !sortingType.asc
    });
  };

  const _removeSearchAction = () => {
    backToInitials();
    removeSearchAction();
  };

  const {
    filterBySearchQuery,
    searchInput,
    checkSearchQueryFromUrl,
    removeSearchAction,
    setSearch,
    searchAndFilter,
    findRelatedSearch
  } = useSearch(totalUserList, ['name', 'email'], 'firstName');

  const fetchSortedList = () => {
    const newUserList = [...totalUserList].sort((a, b) =>
      a[sortingType.value]?.toLowerCase() > b[sortingType.value]?.toLowerCase() &&
      sortingType.asc
        ? 1
        : -1
    );
    setTotalUserList(newUserList);
  };

  const currenPageUsers = () => {
    const initialItem = currentPage * userCount;
    const updatedList = totalUserList.slice(initialItem, initialItem + userCount);
    setUserList(updatedList);
  };

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
        limit: 500,
        filter
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
      if (isTeacher) {
        try {
          const dashboardDataFetch: any = await API.graphql(
            graphqlOperation(customQueries.getTeacherLookUp, {
              filter: {teacherAuthID: {eq: teacherAuthID}}
            })
          );

          const response = await dashboardDataFetch;
          let arrayOfResponseObjects = response?.data?.listRooms?.items;
          arrayOfResponseObjects = arrayOfResponseObjects.map((item: any) => {
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
        }
      }
      if (isTeacher || isBuilder || isAdmin) {
        const staff: any = await API.graphql(
          graphqlOperation(customQueries.listStaffWithBasicInfo, {
            filter: {
              ...createFilterToFetchSpecificItemsOnly(
                state.user.associateInstitute.map((item: any) => item.institution.id),
                'institutionID'
              )
            }
          })
        );
        authIds = staff.data?.listStaff.items.map((staff: any) => staff.staffAuthID);
      }

      const authIdFilter: any = authIds.map((item: any) => {
        return {
          authId: {
            eq: item
          }
        };
      });

      if ((authIdFilter.length && (isTeacher || isBuilder || isAdmin)) || !isTeacher) {
        let users: any;
        let response: any;

        const dynamicFilter =
          isTeacher || isBuilder
            ? {
                or: [{role: {eq: 'ST'}}, {role: {eq: 'TR'}}, ...authIdFilter]
              }
            : {};
        users = await fetchAllPerson(dynamicFilter);
        response = users;
        const usersList = response;

        const totalListPages = Math.floor(usersList.length / userCount);
        if (totalListPages * userCount === usersList.length) {
          setTotalPages(totalListPages);
        } else {
          setTotalPages(totalListPages + 1);
        }

        setTotalUserList(sortByName(addName(usersList)));
        setTotalUserNum(usersList.length);
      }
      setLoading(false);
      setStatus('done');
    } catch (error) {
      console.error(error);
    }
  };

  const [classList, setClassList] = useState([]);

  const getAllClassStudentByClassId = async (
    filter: any,
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    let combined: any[];
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listClassStudentsForRoom, {
          limit: 500,
          nextToken: nextToken
        })
      );

      let returnedData = result.data.listClassStudents?.items;
      let NextToken = result.data.listClassStudents?.nextToken;

      combined = [...outArray, ...returnedData];

      // if (NextToken) {
      //   combined = await getAllClassStudentByClassId(filter, NextToken, combined);
      // }

      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
        error
      );
    }
  };

  const fetchStudentList = async () => {
    setLoading(true);

    try {
      // const classFilter = {
      //   filter: {
      //     classID: {
      //       attributeExists: true
      //     }
      //   }
      // };

      // const result = await getAllClassStudentByClassId(classFilter, undefined, []);

      const response: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForTeachers, {
          filter: {teacherAuthID: {eq: state.user.authId}}
        })
      );
      const assignedRoomsAsCoTeacher: any = await API.graphql(
        graphqlOperation(customQueries.getDashboardDataForCoTeachers, {
          filter: {teacherAuthID: {eq: state.user.authId}}
        })
      );

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
            students2.push({...student.student, classId: item.room.classID});
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

      let classIds: any[] = [];
      const uniqClasses = classes
        .filter((item: any) => {
          if (classIds.includes(item.id)) {
            return false;
          } else {
            classIds.push(item.id);
            return true;
          }
        })
        .sort((a: any, b: any) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

      // sort this list by name

      setClassList(uniqClasses);
      setTotalUserList(sortByName(addName(concated)));
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

  useEffect(() => {
    backToInitials();
  }, [totalUserList]);

  useEffect(() => {
    setCurrentPage(0);
    setFirstPage(true);
    setLastPage(false);
    const totalListPages = Math.floor(totalUserNum / userCount);
    if (userCount * totalListPages === totalUserNum) {
      setTotalPages(totalListPages);
    } else {
      setTotalPages(totalListPages + 1);
    }
    if (totalPages === 1 && totalListPages === 0) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [userCount]);

  useEffect(() => {
    currenPageUsers();
  }, [currentPage, totalUserNum, userCount]);

  useEffect(() => {
    if (totalPages === 1) {
      setFirstPage(true);
      setLastPage(true);
    }
  }, [totalPages]);

  useEffect(() => {
    fetchSortedList();
  }, [sortingType.value, sortingType.asc]);

  // if (status !== 'done') {
  // return <LessonLoading />;
  // }

  const getClassListForSelector = () => {
    return classList.map((item: any, idx) => {
      return {
        id: idx,
        value: item.id,
        name: item.name
      };
    });
  };

  const [selectedClass, setSelectedClass] = useState<any>(null);

  const fetchClassStudents = async (classId: string) => {
    try {
      setLoading(true);
      const classStudents: any = await API.graphql(
        graphqlOperation(queries.listClassUserLookup, {
          limit: 500,
          filter: {classID: {eq: classId}}
        })
      );

      const resp = classStudents.data.listClassStudents?.items;

      const students = resp.map((item: any) => item.student);
      const userList = sortByName(addName(students));
      setUserList(userList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setSelectedClassValue = (str: string, name: string) => {
    if (selectedClass === null || selectedClass?.value !== str) {
      setSelectedClass({
        ...selectedClass,
        value: str,
        name: name
      });

      removeSearchAction();
      fetchClassStudents(str).then((resp: any) => {});
    }
  };

  const headerForStudentRoster = () => {
    return loading
      ? '...'
      : selectedClass !== null
      ? userList?.length
      : totalUserList?.length;
  };

  const goToClassroom = () => {
    if (selectedClass !== null) {
      history.push(`/dashboard/lesson-planner/${selectedClass.value}`);
    }
  };

  return (
    <div className={`w-full h-full ${isInInstitute ? 'px-12' : ''}`}>
      {/* Header Section */}
      {!isInInstitute && <BreadCrums items={breadCrumsList} />}
      <div className="flex flex-col lg:flex-row justify-between mb-4 items-center">
        {isInInstitute ? (
          <h3 className="text-lg leading-6 text-gray-600 w-full lg:w-auto mb-4 lg:mb-0">
            {isStudentRoster ? `Your Students (${headerForStudentRoster()})` : 'Users'}
          </h3>
        ) : (
          <SectionTitle
            title={UserLookupDict[userLanguage]['title']}
            subtitle={UserLookupDict[userLanguage]['subtitle']}
          />
        )}
        <div
          className={
            isStudentRoster
              ? 'flex justify-end mb-4 items-center w-auto'
              : 'flex justify-end mb-4'
          }>
          {isStudentRoster && (
            <div className="w-auto relative flex mr-2 min-w-64">
              <Selector
                isClearable
                placeholder={'Select a class'}
                list={getClassListForSelector()}
                selectedItem={selectedClass?.name}
                setSelectedItem={setSelectedClass}
                onChange={setSelectedClassValue}
                disabled={loading}
                arrowHidden={true}
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
            dataCy="user-loookup-search"
            value={searchInput.value}
            onChange={setSearch}
            disabled={loading}
            onKeyDown={searchUserFromList}
            closeAction={_removeSearchAction}
            style={`mr-4 ${isInInstitute ? 'w-auto' : 'w-full'}`}
          />
          {!isInInstitute && (
            <>
              <Selector
                placeholder={UserLookupDict[userLanguage]['sortby']}
                list={sortByList}
                selectedItem={sortingType.name}
                onChange={setSortingValue}
                disabled={loading}
                btnClass="rounded-r-none  border-r-none "
                arrowHidden={true}
              />
              <button
                className={`w-28 bg-gray-100 mr-4 p-3 border-gray-400  border-0 rounded border-l-none rounded-l-none ${theme.outlineNone} `}
                onClick={toggleSortDimention}>
                <IconContext.Provider
                  value={{size: '1.5rem', color: theme.iconColor[themeColor]}}>
                  {sortingType.asc ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                </IconContext.Provider>
              </button>
            </>
          )}
          {state.user.role !== 'SUP' && (
            <Buttons
              label={UserLookupDict[userLanguage]['button']['add']}
              onClick={handleLink}
              btnClass={isInInstitute ? '' : 'mr-4 w-full'}
              Icon={AiOutlineUsergroupAdd}
            />
          )}
        </div>
      </div>

      {/* List / Table */}
      <div className="flex flex-col">
        <div className="-my-2 py-2">
          <div
            className={`${
              isInInstitute ? '' : 'white_back border-b-0 border-gray-200 py-4 mt-2'
            } mb-8 align-middle rounded-lg"`}>
            <div
              className={`h-8/10 w-screen lg:w-full overflow-x-scroll lg:overflow-x-hidden ${
                isInInstitute ? '' : 'px-4'
              }`}>
              <div className="w-full flex justify-between border-b-0 border-gray-200 ">
                <div className="w-4/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span>{UserLookupDict[userLanguage]['name']}</span>
                </div>
                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UserLookupDict[userLanguage]['flow']}</span>
                </div>
                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UserLookupDict[userLanguage]['role']}</span>
                </div>
                <div className="w-1/10 flex justify-center px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span className="w-auto">{UserLookupDict[userLanguage]['status']}</span>
                </div>
                <div className="w-2/10 px-8 justify-center py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  <span
                    title="see live updates of student's page"
                    className="flex items-end justify-center">
                    <span className="w-auto">
                      {UserLookupDict[userLanguage]['location']}
                    </span>
                    <div className="h-2 w-2 bg-green-500 ml-1 rounded-full self-start"></div>
                  </span>
                </div>
                {state.user.role !== 'ST' && state.user.role !== 'BLD' ? (
                  <div className="w-2/10 px-8 justify-center py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    {UserLookupDict[userLanguage]['action']}
                  </div>
                ) : null}
              </div>
              {loading ? (
                Array(10)
                  .fill(' ')
                  .map((_: any, index: number) => (
                    <Fragment key={index}>
                      <UserListLoader userRole={state.user.role} />
                    </Fragment>
                  ))
              ) : userList.length > 0 ? (
                userList.map((item: any, key: number) => (
                  <div key={key}>
                    <List
                      searchTerm={searchInput.value}
                      item={item}
                      idx={key}
                      key={key}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center p-16">
                  <p className="text-gray-500">
                    {searchInput.isActive && !searchInput.typing
                      ? ''
                      : searchInput.isActive && searchInput.typing
                      ? `Hit enter to search for ${searchInput.value}`
                      : UserLookupDict[userLanguage]['noresult']}
                    {searchInput.isActive && !searchInput.typing && (
                      <span>
                        No user found - <b>{searchInput.value}</b>. Try searching for "
                        <span
                          className="hover:underline theme-text cursor-pointer"
                          onClick={() => {
                            setSearch(findRelatedSearch(searchInput.value).firstName);
                          }}>
                          {findRelatedSearch(searchInput.value).firstName}
                        </span>
                        "
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination And Counter */}
            <div className={`flex justify-center ${isInInstitute ? '' : 'px-8 my-4'}`}>
              {!searchInput.isActive && selectedClass === null && (
                <Fragment>
                  <span className="py-3 px-5 w-auto flex-shrink-0 my-5 text-md leading-5 font-medium text-gray-900">
                    {paginationPage(userLanguage, currentPage, totalPages)}{' '}
                  </span>
                  <Pagination
                    currentPage={currentPage + 1}
                    setNext={goNextPage}
                    setPrev={goPrevPage}
                    firstPage={firstPage}
                    lastPage={lastPage}
                  />
                  <PageCountSelector
                    pageSize={userCount}
                    setPageSize={(c: number) => setUserCount(c)}
                  />
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookup;
